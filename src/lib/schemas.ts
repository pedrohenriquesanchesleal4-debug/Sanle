import { z } from "zod";
import { FUNNEL_STAGES, type FunnelStage } from "@/lib/types";

const funnelIds = FUNNEL_STAGES.map((s) => s.id) as [FunnelStage, ...FunnelStage[]];

export const leadStageEnum = z.enum(funnelIds);

/** Formulário de diagnóstico do site público (coleta mínima). */
export const diagnosticSchema = z.object({
  contactName: z.string().trim().min(2, "Informe seu nome.").max(120),
  companyName: z.string().trim().min(2, "Informe o nome da empresa.").max(160),
  contactEmail: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(160),
  contactPhone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  segment: z.string().trim().min(2, "Selecione um segmento.").max(120),
  problemDescription: z
    .string()
    .trim()
    .min(20, "Descreva o problema com um pouco mais de detalhe (mín. 20 caracteres).")
    .max(4000),
  bottleneckStep: z.string().trim().max(200).optional().or(z.literal("")),
  volumeApprox: z.string().trim().max(120).optional().or(z.literal("")),
  currentSystem: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o contato para enviar." })
  }),
  // Rastreamento de origem de tráfego e campanha (UTM)
  utmSource: z.string().trim().max(100).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(100).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(100).optional().or(z.literal("")),
  utmContent: z.string().trim().max(100).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(100).optional().or(z.literal("")),
  referrer: z.string().trim().max(300).optional().or(z.literal("")),
  calculatorEstimate: z.string().trim().max(200).optional().or(z.literal("")),
  // honeypot anti-bot: deve permanecer vazio
  website: z.string().max(0).optional().or(z.literal(""))
});

export type DiagnosticInput = z.infer<typeof diagnosticSchema>;

/** Chat do assistente público. */
export const chatSchema = z.object({
  conversationId: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
  consent: z.boolean().optional().default(false)
});

/** Busca de prospecção. */
export const prospectSearchSchema = z.object({
  city: z.string().trim().min(2).max(80),
  uf: z.string().trim().length(2).toUpperCase(),
  district: z.string().trim().max(80).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(120),
  terms: z.string().trim().max(160).optional().or(z.literal("")),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  provider: z.enum(["osm", "google_places", "csv", "manual", "sanle_ai"]).default("osm"),
  save: z.boolean().optional().default(false),
  label: z.string().trim().max(120).optional()
});

export type ProspectSearchInput = z.infer<typeof prospectSearchSchema>;

export const leadCreateSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  tradeName: z.string().trim().max(160).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  segment: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  uf: z.string().trim().max(2).optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  website: z.string().trim().max(240).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().max(160).optional().or(z.literal("")),
  linkedin: z.string().trim().max(240).optional().or(z.literal("")),
  hypothesis: z.string().trim().max(1000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  priority: z.enum(["alta", "media", "baixa"]).default("media"),
  stage: leadStageEnum.default("identificado"),
  tags: z.array(z.string().trim().max(40)).max(12).optional().default([])
});

export const leadUpdateSchema = leadCreateSchema.partial().extend({
  nextAction: z.string().trim().max(240).optional().or(z.literal("")),
  nextActionAt: z.string().trim().max(40).optional().or(z.literal("")),
  owner: z.string().trim().max(120).optional().or(z.literal("")),
  verification: z.enum(["nao_verificado", "parcial", "verificado", "invalido"]).optional(),
  score: z.number().nullable().optional(),
  scoreBreakdown: z.any().optional()
});

export const outreachSchema = z.object({
  leadId: z.string().trim().min(1),
  kind: z.string().trim().min(2).max(80),
  channel: z.enum(["email", "whatsapp", "linkedin", "ligacao", "outro"]),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  instructions: z.string().trim().max(1000).optional().or(z.literal(""))
});

export const conversationReplySchema = z.object({
  conversationId: z.string().trim().min(1),
  content: z.string().trim().min(1).max(2000)
});

export const knowledgeSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(80),
  content: z.string().trim().min(20, "Documento muito curto.").max(60000)
});

export const weightsSchema = z.object({
  weights: z.record(z.number().min(0).max(5))
});

export const reminderSchema = z.object({
  leadId: z.string().trim().optional().or(z.literal("")),
  title: z.string().trim().min(3).max(200),
  dueAt: z.string().trim().min(4),
  afterBusinessDays: z.coerce.number().int().min(0).max(90).optional()
});

/** Remove HTML/scripts de campos livres (defesa em profundidade; React já escapa). */
export function sanitizeText(input: string): string {
  return input
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi, "")
    .replace(/on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

/** Candidato vindo do cliente para importação (validado e sanitizado no servidor). */
export const candidateSchema = z.object({
  externalId: z.string().trim().min(1).max(240),
  companyName: z.string().trim().min(1).max(200),
  tradeName: z.string().trim().max(200).nullable().optional(),
  category: z.string().trim().max(120).nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  city: z.string().trim().max(80).nullable().optional(),
  uf: z.string().trim().max(4).nullable().optional(),
  website: z.string().trim().max(300).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  email: z.string().trim().max(160).nullable().optional(),
  linkedin: z.string().trim().max(300).nullable().optional(),
  lat: z.number().nullable().optional(),
  lon: z.number().nullable().optional(),
  source: z.object({
    provider: z.string().trim().min(1).max(40),
    providerId: z.string().trim().max(240).nullable().optional(),
    url: z.string().trim().max(400).nullable().optional(),
    collectedAt: z.string().trim().min(4),
    note: z.string().trim().max(400).nullable().optional()
  }),
  facts: z.array(z.string().trim().max(300)).max(20).default([]),
  hypotheses: z.array(z.string().trim().max(300)).max(20).default([])
});

export const candidateImportSchema = z.object({
  candidates: z.array(candidateSchema).min(1).max(200),
  label: z.string().trim().max(120).optional()
});

export const InboundLeadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  empresa: z.string().trim().min(2, "Empresa deve ter pelo menos 2 caracteres").max(120),
  whatsapp: z
    .string()
    .trim()
    .min(10, "WhatsApp deve ter pelo menos 10 dígitos")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Telefone inválido"),
  segmento: z.string().trim().min(2).max(100),
  dorTexto: z.string().trim().max(1000).optional().nullable(),
  consentimentoLgpd: z.boolean().refine((val) => val === true, {
    message: "Consentimento LGPD é obrigatório"
  }),
  utmSource: z.string().trim().max(100).optional().nullable(),
  utmMedium: z.string().trim().max(100).optional().nullable(),
  utmCampaign: z.string().trim().max(100).optional().nullable(),
  prospectSlug: z.string().trim().max(100).optional().nullable(),
  hp: z.string().optional().nullable() // Honeypot contra robôs
});

export type InboundLeadInput = z.infer<typeof InboundLeadSchema>;

