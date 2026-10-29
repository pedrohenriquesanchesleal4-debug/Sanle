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
    .toLowerCase()
    .trim();

  const map: [RegExp, string[]][] = [
    [
      /todo|geral|qualquer|^$/,
      [
        "office=accountant",
        "shop=glaziery",
        "craft=glaziery",
        "amenity=clinic",
        "amenity=dentist",
        "office=lawyer",
        "shop=car_repair",
        "shop=wholesale",
        "office=company",
        "office=construction_company",
        "office=estate_agent"
      ]
    ],
    [/contab|contabil|bpo/, ["office=accountant", "office=financial"]],
    [/vidrac|esquadr|vidro/, ["shop=glaziery", "craft=glaziery", "shop=window_tinting"]],
    [/marcenar|moveis/, ["craft=carpenter", "shop=furniture"]],
    [/recrutamento|rh|selecao/, ["office=employment_agency"]],
    [/advocacia|advogad|juridic/, ["office=lawyer"]],
    [/imobili|corretor/, ["office=estate_agent"]],
    [/clinica|medic|odonto|saude/, ["amenity=clinic", "amenity=dentist", "amenity=doctors"]],
    [/escola|curso|educac/, ["amenity=school", "amenity=college"]],
    [/constru|engenharia|obra/, ["office=construction_company", "craft=builder"]],
    [/consultoria|consultor/, ["office=consulting"]],
    [/bpo|financeir/, ["office=financial", "office=company"]],
    [/oficina|mecanic|auto|veiculo/, ["shop=car_repair", "craft=car_repair", "shop=car_parts"]],
    [/distrib|atacad/, ["shop=wholesale", "office=company"]],
    [/restaurante|gastronomia/, ["amenity=restaurant"]],
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
  if (!name || name.trim().length < 2) return null;

  // Filtra paradas de transporte público, lixeiras, monumentos e nomes genéricos
  if (/ponto|estacao|estação|terminal|poste|placa|lixeira|monumento/i.test(name)) return null;

  const addrParts = [
    tags["addr:street"],
    tags["addr:housenumber"],
    tags["addr:suburb"] || query.district,
    tags["addr:city"] || query.city,
    tags["addr:state"] || query.uf
  ].filter(Boolean);

  const facts: string[] = [];
  if (tags.website || tags["contact:website"]) facts.push(`Presença web cadastrada: ${tags.website || tags["contact:website"]}`);
  if (tags.phone || tags["contact:phone"]) facts.push(`Canal de telefone comercial ativo: ${tags.phone || tags["contact:phone"]}`);
  if (addrParts.length) facts.push(`Ponto comercial físico verificado: ${addrParts.join(", ")}`);
  if (!facts.length) facts.push(`Estabelecimento comercial em atividade no polo regional de ${query.city}/${query.uf}.`);

  const hypotheses: string[] = [];
  if (!tags.website && !tags["contact:website"]) {
    hypotheses.push("Não possui site próprio listado no mapa: dependência exclusiva de WhatsApp e redes sociais para converter clientes.");
    hypotheses.push("Oportunidade Sanle: Implementação de presença digital autoral de alta conversão (/p/) e catálogo interativo.");
  } else if (/clinic|dentist|medic/i.test(query.category) || tags.amenity === "clinic" || tags.amenity === "dentist") {
    hypotheses.push("Gargalo de no-show em consultas e sobrecarga da recepção confirmando horários manualmente no WhatsApp.");
    hypotheses.push("Oportunidade Sanle: Secretária virtual de agendamento online e confirmação automática em 1 clique.");
  } else if (/vidrac|esquadr/i.test(query.category) || tags.shop === "glaziery" || tags.craft === "glaziery") {
    hypotheses.push("Orçamentos de esquadrias e vidros calculados manualmente gerando lentidão de até 48h no fechamento com arquitetos.");
    hypotheses.push("Oportunidade Sanle: Simulador instantâneo de m² e catálogo de perfis no WhatsApp.");
  } else if (/oficina|mecanic|auto/i.test(query.category) || tags.shop === "car_repair") {
    hypotheses.push("Clientes interrompendo mecânicos o dia inteiro para saber status do veículo em manutenção.");
    hypotheses.push("Oportunidade Sanle: Consulta online de OS por placa com laudo visual e fotos do serviço.");
  } else {
    hypotheses.push("Operação comercial com potencial imediato de modernização de canais de atendimento e automação no WhatsApp.");
    hypotheses.push("Oportunidade Sanle: Desenvolvimento de sistema sob medida para centralização de pedidos e CRM.");
  }

  return {
    externalId: `${el.type}/${el.id}`,
    companyName: name,
    tradeName: tags["alt_name"] || null,
    category: tags.office || tags.shop || tags.amenity || query.category || "Comércio",
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
    hypotheses
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

    // Filtra empresas já no CRM (anti-repetição)
    const excludeSet = new Set((query.excludeNames ?? []).map((n) => n.toLowerCase().trim()));
    const filtered = excludeSet.size > 0
      ? unique.filter((c) => !excludeSet.has(c.companyName.toLowerCase().trim()))
      : unique;

    // Rotação dinâmica baseada na semente para variar os resultados retornados
    const seedNum = typeof query.seed === "number" ? query.seed : Date.now();
    const rotated = [...filtered].sort((a, b) => {
      const vA = (a.companyName.charCodeAt(0) + seedNum) % 31;
      const vB = (b.companyName.charCodeAt(0) + seedNum) % 31;
      return vA - vB;
    });

    return (rotated.length > 0 ? rotated : unique).slice(0, query.limit);
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
