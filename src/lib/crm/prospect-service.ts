import {
  allLeads,
  createLead,
  createSavedSearch,
  listSavedSearches,
  recordLeadSource,
  updateLead
} from "@/lib/db/repo";
import {
  getProviderOrDefault,
  isFreeFirst,
  ProviderUnavailableError,
  type ProspectCandidate,
  type ProspectQuery
} from "@/lib/providers";
import { extractDomain, normalizePhone, normalizeText } from "@/lib/utils";
import { scoreLead, DEFAULT_WEIGHTS } from "@/lib/crm/scoring";
import type { Lead, LeadSourceOrigin, SavedSearch } from "@/lib/types";

export type DedupeKey = { domain?: string; phone?: string; nameCity?: string };

export function dedupeKeysOf(lead: Pick<Lead, "website" | "phone" | "companyName" | "city">): DedupeKey {
  const domain = extractDomain(lead.website ?? "") || undefined;
  const phone = normalizePhone(lead.phone ?? "");
  const nameCity =
    normalizeText(lead.companyName) && normalizeText(lead.city ?? "")
      ? `${normalizeText(lead.companyName)}|${normalizeText(lead.city ?? "")}`
      : undefined;
  return { domain, phone: phone.length >= 8 ? phone : undefined, nameCity };
}

export function buildKeyIndex(leads: Lead[]): Set<string> {
  const set = new Set<string>();
  for (const l of leads) {
    const k = dedupeKeysOf(l);
    if (k.domain) set.add(`d:${k.domain}`);
    if (k.phone) set.add(`p:${k.phone}`);
    if (k.nameCity) set.add(`n:${k.nameCity}`);
  }
  return set;
}

export function candidateKeys(c: ProspectCandidate): string[] {
  const keys: string[] = [];
  const domain = extractDomain(c.website ?? "");
  if (domain) keys.push(`d:${domain}`);
  const phone = normalizePhone(c.phone ?? "");
  if (phone.length >= 8) keys.push(`p:${phone}`);
  const nc =
    normalizeText(c.companyName) && normalizeText(c.city ?? "")
      ? `${normalizeText(c.companyName)}|${normalizeText(c.city ?? "")}`
      : "";
  if (nc) keys.push(`n:${nc}`);
  return keys;
}

export type SearchResultItem = ProspectCandidate & {
  alreadyInCrm: boolean;
  duplicateWithin: boolean;
  matchReason?: string;
};

export type ProspectSearchResult = {
  providerId: string;
  providerLabel: string;
  query: ProspectQuery;
  items: SearchResultItem[];
  total: number;
  /** Provedor gratuito selecionado por default (modo Free-First). */
  freeFirst: boolean;
  note?: string;
};

export async function runProspectSearch(query: ProspectQuery): Promise<ProspectSearchResult> {
  // Free-First: sem provedor explícito, resolve o gratuito default — nunca um pago.
  const provider = getProviderOrDefault(query.provider);
  if (provider.requiresApproval && !provider.configured()) {
    throw new ProviderUnavailableError(`${provider.label} não está configurado/habilitado.`);
  }

  const leads = await allLeads();
  const existing = buildKeyIndex(leads);
  const seenInSearch = new Set<string>();

  const raw = await provider.search(query);

  const items: SearchResultItem[] = raw.map((c) => {
    const keys = candidateKeys(c);
    const hitCrm = keys.find((k) => existing.has(k));
    const hitDup = keys.find((k) => seenInSearch.has(k));
    keys.forEach((k) => seenInSearch.add(k));
    return {
      ...c,
      alreadyInCrm: Boolean(hitCrm),
      duplicateWithin: Boolean(hitDup),
      matchReason: hitCrm
        ? `Já no CRM (${hitCrm.startsWith("d:") ? "mesmo domínio" : hitCrm.startsWith("p:") ? "mesmo telefone" : "mesmo nome e cidade"})`
        : hitDup
          ? "Repetido dentro do resultado da busca"
          : undefined
    };
  });

  return {
    providerId: provider.id,
    providerLabel: provider.label,
    query,
    items,
    total: items.length,
    freeFirst: isFreeFirst(),
    note: provider.note
  };
}

export type ImportReport = {
  created: Lead[];
  skipped: { companyName: string; reason: string }[];
  /** Quantos registros de procedência foram gravados (auditoria). */
  provenanceRecorded: number;
};

export type ImportOptions = {
  label?: string;
  /** Origem da criação: import | manual | form | seed. Default: import. */
  origin?: LeadSourceOrigin;
  /** Operador responsável (para auditoria). */
  actor?: string | null;
};

/**
 * Importa candidatos como leads. Nunca mescla: apenas relata duplicatas.
 *
 * Procedência OBRIGATÓRIA: candidato sem `source.provider` é recusado — um lead
 * sem origem é um dado não auditável (e não conformidade). Para cada lead criado,
 * grava um registro append-only em `lead_sources`.
 */
export async function importCandidates(
  candidates: ProspectCandidate[],
  opts: ImportOptions = {}
): Promise<ImportReport> {
  const leads = await allLeads();
  const existing = buildKeyIndex(leads);
  const created: Lead[] = [];
  const skipped: ImportReport["skipped"] = [];
  let provenanceRecorded = 0;

  for (const c of candidates) {
    const provider = (c.source?.provider ?? "").trim();
    if (!provider) {
      skipped.push({ companyName: c.companyName, reason: "Sem procedência: origem (provider) ausente." });
      continue;
    }

    const keys = candidateKeys(c);
    const dup = keys.find((k) => existing.has(k));
    if (dup) {
      skipped.push({
        companyName: c.companyName,
        reason: dup.startsWith("d:")
          ? "Domínio já cadastrado."
          : dup.startsWith("p:")
            ? "Telefone já cadastrado."
            : "Nome e cidade já cadastrados."
      });
      continue;
    }

    const lead = await createLead({
      companyName: c.companyName,
      tradeName: c.tradeName ?? null,
      category: c.category ?? null,
      segment: c.category ?? null,
      city: c.city ?? null,
      uf: c.uf ?? null,
      address: c.address ?? null,
      website: c.website ?? null,
      phone: c.phone ?? null,
      email: c.email ?? null,
      linkedin: c.linkedin ?? null,
      hypothesis: c.hypotheses[0] ?? null,
      stage: "identificado",
      priority: "media",
      tags: opts.label ? [opts.label] : [],
      source: c.source,
      verification: c.facts.length > 0 ? "parcial" : "nao_verificado",
      consent: false
    });

    // Trilha de procedência: só depois do lead existir (append-only, por lead).
    await recordLeadSource({
      leadId: lead.id,
      provider,
      providerId: c.source.providerId ?? null,
      url: c.source.url ?? null,
      collectedAt: c.source.collectedAt,
      note: c.source.note ?? null,
      origin: opts.origin ?? "import",
      actor: opts.actor ?? null
    });
    provenanceRecorded += 1;

    const { score, breakdown } = scoreLead(lead, DEFAULT_WEIGHTS);
    const withScore = await updateLead(lead.id, { score, scoreBreakdown: breakdown });
    created.push(withScore ?? lead);

    keys.forEach((k) => existing.add(k));
  }

  return { created, skipped, provenanceRecorded };
}

export async function saveSearch(input: Omit<SavedSearch, "id" | "createdAt">): Promise<SavedSearch> {
  return createSavedSearch(input);
}

export async function listSearches(): Promise<SavedSearch[]> {
  return listSavedSearches();
}
