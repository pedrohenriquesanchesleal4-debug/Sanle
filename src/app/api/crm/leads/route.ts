import { createLead, listLeads, type LeadFilters } from "@/lib/db/repo";
import { leadCreateSchema } from "@/lib/schemas";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { scoreLead } from "@/lib/crm/scoring";
import { FUNNEL_STAGES, type FunnelStage } from "@/lib/types";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const stageParam = url.searchParams.get("stage") ?? undefined;
    const filters: LeadFilters = {
      q: url.searchParams.get("q") ?? undefined,
      stage: (FUNNEL_STAGES.some((s) => s.id === stageParam) ? (stageParam as FunnelStage) : undefined),
      segment: url.searchParams.get("segment") ?? undefined,
      city: url.searchParams.get("city") ?? undefined,
      priority: url.searchParams.get("priority") ?? undefined,
      source: url.searchParams.get("source") ?? undefined,
      sort: (url.searchParams.get("sort") as LeadFilters["sort"]) ?? "recentes",
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20)
    };
    const result = await listLeads(filters);
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "lead-create", 60, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = leadCreateSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const d = parsed.data;

    const lead = await createLead({
      companyName: d.companyName,
      tradeName: d.tradeName || null,
      category: d.category || null,
      segment: d.segment || d.category || null,
      city: d.city || null,
      uf: d.uf || null,
      address: d.address || null,
      website: d.website || null,
      phone: d.phone || null,
      email: d.email || null,
      linkedin: d.linkedin || null,
      hypothesis: d.hypothesis || null,
      notes: d.notes || null,
      priority: d.priority,
      stage: d.stage,
      tags: d.tags ?? [],
      source: { provider: "manual", collectedAt: new Date().toISOString(), note: "Cadastro manual no painel." }
    });

    const { score, breakdown } = scoreLead(lead);
    const { updateLead } = await import("@/lib/db/repo");
    const withScore = await updateLead(lead.id, { score, scoreBreakdown: breakdown });

    await recordAdminAction(auth.email, "lead.create", lead.id, lead.companyName);
    return ok(withScore ?? lead);
  } catch (err) {
    return handleError(err);
  }
}
