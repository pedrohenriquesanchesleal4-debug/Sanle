import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { createInboundLead } from "@/lib/db/repo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const InboundLeadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  empresa: z.string().trim().min(2, "Empresa deve ter pelo menos 2 caracteres").max(120),
  whatsapp: z
    .string()
    .trim()
    .min(10, "WhatsApp deve ter pelo menos 10 dígitos")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Telefone inválido"),
  segmento: z.string().trim().min(2).max(100),
  dorTexto: z.string().trim().max(1000).optional().nullable(),
  consentimentoLgpd: z.boolean().refine((val) => val === true, {
    message: "Consentimento LGPD é obrigatório"
  }),
  utmSource: z.string().trim().max(100).optional().nullable(),
  utmMedium: z.string().trim().max(100).optional().nullable(),
  utmCampaign: z.string().trim().max(100).optional().nullable(),
  prospectSlug: z.string().trim().max(100).optional().nullable(),
  hp: z.string().optional().nullable() // Honeypot contra robôs
});

// Cache em memória de rate-limit por SHA-256 do IP (5 submissões por 15 min)
const RATE_LIMIT_CACHE = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const item = RATE_LIMIT_CACHE.get(ipHash);

  if (!item || now > item.expiresAt) {
    RATE_LIMIT_CACHE.set(ipHash, { count: 1, expiresAt: now + 15 * 60 * 1000 });
    return false;
  }

  if (item.count >= 5) {
    return true;
  }

  item.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const ipHash = crypto.createHash("sha256").update(rawIp + "sanle_salt").digest("hex");

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { ok: false, error: "Muitas requisições. Tente novamente em alguns minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = InboundLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot: se preenchido por robô, responder sucesso silencioso sem persistir
    if (data.hp && data.hp.trim().length > 0) {
      return NextResponse.json({ ok: true, leadId: "mock_success" });
    }

    const { inbound, lead } = await createInboundLead({
      nome: data.nome,
      empresa: data.empresa,
      whatsapp: data.whatsapp,
      segmento: data.segmento,
      dorTexto: data.dorTexto,
      consentimentoLgpd: data.consentimentoLgpd,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      prospectSlug: data.prospectSlug
    });

    const whatsappUrl = buildWhatsAppLink({
      empresa: data.empresa,
      segmento: data.segmento
    });

    return NextResponse.json({
      ok: true,
      inboundId: inbound.id,
      leadId: lead.id,
      whatsappUrl
    });
  } catch (err) {
    console.error("[api/site/inbound] Erro ao registrar lead:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao processar formulário" },
      { status: 500 }
    );
  }
}
