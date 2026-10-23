import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordLandingEvent } from "@/lib/db/repo";

const EventPayloadSchema = z.object({
  sessionId: z.string().min(2).max(100),
  evento: z.string().min(2).max(80),
  caminho: z.string().min(1).max(250),
  segmento: z.string().max(80).optional().nullable(),
  prospectSlug: z.string().max(80).optional().nullable(),
  meta: z.record(z.unknown()).optional().default({})
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EventPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { sessionId, evento, caminho, segmento, prospectSlug, meta } = parsed.data;

    await recordLandingEvent({
      sessionId,
      evento,
      caminho,
      segmento,
      prospectSlug,
      meta
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Analytics nunca deve retornar erro 500 para não quebrar sendBeacon
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
