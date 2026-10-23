"use client";

import { Compass, Loader2, FileSpreadsheet, Upload } from "lucide-react";
import { Panel, Field } from "@/components/admin/ui";
import type { ProspectCandidate, ProspectProviderId } from "@/lib/providers/types";

const PROVIDERS: { id: ProspectProviderId; label: string }[] = [
  { id: "osm", label: "OpenStreetMap / Overpass (Gratuito Default)" },
  { id: "google_places", label: "Google Places (Opcional / Chave própria)" },
  { id: "csv", label: "CSV" },
  { id: "manual", label: "Manual" }
];

const QUICK_NICHES = [
  "Vidraçaria",
  "Oficina mecânica",
  "Restaurante",
  "Clínica odontológica",
  "Barbearia",
  "Contabilidade"
] as const;

export interface LeadSearchFormState {
  city: string;
  uf: string;
  district: string;
  category: string;
  terms: string;
  limit: string;
  provider: ProspectProviderId;
  save: boolean;
  label: string;
}

interface LeadSearchProps {
  form: LeadSearchFormState;
  setForm: React.Dispatch<React.SetStateAction<LeadSearchFormState>>;
  searching: boolean;
  onRunSearch: (e: React.FormEvent) => void;
  csvBusy: boolean;
  csv: {
    columns: string[];
    parsedRows: number;
    candidates: ProspectCandidate[];
    errors: string[];
    window: { city: string | null; uf: string | null; category: string | null };
  } | null;
  importing: boolean;
  onUploadCsv: (e: React.FormEvent<HTMLFormElement>) => void;
  onImportCsv: () => void;
}

/**
 * SALES HUNTER — LeadSearch (Seção 13 & 15)
 * Área de pesquisa visualmente forte permitindo Nicho, Cidade, Bairro,
 * Filtros, seleção rápida de categorias e importação CSV complementar.
 */
export function LeadSearch({
  form,
  setForm,
  searching,
  onRunSearch,
  csvBusy,
  csv,
  importing,
  onUploadCsv,
  onImportCsv
}: LeadSearchProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <Panel
        className="lg:col-span-8"
        title="Explorar território e encontrar empresas"
        description="Defina nicho, cidade e bairro. O provedor padrão OpenStreetMap é 100% gratuito."
      >
        {/* Atalhos rápidos de nicho */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
            Sugestões:
          </span>
          {QUICK_NICHES.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: niche }))}
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                form.category.toLowerCase() === niche.toLowerCase()
                  ? "border-[#B7F36B]/50 bg-[#B7F36B]/15 text-[#B7F36B]"
                  : "border-[#F5F6F8]/10 bg-[#111318] text-[#969DA8] hover:text-[#F5F6F8]"
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        <form onSubmit={onRunSearch} className="grid gap-3.5 md:grid-cols-12">
          <div className="md:col-span-5">
            <Field label="Nicho / Categoria" required>
              <input
                className="field"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="ex.: vidraçaria, oficina, clínica"
                required
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Cidade" required>
              <input
                className="field"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="UF" required>
              <input
                className="field"
                maxLength={2}
                value={form.uf}
                onChange={(e) =>
                  setForm((f) => ({ ...f, uf: e.target.value.toUpperCase() }))
                }
                required
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Bairro / Região">
              <input
                className="field"
                value={form.district}
                onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                placeholder="ex.: Asa Norte, SIA"
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Filtro / Termos extras">
              <input
                className="field"
                value={form.terms}
                onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                placeholder="ex.: temperado, 24h"
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Limite de resultados">
              <input
                className="field"
                type="number"
                min={1}
                max={100}
                value={form.limit}
                onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <Field label="Fonte de dados">
              <select
                className="field"
                value={form.provider}
                onChange={(e) =>
                  setForm((f) => ({ ...f, provider: e.target.value as ProspectProviderId }))
                }
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="md:col-span-6">
            <Field label="Rótulo da busca (opcional)">
              <input
                className="field"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="ex.: Vidraçarias DF Outubro"
              />
            </Field>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 md:col-span-12">
            <label className="flex items-center gap-2 text-xs text-[#969DA8]">
              <input
                type="checkbox"
                checked={form.save}
                onChange={(e) => setForm((f) => ({ ...f, save: e.target.checked }))}
              />
              Registrar busca no histórico
            </label>

            <button type="submit" className="btn btn-primary" disabled={searching}>
              {searching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Compass size={15} />
              )}
              {searching ? "Varrendo território…" : "Encontrar oportunidades"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel
        className="lg:col-span-4"
        title="Importar planilha CSV"
        description="Colunas aceitas: empresa, telefone, site, email, cidade, uf, endereço, categoria."
      >
        <form onSubmit={onUploadCsv} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <input className="field !text-xs" name="city" placeholder="Cidade" />
            <input className="field !text-xs" name="uf" maxLength={2} placeholder="UF" />
            <input className="field !text-xs" name="category" placeholder="Nicho" />
          </div>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            className="block w-full text-xs text-[#969DA8] file:mr-3 file:rounded-lg file:border-0 file:bg-[#111318] file:px-3.5 file:py-2 file:font-mono file:text-[11px] file:text-[#F5F6F8]"
            required
          />
          <button type="submit" className="btn btn-ghost w-full justify-center text-xs" disabled={csvBusy}>
            {csvBusy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileSpreadsheet size={15} />
            )}
            {csvBusy ? "Processando…" : "Validar arquivo CSV"}
          </button>
        </form>

        {csv && (
          <div className="mt-4 rounded-xl border border-[#B7F36B]/30 bg-[#111318] p-4">
            <p className="text-xs text-[#F5F6F8]">
              <strong>{csv.candidates.length}</strong> candidatos válidos de {csv.parsedRows} linhas
            </p>
            {csv.errors.length > 0 && (
              <p className="mt-1 text-[11px] text-[#F26464]">
                {csv.errors.length} linhas ignoradas ({csv.errors[0]})
              </p>
            )}
            <button
              type="button"
              onClick={onImportCsv}
              className="btn btn-primary mt-3 w-full justify-center text-xs"
              disabled={importing}
            >
              <Upload size={14} /> Importar {csv.candidates.length} empresas
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
