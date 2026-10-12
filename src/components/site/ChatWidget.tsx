"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, X, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  confidence?: number;
  noProvider?: boolean;
  escalate?: boolean;
};

const SUGGESTIONS = [
  "O que a Sanle faz?",
  "Vocês substituem meu sistema financeiro?",
  "Como funciona a cobrança?",
  "Meu processo tem muitos documentos manuais"
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente da Sanle. Posso explicar nossos serviços e entender qual processo da sua operação mais consome tempo. Como posso ajudar?"
    }
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setMessages((m) => [...m, { role: "user", content: trimmed }]);
      setInput("");
      setSending(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, conversationId: conversationId ?? undefined, consent })
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: json.error ?? "Não consegui responder agora. Tente novamente." }
          ]);
          return;
        }
        setConversationId(json.data.conversationId ?? conversationId);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: json.data.text,
            sources: json.data.sources,
            confidence: json.data.confidence,
            noProvider: json.data.noProvider,
            escalate: json.data.escalate
          }
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Falha de conexão. Verifique sua internet e tente novamente." }
        ]);
      } finally {
        setSending(false);
      }
    },
    [conversationId, consent, sending]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sanle-chat"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper shadow-[0_18px_50px_-20px_rgba(18,17,16,0.9)] transition hover:bg-cobalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
        <span className="hidden sm:inline">{open ? "Fechar" : "Falar com a Sanle"}</span>
      </button>

      {open && (
        <div
          id="sanle-chat"
          role="dialog"
          aria-label="Assistente da Sanle"
          className="fixed bottom-20 right-4 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-paper shadow-[0_40px_90px_-40px_rgba(18,17,16,0.55)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--rule)] bg-ink px-4 py-3 text-paper">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-signal" aria-hidden />
              <div>
                <p className="text-sm font-semibold leading-none">Assistente Sanle</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/50">
                  respostas com fontes
                </p>
              </div>
            </div>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed",
                    m.role === "user"
                      ? "bg-cobalt text-white"
                      : "border border-[var(--rule)] bg-white text-ink-soft"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <p className="mt-2 border-t border-black/10 pt-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] opacity-70">
                      Fontes: {[...new Set(m.sources)].join(" · ")}
                    </p>
                  )}
                  {m.noProvider && m.role === "assistant" && (
                    <p className="mt-2 flex items-start gap-1.5 text-[0.66rem] opacity-70">
                      <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden />
                      <span>Resposta sem provedor de IA configurado — baseada apenas no material recuperado.</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--rule)] bg-white px-3.5 py-2.5 text-sm text-ink-soft">
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  pensando…
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-[var(--rule)] bg-white px-3 py-1.5 text-[0.72rem] text-ink-soft transition hover:border-cobalt hover:text-cobalt"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-[var(--rule)] bg-white px-3 py-3">
            <label className="mb-2 flex items-start gap-2 text-[0.68rem] text-ink-soft/80">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-cobalt"
              />
              <span>
                Autorizo salvar esta conversa para que a equipe dê continuidade. Sem marcar, nada é gravado.
              </span>
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Descreva seu processo ou faça uma pergunta…"
                aria-label="Mensagem"
                maxLength={2000}
                className="field !py-2 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt text-white transition hover:bg-ink disabled:opacity-40"
                aria-label="Enviar mensagem"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="mt-2 text-center text-[0.66rem] text-ink-soft/60">
              Prefere um contato humano?{" "}
              <Link href="/diagnostico" className="text-cobalt underline decoration-dotted">
                Envie um diagnóstico
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
