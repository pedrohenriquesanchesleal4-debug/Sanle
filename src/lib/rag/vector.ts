/**
 * Utilidades de vetor — PURAS (sem env, sem I/O).
 *
 * Motivo de existir: `supabase-js` serializa `number[]` como **array JSON**, e o
 * PostgREST **não** converte isso para `vector` sozinho. O pgvector exige o
 * literal textual `'[1,2,3]'`. Esta é a única tradução do app, testável e pura.
 *
 * Compatibilidade com ADR-0011 (Expand-Contract): o pgvector usa `vector(1536)`
 * fixo; o fallback local (`sanle-local-hash-256`) NÃO alimenta a coluna vetorial.
 */

/** Dimensão fixa da coluna `knowledge_chunks.embedding_vec` (migration #2). */
export const PGVECTOR_DIM = 1536;

/** Dimensão do fallback local por hash (não semântico, não vetorial no banco). */
export const LOCAL_EMBED_DIM = 256;

/**
 * Dimensões conhecidas por modelo de embedding remoto. Serve para decidir se um
 * vetor pode ir para `embedding_vec vector(1536)` — modelo fora do mapa é tratado
 * como desconhecido (o vetor real decide), nunca presumido.
 */
export const KNOWN_EMBED_DIMS: Record<string, number> = {
  "text-embedding-3-small": 1536,
  "text-embedding-3-large": 3072,
  "text-embedding-ada-002": 1536
};

/** Dimensão declarada de um modelo, ou `null` se desconhecida. */
export function embedDimOfModel(model: string): number | null {
  return KNOWN_EMBED_DIMS[model] ?? null;
}

/** Um vetor só é gravável em `embedding_vec` quando tem exatamente 1536 dims. */
export function isPgvectorCompatible(vec: readonly number[]): boolean {
  return vec.length === PGVECTOR_DIM;
}

function finite6(n: number): number {
  if (!Number.isFinite(n)) return 0;
  // 6 casas decimais: reduz o payload do literal sem mudar a similaridade de forma
  // perceptível. Valores NaN/Infinity viram 0 (nunca produzem `[NaN,...]` inválido).
  return Math.round(n * 1e6) / 1e6;
}

/**
 * Serializa um vetor no literal aceito pelo pgvector: `[0.1,0.2,...]`.
 * Retorna `null` quando o vetor está vazio — gravar `[]` numa coluna
 * `vector(1536)` falharia; é melhor pular a escrita do que corromper o insert.
 */
export function toVectorLiteral(vec: readonly number[]): string | null {
  if (!vec.length) return null;
  return `[${vec.map(finite6).join(",")}]`;
}

/**
 * Faz o parse de um literal pgvector de volta para `number[]`. Usado apenas para
 * inspeção/diagnóstico — a recuperação via RPC devolve `score`, não o vetor.
 * Literal malformado devolve `[]` (nunca lança numa rota de API).
 */
export function fromVectorLiteral(literal: string): number[] {
  const inner = literal.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner) return [];
  const parts = inner.split(",");
  const out: number[] = [];
  for (const p of parts) {
    const n = Number(p.trim());
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}
