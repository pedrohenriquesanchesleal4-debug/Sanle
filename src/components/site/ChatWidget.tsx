"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-full border border-black/10 bg-white/95 px-4 py-3 text-xs font-semibold text-ink shadow-2xl backdrop-blur-md transition-all hover:border-cobalt/50 hover:shadow-cobalt/10"
      >
        {open ? <X size={16} /> : <MessageSquare size={16} className="text-cobalt" />}
        <span className="hidden sm:inline">{open ? "Fechar" : "Assistente IA Sanle"}</span>
      </button>

      {open && (
        <div
          id="sanle-chat"
          role="dialog"
          aria-label="Assistente da Sanle"
          className="fixed bottom-20 left-4 sm:left-6 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl backdrop-blur-2xl text-ink"
        >
          <header className="flex items-center justify-between gap-3 border-b border-black/8 bg-paper px-4 py-3 text-ink">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cobalt" aria-hidden />
              <div>
                <p className="text-sm font-semibold leading-none">Assistente Sanle</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-mute">
                  respostas com fontes auditadas
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-mute hover:text-ink"
              aria-label="Fechar assistente"
            >
              <X size={16} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "bg-cobalt text-white font-medium"
                      : "border border-black/8 bg-paper text-ink"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <p className="mt-2 border-t border-black/8 pt-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-cobalt font-semibold">
                      Fontes: {[...new Set(m.sources)].join(" · ")}
                    </p>
                  )}
                  {m.noProvider && m.role === "assistant" && (
                    <p className="mt-2 flex items-start gap-1.5 text-[0.66rem] text-ink-mute">
                      <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber font-bold" aria-hidden />
                      <span>Modo determinístico local sem chave de IA externa.</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-paper px-3.5 py-2.5 text-sm text-ink-soft">
                  <Loader2 size={14} className="animate-spin text-cobalt" aria-hidden />
                  consultando base de conhecimento…
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
                  className="rounded-full border border-black/10 bg-paper px-3 py-1.5 text-[0.72rem] text-ink-soft transition hover:border-cobalt hover:text-ink shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-black/8 bg-white px-3 py-3">
            <label className="mb-2 flex items-start gap-2 text-[0.68rem] text-ink-mute">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-cobalt"
              />
              <span>
                Autorizo salvar esta conversa para continuidade pela equipe Sanle.
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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt text-white transition hover:bg-cobalt-deep disabled:opacity-40 shadow-sm"
                aria-label="Enviar mensagem"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
