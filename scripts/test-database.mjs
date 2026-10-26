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
console.log(" SANLE · DIAGNÓSTICO DE CONEXÃO AO SUPABASE");
console.log("=======================================================\n");

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`URL do Supabase:        ${url ? `Configurado (${url})` : "NÃO CONFIGURADO"}`);
console.log(`Chave Anon (Pública):   ${anonKey ? `Presente (${anonKey.slice(0, 12)}...)` : "NÃO CONFIGURADO"}`);
console.log(`Service Role (Admin):   ${serviceKey ? `Presente (${serviceKey.slice(0, 12)}...)` : "NÃO CONFIGURADO"}`);

if (!url || !anonKey) {
  console.log("\n[AVISO] Credenciais de Supabase incompletas em .env.local.");
  console.log("O sistema continua operando em modo local (armazenamento JSON em disco).");
  console.log("Assim que você inserir as chaves, execute: npm run db:test\n");
  process.exit(0);
}

async function testConnection() {
  const adminClient = serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;
  const publicClient = createClient(url, anonKey);

  console.log("\nTestando conexões e tabelas no banco de dados...\n");

  const tables = [
    "leads",
    "lead_activities",
    "outreach_drafts",
    "lead_reminders",
    "conversations",
    "knowledge_documents",
    "knowledge_chunks",
    "audit_logs",
    "admin_users",
    "prospect_pages"
  ];

  const client = adminClient || publicClient;

  for (const table of tables) {
    const start = Date.now();
    try {
      const { count, error } = await client.from(table).select("*", { count: "exact", head: true });
      const elapsed = Date.now() - start;
      if (error) {
        console.log(` ❌ Tabela "${table}": erro (${error.code || error.message}) [${elapsed}ms]`);
      } else {
        console.log(` ✔ Tabela "${table}": conectada com sucesso (${count ?? 0} registros) [${elapsed}ms]`);
      }
    } catch (err) {
      console.log(` ❌ Tabela "${table}": exceção (${err.message})`);
    }
  }

  console.log("\nDiagnóstico concluído!\n");
}

testConnection().catch((err) => {
  console.error("Erro fatal no diagnóstico:", err);
  process.exit(1);
});
