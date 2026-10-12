"use client";

/**
 * SANLE — Primitivas de formulário acessíveis (WCAG 2.2 AA).
 *
 * Base aditiva: nenhum formulário existente é alterado. Os componentes passam a adotar
 * `<FormField>` incrementalmente, substituindo o `Field` duplicado em
 * `components/site/DiagnosticoForm.tsx` e `components/admin/ui.tsx`.
 *
 * Contrato de acessibilidade que este módulo garante por construção:
 *   - `<label htmlFor>` explicitamente associado ao controle (`id` derivado de `name`);
 *   - `aria-describedby` aponta para hint e/ou mensagem de erro;
 *   - `aria-invalid="true"` quando há erro;
 *   - `aria-required` em campos obrigatórios e marca visual `*` com texto para leitor de tela;
 *   - erro com `role="alert"` (anúncio imediato) e mensagem orientada à ação;
 *   - grupos (radio/checkbox) em `<fieldset><legend>` via `<FormGroup>`.
 */
import { cn } from "@/lib/utils";

/** Props de ARIA que o controle interno deve receber. */
export type FieldAria = {
  id: string;
  name: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
  "aria-required": true | undefined;
};

export function fieldAria(
  name: string,
  { error, hint, required }: { error?: string; hint?: string; required?: boolean }
): FieldAria {
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null]
    .filter(Boolean)
    .join(" ");
  return {
    id: name,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    "aria-required": required ? true : undefined
  };
}

/**
 * Campo de formulário com label, hint e erro wiring completo.
 *
 * `children` é uma função de render que recebe `FieldAria` — isso evita `cloneElement`
 * e mantém o tipo do controle (input/select/textarea) previsível para o TypeScript.
 *
 * @example
 * <FormField name="contactEmail" label="E-mail" error={errors.contactEmail} required autoComplete="email">
 *   {(aria) => <input className="field" type="email" {...aria} value={...} onChange={...} />}
 * </FormField>
 */
export function FormField({
  name,
  label,
  hint,
  error,
  required,
  optionalLabel,
  className,
  children
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Rotula explicitamente campos opcionais (WCAG 2.2 — evita ambiguidade). */
  optionalLabel?: string;
  className?: string;
  children: (aria: FieldAria) => React.ReactNode;
}) {
  const aria = fieldAria(name, { error, hint, required });
  return (
    <div className={cn("block", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={name}
          className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft"
        >
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="text-rust">
                {" "}
                *
              </span>
              <span className="sr-only"> (obrigatório)</span>
            </>
          ) : optionalLabel ? (
            <span className="ml-1 normal-case tracking-normal text-ink-soft/50">({optionalLabel})</span>
          ) : null}
        </label>
        {hint && (
          <span id={`${name}-hint`} className="text-[0.68rem] text-ink-soft/60">
            {hint}
          </span>
        )}
      </div>
      {children(aria)}
      <FormError id={`${name}-error`} message={error} />
    </div>
  );
}

/** Mensagem de erro anunciada por leitor de tela. `role="alert"` implica `aria-live=assertive`. */
export function FormError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-rust">
      {message}
    </p>
  );
}

/**
 * Agrupa controles relacionados (radio/checkbox) com `fieldset`/`legend` — WCAG 1.3.1/3.3.2.
 */
export function FormGroup({
  legend,
  hint,
  error,
  required,
  className,
  children
}: {
  legend: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("block", className)} aria-invalid={error ? true : undefined}>
      <legend className="mb-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
        {legend}
        {required && (
          <>
            <span aria-hidden="true" className="text-rust">
              {" "}
              *
            </span>
            <span className="sr-only"> (obrigatório)</span>
          </>
        )}
      </legend>
      {hint && <p className="mb-2 text-[0.68rem] text-ink-soft/60">{hint}</p>}
      <div className="space-y-2">{children}</div>
      <FormError id={`${legend}-error`} message={error} />
    </fieldset>
  );
}

/**
 * Região de status do formulário (`aria-live="polite"`): para erro de submit (rede/servidor)
 * e confirmação de sucesso. Reservar `role="alert"` para erro de campo; aqui é status geral.
 */
export function FormStatus({
  tone = "error",
  children
}: {
  tone?: "error" | "success" | "info";
  children?: React.ReactNode;
}) {
  const styles = {
    error: "border-rust/30 bg-rust/8 text-rust",
    success: "border-cobalt/25 bg-cobalt/6 text-cobalt",
    info: "border-[var(--rule)] bg-black/[0.02] text-ink-soft"
  } as const;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-lg border px-4 py-3 text-sm", styles[tone])}
    >
      {children}
    </div>
  );
}
