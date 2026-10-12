"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Cliente Supabase do browser (null quando não configurado). */
export function getSupabaseBrowser() {
  if (!env.supabase.configured) return null;
  if (!client) {
    client = createBrowserClient(env.supabase.url, env.supabase.anonKey);
  }
  return client;
}
