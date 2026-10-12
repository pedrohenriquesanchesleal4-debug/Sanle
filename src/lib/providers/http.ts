import { env } from "@/lib/env";
import { cacheKey, cacheThrough } from "./cache";
import { paced } from "./pacing";

/**
 * Cliente HTTP resiliente para provedores externos.
 *
 * Política de retry (por que é assim):
 *  - Transitório (rede, timeout, HTTP 5xx) → repete com backoff exponencial + jitter.
 *  - HTTP 4xx (exceto 429) → erro permanente, NÃO repete (dado/credencial inválida).
 *  - HTTP 429 → NÃO repete: Overpass e Nominatim monitoram reincidência e bane quem
 *    insiste. Devolvemos o erro na hora, com o `Retry-After` quando houver.
 *
 * Circuit breaker por host: após N falhas consecutivas, para de chamar por um
 * cooldown — evita martelar um serviço já degradado (padrão de resiliência).
 */

export type RequestOptions = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  retries?: number;
  /** Habilita cache com este TTL (ms). Ausente = sem cache. */
  cacheTtlMs?: number;
  /** Chave de pacing (default: host da URL). */
  pacingKey?: string;
  minIntervalMs?: number;
};

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly retryable = false
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const BREAKER_THRESHOLD = 5;
const BREAKER_COOLDOWN_MS = 60_000;

type Breaker = { failures: number; openUntil: number };
const breakers = new Map<string, Breaker>();

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function breakerOpenUntil(host: string): number {
  const b = breakers.get(host);
  if (!b) return 0;
  return b.openUntil > Date.now() ? b.openUntil : 0;
}

function recordFailure(host: string): void {
  const b = breakers.get(host) ?? { failures: 0, openUntil: 0 };
  b.failures += 1;
  if (b.failures >= BREAKER_THRESHOLD) {
    b.openUntil = Date.now() + BREAKER_COOLDOWN_MS;
    b.failures = 0;
  }
  breakers.set(host, b);
}

function recordSuccess(host: string): void {
  breakers.delete(host);
}

function backoffDelay(attempt: number): number {
  const base = Math.min(8_000, 500 * 2 ** (attempt - 1));
  const jitter = Math.floor(Math.random() * 400);
  return base + jitter;
}

async function doFetch(url: string, options: RequestOptions): Promise<unknown> {
  const host = hostOf(url);

  const openUntil = breakerOpenUntil(host);
  if (openUntil > 0) {
    throw new HttpError(0, `Circuito aberto para ${host} (~${Math.ceil((openUntil - Date.now()) / 1000)}s).`, true);
  }

  const retries = options.retries ?? 2;
  let attempt = 0;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": env.osm.userAgent,
    ...(options.headers ?? {})
  };

  for (;;) {
    try {
      const res = await fetch(url, {
        method: options.method ?? "GET",
        headers,
        body: options.body,
        signal: AbortSignal.timeout(options.timeoutMs ?? env.prospecting.timeoutMs)
      });

      if (res.status === 429) {
        // Não repetimos: reincidência em 429 leva a bloqueio nas políticas OSM.
        recordFailure(host);
        const retryAfter = res.headers.get("retry-after");
        throw new HttpError(
          429,
          `Limite de uso atingido em ${host}${retryAfter ? ` (tente em ${retryAfter}s)` : ""}.`,
          false
        );
      }

      if (res.status >= 500) {
        if (attempt < retries) {
          attempt += 1;
          await sleep(backoffDelay(attempt));
          continue;
        }
        recordFailure(host);
        throw new HttpError(res.status, `HTTP ${res.status} em ${host}.`, true);
      }

      if (!res.ok) {
        recordFailure(host);
        throw new HttpError(res.status, `HTTP ${res.status} em ${host}.`, false);
      }

      recordSuccess(host);
      return (await res.json()) as unknown;
    } catch (err) {
      if (err instanceof HttpError) throw err;

      const message = err instanceof Error ? err.message : "falha de rede";
      if (attempt < retries) {
        attempt += 1;
        await sleep(backoffDelay(attempt));
        continue;
      }
      recordFailure(host);
      throw new HttpError(0, `${host}: ${message}`, true);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executa a requisição aplicando pacing (por host) e, opcionalmente, cache.
 * Retorna o JSON tipado e se veio do cache.
 */
export async function requestJson<T>(
  url: string,
  options: RequestOptions = {}
): Promise<{ data: T; cached: boolean }> {
  const key = cacheKey(
    "http",
    options.method ?? "GET",
    url,
    options.body ?? "",
    options.headers?.["Accept-Language"] ?? ""
  );

  const produce = (): Promise<T> =>
    paced(
      options.pacingKey ?? hostOf(url),
      options.minIntervalMs ?? env.prospecting.minIntervalMs,
      () => doFetch(url, options) as Promise<T>
    );

  if (options.cacheTtlMs && options.cacheTtlMs > 0) {
    const { value, cached } = await cacheThrough<T>(key, options.cacheTtlMs, produce);
    return { data: value, cached };
  }
  return { data: await produce(), cached: false };
}

export const __test = {
  resetBreakers(): void {
    breakers.clear();
  },
  breakerOpenUntil
};
