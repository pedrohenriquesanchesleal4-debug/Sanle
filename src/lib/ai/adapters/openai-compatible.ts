import { fetchWithRetry, readErrorDetail } from "../http";
import { LLMProviderError, type LLMAdapter, type LLMInvocation, type LLMResult } from "../types";

/**
 * Adapter OpenAI-compatível (OpenAI, Azure-compat, Groq, Together, OpenRouter,
 * Ollama/LM Studio expostos via `/v1`). Cobre tanto `provider = "openai"` quanto
 * `provider = "openai_compatible"` — a diferença é só a `baseUrl` resolvida.
 */

const DEFAULT_BASE = "https://api.openai.com/v1";

export function normalizeBase(base?: string): string {
  const b = (base ?? "").trim() || DEFAULT_BASE;
  return b.replace(/\/+$/, "");
}

export async function chatOpenAICompatible(inv: LLMInvocation): Promise<LLMResult> {
  const started = Date.now();
  const base = normalizeBase(inv.baseUrl);
  const res = await fetchWithRetry(
    `${base}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${inv.apiKey}`
      },
      body: JSON.stringify({
        model: inv.model,
        messages: inv.messages,
        temperature: inv.temperature,
        max_tokens: inv.maxOutputTokens
      })
    },
    { timeoutMs: inv.timeoutMs, maxRetries: inv.maxRetries, signal: inv.signal }
  );

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new LLMProviderError(`Provedor de IA respondeu ${res.status}: ${detail}`, res.status, res.status >= 500 || res.status === 429);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  return {
    text: data.choices?.[0]?.message?.content?.trim() ?? "",
    provider: "openai",
    model: inv.model,
    ok: true,
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
    latencyMs: Date.now() - started
  };
}

export const openaiCompatibleAdapter: LLMAdapter = {
  id: "openai_compatible",
  label: "OpenAI / compatível",
  note: "Endpoint `/chat/completions` compatível com OpenAI. Serve OpenAI, Groq, OpenRouter, Ollama (/v1) e afins.",
  capabilities: { streaming: true, tools: true, json: true, vision: true },
  configured: () => true, // a credencial é checada pelo registry
  chat: chatOpenAICompatible
};

export const openaiAdapter: LLMAdapter = {
  ...openaiCompatibleAdapter,
  id: "openai",
  label: "OpenAI",
  note: "API oficial da OpenAI (api.openai.com)."
};
