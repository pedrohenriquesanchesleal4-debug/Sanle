import { addActivity, createLead, createReminder } from "@/lib/db/repo";
import { diagnosticSchema, sanitizeText } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, zodFailure } from "@/lib/api";
import { normalizePhone } from "@/lib/utils";
import { makeProtocol } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Recebe o diagnóstico do site público. Coleta mínima, consentimento explícito,
 * honeypot anti-bot e rate limit. Cria o lead com procedência honesta.
 */
export async function POST(req: Request) {
  const limited = guard(req, "diagnostico", 5, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);

    const parsed = diagnosticSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const d = parsed.data;

    // Honeypot preenchido => bot. Responde 200 sem gravar (não revela a armadilha).
    if (d.website) return ok({ protocol: null, spam: true });

    const protocol = makeProtocol();
    const lead = await createLead({
      companyName: sanitizeText(d.companyName),
      segment: sanitizeText(d.segment),
      contactName: sanitizeText(d.contactName),
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone ? normalizePhone(d.contactPhone) : null,
      problemDescription: sanitizeText(d.problemDescription),
      bottleneckStep: d.bottleneckStep ? sanitizeText(d.bottleneckStep) : null,
      volumeApprox: d.volumeApprox ? sanitizeText(d.volumeApprox) : null,
      currentSystem: d.currentSystem ? sanitizeText(d.currentSystem) : null,
      protocol,
      consent: true,
      stage: "identificado",
      priority: "alta",
      tags: ["site", "diagnostico"],
      source: {
        provider: "site",
        providerId: protocol,
        url: "/diagnostico",
        collectedAt: new Date().toISOString(),
        note: "Formulário de diagnóstico do site público — com consentimento."
      },
      verification: "nao_verificado",
      nextAction: "Revisar diagnóstico e preparar primeiro contato",
      nextActionAt: new Date(Date.now() + 86400000).toISOString()
    });

    await addActivity({
      leadId: lead.id,
      kind: "sistema",
      summary: "Diagnóstico recebido pelo site",
      detail: `Protocolo ${protocol}. Segmento: ${d.segment}.`,
      actor: "site"
    });

    await createReminder({
      leadId: lead.id,
      title: `Responder diagnóstico ${protocol} (${sanitizeText(d.companyName)})`,
      dueAt: new Date(Date.now() + 86400000).toISOString()
    });

    return ok({ protocol, leadId: lead.id });
  } catch (err) {
    return handleError(err);
  }
}
