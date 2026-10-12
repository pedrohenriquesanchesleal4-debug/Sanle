"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { segments } from "@/content/brand";

type FieldErrors = Record<string, string>;

const initial = {
  contactName: "",
  companyName: "",
  contactEmail: "",
  contactPhone: "",
  segment: "",
  problemDescription: "",
  bottleneckStep: "",
  volumeApprox: "",
  currentSystem: "",
  website: ""
};

export function DiagnosticoForm() {
  const [form, setForm] = useState(initial);
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [protocol, setProtocol] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!consent) {
      setErrors({ consent: "É necessário autorizar o contato para enviar." });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fields ?? { _: json.error ?? "Não foi possível enviar." });
        return;
      }
      setProtocol(json.data.protocol ?? "recebido");
      setForm(initial);
    } catch {
      setErrors({ _: "Falha de conexão. Tente novamente." });
    } finally {
      setSending(false);
    }
  }

  if (protocol) {
    return (
      <div className="panel p-8 md:p-12">
        <CheckCircle2 className="text-cobalt" size={40} aria-hidden />
        <h2 className="mt-5 font-display text-3xl text-ink">Diagnóstico recebido.</h2>
        <p className="mt-4 max-w-xl text-ink-soft">
          Guardamos sua solicitação sob o protocolo{" "}
          <span className="font-mono text-ink">{protocol}</span>. A equipe da Sanle vai analisar o processo
          descrito e retornar com um caminho de conversa.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/solucoes" className="btn btn-primary">
            Ver soluções <ArrowRight size={16} />
          </Link>
          <Link href="/" className="btn btn-ghost">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-6 p-6 md:p-9" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Seu nome" error={errors.contactName} required>
          <input
            className="field"
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            autoComplete="name"
            maxLength={120}
            required
          />
        </Field>
        <Field label="Empresa" error={errors.companyName} required>
          <input
            className="field"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            autoComplete="organization"
            maxLength={160}
            required
          />
        </Field>
        <Field label="E-mail" error={errors.contactEmail} required>
          <input
            type="email"
            className="field"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            autoComplete="email"
            maxLength={160}
            required
          />
        </Field>
        <Field label="Telefone / WhatsApp" error={errors.contactPhone} hint="Opcional">
          <input
            className="field"
            value={form.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
            autoComplete="tel"
            maxLength={40}
          />
        </Field>
      </div>

      <Field label="Segmento" error={errors.segment} required>
        <select
          className="field"
          value={form.segment}
          onChange={(e) => update("segment", e.target.value)}
          required
        >
          <option value="">Selecione…</option>
          {segments.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="Outro">Outro</option>
        </select>
      </Field>

      <Field
        label="Qual processo mais consome tempo hoje?"
        error={errors.problemDescription}
        hint="Descreva a tarefa manual, quem executa e o que acontece quando dá errado."
        required
      >
        <textarea
          className="field min-h-[140px] resize-y"
          value={form.problemDescription}
          onChange={(e) => update("problemDescription", e.target.value)}
          maxLength={4000}
          required
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Etapa gargalo" hint="Opcional">
          <input
            className="field"
            value={form.bottleneckStep}
            onChange={(e) => update("bottleneckStep", e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Volume aproximado" hint="Ex.: 500 notas/mês">
          <input
            className="field"
            value={form.volumeApprox}
            onChange={(e) => update("volumeApprox", e.target.value)}
            maxLength={120}
          />
        </Field>
        <Field label="Sistemas usados hoje" hint="Opcional">
          <input
            className="field"
            value={form.currentSystem}
            onChange={(e) => update("currentSystem", e.target.value)}
            maxLength={200}
          />
        </Field>
      </div>

      {/* Honeypot anti-bot: invisível para pessoas, tentador para scripts. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Não preencha
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-cobalt"
          required
        />
        <span>
          Autorizo a Sanle a usar estes dados para entrar em contato sobre este diagnóstico, conforme a{" "}
          <Link href="/privacidade" className="text-cobalt underline decoration-dotted">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>
      {errors.consent && <p className="text-sm text-rust">{errors.consent}</p>}
      {errors._ && <p className="text-sm text-rust">{errors._}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending} className="btn btn-primary">
          {sending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {sending ? "Enviando…" : "Enviar diagnóstico"}
        </button>
        <span className="flex items-center gap-2 text-xs text-ink-soft/70">
          <ShieldCheck size={14} aria-hidden /> Coleta mínima · uso restrito à finalidade
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
          {label} {required && <span className="text-rust">*</span>}
        </span>
        {hint && <span className="text-[0.68rem] text-ink-soft/60">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-rust">{error}</span>}
    </label>
  );
}
