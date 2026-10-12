import { osmProvider } from "./osm";
import { googlePlacesProvider } from "./google-places";
import { csvProvider } from "./csv";
import { manualProvider } from "./manual";
import { providerFlag, isProviderFree } from "./flags";
import { env } from "@/lib/env";
import type { ILeadProvider, ProspectProvider, ProspectProviderId, ProviderDescriptor } from "./types";

/**
 * Registry de provedores de leads (Strategy + Registry).
 *
 * O app nunca deve instanciar provedores direto: resolve pelo id aqui. Isso
 * mantém um único ponto de verdade para "quem existe", "quem está habilitado" e
 * "por qual ordem tentar" — e torna trivial plugar um provedor novo.
 */
export const PROVIDERS: Record<ProspectProviderId, ProspectProvider> = {
  osm: osmProvider,
  google_places: googlePlacesProvider,
  csv: csvProvider,
  manual: manualProvider
};

export function getProvider(id: string): ProspectProvider | null {
  return (PROVIDERS as Record<string, ProspectProvider>)[id] ?? null;
}

const FALLBACK_PROVIDER: ProspectProviderId = "osm";

/**
 * Resolve um provedor com default seguro. `freeFirst` garante que nenhum provedor
 * pago seja escolhido por omissão — só o default gratuito (OSM).
 */
export function getProviderOrDefault(id?: string | null): ProspectProvider {
  const requested = id ? getProvider(id) : null;
  if (requested) return requested;
  return PROVIDERS[FALLBACK_PROVIDER];
}

/** Lista os ids de provedores gratuitos (sem chave/custo). */
export function freeProviders(): ProspectProviderId[] {
  return (Object.keys(PROVIDERS) as ProspectProviderId[]).filter((id) => isProviderFree(id));
}

/**
 * Cadeia de resolução por preferência: tenta o provedor pedido primeiro; se ele
 * não estiver habilitado/constituído, cai para o gratuito default.
 */
export function resolveProviderChain(preferred?: ProspectProviderId | null): ProspectProviderId[] {
  const chain: ProspectProviderId[] = [];
  if (preferred && providerFlag(preferred)) chain.push(preferred);
  for (const id of freeProviders()) {
    if (!chain.includes(id) && providerFlag(id)) chain.push(id);
  }
  return chain;
}

/** Descrição serializável (sem segredos) de um provedor — para UI/API. */
export function describeProvider(p: ILeadProvider): ProviderDescriptor {
  const caps = p.capabilities;
  return {
    id: p.id,
    label: p.label,
    note: p.note,
    configured: p.configured(),
    enabled: providerFlag(p.id),
    requiresApproval: p.requiresApproval,
    free: caps?.free ?? isProviderFree(p.id),
    paid: caps?.paid ?? !isProviderFree(p.id),
    serverOnly: caps?.serverOnly ?? true,
    supportsImport: caps?.supportsImport ?? false,
    attribution: caps?.attribution
  };
}

export function providerDescriptors(): ProviderDescriptor[] {
  return Object.values(PROVIDERS).map(describeProvider);
}

export function listProviders() {
  return Object.values(PROVIDERS).map((p) => ({
    id: p.id,
    label: p.label,
    configured: p.configured(),
    requiresApproval: p.requiresApproval,
    note: p.note
  }));
}

/** Indica se o app está operando em modo Free-First (default). */
export function isFreeFirst(): boolean {
  return env.prospecting.freeFirst;
}

export * from "./types";
