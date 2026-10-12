import { z } from "zod";
import { updateReminder } from "@/lib/db/repo";
import { failure, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({ done: z.boolean().optional(), title: z.string().trim().max(200).optional(), dueAt: z.string().trim().max(40).optional() });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);
    const updated = await updateReminder(id, parsed.data as Record<string, never>);
    if (!updated) return failure("Lembrete não encontrado.", 404);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}
