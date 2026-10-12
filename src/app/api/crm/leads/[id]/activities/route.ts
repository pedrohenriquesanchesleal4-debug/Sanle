import { z } from "zod";
import { addActivity, listActivities } from "@/lib/db/repo";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { sanitizeText } from "@/lib/schemas";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  kind: z.enum(["nota", "mudanca_etapa", "mensagem_gerada", "mensagem_enviada", "resposta", "reuniao", "proposta", "sistema"]),
  summary: z.string().trim().min(2).max(240),
  detail: z.string().trim().max(4000).optional().or(z.literal(""))
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    return ok(await listActivities(id));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const activity = await addActivity({
      leadId: id,
      kind: parsed.data.kind,
      summary: sanitizeText(parsed.data.summary),
      detail: parsed.data.detail ? sanitizeText(parsed.data.detail) : null,
      actor: auth.email
    });
    await recordAdminAction(auth.email, "lead.activity", id, parsed.data.kind);
    return ok(activity);
  } catch (err) {
    return handleError(err);
  }
}
