import { allLeads, findDuplicates } from "@/lib/db/repo";
import { handleError, ok, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const groups = findDuplicates(await allLeads());
    return ok({ groups, total: groups.length });
  } catch (err) {
    return handleError(err);
  }
}
