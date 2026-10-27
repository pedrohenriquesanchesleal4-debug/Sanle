import type { LeadSource } from "@/lib/types";

/** Candidato bruto de prospecção, antes de virar Lead no CRM. */
export type ProspectCandidate = {
  externalId: string;
  companyName: string;
  tradeName?: string | null;
  category?: string | null;
  address?: string | null;
  city?: string | null;
  uf?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  linkedin?: string | null;
  lat?: number | null;
  lon?: number | null;
  source: LeadSource;
  /** Fatos vs. hipóteses: o candidato nunca assume dor não verificada. */
  facts: string[];
  hypotheses: string[];
};

export type ProspectProviderId = "osm" | "google_places" | "csv" | "manual" | "sanle_ai";

export type ProspectQuery = {
  city: string;
  uf: string;
  district?: string;
  category: string;
  terms?: string;
  limit: number;
  provider?: ProspectProviderId;
};

/** Capacidades operacionais declaradas por um provedor (aditivo, sem lógica). */
export type ProviderCapabilities = {
  /** Gratuito: sem chave, sem cota, sem custo por requisição. */
  free: boolean;
  /** Exige credencial/chave para funcionar. */
  requiresKey: boolean;
  /** Pago por requisição/cota (ex.: Google Places). Nunca obrigatório. */
  paid: boolean;
  /** Só roda no servidor (usa env/segredos/HTTP de saída). */
  serverOnly: boolean;
  /** Suporta ingestão de arquivo (CSV) além de busca online. */
  supportsImport: boolean;
  /** Atribuição legal exigida ao exibir/usar os dados. */
  attribution?: string;
};

/**
 * Interface canônica de provedor de leads (Strategy).
 *
 * `ProspectProvider` é mantido como **alias estável** desta interface: nenhum
 * consumidor existente é quebrado e o nome passa a ser `ILeadProvider`.
 */
export type ILeadProvider = {
  id: ProspectProviderId;
  label: string;
  /** Requer aprovação explícita do operador antes de gastar cota/custo. */
  requiresApproval: boolean;
  configured: () => boolean;
  note: string;
  search: (query: ProspectQuery) => Promise<ProspectCandidate[]>;
  /** Declaração de capacidades (opcional — provedores antigos seguem válidos). */
  capabilities?: ProviderCapabilities;
  /** TTL de cache específico do provedor, em ms (default: env.global). */
  cacheTtlMs?: number;
};

/** @deprecated Use `ILeadProvider` em código novo. Mantido como alias estável. */
export type ProspectProvider = ILeadProvider;

/** Descrição serializável de provedor para UI/API (sem executar nada). */
export type ProviderDescriptor = {
  id: ProspectProviderId;
  label: string;
  note: string;
  configured: boolean;
  enabled: boolean;
  requiresApproval: boolean;
  free: boolean;
  paid: boolean;
  serverOnly: boolean;
  supportsImport: boolean;
  attribution?: string;
};

export class ProviderUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

export class ProviderRateLimitError extends ProviderUnavailableError {
  constructor(message: string) {
    super(message);
    this.name = "ProviderRateLimitError";
  }
}
