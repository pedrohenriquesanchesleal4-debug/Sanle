/**
 * Detecção honesta de capacidades. Nada é "conectado" sem credencial.
 * O app roda 100% sem nenhuma chave (armazenamento local + IA determinística).
 */

function clean(v: string | undefined): string {
  return (v ?? "").trim();
}

/** Número positivo com fallback seguro (nunca NaN, nunca 0 acidental). */
function num(v: string | undefined, fallback: number): number {
  const n = Number(clean(v));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Inteiro >= min. Diferente de `num`, aceita 0 (ex.: maxRetries=0 desliga retry). */
function int(v: string | undefined, fallback: number, min = 0): number {
  const n = Number(clean(v));
  return Number.isFinite(n) && n >= min ? Math.floor(n) : fallback;
}

/** Float com fallback quando ausente/vazio (aceita 0, rejeita NaN). */
function float(v: string | undefined, fallback: number): number {
  const c = clean(v);
  if (!c) return fallback;
  const n = Number(c);
  return Number.isFinite(n) ? n : fallback;
}

/** Float entre min e max, com fallback. */
function floatRange(v: string | undefined, fallback: number, min: number, max: number): number {
  const n = float(v, fallback);
  return Math.min(max, Math.max(min, n));
}

const DEFAULT_ADMIN_EMAILS = [
  "pedrohenriquesanchesleal4@gmail.com",
  "pedroheriquesanchesleal4@gmail.com",
  "admin@local"
];

const resolvedAdminEmails = Array.from(
  new Set([
    ...DEFAULT_ADMIN_EMAILS,
    ...clean(process.env.SANLE_ADMIN_EMAILS)
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  ])
);

export const env = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",

  supabase: {
    url: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceKey: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    get configured(): boolean {
      return Boolean(this.url && this.anonKey);
    },
    get admin(): boolean {
      return Boolean(this.url && this.serviceKey);
    }
  },

  ai: {
    provider: clean(process.env.SANLE_AI_PROVIDER) || "", // openai | anthropic | openai_compatible | local
    apiKey: clean(process.env.SANLE_AI_API_KEY),
    model: clean(process.env.SANLE_AI_MODEL) || "gpt-4o-mini",
    publicModel: clean(process.env.SANLE_AI_PUBLIC_MODEL) || clean(process.env.SANLE_AI_MODEL) || "gpt-4o-mini",
    adminModel: clean(process.env.SANLE_AI_ADMIN_MODEL) || clean(process.env.SANLE_AI_MODEL) || "gpt-4o-mini",
    baseUrl: clean(process.env.SANLE_AI_BASE_URL),
    embedModel: clean(process.env.SANLE_EMBED_MODEL) || "text-embedding-3-small",
    maxOutputTokens: int(process.env.SANLE_AI_MAX_OUTPUT_TOKENS, 900, 64),
    maxInputChars: int(process.env.SANLE_AI_MAX_INPUT_CHARS, 12000, 500),
    timeoutMs: int(process.env.SANLE_AI_TIMEOUT_MS, 30_000, 1000),
    maxRetries: int(process.env.SANLE_AI_MAX_RETRIES, 2, 0),
    temperature: floatRange(process.env.SANLE_AI_TEMPERATURE, 0.3, 0, 2),
    dailyBudgetUsd: float(process.env.SANLE_AI_DAILY_BUDGET_USD, 0),
    get configured(): boolean {
      return Boolean(this.provider && this.apiKey);
    }
  },

  rag: {
    vectorEnabled: clean(process.env.SANLE_RAG_VECTOR) !== "false",
    minScore: floatRange(process.env.SANLE_RAG_MIN_SCORE, 0.06, 0, 1),
    topK: int(process.env.SANLE_RAG_TOP_K, 5, 1),
    contextMaxChars: int(process.env.SANLE_RAG_CONTEXT_MAX_CHARS, 4500, 200),
    publicAssistantEnabled: clean(process.env.SANLE_AI_PUBLIC_CHAT) !== "false",
    adminAssistantEnabled: clean(process.env.SANLE_AI_ADMIN_CHAT) !== "false"
  },

  googlePlaces: {
    apiKey: clean(process.env.GOOGLE_PLACES_API_KEY),
    enabled: clean(process.env.GOOGLE_PLACES_ENABLED) === "true",
    maxResultsPerSearch: num(process.env.GOOGLE_PLACES_MAX_RESULTS, 20),
    monthlyBudgetUsd: Number(clean(process.env.GOOGLE_PLACES_MONTHLY_BUDGET_USD) || "0"),
    get configured(): boolean {
      return Boolean(this.apiKey);
    }
  },

  prospecting: {
    freeFirst: clean(process.env.SANLE_PROSPECTING_FREE_FIRST) !== "false",
    cacheTtlMs: num(process.env.PROSPECT_CACHE_TTL_MS, 15 * 60_000),
    cacheMaxEntries: num(process.env.PROSPECT_CACHE_MAX, 500),
    minIntervalMs: num(process.env.PROSPECT_MIN_INTERVAL_MS, 1100),
    timeoutMs: num(process.env.PROSPECT_HTTP_TIMEOUT_MS, 25_000),
    attribution: "© OpenStreetMap contributors (ODbL)"
  },

  osm: {
    overpassUrl: clean(process.env.OSM_OVERPASS_URL) || "https://overpass-api.de/api/interpreter",
    nominatimUrl: clean(process.env.OSM_NOMINATIM_URL) || "https://nominatim.openstreetmap.org",
    nominatimEnabled: clean(process.env.OSM_NOMINATIM_ENABLED) !== "false",
    userAgent: clean(process.env.OSM_USER_AGENT) || "SanleProspecting/1.0 (contato@sanle.example)",
    enabled: clean(process.env.OSM_ENABLED) !== "false",
    overpassTimeoutSec: num(process.env.OSM_OVERPASS_TIMEOUT_SEC, 25),
    maxPerSearch: num(process.env.OSM_MAX_PER_SEARCH, 200)
  },

  linkedin: {
    clientId: clean(process.env.LINKEDIN_CLIENT_ID),
    clientSecret: clean(process.env.LINKEDIN_CLIENT_SECRET),
    get configured(): boolean {
      return Boolean(this.clientId && this.clientSecret);
    }
  },

  adminEmails: resolvedAdminEmails,

  admin: {
    emails: resolvedAdminEmails,
    localDevLogin: clean(process.env.SANLE_LOCAL_ADMIN) === "true" || process.env.NODE_ENV !== "production"
  },

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
} as const;

/** Resumo legível do que está ativo agora — usado no painel (transparência). */
export function capabilityReport() {
  return {
    storage: env.supabase.configured ? "supabase" : "local",
    auth: env.supabase.configured ? "supabase" : env.admin.localDevLogin ? "local-dev" : "indisponível",
    ai: env.ai.configured ? `${env.ai.provider}:${env.ai.model}` : "sem-provider (fallback determinístico)",
    aiRouting: {
      public: env.ai.publicModel,
      admin: env.ai.adminModel
    },
    rag: {
      vector: env.rag.vectorEnabled && env.supabase.admin ? "pgvector" : "memória",
      publicAssistant: env.rag.publicAssistantEnabled,
      adminAssistant: env.rag.adminAssistantEnabled,
      topK: env.rag.topK
    },
    prospecting: [
      env.osm.enabled ? "osm" : null,
      env.googlePlaces.enabled && env.googlePlaces.configured ? "google_places" : null,
      "csv",
      "manual"
    ].filter(Boolean) as string[],
    prospectingFreeFirst: env.prospecting.freeFirst,
    prospectingAttribution: env.prospecting.attribution,
    linkedin: env.linkedin.configured ? "credenciais presentes" : "desativado"
  };
}
