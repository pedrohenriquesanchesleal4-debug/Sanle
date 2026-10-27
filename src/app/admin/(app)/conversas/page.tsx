"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Send, ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import { Panel, Badge, Spinner, Notice, EmptyState } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import type { Conversation, ConversationMessage } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

type ConvDetail = { conversation: Conversation; messages: ConversationMessage[] };

export default function ConversasPage() {
  const [list, setList] = useState<Conversation[] | null>(null);
  const [detail, setDetail] = useState<ConvDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  async function suggestReplyWithAI() {
    if (!detail) return;
    const lastUserMessage = [...detail.messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    setSuggesting(true);
    try {
      const res = await api.post<{ recommendedReply: string }>("/api/crm/reply-assistant", {
        clientReply: lastUserMessage.content,
        leadId: detail.conversation.leadId || undefined,
        channel: "whatsapp"
      });
      if (res?.recommendedReply) {
        setReply(res.recommendedReply);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSuggesting(false);
    }
  }

  const load = useCallback(async () => {
    setError(null);
    try {
      setList(await api.get<Conversation[]>("/api/crm/conversations?counts=1"));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function open(id: string) {
    setError(null);
    try {
      setDetail(await api.get<ConvDetail>(`/api/crm/conversations/${id}`));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!detail || !reply.trim()) return;
    setSending(true);
    try {
      await api.post(`/api/crm/conversations/${detail.conversation.id}`, { content: reply.trim(), status: "humano" });
      setReply("");
      await open(detail.conversation.id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!list) return <Spinner label="Carregando conversas…" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Conversas</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Atendimento</h1>
          <p className="mt-1 text-sm text-ink-soft/70">Chat do site, assistente interno e canais externos.</p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost">
          <RefreshCw size={15} /> Atualizar
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-2" title="Conversas" description={`${list.length} no total`}>
          {list.length === 0 ? (
            <EmptyState title="Nenhuma conversa" description="As conversas do chat do site aparecem aqui." />
          ) : (
            <ul className="space-y-2">
              {list.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => void open(c.id)}
                    className="w-full rounded-lg border border-[var(--rule)] p-3 text-left transition hover:border-cobalt"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{c.visitorLabel ?? c.id.slice(0, 8)}</span>
                      <Badge tone={c.status === "aberta" ? "lime" : c.status === "encerrada" ? "neutral" : "cobalt"}>{c.status}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-ink-soft/70">{c.summary ?? "sem resumo"}</p>
                    <p className="mt-1 text-[0.64rem] text-ink-soft/50">
                      {c.channel} · {timeAgo(c.updatedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-3" title={detail ? `Conversa ${detail.conversation.id.slice(0, 8)}` : "Detalhe"} description={detail ? `${detail.conversation.channel} · ${detail.conversation.status}` : "Selecione uma conversa"}>
          {!detail ? (
            <p className="text-sm text-ink-soft/70">Escolha uma conversa à esquerda para ler e responder.</p>
          ) : (
            <div className="flex h-[520px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {detail.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-cobalt text-white" : "border border-[var(--rule)] bg-black/[0.02] text-ink"}`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p className="mt-1 text-[0.62rem] opacity-60">{m.role} · {timeAgo(m.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule)] pt-3">
                <button
                  type="button"
                  onClick={() => void suggestReplyWithAI()}
                  disabled={suggesting}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[#78A9FF] hover:underline disabled:opacity-50"
                >
                  <Sparkles size={13} />
                  <span>{suggesting ? "Analisando com IA..." : "Sugerir réplica com IA para a última mensagem"}</span>
                </button>
                {detail.conversation.leadId && (
                  <Link
                    href={`/admin/leads/${detail.conversation.leadId}`}
                    className="inline-flex items-center gap-1 font-mono text-xs text-[#B7F36B] hover:underline"
                  >
                    Ver Lead no CRM <ExternalLink size={11} />
                  </Link>
                )}
              </div>
              <form onSubmit={sendReply} className="mt-2 flex gap-2">
                <textarea
                  className="field min-h-[64px] flex-1"
                  placeholder="Responder como Sanle…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button type="submit" className="btn btn-primary self-end" disabled={sending || !reply.trim()}>
                  <Send size={15} /> Enviar
                </button>
              </form>
              <button type="button" onClick={() => setDetail(null)} className="mt-3 inline-flex items-center gap-1 text-xs text-ink-soft">
                <ArrowLeft size={12} /> Fechar conversa
              </button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
