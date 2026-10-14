import { z } from "zod";
import { failure, guard, handleError, ok, readJson, requireAdmin, zodFailure } from "@/lib/api";
import { createAdminUser, listAdminUsers, logAudit } from "@/lib/db/repo";

export const runtime = "nodejs";

const createAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(160),
  name: z.string().trim().max(160).optional(),
  role: z.enum(["admin", "operator", "viewer"]).default("admin"),
  active: z.boolean().default(true)
});

export async function GET(req: Request) {
  const limited = guard(req, "crm_admin_users_get", 60, 60_000);
  if (limited) return limited;

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const users = await listAdminUsers();
    return ok({ users });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  const limited = guard(req, "crm_admin_users_post", 30, 60_000);
  if (limited) return limited;

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);

    const parsed = createAdminSchema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const created = await createAdminUser(parsed.data);

    await logAudit({
      actor: auth.email,
      action: "admin_user_created",
      target: created.email,
      detail: `Usuário ${created.email} adicionado com papel ${created.role}.`
    });

    return ok({ user: created });
  } catch (err) {
    return handleError(err);
  }
}
