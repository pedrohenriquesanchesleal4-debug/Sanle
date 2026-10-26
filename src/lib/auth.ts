import { env } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { logAudit, isAdminUser } from "@/lib/db/repo";

/**
 * Autenticação do painel.
 * - Com Supabase configurado: sessão real (e-mail/senha, magic link) + verificação híbrida
 *   (tabela admin_users OU allowlist SANLE_ADMIN_EMAILS na env).
 * - Sem Supabase: modo local de desenvolvimento, liberado APENAS quando
 *   SANLE_LOCAL_ADMIN=true e NODE_ENV != production. Nunca finge ser produção.
 */

export type Session = {
  email: string;
  name?: string | null;
  isLocalDev: boolean;
};

export async function isAdminEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();

  // 1. Allowlist da ENV (bootstrap / fallback permanente)
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

/** Explica como habilitar o acesso — sem vazar credenciais ou listas de e-mails. */
export function authSetupHint(): string {
  if (env.supabase.configured) {
    return "Autenticação via Supabase ativa. Acesso restrito a administradores cadastrados.";
  }
  if (env.admin.localDevLogin && !env.isProduction) {
    return "Modo local de desenvolvimento ativo (SANLE_LOCAL_ADMIN=true).";
  }
  return "Acesso restrito.";
}
