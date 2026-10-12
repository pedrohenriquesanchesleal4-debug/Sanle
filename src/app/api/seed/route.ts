import { handleError, ok, requireAdmin } from "@/lib/api";
import { seedKnowledge } from "@/lib/rag/knowledge-seed";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

/** Semeia a base de conhecimento institucional (idempotente por título). */
export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const result = await seedKnowledge(false);
    await recordAdminAction(auth.email, "seed.knowledge", undefined, `${result.created} docs`);
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}
