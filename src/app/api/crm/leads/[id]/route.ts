import { addActivity, deleteLead, getLead, listActivities, listDrafts, listReminders, updateLead } from "@/lib/db/repo";
import { leadUpdateSchema } from "@/lib/schemas";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { scoreLead } from "@/lib/crm/scoring";
import { STAGE_LABELS } from "@/lib/types";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const lead = await getLead(id);
    if (!lead) return failure("Lead não encontrado.", 404);
    const [activities, drafts, reminders] = await Promise.all([
      listActivities(id),
      listDrafts(id),
      listReminders(id)
    ]);
    return ok({ lead, activities, drafts, reminders });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const current = await getLead(id);
    if (!current) return failure("Lead não encontrado.", 404);

    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = leadUpdateSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const patch = { ...parsed.data } as Record<string, unknown>;
    // Normaliza strings vazias para null
    for (const [k, v] of Object.entries(patch)) if (v === "") patch[k] = null;
    delete (patch as { scoreBreakdown?: unknown }).scoreBreakdown;

    const stageChanged = typeof patch.stage === "string" && patch.stage !== current.stage;

    let updated = await updateLead(id, patch as object);
    if (!updated) return failure("Falha ao atualizar.", 500);

    // Recalcula o score quando campos relevantes mudam.
    const relevance = ["segment", "city", "uf", "website", "phone", "email", "linkedin", "problemDescription", "bottleneckStep", "volumeApprox", "hypothesis", "verification"];
    if (relevance.some((k) => k in patch) || stageChanged) {
      const { score, breakdown } = scoreLead(updated);
      updated = (await updateLead(id, { score, scoreBreakdown: breakdown })) ?? updated;
    }

    if (stageChanged) {
      await addActivity({
        leadId: id,
        kind: "mudanca_etapa",
        summary: `Etapa: ${STAGE_LABELS[current.stage]} → ${STAGE_LABELS[updated.stage]}`,
        actor: auth.email
      });
    }

    await recordAdminAction(auth.email, "lead.update", id, stageChanged ? `etapa ${updated.stage}` : undefined);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const lead = await getLead(id);
    if (!lead) return failure("Lead não encontrado.", 404);
    await deleteLead(id);
    await recordAdminAction(auth.email, "lead.delete", id, lead.companyName);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}

export const dynamic = "force-dynamic";
