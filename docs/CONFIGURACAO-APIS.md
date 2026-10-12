# Sanle — Configuração de APIs

> Fonte da verdade no código: `src/lib/env.ts` (lado servidor) e
> `src/content/brand.ts` (público). Toda credencial é lida **só no servidor**,
> exceto as que começam com `NEXT_PUBLIC_` (vão ao browser por design).
> Nenhuma variável é obrigatória — o app roda 100% sem chave (Free-First).

---

## Regras de ouro

1. **Copie `.env.example` → `.env.local`** e preencha apenas o que for usar.
2. **`NEXT_PUBLIC_*`** são públicas (build-time): só dados que podem ir ao browser
   (URL do site, anon key do Supabase, e-mails de contato). **Nunca** coloque
   `SUPABASE_SERVICE_ROLE_KEY`, `SANLE_AI_API_KEY`, `GOOGLE_PLACES_API_KEY`,
   `LINKEDIN_CLIENT_SECRET` com prefixo público.
3. **`.env*` está no `.gitignore`**: credenciais nunca versionam.
4. Toda integração opcional exige **flag de ativação explícita** (ver coluna "Ativação").

---

## Site / Brand (público — build-time)

| Variável | Papel | Ativação |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canônica do site; base do seed e do `connect-src` da CSP | sempre |
| `NEXT_PUBLIC_SANLE_EMAIL` | E-mail de contato exibido (footer, LGPD) | opcional (brand) |
| `NEXT_PUBLIC_SANLE_WHATSAPP` | WhatsApp exibido | opcional (brand) |
| `NEXT_PUBLIC_SANLE_LINKEDIN` | LinkedIn exibido | opcional (brand) |
| `NEXT_PUBLIC_SANLE_GITHUB` | GitHub exibido | opcional (brand) |

## Supabase (opcional — persistência Postgres + Auth)

| Variável | Papel | Ativação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto (pública; usada no browser p/ auth `getUser`) | todas juntas |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon (pública; **não** acessa dados — RLS deny-by-default) | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (**server-only**; gerencia dados no servidor) | idem |

> Sem as três → app usa armazenamento local em `.data/sanle.json` (gitignored).

## Acesso ao painel

| Variável | Papel | Ativação |
|---|---|---|
| `SANLE_ADMIN_EMAILS` | Allowlist de e-mails admin (separados por vírgula) — **fail-closed** | recomendada sempre |
| `SANLE_LOCAL_ADMIN` | Libera painel sem Supabase (dev only; `NODE_ENV != production`) | dev |

## IA generativa (opcional — fallback determinístico sem chave)

| Variável | Papel | Ativação |
|---|---|---|
| `SANLE_AI_PROVIDER` | `openai` \| `anthropic` \| `openai_compatible` \| `local` (+ aliases openrouter/groq/together/ollama/lmstudio) | com chave |
| `SANLE_AI_API_KEY` | Chave do provedor (server-only) | idem |
| `SANLE_AI_MODEL` | Modelo base (default `gpt-4o-mini`) | idem |
| `SANLE_AI_BASE_URL` | Endpoint custom (OpenAI-compatível) | idem |
| `SANLE_EMBED_MODEL` | Modelo de embedding RAG (default `text-embedding-3-small`) | idem |
| `SANLE_AI_PUBLIC_MODEL` / `SANLE_AI_ADMIN_MODEL` | Modelo por finalidade (público econômico / admin qualidade); sem override, usam `SANLE_AI_MODEL` | idem |

Governança de chamada:

| Variável | Papel | Default |
|---|---|---|
| `SANLE_AI_MAX_OUTPUT_TOKENS` | Teto de tokens de saída | 900 |
| `SANLE_AI_MAX_INPUT_CHARS` | Teto de caracteres de entrada | 12000 |
| `SANLE_AI_TIMEOUT_MS` | Timeout HTTP | 30000 |
| `SANLE_AI_MAX_RETRIES` | Retries (backoff + jitter); 0 desliga | 2 |
| `SANLE_AI_TEMPERATURE` | Temperatura | 0.3 |
| `SANLE_AI_DAILY_BUDGET_USD` | **Teto diário de custo** (0 = sem teto) | 0 |

