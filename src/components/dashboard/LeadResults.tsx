"use client";

import { useMemo, useState } from "react";
import { Upload, Sparkles, Phone, Globe, CheckSquare } from "lucide-react";
import { Panel, Badge } from "@/components/admin/ui";
import type { ProspectSearchResult, SearchResultItem } from "@/lib/crm/prospect-service";

interface LeadResultsProps {
  result: ProspectSearchResult;
  selected: Set<string>;
  importing: boolean;
  onToggle: (id: string) => void;
  onSelectAllNew: (ids: string[]) => void;
  onImportSelected: () => void;
}

/**
 * SALES HUNTER — LeadResults (Seção 13 & 15)
 * Exibe os resultados da busca com filtros rápidos (sem website nos dados consultados,
 * com telefone, apenas novos), ordenação, diagnóstico de oportunidade e ações rápidas.
 */
export function LeadResults({
  result,
  selected,
  importing,
  onToggle,
  onSelectAllNew,
  onImportSelected
}: LeadResultsProps) {
  const [filterMode, setFilterMode] = useState<"all" | "no_website" | "with_phone" | "new_only">("all");
  const [sortBy, setSortBy] = useState<"opportunity" | "name">("opportunity");

  const processedItems = useMemo(() => {
    const filtered = result.items.filter((item) => {
      if (filterMode === "no_website") return !item.website;
      if (filterMode === "with_phone") return Boolean(item.phone);
      if (filterMode === "new_only") return !item.alreadyInCrm && !item.duplicateWithin;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return (a.tradeName || a.companyName).localeCompare(b.tradeName || b.companyName);
      }
      // Prioriza empresas novas que têm telefone e não têm website identificado
      const scoreItem = (x: SearchResultItem) =>
        (x.alreadyInCrm ? 0 : 40) + (!x.website ? 35 : 10) + (x.phone ? 25 : 0);
      return scoreItem(b) - scoreItem(a);
    });
  }, [result.items, filterMode, sortBy]);

  const selectableIds = processedItems
    .filter((i) => !i.alreadyInCrm)
    .map((i) => i.externalId);

  return (
    <Panel
      title={`Resultados encontrados — ${result.providerLabel}`}
      description={`${result.total} estabelecimentos retornados para "${result.query.category}" em ${result.query.city}/${result.query.uf}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {selectableIds.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectAllNew(selectableIds)}
              className="btn btn-ghost !py-2 !px-3 text-xs"
            >
              <CheckSquare size={14} /> Selecionar filtrados ({selectableIds.length})
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary !py-2 !px-4 text-xs"
            disabled={selected.size === 0 || importing}
            onClick={onImportSelected}
          >
            <Upload size={14} />
            {importing
              ? "Importando…"
              : `Importar para o CRM (${selected.size})`}
          </button>
        </div>
      }
    >
      {result.note && (
        <p className="mb-4 rounded-lg border border-[#78A9FF]/25 bg-[#111318] px-3.5 py-2 text-xs text-[#969DA8]">
          {result.note}
        </p>
      )}

      {/* Barra de filtros e ordenação dos resultados */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F6F8]/8 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "Todos" },
              { id: "no_website", label: "Sem website nos dados" },
              { id: "with_phone", label: "Com telefone" },
              { id: "new_only", label: "Apenas inéditos" }
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterMode(f.id)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                filterMode === f.id
                  ? "bg-[#78A9FF] font-semibold text-[#08090C]"
                  : "border border-[#F5F6F8]/10 bg-[#111318] text-[#969DA8] hover:text-[#F5F6F8]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
            Ordenar:
          </span>
          <select
            aria-label="Ordenar resultados da busca"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "opportunity" | "name")}
            className="field !w-auto !py-1 !px-2.5 text-xs"
          >
            <option value="opportunity">Maior potencial de oportunidade</option>
            <option value="name">Ordem alfabética</option>
          </select>
        </div>
      </div>

      {/* Lista de cards/linhas com diagnóstico preliminar */}
      <div className="space-y-2.5">
        {processedItems.map((item) => {
          const isChecked = selected.has(item.externalId);
          const hasWebsite = Boolean(item.website);

          return (
            <div
              key={item.externalId}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                isChecked
                  ? "border-[#B7F36B]/55 bg-[#111318]"
                  : "border-[#F5F6F8]/8 bg-[#111318]/65 hover:border-[#F5F6F8]/20"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  aria-label={`Selecionar ${item.companyName}`}
                  checked={isChecked}
                  disabled={item.alreadyInCrm}
                  onChange={() => onToggle(item.externalId)}
                  className="mt-1 h-4 w-4 accent-[#B7F36B]"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold text-[#F5F6F8]">
                      {item.tradeName || item.companyName}
                    </p>
                    {item.alreadyInCrm ? (
                      <Badge tone="rust">já no CRM</Badge>
                    ) : item.duplicateWithin ? (
                      <Badge tone="neutral">repetido no lote</Badge>
                    ) : (
                      <Badge tone="lime">novo sinal</Badge>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-[#969DA8]">
                    {[item.category, item.address, item.city, item.uf]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {/* Oportunidade preliminar honesta (Seção 13: nunca afirmar que não possui site quando os dados apenas não retornaram URL) */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-[#969DA8]">
                      <Globe size={12} className={hasWebsite ? "text-[#78A9FF]" : "text-[#B7F36B]"} />
                      {hasWebsite
                        ? item.website
                        : "Website não identificado nos dados consultados"}
                    </span>

                    {item.phone && (
                      <span className="inline-flex items-center gap-1 text-[#F5F6F8]">
                        <Phone size={12} className="text-[#B7F36B]" />
                        {item.phone}
                      </span>
                    )}

                    {!hasWebsite && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#B7F36B]">
                        <Sparkles size={11} />
                        Oportunidade: Presença digital própria
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {!item.alreadyInCrm && (
                  <button
                    type="button"
                    onClick={() => onToggle(item.externalId)}
                    className={`btn !py-1.5 !px-3 text-xs ${
                      isChecked ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {isChecked ? "Selecionado" : "Selecionar"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
