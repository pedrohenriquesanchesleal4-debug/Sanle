"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  "Quais frentes de software a Sanle desenvolve?",
  "Como funciona a criação de um sistema sob medida?",
  "Como funcionam os agentes de IA com RAG?",
  "Preciso substituir as ferramentas que já uso?"
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
        "Olá! Sou o assistente técnico da Sanle. Posso explicar como desenhamos sites e experiências digitais, sistemas web sob medida, agentes de IA e automações operacionais. O que você planeja tirar do papel?"
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
            {
              role: "assistant",
              content:
                json.error ??
                "Não consegui processar a resposta neste momento. Tente novamente em instantes."
            }
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
          {
            role: "assistant",
            content: "Falha de conexão. Verifique sua rede e tente novamente."
          }
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
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/15 bg-[#111318]/95 px-4 py-3 text-xs font-semibold text-[#F5F6F8] shadow-2xl backdrop-blur-xl transition-all hover:border-[#78A9FF]/60 active:scale-95 cursor-pointer"
      >
        {open ? <X size={16} /> : <MessageSquare size={16} className="text-[#78A9FF]" />}
        <span className="hidden sm:inline">
          {open ? "Fechar assistente" : "Assistente Sanle · Dúvidas"}
        </span>
      </button>

      {open && (
        <div
          id="sanle-chat"
          role="dialog"
          aria-label="Assistente Técnico Sanle"
          className="fixed bottom-20 right-4 sm:right-5 z-50 flex h-[min(540px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#111318] text-[#F5F6F8] shadow-2xl backdrop-blur-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#08090C] px-4 py-3.5 text-[#F5F6F8]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2440FF]/20 text-[#78A9FF]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-[#F5F6F8]">
                  Assistente Técnico Sanle
                </p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#969DA8]">
                  Base de Conhecimento RAG · Escopo Real
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-[#969DA8] transition-colors hover:text-[#F5F6F8]"
              aria-label="Fechar assistente"
            >
              <X size={16} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[86%] rounded-xl px-3.5 py-2.5 text-[0.84rem] leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "bg-[#2440FF] font-medium text-white"
                      : "border border-white/10 bg-[#191C22] text-[#F5F6F8]"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <p className="mt-2 flex items-center gap-1 border-t border-white/10 pt-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#78A9FF]">
                      <CheckCircle2 size={11} className="inline" />
                      Fontes: {[...new Set(m.sources)].join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#191C22] px-3.5 py-2.5 text-xs text-[#969DA8]">
                  <Loader2 size={14} className="animate-spin text-[#78A9FF]" aria-hidden />
                  Consultando base técnica da Sanle…
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-[#191C22] px-3 py-1.5 text-left text-[0.7rem] text-[#969DA8] transition hover:border-[#78A9FF] hover:text-[#F5F6F8]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-white/10 bg-[#08090C] px-3.5 py-3">
            <label className="mb-2 flex items-start gap-2 text-[0.68rem] text-[#969DA8]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-[#2440FF]"
              />
              <span>
                Autorizo armazenar esta consulta para acompanhamento técnico pela Sanle.
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
                placeholder="Descreva sua ideia, sistema ou processo..."
                aria-label="Mensagem para o assistente"
                maxLength={2000}
                className="field !py-2 text-xs flex-1"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2440FF] text-white transition hover:bg-[#3856ff] disabled:opacity-40"
                aria-label="Enviar mensagem"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
