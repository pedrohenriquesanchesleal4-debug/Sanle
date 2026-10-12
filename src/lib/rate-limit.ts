/**
 * Rate limiting em memória (janela deslizante). Suficiente para uma instância
 * e para impedir abuso trivial. Em escala horizontal, trocar por um store
 * compartilhado (Upstash/Redis) — o contrato é o mesmo.
 */
type Entry = { hits: number[]; };

const buckets = new Map<string, Entry>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetMs: number;
  limit: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key) ?? { hits: [] };
  entry.hits = entry.hits.filter((t) => now - t < windowMs);

  if (entry.hits.length >= limit) {
    const oldest = entry.hits[0] ?? now;
    buckets.set(key, entry);
    return { ok: false, remaining: 0, resetMs: oldest + windowMs - now, limit };
  }

  entry.hits.push(now);
  buckets.set(key, entry);
  return { ok: true, remaining: limit - entry.hits.length, resetMs: windowMs, limit };
}

/** Extrai um identificador de cliente do request (IP atrás de proxy incluso). */
export function clientKey(req: Request, scope: string): string {
  const h = req.headers;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "local";
  return `${scope}:${ip}`;
}

/** Limpeza periódica para não vazar memória em processos longos. */
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) {
      v.hits = v.hits.filter((t) => now - t < 3600_000);
      if (!v.hits.length) buckets.delete(k);
    }
  }, 600_000);
  // Não segura o processo (ex.: testes/CLI)
  if (typeof timer === "object" && "unref" in timer) (timer as { unref: () => void }).unref();
}
