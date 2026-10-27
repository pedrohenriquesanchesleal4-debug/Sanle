import { table, newId, nowISO, LocalTable, type Table } from "./adapter";
import type {
  Lead,
  LeadActivity,
  OutreachDraft,
  Reminder,
  Conversation,
  ConversationMessage,
  KnowledgeDocument,
  KnowledgeChunk,
  AiRun,
  AuditLog,
  SavedSearch,
  LeadSourceRecord,
  AdminUser,
  LeadInbound,
  LandingEventRecord,
  ProspectPageRecord,
  FunnelStage,
  Paginated
} from "@/lib/types";
import { FUNNEL_STAGES } from "@/lib/types";
import { normalizeText, extractDomain, normalizePhone } from "@/lib/utils";

/* ------------------------------- Leads ---------------------------------- */

export type LeadFilters = {
  q?: string;
  stage?: FunnelStage;
  segment?: string;
  city?: string;
  owner?: string;
  priority?: string;
  source?: string;
  page?: number;
  pageSize?: number;
  sort?: "recentes" | "nome" | "score" | "proxima_acao";
};

async function leadsTable(): Promise<Table<Lead>> {
  return table<Lead>("leads");
}

export async function allLeads(): Promise<Lead[]> {
  return (await leadsTable()).all();
}

export async function getLead(id: string): Promise<Lead | null> {
  return (await leadsTable()).get(id);
}

export async function listLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  const { q, stage, segment, city, owner, priority, source } = filters;
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, filters.pageSize ?? 20));

  let rows = await allLeads();

  if (q) {
    const nq = normalizeText(q);
    rows = rows.filter((l) =>
      [l.companyName, l.tradeName, l.contactName, l.contactEmail, l.city, l.segment, l.protocol, l.category]
        .filter(Boolean)
        .some((v) => normalizeText(String(v)).includes(nq))
    );
  }
  if (stage) rows = rows.filter((l) => l.stage === stage);
  if (segment) rows = rows.filter((l) => l.segment === segment);
  if (city) rows = rows.filter((l) => normalizeText(l.city ?? "") === normalizeText(city));
  if (owner) rows = rows.filter((l) => (l.owner ?? "") === owner);
  if (priority) rows = rows.filter((l) => l.priority === priority);
  if (source) rows = rows.filter((l) => l.source.provider === source);

  switch (filters.sort ?? "recentes") {
    case "nome":
      rows.sort((a, b) => a.companyName.localeCompare(b.companyName, "pt-BR"));
      break;
    case "score":
      rows.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      break;
    case "proxima_acao":
      rows.sort((a, b) => (a.nextActionAt ?? "9999").localeCompare(b.nextActionAt ?? "9999"));
      break;
    default:
      rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return { items: rows.slice(start, start + pageSize), total, page, pageSize, totalPages };
}

export async function createLead(
  input: Partial<Lead> & Pick<Lead, "companyName">
): Promise<Lead> {
  const ts = nowISO();
  const base: Omit<Lead, "id"> = {
    companyName: input.companyName,
    tradeName: input.tradeName ?? null,
    category: input.category ?? null,
    segment: input.segment ?? null,
    city: input.city ?? null,
    uf: input.uf ?? null,
    address: input.address ?? null,
    website: input.website ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    linkedin: input.linkedin ?? null,
    source: input.source ?? { provider: "manual", collectedAt: ts },
    verification: input.verification ?? "nao_verificado",
    lastVerifiedAt: input.lastVerifiedAt ?? null,
    hypothesis: input.hypothesis ?? null,
    notes: input.notes ?? null,
    stage: input.stage ?? "identificado",
    priority: input.priority ?? "media",
    owner: input.owner ?? null,
    tags: input.tags ?? [],
    contactName: input.contactName ?? null,
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
    problemDescription: input.problemDescription ?? null,
    bottleneckStep: input.bottleneckStep ?? null,
    volumeApprox: input.volumeApprox ?? null,
    currentSystem: input.currentSystem ?? null,
    protocol: input.protocol ?? null,
    consent: input.consent ?? false,
    score: input.score ?? null,
    scoreBreakdown: input.scoreBreakdown ?? null,
    nextAction: input.nextAction ?? null,
    nextActionAt: input.nextActionAt ?? null,
    createdAt: ts,
    updatedAt: ts
  };
  return (await leadsTable()).insert(base);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  return (await leadsTable()).update(id, { ...patch, updatedAt: nowISO() });
}

