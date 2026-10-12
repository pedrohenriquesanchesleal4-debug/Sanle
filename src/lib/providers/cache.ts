import { env } from "@/lib/env";

/**
 * Cache em memória para respostas de provedores externos.
 *
 * Por que existe: as políticas do OpenStreetMap exigem que apps façam cache dos
 * resultados (Nominatim: "Results must be cached on your side"; Overpass: use
 * extratos/cache). Sem cache, cada busca repetida vira tráfego contra servidores
 * doados — e leva a bloqueio por uso indevido.
 *
 * Limitação consciente: é por instância de processo. Em escala horizontal, trocar
 * por store compartilhado (Redis/Upstash) mantendo o mesmo contrato (get/set).
 */

type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

export function cacheKey(...parts: unknown[]): string {
  return JSON.stringify(parts);
}

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key) as Entry<T> | undefined;
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  // Reinsere para preservar ordem de recência (eviction FIFO → LRU-ish).
  store.delete(key);
  store.set(key, hit);
  return hit.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs = env.prospecting.cacheTtlMs): void {
  if (ttlMs <= 0) return;
  if (store.size >= env.prospecting.cacheMaxEntries) {
    const oldest = store.keys().next();
    if (!oldest.done) store.delete(oldest.value);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Executa `producer` com cache: devolve o valor memorizado ou produz e memoriza. */
export async function cacheThrough<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>
): Promise<{ value: T; cached: boolean }> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return { value: hit, cached: true };
  const value = await producer();
  cacheSet(key, value, ttlMs);
  return { value, cached: false };
}

export function cacheStats(): { size: number } {
  return { size: store.size };
}

export function cacheClear(): void {
  store.clear();
}
