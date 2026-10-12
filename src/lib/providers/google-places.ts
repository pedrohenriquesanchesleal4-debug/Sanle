import { env } from "@/lib/env";
import type { ProspectCandidate, ProspectProvider, ProspectQuery } from "./types";
import { ProviderUnavailableError } from "./types";
import { assertServer, providerFlag } from "./flags";

/**
 * Google Places API (Text Search) — OPCIONAL e SUJEITO A COSTO.
 *
 * Nunca ativa sozinho: exige GOOGLE_PLACES_ENABLED=true E chave, e ainda assim
 * requer aprovação explícita do operador (custo por requisição). A flag é
 * resolvida em `flags.ts` (server-only) para que um provedor pago jamais vire
 * dependência: o modo gratuito (OSM) é sempre o caminho default.
 */

type PlacesResponse = {
  places?: {
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    types?: string[];
    location?: { latitude: number; longitude: number };
  }[];
  error?: { message?: string; status?: string };
};

export const googlePlacesProvider: ProspectProvider = {
  id: "google_places",
  label: "Google Places",
  requiresApproval: true,
  configured: () => providerFlag("google_places"),
  note: "Opcional e pago (cota mensal). Só roda com aprovação explícita do operador.",
  capabilities: {
    free: false,
    requiresKey: true,
    paid: true,
    serverOnly: true,
    supportsImport: false,
    attribution: "Dados licenciados do Google — uso sujeito aos Termos de Serviço do Google."
  },
  async search(query: ProspectQuery): Promise<ProspectCandidate[]> {
    assertServer("google_places.search");
    if (!env.googlePlaces.apiKey) {
      throw new ProviderUnavailableError("Google Places sem chave (GOOGLE_PLACES_API_KEY).");
    }
    if (!env.googlePlaces.enabled) {
      throw new ProviderUnavailableError("Google Places desativado (GOOGLE_PLACES_ENABLED=0).");
    }

    const textQuery = [query.category, query.terms, `${query.city} ${query.uf}`, query.district]
      .filter(Boolean)
      .join(" ");

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.googlePlaces.apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.types,places.location"
      },
      body: JSON.stringify({ textQuery, languageCode: "pt-BR", maxResultCount: Math.min(query.limit, 20) }),
      signal: AbortSignal.timeout(20_000)
    });

    const data = (await res.json()) as PlacesResponse;
    if (!res.ok || data.error) {
      throw new ProviderUnavailableError(
        `Google Places: ${data.error?.message ?? `HTTP ${res.status}`}`
      );
    }

    return (data.places ?? []).slice(0, query.limit).map((p) => {
      const facts: string[] = [];
      if (p.websiteUri) facts.push("Site informado no Google Places.");
      if (p.nationalPhoneNumber || p.internationalPhoneNumber) facts.push("Telefone informado no Google Places.");
      if (p.formattedAddress) facts.push("Endereço cadastrado no Google Places.");
      return {
        externalId: p.id,
        companyName: p.displayName?.text ?? "(sem nome)",
        tradeName: null,
        category: query.category,
        address: p.formattedAddress ?? null,
        city: query.city,
        uf: query.uf,
        website: p.websiteUri ?? null,
        phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber ?? null,
        email: null,
        linkedin: null,
        lat: p.location?.latitude ?? null,
        lon: p.location?.longitude ?? null,
        source: {
          provider: "google_places",
          providerId: p.id,
          url: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
          collectedAt: new Date().toISOString(),
          note: "Google Places API (Text Search) — dados licenciados, uso sujeito aos termos do Google."
        },
        facts,
        hypotheses: ["Operação possivelmente manual (não verificado)."]
      } satisfies ProspectCandidate;
    });
  }
};
