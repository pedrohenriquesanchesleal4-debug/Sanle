"use client";

import { cn } from "@/lib/utils";

/**
 * SALES HUNTER — Componentes Base do Ambiente B (Aplicação / Dashboard)
 * Paleta: #08090C (fundo), #111318 (grafite), #191C22 (superfícies),
 * #F5F6F8 (branco), #969DA8 (cinza sec.), #B7F36B (verde oport.), #78A9FF (azul explor.)
 */
export function Panel({
  title,
  description,
  actions,
  children,
  className
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-hunter border border-[#F5F6F8]/8 bg-[#191C22] text-[#F5F6F8] shadow-hunter-card transition-colors duration-200",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F5F6F8]/8 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-display text-base font-semibold tracking-tight text-[#F5F6F8]">
                {title}
              </h2>
            )}
            {description && <p className="mt-0.5 text-xs text-[#969DA8]">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-hunter border p-4 transition-colors",
        accent
          ? "border-[#B7F36B]/40 bg-[#B7F36B]/10"
          : "border-[#F5F6F8]/8 bg-[#191C22]"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#969DA8]">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-2xl font-semibold",
          accent ? "text-[#B7F36B]" : "text-[#F5F6F8]"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[#969DA8]">{hint}</p>}
    </div>
  );
}

const TONES: Record<string, string> = {
  neutral: "border-[#F5F6F8]/12 bg-[#111318] text-[#969DA8]",
  cobalt: "border-[#78A9FF]/35 bg-[#78A9FF]/12 text-[#78A9FF]",
  lime: "border-[#B7F36B]/40 bg-[#B7F36B]/14 text-[#B7F36B]",
  rust: "border-[#F26464]/35 bg-[#F26464]/12 text-[#F26464]",
  ink: "border-[#F5F6F8]/20 bg-[#F5F6F8] text-[#08090C]"
};

export function Badge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES | string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]",
        TONES[tone] ?? TONES.neutral
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-hunter border border-dashed border-[#F5F6F8]/15 bg-[#111318]/60 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-[#F5F6F8]">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-[#969DA8]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  children
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
          {label}
          {required && <span className="text-[#B7F36B]"> *</span>}
        </span>
        {hint && <span className="text-[11px] text-[#969DA8]/70">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-[#F26464]">{error}</span>}
    </label>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[#969DA8]">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-[#F5F6F8]/15 border-t-[#B7F36B]"
        aria-hidden
      />
      {label ?? "Carregando…"}
    </div>
  );
}

export function Notice({
  tone = "neutral",
  children
}: {
  tone?: "neutral" | "warn" | "ok";
  children: React.ReactNode;
}) {
  const styles = {
    neutral: "border-[#F5F6F8]/12 bg-[#111318] text-[#969DA8]",
    warn: "border-[#F26464]/35 bg-[#F26464]/10 text-[#F26464]",
    ok: "border-[#B7F36B]/35 bg-[#B7F36B]/10 text-[#B7F36B]"
  } as const;
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", styles[tone])}>{children}</div>;
}
