import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createProspectPage, encodeProspectPayload } from "@/lib/db/repo";
import { siteUrl } from "@/content/brand";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Payload inválido." }, { status: 400 });
    }

    const { leadId, empresa, cidade, nicho, oportunidade } = body as Record<string, unknown>;

    if (typeof empresa !== "string" || !empresa.trim()) {
      return NextResponse.json({ ok: false, error: "Nome da empresa é obrigatório." }, { status: 400 });
    }

    const cleanEmpresa = empresa.trim();
    const cleanCidade = typeof cidade === "string" && cidade.trim() ? cidade.trim() : "Brasília";
    const cleanNicho = typeof nicho === "string" && nicho.trim() ? nicho.trim() : "sua operação";
    const cleanOportunidade =
      typeof oportunidade === "string" && oportunidade.trim() ? oportunidade.trim() : null;

    const baseSlug = slugify(cleanEmpresa).slice(0, 48) || "empresa";
    const suffix = Math.random().toString(36).slice(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    const page = await createProspectPage({
      slug,
      leadId: typeof leadId === "string" ? leadId : null,
      empresa: cleanEmpresa,
      cidade: cleanCidade,
      nicho: cleanNicho,
      oportunidade: cleanOportunidade
    });

    const token = encodeProspectPayload({
      empresa: cleanEmpresa,
      cidade: cleanCidade,
      nicho: cleanNicho,
      oportunidade: cleanOportunidade
    });

    const origin = new URL(req.url).origin || siteUrl;
    const url = `${origin}/p/${page.slug}?d=${encodeURIComponent(token)}`;

    return NextResponse.json({
      ok: true,
      data: {
        page,
        url
      }
    });
  } catch (err) {
    console.error("[POST /api/admin/prospect-pages] Erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao gerar página personalizada." },
      { status: 500 }
    );
  }
}
