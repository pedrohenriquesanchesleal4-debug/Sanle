# Sanle — Checklist de Verificação (Compliance Gate)

> Checklist final antes de considerar o app pronto para produção/uso real.
> Itens com ✅ já estão implementados e verificados; ⬜ exigem ação manual
> (detalhes em `ITENS-MANUAIS.md`).

---

## A. Segurança — Auth & Sessão

- [x] **Fail-closed**: `isAdminEmail` nega quando allowlist vazia; login faz `signOut()` + 403 para e-mail fora da allowlist
- [x] Cookies de sessão HttpOnly + SameSite=Lax (Supabase SSR); `secure` conforme padrão da lib
- [x] Rate limit no login (10/10min) e nas rotas sensíveis
- [x] Rota `/admin/*` protegida por middleware (cookie de auth) + `requireAdmin` em toda API de dados
- [x] `SANLE_LOCAL_ADMIN` bloqueado em produção (`NODE_ENV === "production"`)
- [ ] **Manual**: criar usuários reais no Supabase Auth e manter `SANLE_ADMIN_EMAILS` atualizada

## B. Segurança — Autorização & Dados

- [x] RLS **deny-by-default** em todas as tabelas do baseline (+ `lead_sources`, `integrations`, `knowledge_*`)
- [x] `revoke all from anon, authenticated`; dados só via `service_role` no servidor
- [x] Acesso a dados single-tenant: nenhum parâmetro de ownership vindo do cliente (sem IDOR)
- [x] `SUPABASE_SERVICE_ROLE_KEY` jamais em código client (varredura de `process.env` em arquivos `use client` = 0)
- [x] `.data/` (PII local) no `.gitignore`
- [ ] **Manual**: conferir no SQL Editor do Supabase que as migrations foram aplicadas e as RLS estão ativas (`select relrowse from pg_class` / tentar `select` com anon)

## C. Segurança — Input, API e Headers

- [x] Zod em 100% dos payloads de API
- [x] Rate limit em todas as rotas mutáveis (diagnostico 5/10min, chat público 20/5min, chat admin 60/10min, login 10/10min, CSV 10/10min, seed/import admin)
- [x] Validação de origem: rotas com sessão rejeitam `Origin` ≠ `Host` (403)
- [x] Upload CSV: 2MB máx, admin-only, sem gravação em disco (sem path traversal), conteúdo validado por schema
- [x] Headers: `Content-Security-Policy`, HSTS (prod), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP
- [x] `handleError` não vaza mensagens internas em produção (allowlist de erros de negócio)
- [x] Sem `dangerouslySetInnerHTML` inseguro (JSON-LD sanitizado com escape de `</script>`)
- [x] SSRF mitigado: URLs de provedores vêm de env, nunca do usuário; cache + pacing + circuit breaker
- [x] Dependências: sem CVE conhecida em uso crítico (verificar em pipeline com `npm audit`)

## D. LGPD

- [x] Coleta mínima: diagnóstico e chat capturam só o necessário (schema Zod estrito)
- [x] Finalidade declarada na página `` privacidade `` (minuta)
- [x] Consentimento explícito: diagnostico exige `true` literal; chat **não persiste** sem consentimento
- [x] Auditoria: `audit_logs` gravada em login admin, chat admin, importações, seed; **append-only por trigger** (migration `...00500`)
- [x] Trânsito: TLS 1.2+ (HSTS em produção)
- [ ] **Manual**: revisão jurídica de `privacidade`/`termos` (razão social, CNPJ, e-mail do encarregado)
- [ ] **Manual**: nomear DPO/encarregado e publicar canal de contato
- [ ] **Manual**: definir política de retenção por categoria (com prazo) e procedimento de exclusão do titular (≤ 15 dias)
- [ ] **Manual**: registrar base legal de retenção da trilha de auditoria (Art. 16, II) + janela de manutenção p/ TRUNCATE

## E. Custos (Free-First)

- [x] Default sem chaves: OSM (gratuito), IA determinística, armazenamento local
- [x] Google Places: opt-in com flag + chave + teto mensal; desligado por default
- [x] IA: teto diário `SANLE_AI_DAILY_BUDGET_USD`; kill-switches `SANLE_AI_PUBLIC_CHAT`/`SANLE_AI_ADMIN_CHAT`
- [x] Pacing/cache/circuit breaker protegem serviços gratuitos (política OSM)
- [ ] **Manual**: monitorar `/admin/integracoes` mensalmente; revisar `docs/CUSTOS-E-LIMITES.md`

