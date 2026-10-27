#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const env = { ...loadEnvLocal(), ...process.env };

console.log("\n=======================================================");
console.log(" SANLE · CONFIGURAÇÃO DA TABELA PROSPECT_PAGES (SUPABASE)");
console.log("=======================================================\n");

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
-- 1. Cria a tabela prospect_pages
create table if not exists public.prospect_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  lead_id uuid references public.leads(id) on delete set null,
  empresa text not null,
  cidade text not null default 'Brasília',
  nicho text not null,
  oportunidade text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- 2. Índice por slug para busca O(1)
create index if not exists idx_prospect_pages_slug
  on public.prospect_pages (slug);

-- 3. RLS e permissões de segurança
alter table public.prospect_pages enable row level security;
revoke all on public.prospect_pages from anon, authenticated;

-- 4. Notifica o PostgREST para recarregar o schema cache imediatamente
notify pgrst, 'reload schema';
`;

console.log("Para sincronizar a tabela no seu projeto Supabase:");
console.log("1. Acesse https://supabase.com/dashboard/project/_/sql");
console.log("2. Cole e execute o seguinte script SQL:\n");
console.log(sql);
console.log("-------------------------------------------------------");
console.log("Nota: O Sales Hunter possui fallback transparente automático.");
console.log("Mesmo antes de rodar o SQL acima, a criação de páginas de demonstração");
console.log("funciona 100% no servidor através do armazenamento local seguro.");
console.log("-------------------------------------------------------\n");
