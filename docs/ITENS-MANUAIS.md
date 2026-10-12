# Sanle — Itens Manuais (ação humana/externa)

> Este documento lista **somente** o que exige ação manual ou externa: credenciais
> a obter, decisões jurídicas/LGPD, requisitos de deploy e aprovações. Tudo que é
> automático por código está em `CONFIGURACAO-APIS.md` / `CUSTOS-E-LIMITES.md` /
> `CHECKLIST-COMPLIANCE.md`.

---

## 1. Credenciais e provisionamento (uma vez por ambiente)

| Item | Onde obter | Onde preencher |
|---|---|---|
| E-mails admin (`SANLE_ADMIN_EMAILS`) | Decisão do operador (quem tem acesso ao painel) | `.env.local` / plataforma |
| Projeto Supabase + URL/anon/service_role keys | [supabase.com](https://supabase.com) — criar projeto, região próxima ao público | `.env.local` |
| Aplicação das migrations `supabase/migrations/*.sql` | — | `supabase db push` **ou** SQL Editor (ordem numérica; **6 arquivos** desde `20261012000500_audit_logs_append_only.sql`) |
| Chave da IA (`SANLE_AI_API_KEY`) | OpenAI / Anthropic / provedor compatível — somente se for usar IA paga | `.env.local` |
| Chave Google Places (`GOOGLE_PLACES_API_KEY`) | Google Cloud → Places API — somente se for usar (pago) | `.env.local` + `GOOGLE_PLACES_ENABLED=true` |
| `OSM_USER_AGENT` com e-mail real | Sua conta/domínio (exigência das políticas OSM — **nunca** deixar genérico) | `.env.local` |

> Regra: todo serviço pago é **opt-in por env**. Não configure chave que não vai usar.

## 2. LGPD / jurídico (decisão do controlador/DPO)

| Item | Status atual | Ação manual requerida |
|---|---|---|
| Paginas `privacidade` e `termos` | Minuta técnica (conteúdo de produto) | **Revisão jurídica** antes de publicar como definitivo; ajustar razão social, CNPJ e e-mail do encarregado |
| DPO / Encarregado de Dados | Não nomeado | Indicar pessoa/canal; publicar e-mail de contato LGPD |
| Política de retenção | Não definida em número (sem TTL automatizado) | Definir prazo por categoria (ex.: leads sem conversão em X meses; conversas sem consentimento jamais persistidas) e incluir na política |
| Direito do titular (exclusão/dados) | Exclusão interna via admin (`DELETE /api/crm/leads/[id]`); **sem fluxo automatizado para titular** | Definir canal (e-mail do encarregado) e procedimento de resposta em até 15 dias; operador executa a exclusão manualmente |
| Base legal para retenção de `audit_logs` | Append-only por trigger (migration `...00500`) | Justificar retenção de segurança/auditoria (LGPD Art. 16, inc. II) e definir prazo de retenção + janela de manutenção para TRUNCATE por superuser |
| Consentimento | Diagnóstico exige `true` literal; chat persiste só com consentimento | Manter registro de consentimento (aplicação já guarda flag) e mecanismo de revogação associado ao fluxo de exclusão |

## 3. Deploy (ação do operador)

| Requisito | Por quê |
|---|---|
| **Proxy/plataforma que sobrescreva `X-Forwarded-For`/`X-Real-IP`** | O rate limit confia nesses headers; se o app ficar direto na internet, um atacante forja o IP e burla o limite por IP (o código usa hash de armazenamento + IP como mitigação parcial; Vercel/Cloudflare fazem a sobrescrita corretamente) |
| **TLS 1.2+ (idealmente 1.3)** nas origens | `HTTPS` obrigatório para HSTS e cookies seguros; app emite `Strict-Transport-Security` em produção |
| `NODE_ENV=production` | Desliga `SANLE_LOCAL_ADMIN` (painel sem auth apenas em dev) e expõe erros genéricos ao cliente |
| Região dos dados | Escolher região do Supabase/DB conforme jurisdição dos titulares (Brasil → `South America (São Paulo)` se disponível) |
| **Nunca** `SUPABASE_SERVICE_ROLE_KEY` em client/CI público | Exfiltração da chave = acesso total aos dados |

## 4. Aprovações de mudança de comportamento (não são automáticas)

| Mudança | Quem aprova |
|---|---|
| Habilitar Google Places (pago) | Operador (custos) |
| Habilitar IA paga no chat público | Operador (custo + qualidade + exposição) |
| Alterar modelo por finalidade | Operador |
| Nova integração de provedor de leads | Operador + revisão de segurança (SSRF/URLs de env, política de User-Agent) |
| Alterar `SANLE_ADMIN_EMAILS` | Operador |

## 5. Status da dívida de feature flags (transparência)

O painel `/admin/integracoes` **exibe** capacidades e flags de provedores lidos do env
(`src/lib/providers/flags.ts`, server-only). Não existe ainda **toggle persistido em runtime**
(ADR-0016, tabela `feature_flags`, pendente): a ativação de integrações é feita por variável de
ambiente + redeploy. Esta é uma limitação conhecida e documentada, não uma integração omitida.