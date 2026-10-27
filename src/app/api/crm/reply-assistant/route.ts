import { z } from "zod";
import { getLead, logAiRun } from "@/lib/db/repo";
import { failure, guard, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { answerProspectReply } from "@/lib/ai/assistant";

export const runtime = "nodejs";

const schema = z.object({
  clientReply: z.string().trim().min(2).max(1000),
  leadId: z.string().trim().optional().nullable(),
  channel: z.enum(["whatsapp", "email"]).optional().default("whatsapp"),
  contextNotes: z.string().trim().max(500).optional()
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const limited = guard(req, "reply-assistant", 40, 5 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);

    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const { clientReply, leadId, channel, contextNotes } = parsed.data;

    let lead = null;
    if (leadId) {
      lead = await getLead(leadId);
    }

    const analysis = await answerProspectReply({
      clientReply,
      lead,
      channel,
      contextNotes
    });

    if (leadId) {
      await logAiRun({
        kind: "chat_interno",
        provider: analysis.provider,
        model: analysis.model,
        ok: true,
        refId: leadId,
        error: null,
        inputTokens: null,
        outputTokens: null
      });
    }

    return ok(analysis);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao processar análise da resposta";
    return failure(message, 500);
  }
}
