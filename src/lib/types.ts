/**
 * SANLE — Modelo de domínio.
 * Uma única fonte de tipos para CRM, prospecção, IA e RAG.
 * O armazenamento pode ser Supabase (produção) ou local em arquivo (dev/gratuito);
 * os tipos abaixo são o contrato comum aos dois.
 */

export type ISODate = string;

/* ----------------------------- CRM / Leads ----------------------------- */

export type FunnelStage =
  | "identificado"
  | "a_pesquisar"
  | "qualificado"
  | "primeiro_contato"
  | "respondeu"
  | "reuniao"
  | "proposta_enviada"
  | "negociacao"
  | "ganho"
  | "perdido"
  | "sem_prioridade";

export const FUNNEL_STAGES: { id: FunnelStage; label: string; order: number }[] = [
  { id: "identificado", label: "Identificado", order: 0 },
  { id: "a_pesquisar", label: "A pesquisar", order: 1 },
  { id: "qualificado", label: "Qualificado", order: 2 },
  { id: "primeiro_contato", label: "Primeiro contato", order: 3 },
  { id: "respondeu", label: "Respondeu", order: 4 },
  { id: "reuniao", label: "Reunião", order: 5 },
  { id: "proposta_enviada", label: "Proposta enviada", order: 6 },
  { id: "negociacao", label: "Negociação", order: 7 },
  { id: "ganho", label: "Ganho", order: 8 },
  { id: "perdido", label: "Perdido", order: 9 },
  { id: "sem_prioridade", label: "Sem prioridade", order: 10 }
];

export type LeadPriority = "alta" | "media" | "baixa";
export type VerificationStatus = "nao_verificado" | "parcial" | "verificado" | "invalido";

/** Origem da informação — separa FATO de HIPÓTESE (exigência do prompt). */
export type EvidenceKind = "fact" | "hypothesis" | "unknown";

export type LeadSource = {
  provider: string; // osm | google_places | csv | manual | site | calculator | checklist
  providerId?: string | null;
  url?: string | null;
  collectedAt: ISODate;
  note?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
};

/**
 * Registro append-only de procedência (tabela `lead_sources`).
 * Responde, para cada lead: de onde veio o dado, sob qual identificador de origem,
 * quando foi coletado, por qual provedor e por qual operador — requisito de
 * auditoria, de deduplicação por origem e de conformidade (LGPD).
 *
 * Diferente de `Lead.source` (snapshot embutido no lead), esta trilha é imutável
 * e permite reconstruir a linhagem de cada registro sem tocar no lead.
 */
export type LeadSourceOrigin = "import" | "manual" | "form" | "seed";

export type LeadSourceRecord = {
  id: string;
  leadId: string;
  provider: string;
  providerId?: string | null;
  url?: string | null;
  collectedAt: ISODate;
  note?: string | null;
  origin: LeadSourceOrigin;
  actor?: string | null;
  createdAt: ISODate;
};

export type Lead = {
  id: string;
  companyName: string;
  tradeName?: string | null;
  category?: string | null;
  segment?: string | null; // nicho de interesse da Sanle
  city?: string | null;
  uf?: string | null;
  address?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  linkedin?: string | null;
  source: LeadSource;

  verification: VerificationStatus;
  lastVerifiedAt?: ISODate | null;

  hypothesis?: string | null; // hipótese de problema operacional (marcada como hipótese)
  notes?: string | null;

  stage: FunnelStage;
  priority: LeadPriority;
  owner?: string | null;
  tags: string[];

  // Contato (lead do site/diagnóstico)
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  problemDescription?: string | null;
  bottleneckStep?: string | null;
  volumeApprox?: string | null;
  currentSystem?: string | null;
  protocol?: string | null;
  consent: boolean;

  score?: number | null;
  scoreBreakdown?: ScoreFactor[] | null;

  nextAction?: string | null;
  nextActionAt?: ISODate | null;

  createdAt: ISODate;
  updatedAt: ISODate;
};

export type ScoreFactor = {
  key: string;
  label: string;
  weight: number;
  value: number; // 0..1
  points: number; // weight * value * 100
  rationale: string;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  kind:
    | "nota"
    | "mudanca_etapa"
    | "mensagem_gerada"
    | "mensagem_enviada"
    | "resposta"
    | "reuniao"
    | "proposta"
    | "sistema";
  summary: string;
  detail?: string | null;
  actor?: string | null;
  createdAt: ISODate;
};

