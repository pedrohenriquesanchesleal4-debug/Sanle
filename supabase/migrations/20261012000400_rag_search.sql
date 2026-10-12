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
