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
