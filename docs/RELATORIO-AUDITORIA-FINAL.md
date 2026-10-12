# Sanle — Relatório de Auditoria Final (Compliance Gate Izanagi)

> **Data:** 2026-10-12
> **Auditor:** `/qa` (QA Engineer sênior — Izanagi AI)
> **Escopo:** verificação final antes de uso real — build, tipos, testes, lint,
> segurança, acessibilidade, anti-ai-slop, Free-First e consolidação de documentação.
> **Ambiente:** Node.js (Linux), Next.js 15.1, React 19, TypeScript 5.6, Vitest 2.1.

---

## 1. Sumário executivo

| Dimensão | Resultado | Evidência |
|---|---|---|
| `npm run typecheck` (`tsc --noEmit`) | ✅ **PASS** (0 erros) | saída vazia = sem erros |
| `npm test` (`vitest run`) | ✅ **PASS** (51/51) | 3 arquivos, 2.52s |
| `npm run build` (`next build`) | ✅ **PASS** (38 rotas) | First Load JS 103 kB (shared) |
| `npm run lint` (`next lint`) | ⚠️ **PASS com ressalva** (0 erros, 20 warnings) | imports/vars não usados |
| Segredos no código/versionados | ✅ **PASS** (0 achados) | varredura `sk-`, `eyJ`, `AIza`, `NEXT_PUBLIC_*` |
| Stubs / `TODO` / `FIXME` | ✅ **PASS** (0 reais) | matches são falsos positivos ("Todos") |
| RLS / autorização / server-only | ✅ **PASS** | migrations + `requireAdmin` em 22 rotas |
| Anti-ai-slop (UI pública/admin) | ✅ **PASS** (0 tells) | sem Inter, sem roxo/gradiente, sem clichê |
| Acessibilidade (WCAG 2.2 AA, estático) | ✅ **PASS** (com ressalva de método) | foco, landmarks, ARIA, reduced-motion |
| Free-First (roda sem chaves) | ✅ **PASS** | default OSM + IA determinística + storage local |

### Veredito final: **PASS_WITH_WARNINGS** ✅⚠️

O app está **pronto para uso real** com itens manuais externos pendentes
(credenciais, revisão jurídica — ver `docs/ITENS-MANUAIS.md`). Nenhum bloqueador
técnico. As ressalvas são **dívidas registradas e não-bloqueantes**: 20 warnings
de lint (higiene de imports) e ausência de suíte E2E/axe automatizada (a
acessibilidade foi verificada por inspeção estática, não por scanner).

---

## 2. Gates executados (evidência empírica)

### 2.1 Typecheck
```
$ npm run typecheck   # tsc --noEmit
> sanle@0.1.0 typecheck
> tsc --noEmit
(sem saída → 0 erros)
```

### 2.2 Testes (Vitest)
```
$ npm test
 ✓ tests/rag.test.ts        (11 tests)
 ✓ tests/ai.test.ts         (14 tests)
 ✓ tests/providers.test.ts  (26 tests)
 Test Files  3 passed (3)
 Tests       51 passed (51)
 Duration    2.52s
```

### 2.3 Build (Next.js)
```
$ npm run build
 ✓ Generating static pages (38/38)
 Route (app)  ... 38 rotas (site + admin + api)
 First Load JS shared by all: 103 kB
 ƒ Middleware: 34.2 kB
(sem erros; warnings de lint apenas)
```

### 2.4 Lint
```
$ npm run lint   # 0 erros · 20 warnings
```
Todas as 20 ocorrências são **higiene não-bloqueante**: imports/variáveis não
usados (`@typescript-eslint/no-unused-vars`) e 1 diretiva `eslint-disable`
obsoleta. Nenhum erro de correção, acessibilidade ou segurança.

<details>
<summary>Lista completa dos warnings (20)</summary>

