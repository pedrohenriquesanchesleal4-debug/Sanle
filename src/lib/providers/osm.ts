import { env } from "@/lib/env";
import type { ProspectCandidate, ProspectProvider, ProspectQuery } from "./types";
import { ProviderRateLimitError, ProviderUnavailableError } from "./types";
import { requestJson, HttpError } from "./http";
import { geocodeArea, type GeoArea } from "./nominatim";
import { dedupeCandidates } from "./dedupe";

/**
 * OpenStreetMap — provedor GRATUITO e sem chave (rota default do Free-First).
 *
 * Fluxo em duas etapas:
 *  1. Nominatim resolve `cidade/UF/bairro` → bounding box (evita ambiguidade de
 *     `area["name"]` quando há cidades homônimas e deixa a busca mais precisa).
 *  2. Overpass consulta os elementos dentro da bbox (ou por `area` como fallback).
 *
 * Conformidade (políticas OSM):
 *  - pacing de 1 req/s via `requestJson` (Nominatim) e slots do Overpass;
 *  - cache obrigatório dos resultados;
 *  - User-Agent identificável;
 *  - atribuição "© OpenStreetMap contributors (ODbL)" propagada no `source.note`.
 *
 * Segurança: `terms`/`city` são tratados como TEXTO LITERAL — escapamos aspas,
 * barras e metacaracteres de regex antes de montar a query Overpass. Sem isso,
 * um `terms` hostil conseguiria injetar instruções na query (Overpass QL).
 */

const OVERPASS_MIRRORS = [
  env.osm.overpassUrl,
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
].filter(Boolean);

function categoryToOsm(category: string): string[] {
  const c = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const map: [RegExp, string[]][] = [
    [/contab|contabil/, ["office=accountant"]],
    [/vidrac/, ["shop=glaziery", "craft=glaziery"]],
    [/marcenar/, ["craft=carpenter", "shop=furniture"]],
    [/recrutamento|rh|selecao/, ["office=employment_agency"]],
    [/advocacia|advogad/, ["office=lawyer"]],
    [/imobili/, ["office=estate_agent"]],
    [/clinica|medic|odonto/, ["amenity=clinic", "amenity=dentist"]],
    [/escola|curso|educac/, ["amenity=school", "amenity=college"]],
    [/constru|engenharia|obra/, ["office=construction_company", "craft=builder"]],
    [/consultoria|consultor/, ["office=consulting"]],
    [/bpo|financeir/, ["office=financial", "office=company"]],
    [/assistencia|reparo|reparos/, ["shop=repair"]],
    [/academia|fitness/, ["leisure=fitness_centre"]]
  ];
  for (const [re, tags] of map) if (re.test(c)) return tags;
  return [];
}

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = { elements?: OverpassElement[]; remark?: string };

function escapeQlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Trata a busca como texto literal: neutraliza metacaracteres de regex + QL. */
function escapeQlRegex(value: string): string {
  const literal = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escapeQlString(literal);
}

function toCandidate(el: OverpassElement, query: ProspectQuery): ProspectCandidate | null {
  const tags = el.tags ?? {};
  const name = tags.name ?? tags["name:pt"] ?? tags.operator;
  if (!name) return null;

  const addrParts = [
    tags["addr:street"],
    tags["addr:housenumber"],
    tags["addr:suburb"] || query.district,
    tags["addr:city"] || query.city,
    tags["addr:state"] || query.uf
  ].filter(Boolean);

  const facts: string[] = [];
  if (tags.website || tags["contact:website"]) facts.push("Site informado no OpenStreetMap.");
  if (tags.phone || tags["contact:phone"]) facts.push("Telefone informado no OpenStreetMap.");
  if (addrParts.length) facts.push("Endereço registrado no OpenStreetMap.");

  return {
    externalId: `${el.type}/${el.id}`,
    companyName: name,
    tradeName: null,
    category: query.category,
    address: addrParts.join(", ") || null,
    city: tags["addr:city"] ?? query.city,
    uf: tags["addr:state"] ?? query.uf,
    website: tags.website ?? tags["contact:website"] ?? null,
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    email: tags.email ?? tags["contact:email"] ?? null,
    linkedin: null,
    lat: el.lat ?? el.center?.lat ?? null,
    lon: el.lon ?? el.center?.lon ?? null,
    source: {
      provider: "osm",
      providerId: `${el.type}/${el.id}`,
      url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      collectedAt: new Date().toISOString(),
      note: `OpenStreetMap (Overpass API) — ${env.prospecting.attribution}.`
    },
    facts,
    hypotheses: ["Operação possivelmente baseada em processos manuais (não verificado)."]
  };
}

