import { candidateImportSchema } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { importCandidates } from "@/lib/crm/prospect-service";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "prospect-import", 20, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = candidateImportSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const report = await importCandidates(parsed.data.candidates, {
      label: parsed.data.label,
      actor: auth.email
    });
    await recordAdminAction(
      auth.email,
      "prospect.import",
      undefined,
      `${report.created.length} criados, ${report.skipped.length} ignorados, ${report.provenanceRecorded} com procedência`
    );
    return ok(report);
  } catch (err) {
    return handleError(err);
  }
}
