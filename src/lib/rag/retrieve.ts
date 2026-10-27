import { listChunks, listKnowledgeDocs } from "@/lib/db/repo";
import { env } from "@/lib/env";
import { cosine, embedOne } from "./embeddings";
import { isPgvectorCompatible } from "./vector";
import { vectorSearchHybrid, vectorStoreAvailable, type VectorHit } from "./vector-store";
import { baseKnowledge } from "./knowledge-seed";
import type { KnowledgeChunk } from "@/lib/types";

/**
 * Recuperação de trechos (RAG) com DOIS caminhos, nesta ordem:
 *  1. Vetorial (pgvector via RPC) — usado quando há provedor de embedding remoto
 *     de 1536 dims e a coluna/RPC existem. Melhor recall e latência em escala.
 *  2. Em memória (cosine) — sempre disponível; é o fallback quando o pgvector
 *     não está configurado OU não retornou nada relevante.
 *
 * Em nenhum caminho o modelo recebe contexto vazio como se fosse resposta: se a
 * recuperação volta vazia, `assistant` usa a resposta determinística de "sem base".
 */

export type RetrievedChunk = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  content: string;
  score: number;
};

function toRetrieved(hit: VectorHit): RetrievedChunk {
  return {
    chunkId: hit.chunkId,
    documentId: hit.documentId,
    documentTitle: hit.documentTitle,
    content: hit.content,
    score: hit.score
  };
}

/** Caminho 1: pgvector. Retorna [] (e não erro) quando indisponível/incompatível. */
async function vectorRetrieve(query: string, topK: number, minScore: number): Promise<RetrievedChunk[]> {
  if (!vectorStoreAvailable()) return [];
  const { vector } = await embedOne(query);
  // O fallback local (256 dims) NÃO é compatível com `vector(1536)`: usar a RPC
  // com ele produziria erro de dimensão. Nesse caso, seguimos para o cosine.
  if (!isPgvectorCompatible(vector)) return [];
  const hits = await vectorSearchHybrid(vector, query, topK, minScore);
  return hits.map(toRetrieved);
}

/** Caminho 2: cosine sobre os chunks em memória (sempre disponível). */
async function bruteForceRetrieve(query: string, topK: number, minScore: number): Promise<RetrievedChunk[]> {
  const [chunks, docs] = await Promise.all([listChunks(), listKnowledgeDocs()]);
  if (!chunks.length) return [];

  const docTitle = new Map(docs.map((d) => [d.id, d.title]));
  const { vector: queryVec } = await embedOne(query);
  if (!queryVec.length) return [];

  return chunks
    .filter((c: KnowledgeChunk) => c.embedding?.length)
    .map((c) => ({
      chunkId: c.id,
      documentId: c.documentId,
      documentTitle: docTitle.get(c.documentId) ?? "(documento)",
      content: c.content,
      score: cosine(queryVec, c.embedding)
    }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Caminho 3: Fallback em memória sobre a base institucional garantida. */
function fallbackBaseKnowledgeRetrieve(query: string, topK: number): RetrievedChunk[] {
  const terms = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const docs = baseKnowledge();
  const scored = docs.map((doc, idx) => {
    const text = `${doc.title} ${doc.content}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let matches = 0;
    for (const t of terms) {
      if (text.includes(t)) matches++;
    }
    const score = terms.length > 0 ? matches / terms.length : 0.5;
    return {
      chunkId: `static_${idx}`,
      documentId: `doc_${idx}`,
      documentTitle: doc.title,
      content: doc.content.slice(0, 900),
      score: Math.max(0.4, score)
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/** Recupera os trechos mais relevantes para a consulta (vetorial → memória → base estática). */
export async function retrieve(
  query: string,
  topK: number = env.rag.topK,
  minScore: number = env.rag.minScore
): Promise<RetrievedChunk[]> {
  if (!query.trim()) return [];

  try {
    const vectorHits = await vectorRetrieve(query, topK, minScore);
    if (vectorHits.length) return vectorHits;

    const bruteHits = await bruteForceRetrieve(query, topK, minScore);
    if (bruteHits.length) return bruteHits;
  } catch (err) {
    console.warn("[retrieve] Falha ao consultar vetores ou chunks, acionando base estática:", err);
  }

  return fallbackBaseKnowledgeRetrieve(query, topK);
}

/** Concatena contexto recuperado, respeitando um orçamento de caracteres. */
export function buildContext(hits: RetrievedChunk[], maxChars = env.rag.contextMaxChars): string {
  let out = "";
  for (const h of hits) {
    const block = `[${h.documentTitle}]\n${h.content}\n\n`;
    if ((out + block).length > maxChars) break;
    out += block;
  }
  return out.trim();
}
