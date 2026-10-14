import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { createProspectPage, getLead } from "@/lib/db/repo";
import { siteUrl } from "@/content/brand";

const CreatePageSchema = z.object({
  leadId: z.string().optional().nullable(),
  slug: z.string().trim().min(2).max(100).optional(),
  empresa: z.string().trim().min(2).max(120),
  cidade: z.string().trim().max(100).optional(),
  nicho: z.string().trim().min(2).max(100),
  oportunidade: z.string().trim().max(500).optional().nullable()
});

export async function POST(req: NextRequest) {
  try {
    await requireSession();

    const body = await req.json();
    const parsed = CreatePageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Gerar slug limpo se não fornecido
    const baseSlug =
      data.slug ||
      data.empresa
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const page = await createProspectPage({
      slug: finalSlug,
      leadId: data.leadId,
      empresa: data.empresa,
      cidade: data.cidade || "Brasília",
      nicho: data.nicho,
      oportunidade: data.oportunidade
    });

    const fullUrl = `${siteUrl}/p/${page.slug}`;

    return NextResponse.json({
      ok: true,
      page,
      url: fullUrl
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    if (message === "NAO_AUTENTICADO") {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
