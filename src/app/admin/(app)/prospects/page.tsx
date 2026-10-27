"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel, Notice } from "@/components/admin/ui";
import { LeadSearch, type LeadSearchFormState } from "@/components/dashboard/LeadSearch";
import { LeadResults } from "@/components/dashboard/LeadResults";
import { api, errorMessage } from "@/lib/client-api";
import type { ProspectCandidate, ProspectProviderId } from "@/lib/providers/types";
import type { ProspectSearchResult, ImportReport } from "@/lib/crm/prospect-service";
import type { SavedSearch } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function ProspectsPage() {
  const [form, setForm] = useState<LeadSearchFormState>({
    city: "Brasília",
    uf: "DF",
    district: "",
    category: "Todos",
    terms: "",
    limit: "25",
    provider: "sanle_ai",
    save: true,
    label: ""
  });
  const [result, setResult] = useState<ProspectSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [csv, setCsv] = useState<{
    columns: string[];
    parsedRows: number;
    candidates: ProspectCandidate[];
    errors: string[];
    window: { city: string | null; uf: string | null; category: string | null };
  } | null>(null);
  const [csvBusy, setCsvBusy] = useState(false);

  const loadSearches = useCallback(async () => {
    try {
      setSearches(await api.get<SavedSearch[]>("/api/prospects/search?list=1"));
    } catch {
      setSearches([]);
    }
  }, []);

  useEffect(() => {
    void loadSearches();
  }, [loadSearches]);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setResult(null);
    setReport(null);
    setSelected(new Set());
    try {
      const res = await api.post<ProspectSearchResult>("/api/prospects/search", {
        city: form.city,
        uf: form.uf,
        district: form.district || undefined,
        category: form.category || "Todos",
        terms: form.terms || undefined,
        limit: Number(form.limit),
        provider: form.provider,
        save: form.save,
        label: form.label || undefined
      });
      setResult(res);
      await loadSearches();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSearching(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllNew(ids: string[]) {
    setSelected(new Set(ids));
  }

  async function importSelected() {
    if (!result) return;
    const candidates = result.items.filter((i) => selected.has(i.externalId));
    setImporting(true);
    setError(null);
    try {
      const rep = await api.post<ImportReport>("/api/prospects/import", {
        candidates,
        enrich: true,
        sourceOrigin: "busca",
        tags: [form.category, form.city, form.uf].filter(Boolean)
      });
      setReport(rep);
      setResult((r) =>
        r
          ? {
              ...r,
              items: r.items.map((i) =>
                selected.has(i.externalId) ? { ...i, alreadyInCrm: true } : i
              )
            }
          : r
      );
      setSelected(new Set());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setImporting(false);
    }
  }

  async function handleUploadCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    setCsvBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (form.city) fd.append("city", form.city);
      if (form.uf) fd.append("uf", form.uf);
      if (form.category) fd.append("category", form.category);

      const res = await fetch("/api/prospects/csv", {
        method: "POST",
        body: fd
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Falha ao processar CSV");
      setCsv(json.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCsvBusy(false);
    }
  }

  async function handleImportCsvCandidates() {
    if (!csv || !csv.candidates.length) return;
    setImporting(true);
    setError(null);
    try {
      const rep = await api.post<ImportReport>("/api/prospects/import", {
        candidates: csv.candidates,
        enrich: true,
        sourceOrigin: "importacao_csv",
        tags: ["csv", form.category || "geral"].filter(Boolean)
      });
      setReport(rep);
      setCsv(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">PROSPECÇÃO ATIVA & RADAR COMERCIAL</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">
          Radar de Oportunidades
        </h1>
        <p className="mt-1 text-sm text-[#969DA8]">
          Encontre empresas com chance real de conversão em Brasília e no Brasil.
        </p>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      {report && (
        <Notice tone="ok">
          Importação concluída: {report.created.length} novo(s) lead(s) adicionado(s) ao CRM,{" "}
          {report.skipped.length} duplicado(s) ignorados de forma segura.
        </Notice>
      )}

      <LeadSearch
        form={form}
        setForm={setForm}
        searching={searching}
        onRunSearch={runSearch}
        csvBusy={csvBusy}
        csv={csv}
        importing={importing}
        onUploadCsv={handleUploadCsv}
        onImportCsv={handleImportCsvCandidates}
      />

      {result && (
        <LeadResults
          result={result}
          selected={selected}
          importing={importing}
          onToggle={toggle}
          onSelectAllNew={selectAllNew}
          onImportSelected={importSelected}
        />
      )}

      {searches.length > 0 && (
        <Panel title="Histórico de buscas registradas" description="Últimas pesquisas realizadas">
          <div className="divide-y divide-[#F5F6F8]/8">
            {searches.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#F5F6F8]">{s.label}</p>
                  <p className="text-[#969DA8]">
                    {s.category} · {s.city}/{s.uf}
                    {s.district ? ` (${s.district})` : ""} · Fonte: {s.provider}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#969DA8]/70">
                    {formatDateTime(s.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        city: s.city || "Brasília",
                        uf: s.uf || "DF",
                        district: s.district || "",
                        category: s.category || "Todos",
                        terms: s.terms || "",
                        limit: String(s.limit || 25),
                        provider: (s.provider as ProspectProviderId) || "sanle_ai",
                        save: false,
                        label: s.label || ""
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn btn-ghost !py-1 !px-2.5 text-[11px]"
                  >
                    Recarregar filtros
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
