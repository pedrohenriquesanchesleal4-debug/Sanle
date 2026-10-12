# Sanle — Custos e Limites (Free-First)

> Este documento lista **apenas serviços realmente referenciados pelo código**.
> Nada aqui é integração "ativa" por padrão: tudo que é pago/opcional exige
> ativação explícita (env + flag) — ver `CONFIGURACAO-APIS.md`.
>
> Fonte no código: `src/lib/env.ts`, `src/lib/ai/budget.ts`, `src/lib/providers/`.

---

## 1. OpenStreetMap — Overpass + Nominatim (DEFAULT, gratuito)

| Item | Valor |
|---|---|
| Custo | **Gratuito** (Open Data Commons ODbL) |
| Limite | Política de uso justo dos serviços OSM (sem contrato SLAs) |
| Duração | Indefinida enquanto respeitar políticas |
| Excedente | Não há "plano pago"; uso abusivo → bloqueio de IP/chave de host |
| Alternativa | Google Places (pago), CSV import, cadastro manual |
| Desativação | `OSM_ENABLED=false` (desliga tudo) · `OSM_NOMINATIM_ENABLED=false` (mantém Overpass) |

**Como o app protege o serviço (e seu IP):**

- `OSM_USER_AGENT` identificável — exigência das políticas OSM (`http.ts` envia em toda request);
- Pacing por host: mínimo `PROSPECT_MIN_INTERVAL_MS=1100` entre chamadas ao mesmo host (Nominatim exige ≥ 1,1 s);
- Cache em memória (`PROSPECT_CACHE_TTL_MS`/`PROSPECT_CACHE_MAX`) para não repetir consultas iguais;
- Circuit breaker: após 5 falhas consecutivas no host, pausa 60 s (`http.ts`);
- **429 nunca vai a retry** — reincidência em 429 leva a bloqueio nas políticas OSM.

---

## 2. Google Places API (PAGO, OPCIONAL — desligado por default)

| Item | Valor |
|---|---|
| Custo | **Pago** por requisição (tabela Google Maps Platform) — sem contrato, fatura no cartão |
| Limite | Teto mensal `GOOGLE_PLACES_MONTHLY_BUDGET_USD` (0 = sem teto — **evitar**) |
| Duração | Enquanto a chave estiver ativa e `GOOGLE_PLACES_ENABLED=true` |
| Excedente | Sem teto → custo imprevisível; com teto, o provedor para quando estimado o custo |
| Alternativa | OSM (gratuito), CSV import, cadastro manual |
| Desativação | `GOOGLE_PLACES_ENABLED=false` (default) **e** apagar `GOOGLE_PLACES_API_KEY` |

**Regra de ativação (defensiva):** só roda com `ENABLED=true` **E** chave presente; sem chave,
`ProviderUnavailableError` na hora (testado em `tests/providers.test.ts`). Ordem padrão de
prospecção é Free-First (`SANLE_PROSPECTING_FREE_FIRST=true`): OSM primeiro, Google só como
fallback quando habilitado.

---

## 3. IA Generativa (LLM) — OpenAI / Anthropic / OpenAI-compatível (OPCIONAL)

| Item | Valor |
|---|---|
| Custo | **Pago** por token (opcional) — sem chave, fallback determinístico (gratuito) |
| Limite | Teto diário `SANLE_AI_DAILY_BUDGET_USD` (USD). 0 = sem teto (modo local/free) |
| Modelos | Público/outreach → econômico (`SANLE_AI_PUBLIC_MODEL`); admin → qualidade (`SANLE_AI_ADMIN_MODEL`) |
| Excedente | Com teto, `LLMBudgetError` para de chamar o provedor no dia |
| Alternativa | Fallback determinístico (sem rede) — motor baseado em regras já implementado |
| Desativação | `SANLE_AI_PUBLIC_CHAT=false` (widget do site) · `SANLE_AI_ADMIN_CHAT=false` (painel) · apagar `SANLE_AI_API_KEY` |

**Custos reais por finalidade (adapter `http.ts`):**
chamadas têm timeout (`SANLE_AI_TIMEOUT_MS=30s`), retry com backoff + jitter (`SANLE_AI_MAX_RETRIES=2`),
teto de tokens de saída (`SANLE_AI_MAX_OUTPUT_TOKENS=900`) e de caracteres de entrada
(`SANLE_AI_MAX_INPUT_CHARS=12000`). O preço é estimado por modelo em `src/lib/ai/budget.ts`
e somado ao acumulador diário em memória (dívida G11: trocar por store persistente multi-instância).

> Chat público é o único caminho onde **visitante anônimo** consome IA: contido por
> rate limit (20/5min por IP/hash), sem persistência sem consentimento, e corpo limitado.

---

## 4. Supabase (OPCIONAL — Postgres + Auth + pgvector)

| Item | Free tier (referência 2026) | Pro |
|---|---|---|
| Postgres | 500 MB | escalonável (pago) |
| Auth | 50.000 MAU/mês | pago acima |
| Storage | 1 GB (não usado hoje — uploads só CSV em memória) | pago acima |
| Custo | **Gratuito** até os limites | ~US$ 25/mês a partir de planos pagos |
| Excedente | Pausa/degrada alguns recursos até voltar ao limite | fatura conforme uso |
| Alternativa | Modo local (`.data/sanle.json`) — zero custo | — |
| Desativação | Remover `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`/`SERVICE_ROLE_KEY` do env | — |

**RAG vetorial:** `SANLE_RAG_VECTOR=true` usa `pgvector` (extension include na migration
`20261012000100_knowledge_chunks_pgvector.sql`). Sem Supabase (`SANLE_RAG_VECTOR=false`),
a recuperação é em memória (dívida herdada do ADR-0011). O embedding remoto
(`SANLE_EMBED_MODEL`) só roda quando há LLM configurado.

---

## 5. Deploy (OPCIONAL)

| Plataforma | Custo referência | Limites notáveis |
|---|---|---|
| Vercel Hobby | **Gratuito** | bandwidth 100 GB/mês, serverless functions com timeout padrão; HSTS/headers fornecidos pelo app |
| Vercel Pro | ~US$ 20/mês | sem os limites Hobby |
| Self-host Node | custo da VM | você controla tudo |

O app não exige nenhum provedor específico de deploy (build estático + Node server).

---

## 6. Resumo: para nunca gastar sem querer

1. Mantenha `SANLE_PROSPECTING_FREE_FIRST=true` (default) — OSM gratuito primeiro;
2. **Não** defina `GOOGLE_PLACES_API_KEY` sem `GOOGLE_PLACES_ENABLED=true` **e** teto
   `GOOGLE_PLACES_MONTHLY_BUDGET_USD` > 0;
3. **Não** defina `SANLE_AI_API_KEY` antes de decidir o teto `SANLE_AI_DAILY_BUDGET_USD`;
4. Confira mensalmente o painel `/admin/integracoes` (exibe capabilities/config — sem segredos)
   e `docs/CHECKLIST-COMPLIANCE.md` item "Custos".

---

## 7. Dívidas de custo registradas (backlog)

- **G11** — acumulador diário de custo de IA é em memória (`budget.ts`): não sobrevive a
  múltiplas instâncias/restart. Trocar por store persistente (Upstash/Postgres) quando escalar.
- **Rate-limit em memória** (`src/lib/rate-limit.ts`): mesma limitação multi-instância;
  trocar por Redis/Upstash no mesmo momento da G11.
- **Cache em memória** de provedores (`cache.ts`): idem para multi-instância.