## F. Configuração & Segredos

- [x] `.env.example` completo e **sem segredos**
- [x] `.env*` no `.gitignore`
- [x] Nenhuma chave hardcoded (varredura: 0 achados)
- [ ] **Manual**: definir `OSM_USER_AGENT` com e-mail real antes de usar OSM
- [ ] **Manual**: gerar credenciais reais apenas quando ativar cada serviço

## G. Qualidade & Pipeline

- [x] `npm run typecheck` — passa
- [x] `npm test` — 51 testes passando (AI, RAG, providers)
- [x] `npm run lint` — sem apontamentos bloqueantes (`next lint`)
- [x] `npm run seed` — script funcional (`scripts/seed-demo.mjs`)

## H. Documentação

- [x] `README.md` — instalação, Supabase, migrations, env, dev, build, seed
- [x] `docs/CUSTOS-E-LIMITES.md` — custos/limites/alternativas/desativação
- [x] `docs/CONFIGURACAO-APIS.md` — todas as variáveis de ambiente
- [x] `docs/ITENS-MANUAIS.md` — ação humana/externa
- [x] `.agents/memoria/decisoes.md` — ADR-0020 (Compliance Gate) registrando decisões e dívidas

## I. Auditoria Final Izanagi (2026-10-12) — assinatura

> Evidência empírica completa em `docs/RELATORIO-AUDITORIA-FINAL.md` e
> `.agents/memoria/RELATORIO_FINAL_SANLE.md` (ADR-0021).

- [x] `npm run typecheck` — **0 erros**
- [x] `npm test` — **51/51** aprovados (AI 14, RAG 11, providers 26)
- [x] `npm run build` — **38 rotas**, First Load JS 103 kB
- [x] `npm run lint` — **0 erros** (20 warnings não-bloqueantes de imports/vars não usados)
- [x] Varredura de segredos (`sk-`/`eyJ`/`AIza`/`NEXT_PUBLIC_*`) — **0 achados**
- [x] Varredura de stubs (`TODO`/`FIXME`/`placeholder`) — **0 reais**
- [x] Varredura anti-ai-slop (`Inter`/`purple`/gradiente/clichê) — **0 tells**
- [x] `console.log` em `src/` — **0**
- [x] Preservação de código existente — auditoria **aditiva**, sem remoções
- [x] Acessibilidade WCAG 2.2 AA — verificada por **inspeção estática**
  (skip link, `:focus-visible`, `prefers-reduced-motion`, landmarks, ARIA,
  alvos ≥24px, sem drag, auth sem teste cognitivo)
- [ ] **Ressalva de método**: `axe-core`/Playwright **não** disponíveis no
  ambiente — rodar `axe` em navegador antes do go-live (contraste 1.4.3, foco em runtime)

**Veredito:** `PASS_WITH_WARNINGS` — aprovado para uso; itens manuais são
pré-condição de produção.

---

## Pendências que precisam de decisão (não são bugs)

| # | Pendência | Risco se ignorada | Responsável |
|---|---|---|---|
| 1 | Revisão jurídica de privacidade/termos | LGPD não conformidade (multa/fluxo de reclamação) | Operador/advogado |
| 2 | Nomear encarregado (DPO) | Art. 41 LGPD — falta de canal ao titular | Operador |
| 3 | Política de retenção + exclusão do titular | Direito ao esquecimento (Art. 18) sem processo | Operador |
| 4 | `feature_flags` persistida (ADR-0016, RBAC) | Toggles só por env/deploy; sem RBAC por papel | Backlog |
| 5 | Rate-limit/cache/budget em memória (multi-instância) | Limites por instância em escala | Backlog (junto com G11) |
| 6 | CSP strict com nonce (hoje `unsafe-inline` p/ scripts/style) | Menor robustez contra XSS avançado com payload inline | Backlog |
| 7 | Proxy real (Vercel/Cloudflare) sobrescrevendo XFF | Rate limit por IP forjável se exposto direto | Deploy |