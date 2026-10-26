-- ============================================================================
-- SANLE · SALES HUNTER — MIGRAÇÃO UNIFICADA E CONSOLIDADA PARA SUPABASE
-- ============================================================================
-- Este arquivo consolida todas as migrações do projeto em ordem estrita de dependência.
-- É 100% IDEMPOTENTE: seguro para rodar múltiplas vezes no Supabase SQL Editor.
-- Contém:
--   1. Tabelas estruturais (leads, activities, drafts, reminders, conversations, knowledge, audits, etc.)
--   2. Extensão pgvector e índices HNSW para busca semântica
--   3. Campos de integrações com provedores externos (OpenStreetMap / Google Places)
--   4. Rastreamento de fontes de leads (lead_sources)
--   5. Funções RPC de busca vetorial e busca híbrida
--   6. Trilha de auditoria append-only à prova de deleções
--   7. Tabela de administradores autorizados com RLS
--   8. Tabelas da landing page e páginas dinâmicas de demonstração 1-a-1 (/p/[slug])
-- ============================================================================


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000000_sanle_baseline.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — Baseline de schema (migration incremental #1)
-- ============================================================================
-- MOTIVO: `supabase/migrations/` estava VAZIO. O adaptador
--   `src/lib/db/adapter.ts` (TABLE_NAMES) referencia 11 tabelas que não eram
--   criadas por nenhum SQL. Um deploy no Supabase quebraria em toda leitura.
--
-- ESCOPO: cria as 11 tabelas referenciadas pelo código real, com:
--   - PK uuid (o app gera via crypto.randomUUID() em src/lib/db/local.ts),
--   - CHECK constraints para os "enums" que hoje são strings (types.ts),
--   - FKs explícitas + índices para 100% delas,
--   - índices para os filtros/ordenações observados em src/lib/db/repo.ts,
--   - RLS habilitado (deny-by-default; acesso apenas via service role).
--
-- INCREMENTAL E IDEMPOTENTE: tudo com IF NOT EXISTS. Não altera nada existente.
-- Compatível com o adaptador atual (chaves camelCase↔snake_case, jsonb p/ objetos,
-- text[] p/ arrays, SEM trigger de updated_at — o app é dono dos timestamps).
--
-- NOTA DE SEGURANÇA: o app só lê/escreve com service role (getSupabaseAdmin).
-- Habilitar RLS SEM policies nega anon/authenticated; service_role faz bypass.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. leads
-- Tabela central do CRM. Gerada de `type Lead` (src/lib/types.ts) + colunas
-- efetivamente escritas por createLead() (src/lib/db/repo.ts).
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id                  uuid        primary key,
  company_name        text        not null check (char_length(company_name) between 1 and 200),
  trade_name          text,
  category            text,
  segment             text,
  city                text,
  uf                  text        check (uf is null or char_length(uf) <= 4),
  address             text,
  website             text,
  phone               text,
  email               text,
  linkedin            text,
  -- LeadSource (objeto aninhado) → jsonb
  source              jsonb       not null default '{}'::jsonb,
  verification        text        not null default 'nao_verificado'
                        check (verification in ('nao_verificado','parcial','verificado','invalido')),
  last_verified_at    timestamptz,
  hypothesis          text,
  notes               text,
  stage               text        not null default 'identificado'
                        check (stage in (
                          'identificado','a_pesquisar','qualificado','primeiro_contato',
                          'respondeu','reuniao','proposta_enviada','negociacao',
                          'ganho','perdido','sem_prioridade')),
  priority            text        not null default 'media'
                        check (priority in ('alta','media','baixa')),
  owner               text,
  tags                text[]      not null default '{}',
  -- Contato do site / diagnóstico
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  problem_description text,
  bottleneck_step     text,
  volume_approx       text,
  current_system      text,
  protocol            text,
  consent             boolean     not null default false,
  score               numeric(5,2),
  score_breakdown     jsonb,
  next_action         text,
  next_action_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.leads is 'CRM — empresas/leads. Fonte: type Lead + createLead().';
comment on column public.leads.source is 'LeadSource (provider/providerId/url/collectedAt/note) em jsonb.';
comment on column public.leads.score_breakdown is 'ScoreFactor[] (cálculo de score) em jsonb.';

-- Índices para filtros e ordenações reais de repo.ts (listLeads/dashboardStats).
create index if not exists idx_leads_stage          on public.leads (stage);
create index if not exists idx_leads_segment        on public.leads (segment)        where segment is not null;
create index if not exists idx_leads_priority       on public.leads (priority);
create index if not exists idx_leads_owner          on public.leads (owner)          where owner is not null;
create index if not exists idx_leads_updated_at     on public.leads (updated_at desc);
create index if not exists idx_leads_score          on public.leads (score desc nulls last);
create index if not exists idx_leads_next_action_at on public.leads (next_action_at) where next_action_at is not null;
-- source.provider é filtrado como l.source.provider (jsonb path)
create index if not exists idx_leads_source         on public.leads using gin (source jsonb_path_ops);
create index if not exists idx_leads_tags           on public.leads using gin (tags);
-- dedupe/lookup (findDuplicates usa domínio/telefone/nome+cidade)
create index if not exists idx_leads_contact_email  on public.leads (lower(contact_email)) where contact_email is not null;
create index if not exists idx_leads_phone          on public.leads (phone) where phone is not null;
create unique index if not exists uq_leads_protocol on public.leads (protocol) where protocol is not null;

-- ---------------------------------------------------------------------------
-- 2. lead_activities (TABLE_NAMES["activities"])
-- ---------------------------------------------------------------------------
create table if not exists public.lead_activities (
  id         uuid        primary key,
  lead_id    uuid        not null references public.leads(id) on delete cascade,
  kind       text        not null
               check (kind in (
                 'nota','mudanca_etapa','mensagem_gerada','mensagem_enviada',
                 'resposta','reuniao','proposta','sistema')),
  summary    text        not null,
  detail     text,
  actor      text,
  created_at timestamptz not null default now()
);

comment on table public.lead_activities is 'Histórico por lead. deleteLead() remove as atividades (cascade).';

create index if not exists idx_lead_activities_lead_id_created
  on public.lead_activities (lead_id, created_at desc);
create index if not exists idx_lead_activities_created_at
  on public.lead_activities (created_at desc);

-- ---------------------------------------------------------------------------
-- 3. outreach_drafts (TABLE_NAMES["drafts"])
-- `sources` é string[] (drafts.sources) → text[]
-- ---------------------------------------------------------------------------
create table if not exists public.outreach_drafts (
  id          uuid        primary key,
  lead_id     uuid        not null references public.leads(id) on delete cascade,
  kind        text        not null,
  channel     text        not null
                check (channel in ('email','whatsapp','linkedin','ligacao','outro')),
  subject     text,
  body        text        not null,
  edited_body text,
  status      text        not null default 'rascunho'
                check (status in (
                  'rascunho','revisao_pendente','aprovado',
                  'enviado_externamente','resposta_registrada','cancelado')),
  owner       text,
  result      text,
  sources     text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.outreach_drafts is 'Mensagens geradas para revisão humana. Fonte: type OutreachDraft.';

create index if not exists idx_outreach_drafts_lead_id  on public.outreach_drafts (lead_id, created_at desc);
create index if not exists idx_outreach_drafts_status   on public.outreach_drafts (status);
create index if not exists idx_outreach_drafts_channel  on public.outreach_drafts (channel);

-- ---------------------------------------------------------------------------
-- 4. reminders (TABLE_NAMES["reminders"])
-- lead_id é opcional (type Reminder). Sem cascade: preserva o compromisso.
-- ---------------------------------------------------------------------------
create table if not exists public.reminders (
  id         uuid        primary key,
  lead_id    uuid        references public.leads(id) on delete set null,
  title      text        not null,
  due_at     timestamptz not null,
  done       boolean     not null default false,
  created_at timestamptz not null default now()
);

comment on table public.reminders is 'Lembretes com vencimento. Fonte: type Reminder.';

create index if not exists idx_reminders_lead_id on public.reminders (lead_id) where lead_id is not null;
create index if not exists idx_reminders_due_at  on public.reminders (due_at) where done = false;
create index if not exists idx_reminders_done    on public.reminders (done);

-- ---------------------------------------------------------------------------
-- 5. conversations (TABLE_NAMES["conversations"])
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id            uuid        primary key,
  channel       text        not null
                  check (channel in ('site','interno','whatsapp','email','linkedin')),
  status        text        not null default 'aberta'
                  check (status in ('aberta','aguardando_resposta','humano','encerrada')),
  lead_id       uuid        references public.leads(id) on delete set null,
  visitor_label text,
  consent       boolean     not null default false,
  summary       text,
  needs         text,
  next_action   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.conversations is 'Conversas (site/interno/canais). Fonte: type Conversation.';

create index if not exists idx_conversations_channel    on public.conversations (channel);
create index if not exists idx_conversations_status     on public.conversations (status);
create index if not exists idx_conversations_updated_at on public.conversations (updated_at desc);
create index if not exists idx_conversations_lead_id    on public.conversations (lead_id) where lead_id is not null;

-- ---------------------------------------------------------------------------
-- 6. conversation_messages (TABLE_NAMES["messages"])
-- ---------------------------------------------------------------------------
create table if not exists public.conversation_messages (
  id              uuid        primary key,
  conversation_id uuid        not null references public.conversations(id) on delete cascade,
  role            text        not null check (role in ('user','assistant','system')),
  content         text        not null,
  sources         text[],
  confidence      numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at      timestamptz not null default now()
);

comment on table public.conversation_messages is 'Mensagens de uma conversa. Fonte: type ConversationMessage.';

create index if not exists idx_conversation_messages_conv_created
  on public.conversation_messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- 7. knowledge_documents (TABLE_NAMES["knowledge"])
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_documents (
  id         uuid        primary key,
  title      text        not null,
  category   text        not null,
  content    text        not null,
  status     text        not null default 'rascunho'
               check (status in ('rascunho','indexado','desatualizado','erro')),
  version    integer     not null default 1 check (version >= 1),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.knowledge_documents is 'Base de conhecimento (RAG). seedKnowledge() é idempotente por title → unique.';

-- seedKnowledge() faz lookup por título: unique garante idempotência no banco.
create unique index if not exists uq_knowledge_documents_title on public.knowledge_documents (title);
create index if not exists idx_knowledge_documents_category   on public.knowledge_documents (category);
create index if not exists idx_knowledge_documents_status     on public.knowledge_documents (status);
create index if not exists idx_knowledge_documents_updated_at on public.knowledge_documents (updated_at desc);

-- ---------------------------------------------------------------------------
-- 8. knowledge_chunks (TABLE_NAMES["chunks"])
-- `embedding` é number[] hoje → jsonb (compatível 100% com o código atual).
-- A migration #2 (pgvector) adiciona embedding_vec vector(1536) SEM remover esta.
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_chunks (
  id              uuid        primary key,
  document_id     uuid        not null references public.knowledge_documents(id) on delete cascade,
  ordinal         integer     not null check (ordinal >= 0),
  content         text        not null,
  embedding       jsonb,
  embedding_model text,
  created_at      timestamptz not null default now()
);

comment on table public.knowledge_chunks is 'Trechos indexados. deleteKnowledgeDoc() remove os chunks (cascade).';
comment on column public.knowledge_chunks.embedding is 'Vetor em JSON (local 256-dim ou remoto). pgvector: ver embedding_vec (migration #2).';

create index if not exists idx_knowledge_chunks_document_id on public.knowledge_chunks (document_id, ordinal);
create index if not exists idx_knowledge_chunks_model       on public.knowledge_chunks (embedding_model) where embedding_model is not null;

-- ---------------------------------------------------------------------------
-- 9. ai_runs (TABLE_NAMES["aiRuns"])
-- ref_id é polimórfico (aponta p/ doc, lead, conversa...) → SEM FK.
-- ---------------------------------------------------------------------------
create table if not exists public.ai_runs (
  id            uuid        primary key,
  kind          text        not null
                  check (kind in (
                    'chat_publico','chat_interno','qualificacao','mensagem','resumo','embedding')),
  provider      text        not null,
  model         text        not null,
  input_tokens  integer     check (input_tokens is null or input_tokens >= 0),
  output_tokens integer     check (output_tokens is null or output_tokens >= 0),
  ok            boolean     not null default true,
  error         text,
  ref_id        uuid,
  created_at    timestamptz not null default now()
);

comment on table public.ai_runs is 'Telemetria de chamadas de IA. Fonte: type AiRun.';

create index if not exists idx_ai_runs_created_at on public.ai_runs (created_at desc);
create index if not exists idx_ai_runs_kind       on public.ai_runs (kind);
create index if not exists idx_ai_runs_ref_id     on public.ai_runs (ref_id) where ref_id is not null;

-- ---------------------------------------------------------------------------
-- 10. audit_logs (TABLE_NAMES["audits"])
-- Append-only por natureza. Sem FK (target é texto livre).
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id         uuid        primary key,
  actor      text        not null,
  action     text        not null,
  target     text,
  detail     text,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Trilha de auditoria do painel. Fonte: type AuditLog.';

create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_actor      on public.audit_logs (actor);
create index if not exists idx_audit_logs_action     on public.audit_logs (action);
create index if not exists idx_audit_logs_target     on public.audit_logs (target) where target is not null;

-- ---------------------------------------------------------------------------
-- 11. saved_searches (TABLE_NAMES["searches"])
-- ---------------------------------------------------------------------------
create table if not exists public.saved_searches (
  id         uuid        primary key,
  label      text        not null,
  city       text,
  uf         text,
  district   text,
  category   text        not null,
  terms      text,
  "limit"    integer     not null default 20 check ("limit" between 1 and 200),
  provider   text        not null,
  created_at timestamptz not null default now()
);

comment on table public.saved_searches is 'Buscas de prospecção salvas. Fonte: type SavedSearch. ("limit" é palavra reservada → quoted)';

create index if not exists idx_saved_searches_created_at on public.saved_searches (created_at desc);
create index if not exists idx_saved_searches_provider   on public.saved_searches (provider);

-- ---------------------------------------------------------------------------
-- RLS — deny-by-default. Toda leitura/escrita do app usa service role
-- (getSupabaseAdmin), que faz bypass de RLS. Sem policies = anon/authenticated
-- não enxergam nada. Policies para o allowlist (SANLE_ADMIN_EMAILS) podem ser
-- adicionadas depois, sem alterar esta migration.
-- ---------------------------------------------------------------------------
alter table public.leads                  enable row level security;
alter table public.lead_activities        enable row level security;
alter table public.outreach_drafts        enable row level security;
alter table public.reminders              enable row level security;
alter table public.conversations          enable row level security;
alter table public.conversation_messages  enable row level security;
alter table public.knowledge_documents    enable row level security;
alter table public.knowledge_chunks       enable row level security;
alter table public.ai_runs                enable row level security;
alter table public.audit_logs             enable row level security;
alter table public.saved_searches         enable row level security;

-- Reforço: revoga acesso de tabela para os papéis públicos do PostgREST.
revoke all on public.leads                 from anon, authenticated;
revoke all on public.lead_activities       from anon, authenticated;
revoke all on public.outreach_drafts       from anon, authenticated;
revoke all on public.reminders             from anon, authenticated;
revoke all on public.conversations         from anon, authenticated;
revoke all on public.conversation_messages from anon, authenticated;
revoke all on public.knowledge_documents   from anon, authenticated;
revoke all on public.knowledge_chunks      from anon, authenticated;
revoke all on public.ai_runs               from anon, authenticated;
revoke all on public.audit_logs            from anon, authenticated;
revoke all on public.saved_searches        from anon, authenticated;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000100_knowledge_chunks_pgvector.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — pgvector: coluna + índice + RPC de busca (migration incremental #2)
-- ============================================================================
-- PADRÃO EXPAND (fase 1 de 2): NADA é removido nem alterado.
--   - a coluna `embedding jsonb` (256-dim local / JSON atual) PERMANECE intacta;
--   - `embedding_vec vector(1536)` é ADITIVA e NULLABLE (só o provedor remoto
--     preenche — o modelo default é `text-embedding-3-small`, 1536 dimensões);
--   - o código atual (retrieve.ts brute-force + embeddings.ts local) continua
--     funcionando byte a byte, sem mudanças.
--
-- CONTRACT (fase 2, futuro): quando `retrieve.ts` tiver o caminho SupabaseRAG
-- usando `match_knowledge_chunks()`, o `embedding jsonb` pode ser deprecado.
-- Só então — nunca antes.
--
-- DIMENSÃO: fixar em 1536 evita o conflito local(256) × remoto(1536). O fallback
-- local continua em `embedding` (jsonb), pois um vetor de 256 dims NÃO é
-- compatível com coluna vector(1536). Ver ADR-0011 em decisoes.md.
--
-- Idempotente. Não bloqueia o runner (índice não-concurrent). Em tabela grande
-- já populada em produção, trocar por CREATE INDEX CONCURRENTLY manualmente
-- (fora de transação) para não travar escritas.
-- ============================================================================

-- Extensão vetorial (Supabase: o schema padrão já resolve como `extensions`).
create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- Coluna vetorial aditiva (nullable) + índice HNSW (cosine)
-- ---------------------------------------------------------------------------
alter table public.knowledge_chunks
  add column if not exists embedding_vec vector(1536);

comment on column public.knowledge_chunks.embedding_vec is
  'Vetor semântico 1536-dim (provedor remoto). NULL quando só há embedding local.';

-- HNSW: melhor recall/latência que ivfflat para bases que crescem; parcial para
-- ignorar NULLs (chunks ainda não reindexados pelo provedor remoto).
create index if not exists idx_knowledge_chunks_embedding_hnsw
  on public.knowledge_chunks
  using hnsw (embedding_vec vector_cosine_ops)
  where embedding_vec is not null;

-- ---------------------------------------------------------------------------
-- RPC de similaridade — porta única para busca vetorial no banco.
-- Parametrizada (sem concatenação de SQL) e security invoker (RLS vale).
-- ---------------------------------------------------------------------------
create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_count     integer default 5,
  min_score       double precision default 0.0
)
returns table (
  chunk_id       uuid,
  document_id    uuid,
  document_title text,
  content        text,
  score          double precision
)
language sql
stable
security invoker
-- `extensions` incluído no search_path: no Supabase o pgvector (tipo `vector` e
-- operador `<=>`) vive nesse schema. Sem isso a função não resolve o operador.
set search_path = public, extensions
as $$
  select
    c.id                        as chunk_id,
    c.document_id               as document_id,
    d.title                     as document_title,
    c.content                   as content,
    1 - (c.embedding_vec <=> query_embedding) as score
  from public.knowledge_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where c.embedding_vec is not null
    and (1 - (c.embedding_vec <=> query_embedding)) >= min_score
  order by c.embedding_vec <=> query_embedding
  limit greatest(match_count, 1);
$$;

comment on function public.match_knowledge_chunks is
  'Retorna top-K chunks por similaridade de cosseno (pgvector). score = 1 - distancia.';

-- Só o service role (usado pelo app) executa a função.
revoke all on function public.match_knowledge_chunks(vector, integer, double precision)
  from public, anon, authenticated;
grant execute on function public.match_knowledge_chunks(vector, integer, double precision)
  to service_role;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000200_integrations_forward.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — integrations + integration_logs (migration incremental #3)
-- ============================================================================
-- STATUS: FORWARD-LOOKING. Hoje NÃO existe persistência para integrações:
--   - `IntegrationStatus` (src/lib/types.ts) é DERIVADO de env/capabilities
--     em runtime (capabilityReport() + listProviders()); nunca é gravado.
--   - Não há Collection `integrations` em TABLE_NAMES (adapter.ts).
--
-- Estas tabelas preparam o terreno para: toggles persistidos (enabled),
-- estado de última tentativa/sucesso/erro e histórico de eventos — o que o
-- painel "Integrações" ainda só *exibe* em memória.
--
-- ADITIVA e idempotente: cria tabelas novas, não toca em nada existente.
-- Nenhum código atual as lê/escreve, então não há risco de regressão.
--
-- NOTA: `configured` NÃO é coluna — é derivado de credenciais/env em runtime,
-- nunca persistido (seria fonte de verdade duplicada e mentirosa).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- integrations — uma linha por provedor/canal (id = slug: osm, google_places,
-- llm, linkedin, whatsapp, email).
-- ---------------------------------------------------------------------------
create table if not exists public.integrations (
  id                text        primary key,               -- slug estável
  label             text        not null,
  enabled           boolean     not null default false,     -- toggle persistido
  requires_approval boolean     not null default false,
  note              text,
  last_attempt_at   timestamptz,
  last_success_at   timestamptz,
  last_error        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.integrations is
  'Toggles e estado de integrações (forward-looking). `configured` é runtime, não coluna.';

create index if not exists idx_integrations_enabled on public.integrations (enabled);

-- ---------------------------------------------------------------------------
-- integration_logs — histórico de eventos por integração.
-- ---------------------------------------------------------------------------
create table if not exists public.integration_logs (
  id             uuid        primary key,
  integration_id text        not null references public.integrations(id) on delete cascade,
  event          text        not null,   -- ex.: connect, sync, error, disable
  level          text        not null default 'info'
                   check (level in ('debug','info','warn','error')),
  message        text,
  detail         jsonb,
  created_at     timestamptz not null default now()
);

comment on table public.integration_logs is
  'Eventos de integração (forward-looking). Fonte futura para o painel.';

create index if not exists idx_integration_logs_integration_created
  on public.integration_logs (integration_id, created_at desc);
create index if not exists idx_integration_logs_level
  on public.integration_logs (level);

-- ---------------------------------------------------------------------------
-- RLS — deny-by-default (mesmo padrão do baseline).
-- ---------------------------------------------------------------------------
alter table public.integrations      enable row level security;
alter table public.integration_logs  enable row level security;

revoke all on public.integrations     from anon, authenticated;
revoke all on public.integration_logs from anon, authenticated;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000300_lead_sources.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — lead_sources (trilha de procedência) — migration incremental #4
-- ============================================================================
-- Objetivo: tornar a ORIGEM de cada lead explícita e auditável. Hoje a
-- procedência vive apenas embedada em `leads.source` (jsonb) — útil como
-- snapshot, mas não permite reconstruir a linhagem nem deduplicar por origem.
--
-- Esta tabela é APPEND-ONLY: uma linha por evento de coleta de um lead. Nunca
-- é feita update/delete por fluxo de aplicação; o cascade só dispara se o lead
-- for removido.
--
-- ADITIVA e idempotente: cria tabela nova, não toca em nada existente.
-- Consumida por: repo.ts (recordLeadSource/listLeadSources/listLeadSourcesForLead)
-- e por importCandidates() (gravação obrigatória por lead criado).
--
-- Mapeamento (types.ts → coluna): LeadSourceOrigin → origin;
-- provider/providerId/url/collectedAt/note/actor em snake_case.
-- ============================================================================

create table if not exists public.lead_sources (
  id           uuid        primary key,
  lead_id      uuid        not null references public.leads(id) on delete cascade,
  provider     text        not null,                     -- osm | google_places | csv | manual | site
  provider_id  text,                                     -- id na origem (ex.: "node/123")
  url          text,
  collected_at timestamptz not null,
  note         text,
  origin       text        not null default 'import'
                 check (origin in ('import','manual','form','seed')),
  actor        text,                                     -- operador responsável (auditoria)
  created_at   timestamptz not null default now()
);

comment on table public.lead_sources is
  'Trilha de procedência append-only (types.ts: LeadSourceRecord). Origem nunca é implícita.';

create index if not exists idx_lead_sources_lead_created
  on public.lead_sources (lead_id, created_at desc);
create index if not exists idx_lead_sources_provider
  on public.lead_sources (provider);
create index if not exists idx_lead_sources_created_at
  on public.lead_sources (created_at desc);
-- Deduplicação por identidade de origem (mesmo provider + provider_id).
create unique index if not exists uq_lead_sources_identity
  on public.lead_sources (provider, provider_id)
  where provider_id is not null;

-- ---------------------------------------------------------------------------
-- RLS — deny-by-default (mesmo padrão do baseline). O app usa service role
-- (getSupabaseAdmin), que faz bypass de RLS; anon/authenticated não enxergam nada.
-- ---------------------------------------------------------------------------
alter table public.lead_sources enable row level security;

revoke all on public.lead_sources from anon, authenticated;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000400_rag_search.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — Busca híbrida (léxica + vetorial) para o RAG (migration incremental #4)
-- ============================================================================
-- PADRÃO EXPAND: NADA é removido nem alterado.
--   - `match_knowledge_chunks()` (migration #2) PERMANECE intacta;
--   - esta migration adiciona um índice de texto (português) e uma RPC NOVA,
--     `match_knowledge_chunks_hybrid()`, que combina similaridade de cosseno
--     (pgvector) com relevância léxica (ts_rank). O app só usa a híbrida quando
--     há embedding; sem ele, cai no caminho em memória (retrieve.ts).
--
-- POR QUE HÍBRIDA: a busca puramente vetorial erra em termos exatos (nome de
-- produto, sigla, número de processo). Somar o sinal léxico corrige isso sem
-- abrir mão do recall semântico. `keyword_weight` é o botão de ajuste.
--
-- Idempotente. Índices não-concurrentes (bloqueiam escritas por instantes —
-- aceitável no runner; em base grande já populada, recriar CONCURRENTLY manual).
-- ============================================================================

create extension if not exists pg_trgm;

-- Índice full-text (português) — acelera o termo léxico da busca híbrida.
create index if not exists idx_knowledge_chunks_content_fts
  on public.knowledge_chunks
  using gin (to_tsvector('portuguese', content));

-- Índice trigram — acelera correspondência parcial/ILIKE em nomes/siglas.
create index if not exists idx_knowledge_chunks_content_trgm
  on public.knowledge_chunks
  using gin (content gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- RPC híbrida — porta única para busca combinada. Parametrizada (sem SQL
-- concatenado) e security invoker (RLS vale). `query_embedding` pode ser NULL
-- quando só há texto (degradação graciosa para busca léxica pura).
-- ---------------------------------------------------------------------------
create or replace function public.match_knowledge_chunks_hybrid(
  query_embedding vector(1536),
  query_text      text,
  match_count     integer default 5,
  min_score       double precision default 0.0,
  keyword_weight  double precision default 0.3
)
returns table (
  chunk_id       uuid,
  document_id    uuid,
  document_title text,
  content        text,
  score          double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with scored as (
    select
      c.id          as chunk_id,
      c.document_id as document_id,
      d.title       as document_title,
      c.content     as content,
      (
        coalesce(
          case
            when query_embedding is null or c.embedding_vec is null then 0
            else 1 - (c.embedding_vec <=> query_embedding)
          end,
          0
        )
        +
        coalesce(keyword_weight, 0) * ts_rank_cd(
          to_tsvector('portuguese', c.content),
          plainto_tsquery('portuguese', coalesce(query_text, ''))
        )
      ) as score
    from public.knowledge_chunks c
    join public.knowledge_documents d on d.id = c.document_id
  )
  select chunk_id, document_id, document_title, content, score
  from scored
  where score >= min_score
  order by score desc
  limit greatest(match_count, 1);
$$;

comment on function public.match_knowledge_chunks_hybrid is
  'Busca híbrida: cosseno (pgvector) + relevância léxica (ts_rank, português). keyword_weight ajusta o peso do termo exato.';

-- Só o service role (usado pelo app) executa a função.
revoke all on function public.match_knowledge_chunks_hybrid(vector, text, integer, double precision, double precision)
  from public, anon, authenticated;
grant execute on function public.match_knowledge_chunks_hybrid(vector, text, integer, double precision, double precision)
  to service_role;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000500_audit_logs_append_only.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — 20261012000500_audit_logs_append_only.sql
-- ----------------------------------------------------------------------------
-- Torna `audit_logs` append-only DE VERDADE no nível do banco (LGPD Art. 37 e
-- 42; NIST SP 800-92; trilha de auditoria confiável).
--
-- Antes, a imutabilidade era só convenção: o código da aplicação apenas insere
-- (`logAudit`), mas qualquer UPDATE/DELETE — inclusive via service_role, que
-- contorna RLS — conseguiria reescrever/apagar a trilha. Este trigger LANÇA
-- exceção em UPDATE/DELETE para QUALQUER papel, fechando a brecha.
--
-- Notas de operação:
--  * A tabela continua aceitando INSERT livremente (append).
--  * TRUNCATE não é bloqueado por este trigger (operação de manutenção).
--    Para retenção/exclusão em massa, definir política de retenção ANTES e
--    executar TRUNCATE apenas em janela de manutenção por superuser.
--  * Aplicar via `supabase db push` ou SQL Editor do dashboard.
-- ============================================================================

create or replace function public.prevent_audit_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'audit_logs é append-only: % bloqueado em % (tentativa via %)',
    tg_op, now(), current_user;
end;
$$;

drop trigger if exists trg_audit_logs_append_only on public.audit_logs;
create trigger trg_audit_logs_append_only
  before update or delete on public.audit_logs
  for each row execute function public.prevent_audit_mutation();

-- Guarda contra regressão da própria migração: reaplicar o arquivo deve falhar
-- de forma visível se a trigger sumir (não falha silenciosamente).
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_audit_logs_append_only'
      and tgrelid = 'public.audit_logs'::regclass
  ) then
    raise exception 'trigger trg_audit_logs_append_only não criada em audit_logs';
  end if;
end $$;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000600_admin_users.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — admin_users (Gestão de Administradores no Banco) — Migration #7
-- ============================================================================
-- MOTIVO:
--   Permite cadastrar, ativar e desativar administradores diretamente no Supabase,
--   sem exigir deploy de código ou alteração da variável de ambiente SANLE_ADMIN_EMAILS.
--   A env SANLE_ADMIN_EMAILS permanece ativa como bootstrap e fallback de segurança:
--   qualquer e-mail que esteja NA ENV OU NA TABELA (com active = true) tem acesso.
--
-- ESCOPO:
--   - Criação da tabela public.admin_users
--   - Índice para verificação rápida por email normalizado (lowercase)
--   - RLS deny-by-default com bypass para service_role (usado pelo servidor)
-- ============================================================================

create table if not exists public.admin_users (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null check (char_length(email) between 3 and 160),
  name        text        check (name is null or char_length(name) <= 160),
  role        text        not null default 'admin'
                check (role in ('admin', 'operator', 'viewer')),
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.admin_users is
  'Administradores com permissão de acesso ao painel do CRM Sanle. Gerenciável via banco/painel.';

-- Índice único por e-mail em minúsculas (insensível a maiúsculas)
create unique index if not exists uq_admin_users_email_lower
  on public.admin_users (lower(trim(email)));

-- Índice para busca rápida de e-mails ativos
create index if not exists idx_admin_users_lookup
  on public.admin_users (lower(trim(email)))
  where active = true;

-- ---------------------------------------------------------------------------
-- RLS — deny-by-default (mesmo padrão das demais tabelas Sanle)
-- Acesso de leitura/escrita exclusivo via service role no servidor.
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;

revoke all on public.admin_users from anon, authenticated;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- ARQUIVO DE ORIGEM: 20261012000600_landing_and_prospect_pages.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- SANLE — landing_inbound, landing_events, prospect_pages — Migration #6
-- ============================================================================
-- 1. leads_inbound: registros de conversão da landing page
-- 2. landing_events: telemetria analítica leve e agregada
-- 3. prospect_pages: páginas personalizadas (/p/[slug]) do Sales Hunter
-- ============================================================================

-- 1. LEADS INBOUND
create table if not exists public.leads_inbound (
  id                  uuid        primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  nome                text        not null,
  empresa             text        not null,
  whatsapp            text        not null,
  segmento            text        not null,
  dor_texto           text,
  consentimento_lgpd  boolean     not null default true,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  prospect_slug       text,
  status              text        not null default 'novo'
                        check (status in ('novo', 'em_atendimento', 'convertido', 'descartado'))
);

comment on table public.leads_inbound is
  'Conversões da landing page. RLS deny-by-default; escrita exclusiva via service role.';

create index if not exists idx_leads_inbound_created_at
  on public.leads_inbound (created_at desc);

create index if not exists idx_leads_inbound_whatsapp
  on public.leads_inbound (whatsapp);

alter table public.leads_inbound enable row level security;
revoke all on public.leads_inbound from anon, authenticated;

-- 2. LANDING EVENTS (telemetria própria)
create table if not exists public.landing_events (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  session_id    text        not null,
  evento        text        not null,
  caminho       text        not null,
  segmento      text,
  prospect_slug text,
  meta          jsonb       not null default '{}'::jsonb
);

comment on table public.landing_events is
  'Eventos de analytics próprios da landing page. RLS deny-by-default; escrita via service role.';

create index if not exists idx_landing_events_session
  on public.landing_events (session_id, created_at desc);

create index if not exists idx_landing_events_evento
  on public.landing_events (evento, created_at desc);

create index if not exists idx_landing_events_created_at
  on public.landing_events (created_at desc);

alter table public.landing_events enable row level security;
revoke all on public.landing_events from anon, authenticated;

-- 3. PROSPECT PAGES (páginas personalizadas /p/[slug])
create table if not exists public.prospect_pages (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  lead_id       uuid        references public.leads(id) on delete set null,
  empresa       text        not null,
  cidade        text        not null default 'Brasília',
  nicho         text        not null,
  oportunidade  text,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz
);

comment on table public.prospect_pages is
  'Páginas personalizadas geradas pelo Sales Hunter para envio a prospects (/p/[slug]).';

create index if not exists idx_prospect_pages_slug
  on public.prospect_pages (slug);

alter table public.prospect_pages enable row level security;
revoke all on public.prospect_pages from anon, authenticated;

