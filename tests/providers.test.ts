import { describe, it, expect, beforeEach } from "vitest";
import type { ProspectCandidate } from "@/lib/providers/types";
import { normalizeCandidate, dedupeCandidates, candidateDedupeKeys } from "@/lib/providers/dedupe";
import { cacheThrough, cacheGet, cacheSet, cacheClear, cacheStats } from "@/lib/providers/cache";
import { paced, __test as pacingTest } from "@/lib/providers/pacing";
import { providerFlag, isProviderFree } from "@/lib/providers/flags";
import { providerDescriptors, freeProviders, resolveProviderChain, getProviderOrDefault } from "@/lib/providers";
import { parseCsv, csvRowsToCandidates } from "@/lib/providers/csv";
import { __test as osmTest } from "@/lib/providers/osm";

function candidate(overrides: Partial<ProspectCandidate> = {}): ProspectCandidate {
  return {
    externalId: "node/1",
    companyName: "Acme Contabilidade",
    tradeName: null,
    category: "contábil",
    address: null,
    city: "Campinas",
    uf: "SP",
    website: null,
    phone: null,
    email: null,
    linkedin: null,
    lat: null,
    lon: null,
    source: { provider: "osm", providerId: "node/1", collectedAt: "2026-10-12T00:00:00.000Z" },
    facts: [],
    hypotheses: [],
    ...overrides
  };
}

describe("dedupe de candidatos", () => {
  it("remove o mesmo elemento OSM duplicado por providerId (node vs way)", () => {
    const a = candidate({ source: { provider: "osm", providerId: "way/9", collectedAt: "x" } });
    const b = candidate({ companyName: "outro nome", source: { provider: "osm", providerId: "way/9", collectedAt: "x" } });
    const { unique, removed } = dedupeCandidates([a, b]);
    expect(removed).toBe(1);
    expect(unique).toHaveLength(1);
  });

  it("deduplica por domínio mesmo com nome diferente", () => {
    const a = candidate({ website: "https://www.acme.com.br" });
    const b = candidate({ companyName: "ACME Serviços", website: "acme.com.br" });
    expect(dedupeCandidates([a, b]).unique).toHaveLength(1);
  });

  it("deduplica por telefone normalizado", () => {
    const a = candidate({ phone: "(19) 3333-4444" });
    const b = candidate({ phone: "1933334444" });
    expect(dedupeCandidates([a, b]).unique).toHaveLength(1);
  });

  it("normaliza campos (trim, e-mail minúsculo, UF maiúscula)", () => {
    const c = normalizeCandidate(candidate({ companyName: "  Acme  ", email: "Contato@ACME.com ", uf: "sp" }));
    expect(c.companyName).toBe("Acme");
    expect(c.email).toBe("contato@acme.com");
    expect(c.uf).toBe("SP");
  });

  it("descarta candidato sem nome", () => {
    expect(dedupeCandidates([candidate({ companyName: "  " })]).unique).toHaveLength(0);
  });

  it("gera chave de identidade de origem quando há providerId", () => {
    expect(candidateDedupeKeys(candidate())).toContain("x:osm:node/1");
  });
});

describe("cache em memória", () => {
  beforeEach(() => cacheClear());

  it("memoriza e devolve o valor sem reexecutar", async () => {
    let calls = 0;
    const producer = async () => {
      calls += 1;
      return { n: calls };
    };
    const first = await cacheThrough("k", 10_000, producer);
    const second = await cacheThrough("k", 10_000, producer);
    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(calls).toBe(1);
  });

  it("expira por TTL", () => {
    cacheSet("tmp", 42, -1);
    expect(cacheGet("tmp")).toBeUndefined();
  });

  it("respeita teto de entradas (eviction FIFO)", () => {
    for (let i = 0; i < cacheStats().size + 5; i++) cacheSet(`e${i}`, i, 10_000);
    expect(cacheStats().size).toBeLessThan(1000);
  });
});

describe("pacing", () => {
  beforeEach(() => pacingTest.reset());

  it("serializa chamadas da mesma chave", async () => {
    const order: string[] = [];
    await Promise.all([
      paced("host", 10, async () => {
        order.push("a:start");
        await new Promise((r) => setTimeout(r, 20));
        order.push("a:end");
      }),
      paced("host", 10, async () => {
        order.push("b:start");
      })
    ]);
    expect(order).toEqual(["a:start", "a:end", "b:start"]);
  });

  it("não trava a fila quando uma chamada falha", async () => {
    await expect(paced("host", 0, async () => Promise.reject(new Error("boom")))).rejects.toThrow("boom");
    await expect(paced("host", 0, async () => "ok")).resolves.toBe("ok");
  });
});

