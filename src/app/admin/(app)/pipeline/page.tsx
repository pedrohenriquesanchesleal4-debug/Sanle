"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Spinner, Notice } from "@/components/admin/ui";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";
import { api, errorMessage } from "@/lib/client-api";
import { type FunnelStage, type Lead, type Paginated } from "@/lib/types";

/**
 * SALES HUNTER — PipelinePage (Seção 13)
 * Preserva a operação real de atualização de estágio no banco.
 * A animação acompanha a mudança real de estado: o card exibe estado de gravação
 * e só aparece confirmado no novo estágio após a resposta positiva da API.
 */
export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

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

  async function moveLead(lead: Lead, stage: FunnelStage) {
    setMovingId(lead.id);
    setConfirmedId(null);
    setError(null);
    try {
      // Confirma primeiro no banco de dados antes de marcar como salvo (Regra Seção 13)
      const updated = await api.patch<Lead>(`/api/crm/leads/${lead.id}`, { stage });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
      setConfirmedId(lead.id);
      setTimeout(() => {
        setConfirmedId((curr) => (curr === lead.id ? null : curr));
      }, 2200);
    } catch (err) {
      setError(errorMessage(err));
      await load();
    } finally {
      setMovingId(null);
    }
  }

  if (loading && leads.length === 0) return <Spinner label="Carregando pipeline…" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F6F8]/8 pb-5">
        <div>
          <p className="eyebrow text-[#78A9FF]">CRM · RELACIONAMENTO COMERCIAL</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">
            Pipeline de oportunidades
          </h1>
          <p className="mt-1 text-xs text-[#969DA8]">
            Arraste os cartões entre colunas ou selecione a etapa. Cada transição só é confirmada após gravação real no banco e gera registro na linha do tempo.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost text-xs">
          <RefreshCw size={14} /> Atualizar quadro
        </button>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      <PipelineBoard
        leads={leads}
        movingId={movingId}
        confirmedId={confirmedId}
        onMoveLead={moveLead}
      />
    </div>
  );
}
