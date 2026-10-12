import { requireAdmin, ok, handleError } from "@/lib/api";
import { providerDescriptors, isFreeFirst } from "@/lib/providers";
import { cacheStats } from "@/lib/providers/cache";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Catálogo de provedores de leads (admin).
 *
 * Devolve a descrição serializável de cada provedor — incluindo `capabilities`
 * (free/paid/serverOnly/attribution) e se a flag o habilita AGORA. Nenhum
 * segredo é exposto: apenas o booleano `configured`. Serve à UI do painel de
 * Integrações para mostrar com honestidade o que está disponível no modo
 * Free-First e o que exige aprovação/custo.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    return ok({
      freeFirst: isFreeFirst(),
      attribution: env.prospecting.attribution,
      cache: cacheStats(),
      providers: providerDescriptors()
    });
  } catch (err) {
    return handleError(err);
  }
}
