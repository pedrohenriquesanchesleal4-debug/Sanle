import { createKnowledgeDoc, listChunks, listKnowledgeDocs, logAiRun, updateKnowledgeDoc } from "@/lib/db/repo";
import { knowledgeSchema, sanitizeText } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { indexDocument } from "@/lib/rag/knowledge-seed";
import { hasEmbeddingProvider, LOCAL_EMBED_MODEL } from "@/lib/rag/embeddings";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const docs = await listKnowledgeDocs();
    const chunks = await listChunks();
    const counts = new Map<string, number>();
    for (const c of chunks) counts.set(c.documentId, (counts.get(c.documentId) ?? 0) + 1);
    return ok({
      documents: docs.map((d) => ({ ...d, chunkCount: counts.get(d.id) ?? 0 })),
      totals: { documents: docs.length, chunks: chunks.length },
      embeddings: hasEmbeddingProvider() ? "provider" : LOCAL_EMBED_MODEL
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "knowledge-create", 30, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = knowledgeSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const doc = await createKnowledgeDoc({
      title: sanitizeText(parsed.data.title),
      category: sanitizeText(parsed.data.category),
      content: sanitizeText(parsed.data.content)
    });

    let chunkCount = 0;
    try {
      chunkCount = await indexDocument(doc);
      await updateKnowledgeDoc(doc.id, { status: "indexado", version: 1 });
    } catch (err) {
      await updateKnowledgeDoc(doc.id, { status: "erro" });
      throw err;
    }

    await logAiRun({
      kind: "embedding",
      provider: hasEmbeddingProvider() ? "provider" : "local",
      model: hasEmbeddingProvider() ? "provider-embed" : LOCAL_EMBED_MODEL,
      ok: true,
      refId: doc.id,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    await recordAdminAction(auth.email, "knowledge.create", doc.id, doc.title);
    return ok({ document: { ...doc, status: "indexado" }, chunkCount });
  } catch (err) {
    return handleError(err);
  }
}
