"use client";

import { useCallback, useEffect, useState } from "react";
import { Compass, Loader2, Upload, Check, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Panel, Badge, Spinner, Notice, EmptyState, Field } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import type { ProspectCandidate, ProspectProviderId } from "@/lib/providers/types";
import type { SearchResultItem, ProspectSearchResult, ImportReport } from "@/lib/crm/prospect-service";
import type { SavedSearch } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const PROVIDERS: { id: ProspectProviderId; label: string }[] = [
  { id: "osm", label: "OpenStreetMap (Overpass)" },
  { id: "google_places", label: "Google Places (pago)" },
  { id: "csv", label: "CSV" },
  { id: "manual", label: "Manual" }
];

export default function ProspectsPage() {
  const [form, setForm] = useState({
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
  const [csv, setCsv] = useState<{ columns: string[]; parsedRows: number; candidates: ProspectCandidate[]; errors: string[]; window: { city: string | null; uf: string | null; category: string | null } } | null>(null);
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

  async function importSelected() {
    if (!result) return;
    const candidates = result.items.filter((i) => selected.has(i.externalId));
    setImporting(true);
    setError(null);
    try {
      const rep = await api.post<ImportReport>("/api/prospects/import", { candidates, label: result.query.category });
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
      <header>
        <p className="eyebrow">Prospecção</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Buscar e importar candidatos</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft/70">
          Fontes oficiais e abertas (Overpass/OSM) ou CSV próprio. Nada é mesclado automaticamente:
          duplicatas são sinalizadas e a decisão é sempre sua.
        </p>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Nova busca" description="OpenStreetMap é gratuito; Google Places exige chave e orçamento">
          <form onSubmit={runSearch} className="grid gap-3 md:grid-cols-2">
            <Field label="Cidade">
              <input className="field" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            </Field>
            <Field label="UF">
              <input className="field" maxLength={2} value={form.uf} onChange={(e) => setForm((f) => ({ ...f, uf: e.target.value.toUpperCase() }))} required />
            </Field>
            <Field label="Bairro (opcional)">
              <input className="field" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} />
            </Field>
            <Field label="Categoria / CNAE">
              <input className="field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="ex.: restaurante, oficina" required />
            </Field>
            <Field label="Termos extras">
              <input className="field" value={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))} />
            </Field>
            <Field label="Limite">
              <input className="field" type="number" min={1} max={100} value={form.limit} onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))} />
            </Field>
            <Field label="Fonte">
              <select className="field" value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value as ProspectProviderId }))}>
                {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Salvar busca">
              <input className="field" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="nome da busca (opcional)" />
            </Field>
            <div className="md:col-span-2 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input type="checkbox" checked={form.save} onChange={(e) => setForm((f) => ({ ...f, save: e.target.checked }))} />
                Salvar nos históricos
              </label>
              <button type="submit" className="btn btn-primary" disabled={searching}>
                {searching ? <Loader2 size={15} className="animate-spin" /> : <Compass size={15} />}
                {searching ? "Buscando…" : "Buscar"}
              </button>
            </div>
          </form>
        </Panel>

        <Panel title="Importar CSV" description="Colunas reconhecidas: empresa, telefone, site, email, cidade, uf, endereço, categoria">
          <form onSubmit={uploadCsv} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <input className="field" name="city" placeholder="Cidade (padrão)" />
              <input className="field" name="uf" maxLength={2} placeholder="UF" />
              <input className="field" name="category" placeholder="Categoria" />
            </div>
            <input type="file" name="file" accept=".csv,text/csv" className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:text-paper" required />
            <button type="submit" className="btn btn-ghost" disabled={csvBusy}>
              {csvBusy ? <Loader2 size={15} className="animate-spin" /> : <FileSpreadsheet size={15} />}
              {csvBusy ? "Processando…" : "Ler CSV"}
            </button>
          </form>

          {csv && (
            <div className="mt-4 rounded-lg border border-[var(--rule)] p-4">
              <p className="text-sm text-ink">
                <strong>{csv.candidates.length}</strong> candidatos lidos de {csv.parsedRows} linhas
                {csv.window.city && ` · ${csv.window.city}/${csv.window.uf ?? ""}`}
              </p>
              {csv.errors.length > 0 && (
                <p className="mt-1 text-xs text-rust">{csv.errors.length} linhas ignoradas (primeira: {csv.errors[0]})</p>
              )}
              <button type="button" onClick={() => void importCsv()} className="btn btn-primary mt-3" disabled={importing}>
                <Upload size={15} /> Importar {csv.candidates.length} candidatos
              </button>
            </div>
          )}
        </Panel>
      </div>

      {report && (
        <Notice tone="ok">
          <strong>{report.created.length}</strong> leads criados · <strong>{report.skipped.length}</strong> ignorados
          {report.skipped[0] && <> (ex.: {report.skipped[0].companyName} — {report.skipped[0].reason})</>}
        </Notice>
      )}

      {result && (
        <Panel
          title={`Resultado — ${result.providerLabel}`}
          description={`${result.total} candidatos · ${result.query.category} em ${result.query.city}/${result.query.uf}`}
          actions={
            <button type="button" className="btn btn-primary" disabled={selected.size === 0 || importing} onClick={() => void importSelected()}>
              <Upload size={15} /> Importar {selected.size > 0 ? `${selected.size} selecionados` : "selecionados"}
            </button>
          }
        >
          {result.note && <p className="mb-3 text-xs text-ink-soft/70">{result.note}</p>}
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--rule)] text-left font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-soft/70">
                  <th className="px-5 py-2 w-10"><span className="sr-only">Selecionar</span></th>
                  <th className="px-3 py-2">Empresa</th>
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2">Contato</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-5 py-2 text-right">Importar</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={item.externalId} className="border-b border-[var(--rule)]">
                    <td className="px-5 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${item.companyName}`}
                        checked={selected.has(item.externalId)}
                        disabled={item.alreadyInCrm}
                        onChange={() => toggle(item.externalId)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-ink">{item.tradeName || item.companyName}</p>
                      <p className="text-xs text-ink-soft/70">{[item.address, item.city, item.uf].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="px-3 py-2 text-xs text-ink-soft">{item.category ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-ink-soft">
                      {item.phone && <p>{item.phone}</p>}
                      {item.website && <p className="truncate max-w-[180px]">{item.website}</p>}
                      {!item.phone && !item.website && <span className="text-ink-soft/50">sem contato</span>}
                    </td>
                    <td className="px-3 py-2">
                      {item.alreadyInCrm ? (
                        <Badge tone="rust">já no CRM</Badge>
                      ) : item.duplicateWithin ? (
                        <Badge tone="neutral">repetido</Badge>
                      ) : (
                        <Badge tone="lime">novo</Badge>
                      )}
                      {item.matchReason && <p className="mt-1 text-[0.64rem] text-ink-soft/60">{item.matchReason}</p>}
                    </td>
                    <td className="px-5 py-2 text-right">
                      {item.alreadyInCrm ? (
                        <span className="text-xs text-ink-soft/50">—</span>
                      ) : (
                        <button type="button" className="text-xs text-cobalt" onClick={() => toggle(item.externalId)}>
                          {selected.has(item.externalId) ? "remover" : "selecionar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel title="Buscas salvas" description="Histórico de prospecções">
        {searches.length === 0 ? (
          <p className="text-sm text-ink-soft/70">Nenhuma busca salva ainda.</p>
        ) : (
          <ul className="space-y-2">
            {searches.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 border-b border-[var(--rule)] pb-2 text-sm last:border-0">
                <span className="text-ink">{s.label}</span>
                <span className="shrink-0 text-xs text-ink-soft/60">
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
