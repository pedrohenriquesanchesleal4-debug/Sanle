import { fetchWithRetry, readErrorDetail } from "../http";
import { LLMProviderError, type LLMAdapter, type LLMInvocation, type LLMResult } from "../types";

/**
 * Adapter Anthropic (Messages API).
 *
 * Diferença estrutural relevante: o `system` é um campo de topo, não uma
 * mensagem. Mantemos essa tradução aqui — e é justamente por isso que a
 * separação system/usuário nunca depende do modelo "obedecer".
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function chatAnthropic(inv: LLMInvocation): Promise<LLMResult> {
  const started = Date.now();
  const system = inv.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const rest = inv.messages.filter((m) => m.role !== "system");

  const res = await fetchWithRetry(
    ANTHROPIC_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": inv.apiKey,
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model: inv.model,
        max_tokens: inv.maxOutputTokens,
        temperature: inv.temperature,
        system,
        messages: rest.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }))
      })
    },
    { timeoutMs: inv.timeoutMs, maxRetries: inv.maxRetries, signal: inv.signal }
  );

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new LLMProviderError(`Anthropic respondeu ${res.status}: ${detail}`, res.status, res.status >= 500 || res.status === 429);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  return {
    text: (data.content ?? []).map((c) => c.text ?? "").join("").trim(),
    provider: "anthropic",
    model: inv.model,
    ok: true,
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
    latencyMs: Date.now() - started
  };
}

export const anthropicAdapter: LLMAdapter = {
  id: "anthropic",
  label: "Anthropic",
  note: "Messages API (Claude). O system é campo de topo, tratado no adapter.",
  capabilities: { streaming: true, tools: true, json: true, vision: true },
  configured: () => true, // a credencial é checada pelo registry
  chat: chatAnthropic
};
