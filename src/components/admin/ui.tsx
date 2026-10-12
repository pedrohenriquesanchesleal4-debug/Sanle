"use client";

import { cn } from "@/lib/utils";

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
    <section className={cn("rounded-2xl border border-[var(--rule)] bg-white", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--rule)] px-5 py-4">
          <div>
            {title && <h2 className="font-display text-lg text-ink">{title}</h2>}
            {description && <p className="mt-1 text-sm text-ink-soft/80">{description}</p>}
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
    <div className={cn("rounded-xl border p-4", accent ? "border-cobalt/30 bg-cobalt/5" : "border-[var(--rule)] bg-white")}>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft/70">{label}</p>
      <p className={cn("mt-2 font-display text-2xl", accent ? "text-cobalt" : "text-ink")}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>}
    </div>
  );
}

const TONES: Record<string, string> = {
  neutral: "border-[var(--rule)] bg-black/[0.03] text-ink-soft",
  cobalt: "border-cobalt/30 bg-cobalt/8 text-cobalt",
  lime: "border-signal/40 bg-signal/20 text-ink",
  rust: "border-rust/30 bg-rust/10 text-rust",
  ink: "border-transparent bg-ink text-paper"
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: keyof typeof TONES | string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium", TONES[tone] ?? TONES.neutral)}>
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--rule)] px-6 py-12 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-soft/80">{description}</p>}
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
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">
          {label}
          {required && <span className="text-rust"> *</span>}
        </span>
        {hint && <span className="text-[0.66rem] text-ink-soft/60">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rust">{error}</span>}
    </label>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-soft">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--rule)] border-t-cobalt" aria-hidden />
      {label ?? "Carregando…"}
    </div>
  );
}

export function Notice({ tone = "neutral", children }: { tone?: "neutral" | "warn" | "ok"; children: React.ReactNode }) {
  const styles = {
    neutral: "border-[var(--rule)] bg-black/[0.02] text-ink-soft",
    warn: "border-rust/30 bg-rust/8 text-rust",
    ok: "border-cobalt/25 bg-cobalt/6 text-cobalt"
  } as const;
  return <div className={cn("rounded-lg border px-4 py-3 text-sm", styles[tone])}>{children}</div>;
}
