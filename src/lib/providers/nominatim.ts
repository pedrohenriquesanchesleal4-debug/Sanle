import { env } from "@/lib/env";
import { requestJson, HttpError } from "./http";

/**
 * Nominatim (OpenStreetMap) — geocoding gratuito e sem chave.
 *
 * Uso aqui: resolver `cidade/UF/bairro` para uma **bounding box**. Isso torna a
 * busca no Overpass correta — a query por `area["name"="..."]` é ambígua quando
 * existem duas cidades homônimas (ex.: vários "Bom Jesus" no Brasil); a bbox
 * resolve o lugar exato.
 *
 * Política de uso respeitada (operations.osmfoundation.org/policies/nominatim):
 *  - máximo 1 requisição/segundo (aplicado por `paced`, via `requestJson`);
 *  - User-Agent identificável (herdado do cliente HTTP, nunca genérico);
 *  - resultados CACHEADOS no nosso lado;
 *  - nada de geocoding em massa — só a geocodificação pontual de uma busca.
 */

export type GeoArea = {
  displayName: string;
  lat: number;
  lon: number;
  bbox: { south: number; north: number; west: number; east: number };
};

export type GeocodeResult =
  | { ok: true; area: GeoArea; cached: boolean }
  | { ok: false; reason: string };

type NominatimItem = {
  lat?: string;
  lon?: string;
  display_name?: string;
  boundingbox?: [string, string, string, string];
};

// Resultados de geocoding são estáveis: cache longo (mínimo de 6h).
const GEOCODE_TTL_MS = Math.max(env.prospecting.cacheTtlMs, 6 * 60 * 60_000);

export async function geocodeArea(input: {
  city: string;
  uf?: string | null;
  district?: string | null;
  country?: string;
}): Promise<GeocodeResult> {
  if (!env.osm.enabled || !env.osm.nominatimEnabled) {
    return { ok: false, reason: "Nominatim desativado (OSM_NOMINATIM_ENABLED=0)." };
  }

  const q = [input.district, input.city, input.uf, input.country ?? "Brasil"]
    .filter((p) => Boolean(p && String(p).trim()))
    .join(", ");

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    limit: "1",
    addressdetails: "0",
    countrycodes: "br"
  });
  const url = `${env.osm.nominatimUrl.replace(/\/$/, "")}/search?${params.toString()}`;

  try {
    const { data, cached } = await requestJson<NominatimItem[]>(url, {
      method: "GET",
      headers: { "Accept-Language": "pt-BR,pt;q=0.9" },
      pacingKey: "nominatim.openstreetmap.org",
      cacheTtlMs: GEOCODE_TTL_MS
    });

    const first = data?.[0];
    if (!first || first.lat === undefined || first.lon === undefined) {
      return { ok: false, reason: `Nominatim não localizou "${q}".` };
    }

    const [south, north, west, east] = first.boundingbox ?? [];
    return {
      ok: true,
      cached,
      area: {
        displayName: first.display_name ?? q,
        lat: Number(first.lat),
        lon: Number(first.lon),
        bbox: {
          south: Number(south ?? first.lat),
          north: Number(north ?? first.lat),
          west: Number(west ?? first.lon),
          east: Number(east ?? first.lon)
        }
      }
    };
  } catch (err) {
    if (err instanceof HttpError) return { ok: false, reason: err.message };
    return { ok: false, reason: err instanceof Error ? err.message : "Falha no geocoding." };
  }
}
