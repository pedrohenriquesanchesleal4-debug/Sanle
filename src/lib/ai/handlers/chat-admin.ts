import { z } from "zod";
import {
  addActivity,
  addMessage,
  createConversation,
  getConversation,
  getLead,
  listActivities,
  logAiRun,
  updateConversation
} from "@/lib/db/repo";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { answerInternal, answerInternalGrounded } from "@/lib/ai/assistant";
import { recordAdminAction } from "@/lib/auth";

/**
 * Assistente interno geral (`/api/chat/admin`) — exige admin.
 *
 * Duas modalidades, decididas pela presença de `leadId`:
 *  - com lead: briefing do lead (fatos do CRM + base), persistência opcional;
 *  - sem lead: Q&A fundamentado sobre a operação/base de conhecimento.
 *
 * O assistente lead-scoped existente (`/api/crm/assistant`) é mantido intacto.
 */
const adminChatSchema = z.object({
  question: z.string().trim().min(3, "Escreva uma pergunta.").max(1200),
  leadId: z.string().trim().min(1).optional(),
  conversationId: z.string().trim().min(1).optional(),
  persist: z.boolean().optional().default(false)
});

export async function postAdminChat(req: Request): Promise<Response> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "chat-admin", 60, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = adminChatSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const { question, leadId, persist } = parsed.data;

    const lead = leadId ? await getLead(leadId) : null;
    if (leadId && !lead) return failure("Lead não encontrado.", 404);

    const answer = lead
      ? await answerInternal(question, lead, {
          activities: (await listActivities(lead.id)).slice(0, 6).map((a) => `${a.createdAt.slice(0, 10)} — ${a.summary}`)
        })
      : await answerInternalGrounded(question);

    await logAiRun({
      kind: "chat_interno",
      provider: answer.provider,
      model: answer.model,
      ok: true,
      refId: lead?.id ?? null,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    if (persist) {
      let conversationId = parsed.data.conversationId;
      if (conversationId) {
        const existing = await getConversation(conversationId);
        if (!existing) conversationId = undefined;
      }
      if (!conversationId) {
        const conv = await createConversation({
          channel: "interno",
          leadId: lead?.id ?? null,
          status: "aberta",
          consent: true
        });
        conversationId = conv.id;
      }
      await addMessage({ conversationId, role: "user", content: question });
      await addMessage({
        conversationId,
        role: "assistant",
        content: answer.text,
        sources: answer.sources,
        confidence: answer.confidence
      });
      await updateConversation(conversationId, { status: "aberta" });

      if (lead) {
        await addActivity({
          leadId: lead.id,
          kind: "nota",
          summary: "Consulta ao assistente interno",
          detail: question.slice(0, 300),
          actor: auth.email
        });
      }
    }

    await recordAdminAction(auth.email, "chat.admin", lead?.id, question.slice(0, 120));
    return ok({ ...answer, leadId: lead?.id ?? null });
  } catch (err) {
    return handleError(err);
  }
}
