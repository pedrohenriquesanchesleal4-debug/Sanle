"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Bell, Compass, Copy, Sparkles } from "lucide-react";
import { Panel, Badge, Spinner, Notice } from "@/components/admin/ui";
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

/**
 * SALES HUNTER — Visão Geral do Dashboard (Seção 13)
 * Evita quatro cards de métricas idênticos como elemento dominante.
 * Prioriza: Acesso rápido ao buscador, próximas ações prioritárias,
 * funil comercial vivo, atividades recentes e lembretes.
 */
export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Dashboard>("/api/crm/dashboard?period=30")
      .then(setData)
      .catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando central de inteligência…" />;

  const s = data.stats;
  const maxStage = Math.max(1, ...s.porEtapa.map((p) => p.count));

  return (
    <div className="space-y-6">
      {/* Cabeçalho Operacional + Acesso Rápido ao Buscador */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F6F8]/8 pb-5">
        <div>
          <p className="eyebrow text-[#78A9FF]">THE OPPORTUNITY ENGINE · CENTRAL COMERCIAL</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">
            Operação comercial
          </h1>
          <p className="mt-1 text-xs text-[#969DA8]">
            Atualizado {timeAgo(data.generatedAt)} · Armazenamento: {data.capabilities.storage}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/prospects" className="btn btn-primary text-xs">
            <Compass size={15} />
            <span>Buscar novas empresas</span>
          </Link>
          <Link href="/admin/pipeline" className="btn btn-ghost text-xs">
            <span>Abrir Pipeline</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Composição Assimétrica: Painel de Pulso do Funil (7 cols) + Próximas Ações Prioritárias (5 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Pulso do funil comercial"
          description="Distribuição real dos leads por estágio e indicadores de tração"
          actions={
            <Badge tone="lime">{s.total} leads ativos</Badge>
          }
        >
          {/* Barra sintética de indicadores-chave sem 4 cards idênticos */}
          <div className="mb-5 grid grid-cols-3 gap-4 rounded-xl border border-[#F5F6F8]/8 bg-[#111318] p-4 sm:grid-cols-5">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                Qualificados
              </span>
              <span className="mt-1 block font-display text-xl font-semibold text-[#78A9FF]">
                {s.qualificados}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                Contatados
              </span>
              <span className="mt-1 block font-display text-xl font-semibold text-[#F5F6F8]">
                {s.contatados}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                Reuniões
              </span>
              <span className="mt-1 block font-display text-xl font-semibold text-[#F5F6F8]">
                {s.reunioes}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                Propostas
              </span>
              <span className="mt-1 block font-display text-xl font-semibold text-[#F5F6F8]">
                {s.propostas}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#B7F36B]">
                Clientes ganhos
              </span>
              <span className="mt-1 block font-display text-xl font-semibold text-[#B7F36B]">
                {s.ganhos}
              </span>
            </div>
          </div>

          <ul className="space-y-2.5">
            {s.porEtapa.map((p) => (
              <li key={p.stage} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-[#969DA8]">{p.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#111318]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#78A9FF] to-[#B7F36B]"
                    style={{ width: `${(p.count / maxStage) * 100}%` }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-xs text-[#F5F6F8]">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Coluna de Próximas Ações e Prioridades */}
        <Panel
          className="lg:col-span-5"
          title="Próximas ações e atenção imediata"
          description="Oportunidades que precisam de movimento hoje"
        >
          <div className="space-y-3">
            <Link
              href="/admin/leads?semAcao=1"
              className="flex items-start justify-between gap-3 rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4 transition hover:border-[#B7F36B]/50"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7F36B]">
                  <AlertTriangle size={13} />
                  <span>Acompanhamento pendente</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-[#F5F6F8]">
                  <strong>{s.semProximaAcao}</strong> leads sem próxima ação definida
                </p>
                <p className="mt-0.5 text-xs text-[#969DA8]">
                  Defina uma abordagem ou lembrete para manter o ritmo comercial.
                </p>
              </div>
              <ArrowRight size={15} className="mt-1 shrink-0 text-[#969DA8]" />
            </Link>

            <Link
              href="/admin/leads#duplicatas"
              className="flex items-start justify-between gap-3 rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4 transition hover:border-[#78A9FF]/50"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF]">
                  <Copy size={13} />
                  <span>Higiene da base</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-[#F5F6F8]">
                  <strong>{data.duplicates.groups}</strong> grupos de possíveis duplicatas
                </p>
                <p className="mt-0.5 text-xs text-[#969DA8]">
                  Sinalização segura — nada é mesclado sem revisão.
                </p>
              </div>
              <ArrowRight size={15} className="mt-1 shrink-0 text-[#969DA8]" />
            </Link>

            <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF]">
                <span className="inline-flex items-center gap-1.5">
                  <Bell size={13} />
                  <span>Lembretes ativos</span>
                </span>
                <span>{data.reminders.due.length} vencidos</span>
              </div>
              {data.reminders.due.length === 0 && data.reminders.upcoming.length === 0 ? (
                <p className="mt-2 text-xs text-[#969DA8]">Nenhum lembrete pendente.</p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-xs">
                  {[...data.reminders.due, ...data.reminders.upcoming]
                    .slice(0, 4)
                    .map((r) => {
                      const overdue = new Date(r.dueAt).getTime() <= Date.now();
                      return (
                        <li key={r.id} className="flex items-center justify-between gap-2">
                          <span className={overdue ? "text-[#F26464]" : "text-[#F5F6F8]"}>
                            • {r.title}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-[#969DA8]">
                            {formatDateTime(r.dueAt)}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </Panel>
      </div>

      {/* Linha inferior: Atividades Recentes + Estado Honesto das Capacidades */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Atividade comercial recente"
          description={`${s.atividadesPeriodo} eventos nos últimos 30 dias`}
          actions={
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 font-mono text-xs text-[#B7F36B] hover:underline"
            >
              Ver todos os leads <ArrowRight size={13} />
            </Link>
          }
        >
          {data.activities.length === 0 ? (
            <p className="text-sm text-[#969DA8]">
              Nenhuma atividade registrada ainda. Use o buscador para importar suas primeiras empresas.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.activities.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 border-b border-[#F5F6F8]/8 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm text-[#F5F6F8]">{a.summary}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                      {a.kind} · {a.actor ?? "sistema"}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-[#969DA8]">
                    {timeAgo(a.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="Infraestrutura Free-First"
          description="Detecção em tempo real dos conectores ativos"
        >
          <dl className="space-y-2.5 text-xs">
            <Row label="Banco / Armazenamento" value={data.capabilities.storage} />
            <Row label="Autenticação" value={data.capabilities.auth} />
            <Row label="Motor de IA" value={data.capabilities.ai} />
            <Row label="Fontes de Prospecção" value={data.capabilities.prospecting.join(", ")} />
          </dl>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F5F6F8]/8 pt-4">
            <Link
              href="/admin/integracoes"
              className="inline-flex items-center gap-1 font-mono text-xs text-[#78A9FF] hover:underline"
            >
              Gerenciar integrações <ArrowRight size={13} />
            </Link>
            <Link
              href="/admin/assistente"
              className="inline-flex items-center gap-1 font-mono text-xs text-[#B7F36B] hover:underline"
            >
              <Sparkles size={13} /> Assistente comercial
            </Link>
          </div>
        </Panel>
      </div>

      <Panel title="Estágios do pipeline" description="Fluxo completo de conversão">
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
    <div className="flex items-center justify-between gap-4 border-b border-[#F5F6F8]/8 pb-2 last:border-0">
      <dt className="text-[#969DA8]">{label}</dt>
      <dd className="font-mono text-xs text-[#F5F6F8]">{value}</dd>
    </div>
  );
}
