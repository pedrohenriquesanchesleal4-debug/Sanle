import { z } from "zod";
import { addActivity, addMessage, getConversation, getLead, listActivities, logAiRun, updateConversation } from "@/lib/db/repo";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { answerInternal } from "@/lib/ai/assistant";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  intent: z.string().trim().min(3).max(600),
  leadId: z.string().trim().min(1),
  conversationId: z.string().trim().optional(),
  persist: z.boolean().optional().default(true)
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "assistant-internal", 60, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const lead = await getLead(parsed.data.leadId);
    if (!lead) return failure("Lead não encontrado.", 404);

    const activities = await listActivities(lead.id);
    const answer = await answerInternal(parsed.data.intent, lead, {
      activities: activities.slice(0, 6).map((a) => `${a.createdAt.slice(0, 10)} — ${a.summary}`)
    });

    await logAiRun({
      kind: parsed.data.intent.toLowerCase().includes("resum") ? "resumo" : "chat_interno",
      provider: answer.provider,
      model: answer.model,
      ok: true,
      refId: lead.id,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    if (parsed.data.persist) {
      let conversationId = parsed.data.conversationId;
      if (!conversationId) {
        const { createConversation } = await import("@/lib/db/repo");
        const conv = await createConversation({ channel: "interno", leadId: lead.id, status: "aberta", consent: true });
        conversationId = conv.id;
      }
      await addMessage({ conversationId, role: "user", content: parsed.data.intent });
      await addMessage({
        conversationId,
        role: "assistant",
        content: answer.text,
        sources: answer.sources,
        confidence: answer.confidence
      });
      // Mantém a conversa interna "aberta" (não é fila de atendimento).
      await updateConversation(conversationId, { status: "aberta" });

      await addActivity({
        leadId: lead.id,
        kind: "nota",
        summary: "Consulta ao assistente interno",
        detail: parsed.data.intent.slice(0, 300),
        actor: auth.email
      });
    }

    await recordAdminAction(auth.email, "assistant.query", lead.id);
    return ok(answer);
  } catch (err) {
    return handleError(err);
  }
}
