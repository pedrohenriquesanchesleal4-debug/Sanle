"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, GripVertical } from "lucide-react";
import { Spinner, Notice, Badge } from "@/components/admin/ui";
import { ScorePill } from "@/components/admin/bits";
import { api, errorMessage } from "@/lib/client-api";
import { FUNNEL_STAGES, type FunnelStage, type Lead, type Paginated } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Paginated<Lead>>("/api/crm/leads?pageSize=100&sort=score");
      setLeads(res.items);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function move(lead: Lead, stage: FunnelStage) {
    setMoving(lead.id);
    // Atualização otimista
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage } : l)));
    try {
      await api.patch(`/api/crm/leads/${lead.id}`, { stage });
    } catch (err) {
      setError(errorMessage(err));
      await load();
    } finally {
      setMoving(null);
    }
  }

  if (loading && leads.length === 0) return <Spinner label="Carregando pipeline…" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Quadro do funil</h1>
          <p className="mt-1 text-sm text-ink-soft/70">
            Arraste é o próximo passo; por ora mova pela lista de etapa em cada card. Toda mudança é registrada como atividade.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost">
          <RefreshCw size={15} /> Atualizar
        </button>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      <div className="flex gap-4 overflow-x-auto pb-3">
        {FUNNEL_STAGES.map((stage) => {
          const items = leads.filter((l) => l.stage === stage.id);
          return (
            <section key={stage.id} className="w-72 shrink-0">
              <header className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">{stage.label}</h2>
                <span className="rounded-full bg-black/[0.05] px-2 py-0.5 font-mono text-[0.65rem] text-ink-soft">{items.length}</span>
              </header>
              <div className="space-y-2">
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-[var(--rule)] px-3 py-6 text-center text-xs text-ink-soft/50">
                    vazio
                  </p>
                )}
                {items.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-xl border border-[var(--rule)] bg-white p-3 shadow-sm transition hover:border-cobalt"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/admin/leads/${lead.id}`} className="text-sm font-medium text-ink hover:text-cobalt">
                        {lead.tradeName || lead.companyName}
                      </Link>
                      <GripVertical size={14} className="mt-0.5 shrink-0 text-ink-soft/30" aria-hidden />
                    </div>
                    <p className="mt-1 text-xs text-ink-soft/70">
                      {[lead.segment, lead.city].filter(Boolean).join(" · ") || "sem classificação"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <ScorePill score={lead.score} />
                      {lead.priority === "alta" && <Badge tone="rust">alta</Badge>}
                    </div>
                    {lead.nextAction ? (
                      <p className="mt-2 line-clamp-2 text-xs text-ink-soft">
                        {lead.nextAction}
                        {lead.nextActionAt ? ` · ${formatDate(lead.nextActionAt)}` : ""}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-rust">sem próxima ação</p>
                    )}
                    <select
                      aria-label={`Mover ${lead.companyName} de etapa`}
                      className="field mt-3 !py-1.5 text-xs"
                      value={lead.stage}
                      disabled={moving === lead.id}
                      onChange={(e) => void move(lead, e.target.value as FunnelStage)}
                    >
                      {FUNNEL_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
