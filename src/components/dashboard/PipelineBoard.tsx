"use client";

import { useState } from "react";
import Link from "next/link";
import { GripVertical, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/admin/ui";
import { ScorePill } from "@/components/admin/bits";
import { FUNNEL_STAGES, type FunnelStage, type Lead } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface PipelineBoardProps {
  leads: Lead[];
  movingId: string | null;
  confirmedId: string | null;
  onMoveLead: (lead: Lead, targetStage: FunnelStage) => Promise<void>;
}

/**
 * SALES HUNTER — PipelineBoard Kanban (Seção 13 & 15)
 * Kanban com suporte a Drag-and-Drop HTML5 fluido + seletor acessível.
 * REGRA CRÍTICA (Seção 13):
 * "Preservar a operação real de atualização de estágio no banco.
 *  A animação deve acompanhar a mudança real de estado.
 *  Não fazer um card parecer salvo antes da confirmação da operação."
 */
export function PipelineBoard({
  leads,
  movingId,
  confirmedId,
  onMoveLead
}: PipelineBoardProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<FunnelStage | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLElement>, lead: Lead) => {
    setDraggedLeadId(lead.id);
    e.dataTransfer.setData("text/plain", lead.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, stageId: FunnelStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLElement>, targetStage: FunnelStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedLeadId;
    setDraggedLeadId(null);
    setDragOverStage(null);

    if (!id) return;
    const found = leads.find((l) => l.id === id);
    if (!found || found.stage === targetStage) return;

    await onMoveLead(found, targetStage);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {FUNNEL_STAGES.map((stage) => {
        const items = leads.filter((l) => l.stage === stage.id);
        const isDropTarget = dragOverStage === stage.id;

        return (
          <section
            key={stage.id}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={(e) => void handleDrop(e, stage.id)}
            className={`w-72 shrink-0 rounded-hunter border p-3.5 transition-colors duration-200 ${
              isDropTarget
                ? "border-[#78A9FF] bg-[#191C22]"
                : "border-[#F5F6F8]/8 bg-[#111318]"
            }`}
          >
            <header className="mb-3 flex items-center justify-between gap-2 border-b border-[#F5F6F8]/8 pb-2.5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5F6F8]">
                {stage.label}
              </h2>
              <span className="rounded-full border border-[#F5F6F8]/10 bg-[#191C22] px-2 py-0.5 font-mono text-[10px] text-[#969DA8]">
                {items.length}
              </span>
            </header>

            <div className="space-y-2.5">
              {items.length === 0 && (
                <p className="rounded-xl border border-dashed border-[#F5F6F8]/10 px-3 py-8 text-center font-mono text-[11px] text-[#969DA8]/50">
                  Arraste um lead para cá
                </p>
              )}

              {items.map((lead) => {
                const isSaving = movingId === lead.id;
                const isConfirmed = confirmedId === lead.id;

                return (
                  <article
                    key={lead.id}
                    draggable={!isSaving}
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={() => {
                      setDraggedLeadId(null);
                      setDragOverStage(null);
                    }}
                    className={`rounded-xl border p-3.5 transition-all duration-200 ${
                      isSaving
                        ? "border-[#78A9FF]/60 bg-[#191C22]/60 opacity-75"
                        : isConfirmed
                          ? "border-[#B7F36B] bg-[#191C22] shadow-[0_0_20px_rgba(183,243,107,0.18)]"
                          : "cursor-grab border-[#F5F6F8]/10 bg-[#191C22] hover:border-[#78A9FF]/45 active:cursor-grabbing"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-display text-sm font-semibold text-[#F5F6F8] hover:text-[#B7F36B]"
                      >
                        {lead.tradeName || lead.companyName}
                      </Link>
                      <GripVertical
                        size={14}
                        className="mt-0.5 shrink-0 text-[#969DA8]/50"
                        aria-hidden
                      />
                    </div>

                    <p className="mt-1 text-xs text-[#969DA8]">
                      {[lead.segment, lead.city].filter(Boolean).join(" · ") ||
                        "Sem segmento definido"}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <ScorePill score={lead.score} />
                      {lead.priority === "alta" && <Badge tone="lime">alta prioridade</Badge>}
                    </div>

                    {lead.nextAction ? (
                      <p className="mt-2 line-clamp-2 text-xs text-[#969DA8]">
                        Próx.: {lead.nextAction}
                        {lead.nextActionAt ? ` · ${formatDate(lead.nextActionAt)}` : ""}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-[#F26464]">Sem próxima ação</p>
                    )}

                    {/* Status honesto da persistência no banco */}
                    {isSaving && (
                      <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#78A9FF]">
                        <Loader2 size={12} className="animate-spin" />
                        <span>Gravando etapa no banco…</span>
                      </div>
                    )}

                    {!isSaving && isConfirmed && (
                      <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#B7F36B]">
                        <CheckCircle2 size={12} />
                        <span>Etapa confirmada e salva</span>
                      </div>
                    )}

                    <select
                      aria-label={`Mover ${lead.companyName} de etapa`}
                      className="field mt-3 !py-1.5 !text-xs"
                      value={lead.stage}
                      disabled={isSaving}
                      onChange={(e) => void onMoveLead(lead, e.target.value as FunnelStage)}
                    >
                      {FUNNEL_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
