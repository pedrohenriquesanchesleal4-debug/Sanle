import type { ProspectCandidate } from "./types";
import { extractDomain, normalizePhone, normalizeText } from "@/lib/utils";

/**
 * Normalização e deduplicação de candidatos DENTRO de um resultado de provedor.
 *
 * Diferente da deduplicação contra o CRM (que vive em `prospect-service`), aqui o
 * objetivo é limpar a saída bruta do provedor: o Overpass pode devolver o mesmo
 * estabelecimento como `node` e `way`, o CSV pode trazer a mesma empresa em duas
 * linhas. Sem isso o operador revisa lixo.
 *
 * Chaves de identidade (na ordem de força):
 *  - `x:` identificador de origem (provider/providerId) — determinístico;
 *  - `d:` domínio do site;
 *  - `p:` telefone normalizado (≥ 8 dígitos);
 *  - `n:` nome normalizado + cidade normalizada.
 */

export function candidateDedupeKeys(c: ProspectCandidate): string[] {
  const keys: string[] = [];
  const providerId = (c.source?.providerId ?? "").trim();
  if (providerId) keys.push(`x:${c.source.provider}:${providerId}`);

  const domain = extractDomain(c.website ?? "");
  if (domain) keys.push(`d:${domain}`);

  const phone = normalizePhone(c.phone ?? "");
  if (phone.length >= 8) keys.push(`p:${phone}`);

  const name = normalizeText(c.companyName ?? "");
  const city = normalizeText(c.city ?? "");
  if (name && city) keys.push(`n:${name}|${city}`);

  return keys;
}

/** Limpa campos de um candidato: trim, e-mail minúsculo, arrays únicos. */
export function normalizeCandidate(c: ProspectCandidate): ProspectCandidate {
  const unique = (arr: string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of arr) {
      const v = String(raw ?? "").trim();
      if (v && !seen.has(v)) {
        seen.add(v);
        out.push(v);
      }
    }
    return out;
  };

  return {
    ...c,
    companyName: c.companyName.trim(),
    tradeName: c.tradeName?.trim() || null,
    category: c.category?.trim() || null,
    address: c.address?.trim() || null,
    city: c.city?.trim() || null,
    uf: c.uf?.trim().toUpperCase() || null,
    website: c.website?.trim() || null,
    phone: c.phone?.trim() || null,
    email: c.email?.trim().toLowerCase() || null,
    linkedin: c.linkedin?.trim() || null,
    facts: unique(c.facts ?? []),
    hypotheses: unique(c.hypotheses ?? [])
  };
}

export type DedupeResult = {
  unique: ProspectCandidate[];
  removed: number;
};

/**
 * Deduplica uma lista de candidatos preservando a ordem de entrada.
 * `skipIdentity` permite pular a verificação contra o CRM (índice de chaves já visto).
 */
export function dedupeCandidates(candidates: ProspectCandidate[]): DedupeResult {
  const seen = new Set<string>();
  const unique: ProspectCandidate[] = [];

  for (const raw of candidates) {
    const c = normalizeCandidate(raw);
    if (!c.companyName) continue;
    const keys = candidateDedupeKeys(c);
    const duplicate = keys.some((k) => seen.has(k));
    if (duplicate) continue;
    keys.forEach((k) => seen.add(k));
    unique.push(c);
  }

  return { unique, removed: candidates.length - unique.length };
}
