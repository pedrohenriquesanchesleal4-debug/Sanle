import { env } from "@/lib/env";
import { checkBudget, estimateInputTokens, recordUsage } from "./budget";
import { isLLMConfigured, modelForPurpose, resolveAdapter } from "./registry";
import type { ChatMessage, LLMRequestOptions, LLMResult } from "./types";

/**
 * Façade de IA — mantém o contrato público original (`ChatMessage`, `LLMResult`,
 * `hasLLM`, `llmInfo`, `complete`) e delega a resolução de provedor ao registry.
 *
 * Nenhuma chave vive no frontend. Sem provedor configurado, `complete` responde
 * `ok:false` com `error: "SEM_PROVIDER"` — o assistente então usa o fallback
 * determinístico (nunca deixa o modelo alucinar contexto vazio).
 *
 * `complete` ganhou um 2º argumento OPCIONAL (`opts`): compatível com todos os
 * chamadores existentes (`complete(messages)` continua válido).
 */

export type { ChatMessage, LLMResult } from "./types";
export type { LLMRequestOptions, LLMPurpose } from "./types";

export function hasLLM(): boolean {
  return isLLMConfigured();
}

export function llmInfo(): { provider: string; model: string } {
  if (!env.ai.configured) return { provider: "deterministico", model: "sanle-retrieval-v1" };
  return { provider: env.ai.provider, model: env.ai.model };
}

export async function complete(messages: ChatMessage[], opts: LLMRequestOptions = {}): Promise<LLMResult> {
  if (!isLLMConfigured()) {
    return { text: "", provider: "deterministico", model: "sanle-retrieval-v1", ok: false, error: "SEM_PROVIDER" };
  }

  const adapter = resolveAdapter();
  const model = opts.model ?? modelForPurpose(opts.purpose);
  const inputTokens = estimateInputTokens(messages);
  const maxOutputTokens = opts.maxOutputTokens ?? env.ai.maxOutputTokens;

  const decision = checkBudget(model, inputTokens, maxOutputTokens);
  if (!decision.allowed) {
    return { text: "", provider: "budget", model, ok: false, error: decision.reason ?? "ORCAMENTO_EXCEDIDO" };
  }

  try {
    const result = await adapter.chat({
      messages,
      model,
      apiKey: env.ai.apiKey,
      baseUrl: env.ai.baseUrl || undefined,
      maxOutputTokens,
      temperature: opts.temperature ?? env.ai.temperature,
      timeoutMs: opts.timeoutMs ?? env.ai.timeoutMs,
      maxRetries: opts.maxRetries ?? env.ai.maxRetries
    });

    recordUsage(model, result.inputTokens ?? inputTokens, result.outputTokens ?? maxOutputTokens);
    return { ...result, provider: env.ai.provider || result.provider };
  } catch (err) {
    return {
      text: "",
      provider: env.ai.provider,
      model,
      ok: false,
      error: err instanceof Error ? err.message : "Erro desconhecido no provedor de IA."
    };
  }
}