describe("flags de provedor (Free-First)", () => {
  it("Google Places está desligado por padrão", () => {
    expect(providerFlag("google_places")).toBe(false);
  });

  it("provedores gratuitos seguem habilitados sem config", () => {
    expect(providerFlag("osm")).toBe(true);
    expect(providerFlag("csv")).toBe(true);
    expect(providerFlag("manual")).toBe(true);
  });

  it("classifica gratuidade corretamente", () => {
    expect(isProviderFree("osm")).toBe(true);
    expect(isProviderFree("google_places")).toBe(false);
  });
});

describe("registry de provedores", () => {
  it("default nunca cai em provedor pago", () => {
    expect(getProviderOrDefault(undefined).id).toBe("osm");
    expect(getProviderOrDefault("inexistente").id).toBe("osm");
  });

  it("freeProviders exclui pagos", () => {
    const free = freeProviders();
    expect(free).toContain("osm");
    expect(free).not.toContain("google_places");
  });

  it("cadeia prefere o pedido quando habilitado", () => {
    expect(resolveProviderChain("osm")[0]).toBe("osm");
  });

  it("descrições expõem capabilities sem segredos", () => {
    const descriptors = providerDescriptors();
    const gp = descriptors.find((d) => d.id === "google_places");
    expect(gp?.paid).toBe(true);
    expect(gp?.enabled).toBe(false);
    expect(JSON.stringify(descriptors)).not.toMatch(/apiKey|GOOGLE_PLACES_API_KEY/);
  });
});

describe("importação CSV", () => {
  it("faz parse com aliases de cabeçalho pt-BR", () => {
    const { rows, columns } = parseCsv("Empresa;Cidade;Site\nAcme;Campinas;acme.com.br");
    expect(columns).toEqual(["companyName", "city", "website"]);
    expect(rows[0]?.companyName).toBe("Acme");
  });

  it("converte linhas em candidatos com procedência", () => {
    const { rows } = parseCsv("Empresa,Cidade\nAcme,Campinas");
    const list = csvRowsToCandidates(rows, { uf: "SP", category: "contábil" });
    expect(list[0]?.source.provider).toBe("csv");
    expect(list[0]?.uf).toBe("SP");
  });

  it("relata linhas com número de colunas divergente", () => {
    const { errors } = parseCsv("Empresa,Cidade\nAcme");
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("query Overpass (escaping e escopo)", () => {
  it("escapa aspas e barras em strings literais", () => {
    expect(osmTest.escapeQlString('a"b\\c')).toBe('a\\"b\\\\c');
  });

  it("neutraliza metacaracteres de regex (anti-injeção)", () => {
    const escaped = osmTest.escapeQlRegex('a".*|b');
    expect(escaped).not.toContain(".*");
    // A aspa é escapada (não pode fechar a string QL) e o `|` vira literal.
    expect(escaped).toContain('\\"');
    expect(escaped).toContain("\\|");
  });

  it("usa bbox quando disponível", () => {
    const ql = osmTest.buildQuery(
      { city: "Campinas", uf: "SP", category: "contábil", limit: 10 },
      { south: -23, north: -22, west: -47, east: -46 }
    );
    expect(ql).toContain("(-23,-47,-22,-46)");
    expect(ql).toContain("office=accountant");
  });

  it("cai para área administrativa sem bbox, com cidade escapada", () => {
    const ql = osmTest.buildQuery({ city: 'Cidade "X"', uf: "SP", category: "contábil", limit: 10 }, null);
    expect(ql).toContain('area["name"="Cidade \\"X\\""]');
  });

  it("monta candidato com atribuição OSM e fatos honestos", () => {
    const c = osmTest.toCandidate(
      { type: "node", id: 42, lat: -22.9, lon: -47.0, tags: { name: "Acme", website: "acme.com.br" } },
      { city: "Campinas", uf: "SP", category: "contábil", limit: 10 }
    );
    expect(c?.source.provider).toBe("osm");
    expect(c?.source.note).toContain("OpenStreetMap");
    expect(c?.facts.length).toBeGreaterThan(0);
  });
});

describe("provedor Sanle AI (prospecção com inteligência de mercado)", () => {
  it("está registrado e habilitado no registry de provedores", async () => {
    const { getProvider } = await import("@/lib/providers");
    const aiProvider = getProvider("sanle_ai");
    expect(aiProvider).not.toBeNull();
    expect(aiProvider?.id).toBe("sanle_ai");
    expect(aiProvider?.configured()).toBe(true);
  });

  it("gera candidatos estruturados com fatos e hipóteses comerciais", async () => {
    const { aiProspectProvider } = await import("@/lib/providers/ai-prospect");
    const candidates = await aiProspectProvider.search({
      city: "Brasília",
      uf: "DF",
      category: "Vidraçaria",
      limit: 3
    });
    expect(candidates).toBeInstanceOf(Array);
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]!.source.provider).toBe("sanle_ai");
    expect(candidates[0]!.facts.length).toBeGreaterThan(0);
    expect(candidates[0]!.hypotheses.length).toBeGreaterThan(0);
  });
});
