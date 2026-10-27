import { env } from "@/lib/env";
import type { ProspectProviderId } from "./types";

/**
 * Feature flags de provedores — SERVER-ONLY.
 *
 * Regras que este módulo garante:
 *  - Provedor pago (Google Places) NUNCA é ligado sozinho: exige flag explícita
 *    (`GOOGLE_PLACES_ENABLED=true`) E chave. Sem isso, `false`.
 *  - Provedores gratuitos (Sanle AI, OSM, CSV, manual) são ligados por padrão.
 *  - Este arquivo importa `env` (lê `process.env`) e por isso só pode ser
 *    importado no servidor. Nenhum componente client deve importá-lo — o alias
 *    público para a UI é `@/lib/providers/types`.
 *
 * Diferente de `configured()` (que resolve credenciais), aqui responde apenas
 * "a flag permite rodar?" — a checagem de credencial continua no provedor.
 */
export function providerFlag(id: ProspectProviderId): boolean {
  switch (id) {
    case "sanle_ai":
      return true;
    case "osm":
      return env.osm.enabled;
    case "google_places":
      return env.googlePlaces.enabled && Boolean(env.googlePlaces.apiKey);
    case "csv":
    case "manual":
      return true;
    default:
      return false;
  }
}

/** Verdadeiro quando o provedor não exige chave nem custo por requisição. */
export function isProviderFree(id: ProspectProviderId): boolean {
  return id !== "google_places";
}

/** Lança se executado fora do servidor (guarda contra uso acidental no client). */
export function assertServer(context: string): void {
  if (typeof window !== "undefined") {
    throw new Error(`Provedores de leads são server-only (${context}).`);
  }
}
