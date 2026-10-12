import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";
import { env } from "@/lib/env";
import { failure, guard, handleError, ok, readJson, zodFailure } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(200)
});

export async function POST(req: Request) {
  const limited = guard(req, "login", 10, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const supabase = await getSupabaseServer();
    if (!supabase) {
      if (env.admin.localDevLogin && !env.isProduction) {
        return ok({ mode: "local-dev", email: parsed.data.email });
      }
      return failure("Autenticação indisponível: configure o Supabase ou o modo local de desenvolvimento.", 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user?.email) return failure("E-mail ou senha inválidos.", 401);
    if (!isAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
      return failure("Esta conta não tem acesso ao painel.", 403);
    }
    return ok({ mode: "supabase", email: data.user.email });
  } catch (err) {
    return handleError(err);
  }
}
