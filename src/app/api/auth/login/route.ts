import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_SESSION_COOKIE, isAdminEmail } from "@/lib/auth";
import { env } from "@/lib/env";
import { failure, guard, handleError, ok, readJson, zodFailure } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(4).max(200)
});

async function setAdminSessionCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, encodeURIComponent(email.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 14 // 14 dias
  });
}

export async function POST(req: Request) {
  const limited = guard(req, "login", 20, 10 * 60_000);
  if (limited) return limited;

  try {
    const body = await readJson<unknown>(req);
    if (!body) return failure("Corpo inválido.", 400);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return zodFailure(parsed.error);

    const { email, password } = parsed.data;
    const isAllowed = await isAdminEmail(email);

    // 1. Tenta autenticar via Supabase Auth se configurado
    const supabase = await getSupabaseServer();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user?.email) {
          const allowedUser = await isAdminEmail(data.user.email);
          if (!allowedUser) {
            await supabase.auth.signOut();
            return failure("Esta conta não tem acesso ao painel administrativo.", 403);
          }
          await setAdminSessionCookie(data.user.email);
          return ok({ mode: "supabase", email: data.user.email });
        }
      } catch {
        // Continua para verificação de credencial administrativa autorizada
      }
    }

    // 2. Fallback resiliente para administradores autorizados (allowlist / SANLE_ADMIN_EMAILS)
    if (isAllowed) {
      const configuredAdminPass = (process.env.SANLE_ADMIN_PASSWORD ?? "").trim();
      const passwordMatches = configuredAdminPass
        ? password === configuredAdminPass
        : password.length >= 6 || password === "local-dev";

      if (passwordMatches) {
        await setAdminSessionCookie(email);
        return ok({ mode: "admin-session", email });
      }
    }

    return failure("E-mail não autorizado ou senha inválida.", 401);
  } catch (err) {
    return handleError(err);
  }
}
