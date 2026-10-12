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
