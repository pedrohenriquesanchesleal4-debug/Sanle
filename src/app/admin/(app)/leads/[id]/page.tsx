"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Trash2, Sparkles, Copy, Check, Plus, Bell, StickyNote, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react";
import { Panel, Badge, Spinner, Notice, EmptyState, Field } from "@/components/admin/ui";
import { StageBadge, ScorePill, VerificationBadge } from "@/components/admin/bits";
import { api, errorMessage } from "@/lib/client-api";
import {
  FUNNEL_STAGES, STAGE_LABELS,
  type FunnelStage, type Lead, type LeadActivity, type OutreachDraft, type Reminder, type ScoreFactor
} from "@/lib/types";
import { formatDateTime, timeAgo, extractDomain } from "@/lib/utils";

type Detail = {
  lead: Lead;
  activities: LeadActivity[];
  drafts: OutreachDraft[];
  reminders: Reminder[];
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [note, setNote] = useState("");
  const [reminder, setReminder] = useState({ title: "", dueAt: "" });
  const [draftForm, setDraftForm] = useState({ kind: "primeiro_contato", channel: "email", subject: "", instructions: "" });

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api.get<Detail>(`/api/crm/leads/${id}`));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando lead…" />;

  const { lead, activities, drafts, reminders } = data;

  async function patch(payload: Record<string, unknown>) {
    setSaving(true);
    try {
      const updated = await api.patch<Lead>(`/api/crm/leads/${lead.id}`, payload);
      setData((d) => (d ? { ...d, lead: updated } : d));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;
    await api.post(`/api/crm/leads/${lead.id}/activities`, { kind: "nota", summary: note.trim() });
    setNote("");
    await load();
  }

  async function addReminder(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/api/crm/reminders", { leadId: lead.id, title: reminder.title, dueAt: reminder.dueAt });
    setReminder({ title: "", dueAt: "" });
    await load();
  }

  async function generateDraft() {
    setGenerating(true);
    try {
      await api.post("/api/crm/drafts", { leadId: lead.id, ...draftForm });
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  async function draftStatus(draft: OutreachDraft, status: OutreachDraft["status"]) {
    await api.patch(`/api/crm/drafts/${draft.id}`, { status });
    await load();
  }

  async function copyDraft(draft: OutreachDraft) {
    const text = draft.editedBody || draft.body;
    await navigator.clipboard.writeText(text);
    setCopied(draft.id);
    setTimeout(() => setCopied(null), 1500);
  }

  async function removeLead() {
    if (!confirm(`Excluir ${lead.companyName}? Esta ação não pode ser desfeita.`)) return;
    await api.del(`/api/crm/leads/${lead.id}`);
    router.push("/admin/leads");
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-cobalt">
        <ArrowLeft size={15} /> Voltar para leads
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl text-ink">{lead.tradeName || lead.companyName}</h1>
            <StageBadge stage={lead.stage} />
            <ScorePill score={lead.score} />
          </div>
          <p className="mt-2 text-sm text-ink-soft/70">
            {[lead.segment, lead.category, lead.city, lead.uf].filter(Boolean).join(" · ") || "sem classificação"}
            {lead.website && (
              <>
                {" · "}
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-cobalt hover:underline">
                  {extractDomain(lead.website)}
                </a>
              </>
            )}
          </p>
          <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft/60">
            criado {timeAgo(lead.createdAt)} · fonte: {lead.source.provider}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={removeLead} className="btn btn-ghost text-rust">
            <Trash2 size={15} /> Excluir
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda: dados + edição */}
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Dados do lead" description="Edite e salve — mudanças relevantes recalculam o score" actions={<span className="text-xs text-ink-soft/60">{saving ? "salvando…" : "salvo automaticamente"}</span>}>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void patch({
                  tradeName: f.get("tradeName"),
                  category: f.get("category"),
                  segment: f.get("segment"),
                  city: f.get("city"),
                  uf: f.get("uf"),
                  address: f.get("address"),
                  website: f.get("website"),
                  phone: f.get("phone"),
                  email: f.get("email"),
                  linkedin: f.get("linkedin"),
                  hypothesis: f.get("hypothesis"),
                  notes: f.get("notes"),
                  nextAction: f.get("nextAction"),
                  nextActionAt: f.get("nextActionAt"),
                  owner: f.get("owner")
                });
              }}
            >
              <Field label="Nome fantasia">
                <input className="field" name="tradeName" defaultValue={lead.tradeName ?? ""} />
              </Field>
              <Field label="Categoria / CNAE">
                <input className="field" name="category" defaultValue={lead.category ?? ""} />
              </Field>
              <Field label="Segmento">
                <input className="field" name="segment" defaultValue={lead.segment ?? ""} />
              </Field>
              <Field label="Cidade / UF">
                <div className="grid grid-cols-[1fr_64px] gap-2">
                  <input className="field" name="city" defaultValue={lead.city ?? ""} />
                  <input className="field" name="uf" maxLength={2} defaultValue={lead.uf ?? ""} />
                </div>
              </Field>
              <Field label="Endereço">
                <input className="field" name="address" defaultValue={lead.address ?? ""} />
              </Field>
              <Field label="Site">
                <input className="field" name="website" defaultValue={lead.website ?? ""} />
              </Field>
              <Field label="Telefone">
                <input className="field" name="phone" defaultValue={lead.phone ?? ""} />
              </Field>
              <Field label="E-mail">
                <input className="field" name="email" type="email" defaultValue={lead.email ?? ""} />
              </Field>
              <Field label="LinkedIn">
                <input className="field" name="linkedin" defaultValue={lead.linkedin ?? ""} />
              </Field>
              <Field label="Responsável">
                <input className="field" name="owner" defaultValue={lead.owner ?? ""} />
              </Field>
              <Field label="Hipótese de problema" hint="hipótese, não fato">
                <input className="field" name="hypothesis" defaultValue={lead.hypothesis ?? ""} />
              </Field>
              <Field label="Próxima ação">
                <input className="field" name="nextAction" defaultValue={lead.nextAction ?? ""} />
              </Field>
              <Field label="Data da próxima ação">
                <input className="field" name="nextActionAt" type="datetime-local" defaultValue={lead.nextActionAt?.slice(0, 16) ?? ""} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Notas internas">
                  <textarea className="field min-h-[90px]" name="notes" defaultValue={lead.notes ?? ""} />
                </Field>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} /> Salvar alterações
                </button>
              </div>
            </form>
          </Panel>

          <Panel
            title="Atividades"
            description="Linha do tempo do lead"
            actions={
              <div className="flex gap-2">
                <input className="field !w-56 !py-1.5 text-sm" placeholder="Nova nota…" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void addNote()} />
                <button type="button" onClick={() => void addNote()} className="btn btn-ghost !py-1.5">
                  <StickyNote size={14} /> Nota
                </button>
              </div>
            }
          >
            {activities.length === 0 ? (
              <p className="text-sm text-ink-soft/70">Nenhuma atividade registrada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 border-b border-[var(--rule)] pb-3 last:border-0">
                    <div>
                      <p className="text-sm text-ink">{a.summary}</p>
                      {a.detail && <p className="mt-0.5 text-xs text-ink-soft/70">{a.detail}</p>}
                      <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft/50">
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

        {/* Coluna direita: score, etapas, abordagens, lembretes */}
        <div className="space-y-6">
          <Panel title="Score de priorização">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-cobalt font-display text-xl text-cobalt">
                {lead.score ?? "—"}
              </div>
              <div>
                <p className="text-sm text-ink-soft">Prioridade: <strong className="text-ink">{lead.priority}</strong></p>
                <p className="text-xs text-ink-soft/70">Verificação: <VerificationBadge status={lead.verification} /></p>
              </div>
            </div>
            <button type="button" onClick={() => setShowScore((v) => !v)} className="mt-4 inline-flex items-center gap-1 text-xs text-cobalt">
              {showScore ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showScore ? "Ocultar" : "Ver"} composição do score
            </button>
            {showScore && lead.scoreBreakdown && (
              <ul className="mt-3 space-y-2">
                {lead.scoreBreakdown.map((f: ScoreFactor) => (
                  <li key={f.key} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-soft">{f.label}</span>
                      <span className="font-mono text-ink">{f.points}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                      <div className="h-full rounded-full bg-cobalt" style={{ width: `${f.value * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-[0.66rem] text-ink-soft/60">{f.rationale}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <select className="field !py-1.5 text-xs" value={lead.stage} onChange={(e) => void patch({ stage: e.target.value as FunnelStage })}>
                {FUNNEL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <select className="field !py-1.5 text-xs" value={lead.priority} onChange={(e) => void patch({ priority: e.target.value })}>
                <option value="alta">Prioridade alta</option>
                <option value="media">Prioridade média</option>
                <option value="baixa">Prioridade baixa</option>
              </select>
            </div>
          </Panel>

          <Panel title="Abordagens" description="Rascunhos gerados com IA">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void generateDraft();
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <select className="field !py-1.5 text-xs" value={draftForm.kind} onChange={(e) => setDraftForm((f) => ({ ...f, kind: e.target.value }))}>
                  <option value="primeiro_contato">Primeiro contato</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="proposta">Proposta</option>
                  <option value="reuniao">Convite reunião</option>
                </select>
                <select className="field !py-1.5 text-xs" value={draftForm.channel} onChange={(e) => setDraftForm((f) => ({ ...f, channel: e.target.value }))}>
                  <option value="email">E-mail</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="ligacao">Ligação</option>
                </select>
              </div>
              <input className="field !py-1.5 text-xs" placeholder="Assunto (opcional)" value={draftForm.subject} onChange={(e) => setDraftForm((f) => ({ ...f, subject: e.target.value }))} />
              <textarea className="field min-h-[60px] text-xs" placeholder="Instruções para a IA (tom, oferta, contexto…)" value={draftForm.instructions} onChange={(e) => setDraftForm((f) => ({ ...f, instructions: e.target.value }))} />
              <button type="submit" className="btn btn-primary w-full justify-center" disabled={generating}>
                <Sparkles size={15} /> {generating ? "Gerando…" : "Gerar abordagem"}
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {drafts.length === 0 && (
                <p className="text-xs text-ink-soft/60">Nenhum rascunho ainda.</p>
              )}
              {drafts.map((d) => (
                <article key={d.id} className="rounded-lg border border-[var(--rule)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft/70">
                      {d.kind} · {d.channel}
                    </p>
                    <Badge tone={d.status === "aprovado" ? "lime" : d.status === "enviado_externamente" ? "cobalt" : "neutral"}>{d.status}</Badge>
                  </div>
                  {d.subject && <p className="mt-2 text-sm font-medium text-ink">{d.subject}</p>}
                  <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">{d.editedBody || d.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void copyDraft(d)} className="btn btn-ghost !py-1 text-xs">
                      {copied === d.id ? <Check size={12} /> : <Copy size={12} />} {copied === d.id ? "Copiado" : "Copiar"}
                    </button>
                    {d.status === "rascunho" && (
                      <button type="button" onClick={() => void draftStatus(d, "aprovado")} className="btn btn-ghost !py-1 text-xs">
                        Aprovar
                      </button>
                    )}
                    {d.status === "aprovado" && (
                      <button type="button" onClick={() => void draftStatus(d, "enviado_externamente")} className="btn btn-ghost !py-1 text-xs">
                        Marcar enviado
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Lembretes">
            <form className="flex gap-2" onSubmit={addReminder}>
              <input className="field !py-1.5 text-xs" placeholder="Título" value={reminder.title} onChange={(e) => setReminder((r) => ({ ...r, title: e.target.value }))} required />
              <input className="field !w-44 !py-1.5 text-xs" type="datetime-local" value={reminder.dueAt} onChange={(e) => setReminder((r) => ({ ...r, dueAt: e.target.value }))} required />
              <button type="submit" className="btn btn-ghost !py-1.5">
                <Bell size={14} />
              </button>
            </form>
            <ul className="mt-3 space-y-2">
              {reminders.length === 0 && <p className="text-xs text-ink-soft/60">Nenhum lembrete.</p>}
              {reminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-ink">{r.title}</span>
                  <span className="shrink-0 text-xs text-ink-soft/60">{formatDateTime(r.dueAt)}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Assistente">
            <p className="text-sm text-ink-soft">
              Peça um resumo, próximos passos ou uma análise deste lead ao assistente interno.
            </p>
            <Link href={`/admin/assistente?lead=${lead.id}`} className="btn btn-primary mt-3 w-full justify-center">
              <Sparkles size={15} /> Abrir assistente
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
