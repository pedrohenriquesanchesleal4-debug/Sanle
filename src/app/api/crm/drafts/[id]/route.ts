import { addActivity, getDraft, updateDraft } from "@/lib/db/repo";
import { z } from "zod";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { sanitizeText } from "@/lib/schemas";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["rascunho", "revisao_pendente", "aprovado", "enviado_externamente", "resposta_registrada", "cancelado"]).optional(),
  editedBody: z.string().trim().max(6000).optional(),
  result: z.string().trim().max(1000).optional()
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const current = await getDraft(id);
    if (!current) return failure("Rascunho não encontrado.", 404);

    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const patch: Record<string, unknown> = {};
    if (parsed.data.status) patch.status = parsed.data.status;
    if (parsed.data.editedBody !== undefined) patch.editedBody = sanitizeText(parsed.data.editedBody);
    if (parsed.data.result !== undefined) patch.result = sanitizeText(parsed.data.result);

    const updated = await updateDraft(id, patch);
    if (!updated) return failure("Falha ao atualizar.", 500);

    // Registra na trilha do lead quando o estado muda para algo relevante.
    if (parsed.data.status === "enviado_externamente") {
      await addActivity({
        leadId: updated.leadId,
        kind: "mensagem_enviada",
        summary: "Mensagem enviada externamente (registro manual)",
        detail: updated.kind,
        actor: auth.email
      });
    }
    if (parsed.data.status === "aprovado") {
      await addActivity({ leadId: updated.leadId, kind: "nota", summary: "Rascunho aprovado", actor: auth.email });
    }

    await recordAdminAction(auth.email, "draft.update", updated.leadId, parsed.data.status ?? "edit");
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}
