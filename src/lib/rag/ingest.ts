import {
  createKnowledgeDoc,
  getKnowledgeDoc,
  listKnowledgeDocs,
  replaceChunks,
  updateKnowledgeDoc
} from "@/lib/db/repo";
import type { KnowledgeDocument } from "@/lib/types";
import { chunkText } from "./chunk";
import { embed } from "./embeddings";
import { isPgvectorCompatible } from "./vector";
import { writeChunkVectors } from "./vector-store";

/**
 * Ingestão de conhecimento (RAG) — SERVER-ONLY.
 *
 * Fluxo por documento: chunk → embedding → `replaceChunks` (fonte da verdade em
 * `embedding jsonb`) → gravação BEST-EFFORT do `embedding_vec` (pgvector).
 *
 * Decisões que não são detalhe:
 *  - A escrita vetorial é SEPARADA do insert dos chunks: se a coluna não existir
 *    ou o provedor remoto não estiver configurado, a indexação continua válida
 *    (só o caminho em memória). Nunca derrubamos o insert por causa do pgvector.
 *  - Vetor de 256 dims (fallback local) NÃO vai para `vector(1536)`: pulamos a
 *    gravação em vez de provocar erro de dimensão.
 */

export type IndexOutcome = { chunks: number; vectorsWritten: number };

/** (Re)indexa um documento: chunk + embedding + replaceChunks + gravação vetorial. */
export async function indexDocumentDetailed(doc: { id: string; content: string }): Promise<IndexOutcome> {
  const chunks = chunkText(doc.content);
  if (!chunks.length) {
    await replaceChunks(doc.id, []);
    return { chunks: 0, vectorsWritten: 0 };
  }

  const { vectors, model } = await embed(chunks.map((c) => c.content));
  const rows = await replaceChunks(
    doc.id,
    chunks.map((c, i) => ({
      documentId: doc.id,
      ordinal: c.ordinal,
      content: c.content,
      embedding: vectors[i] ?? [],
      embeddingModel: model
    }))
  );

  const vectorRows = rows
    .map((r, i) => ({ id: r.id, vector: vectors[i] ?? [] }))
    .filter((v) => isPgvectorCompatible(v.vector));
  const { written } = await writeChunkVectors(vectorRows);

  return { chunks: chunks.length, vectorsWritten: written };
}

/**
 * Compatível com a assinatura anterior: retorna a contagem de chunks. Mantida
 * porque `knowledge/route.ts` e o reindex dependem deste valor.
 */
export async function indexDocument(doc: { id: string; content: string }): Promise<number> {
  const { chunks } = await indexDocumentDetailed(doc);
  return chunks;
}

export type UpsertResult = {
  document: KnowledgeDocument;
  chunks: number;
  vectorsWritten: number;
  created: boolean;
};

/** Cria ou atualiza (por título) um documento e o (re)indexa. */
export async function upsertKnowledgeDocument(input: {
  title: string;
  category: string;
  content: string;
}): Promise<UpsertResult> {
  const existing = (await listKnowledgeDocs()).find((d) => d.title === input.title);

  let document: KnowledgeDocument;
  let created: boolean;
  if (existing) {
    const updated = await updateKnowledgeDoc(existing.id, {
      content: input.content,
      category: input.category,
      version: existing.version + 1
    });
    document = updated ?? existing;
    created = false;
  } else {
    document = await createKnowledgeDoc(input);
    created = true;
  }

  try {
    const outcome = await indexDocumentDetailed(document);
    const finalized = await updateKnowledgeDoc(document.id, { status: "indexado" });
    return { document: finalized ?? document, ...outcome, created };
  } catch (err) {
    await updateKnowledgeDoc(document.id, { status: "erro" });
    throw err;
  }
}

export type BulkIngestResult = {
  created: number;
  updated: number;
  chunks: number;
  vectorsWritten: number;
  documents: { id: string; title: string }[];
};

/** Ingestão em lote (idempotente por título). Um doc com erro não derruba o lote. */
export async function ingestDocuments(
  docs: { title: string; category: string; content: string }[]
): Promise<BulkIngestResult> {
  const result: BulkIngestResult = { created: 0, updated: 0, chunks: 0, vectorsWritten: 0, documents: [] };
  for (const doc of docs) {
    const r = await upsertKnowledgeDocument(doc);
    if (r.created) result.created++;
    else result.updated++;
    result.chunks += r.chunks;
    result.vectorsWritten += r.vectorsWritten;
    result.documents.push({ id: r.document.id, title: r.document.title });
  }
  return result;
}

/** Reprocessa todos os documentos (após trocar o modelo de embedding, por ex.). */
export async function reprocessAll(): Promise<{ documents: number; chunks: number; vectorsWritten: number }> {
  const docs = await listKnowledgeDocs();
  let chunks = 0;
  let vectorsWritten = 0;
  for (const d of docs) {
    const doc = (await getKnowledgeDoc(d.id)) ?? d;
    const outcome = await indexDocumentDetailed(doc);
    chunks += outcome.chunks;
    vectorsWritten += outcome.vectorsWritten;
  }
  return { documents: docs.length, chunks, vectorsWritten };
}
