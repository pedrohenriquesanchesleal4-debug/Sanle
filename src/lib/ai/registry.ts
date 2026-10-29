import { env } from "@/lib/env";
import { openaiAdapter, openaiCompatibleAdapter } from "./adapters/openai-compatible";
import { anthropicAdapter } from "./adapters/anthropic";
import type { LLMAdapter, LLMDescriptor, LLMProviderId, LLMPurpose } from "./types";

/**
 * Registry de provedores de LLM — SERVER-ONLY (importa `env`).
 *
 * Espelha o padrão de `@/lib/providers` (leads): um único ponto de verdade para
 * "quem existe", "quem está configurado" e "qual adapter usar". Completar com um
 * provedor novo = registrar um adapter aqui, nada mais muda.
 *
 * NENHUM componente client importa este arquivo; o alias público é `./types`.
 */

const ADAPTERS: Record<LLMProviderId, LLMAdapter> = {
  openai: openaiAdapter,
  anthropic: anthropicAdapter,
  openai_compatible: openaiCompatibleAdapter,
  // `local` não é um adapter HTTP: significa "sem provedor remoto" e é resolvido
  // pelo fallback determinístico do assistente (ver `hasLLM`).
  local: { ...openaiCompatibleAdapter, id: "local", label: "Local (sem rede)", note: "Sem provedor remoto: o assistente usa o motor determinístico." }
};

/** Id de provedor declarado no env, saneado para o enum conhecido. */
export function configuredProviderId(): LLMProviderId | null {
  const raw = env.ai.provider.trim().toLowerCase();
  if (!raw) return null;
  if (raw === "openai" || raw === "anthropic" || raw === "openai_compatible" || raw === "local") return raw;
  // Nomes comuns que mapeiam para OpenAI-compatível (endpoint `/v1`).
  if (raw === "gemini" || raw === "google" || raw === "openrouter" || raw === "groq" || raw === "together" || raw === "ollama" || raw === "lmstudio") {
    return "openai_compatible";
  }
  return null;
}

/**
 * Resolve o adapter para a chamada. Anthropic tem adapter próprio; o resto usa o
 * endpoint OpenAI-compatível. Provedor desconhecido → `openai_compatible`
 * (o mais permissivo), porque a chave já foi validada por `env.ai.configured`.
 */
export function resolveAdapter(): LLMAdapter {
  const id = configuredProviderId();
  if (id === "anthropic") return anthropicAdapter;
  if (id === "local") return ADAPTERS.local;
  if (id === "openai") return openaiAdapter;
  return openaiCompatibleAdapter;
}

/**
 * Roteamento de modelo por finalidade (custo × qualidade):
 *  - `public`   → modelo econômico (o visitante faz muitas perguntas curtas);
 *  - `admin`    → modelo de qualidade (analisa dados do CRM, decisões);
 *  - `outreach` → modelo econômico (rascunho de mensagem);
 *  - `diagnostic` → econômico.
 * Se um modelo específico não estiver configurado, ambos caem no `model` base.
 */
export function modelForPurpose(purpose: LLMPurpose = "public"): string {
  switch (purpose) {
    case "admin":
      return env.ai.adminModel;
    case "public":
    case "outreach":
    case "diagnostic":
    default:
      return env.ai.publicModel;
  }
}

/** true somente quando há provedor remoto E chave — o gatilho do fallback determinístico. */
export function isLLMConfigured(): boolean {
  return env.ai.configured && configuredProviderId() !== null && configuredProviderId() !== "local";
}

export function llmConfig(): { provider: string; model: string; publicModel: string; adminModel: string } {
  return {
    provider: env.ai.configured ? env.ai.provider : "deterministico",
    model: env.ai.model,
    publicModel: env.ai.publicModel,
    adminModel: env.ai.adminModel
  };
}

/** Descrição serializável (sem segredos) de cada provedor de LLM — para UI/API. */
export function llmDescriptors(): LLMDescriptor[] {
  const active = configuredProviderId();
  return (["openai", "anthropic", "openai_compatible", "local"] as LLMProviderId[]).map((id) => {
    const a = ADAPTERS[id];
    const configured = id === "local" ? !isLLMConfigured() : active === id;
    return {
      id,
      label: a.label,
      configured,
      enabled: configured,
      serverOnly: true,
      capabilities: a.capabilities,
      note: a.note
    };
  });
}

export * from "./types";
