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
