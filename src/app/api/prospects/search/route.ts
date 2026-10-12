import { prospectSearchSchema } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { runProspectSearch, saveSearch } from "@/lib/crm/prospect-service";
import { ProviderUnavailableError } from "@/lib/providers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("list") === "1") {
      const { listSearches } = await import("@/lib/crm/prospect-service");
      return ok(await listSearches());
    }
    return failure("Use POST para buscar candidatos.", 400);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "prospect-search", 30, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = prospectSearchSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const input = parsed.data;

    const result = await runProspectSearch({
      city: input.city,
      uf: input.uf,
      district: input.district || undefined,
      category: input.category,
      terms: input.terms || undefined,
      limit: input.limit,
      provider: input.provider
    });

    if (input.save) {
      await saveSearch({
        label: input.label || `${input.category} — ${input.city}/${input.uf}`,
        city: input.city,
        uf: input.uf,
        district: input.district || null,
        category: input.category,
        terms: input.terms || null,
        limit: input.limit,
        provider: input.provider
      });
    }

    return ok(result);
  } catch (err) {
    if (err instanceof ProviderUnavailableError) return failure(err.message, 400);
    return handleError(err);
  }
}
