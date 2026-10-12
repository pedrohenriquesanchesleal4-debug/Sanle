import { describe, it, expect } from "vitest";
import { chunkText } from "@/lib/rag/chunk";
import {
  PGVECTOR_DIM,
  LOCAL_EMBED_DIM,
  toVectorLiteral,
  fromVectorLiteral,
  isPgvectorCompatible,
  embedDimOfModel
} from "@/lib/rag/vector";
import { localEmbed, cosine, embedOne, LOCAL_EMBED_MODEL } from "@/lib/rag/embeddings";

describe("chunking (RAG)", () => {
  it("nunca corta no vazio e respeita o limite por janela", () => {
    const long = Array.from({ length: 40 }, (_, i) => `Parágrafo ${i} com conteúdo suficiente para ter tamanho.`).join("\n\n");
    const chunks = chunkText(long, 300, 60);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.content.trim().length).toBeGreaterThan(0);
      expect(c.content.length).toBeLessThanOrEqual(300);
    }
    // ordinais sequenciais e únicos
    expect(chunks.map((c) => c.ordinal)).toEqual(chunks.map((_, i) => i));
  });

  it("texto vazio → nenhum chunk", () => {
    expect(chunkText("   \n\n  ")).toEqual([]);
  });
});

describe("vetor pgvector (serialização)", () => {
  it("serializa no literal aceito pelo pgvector", () => {
    expect(toVectorLiteral([0.5, -1, 2])).toBe("[0.5,-1,2]");
  });

  it("rede de segurança: NaN/Infinity viram 0 (literal sempre válido)", () => {
    expect(toVectorLiteral([NaN, Infinity, 1])).toBe("[0,0,1]");
  });

  it("vetor vazio → null (nunca grava `[]` numa coluna vector)", () => {
    expect(toVectorLiteral([])).toBeNull();
  });

  it("round-trip literal ↔ number[]", () => {
    expect(fromVectorLiteral("[0.1,0.2,0.3]")).toEqual([0.1, 0.2, 0.3]);
    expect(fromVectorLiteral("lixo")).toEqual([]);
  });

  it("só vetores de 1536 dims alimentam embedding_vec", () => {
    expect(isPgvectorCompatible(new Array(PGVECTOR_DIM).fill(0))).toBe(true);
    expect(isPgvectorCompatible(new Array(LOCAL_EMBED_DIM).fill(0))).toBe(false);
  });

  it("dimensão conhecida por modelo", () => {
    expect(embedDimOfModel("text-embedding-3-small")).toBe(1536);
    expect(embedDimOfModel("modelo-desconhecido")).toBeNull();
  });
});

describe("embeddings (fallback local)", () => {
  it("localEmbed devolve vetor normalizado de 256 dims", () => {
    const v = localEmbed("automação de processos financeiros");
    expect(v).toHaveLength(LOCAL_EMBED_DIM);
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("cosine identidade = 1 e ortogonalidade = 0", () => {
    expect(cosine([1, 0], [1, 0])).toBeCloseTo(1, 6);
    expect(cosine([1, 0], [0, 1])).toBeCloseTo(0, 6);
    expect(cosine([0, 0], [1, 1])).toBe(0);
  });

  it("sem provedor configurado, embedOne usa o modelo local", async () => {
    const { vector, model } = await embedOne("documento de teste");
    expect(model).toBe(LOCAL_EMBED_MODEL);
    expect(vector).toHaveLength(LOCAL_EMBED_DIM);
  });
});
