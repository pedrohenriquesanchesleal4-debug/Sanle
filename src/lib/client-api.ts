"use client";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; fields?: Record<string, string> };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }
  });
  const json = (await res.json().catch(() => ({}))) as ApiResult<T>;
  if (!res.ok || !json.ok) {
    const err = json as { error?: string; fields?: Record<string, string> };
    const error = new Error(err.error ?? "Falha na requisição.");
    (error as Error & { fields?: Record<string, string> }).fields = err.fields;
    throw error;
  }
  return json.data;
}

export const api = {
  get: <T>(url: string) => request<T>(url, { method: "GET" }),
  post: <T>(url: string, body?: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: <T>(url: string, body?: unknown) => request<T>(url, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" })
};

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Erro inesperado.";
}

export function errorFields(err: unknown): Record<string, string> {
  const f = (err as { fields?: Record<string, string> } | undefined)?.fields;
  return f ?? {};
}
