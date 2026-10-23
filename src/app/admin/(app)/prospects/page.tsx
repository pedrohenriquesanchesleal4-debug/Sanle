"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel, Notice } from "@/components/admin/ui";
import { LeadSearch, type LeadSearchFormState } from "@/components/dashboard/LeadSearch";
import { LeadResults } from "@/components/dashboard/LeadResults";
import { api, errorMessage } from "@/lib/client-api";
import type { ProspectCandidate } from "@/lib/providers/types";
import type { ProspectSearchResult, ImportReport } from "@/lib/crm/prospect-service";
import type { SavedSearch } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function ProspectsPage() {
  const [form, setForm] = useState<LeadSearchFormState>({
    city: "Brasília",
    uf: "DF",
    district: "",
    category: "",
    terms: "",
    limit: "25",
    provider: "osm",
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
        category: form.category,
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
        label: result.query.category
      });
      setReport(rep);
      setSelected(new Set());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setImporting(false);
    }
  }

  async function uploadCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCsvBusy(true);
    setError(null);
    setCsv(null);
    try {
      const res = await fetch("/api/prospects/csv", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Falha ao processar CSV.");
        return;
      }
      setCsv(json.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCsvBusy(false);
    }
  }

  async function importCsv() {
    if (!csv) return;
    setImporting(true);
    setError(null);
    try {
      const rep = await api.post<ImportReport>("/api/prospects/import", {
        candidates: csv.candidates,
        label: csv.window.category ?? "importação CSV"
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
      <header className="border-b border-[#F5F6F8]/8 pb-5">
        <p className="eyebrow text-[#78A9FF]">BUSCADOR DE EMPRESAS · PROSPECÇÃO B2B</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">
          Encontrar empresas e identificar sinais
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[#969DA8]">
          Fontes abertas (OpenStreetMap/Overpass gratuito) ou importação CSV. Duplicatas são sinalizadas e nenhuma empresa é sobrescrita automaticamente.
        </p>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      <LeadSearch
        form={form}
        setForm={setForm}
        searching={searching}
        onRunSearch={(e) => void runSearch(e)}
        csvBusy={csvBusy}
        csv={csv}
        importing={importing}
        onUploadCsv={(e) => void uploadCsv(e)}
        onImportCsv={() => void importCsv()}
      />

      {report && (
        <Notice tone="ok">
          <strong>{report.created.length}</strong> leads importados para o CRM ·{" "}
          <strong>{report.skipped.length}</strong> ignorados
          {report.skipped[0] && (
            <>
              {" "}
              (ex.: {report.skipped[0].companyName} — {report.skipped[0].reason})
            </>
          )}
        </Notice>
      )}

      {result && (
        <LeadResults
          result={result}
          selected={selected}
          importing={importing}
          onToggle={toggle}
          onSelectAllNew={selectAllNew}
          onImportSelected={() => void importSelected()}
        />
      )}

      <Panel title="Buscas recentes salvas" description="Histórico de varreduras territoriais">
        {searches.length === 0 ? (
          <p className="text-xs text-[#969DA8]">Nenhuma busca salva ainda.</p>
        ) : (
          <ul className="space-y-2">
            {searches.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 border-b border-[#F5F6F8]/8 pb-2 text-xs last:border-0"
              >
                <span className="font-medium text-[#F5F6F8]">{s.label}</span>
                <span className="shrink-0 font-mono text-[11px] text-[#969DA8]">
                  {s.category} · {s.city}/{s.uf} · {formatDateTime(s.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
