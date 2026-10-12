#!/usr/bin/env node
/**
 * Popula dados de demonstração chamando a API do app em execução.
 *
 * Requisitos:
 *  - `npm run dev` (ou build+start) rodando em NEXT_PUBLIC_SITE_URL;
 *  - `.env.local` com SANLE_ADMIN_EMAILS (e, no modo local, serve e-mail/password).
 *
 * Credenciais para login (`.env.local`):
 *  - Modo local (`SANLE_LOCAL_ADMIN=true`, sem Supabase):
 *      SANLE_SEED_EMAIL=<qualquer e-mail>
 *      SANLE_SEED_PASSWORD=<6+ caracteres>
 *  - Modo Supabase: usuário REAL cadastrado e presente em SANLE_ADMIN_EMAILS:
 *      SANLE_SEED_EMAIL=<email do admin>
 *      SANLE_SEED_PASSWORD=<senha real do usuário>
 *
 * Sem SANLE_SEED_*, o script tenta admin@local.dev / sanle-local-12345
 * (funciona apenas no modo local de dev).
 *
 * Nenhuma chave/segredo é lida aqui além das credenciais de seed — este script
 * NÃO deve conter segredos hardcoded.
 */
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnvLocal(), ...process.env };
const baseUrl = (env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const email = env.SANLE_SEED_EMAIL || env.SANLE_ADMIN_EMAILS?.split(",")[0] || "admin@local.dev";
const password = env.SANLE_SEED_PASSWORD || "sanle-local-12345";

function cookieJar(response) {
  if (typeof response.headers.getSetCookie === "function") {
    try {
      return response.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    } catch {
      /* fallback abaixo */
    }
  }
  return (response.headers.get("set-cookie") || "").split(",").map((c) => c.split(";")[0]).join("; ");
}

async function main() {
  console.log(`[seed] endpoint: ${baseUrl}`);
  console.log(`[seed] login como: ${email}`);

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    redirect: "manual"
  });
  const loginJson = await login.json().catch(() => ({}));
  if (!login.ok) {
    console.error(`[seed] login falhou (${login.status}):`, loginJson?.error || login.statusText);
    process.exit(1);
  }

  const cookies = cookieJar(login);
  const seed = await fetch(`${baseUrl}/api/seed`, {
    method: "POST",
    headers: { cookie: cookies }
  });
  const seedJson = await seed.json().catch(() => ({}));
  if (!seed.ok) {
    console.error(`[seed] falhou (${seed.status}):`, seedJson?.error || seed.statusText);
    process.exit(1);
  }

  console.log("[seed] ok —", JSON.stringify(seedJson.data ?? {}, null, 2));
}

main().catch((err) => {
  console.error("[seed] erro inesperado:", err instanceof Error ? err.message : err);
  process.exit(1);
});