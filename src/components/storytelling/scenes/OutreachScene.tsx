"use client";

import { useState } from "react";
import { MessageSquare, Edit3, ExternalLink, BookmarkCheck, Check } from "lucide-react";

interface OutreachSceneProps {
  /** Progresso local da Cena 06 [0..1] */
  progress: number;
  active: boolean;
}

const DEFAULT_DEMO_MESSAGE =
  "Olá, tudo bem? Conheci a empresa de vocês pelo Google e tive uma ideia para melhorar a forma como clientes encontram seus serviços online.";

/**
 * CENA 06 — FROM DATA TO DIALOGUE
 * O diagnóstico recua para posição secundária e alimenta uma abordagem personalizada
 * com revelação por blocos e controles de ação comercial.
 */
export function OutreachScene({ progress, active }: OutreachSceneProps) {
  const [editing, setEditing] = useState(false);
  const [messageText, setMessageText] = useState(DEFAULT_DEMO_MESSAGE);
  const [savedNotice, setSavedNotice] = useState(false);

  const revealBlock = Math.max(0, Math.min(1, progress * 1.65));

  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-12">
        {/* Coluna narrativa + diagnóstico compactado em segundo plano */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#191C22] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B7F36B]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>06 · FROM DATA TO DIALOGUE</span>
          </div>

          <h2 className="mt-5 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
            Cada oportunidade merece uma abordagem melhor.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#969DA8] md:text-lg">
            O Sales Hunter transforma o diagnóstico técnico em uma mensagem consultiva clara, pronta para você revisar, personalizar e iniciar conversa.
          </p>

          {/* Diagnóstico em posição secundária conectada */}
          <div className="mt-6 rounded-xl border border-[#F5F6F8]/10 bg-[#111318]/80 p-4 opacity-80">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF]">
              <span>ORIGEM DO CONTEXTO · DEMO</span>
              <span>VIDRAÇARIA EXEMPLO</span>
            </div>
            <p className="mt-1.5 text-xs text-[#969DA8]">
              Oportunidade conectada: <strong className="text-[#F5F6F8]">Presença digital própria</strong> (4,8 ★ · Website não identificado nos dados consultados).
            </p>
          </div>
        </div>

        {/* Interface de conversa elegante no foco principal */}
        <div className="lg:col-span-7">
          <div
            className="rounded-hunter-lg border border-[#B7F36B]/45 bg-[#191C22]/95 p-6 shadow-hunter-card backdrop-blur-xl md:p-8"
            style={{
              opacity: 0.25 + revealBlock * 0.75,
              transform: `translate3d(0, ${(1 - revealBlock) * 20}px, 0)`
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F6F8]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#B7F36B]">
                  ABORDAGEM PERSONALIZADA · DEMONSTRAÇÃO
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-[#F5F6F8]">
                  Para: Vidraçaria Exemplo · Canal: WhatsApp
                </h3>
              </div>

              <span className="rounded-full border border-[#78A9FF]/30 bg-[#78A9FF]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#78A9FF]">
                Revisão humana ativa
              </span>
            </div>

            {/* Bloco de mensagem com revelação fluida */}
            <div className="mt-5 rounded-xl border border-[#F5F6F8]/12 bg-[#111318] p-5">
              {editing ? (
                <textarea
                  aria-label="Editar mensagem demonstrativa"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full resize-none bg-transparent font-sans text-base leading-relaxed text-[#F5F6F8] focus:outline-none"
                  rows={3}
                />
              ) : (
                <blockquote className="font-sans text-base leading-relaxed text-[#F5F6F8] md:text-lg">
                  “{messageText}”
                </blockquote>
              )}
            </div>

            {/* Três botões obrigatórios da Cena 06 */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="btn btn-ghost text-xs"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#78A9FF]" />
                <span>{editing ? "Concluir edição" : "Editar mensagem"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(messageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Abrir WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSavedNotice(true);
                  setTimeout(() => setSavedNotice(false), 2200);
                }}
                className="btn btn-ghost text-xs"
              >
                {savedNotice ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#B7F36B]" />
                    <span className="text-[#B7F36B]">Salvo no pipeline (Demo)</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-[#B7F36B]" />
                    <span>Salvar no CRM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
