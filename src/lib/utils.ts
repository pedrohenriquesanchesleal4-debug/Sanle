import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes Tailwind com merge inteligente de conflitos. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Normaliza texto para comparação (dedupe, busca): minúsculas, sem acento, sem pontuação. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normaliza telefone brasileiro para dígitos + DDI opcional (dedupe de leads). */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  // Remove 0 inicial de discagem
  const stripped = digits.startsWith("0") ? digits.slice(1) : digits;
  return stripped;
}

/** Extrai o domínio raiz de uma URL para dedupe. */
export function extractDomain(url: string): string {
  if (!url) return "";
  try {
    const withProto = url.startsWith("http") ? url : `https://${url}`;
    const host = new URL(withProto).hostname.toLowerCase();
    return host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Formata data em pt-BR de forma segura (server-safe). */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

/** Formata data e hora em pt-BR. */
export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(d);
}

/** Há quanto tempo (relativo), em pt-BR. */
export function timeAgo(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (Math.abs(mins) < 60) return `${mins}min atrás`;
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return `${hours}h atrás`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return `${days}d atrás`;
  return formatDate(d);
}

/** Gera protocolo legível para solicitações de diagnóstico. */
export function makeProtocol(prefix = "SNL"): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${y}${m}-${rand}`;
}

/** Trunca texto preservando começo e fim. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const head = Math.ceil(max * 0.6);
  const tail = max - head - 1;
  return `${text.slice(0, head)}…${text.slice(-tail)}`;
}

/** Debounce simples tipado. */
export function debounce<T extends (...args: never[]) => void>(fn: T, wait = 250) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
