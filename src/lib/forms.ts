/**
 * SANLE — Schemas de formulário (client-safe) + helpers de validação inline.
 *
 * Este módulo é **isomórfico**: importável por Server Components, Route Handlers
 * e Client Components. Não contém `"use client"` de propósito — schemas são dados
 * puros e devem poder validar nos dois lados.
 *
 * Regra de ouro (ver `.agents/memoria/FORMULARIOS_ANALISE.md`):
 *   - `src/lib/schemas.ts` continua sendo a fonte AUTORITATIVA do servidor.
 *   - Este arquivo é a camada de UX: espelha os schemas do servidor com mensagens
 *     humanizadas em PT-BR, normalização de entrada e validações de formato que o
 *     servidor hoje não faz (telefone BR, site/URL). Nada aqui inventa integração.
 *   - Divergência client×server é proibida: toda regra adicionada aqui deve ser
 *     proposta para backport no `schemas.ts` (ver ADR-0017).
 *
 * Não altera nenhum arquivo existente: é base aditiva. Componentes passam a adotar
 * `validateForm()` + `<FormField>` incrementalmente.
 */
import { z } from "zod";
import {
  chatSchema,
  conversationReplySchema,
  diagnosticSchema,
  knowledgeSchema,
  leadCreateSchema,
  leadStageEnum,
  outreachSchema,
  reminderSchema
} from "@/lib/schemas";
import { FUNNEL_STAGES } from "@/lib/types";

/* ------------------------------------------------------------------ *
 * Helpers de validação e foco
 * ------------------------------------------------------------------ */

export type FieldErrors = Record<string, string>;

/** Converte um `ZodError` no mapa campo → mensagem consumido pelos formulários. */
export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const fields: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors };

/**
 * Valida valores de formulário e devolve `{ data }` ou `{ errors }` — a forma exata
 * que os componentes já usam (`setErrors`). Substitui validação ad-hoc por schema.
 */
export function validateForm<S extends z.ZodTypeAny>(
  schema: S,
  values: unknown
): ValidationResult<z.infer<S>> {
  const parsed = schema.safeParse(values);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: zodFieldErrors(parsed.error) };
}

/**
 * Devolve o `name`/`id` do primeiro campo inválido, respeitando a ordem visual do
 * formulário. Usado para mover o foco ao primeiro erro no submit (WCAG 2.2 / 3.3.1).
 */
export function firstErrorField(errors: FieldErrors, order: readonly string[]): string | undefined {
  if (errors._ || errors.consent) return errors.consent ? "consent" : undefined;
  return order.find((name) => Boolean(errors[name]));
}

/**
 * Move o foco para o controle do primeiro campo com erro. Tolera elementos ausentes
 * (ex.: campo condicional) sem lançar. A ser chamado após `setErrors` em um microtask.
 */
export function focusField(name: string | undefined): void {
  if (!name || typeof document === "undefined") return;
  const el = document.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"], #${CSS.escape(name)}`);
  el?.focus({ preventScroll: false });
}

/* ------------------------------------------------------------------ *
 * Validadores de formato reutilizáveis (propostos para backport no server)
 * ------------------------------------------------------------------ */

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/**
 * Telefone brasileiro opcional. Quando preenchido, exige 10 (fixo) ou 11 (celular)
 * dígitos após normalização — mesma mentalidade de `normalizePhone()` (`lib/utils.ts`).
 * Vazio é válido (campo opcional).
 */
export const brazilianPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || [10, 11].includes(onlyDigits(v).replace(/^55/, "").length), {
    message: "Informe um telefone válido com DDD (10 ou 11 dígitos)."
  });

/** Site/URL opcional. Aceita host sem protocolo; rejeita espaços e host vazio. */
export const webUrl = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (v === "") return true;
      try {
        const host = new URL(v.startsWith("http") ? v : `https://${v}`).hostname;
        return host.length > 2 && host.includes(".") && !/\s/.test(v);
      } catch {
        return false;
      }
    },
    { message: "Informe um endereço de site válido (ex.: https://empresa.com.br)." }
  );

/** UF opcional, sempre 2 letras maiúsculas quando preenchida. */
export const ufField = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .refine((v) => v === "" || /^[A-Z]{2}$/.test(v), { message: "UF deve ter 2 letras (ex.: DF)." });

/* ------------------------------------------------------------------ *
 * Schemas de formulário — Diagnóstico (site público)
 * ------------------------------------------------------------------ */

/**
 * Diagnóstico: reutiliza o schema autoritativo do servidor (fonte única) e adiciona
 * refine de telefone. O honeypot (`website`) permanece no contrato — o cliente o mantém
 * oculto/acessível por teclado apenas por `aria-hidden`+`tabIndex=-1` (não remove do DOM).
 */
export const diagnosticFormSchema = diagnosticSchema.superRefine((value, ctx) => {
  const phone = brazilianPhone.safeParse(value.contactPhone ?? "");
  if (!phone.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactPhone"],
      message: phone.error.issues[0]?.message ?? "Telefone inválido."
    });
  }
});
export type DiagnosticFormValues = z.infer<typeof diagnosticFormSchema>;

