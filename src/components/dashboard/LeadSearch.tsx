"use client";

import { Compass, Loader2, FileSpreadsheet, Upload } from "lucide-react";
import { Panel, Field } from "@/components/admin/ui";
import type { ProspectCandidate, ProspectProviderId } from "@/lib/providers/types";

const PROVIDERS: { id: ProspectProviderId; label: string }[] = [
  { id: "sanle_ai", label: "Sanle AI — Radar de Empresas com Oportunidade Real (Recomendado)" },
  { id: "osm", label: "OpenStreetMap / Overpass (Gratuito)" },
  { id: "google_places", label: "Google Places (Chave própria)" },
  { id: "csv", label: "Importação via CSV" },
  { id: "manual", label: "Cadastro Manual" }
];

const QUICK_NICHES = [
  "Todos (Alta Chance de Venda)",
  "Vidraçaria",
  "Clínica Odontológica",
  "Contabilidade / BPO",
  "Distribuidora / Atacado",
  "Oficina Mecânica",
  "Despachante / Imobiliária",
  "Restaurante"
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
        description="Defina nicho, cidade e bairro. O Radar Sanle AI mapeia empresas do nicho com diagnóstico comercial pronto para abordagem."
      >
        {/* Atalhos rápidos de nicho */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
            Sugestões:
          </span>
          {QUICK_NICHES.map((niche) => {
            const isAll = niche.startsWith("Todos");
            const isSelected = isAll
              ? form.category.toLowerCase().includes("todo") || form.category === ""
              : form.category.toLowerCase() === niche.toLowerCase();

            return (
              <button
                key={niche}
                type="button"
                onClick={() => setForm((f) => ({ ...f, category: isAll ? "Todos" : niche }))}
                className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[#B7F36B]/60 bg-[#B7F36B]/20 text-[#B7F36B] font-bold shadow-sm"
                    : "border-[#F5F6F8]/10 bg-[#111318] text-[#969DA8] hover:text-[#F5F6F8] hover:border-white/20"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>

        <form onSubmit={onRunSearch} className="grid gap-3.5 md:grid-cols-12">
          <div className="md:col-span-5">
            <Field label="Nicho / Categoria" required>
              <input
                className="field"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="ex.: Todos, vidraçaria, oficina, clínica"
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
                placeholder="ex.: Asa Norte, SIA, Taguatinga"
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Filtro / Termos extras">
              <input
                className="field"
                value={form.terms}
                onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                placeholder="ex.: temperado, 24h, esquadrias"
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
                placeholder="ex.: Oportunidades DF Alta Probabilidade"
              />
            </Field>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 md:col-span-12">
            <label className="flex items-center gap-2 text-xs text-[#969DA8] cursor-pointer">
              <input
                type="checkbox"
                checked={form.save}
                onChange={(e) => setForm((f) => ({ ...f, save: e.target.checked }))}
              />
              Registrar busca no histórico
            </label>

            <button type="submit" className="btn btn-primary cursor-pointer" disabled={searching}>
              {searching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Compass size={15} />
              )}
              {searching ? "Varrendo território com IA…" : "Encontrar oportunidades com chance real"}
            </button>
          </div>
        </form>
      </Panel>

      {/* Painel lateral: Importação CSV complementar (Seção 15) */}
      <Panel
        className="lg:col-span-4"
        title="Importar lista própria (CSV)"
        description="Suba arquivos de entidades comerciais locais, exportações do Google Maps ou listas de prospecção."
      >
        <form onSubmit={onUploadCsv} className="space-y-3">
          <input
            type="file"
            name="file"
            accept=".csv,text/csv,text/plain"
            required
            aria-label="Arquivo CSV para importação"
            className="block w-full text-xs text-[#969DA8] file:mr-2.5 file:rounded-full file:border file:border-white/10 file:bg-[#111318] file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:text-[#F5F6F8] file:transition-colors hover:file:border-white/30"
          />

          <button
            type="submit"
            disabled={csvBusy}
            className="btn btn-ghost w-full justify-center !py-2 text-xs"
          >
            {csvBusy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {csvBusy ? "Processando…" : "Validar e pré-visualizar"}
          </button>
        </form>

        {csv && (
          <div className="mt-4 space-y-3 rounded-lg border border-[#F5F6F8]/10 bg-[#111318] p-3 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#B7F36B]">
              <FileSpreadsheet size={14} />
              <span>{csv.candidates.length} registros válidos</span>
            </div>
            <p className="text-[11px] text-[#969DA8]">
              Colunas mapeadas: {csv.columns.join(", ")}
            </p>
            {csv.errors.length > 0 && (
              <p className="text-[11px] text-[#F26464]">
                {csv.errors.length} avisos de formato
              </p>
            )}
            <button
              type="button"
              onClick={onImportCsv}
              disabled={importing || csv.candidates.length === 0}
              className="btn btn-primary w-full justify-center !py-1.5 text-xs"
            >
              <Upload size={13} />
              {importing ? "Importando…" : "Gravar candidatos no CRM"}
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
