import { z } from "zod";
import { addMessage, getConversation, listMessages, updateConversation } from "@/lib/db/repo";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { sanitizeText } from "@/lib/schemas";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const conv = await getConversation(id);
    if (!conv) return failure("Conversa não encontrada.", 404);
    return ok({ conversation: conv, messages: await listMessages(id) });
  } catch (err) {
    return handleError(err);
  }
}

const replySchema = z.object({
  content: z.string().trim().min(1).max(2000),
  status: z.enum(["aberta", "aguardando_resposta", "humano", "encerrada"]).optional(),
  summary: z.string().trim().max(600).optional(),
  needs: z.string().trim().max(600).optional(),
  nextAction: z.string().trim().max(300).optional()
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const conv = await getConversation(id);
    if (!conv) return failure("Conversa não encontrada.", 404);

    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const message = await addMessage({ conversationId: id, role: "system", content: sanitizeText(parsed.data.content), confidence: null });
    const updated = await updateConversation(id, {
      status: parsed.data.status ?? "aberta",
      summary: parsed.data.summary ?? conv.summary,
      needs: parsed.data.needs ?? conv.needs,
      nextAction: parsed.data.nextAction ?? conv.nextAction
    });
    await recordAdminAction(auth.email, "conversation.note", id);
    return ok({ message, conversation: updated });
  } catch (err) {
    return handleError(err);
  }
}

const patchSchema = z.object({
  status: z.enum(["aberta", "aguardando_resposta", "humano", "encerrada"]),
  leadId: z.string().trim().optional(),
  summary: z.string().trim().max(600).optional(),
  needs: z.string().trim().max(600).optional(),
  nextAction: z.string().trim().max(300).optional()
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const updated = await updateConversation(id, parsed.data);
    if (!updated) return failure("Conversa não encontrada.", 404);
    await recordAdminAction(auth.email, "conversation.update", id, parsed.data.status);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}
