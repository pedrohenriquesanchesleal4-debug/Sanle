"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Bell, Copy } from "lucide-react";
import { Panel, StatCard, Badge, Spinner, Notice } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import { STAGE_LABELS, type FunnelStage, type LeadActivity, type Reminder } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/utils";

type Dashboard = {
  stats: {
    identificados: number;
    qualificados: number;
    contatados: number;
    respostas: number;
    reunioes: number;
    propostas: number;
    negociacoes: number;
    ganhos: number;
    semProximaAcao: number;
    aguardandoResposta: number;
    atividadesPeriodo: number;
    total: number;
    porEtapa: { stage: FunnelStage; label: string; count: number }[];
  };
  activities: LeadActivity[];
  reminders: { due: Reminder[]; upcoming: Reminder[] };
  duplicates: { groups: number; leads: number };
  capabilities: {
    storage: string;
    auth: string;
    ai: string;
    prospecting: string[];
    linkedin: string;
  };
  generatedAt: string;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Dashboard>("/api/crm/dashboard?period=30").then(setData).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando painel…" />;

  const s = data.stats;
  const maxStage = Math.max(1, ...s.porEtapa.map((p) => p.count));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Painel</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Operação comercial</h1>
          <p className="mt-1 text-sm text-ink-soft/70">Atualizado {timeAgo(data.generatedAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="cobalt">armazenamento: {data.capabilities.storage}</Badge>
          <Badge tone={data.capabilities.ai.includes("sem-provider") ? "rust" : "lime"}>IA: {data.capabilities.ai}</Badge>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Leads totais" value={s.total} />
        <StatCard label="Qualificados" value={s.qualificados} />
        <StatCard label="Contatados" value={s.contatados} />
        <StatCard label="Reuniões" value={s.reunioes} />
        <StatCard label="Propostas" value={s.propostas} />
        <StatCard label="Negociações" value={s.negociacoes} />
        <StatCard label="Ganhos" value={s.ganhos} accent />
        <StatCard label="Atividades (30d)" value={s.atividadesPeriodo} />
      </div>

      {(s.semProximaAcao > 0 || data.duplicates.groups > 0 || data.reminders.due.length > 0) && (
        <div className="grid gap-3 md:grid-cols-3">
          {s.semProximaAcao > 0 && (
            <Link href="/admin/leads?semAcao=1" className="rounded-xl border border-[var(--rule)] bg-white p-4 transition hover:border-cobalt">
              <AlertTriangle size={16} className="text-rust" aria-hidden />
              <p className="mt-2 text-sm text-ink">
                <strong>{s.semProximaAcao}</strong> leads sem próxima ação
              </p>
              <p className="mt-1 text-xs text-ink-soft/70">Defina o próximo passo para não esfriar.</p>
            </Link>
          )}
          {data.duplicates.groups > 0 && (
            <Link href="/admin/leads#duplicatas" className="rounded-xl border border-[var(--rule)] bg-white p-4 transition hover:border-cobalt">
              <Copy size={16} className="text-cobalt" aria-hidden />
              <p className="mt-2 text-sm text-ink">
                <strong>{data.duplicates.groups}</strong> grupos de possíveis duplicatas
              </p>
              <p className="mt-1 text-xs text-ink-soft/70">Revise manualmente — nada é mesclado automaticamente.</p>
            </Link>
          )}
          {data.reminders.due.length > 0 && (
            <div className="rounded-xl border border-[var(--rule)] bg-white p-4">
              <Bell size={16} className="text-cobalt" aria-hidden />
              <p className="mt-2 text-sm text-ink">
                <strong>{data.reminders.due.length}</strong> lembretes vencidos
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-ink-soft/70">
                {data.reminders.due.slice(0, 3).map((r) => (
                  <li key={r.id} className="truncate">
                    • {r.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Funil por etapa" description="Distribuição atual dos leads">
          <ul className="space-y-2.5">
            {s.porEtapa.map((p) => (
              <li key={p.stage} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-ink-soft">{p.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                  <div className="h-full rounded-full bg-cobalt" style={{ width: `${(p.count / maxStage) * 100}%` }} />
                </div>
                <span className="w-6 text-right font-mono text-xs text-ink">{p.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Atividade recente"
          description="Últimos eventos registrados"
          actions={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs text-cobalt">
              Ver leads <ArrowRight size={13} />
            </Link>
          }
        >
          {data.activities.length === 0 ? (
            <p className="text-sm text-ink-soft/70">
              Nenhuma atividade ainda. Cadastre um lead ou importe uma prospecção para começar.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.activities.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border-b border-[var(--rule)] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-ink">{a.summary}</p>
                    <p className="text-xs text-ink-soft/70">
                      {a.kind} · {a.actor ?? "sistema"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-soft/60">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Lembretes" description="Vencidos e próximos">
          {data.reminders.due.length === 0 && data.reminders.upcoming.length === 0 ? (
            <p className="text-sm text-ink-soft/70">Nenhum lembrete ativo.</p>
          ) : (
            <ul className="space-y-2">
              {[...data.reminders.due, ...data.reminders.upcoming].slice(0, 8).map((r) => {
                const overdue = new Date(r.dueAt).getTime() <= Date.now();
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className={overdue ? "text-rust" : "text-ink"}>{r.title}</span>
                    <span className="shrink-0 text-xs text-ink-soft/60">{formatDateTime(r.dueAt)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Capacidades do ambiente" description="Detecção honesta — nada finge estar conectado">
          <dl className="space-y-2 text-sm">
            <Row label="Armazenamento" value={data.capabilities.storage} />
            <Row label="Autenticação" value={data.capabilities.auth} />
            <Row label="IA" value={data.capabilities.ai} />
            <Row label="Prospecção" value={data.capabilities.prospecting.join(", ")} />
            <Row label="LinkedIn" value={data.capabilities.linkedin} />
          </dl>
          <Link href="/admin/integracoes" className="mt-4 inline-flex items-center gap-1 text-xs text-cobalt">
            Configurar integrações <ArrowRight size={13} />
          </Link>
        </Panel>
      </div>

      <Panel title="Estágios do funil" description="Referência rápida">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STAGE_LABELS) as [FunnelStage, string][]).map(([id, label]) => (
            <span key={id} className="tag">
              {label}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-2 last:border-0">
      <dt className="text-ink-soft/80">{label}</dt>
      <dd className="font-mono text-xs text-ink">{value}</dd>
    </div>
  );
}
