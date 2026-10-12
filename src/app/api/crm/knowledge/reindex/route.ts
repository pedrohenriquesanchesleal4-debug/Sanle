import { handleError, ok, requireAdmin, guard } from "@/lib/api";
import { reindexAll, seedKnowledge } from "@/lib/rag/knowledge-seed";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

/** Reindexa tudo. Se não houver documentos, semeia a base institucional. */
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "knowledge-reindex", 5, 10 * 60_000);
  if (limited) return limited;
  try {
    const seeded = await seedKnowledge(false);
    const reindexed = await reindexAll();
    await recordAdminAction(auth.email, "knowledge.reindex", undefined, `${reindexed.documents} docs`);
    return ok({ seeded, reindexed });
  } catch (err) {
    return handleError(err);
  }
}