Kill-switch de assistentes (sem deploy):

| Variável | Papel | Default |
|---|---|---|
| `SANLE_AI_PUBLIC_CHAT` | Liga/desliga o chat público (widget) | true |
| `SANLE_AI_ADMIN_CHAT` | Liga/desliga o chat admin (painel) | true |

## RAG / recuperação

| Variável | Papel | Default |
|---|---|---|
| `SANLE_RAG_VECTOR` | `true` = caminho vetorial (pgvector); `false` = recuperação em memória | true |
| `SANLE_RAG_TOP_K` | Nº de chunks recuperados | 5 |
| `SANLE_RAG_MIN_SCORE` | Score mínimo de similaridade | 0.06 |
| `SANLE_RAG_CONTEXT_MAX_CHARS` | Teto de contexto injetado | 4500 |

## Prospecção / provedores de leads

| Variável | Papel | Default |
|---|---|---|
| `SANLE_PROSPECTING_FREE_FIRST` | Ordem Free-First (OSM → outros) | true |
| `PROSPECT_CACHE_TTL_MS` | TTL do cache de respostas de provedores | 900000 |
| `PROSPECT_CACHE_MAX` | Teto de entradas do cache | 500 |
| `PROSPECT_MIN_INTERVAL_MS` | Pacing entre chamadas ao mesmo host (Nominatim ≥ 1100) | 1100 |
| `PROSPECT_HTTP_TIMEOUT_MS` | Timeout HTTP externo | 25000 |

## OpenStreetMap (gratuito, default)

| Variável | Papel | Default |
|---|---|---|
| `OSM_ENABLED` | Liga/desliga o provedor OSM inteiro | true |
| `OSM_OVERPASS_URL` | Endpoint Overpass | `https://overpass-api.de/api/interpreter` |
| `OSM_NOMINATIM_URL` | Endpoint Nominatim | `https://nominatim.openstreetmap.org` |
| `OSM_NOMINATIM_ENABLED` | Liga/desliga Nominatim (geocodificação) | true |
| `OSM_USER_AGENT` | User-Agent identificável (**exigência das políticas OSM**) | `SanleProspecting/1.0 (contato@...)` |
| `OSM_OVERPASS_TIMEOUT_SEC` | Timeout do Overpass | 25 |
| `OSM_MAX_PER_SEARCH` | Teto de resultados por busca | 200 |

## Google Places (PAGO, opcional — desligado por default)

| Variável | Papel | Default |
|---|---|---|
| `GOOGLE_PLACES_ENABLED` | Flag de ativação | false |
| `GOOGLE_PLACES_API_KEY` | Chave da API (server-only) | — |
| `GOOGLE_PLACES_MAX_RESULTS` | Teto de resultados (custo direto) | 20 |
| `GOOGLE_PLACES_MONTHLY_BUDGET_USD` | Teto mensal em USD (0 = sem teto) | 0 |

> Regra: só roda com `ENABLED=true` **E** chave. Ordem Free-First coloca Google como fallback após OSM.

## LinkedIn (opcional — reservado, sem consumidor hoje)

| Variável | Papel |
|---|---|
| `LINKEDIN_CLIENT_ID` | OAuth client id (reservado) |
| `LINKEDIN_CLIENT_SECRET` | OAuth client secret (server-only, reservado) |

> Ainda **não há** fluxo OAuth LinkedIn implementado: as variáveis são reservadas e não ativam nada.

## Sem chaves, o que funciona?

- Site completo, painel de admin (modo local), diagnostico, qualificação de leads
  (OSM), CSV import, cadastro manual, chat **determinístico**, RAG em memória,
  auditoria, rate limit — tudo sem nenhuma credencial.

## Verificação rápida

- Validação do código: `npm run typecheck && npm test`.
- Painel `/admin/integracoes` exibe capabilities reais (sem segredos) — útil para conferir o que está ativo.
- `docs/CUSTOS-E-LIMITES.md` — custos e desativação de cada serviço.