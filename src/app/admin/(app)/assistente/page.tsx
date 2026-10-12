"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Send, Loader2, UserRound, Bot } from "lucide-react";
import { Panel, Spinner, Notice, Badge } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import type { Lead, Paginated } from "@/lib/types";

type Answer = {
  answer: string;
  provider: string;
  model: string;
  sources: { title: string; category: string }[];
  confidence: "alta" | "media" | "baixa";
};

type Msg = { role: "user" | "assistant"; content: string; meta?: string };

export default function AssistentePage() {
  const params = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadId, setLeadId] = useState<string>(params.get("lead") ?? "");
  const [intent, setIntent] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      const res = await api.get<Paginated<Lead>>("/api/crm/leads?pageSize=100&sort=recentes");
      setLeads(res.items);
    } catch {
      setLeads([]);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!intent.trim() || !leadId) return;
    setBusy(true);
    setError(null);
    setMessages((m) => [...m, { role: "user", content: intent.trim() }]);
    setIntent("");
    try {
      const res = await api.post<Answer>("/api/crm/assistant", { intent: intent.trim(), leadId, persist: true });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.answer,
          meta: `${res.provider} · ${res.model} · confiança ${res.confidence}${res.sources.length ? ` · ${res.sources.length} fonte(s)` : ""}`
        }
      ]);
    } catch (err) {
      setError(errorMessage(err));
      setMessages((m) => m.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Assistente interno</p>
        <h1 className="mt-2 font-display text-3xl text-ink">IA com contexto do lead</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft/70">
          Resumo, próximos passos, análise de dor e sugestões de abordagem. Sem provider de IA configurado,
          responde com heurísticas determinísticas — sempre com fontes e nível de confiança.
        </p>
      </header>

      {error && <Notice tone="warn">{error}</Notice>}

      <Panel title="Conversa">
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <select className="field" value={leadId} onChange={(e) => setLeadId(e.target.value)}>
            <option value="">Selecione um lead…</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.tradeName || l.companyName} — {l.city ?? "sem cidade"}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-xs text-ink-soft/70">
            <Badge tone="cobalt">contexto: lead + atividades recentes</Badge>
          </div>
        </div>

        <div className="flex h-[420px] flex-col rounded-xl border border-[var(--rule)] bg-black/[0.015]">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-ink-soft/60">
                Pergunte, por exemplo: “resuma este lead e sugira os próximos 3 passos” ou “que dor operacional
                este negócio provavelmente tem e como abordar?”.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-ink text-paper" : "border border-[var(--rule)] bg-white text-ink"}`}>
                  <div className="mb-1 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.1em] opacity-60">
                    {m.role === "user" ? <UserRound size={11} /> : <Bot size={11} />}
                    {m.role === "user" ? "você" : "assistente"}
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.meta && <p className="mt-1.5 font-mono text-[0.6rem] text-ink-soft/60">{m.meta}</p>}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Loader2 size={13} className="animate-spin" /> pensando…
              </div>
            )}
          </div>
          <form onSubmit={ask} className="flex gap-2 border-t border-[var(--rule)] p-3">
            <input
              className="field flex-1"
              placeholder="Pergunta sobre o lead…"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              disabled={!leadId || busy}
            />
            <button type="submit" className="btn btn-primary" disabled={!leadId || busy || !intent.trim()}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      </Panel>
    </div>
  );
}
