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
