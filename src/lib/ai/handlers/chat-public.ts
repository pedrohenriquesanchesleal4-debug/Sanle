import { addMessage, createConversation, getConversation, listMessages, logAiRun, updateConversation } from "@/lib/db/repo";
import { chatSchema } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, zodFailure } from "@/lib/api";
import { answerPublic } from "@/lib/ai/assistant";
import { hasLLM } from "@/lib/ai/provider";

/**
 * Assistente público (site). Persiste a conversa SÓ com consentimento; sem
 * consentimento, responde de forma efêmera (nada gravado). Registra a execução
 * de IA em ambos os casos.
 *
 * O shape de resposta preserva os campos consumidos pelo `ChatWidget`
 * (conversationId, text, sources, confidence, provider, model, noProvider,
 * enoughContext, escalate, persisted, latencyMs, aiEnabled) e ACRESCENTA
 * `citations`, `facts` e `guardrails` (aditivo — consumidores antigos ignoram).
 */
export async function postPublicChat(req: Request): Promise<Response> {
  const limited = guard(req, "chat", 20, 5 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const { message, consent } = parsed.data;
    let { conversationId } = parsed.data;

    let history: { role: "user" | "assistant"; content: string }[] = [];
    if (conversationId) {
      const conv = await getConversation(conversationId);
      if (!conv) {
        conversationId = undefined;
      } else {
        const msgs = await listMessages(conversationId);
        history = msgs
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
      }
    }

    if (!conversationId && consent) {
      const conv = await createConversation({ channel: "site", consent: true, visitorLabel: "Visitante do site" });
      conversationId = conv.id;
    }

    if (conversationId) {
      await addMessage({ conversationId, role: "user", content: message });
    }

    const started = Date.now();
    const answer = await answerPublic(message, history);

    if (conversationId) {
      await addMessage({
        conversationId,
        role: "assistant",
        content: answer.text,
        sources: answer.sources,
        confidence: answer.confidence
      });
      await updateConversation(conversationId, {
        status: answer.escalate ? "humano" : "aguardando_resposta",
        needs: answer.escalate ? "Precisa de atendimento humano" : null
      });
    }

    // Nunca registramos o conteúdo do visitante sem consentimento; só metadados.
    await logAiRun({
      kind: "chat_publico",
      provider: answer.provider,
      model: answer.model,
      ok: true,
      refId: conversationId ?? null,
      error: null,
      inputTokens: null,
      outputTokens: null
    });

    return ok({
      conversationId: conversationId ?? null,
      text: answer.text,
      sources: answer.sources,
      confidence: answer.confidence,
      provider: answer.provider,
      model: answer.model,
      noProvider: answer.noProvider,
      enoughContext: answer.enoughContext,
      escalate: answer.escalate,
      citations: answer.citations ?? [],
      facts: answer.facts ?? [],
      guardrails: answer.guardrails ?? [],
      persisted: Boolean(conversationId),
      latencyMs: Date.now() - started,
      aiEnabled: hasLLM()
    });
  } catch (err) {
    return handleError(err);
  }
}
