import { env } from "@/lib/env";
import { LOCAL_EMBED_DIM } from "./vector";

/**
 * Embeddings com fallback determinístico.
 * - Com provedor configurado: usa o endpoint de embeddings (OpenAI-compatível).
 * - Sem provedor: embeddings locais por hashing de tokens (bag-of-words) — não são
 *   semânticas de verdade, mas permitem que a recuperação funcione offline e sem custo.
 *   Isso é declarado abertamente no painel; não fingimos ser o que não é.
 */

export const LOCAL_EMBED_MODEL = "sanle-local-hash-256";
const DIM = LOCAL_EMBED_DIM;

export function hasEmbeddingProvider(): boolean {
  return env.ai.configured && env.ai.provider !== "local";
}

function tokenize(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function localEmbed(text: string): number[] {
  const vec = new Array<number>(DIM).fill(0);
  const tokens = tokenize(text);
  for (const t of tokens) {
    const idx = hash(t) % DIM;
    vec[idx] = (vec[idx] ?? 0) + 1;
    // hashing de bigramas leves para captar um pouco de contexto
    const h2 = hash(`${t}#2`) % DIM;
    vec[h2] = (vec[h2] ?? 0) + 0.5;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

async function remoteEmbed(texts: string[]): Promise<number[][] | null> {
  if (!hasEmbeddingProvider()) return null;
  const base = env.ai.baseUrl || "https://api.openai.com/v1";
  // Timeout tratado como caso esperado: um endpoint pendurado não pode travar a
  // indexação. Sem credencial/rota, cai no fallback local (nunca lança).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.ai.timeoutMs);
  try {
    const res = await fetch(`${base}/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.ai.apiKey}` },
      body: JSON.stringify({ model: env.ai.embedModel, input: texts }),
      signal: controller.signal
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { embedding: number[] }[] };
    if (!data.data?.length) return null;
    return data.data.map((d) => d.embedding);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function embed(texts: string[]): Promise<{ vectors: number[][]; model: string }> {
  const remote = await remoteEmbed(texts);
  if (remote) return { vectors: remote, model: env.ai.embedModel };
  return { vectors: texts.map(localEmbed), model: LOCAL_EMBED_MODEL };
}

/** Conveniência para uma única consulta. Retorna o vetor + o modelo que o gerou. */
export async function embedOne(text: string): Promise<{ vector: number[]; model: string }> {
  const { vectors, model } = await embed([text]);
  return { vector: vectors[0] ?? [], model };
}

export function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
