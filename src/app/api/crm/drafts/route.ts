import { addActivity, createDraft, getLead, listDrafts, logAiRun } from "@/lib/db/repo";
import { outreachSchema } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { generateOutreach } from "@/lib/ai/assistant";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get("leadId") ?? undefined;
    const drafts = await listDrafts(leadId);
    return ok(drafts);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "draft-generate", 40, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = outreachSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const lead = await getLead(parsed.data.leadId);
    if (!lead) return failure("Lead não encontrado.", 404);

    const answer = await generateOutreach(lead, parsed.data.kind, parsed.data.channel, parsed.data.instructions || undefined);

    const draft = await createDraft({
      leadId: lead.id,
      kind: parsed.data.kind,
      channel: parsed.data.channel,
      subject: parsed.data.subject || null,
      body: answer.text,
      status: "revisao_pendente",
      owner: auth.email,
      sources: answer.sources
    });

    await addActivity({
      leadId: lead.id,
      kind: "mensagem_gerada",
      summary: `Rascunho gerado (${parsed.data.channel})`,
      detail: parsed.data.kind,
      actor: auth.email
    });

    await logAiRun({
      kind: "mensagem",
      provider: answer.provider,
      model: answer.model,
      ok: true,
      refId: lead.id,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    await recordAdminAction(auth.email, "draft.generate", lead.id, parsed.data.channel);
    return ok({ draft, answer });
  } catch (err) {
    return handleError(err);
  }
}
