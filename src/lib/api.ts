import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function failure(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/** Traduz erros de Zod em mensagens amigáveis por campo. */
export function zodFailure(err: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return failure("Dados inválidos.", 422, { fields });
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Rejeita requisições cross-origin em rotas com cookie/sessão (defesa em
 * profundidade além do SameSite=Lax). Request sem header `Origin` (curl, CLI,
 * bots) passa — não temos como comparar, e o SameSite cobre o navegador.
 */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function guard(req: Request, scope: string, limit: number, windowMs: number) {
  if (!sameOrigin(req)) {
    return failure("Origem inválida.", 403);
  }
  const rl = rateLimit(clientKey(req, scope), limit, windowMs);
  if (!rl.ok) {
    return failure("Muitas requisições. Tente novamente em instantes.", 429, {
      retryAfterMs: Math.max(0, rl.resetMs)
    });
  }
  return null;
}

export async function requireAdmin(): Promise<
  { ok: true; email: string } | { ok: false; response: ReturnType<typeof failure> }
> {
  const session = await getSession();
  if (!session) return { ok: false, response: failure("Não autorizado.", 401) };
  return { ok: true, email: session.email };
}

/**
 * Erros de negócio cuja mensagem pode ir ao cliente em produção (não vaza
 * caminhos, variáveis ou segredos; é a mesma frase que a UI já apresenta).
 */
const BUSINESS_ERROR_NAMES = new Set([
  "ProviderUnavailableError",
  "ProviderRateLimitError",
  "LLMProviderError",
  "LLMBudgetError",
  "HttpError"
]);

export function handleError(err: unknown) {
  const real = err instanceof Error ? err : new Error("Erro interno.");
  const status = real.message === "NAO_AUTENTICADO" ? 401 : 500;
  // Log server-side sempre (observabilidade). Em produção o cliente NÃO recebe
  // a mensagem bruta — evita vazar detalhes internos (CWE-209).
  console.error(`[api] ${status} ${real.name}: ${real.message}`);
  const isProd = process.env.NODE_ENV === "production";
  const expose = !isProd || real.message === "NAO_AUTENTICADO" || BUSINESS_ERROR_NAMES.has(real.name);
  return failure(expose ? real.message : "Erro interno.", status);
}
