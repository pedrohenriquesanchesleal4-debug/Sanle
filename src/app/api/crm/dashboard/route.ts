import { allLeads, dashboardStats, listAudits, listReminders, recentActivities } from "@/lib/db/repo";
import { handleError, ok, requireAdmin } from "@/lib/api";
import { capabilityReport } from "@/lib/env";
import { findDuplicates } from "@/lib/db/repo";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const period = Number(url.searchParams.get("period") ?? 30);
    const [stats, activities, leads, reminders, audits] = await Promise.all([
      dashboardStats(period),
      recentActivities(10),
      allLeads(),
      listReminders(),
      listAudits(12)
    ]);
    const duplicates = findDuplicates(leads);
    const now = Date.now();
    return ok({
      stats,
      activities,
      reminders: {
        due: reminders.filter((r) => !r.done && new Date(r.dueAt).getTime() <= now).slice(0, 10),
        upcoming: reminders.filter((r) => !r.done && new Date(r.dueAt).getTime() > now).slice(0, 10)
      },
      duplicates: { groups: duplicates.length, leads: duplicates.reduce((s, g) => s + g.matches.length, 0) },
      capabilities: capabilityReport(),
      audits,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    return handleError(err);
  }
}
