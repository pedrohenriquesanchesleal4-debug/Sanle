import { deleteKnowledgeDoc, getKnowledgeDoc } from "@/lib/db/repo";
import { failure, handleError, ok, requireAdmin } from "@/lib/api";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const doc = await getKnowledgeDoc(id);
    if (!doc) return failure("Documento não encontrado.", 404);
    await deleteKnowledgeDoc(id);
    await recordAdminAction(auth.email, "knowledge.delete", id, doc.title);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
