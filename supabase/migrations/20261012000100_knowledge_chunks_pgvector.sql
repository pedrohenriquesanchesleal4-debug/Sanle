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
