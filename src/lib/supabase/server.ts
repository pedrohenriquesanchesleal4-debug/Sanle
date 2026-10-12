import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Cliente Supabase para Server Components / Route Handlers (lê cookies de sessão).
 * Retorna null quando o Supabase não está configurado — o app degrada para o
 * armazenamento local em vez de quebrar.
 */
export async function getSupabaseServer() {
  if (!env.supabase.configured) return null;
  const cookieStore = await cookies();
  return createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado de um Server Component (somente leitura de cookies) — ignorado.
        }
      }
    }
  });
}

/** Cliente com service role (só no servidor, nunca no browser). */
export async function getSupabaseAdmin() {
  if (!env.supabase.admin) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(env.supabase.url, env.supabase.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
