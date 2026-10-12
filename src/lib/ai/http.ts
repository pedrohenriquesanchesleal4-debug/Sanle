import { LLMProviderError } from "./types";

/**
 * HTTP resiliente para provedores de LLM — SERVER-ONLY-adjacent (não importa env).
 *
 * Princípio: timeout, 429 e 5xx são **casos esperados**, nunca exceção rara.
 * Aqui centralizamos timeout por tentativa + retry com backoff exponencial e
 * jitter. Erros 4xx (exceto 429) NÃO são retentados: não adianta repetir uma
 * requisição malformada.
 */

export type RetryOptions = {
  timeoutMs: number;
  maxRetries: number;
  signal?: AbortSignal;
};

const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504, 522, 524]);

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Backoff exponencial com jitter completo: base * 2^n, teto de 8s. */
export function backoffMs(attempt: number): number {
  const base = Math.min(8000, 400 * 2 ** Math.max(0, attempt));
  return Math.round(base / 2 + Math.random() * (base / 2));
}

/** Concatena um sinal já abortado com um novo controller (Node 20 tem `any`). */
function combineSignals(timeoutMs: number, external?: AbortSignal): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), timeoutMs);
  const onAbort = () => controller.abort(external?.reason);
  if (external) {
    if (external.aborted) controller.abort(external.reason);
    else external.addEventListener("abort", onAbort, { once: true });
  }
  return {
    signal: controller.signal,
    cancel: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", onAbort);
    }
  };
}

/**
 * `fetch` com timeout por tentativa e retry. Retorna a Response final (mesmo se
 * for um 4xx não-retentável — quem chama decide). Lança `LLMProviderError` apenas
 * quando todas as tentativas falharam por rede/timeout/5xx.
 */
export async function fetchWithRetry(url: string, init: RequestInit, opts: RetryOptions): Promise<Response> {
  const maxAttempts = Math.max(1, opts.maxRetries + 1);
  let lastErr: unknown = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { signal, cancel } = combineSignals(opts.timeoutMs, opts.signal);
    try {
      const res = await fetch(url, { ...init, signal });
      cancel();
      if (res.ok || !RETRYABLE_STATUS.has(res.status)) return res;
      lastErr = new LLMProviderError(`Provedor respondeu ${res.status}`, res.status, true);
      // Respeita Retry-After quando presente (429), com teto.
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(8000, retryAfter * 1000) : backoffMs(attempt);
      if (attempt < maxAttempts - 1) await sleep(wait, opts.signal);
    } catch (err) {
      cancel();
      const abortedByCaller = opts.signal?.aborted === true;
      if (abortedByCaller) throw new LLMProviderError("Chamada cancelada.", 499, false);
      lastErr = err;
      if (attempt < maxAttempts - 1) await sleep(backoffMs(attempt), opts.signal);
    }
  }

  if (lastErr instanceof LLMProviderError) throw lastErr;
  const detail = lastErr instanceof Error ? lastErr.message : "falha de rede";
  throw new LLMProviderError(`Falha ao contatar o provedor: ${detail}`, 503, true);
}

/** Lê o corpo de uma resposta não-OK para compor a mensagem de erro (truncado). */
export async function readErrorDetail(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 300);
  } catch {
    return "";
  }
}