export type OutreachChannel = "email" | "whatsapp" | "linkedin" | "ligacao" | "outro";
export type OutreachStatus =
  | "rascunho"
  | "revisao_pendente"
  | "aprovado"
  | "enviado_externamente"
  | "resposta_registrada"
  | "cancelado";

export type OutreachDraft = {
  id: string;
  leadId: string;
  kind: string;
  channel: OutreachChannel;
  subject?: string | null;
  body: string;
  editedBody?: string | null;
  status: OutreachStatus;
  owner?: string | null;
  result?: string | null;
  sources?: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type Reminder = {
  id: string;
  leadId?: string | null;
  title: string;
  dueAt: ISODate;
  done: boolean;
  createdAt: ISODate;
};

/* --------------------------- Conversas / IA ---------------------------- */

export type ConversationStatus = "aberta" | "aguardando_resposta" | "humano" | "encerrada";

export type Conversation = {
  id: string;
  channel: "site" | "interno" | "whatsapp" | "email" | "linkedin";
  status: ConversationStatus;
  leadId?: string | null;
  visitorLabel?: string | null;
  consent: boolean;
  summary?: string | null;
  needs?: string | null;
  nextAction?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type MessageRole = "user" | "assistant" | "system";

export type ConversationMessage = {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  sources?: string[] | null;
  confidence?: number | null;
  createdAt: ISODate;
};

export type AiRun = {
  id: string;
  kind: "chat_publico" | "chat_interno" | "qualificacao" | "mensagem" | "resumo" | "embedding";
  provider: string;
  model: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
  ok: boolean;
  error?: string | null;
  refId?: string | null;
  createdAt: ISODate;
};

/* ------------------------------ Conhecimento --------------------------- */

export type KnowledgeDocStatus = "rascunho" | "indexado" | "desatualizado" | "erro";

export type KnowledgeDocument = {
  id: string;
  title: string;
  category: string;
  content: string;
  status: KnowledgeDocStatus;
  version: number;
  updatedAt: ISODate;
  createdAt: ISODate;
};

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  ordinal: number;
  content: string;
  embedding: number[];
  embeddingModel: string;
};

/* ------------------------------ Integrações ---------------------------- */

export type IntegrationStatus = {
  id: string; // osm | google_places | llm | linkedin | whatsapp | email
  label: string;
  enabled: boolean;
  configured: boolean;
  requiresApproval?: boolean;
  note?: string;
  lastAttemptAt?: ISODate | null;
  lastSuccessAt?: ISODate | null;
  lastError?: string | null;
};

/* ------------------------------- Auditoria ----------------------------- */

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  target?: string | null;
  detail?: string | null;
  createdAt: ISODate;
};

export type SavedSearch = {
  id: string;
  label: string;
  city?: string | null;
  uf?: string | null;
  district?: string | null;
  category: string;
  terms?: string | null;
  limit: number;
  provider: string;
  createdAt: ISODate;
};

/* ------------------------------- Utilitários --------------------------- */

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const STAGE_LABELS: Record<FunnelStage, string> = Object.fromEntries(
  FUNNEL_STAGES.map((s) => [s.id, s.label])
) as Record<FunnelStage, string>;

export type PublicDiagnosticInput = {
  contactName: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  segment: string;
  problemDescription: string;
  bottleneckStep?: string;
  volumeApprox?: string;
  currentSystem?: string;
  consent: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  calculatorEstimate?: string;
};

export type AdminUserRole = "admin" | "operator" | "viewer";

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role: AdminUserRole;
  active: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
};

/* ------------------- Landing Inbound & Prospect Pages ------------------- */

export type InboundLeadStatus = "novo" | "em_atendimento" | "convertido" | "descartado";

export type LeadInbound = {
  id: string;
  createdAt: ISODate;
  nome: string;
  empresa: string;
  whatsapp: string;
  segmento: string;
  dorTexto?: string | null;
  consentimentoLgpd: boolean;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  prospectSlug?: string | null;
  status: InboundLeadStatus;
};

export type LandingEventRecord = {
  id: string;
  createdAt: ISODate;
  sessionId: string;
  evento: string;
  caminho: string;
  segmento?: string | null;
  prospectSlug?: string | null;
  meta: Record<string, unknown>;
};

export type ProspectPageRecord = {
  id: string;
  slug: string;
  leadId?: string | null;
  empresa: string;
  cidade: string;
  nicho: string;
  oportunidade?: string | null;
  createdAt: ISODate;
  expiresAt?: string | null;
};