export async function deleteLead(id: string): Promise<void> {
  const t = await leadsTable();
  await t.remove(id);
  const acts = await table<LeadActivity>("activities");
  await acts.removeWhere((a) => a.leadId === id);
}

/* ----------------------------- Actividades ------------------------------ */

export async function addActivity(
  input: Omit<LeadActivity, "id" | "createdAt">
): Promise<LeadActivity> {
  return (await table<LeadActivity>("activities")).insert({ ...input, createdAt: nowISO() });
}

export async function listActivities(leadId: string): Promise<LeadActivity[]> {
  const rows = await (await table<LeadActivity>("activities")).all();
  return rows
    .filter((a) => a.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function recentActivities(limit = 12): Promise<LeadActivity[]> {
  const rows = await (await table<LeadActivity>("activities")).all();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/* -------------------------------- Drafts -------------------------------- */

export async function createDraft(
  input: Omit<OutreachDraft, "id" | "createdAt" | "updatedAt">
): Promise<OutreachDraft> {
  const ts = nowISO();
  return (await table<OutreachDraft>("drafts")).insert({ ...input, createdAt: ts, updatedAt: ts });
}

export async function updateDraft(id: string, patch: Partial<OutreachDraft>): Promise<OutreachDraft | null> {
  return (await table<OutreachDraft>("drafts")).update(id, { ...patch, updatedAt: nowISO() });
}

export async function getDraft(id: string): Promise<OutreachDraft | null> {
  return (await table<OutreachDraft>("drafts")).get(id);
}

export async function listDrafts(leadId?: string): Promise<OutreachDraft[]> {
  const rows = await (await table<OutreachDraft>("drafts")).all();
  const filtered = leadId ? rows.filter((d) => d.leadId === leadId) : rows;
  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ------------------------------ Reminders ------------------------------- */

export async function createReminder(
  input: Omit<Reminder, "id" | "createdAt" | "done">
): Promise<Reminder> {
  return (await table<Reminder>("reminders")).insert({ ...input, done: false, createdAt: nowISO() });
}

export async function listReminders(leadId?: string): Promise<Reminder[]> {
  const rows = await (await table<Reminder>("reminders")).all();
  const filtered = leadId ? rows.filter((r) => r.leadId === leadId) : rows;
  return filtered.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export async function updateReminder(id: string, patch: Partial<Reminder>): Promise<Reminder | null> {
  return (await table<Reminder>("reminders")).update(id, patch);
}

/* ----------------------------- Conversas -------------------------------- */

export async function createConversation(
  input: Partial<Conversation> & Pick<Conversation, "channel">
): Promise<Conversation> {
  const ts = nowISO();
  return (await table<Conversation>("conversations")).insert({
    channel: input.channel,
    status: input.status ?? "aberta",
    leadId: input.leadId ?? null,
    visitorLabel: input.visitorLabel ?? null,
    consent: input.consent ?? false,
    summary: input.summary ?? null,
    needs: input.needs ?? null,
    nextAction: input.nextAction ?? null,
    createdAt: ts,
    updatedAt: ts
  });
}

export async function getConversation(id: string): Promise<Conversation | null> {
  return (await table<Conversation>("conversations")).get(id);
}

export async function updateConversation(id: string, patch: Partial<Conversation>): Promise<Conversation | null> {
  return (await table<Conversation>("conversations")).update(id, { ...patch, updatedAt: nowISO() });
}

export async function listConversations(channel?: Conversation["channel"]): Promise<Conversation[]> {
  const rows = await (await table<Conversation>("conversations")).all();
  const filtered = channel ? rows.filter((c) => c.channel === channel) : rows;
  return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function addMessage(
  input: Omit<ConversationMessage, "id" | "createdAt">
): Promise<ConversationMessage> {
  const msg = await (await table<ConversationMessage>("messages")).insert({ ...input, createdAt: nowISO() });
  await updateConversation(input.conversationId, { updatedAt: nowISO() });
  return msg;
}

export async function listMessages(conversationId: string): Promise<ConversationMessage[]> {
  const rows = await (await table<ConversationMessage>("messages")).all();
  return rows
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/* ---------------------------- Conhecimento ------------------------------ */

export async function createKnowledgeDoc(
  input: Omit<KnowledgeDocument, "id" | "createdAt" | "updatedAt" | "version" | "status"> & {
    status?: KnowledgeDocument["status"];
  }
): Promise<KnowledgeDocument> {
  const ts = nowISO();
  return (await table<KnowledgeDocument>("knowledge")).insert({
    ...input,
    status: input.status ?? "rascunho",
    version: 1,
    createdAt: ts,
    updatedAt: ts
  });
}

export async function updateKnowledgeDoc(
  id: string,
  patch: Partial<KnowledgeDocument>
): Promise<KnowledgeDocument | null> {
  return (await table<KnowledgeDocument>("knowledge")).update(id, { ...patch, updatedAt: nowISO() });
}

export async function deleteKnowledgeDoc(id: string): Promise<void> {
  await (await table<KnowledgeDocument>("knowledge")).remove(id);
  await (await table<KnowledgeChunk>("chunks")).removeWhere((c) => c.documentId === id);
}

export async function getKnowledgeDoc(id: string): Promise<KnowledgeDocument | null> {
  return (await table<KnowledgeDocument>("knowledge")).get(id);
}

export async function listKnowledgeDocs(): Promise<KnowledgeDocument[]> {
  const rows = await (await table<KnowledgeDocument>("knowledge")).all();
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Substitui todos os chunks de um documento. Retorna as linhas inseridas (com
 * id) para que o chamador possa gravar `embedding_vec` logo em seguida — a
 * assinatura anterior (`Promise<void>`) é preservada: quem ignorava o retorno
 * continua funcionando sem mudança.
 */
export async function replaceChunks(
  documentId: string,
  chunks: Omit<KnowledgeChunk, "id">[]
): Promise<KnowledgeChunk[]> {
  const t = await table<KnowledgeChunk>("chunks");
  await t.removeWhere((c) => c.documentId === documentId);
  const inserted: KnowledgeChunk[] = [];
  for (const c of chunks) inserted.push(await t.insert(c));
  return inserted;
}

export async function listChunks(documentId?: string): Promise<KnowledgeChunk[]> {
  const rows = await (await table<KnowledgeChunk>("chunks")).all();
  return documentId ? rows.filter((c) => c.documentId === documentId) : rows;
}

/* -------------------------------- AiRuns -------------------------------- */

export async function logAiRun(input: Omit<AiRun, "id" | "createdAt">): Promise<AiRun> {
  return (await table<AiRun>("aiRuns")).insert({ ...input, createdAt: nowISO() });
}

export async function listAiRuns(limit = 50): Promise<AiRun[]> {
  const rows = await (await table<AiRun>("aiRuns")).all();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/* ------------------------------- Auditoria ------------------------------ */

export async function logAudit(input: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
  return (await table<AuditLog>("audits")).insert({ ...input, createdAt: nowISO() });
}

export async function listAudits(limit = 100): Promise<AuditLog[]> {
  const rows = await (await table<AuditLog>("audits")).all();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/* ----------------------------- Saved searches ---------------------------- */

export async function createSavedSearch(
  input: Omit<SavedSearch, "id" | "createdAt">
): Promise<SavedSearch> {
  return (await table<SavedSearch>("searches")).insert({ ...input, createdAt: nowISO() });
}

export async function listSavedSearches(): Promise<SavedSearch[]> {
  const rows = await (await table<SavedSearch>("searches")).all();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* --------------------------- Procedência (leads) ------------------------- */

/**
 * Trilha de procedência append-only. Cada lead criado no CRM ganha ao menos um
 * registro em `lead_sources` — a origem nunca é implícita.
 */
export async function recordLeadSource(
  input: Omit<LeadSourceRecord, "id" | "createdAt">
): Promise<LeadSourceRecord> {
  return (await table<LeadSourceRecord>("leadSources")).insert({ ...input, createdAt: nowISO() });
}

export async function listLeadSources(limit = 200): Promise<LeadSourceRecord[]> {
  const rows = await (await table<LeadSourceRecord>("leadSources")).all();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function listLeadSourcesForLead(leadId: string): Promise<LeadSourceRecord[]> {
  const rows = await (await table<LeadSourceRecord>("leadSources")).all();
  return rows
    .filter((r) => r.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ------------------------------- Dashboard ------------------------------ */

export type DashboardStats = {
  identificados: number;
  qualificados: number;
  contatados: number;
  respostas: number;
  reunioes: number;
  propostas: number;
  negociacoes: number;
  ganhos: number;
  semProximaAcao: number;
  aguardandoResposta: number;
  atividadesPeriodo: number;
  total: number;
  porEtapa: { stage: FunnelStage; label: string; count: number }[];
};

export async function dashboardStats(periodDays = 30): Promise<DashboardStats> {
  const [leads, activities, convs] = await Promise.all([
    allLeads(),
    (await table<LeadActivity>("activities")).all(),
    (await table<Conversation>("conversations")).all()
  ]);

  const order: Record<string, number> = Object.fromEntries(FUNNEL_STAGES.map((s) => [s.id, s.order]));
  const atLeast = (l: Lead, stage: FunnelStage) => (order[l.stage] ?? 0) >= (order[stage] ?? 0) && l.stage !== "perdido";

  const since = Date.now() - periodDays * 86400000;
  const periodActivities = activities.filter((a) => new Date(a.createdAt).getTime() >= since);

  return {
    identificados: leads.length,
    qualificados: leads.filter((l) => atLeast(l, "qualificado")).length,
    contatados: leads.filter((l) => atLeast(l, "primeiro_contato")).length,
    respostas: leads.filter((l) => atLeast(l, "respondeu")).length,
    reunioes: leads.filter((l) => atLeast(l, "reuniao")).length,
    propostas: leads.filter((l) => atLeast(l, "proposta_enviada")).length,
    negociacoes: leads.filter((l) => l.stage === "negociacao").length,
    ganhos: leads.filter((l) => l.stage === "ganho").length,
    semProximaAcao: leads.filter((l) => !l.nextAction && !["ganho", "perdido", "sem_prioridade"].includes(l.stage)).length,
    aguardandoResposta: convs.filter((c) => c.status === "aguardando_resposta").length,
    atividadesPeriodo: periodActivities.length,
    total: leads.length,
    porEtapa: FUNNEL_STAGES.map((s) => ({
      stage: s.id,
      label: s.label,
      count: leads.filter((l) => l.stage === s.id).length
    }))
  };
}

/* ------------------------------ Deduplicação ---------------------------- */

export type DuplicateReason = { reason: string; strength: "forte" | "fraca" };
export type DuplicateGroup = { lead: Lead; matches: { lead: Lead; reasons: DuplicateReason[] }[] };

/** Encontra possíveis duplicatas — nunca mescla automaticamente (revisão humana). */
export function findDuplicates(leads: Lead[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < leads.length; i++) {
    const a = leads[i]!;
    if (seen.has(a.id)) continue;
    const matches: DuplicateGroup["matches"] = [];

    for (let j = 0; j < leads.length; j++) {
      if (i === j) continue;
      const b = leads[j]!;
      const reasons: DuplicateReason[] = [];

      const idA = a.source.providerId;
      const idB = b.source.providerId;
      if (idA && idB && idA === idB) reasons.push({ reason: `mesmo identificador de origem (${idA})`, strength: "forte" });

      const domA = extractDomain(a.website ?? "");
      const domB = extractDomain(b.website ?? "");
      if (domA && domB && domA === domB) reasons.push({ reason: `mesmo domínio (${domA})`, strength: "forte" });

      const telA = normalizePhone(a.phone ?? "");
      const telB = normalizePhone(b.phone ?? "");
      if (telA.length >= 8 && telA === telB) reasons.push({ reason: "mesmo telefone", strength: "forte" });

      const nomA = normalizeText(a.companyName);
      const nomB = normalizeText(b.companyName);
      if (nomA && nomA === nomB)
        reasons.push({
          reason: `mesmo nome normalizado${a.city && b.city && normalizeText(a.city) === normalizeText(b.city) ? " e cidade" : ""}`,
          strength: a.city && b.city && normalizeText(a.city) === normalizeText(b.city) ? "forte" : "fraca"
        });

      if (reasons.length) matches.push({ lead: b, reasons });
    }

    if (matches.length) {
      seen.add(a.id);
      matches.forEach((m) => seen.add(m.lead.id));
      groups.push({ lead: a, matches });
    }
  }
  return groups;
}

/* ---------------------------- Admin Users ------------------------------- */

async function adminUsersTable(): Promise<Table<AdminUser>> {
  return table<AdminUser>("adminUsers");
}

export async function isAdminUser(email: string): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const all = await (await adminUsersTable()).all();
  return all.some((u) => u.email.trim().toLowerCase() === normalized && u.active);
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const all = await (await adminUsersTable()).all();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAdminUser(id: string): Promise<AdminUser | null> {
  return (await adminUsersTable()).get(id);
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();
  const all = await (await adminUsersTable()).all();
  return all.find((u) => u.email.trim().toLowerCase() === normalized) ?? null;
}

export async function createAdminUser(input: {
  email: string;
  name?: string | null;
  role?: AdminUser["role"];
  active?: boolean;
}): Promise<AdminUser> {
  const ts = nowISO();
  const base: Omit<AdminUser, "id"> = {
    email: input.email.trim().toLowerCase(),
    name: input.name?.trim() || null,
    role: input.role ?? "admin",
    active: input.active ?? true,
    createdAt: ts,
    updatedAt: ts
  };
  return (await adminUsersTable()).insert(base);
}

export async function updateAdminUser(
  id: string,
  patch: Partial<Omit<AdminUser, "id" | "createdAt">>
): Promise<AdminUser | null> {
  const cleanPatch: Partial<AdminUser> = { ...patch, updatedAt: nowISO() };
  if (cleanPatch.email) cleanPatch.email = cleanPatch.email.trim().toLowerCase();
  return (await adminUsersTable()).update(id, cleanPatch);
}

export async function deleteAdminUser(id: string): Promise<void> {
  return (await adminUsersTable()).remove(id);
}

/* ----------------------- Inbound Leads & Events ----------------------- */

async function leadsInboundTable(): Promise<Table<LeadInbound>> {
  return table<LeadInbound>("leadsInbound");
}

async function landingEventsTable(): Promise<Table<LandingEventRecord>> {
  return table<LandingEventRecord>("landingEvents");
}

async function prospectPagesTable(): Promise<Table<ProspectPageRecord>> {
  return table<ProspectPageRecord>("prospectPages");
}

export async function createInboundLead(input: {
  nome: string;
  empresa: string;
  whatsapp: string;
  segmento: string;
  dorTexto?: string | null;
  consentimentoLgpd?: boolean;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  prospectSlug?: string | null;
}): Promise<{ inbound: LeadInbound; lead: Lead }> {
  const ts = nowISO();
  const inboundBase: Omit<LeadInbound, "id"> = {
    nome: input.nome.trim(),
    empresa: input.empresa.trim(),
    whatsapp: input.whatsapp.trim(),
    segmento: input.segmento.trim(),
    dorTexto: input.dorTexto?.trim() || null,
    consentimentoLgpd: input.consentimentoLgpd ?? true,
    utmSource: input.utmSource?.trim() || null,
    utmMedium: input.utmMedium?.trim() || null,
    utmCampaign: input.utmCampaign?.trim() || null,
    prospectSlug: input.prospectSlug?.trim() || null,
    status: "novo",
    createdAt: ts
  };

  const inbound = await (await leadsInboundTable()).insert(inboundBase);

  // Integração Sales Hunter: cria o Lead correspondente no CRM
  const leadBase: Omit<Lead, "id"> = {
    companyName: input.empresa.trim(),
    contactName: input.nome.trim(),
    contactPhone: input.whatsapp.trim(),
    segment: input.segmento.trim(),
    source: {
      provider: "site",
      collectedAt: ts,
      utmSource: input.utmSource?.trim() || null,
      utmMedium: input.utmMedium?.trim() || null,
      utmCampaign: input.utmCampaign?.trim() || null,
      note: `Capturado via Landing Inbound (ID: ${inbound.id})`
    },
    verification: "parcial",
    stage: "identificado",
    priority: "alta",
    tags: ["inbound_landing", input.segmento.trim()],
    problemDescription: input.dorTexto?.trim() || null,
    consent: input.consentimentoLgpd ?? true,
    createdAt: ts,
    updatedAt: ts
  };

  const lead = await (await leadsTable()).insert(leadBase);

  // Registra atividade no lead
  await addActivity({
    leadId: lead.id,
    kind: "sistema",
    summary: "Lead inbound capturado na landing page",
    detail: `Empresa: ${input.empresa} | Contato: ${input.nome} | Tel: ${input.whatsapp} | Segmento: ${input.segmento}`
  });

  return { inbound, lead };
}

export async function listInboundLeads(): Promise<LeadInbound[]> {
  const all = await (await leadsInboundTable()).all();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function countInboundLeads(): Promise<number> {
  return (await leadsInboundTable()).count();
}

export async function recordLandingEvent(input: {
  sessionId: string;
  evento: string;
  caminho: string;
  segmento?: string | null;
  prospectSlug?: string | null;
  meta?: Record<string, unknown>;
}): Promise<LandingEventRecord> {
  const ts = nowISO();
  const base: Omit<LandingEventRecord, "id"> = {
    sessionId: input.sessionId,
    evento: input.evento,
    caminho: input.caminho,
    segmento: input.segmento ?? null,
    prospectSlug: input.prospectSlug ?? null,
    meta: input.meta ?? {},
    createdAt: ts
  };
  return (await landingEventsTable()).insert(base);
}

export async function listLandingEvents(limit = 100): Promise<LandingEventRecord[]> {
  const all = await (await landingEventsTable()).all();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function countLandingEvents(): Promise<number> {
  return (await landingEventsTable()).count();
}

export async function createProspectPage(input: {
  slug: string;
  leadId?: string | null;
  empresa: string;
  cidade?: string;
  nicho: string;
  oportunidade?: string | null;
}): Promise<ProspectPageRecord> {
  const ts = nowISO();
  const base: Omit<ProspectPageRecord, "id"> = {
    slug: input.slug.trim().toLowerCase(),
    leadId: input.leadId ?? null,
    empresa: input.empresa.trim(),
    cidade: input.cidade?.trim() || "Brasília",
    nicho: input.nicho.trim(),
    oportunidade: input.oportunidade?.trim() || null,
    createdAt: ts,
    expiresAt: null
  };
  try {
    return await (await prospectPagesTable()).insert(base);
  } catch (err) {
    console.warn("[createProspectPage] Falha na tabela principal, gravando em LocalTable:", err);
    return await new LocalTable<ProspectPageRecord>("prospectPages").insert(base);
  }
}

export async function getProspectPageBySlug(slug: string): Promise<ProspectPageRecord | null> {
  const normalized = slug.trim().toLowerCase();
  try {
    const all = await (await prospectPagesTable()).all();
    const found = all.find((p) => p.slug.trim().toLowerCase() === normalized);
    if (found) return found;
  } catch {
    // Continua para o fallback local
  }
  const local = await new LocalTable<ProspectPageRecord>("prospectPages").all();
  return local.find((p) => p.slug.trim().toLowerCase() === normalized) ?? null;
}

export async function listProspectPages(): Promise<ProspectPageRecord[]> {
  const all = await (await prospectPagesTable()).all();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export { newId };

