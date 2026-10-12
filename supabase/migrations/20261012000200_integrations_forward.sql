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