function buildQuery(query: ProspectQuery, bounds: GeoArea["bbox"] | null): string {
  const timeout = env.osm.overpassTimeoutSec;
  const maxPerSearch = Math.max(query.limit * 3, 50);
  const tags = categoryToOsm(query.category);
  const nameFilter = query.terms ? `["name"~"${escapeQlRegex(query.terms)}",i]` : "";
  const clauses: string[] = [];

  const pushTagClauses = (scope: string): void => {
    if (tags.length) {
      for (const tag of tags) {
        const [k, v] = tag.split("=");
        clauses.push(`node[${k}=${v}]${nameFilter}${scope};`);
        clauses.push(`way[${k}=${v}]${nameFilter}${scope};`);
      }
    } else {
      // Sem tag conhecida: busca por nome (nunca um dump sem filtro).
      clauses.push(`nwr[name]${nameFilter}${scope};`);
    }
  };

  if (bounds) {
    const scope = `(${bounds.south},${bounds.west},${bounds.north},${bounds.east})`;
    pushTagClauses(scope);
    return `[out:json][timeout:${timeout}];\n(\n${clauses.join("\n")}\n);\nout center tags ${maxPerSearch};`;
  }

  // Fallback: área administrativa por nome (cidade escapada como literal).
  const area = `area["name"="${escapeQlString(query.city)}"]["boundary"="administrative"]->.a;`;
  pushTagClauses("(area.a)");
  return `[out:json][timeout:${timeout}];\n${area}\n(\n${clauses.join("\n")}\n);\nout center tags ${maxPerSearch};`;
}

export const osmProvider: ProspectProvider = {
  id: "osm",
  label: "OpenStreetMap (Overpass)",
  requiresApproval: false,
  configured: () => env.osm.enabled,
  note: "Gratuito e sem chave. Dados abertos do OpenStreetMap (ODbL). Cobertura varia por região.",
  capabilities: {
    free: true,
    requiresKey: false,
    paid: false,
    serverOnly: true,
    supportsImport: false,
    attribution: env.prospecting.attribution
  },
  async search(query: ProspectQuery): Promise<ProspectCandidate[]> {
    if (!env.osm.enabled) throw new ProviderUnavailableError("Provedor OSM desativado (OSM_ENABLED=0).");

    // Etapa 1 — bounding box (degrada graciosamente para busca por área).
    const geo = await geocodeArea({ city: query.city, uf: query.uf, district: query.district });
    const bounds = geo.ok ? geo.area.bbox : null;

    // Etapa 2 — Overpass com rotação de mirrors resilientes + pacing + cache
    const ql = buildQuery(query, bounds);
    let data: OverpassResponse | null = null;
    let lastError: Error | null = null;

    for (const endpoint of OVERPASS_MIRRORS) {
      try {
        let hostname = "overpass-api.de";
        try {
          hostname = new URL(endpoint).hostname;
        } catch {}

        const res = await requestJson<OverpassResponse>(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(ql)}`,
          pacingKey: hostname,
          cacheTtlMs: env.prospecting.cacheTtlMs,
          retries: 1
        });

        if (res.data && !res.data.remark) {
          data = res.data;
          break;
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[OSM Mirror Fallback] Espelho ${endpoint} indisponível (${lastError.message}). Tentando próximo...`);
      }
    }

    if (!data) {
      if (lastError instanceof HttpError && lastError.status === 429) {
        throw new ProviderRateLimitError(
          "Overpass recusou por limite de uso (429). Não repetimos automaticamente para evitar bloqueio — aguarde e tente novamente."
        );
      }
      const msg = lastError instanceof Error ? lastError.message : "Falha no Overpass.";
      throw new ProviderUnavailableError(`Overpass: ${msg}`);
    }

    const mapped = (data.elements ?? [])
      .map((el) => toCandidate(el, query))
      .filter((c): c is ProspectCandidate => Boolean(c));

    // Dedupe interno: o Overpass devolve o mesmo lugar como node e way.
    const { unique } = dedupeCandidates(mapped);
    return unique.slice(0, query.limit);
  }
};

/** Superfície de teste (lógica pura, sem rede). */
export const __test = {
  categoryToOsm,
  escapeQlString,
  escapeQlRegex,
  buildQuery,
  toCandidate
};