- `src/app/(site)/page.tsx:38` — diretiva `react/no-danger` sem efeito (remover)
- `src/app/admin/(app)/abordagens/page.tsx:6` — `Panel` não usado
- `src/app/admin/(app)/assistente/page.tsx:5,6` — `Sparkles`, `Spinner` não usados
- `src/app/admin/(app)/conhecimento/page.tsx:4` — `BookOpen` não usado
- `src/app/admin/(app)/conversas/page.tsx:14` — `router` não usado
- `src/app/admin/(app)/integracoes/page.tsx:4` — `PlugZap` não usado
- `src/app/admin/(app)/leads/[id]/page.tsx:7,9,13` — `Plus`, `ExternalLink`, `EmptyState`, `STAGE_LABELS`
- `src/app/admin/(app)/prospects/page.tsx:4,5,8` — `Check`, `RefreshCw`, `Spinner`, `EmptyState`, `SearchResultItem`
- `src/app/api/crm/assistant/route.ts:2` — `getConversation` não usado
- `src/components/admin/LeadForm.tsx:10` — `CHANNELS` não usado
- `src/lib/providers/csv.ts:143` — `_query` não usado
</details>

### 2.5 Aviso de ambiente (não é do projeto)
`next lint`/`next build` reportam *"multiple lockfiles"* porque existe
`/home/pedro/package-lock.json` acima da raiz. É ruído do workspace da máquina,
não um defeito do repositório. Mitigação opcional: `outputFileTracingRoot` no
`next.config.mjs`.

---

## 3. Cobertura de testes — o que é e o que **não** é provado

**Coberto (51 testes, unitários de domínio puro):**
- RAG: chunking, embeddings locais (hash 256-dim), cosine, recuperação em memória.
- IA: guardrails (injeção de prompt, redação de PII/segredos), orçamento, provider.
- Provedores: dedupe, cache (TTL/eviction), pacing (≥1,1 s por host), flags,
  registry, CSV, escaping/normalização OSM.

**Não coberto (declarado com honestidade):**
- **Rotas de API** (integração) — sem teste de contrato HTTP.
- **Adaptador de tabela** (`SupabaseTable`/`LocalTable`) e **domínio de CRM**.
- **E2E / browser** — o projeto **não possui Playwright nem axe-core** instalados.
  Não há verificação automatizada de UI em navegador.

