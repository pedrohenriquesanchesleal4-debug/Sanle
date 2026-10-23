"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Field } from "@/components/admin/ui";
import { api, errorFields, errorMessage } from "@/lib/client-api";
import { FUNNEL_STAGES } from "@/lib/types";
import { segments } from "@/content/brand";

export function LeadForm({
  onClose,
  onCreated
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [form, setForm] = useState({
    companyName: "",
    tradeName: "",
    segment: "",
    category: "",
    city: "Brasília",
    uf: "DF",
    address: "",
    website: "",
    phone: "",
    email: "",
    linkedin: "",
    hypothesis: "",
    notes: "",
    priority: "media",
    stage: "identificado"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    try {
      const lead = await api.post<{ id: string }>("/api/crm/leads", form);
      onCreated(lead.id);
    } catch (err) {
      const fields = errorFields(err);
      setErrors(Object.keys(fields).length ? fields : { _: errorMessage(err) });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#08090C]/80 p-4 backdrop-blur-md">
      <form
        onSubmit={submit}
        className="my-8 w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#111318] p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#78A9FF]">
              CADASTRO COMERCIAL
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[#F5F6F8]">Novo lead</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg border border-white/[0.08] bg-[#191C22] p-1.5 text-[#969DA8] transition hover:text-[#F5F6F8]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Empresa" error={errors.companyName} required>
            <input className="field" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
          </Field>
          <Field label="Nome fantasia">
            <input className="field" value={form.tradeName} onChange={(e) => update("tradeName", e.target.value)} />
          </Field>
          <Field label="Segmento">
            <select className="field" value={form.segment} onChange={(e) => update("segment", e.target.value)}>
              <option value="">—</option>
              {segments.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Categoria / CNAE">
            <input className="field" value={form.category} onChange={(e) => update("category", e.target.value)} />
          </Field>
          <Field label="Cidade">
            <input className="field" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="UF">
            <input className="field" maxLength={2} value={form.uf} onChange={(e) => update("uf", e.target.value.toUpperCase())} />
          </Field>
          <Field label="Site">
            <input className="field" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" />
          </Field>
          <Field label="Telefone">
            <input className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="E-mail">
            <input className="field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="LinkedIn">
            <input className="field" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
          </Field>
          <Field label="Endereço">
            <input className="field" value={form.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
          <Field label="Prioridade">
            <select className="field" value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </Field>
          <Field label="Etapa">
            <select className="field" value={form.stage} onChange={(e) => update("stage", e.target.value)}>
              {FUNNEL_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Hipótese de problema" hint="Marcada como hipótese — não como fato verificado">
            <input className="field" value={form.hypothesis} onChange={(e) => update("hypothesis", e.target.value)} />
          </Field>
          <Field label="Notas internas">
            <textarea className="field min-h-[80px]" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </Field>
        </div>

        {errors._ && <p className="mt-3 text-sm text-[#FF6B6B]">{errors._}</p>}

        <div className="mt-6 flex justify-end gap-3 border-t border-white/[0.06] pt-4">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={sending} className="btn btn-primary">
            {sending && <Loader2 size={15} className="animate-spin" />} Salvar lead
          </button>
        </div>
      </form>
    </div>
  );
}
