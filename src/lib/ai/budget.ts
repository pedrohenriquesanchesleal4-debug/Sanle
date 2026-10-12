import { env } from "@/lib/env";

/**
 * Controle de custo/token da IA — SERVER-ONLY (importa `env`).
 *
 * Objetivo: transformar "parece barato" em **teto medido**. Duas travas:
 *  1. Pré-checagem: a estimativa daquela chamada cabe no orçamento diário?
 *  2. Pós-checagem: o custo real (tokens medidos) é somado ao acumulado do dia.
 *
 * O acumulado é em memória por processo — suficiente para um teto de segurança
 * suave (serverless reinicia, mas nunca "esquece" dentro da instância viva).
 */

/** Preço em USD por 1M tokens. Modelo desconhecido → estimativa conservadora. */
const PRICES: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1": { input: 2, output: 8 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 }
};

const DEFAULT_PRICE = { input: 1, output: 3 };

export function priceOf(model: string): { input: number; output: number } {
  return PRICES[model] ?? DEFAULT_PRICE;
}

/** Custo em USD para um par (input, output) de tokens. */
export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = priceOf(model);
  return (Math.max(0, inputTokens) / 1_000_000) * p.input + (Math.max(0, outputTokens) / 1_000_000) * p.output;
}

/**
 * Estimativa de tokens de entrada: ~4 caracteres por token. Heurística declarada,
 * não medição — serve para o gatilho de budget, nunca para fatura.
 */
export function estimateInputTokens(messages: { content: string }[]): number {
  const chars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(chars / 4) + 8 * messages.length;
}

type DayBucket = { day: string; usd: number; calls: number };

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

const bucket: DayBucket = { day: utcDay(), usd: 0, calls: 0 };

function rollover(): void {
  const today = utcDay();
  if (bucket.day !== today) {
    bucket.day = today;
    bucket.usd = 0;
    bucket.calls = 0;
  }
}

export type BudgetDecision = {
  allowed: boolean;
  reason?: string;
  estimatedCostUsd: number;
  remainingUsd: number | null;
};

/**
 * Decide se a chamada cabe no orçamento. `dailyBudgetUsd <= 0` significa "sem
 * teto" (modo free-first/local), nunca "bloqueado".
 */
export function checkBudget(model: string, inputTokens: number, maxOutputTokens: number): BudgetDecision {
  rollover();
  const estimatedCostUsd = estimateCostUsd(model, inputTokens, maxOutputTokens);
  const cap = env.ai.dailyBudgetUsd;
  if (cap <= 0) return { allowed: true, estimatedCostUsd, remainingUsd: null };
  const remaining = cap - bucket.usd;
  if (estimatedCostUsd > remaining) {
    return {
      allowed: false,
      reason: `Orçamento diário de IA esgotado (US$ ${bucket.usd.toFixed(4)} de US$ ${cap.toFixed(2)}).`,
      estimatedCostUsd,
      remainingUsd: Math.max(0, remaining)
    };
  }
  return { allowed: true, estimatedCostUsd, remainingUsd: remaining };
}

/** Registra o custo real de uma chamada concluída. */
export function recordUsage(model: string, inputTokens: number | null, outputTokens: number | null): number {
  rollover();
  const cost = estimateCostUsd(model, inputTokens ?? 0, outputTokens ?? 0);
  bucket.usd += cost;
  bucket.calls += 1;
  return cost;
}

export function budgetSnapshot(): { day: string; spentUsd: number; calls: number; capUsd: number; remainingUsd: number | null } {
  rollover();
  const cap = env.ai.dailyBudgetUsd;
  return {
    day: bucket.day,
    spentUsd: Number(bucket.usd.toFixed(6)),
    calls: bucket.calls,
    capUsd: cap,
    remainingUsd: cap > 0 ? Math.max(0, cap - bucket.usd) : null
  };
}