> Esto é a dívida já registrada em ADR-0020 (dívida #3). Recomendação:
> próxima onda = integração das rotas de API (Vitest + `Request` mock) antes de E2E.

### Sobre a auditoria de acessibilidade (método)
Não havia `axe-core`, Playwright nem ferramenta de browser disponível no
ambiente. **Não foi executado scanner automatizado.** A verificação de
acessibilidade abaixo é **estática/manual (inspeção de código)**, que cobre a
parcela que o `axe` não cobre (ordem de foco, `prefers-reduced-motion`, escolha
de landmarks) e que, por não rodar no DOM real, **não substitui** um `axe` no
navegador — declarado como ressalva de método.

---

## 4. Segurança

### 4.1 Autenticação e autorização
- **Fail-closed:** `isAdminEmail` nega quando `SANLE_ADMIN_EMAILS` está vazio.
- **Modo local** (`SANLE_LOCAL_ADMIN`) bloqueado em produção
  (`NODE_ENV === "production"`). Nunca finge ser produção.
- **Cobertura de guarda:** 22 das 28 rotas de API usam `requireAdmin`/`requireSession`.
  As 6 restantes são **intencionalmente públicas/autenticação** e todas têm
  `guard()` (rate limit + verificação de origem) ou são o próprio login/logout:
  - `diagnostico` (form público), `chat`/`chat/public` (assistente público),
    `auth/login`, `auth/logout` — todos com `guard()`.
  - `chat/admin` — protegido internamente por `requireAdmin()` + `guard(60/10min)`.
- **Sem IDOR:** app single-tenant; nenhum parâmetro de *ownership* vem do cliente.

### 4.2 Banco de dados (RLS)
- **RLS deny-by-default** em **todas** as tabelas (`leads`, `lead_activities`,
  `outreach_drafts`, `reminders`, `conversations`, `conversation_messages`,
  `knowledge_documents`, `knowledge_chunks`, `ai_runs`, `audit_logs`,
  `saved_searches`, `integrations`, `integration_logs`, `lead_sources`).
- `revoke all ... from anon, authenticated` em todas as tabelas.
- RPCs (`match_knowledge_chunks`, `match_knowledge_chunks_hybrid`) declaram
  `security invoker` (RLS vale) e `grant execute ... to service_role` apenas.
- `audit_logs` é **append-only por trigger** (`BEFORE UPDATE/DELETE` lança
  exceção, inclusive para `service_role`, que contorna RLS) — migration `...00500`.

### 4.3 Segredos e server-only
- **0 segredos hardcoded** (varredura `sk-…`, `eyJ…`, `AIza…`).
- `SUPABASE_SERVICE_ROLE_KEY`, `SANLE_AI_API_KEY`, `GOOGLE_PLACES_API_KEY`,
  `LINKEDIN_CLIENT_SECRET` lidos **só no servidor** (`src/lib/env.ts`) e usados
  só em `getSupabaseAdmin()` (server). Nenhuma chave com prefixo `NEXT_PUBLIC_`.
- `.env`, `.env*.local`, `.env.production` e `.data/` (PII) no `.gitignore`.

### 4.4 Superfície HTTP
- **Headers** (`next.config.mjs`): CSP (`default-src 'self'`), HSTS (só prod,
  1 ano), `X-Frame-Options: DENY`, `nosniff`, COOP/CORP `same-origin`,
  `Referrer-Policy`, `Permissions-Policy`, `X-Permitted-Cross-Domain-Policies: none`.
  Dívida consciente: CSP usa `'unsafe-inline'` (exigência de next/font + runtime;
  nonce é melhoria futura — pendência #6 do checklist).
- **Validação de origem:** `guard()` rejeita `Origin ≠ Host` (403) em rotas com sessão.
- **Erros:** `handleError` não vaza mensagens internas em produção (CWE-209).
- **XSS:** único `dangerouslySetInnerHTML` (JSON-LD) escapa `<` → `\u003c` (CWE-80).
- **SSRF:** URLs de provedores vêm de env, nunca do usuário; cache + pacing + circuit breaker.

### 4.5 LGPD
Coleta mínima (Zod estrito), consentimento explícito (diagnóstico exige `true`;
chat não persiste sem consentimento), auditoria em ações sensíveis, TLS. Os itens
que dependem de humano (revisão jurídica, DPO, retenção, exclusão do titular)
estão em `docs/ITENS-MANUAIS.md` — não são bugs de código.

### 4.6 Feature flags
Flags por env, com *default-on* para caminhos gratuitos e *default-off* para
pagos: `SANLE_AI_PUBLIC_CHAT`, `SANLE_AI_ADMIN_CHAT`, `SANLE_RAG_VECTOR`,
`GOOGLE_PLACES_ENABLED`, `OSM_ENABLED`, `SANLE_PROSPECTING_FREE_FIRST`.
Toggle persistido em runtime (RBAC) é ADR-0016, ainda no backlog — documentado.

---

## 5. Anti-AI-Slop (UI pública + admin)

Varredura por tells: **0 ocorrências** de `Inter`, `violet/purple/indigo`,
`bg-gradient-*`, e copy clichê ("build the future", "revolucione", "seamless").

**Escolhas intencionais confirmadas:**
- **Tipografia com personalidade:** Fraunces (display, eixos SOFT/WONK/opsz) +
  Space Grotesk (corpo) + IBM Plex Mono (dados) — nenhuma fonte default.
- **Paleta própria e quente:** `paper` (#F4F1EA), `ink` (#121110), `cobalt`
  (#2440FF, cor dominante), `signal` (#C8FF4D, acento ácido), `rust` (#B4462A).
- **Layout editorial:** seções `Hero → InvisibleWork → Transformation → Solutions
  → DemoFlow → Method → Cases → Faq → FinalCta`; SVG de fluxo animado
  (`flow-dash`), marquee, `fade-up`, `text-wrap: balance/pretty`.
- **Motion em momentos-chave** (não em tudo), com `prefers-reduced-motion` honrado.
- `rounded-2xl` aparece 9× em todo o app (uso pontual, não uniforme).

---

## 6. Acessibilidade (WCAG 2.2 AA — verificação estática)

| Critério | Estado | Evidência |
|---|---|---|
| `lang="pt-BR"` no `<html>` (3.1.1) | ✅ | `layout.tsx` |
| Skip link "Pular para o conteúdo" (2.4.1) | ✅ | `layout.tsx` (`#conteudo`) |
| Foco visível consistente (2.4.7/2.4.11) | ✅ | `:focus-visible` global, `outline 2px` |
| Landmarks semânticos (1.3.1/2.4.1) | ✅ | `<header>`, `<nav aria-label>`, `<main>`, `<aside>` |
| Controle por teclado (2.1.1) | ✅ | menu fecha com `ESC`; foco vai ao 1º link |
| `prefers-reduced-motion` (2.3.3) | ✅ | CSS global zera animação/transição |
| ARIA de estado (4.1.2) | ✅ | `aria-expanded`/`aria-controls` no menu e chat |
| Diálogo rotulado (4.1.2) | ✅ | chat `role="dialog"` + `aria-label` |
| Formulários rotulados (1.3.1/3.3.1) | ✅ | `role="alert"`/`role="status"`, `aria-label`, `sr-only (obrigatório)` |
| Imagens decorativas (1.1.1) | ✅ | ícones lucide com `aria-hidden` |
| Alvos de toque ≥24×24px (2.5.8) | ✅ por inspeção | botões `h-9 w-9`/`h-11 w-11`/`p-2`/`py-2.5` |
| Alternativa a arrastar (2.5.7) | ✅ N/A | não há interação de arrastar no produto |
| Auth sem teste cognitivo (3.3.8) | ✅ | e-mail/senha; sem CAPTCHA obrigatório |

**Ressalva:** verificação estática — **não** foi executado `axe-core`/Playwright.
Recomenda-se rodar `@axe-core/cli` ou Playwright + `axe` contra o site em
navegador antes do go-live, para capturar 1.4.3 (contraste), 4.1.2 em runtime e
a ordem de foco real.

---

## 7. Free-First e segurança de custo

- **Zero chaves = funciona:** site, painel (modo local), diagnóstico,
  qualificação via OSM, CSV, cadastro manual, chat determinístico, RAG em
  memória, auditoria e rate limit.
- **Pago é opt-in** (flag **e** chave): Google Places desligado por default.
- **Tetos:** `SANLE_AI_DAILY_BUDGET_USD` (IA) e
  `GOOGLE_PLACES_MONTHLY_BUDGET_USD` (prospecção).
- **Proteção de serviços gratuitos:** pacing (≥1,1 s), cache com TTL/eviction,
  circuit breaker (5 falhas → pausa 60 s), `429` nunca re-tentado, User-Agent OSM
  identificável. Detalhes em `docs/CUSTOS-E-LIMITES.md`.

---

## 8. Preservação de código existente

Auditoria **aditiva**: nenhum arquivo funcional foi removido. As migrations são
incrementais (`IF NOT EXISTS`, `expand` sem `drop`); a evolução da UI é por
seções (`ADR-0015`), sem rewrite. O código anterior foi mantido e estendido —
verificável por `git`/estrutura (`src/` preservado).

---

## 9. Dívidas e itens manuais (resumo)

**Dívidas técnicas (não-bloqueantes):**
1. 20 warnings de lint (imports não usados) — trivial, pode ser zerado.
2. Sem testes de integração de rotas / E2E / axe.
3. Rate limit/cache/budget em memória (single-instance) — trocar por
   Redis/Postgres ao escalar.
4. CSP com `'unsafe-inline'` (nonce é evolução futura).
5. `feature_flags` persistida + RBAC (ADR-0016, backlog).

**Itens manuais (ação humana/externa) — `docs/ITENS-MANUAIS.md`:**
credenciais Supabase/IA/Google, `OSM_USER_AGENT` real, revisão jurídica de
privacidade/termos, DPO/encarregado, política de retenção e fluxo de exclusão do
titular, proxy real sobrescrevendo `X-Forwarded-For`.

---

## 10. Conclusão

Todos os critérios de aceite foram atendidos: **build OK, typecheck OK, tests OK,
sem segredos, Free-First, identidade Sanle aplicada**. O único ponto de atenção
é a **higiene de lint** (20 warnings) e a **ausência de E2E/axe**, ambos
registrados como dívida. **Veredito: `PASS_WITH_WARNINGS`** — aprovado para uso,
com os itens manuais acima como pré-condição do go-live em produção.

> Assinado: `/qa` · 2026-10-12