/** Ordem visual dos campos — usada para focar o primeiro erro. */
export const diagnosticFieldOrder = [
  "contactName",
  "companyName",
  "contactEmail",
  "contactPhone",
  "segment",
  "problemDescription",
  "bottleneckStep",
  "volumeApprox",
  "currentSystem",
  "consent"
] as const;

/* ------------------------------------------------------------------ *
 * Schemas de formulário — CRM
 * ------------------------------------------------------------------ */

/** Novo lead (painel). Reusa `leadCreateSchema` e humaniza os formatos opcionais. */
export const leadFormSchema = leadCreateSchema
  .extend({
    phone: brazilianPhone.optional().or(z.literal("")),
    website: webUrl.optional().or(z.literal("")),
    uf: ufField.optional().or(z.literal(""))
  })
  .superRefine((value, ctx) => {
    const email = (value.email ?? "").trim();
    if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["email"], message: "Informe um e-mail válido." });
    }
  });
export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const leadFieldOrder = [
  "companyName",
  "tradeName",
  "segment",
  "category",
  "city",
  "uf",
  "website",
  "phone",
  "email",
  "linkedin",
  "address",
  "priority",
  "stage",
  "hypothesis",
  "notes"
] as const;

/** Edição de lead (detalhe). Campos livres + ações de follow-up. */
export const leadEditFormSchema = z.object({
  tradeName: z.string().trim().max(160).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  segment: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  uf: ufField.optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  website: webUrl.optional().or(z.literal("")),
  phone: brazilianPhone.optional().or(z.literal("")),
  email: z.string().trim().max(160).optional().or(z.literal("")),
  linkedin: z.string().trim().max(240).optional().or(z.literal("")),
  hypothesis: z.string().trim().max(1000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  nextAction: z.string().trim().max(240).optional().or(z.literal("")),
  nextActionAt: z.string().trim().max(40).optional().or(z.literal("")),
  owner: z.string().trim().max(120).optional().or(z.literal(""))
});
export type LeadEditFormValues = z.infer<typeof leadEditFormSchema>;

/* ------------------------------------------------------------------ *
 * Schemas de formulário — Conhecimento, Prospecção, Assistente
 * ------------------------------------------------------------------ */

/** Documento da base RAG. */
export const knowledgeFormSchema = knowledgeSchema;
export const knowledgeFieldOrder = ["title", "category", "content"] as const;

/** Busca de prospecção. */
export const prospectSearchFormSchema = z.object({
  city: z.string().trim().min(2, "Informe a cidade.").max(80),
  uf: ufField.refine((v) => v.length === 2, { message: "Informe a UF (2 letras)." }),
  district: z.string().trim().max(80).optional().or(z.literal("")),
  category: z.string().trim().min(2, "Informe uma categoria.").max(120),
  terms: z.string().trim().max(160).optional().or(z.literal("")),
  limit: z.coerce.number().int().min(1, "Mínimo 1.").max(50, "Máximo 50.").default(20),
  provider: z.enum(["osm", "google_places", "csv", "manual"]).default("osm"),
  save: z.boolean().optional().default(false),
  label: z.string().trim().max(120).optional()
});
export type ProspectSearchFormValues = z.infer<typeof prospectSearchFormSchema>;
export const prospectSearchFieldOrder = ["city", "uf", "district", "category", "terms", "limit", "provider"] as const;

/* ------------------------------------------------------------------ *
 * Schemas de formulário — micro-interações do CRM
 * ------------------------------------------------------------------ */

/** Rascunho de abordagem (IA). */
export const outreachFormSchema = outreachSchema;
export const outreachFieldOrder = ["kind", "channel", "subject", "instructions"] as const;

/** Etapa canônica — evita string solta no cliente. */
export const stageField = leadStageEnum;
export const stageOptions = FUNNEL_STAGES;

/** Nota/atividade rápida. */
export const activityFormSchema = z.object({
  kind: z.enum(["nota", "mensagem_enviada", "resposta", "reuniao", "proposta"]).default("nota"),
  summary: z.string().trim().min(2, "Escreva a nota.").max(240)
});
export type ActivityFormValues = z.infer<typeof activityFormSchema>;

/** Lembrete. */
export const reminderFormSchema = reminderSchema.superRefine((value, ctx) => {
  if (!value.afterBusinessDays) {
    const when = new Date(value.dueAt);
    if (Number.isNaN(when.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dueAt"], message: "Informe uma data válida." });
    }
  }
});
export type ReminderFormValues = z.infer<typeof reminderFormSchema>;
export const reminderFieldOrder = ["title", "dueAt", "afterBusinessDays"] as const;

/** Resposta em conversa. */
export const replyFormSchema = conversationReplySchema;
export const replyFieldOrder = ["content"] as const;

/** Login do painel. */
export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres.").max(200)
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export const loginFieldOrder = ["email", "password"] as const;

/** Pergunta ao assistente interno. */
export const assistantFormSchema = z.object({
  leadId: z.string().trim().min(1, "Selecione um lead."),
  intent: z.string().trim().min(3, "Escreva a pergunta.").max(2000)
});
export type AssistantFormValues = z.infer<typeof assistantFormSchema>;

/** Chat público (validado também no servidor por `chatSchema`). */
export const chatFormSchema = chatSchema;
export const chatFieldOrder = ["message", "consent"] as const;
