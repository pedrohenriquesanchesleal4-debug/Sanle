import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { logAudit, isAdminUser } from "@/lib/db/repo";

export const ADMIN_SESSION_COOKIE = "sanle_admin_session";

export type Session = {
  email: string;
  name?: string | null;
  isLocalDev: boolean;
};

export async function isAdminEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();

  // 1. Allowlist da ENV + e-mails fundadores padrão
  if (env.admin.emails.includes(normalized)) {
    return true;
  }

  // 2. Tabela admin_users no banco (gerenciável sem redeploy)
  try {
    const isDbAdmin = await isAdminUser(normalized);
    if (isDbAdmin) return true;
  } catch {
    // Tolerante a tabela inexistente ou inicialização de banco
  }

  return false;
}

export async function getSession(): Promise<Session | null> {
  // 1. Sessão via cookie administrativo direto (suporta login híbrido e fallback resiliente)
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (sessionCookie) {
      const normalized = decodeURIComponent(sessionCookie).trim().toLowerCase();
      if (await isAdminEmail(normalized)) {
        return {
          email: normalized,
          name: normalized === "admin@local" ? "Admin (local)" : "Administrador Sanle",
          isLocalDev: normalized === "admin@local"
        };
      }
    }
  } catch {
    // Ignorado fora de contexto de request
  }

  // 2. Sessão Supabase Auth
  const supabase = await getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user?.email) {
        const allowed = await isAdminEmail(data.user.email);
        if (!allowed) return null;
        return {
          email: data.user.email,
          name: (data.user.user_metadata?.name as string | undefined) ?? null,
          isLocalDev: false
        };
      }
    } catch {
      // Sem sessão válida — cai para o modo local se permitido.
    }
  }

  if (env.admin.localDevLogin && !env.isProduction && !env.supabase.configured) {
    return { email: env.admin.emails[0] ?? "admin@local", name: "Admin (local)", isLocalDev: true };
  }

  return null;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("NAO_AUTENTICADO");
  return session;
}

export async function recordAdminAction(actor: string, action: string, target?: string, detail?: string) {
  await logAudit({ actor, action, target: target ?? null, detail: detail ?? null });
}

export function authSetupHint(): string {
  if (env.supabase.configured) {
    return "Autenticação via Supabase ativa. Acesso restrito a administradores cadastrados.";
  }
  if (env.admin.localDevLogin && !env.isProduction) {
    return "Modo local de desenvolvimento ativo (SANLE_LOCAL_ADMIN=true).";
  }
  return "Acesso restrito.";
}
