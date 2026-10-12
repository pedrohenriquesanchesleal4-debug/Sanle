# Sanle

Prospecção de leads com IA para agências e consultorias — diagnostica problemas de prospecção, qualifica leads, rastreia conversas e gera rascunhos de outreach, com assistente conversacional no site e no painel.

> **Postura Free-First:** o app roda **100% sem chaves** (armazenamento local + IA determinística + OpenStreetMap gratuito). Toda integração paga é opcional e exige ativação explícita por env/flag. Nada é inventado: o que não está configurado não aparece como "ativo".

---

## Stack

- **Next.js 15.1** (App Router, React 19, TypeScript estrito)
- **Tailwind CSS + GSAP** (UI do site e painel)
- **Zod** (schemas de entrada em todas as rotas)
- **Supabase** (`@supabase/ssr` + `supabase-js`) — *opcional*; sem isso o app usa armazenamento local em `.data/sanle.json` (gitignored)
- **Vitest** — 51 testes (`npm test`)
- Persistência em **Ports & Adapters**: `src/lib/db/adapter.ts` → `SupabaseTable` (Postgres + RLS deny-by-default via service role) ou `LocalTable` (JSON local)

---

## Pré-requisitos

- Node.js 20+ (fetch nativo para o seed)
- npm 10+

---

## Instalação

```bash
npm install
```

## Configuração

```bash
cp .env.example .env.local
```

Nenhuma variável é obrigatória. Veja `docs/CONFIGURACAO-APIS.md` para o papel de cada uma e `docs/CUSTOS-E-LIMITES.md` para custos/limites.

Para rodar **sem Supabase** (modo local, recomendado para começar):

```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SANLE_ADMIN_EMAILS=voce@exemplo.com
SANLE_LOCAL_ADMIN=true
```

> `SANLE_LOCAL_ADMIN=true` libera o painel SEM Supabase, com qualquer senha de 6+ caracteres. **NUNCA** ative em produção.

## Subir Supabase (opcional)

1. Crie um projeto em [supabase.com](https://supabase.com) (região próxima ao seu público; free tier suficiente para começar).
2. Aplique as migrations — todas em `supabase/migrations/`:

   ```bash
   # com o CLI local configurado
   supabase link --project-ref <REF>
   supabase db push
   ```

   Ou cole cada arquivo `supabase/migrations/*.sql` no **SQL Editor** do dashboard, na ordem numérica.
3. Em `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # server-only, nunca exposta
   SANLE_LOCAL_ADMIN=false
   ```

   > A `service_role` key contorna RLS por design (o app gerencia os dados no servidor).
   > `docker/systemd/edge functions`: **nunca** referencie `SUPABASE_SERVICE_ROLE_KEY` em código/arquivos client.

## Desenvolvimento

```bash
npm run dev        # http://localhost:3000
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
npm test           # vitest (51 testes)
```

## Build e produção

```bash
npm run build
npm start          # ou `next start -p $PORT`
```

Em produção, o app serve automaticamente headers de segurança: `Content-Security-Policy`, `Strict-Transport-Security` (HSTS, 1 ano), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Referrer-Policy` e `Permissions-Policy`.

## Dados de demonstração

Com o servidor rodando:

```bash
npm run seed
```

O script faz login via `/api/auth/login` e chama `POST /api/seed` (admin-only). Modo local: aceita `admin@local.dev`/qualquer senha (ou defina `SANLE_SEED_EMAIL`/`SANLE_SEED_PASSWORD`). Modo Supabase: precisa de um usuário real em `SANLE_ADMIN_EMAILS`. Detalhes no topo de `scripts/seed-demo.mjs`.

---

## Documentação

| Documento | Conteúdo |
|---|---|
| `docs/CUSTOS-E-LIMITES.md` | Custos por serviço, limites gratuitos, excedentes, alternativas e desativação (Free-First) |
| `docs/CONFIGURACAO-APIS.md` | Todas as variáveis de ambiente, papel, flag de ativação e fonte no código |
| `docs/ITENS-MANUAIS.md` | Itens que exigem ação humana/externa (credenciais, revisão jurídica, deploy) |
| `docs/CHECKLIST-COMPLIANCE.md` | Checklist de verificação de segurança, LGPD e compliance (assinado na seção I) |
| `docs/RELATORIO-AUDITORIA-FINAL.md` | Auditoria final (Compliance Gate): gates executados, segurança, a11y, anti-slop e veredito |
| `.agents/memoria/` | Memória do projeto (decisões ADR, arquitetura, schema atual) |

## Segurança (resumo)

- **Auth:** allowlist `SANLE_ADMIN_EMAILS` com *fail-closed*; sessão via cookies HttpOnly + SameSite=Lax; login com rate limit (10/10min) e logout ao detectar e-mail fora da allowlist.
- **Autorização:** rota `/admin/*` protegida por middleware + `requireAdmin` em **toda** API de dados (ownership implícito: a API é single-tenant).
- **RLS:** todas as tabelas com RLS deny-by-default + `revoke all from anon, authenticated`; acesso de dados exclusivo via service role no servidor.
- **Trilha de auditoria:** `audit_logs` **append-only por trigger no banco** (migration `20261012000500`), gravada em ações sensíveis (login, chat admin, importações, seed).
- **Input:** Zod em 100% dos payloads; sanitização de texto; rate limit por rota; validação de origem (Origin ≠ Host → 403) nas rotas com sessão.
- **LLM:** guardrails determinísticos (injeção de prompt, redação de PII/segredos), teto de custo diário (`SANLE_AI_DAILY_BUDGET_USD`) e fallback determinístico sem chave.
- **Provedores:** cache + pacing + circuit breaker + User-Agent identificável (política OSM); Google Places atrás de flag **e** chave; SSRF mitigado (URLs apenas de env, nunca do usuário).
- **Dados locais:** `.data/` é gitignored (nunca versionar PII de leads).

## LGPD (resumo)

Coleta mínima, finalidade declarada, consentimento explícito para diagnóstico/chat (persistência só com consentimento `true`), trânsito TLS 1.3, e trilha de auditoria. Itens que dependem de ação humana (revisão jurídica de `privacidade`/`termos`, DPO/encarregado, política de retenção, canal de exclusão de titular): veja `docs/ITENS-MANUAIS.md`.

---

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build de produção |
| `npm start` | Server de produção |
| `npm run lint` | Lint |
| `npm run typecheck` | Checagem de tipos |
| `npm test` | Vitest |
| `npm run seed` | Popula dados demo via API (`scripts/seed-demo.mjs`) |