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