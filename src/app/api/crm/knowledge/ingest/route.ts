import { z } from "zod";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { knowledgeSchema, sanitizeText } from "@/lib/schemas";
import { ingestDocuments, reprocessAll, upsertKnowledgeDocument } from "@/lib/rag/ingest";
import { hasEmbeddingProvider, LOCAL_EMBED_MODEL } from "@/lib/rag/embeddings";
import { logAiRun } from "@/lib/db/repo";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Ingestão programática de conhecimento. Três modos (mutuamente exclusivos):
 *  - `{ title, category, content }` → cria/atualiza UM documento e o indexa;
 *  - `{ documents: [...] }`         → lote idempotente por título;
 *  - `{ reprocess: true }`          → reprocessa todos (troca de modelo de embedding).
 *
 * O CRUD manual do painel (`/api/crm/knowledge`) continua existindo; esta rota
 * cobre automação/ETL e reprocessamento em massa.
 */
const singleDocSchema = knowledgeSchema;
const ingestSchema = z.union([
  z.object({ reprocess: z.literal(true) }),
  z.object({ documents: z.array(singleDocSchema).min(1).max(50) }),
  singleDocSchema
]);

export async function POST(req: Request): Promise<Response> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "knowledge-ingest", 20, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = ingestSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const started = Date.now();
    let payload: Record<string, unknown>;

    if ("reprocess" in parsed.data) {
      const result = await reprocessAll();
      payload = { mode: "reprocess", ...result };
      await recordAdminAction(auth.email, "knowledge.reprocess", undefined, `${result.documents} docs`);
    } else if ("documents" in parsed.data) {
      const result = await ingestDocuments(
        parsed.data.documents.map((d) => ({
          title: sanitizeText(d.title),
          category: sanitizeText(d.category),
          content: sanitizeText(d.content)
        }))
      );
      payload = { mode: "bulk", ...result };
      await recordAdminAction(auth.email, "knowledge.ingest", undefined, `${result.documents.length} docs`);
    } else {
      const result = await upsertKnowledgeDocument({
        title: sanitizeText(parsed.data.title),
        category: sanitizeText(parsed.data.category),
        content: sanitizeText(parsed.data.content)
      });
      payload = { mode: "single", ...result };
      await recordAdminAction(auth.email, "knowledge.upsert", result.document.id, result.document.title);
    }

    await logAiRun({
      kind: "embedding",
      provider: hasEmbeddingProvider() ? "provider" : "local",
      model: hasEmbeddingProvider() ? "provider-embed" : LOCAL_EMBED_MODEL,
      ok: true,
      refId: null,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    return ok({ ...payload, latencyMs: Date.now() - started });
  } catch (err) {
    return handleError(err);
  }
}
