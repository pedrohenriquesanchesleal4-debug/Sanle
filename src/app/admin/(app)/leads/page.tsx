"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, RefreshCw, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Panel, Spinner, Notice, Badge, EmptyState } from "@/components/admin/ui";
import { LeadForm } from "@/components/admin/LeadForm";
import { StageBadge, ScorePill, PriorityDot, VerificationBadge } from "@/components/admin/bits";
import { api, errorMessage } from "@/lib/client-api";
import { FUNNEL_STAGES, type Lead, type Paginated } from "@/lib/types";
import { segments } from "@/content/brand";
import { formatDate, timeAgo } from "@/lib/utils";

type DuplicateGroup = { key: string; leads: { id: string; companyName: string; city?: string | null; phone?: string | null; email?: string | null }[] };

export default function LeadsPage() {
  const router = useRouter();
  const [data, setData] = useState<Paginated<Lead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dupes, setDupes] = useState<DuplicateGroup[]>([]);

  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [segment, setSegment] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("recentes");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (stage) params.set("stage", stage);
      if (segment) params.set("segment", segment);
      if (priority) params.set("priority", priority);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("pageSize", "20");
      const res = await api.get<Paginated<Lead>>(`/api/crm/leads?${params.toString()}`);
      setData(res);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [q, stage, segment, priority, sort, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    api
      .get<{ groups: DuplicateGroup[] }>("/api/crm/duplicates")
      .then((r) => setDupes(r.groups))
      .catch(() => setDupes([]));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">CRM · SALES HUNTER</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">Leads Qualificados</h1>
          <p className="mt-1 text-sm text-[#969DA8]">
            {data ? `${data.total} registros auditáveis na base ativa` : "—"}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className="btn btn-ghost">
            <RefreshCw size={15} /> Atualizar
          </button>
          <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={15} /> Novo lead
          </button>
        </div>
      </header>

      <Panel>
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#969DA8]" />
              <input
                className="field pl-9"
                placeholder="Buscar empresa, contato, cidade…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <select className="field" value={stage} onChange={(e) => { setStage(e.target.value); setPage(1); }}>
            <option value="">Todas as etapas</option>
            {FUNNEL_STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <select className="field" value={segment} onChange={(e) => { setSegment(e.target.value); setPage(1); }}>
            <option value="">Todos os segmentos</option>
            {segments.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select className="field" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
              <option value="">Prioridade</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
            <select className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recentes">Recentes</option>
              <option value="nome">Nome</option>
              <option value="score">Score</option>
              <option value="proxima_acao">Próx. ação</option>
            </select>
          </div>
        </div>
      </Panel>

      {error && <Notice tone="warn">{error}</Notice>}
      {loading && !data ? (
        <Spinner />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title="Nenhum lead encontrado"
          description="Ajuste os filtros, cadastre um lead manualmente ou rode uma prospecção no módulo de prospecção."
          action={<Link href="/admin/prospects" className="btn btn-primary">Ir para prospecção</Link>}
        />
      ) : (
        <Panel className="overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-left font-mono text-[0.64rem] uppercase tracking-[0.12em] text-[#969DA8]">
                  <th className="px-5 py-3">Empresa</th>
                  <th className="px-3 py-3">Etapa</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Prioridade</th>
                  <th className="px-3 py-3">Verificação</th>
                  <th className="px-3 py-3">Próxima ação</th>
                  <th className="px-3 py-3">Atualizado</th>
                  <th className="px-5 py-3 text-right">Abrir</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer border-b border-white/[0.06] transition hover:bg-[#78A9FF]/[0.05]"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#F5F6F8]">{lead.tradeName || lead.companyName}</p>
                      <p className="text-xs text-[#969DA8]">
                        {[lead.segment, lead.city, lead.uf].filter(Boolean).join(" · ") || "sem classificação"}
                      </p>
                      {lead.problemDescription && (
                        <p className="mt-1 line-clamp-1 text-[11px] text-[#B7F36B]/90 italic">
                          &ldquo;{lead.problemDescription}&rdquo;
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3"><StageBadge stage={lead.stage} /></td>
                    <td className="px-3 py-3"><ScorePill score={lead.score} /></td>
                    <td className="px-3 py-3"><PriorityDot priority={lead.priority} /></td>
                    <td className="px-3 py-3"><VerificationBadge status={lead.verification} /></td>
                    <td className="px-3 py-3 text-xs text-[#969DA8]">
                      {lead.nextAction ? (
                        <span className="line-clamp-1">
                          {lead.nextAction}
                          {lead.nextActionAt ? ` · ${formatDate(lead.nextActionAt)}` : ""}
                        </span>
                      ) : (
                        <Badge tone="rust">sem próxima ação</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-[#969DA8]">{timeAgo(lead.updatedAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/leads/${lead.id}`} className="font-mono text-xs text-[#78A9FF] hover:text-[#B7F36B]">
                        Abrir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <button type="button" className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={15} /> Anterior
              </button>
              <span className="font-mono text-xs text-[#969DA8]">
                página {data.page} / {data.totalPages}
              </span>
              <button type="button" className="btn btn-ghost" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Próxima <ChevronRight size={15} />
              </button>
            </div>
          )}
        </Panel>
      )}

      {dupes.length > 0 && (
        <div id="duplicatas">
          <Panel
            title="Possíveis duplicatas"
            description="Somente sinalização — o Sales Hunter nunca mescla registros automaticamente. Revise e decida manualmente."
          >
            <ul className="space-y-4">
              {dupes.map((g) => (
                <li key={g.key} className="rounded-xl border border-white/[0.08] bg-[#191C22]/55 p-4">
                  <p className="mb-2 inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#969DA8]">
                    <Copy size={12} /> chave: {g.key}
                  </p>
                  <ul className="space-y-1 text-sm">
                    {g.leads.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-3">
                        <Link href={`/admin/leads/${l.id}`} className="text-[#78A9FF] hover:text-[#B7F36B]">
                          {l.companyName}
                        </Link>
                        <span className="text-xs text-[#969DA8]">{[l.city, l.phone, l.email].filter(Boolean).join(" · ")}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {showForm && (
        <LeadForm
          onClose={() => setShowForm(false)}
          onCreated={(id) => {
            setShowForm(false);
            router.push(`/admin/leads/${id}`);
          }}
        />
      )}
    </div>
  );
}
