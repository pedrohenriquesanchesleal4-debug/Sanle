/**
 * Tipos da camada de IA.
 *
 * REGRA: este arquivo é PURO e CLIENT-SAFE. Não importa `env`, `supabase` nem
 * nada de servidor. É o contrato que a UI pode importar sem vazar chaves.
 * A resolução de provedor/modelo vive em `registry.ts` (server-only).
 */

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = { role: ChatRole; content: string };

/** Uso de tokens declarado pelo provedor (quando disponível). */
export type LLMTokenUsage = { inputTokens: number; outputTokens: number };

/**
 * Resultado de uma chamada de LLM. O shape é **aditivo** em relação ao original
 * (text/provider/model/ok/error/inputTokens/outputTokens): campos novos entram
 * como opcionais para não quebrar nenhum consumidor existente.
 */
export type LLMResult = {
  text: string;
  provider: string;
  model: string;
  ok: boolean;
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
  /** Latência medida no adapter (ms). Aditivo. */
  latencyMs?: number;
  /** true quando a resposta veio do cache local do run (opt-in). Aditivo. */
  cached?: boolean;
};

/** Identificador canônico de provedor de LLM. */
export type LLMProviderId = "openai" | "anthropic" | "openai_compatible" | "local";

/** Capacidades declaradas por um adapter (sem executar nada). */
export type LLMCapabilities = {
  streaming: boolean;
  tools: boolean;
  json: boolean;
  vision: boolean;
};

/** Finalidade da chamada — governa roteamento de modelo, budget e telemetria. */
export type LLMPurpose = "public" | "admin" | "outreach" | "diagnostic";

/** Opções de chamada (2º argumento opcional de `complete`). */
export type LLMRequestOptions = {
  /** Força um modelo específico (senão roteia por `purpose`). */
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  maxRetries?: number;
  purpose?: LLMPurpose;
  /**
   * Contexto fundamentado fornecido ao modelo. Usado APENAS pelos guardrails de
   * saída (para flagrar compromissos sem base) — nunca é reenviado ao provedor.
   */
  groundingContext?: string;
};

/**
 * Invocação concreta entregue a um adapter: mensagens + parâmetros já resolvidos
 * + credencial. Só o registry monta isto (server-only).
 */
export type LLMInvocation = {
  messages: ChatMessage[];
  model: string;
  apiKey: string;
  baseUrl?: string;
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  maxRetries: number;
  signal?: AbortSignal;
};

/** Porta que todo adapter de LLM implementa (Strategy). Só o registry a usa. */
export type LLMAdapter = {
  id: LLMProviderId;
  label: string;
  configured: () => boolean;
  capabilities: LLMCapabilities;
  note: string;
  /** Lança em falha de rede/HTTP; o registry traduz para `LLMResult.ok=false`. */
  chat: (inv: LLMInvocation) => Promise<LLMResult>;
};

/** Descrição serializável (sem segredos) de um provedor de LLM — para UI/API. */
export type LLMDescriptor = {
  id: LLMProviderId;
  label: string;
  configured: boolean;
  enabled: boolean;
  serverOnly: true;
  capabilities: LLMCapabilities;
  note: string;
};

export class LLMProviderError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryable: boolean
  ) {
    super(message);
    this.name = "LLMProviderError";
  }
}

export class LLMBudgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMBudgetError";
  }
}
