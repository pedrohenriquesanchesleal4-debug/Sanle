"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Bell,
  StickyNote,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Panel, Badge, Spinner, Notice, Field } from "@/components/admin/ui";
import { StageBadge, ScorePill, VerificationBadge } from "@/components/admin/bits";
import { LeadDetails } from "@/components/dashboard/LeadDetails";
import { api, errorMessage } from "@/lib/client-api";
import {
  FUNNEL_STAGES,
  type FunnelStage,
  type Lead,
  type LeadActivity,
  type OutreachDraft,
  type Reminder,
  type ScoreFactor
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
  const [showScore, setShowScore] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [note, setNote] = useState("");
  const [reminder, setReminder] = useState({ title: "", dueAt: "" });
  const [draftForm, setDraftForm] = useState({
    kind: "primeiro_contato",
    channel: "whatsapp",
    subject: "",
    instructions: ""
  });
  const [generatingPage, setGeneratingPage] = useState(false);
  const [prospectUrl, setProspectUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api.get<Detail>(`/api/crm/leads/${id}`));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [id]);

  async function generateProspectPage() {
    if (!data?.lead) return;
    setGeneratingPage(true);
    try {
      const res = await api.post<{ ok: boolean; url: string }>("/api/admin/prospect-pages", {
        leadId: data.lead.id,
        empresa: data.lead.tradeName || data.lead.companyName,
        cidade: data.lead.city || "Brasília",
        nicho: data.lead.segment || "Operação"
      });
      if (res.url) {
        setProspectUrl(res.url);
        await navigator.clipboard.writeText(res.url);
        await api.post(`/api/crm/leads/${data.lead.id}/activities`, {
          kind: "sistema",
          summary: "Página de demonstração personalizada gerada",
          detail: `Link gerado e copiado: ${res.url}`
        });
        await load();
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setGeneratingPage(false);
    }
  }

  function openWhatsAppWithPage() {
    if (!data?.lead || !prospectUrl) return;
    const phone = (data.lead.contactPhone || data.lead.phone || "").replace(/\D/g, "");
    const cleanPhone = phone.startsWith("55") ? phone : phone ? `55${phone}` : "";
    const msg = `Olá! Preparei uma demonstração exclusiva para a ${data.lead.tradeName || data.lead.companyName} com oportunidades práticas para ${data.lead.segment || "a sua operação"}: ${prospectUrl}`;
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando diagnóstico do lead…" />;

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
    await api.post(`/api/crm/leads/${lead.id}/activities`, {
      kind: "nota",
      summary: note.trim()
    });
    setNote("");
    await load();
  }

  async function addReminder(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/api/crm/reminders", {
      leadId: lead.id,
      title: reminder.title,
      dueAt: reminder.dueAt
    });
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
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78A9FF] hover:underline"
      >
        <ArrowLeft size={14} /> Voltar para a lista de leads
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F5F6F8]/8 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-3xl font-semibold text-[#F5F6F8]">
              {lead.tradeName || lead.companyName}
            </h1>
            <StageBadge stage={lead.stage} />
            <ScorePill score={lead.score} />
          </div>
          <p className="mt-2 text-xs text-[#969DA8]">
            {[lead.segment, lead.category, lead.city, lead.uf].filter(Boolean).join(" · ") ||
              "Sem classificação"}
            {" · "}
            {lead.website ? (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#78A9FF] hover:underline"
              >
                {extractDomain(lead.website)}
              </a>
            ) : (
              <span className="text-[#969DA8]">
                Website não identificado nos dados consultados
              </span>
            )}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]/70">
            Criado {timeAgo(lead.createdAt)} · Fonte: {lead.source.provider}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void generateProspectPage()}
            disabled={generatingPage}
            className="btn btn-primary text-xs"
          >
            <Sparkles size={14} />
            {generatingPage ? "Gerando demonstração…" : "Criar demonstração de site"}
          </button>

          {prospectUrl && (
            <button
              type="button"
              onClick={openWhatsAppWithPage}
              className="btn btn-ghost text-xs text-[#B7F36B]"
            >
              <ExternalLink size={14} /> Abrir WhatsApp com demonstração
            </button>
          )}

          <button
            type="button"
            onClick={removeLead}
            className="btn btn-ghost text-xs text-[#F26464]"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </header>

      {prospectUrl && (
        <Notice tone="ok">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>
              Demonstração personalizada criada: <strong>{prospectUrl}</strong> (copiada para a área de transferência)
            </span>
            <a
              href={prospectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              Abrir demonstração →
            </a>
          </div>
        </Notice>
      )}

      {/* Banner de Diagnóstico de Oportunidade Comercial (EMPRESA -> OPORTUNIDADE -> SERVIÇO -> AÇÃO) */}
      <LeadDetails lead={lead} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda: Dados e Histórico */}
        <div className="space-y-6 lg:col-span-2">
          <Panel
            title="Informações disponíveis e qualificação"
            description="Edite e salve — alterações relevantes recalculam o score automaticamente"
            actions={
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                {saving ? "Gravando no banco…" : "Sincronizado"}
              </span>
            }
          >
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
                  <input
                    className="field"
                    name="uf"
                    maxLength={2}
                    defaultValue={lead.uf ?? ""}
                  />
                </div>
              </Field>
              <Field label="Endereço">
                <input className="field" name="address" defaultValue={lead.address ?? ""} />
              </Field>
              <Field
                label="Website"
                hint={lead.website ? "URL informada" : "Não identificado nos dados"}
              >
                <input
                  className="field"
                  name="website"
                  placeholder="Website não identificado nos dados consultados"
                  defaultValue={lead.website ?? ""}
                />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input className="field" name="phone" defaultValue={lead.phone ?? ""} />
              </Field>
              <Field label="E-mail">
                <input
                  className="field"
                  name="email"
                  type="email"
                  defaultValue={lead.email ?? ""}
                />
              </Field>
              <Field label="LinkedIn">
                <input className="field" name="linkedin" defaultValue={lead.linkedin ?? ""} />
              </Field>
              <Field label="Responsável comercial">
                <input className="field" name="owner" defaultValue={lead.owner ?? ""} />
              </Field>
              <Field label="Oportunidade / Hipótese comercial" hint="hipótese editável">
                <input
                  className="field"
                  name="hypothesis"
                  defaultValue={lead.hypothesis ?? ""}
                />
              </Field>
              <Field label="Próxima ação">
                <input
                  className="field"
                  name="nextAction"
                  defaultValue={lead.nextAction ?? ""}
                />
              </Field>
              <Field label="Data da próxima ação">
                <input
                  className="field"
                  name="nextActionAt"
                  type="datetime-local"
                  defaultValue={lead.nextActionAt?.slice(0, 16) ?? ""}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Notas internas">
                  <textarea
                    className="field min-h-[85px]"
                    name="notes"
                    defaultValue={lead.notes ?? ""}
                  />
                </Field>
              </div>
              <div className="flex justify-end md:col-span-2">
                <button type="submit" className="btn btn-primary text-xs" disabled={saving}>
                  <Save size={14} /> Salvar alterações
                </button>
              </div>
            </form>
          </Panel>

          <Panel
            title="Histórico do relacionamento"
            description="Linha do tempo auditável de eventos e notas"
            actions={
              <div className="flex gap-2">
                <input
                  className="field !w-52 !py-1.5 text-xs"
                  placeholder="Registrar nota…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void addNote()}
                />
                <button
                  type="button"
                  onClick={() => void addNote()}
                  className="btn btn-ghost !py-1.5 text-xs"
                >
                  <StickyNote size={13} /> Adicionar
                </button>
              </div>
            }
          >
            {activities.length === 0 ? (
              <p className="text-xs text-[#969DA8]">Nenhuma atividade registrada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {activities.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 border-b border-[#F5F6F8]/8 pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-[#F5F6F8]">{a.summary}</p>
                      {a.detail && <p className="mt-0.5 text-xs text-[#969DA8]">{a.detail}</p>}
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]/60">
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
        </div>

        {/* Coluna direita: Score e justificativa, Abordagens, Lembretes */}
        <div className="space-y-6">
          <Panel title="Score e justificativa">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#B7F36B] bg-[#B7F36B]/10 font-display text-xl font-semibold text-[#B7F36B]">
                {lead.score ?? "—"}
              </div>
              <div>
                <p className="text-xs text-[#969DA8]">
                  Prioridade: <strong className="text-[#F5F6F8]">{lead.priority}</strong>
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#969DA8]">
                  <span>Verificação:</span>
                  <VerificationBadge status={lead.verification} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScore((v) => !v)}
              className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-[#78A9FF] hover:underline"
            >
              {showScore ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showScore ? "Ocultar" : "Ver"} fatores do score
            </button>

            {showScore && lead.scoreBreakdown && (
              <ul className="mt-3 space-y-2.5">
                {lead.scoreBreakdown.map((f: ScoreFactor) => (
                  <li key={f.key} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F5F6F8]">{f.label}</span>
                      <span className="font-mono text-[#B7F36B]">+{f.points}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#111318]">
                      <div
                        className="h-full rounded-full bg-[#78A9FF]"
                        style={{ width: `${f.value * 100}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#969DA8]">{f.rationale}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <select
                aria-label="Etapa do funil"
                className="field !py-1.5 text-xs"
                value={lead.stage}
                onChange={(e) => void patch({ stage: e.target.value as FunnelStage })}
              >
                {FUNNEL_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Prioridade do lead"
                className="field !py-1.5 text-xs"
                value={lead.priority}
                onChange={(e) => void patch({ priority: e.target.value })}
              >
                <option value="alta">Prioridade alta</option>
                <option value="media">Prioridade média</option>
                <option value="baixa">Prioridade baixa</option>
              </select>
            </div>
          </Panel>

          <Panel title="Mensagem recomendada e abordagens" description="Gere e abra no WhatsApp">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void generateDraft();
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="field !py-1.5 text-xs"
                  value={draftForm.kind}
                  onChange={(e) => setDraftForm((f) => ({ ...f, kind: e.target.value }))}
                >
                  <option value="primeiro_contato">Primeiro contato</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="proposta">Proposta</option>
                  <option value="reuniao">Convite reunião</option>
                </select>
                <select
                  className="field !py-1.5 text-xs"
                  value={draftForm.channel}
                  onChange={(e) => setDraftForm((f) => ({ ...f, channel: e.target.value }))}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">E-mail</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="ligacao">Ligação</option>
                </select>
              </div>
              <input
                className="field !py-1.5 text-xs"
                placeholder="Assunto (opcional)"
                value={draftForm.subject}
                onChange={(e) => setDraftForm((f) => ({ ...f, subject: e.target.value }))}
              />
              <textarea
                className="field min-h-[60px] text-xs"
                placeholder="Instruções específicas (oferta, tom, diferencial…)"
                value={draftForm.instructions}
                onChange={(e) =>
                  setDraftForm((f) => ({ ...f, instructions: e.target.value }))
                }
              />
              <button
                type="submit"
                className="btn btn-primary w-full justify-center text-xs"
                disabled={generating}
              >
                <Sparkles size={14} />
                {generating ? "Gerando abordagem…" : "Gerar mensagem personalizada"}
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {drafts.length === 0 && (
                <p className="text-xs text-[#969DA8]">Nenhuma abordagem gerada ainda.</p>
              )}
              {drafts.map((d) => {
                const bodyText = d.editedBody || d.body;
                const rawPhone = (lead.contactPhone || lead.phone || "").replace(/\D/g, "");
                const cleanPhone = rawPhone.startsWith("55")
                  ? rawPhone
                  : rawPhone
                    ? `55${rawPhone}`
                    : "";
                const waHref = cleanPhone
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(bodyText)}`
                  : `https://wa.me/?text=${encodeURIComponent(bodyText)}`;

                return (
                  <article
                    key={d.id}
                    className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#78A9FF]">
                        {d.kind} · {d.channel}
                      </p>
                      <Badge
                        tone={
                          d.status === "aprovado"
                            ? "lime"
                            : d.status === "enviado_externamente"
                              ? "cobalt"
                              : "neutral"
                        }
                      >
                        {d.status}
                      </Badge>
                    </div>
                    {d.subject && (
                      <p className="mt-2 text-xs font-semibold text-[#F5F6F8]">{d.subject}</p>
                    )}
                    <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-[#969DA8]">
                      {bodyText}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void copyDraft(d)}
                        className="btn btn-ghost !py-1 !px-2.5 text-xs"
                      >
                        {copied === d.id ? <Check size={12} /> : <Copy size={12} />}
                        {copied === d.id ? "Copiado" : "Copiar"}
                      </button>
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary !py-1 !px-3 text-xs"
                      >
                        <ExternalLink size={12} /> Abrir WhatsApp
                      </a>
                      {d.status === "rascunho" && (
                        <button
                          type="button"
                          onClick={() => void draftStatus(d, "aprovado")}
                          className="btn btn-ghost !py-1 !px-2.5 text-xs"
                        >
                          Aprovar
                        </button>
                      )}
                      {d.status === "aprovado" && (
                        <button
                          type="button"
                          onClick={() => void draftStatus(d, "enviado_externamente")}
                          className="btn btn-ghost !py-1 !px-2.5 text-xs"
                        >
                          Marcar enviado
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Panel>

          <Panel title="Follow-ups e lembretes">
            <form className="flex gap-2" onSubmit={addReminder}>
              <input
                className="field !py-1.5 text-xs"
                placeholder="Próximo follow-up…"
                value={reminder.title}
                onChange={(e) => setReminder((r) => ({ ...r, title: e.target.value }))}
                required
              />
              <input
                className="field !w-40 !py-1.5 text-xs"
                type="datetime-local"
                value={reminder.dueAt}
                onChange={(e) => setReminder((r) => ({ ...r, dueAt: e.target.value }))}
                required
              />
              <button type="submit" className="btn btn-ghost !py-1.5 !px-3">
                <Bell size={14} />
              </button>
            </form>
            <ul className="mt-3 space-y-2">
              {reminders.length === 0 && (
                <p className="text-xs text-[#969DA8]">Nenhum lembrete agendado.</p>
              )}
              {reminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#F5F6F8]">{r.title}</span>
                  <span className="shrink-0 font-mono text-[10px] text-[#969DA8]">
                    {formatDateTime(r.dueAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Assistente de Inteligência">
            <p className="text-xs text-[#969DA8]">
              Solicite argumentos de abordagem, análise de objeções ou resumo deste lead ao assistente RAG.
            </p>
            <Link
              href={`/admin/assistente?lead=${lead.id}`}
              className="btn btn-ghost mt-3 w-full justify-center text-xs text-[#78A9FF]"
            >
              <Sparkles size={14} /> Consultar assistente sobre este lead
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
