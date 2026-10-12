import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { toVectorLiteral } from "./vector";

/**
 * Camada de acesso vetorial — SERVER-ONLY (usa service role do Supabase).
 *
 * Escrita e busca são **best-effort**: se a coluna/RPC/extensão não existir (DB
 * sem a migration #2), tudo degrada para o caminho em memória — o app NUNCA
 * quebra por causa do pgvector. Toda falha é engolida e reportada como "0".
 */

export type VectorHit = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  content: string;
  score: number;
};

/** Só há caminho vetorial quando a flag está ligada E existe service role. */
export function vectorStoreAvailable(): boolean {
  return env.rag.vectorEnabled && env.supabase.admin;
}

/**
 * Grava o vetor de um chunk em `embedding_vec`. Devolve `true` só quando a
 * escrita foi confirmada. `null` (vetor vazio ou incompatível) é um "pule"
 * explícito — nunca um `false` que mascare erro de dimensão.
 */
export async function writeChunkVector(id: string, vector: number[]): Promise<boolean> {
  if (!vectorStoreAvailable()) return false;
  const literal = toVectorLiteral(vector);
  if (!literal) return false;
  try {
    const supabase = await getSupabaseAdmin();
    if (!supabase) return false;
    const { error } = await supabase.from("knowledge_chunks").update({ embedding_vec: literal }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/** Grava vários vetores. Best-effort: um erro não impede os demais. */
export async function writeChunkVectors(
  rows: { id: string; vector: number[] }[]
): Promise<{ attempted: number; written: number }> {
  if (!vectorStoreAvailable()) return { attempted: rows.length, written: 0 };
  let written = 0;
  for (const row of rows) {
    if (await writeChunkVector(row.id, row.vector)) written++;
  }
  return { attempted: rows.length, written };
}

/**
 * Busca por similaridade via RPC `match_knowledge_chunks`. Retorna [] quando o
 * caminho vetorial não está disponível ou a RPC falha — quem chama decide o
 * fallback (retrieve.ts cai para cosine em memória).
 */
export async function vectorSearch(
  queryVector: number[],
  matchCount: number,
  minScore: number
): Promise<VectorHit[]> {
  if (!vectorStoreAvailable()) return [];
  const literal = toVectorLiteral(queryVector);
  if (!literal) return [];
  try {
    const supabase = await getSupabaseAdmin();
    if (!supabase) return [];
    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: literal,
      match_count: Math.max(1, matchCount),
      min_score: minScore
    });
    if (error || !data) return [];
    return (data as unknown[])
      .map((r) => r as Record<string, unknown>)
      .map((r) => ({
        chunkId: String(r.chunk_id ?? ""),
        documentId: String(r.document_id ?? ""),
        documentTitle: String(r.document_title ?? "(documento)"),
        content: String(r.content ?? ""),
        score: Number(r.score ?? 0)
      }))
      .filter((h) => h.chunkId && h.content);
  } catch {
    return [];
  }
}

/**
 * Busca HÍBRIDA (cosseno + léxico). Cai para a busca vetorial pura se a RPC
 * híbrida não existir (DB sem a migration #4) — nunca pior que o caminho atual.
 */
export async function vectorSearchHybrid(
  queryVector: number[],
  queryText: string,
  matchCount: number,
  minScore: number,
  keywordWeight = 0.3
): Promise<VectorHit[]> {
  if (!vectorStoreAvailable()) return [];
  const literal = toVectorLiteral(queryVector);
  if (!literal) return [];
  try {
    const supabase = await getSupabaseAdmin();
    if (!supabase) return [];
    const { data, error } = await supabase.rpc("match_knowledge_chunks_hybrid", {
      query_embedding: literal,
      query_text: queryText,
      match_count: Math.max(1, matchCount),
      min_score: minScore,
      keyword_weight: keywordWeight
    });
    if (error) return vectorSearch(queryVector, matchCount, minScore);
    if (!data) return [];
    return (data as unknown[])
      .map((r) => r as Record<string, unknown>)
      .map((r) => ({
        chunkId: String(r.chunk_id ?? ""),
        documentId: String(r.document_id ?? ""),
        documentTitle: String(r.document_title ?? "(documento)"),
        content: String(r.content ?? ""),
        score: Number(r.score ?? 0)
      }))
      .filter((h) => h.chunkId && h.content);
  } catch {
    return vectorSearch(queryVector, matchCount, minScore);
  }
}
