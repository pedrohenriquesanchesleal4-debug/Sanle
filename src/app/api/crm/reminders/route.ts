import { createReminder, listReminders } from "@/lib/db/repo";
import { reminderSchema } from "@/lib/schemas";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { recordAdminAction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get("leadId") ?? undefined;
    const rows = await listReminders(leadId);
    return ok(rows.sort((a, b) => (a.done === b.done ? a.dueAt.localeCompare(b.dueAt) : a.done ? 1 : -1)));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = reminderSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    let dueAt = parsed.data.dueAt;
    if (parsed.data.afterBusinessDays) {
      const d = new Date();
      let added = 0;
      while (added < parsed.data.afterBusinessDays) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) added++;
      }
      dueAt = d.toISOString();
    }
    const reminder = await createReminder({
      leadId: parsed.data.leadId || null,
      title: parsed.data.title,
      dueAt
    });
    await recordAdminAction(auth.email, "reminder.create", parsed.data.leadId || undefined, parsed.data.title);
    return ok(reminder);
  } catch (err) {
    return handleError(err);
  }
}
