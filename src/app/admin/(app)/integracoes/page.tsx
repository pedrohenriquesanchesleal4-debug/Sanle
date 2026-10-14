"use client";

import { useEffect, useState } from "react";
import { PlugZap, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Panel, Badge, Spinner, Notice } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import { timeAgo } from "@/lib/utils";

type Integrations = {
  landing?: { inboundLeads: number; events: number; prospectPages: number; operationalCost: string };
  capabilities: Record<string, string>;
  providers: { id: string; label: string; configured: boolean; requiresApproval: boolean }[];
  ai: { configured: boolean; provider: string | null; model: string | null; embedModel: string; hasKey: boolean };
  googlePlaces: { enabled: boolean; configured: boolean; monthlyBudgetUsd: number; maxResultsPerSearch: number };
  linkedin: { configured: boolean };
  recentRuns: { id: string; kind: string; provider: string; model: string; ok: boolean; error?: string | null; createdAt: string }[];
  recentAudits: { id: string; actor: string; action: string; detail?: string | null; createdAt: string }[];
};

export default function IntegracoesPage() {
  const [data, setData] = useState<Integrations | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setData(await api.get<Integrations>("/api/crm/integrations"));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando integrações…" />;

  const cap = data.capabilities;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Integrações</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Capacidades e consumo</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft/70">
            Detecção honesta: cada serviço mostra se está configurado ou não. Nada finge estar conectado.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost">
          <RefreshCw size={15} /> Atualizar
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Landing Page & Prospecção Inbound" description="Controle de eventos e custo operacional">
          <dl className="space-y-3 text-sm">
            <CapRow label="Leads Inbound Captados" value={`${data.landing?.inboundLeads ?? 0} leads registrados`} ok={true} />
            <CapRow label="Eventos Analíticos Registrados" value={`${data.landing?.events ?? 0} eventos processados`} ok={true} />
            <CapRow label="Páginas Personalizadas (/p/)" value={`${data.landing?.prospectPages ?? 0} ativas`} ok={true} />
            <CapRow label="Custo Operacional" value={data.landing?.operationalCost ?? "R$ 0,00"} ok={true} />
          </dl>
        </Panel>

        <Panel title="Serviços" description="Estado real de cada integração">
          <dl className="space-y-3 text-sm">
            <CapRow label="Armazenamento" value={cap.storage ?? "desconhecido"} ok={!(cap.storage ?? "").includes("local")} />
            <CapRow label="Autenticação" value={cap.auth ?? "desconhecido"} ok={(cap.auth ?? "").includes("supabase")} />
            <CapRow label="IA (LLM)" value={data.ai.configured ? `${data.ai.provider} · ${data.ai.model}` : "sem provider — heurísticas determinísticas"} ok={data.ai.configured} />
            <CapRow label="Embeddings" value={data.ai.embedModel} ok={data.ai.hasKey} />
            <CapRow label="Google Places" value={data.googlePlaces.enabled ? `habilitado · US$ ${data.googlePlaces.monthlyBudgetUsd}/mês` : "desabilitado"} ok={data.googlePlaces.configured} />
            <CapRow label="LinkedIn" value={data.linkedin.configured ? "configurado" : "não configurado"} ok={data.linkedin.configured} />
          </dl>
        </Panel>

        <Panel title="Provedores de prospecção" description="Fontes de candidatos disponíveis">
          <ul className="space-y-2">
            {data.providers.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--rule)] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{p.label}</p>
                  <p className="text-xs text-ink-soft/60">{p.requiresApproval ? "exige configuração explícita" : "gratuito e aberto"}</p>
                </div>
                {p.configured ? (
                  <Badge tone="lime"><CheckCircle2 size={11} /> ativo</Badge>
                ) : (
                  <Badge tone="neutral"><XCircle size={11} /> não configurado</Badge>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Execuções de IA recentes" description="Rastreabilidade de chamadas">
          {data.recentRuns.length === 0 ? (
            <p className="text-sm text-ink-soft/70">Nenhuma execução registrada.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentRuns.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-[var(--rule)] pb-2 text-sm last:border-0">
                  <span className="text-ink">{r.kind}</span>
                  <span className="flex items-center gap-2 text-xs text-ink-soft/70">
                    {r.provider} · {r.model} · {timeAgo(r.createdAt)}
                    {r.ok ? <Badge tone="lime">ok</Badge> : <Badge tone="rust">erro</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6">
        <Panel title="Trilha de auditoria" description="Ações administrativas registradas">
          {data.recentAudits.length === 0 ? (
            <p className="text-sm text-ink-soft/70">Nenhuma ação registrada.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentAudits.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 border-b border-[var(--rule)] pb-2 text-sm last:border-0">
                  <span className="text-ink">{a.action}</span>
                  <span className="flex items-center gap-2 text-xs text-ink-soft/70">
                    {a.actor} · {timeAgo(a.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function CapRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] pb-3 last:border-0">
      <dt className="shrink-0 text-ink-soft/80">{label}</dt>
      <dd className="flex items-center gap-2 text-right">
        <span className="font-mono text-xs text-ink">{value}</span>
        {ok ? <CheckCircle2 size={14} className="shrink-0 text-signal" /> : <XCircle size={14} className="shrink-0 text-rust" />}
      </dd>
    </div>
  );
}
