"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowLeftRight, Check, X } from "lucide-react";

const CHAOS_POINTS = [
  "Documentos dispersos entre e-mails, WhatsApp pessoal e pastas locais sem padrão.",
  "Planilhas paralelas atualizadas manualmente por diferentes pessoas com fórmulas quebradas.",
  "Dados redigitados 3 vezes no CRM, no ERP e em planilhas de controle.",
  "Erros de estoque e duplicidades descobertos tardiamente no fechamento do mês.",
  "Pendências financeiras que se perdem sem responsável claro e sem prazo definido."
];

const ORDER_POINTS = [
  "Documentos centralizados, classificados e renomeados por regras automáticas em 0.18s.",
  "Dados integrados entre WhatsApp, ERP e banco sem intervenção humana.",
  "Validação fiscal e contábil imediata na entrada com alerta proativo de discrepâncias.",
  "Trilha completa de auditoria append-only com hash e registro de cada lançamento.",
  "Revisão humana acionada exclusivamente onde o julgamento é indispensável (2% dos casos)."
];

export function Transformation() {
  const [sliderPos, setSliderPos] = useState(50); // 0 a 100%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const clampedPct = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
    setSliderPos(clampedPct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    setIsDragging(false);
  };

  return (
    <section
      id="capacidades"
      className="relative scroll-mt-20 py-16 sm:py-20 md:py-24 bg-[#0A0B10] text-[#F5F6F8] border-b border-white/[0.08] select-none overflow-hidden w-full max-w-full"
      aria-labelledby="transf-title"
    >
      <div id="transformacao" className="sr-only" />
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 font-mono text-xs uppercase tracking-[0.14em] text-[#60A5FA]">
              <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
              <span>O Contraste da Verdade Operacional</span>
            </div>

            <h2
              id="transf-title"
              className="mt-4 font-serif text-[clamp(2.1rem,4.8vw,4.2rem)] font-normal leading-[1.04] text-[#F9FAFB] tracking-[-0.03em]"
            >
              O abismo entre o improviso manual e a engenharia sob medida.
            </h2>
          </div>

          {/* Botões de Acesso Rápido para ver 100% de cada lado */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[0.68rem] sm:text-xs">
            <button
              type="button"
              onClick={() => setSliderPos(100)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
                sliderPos > 70
                  ? "bg-red-500/20 text-red-400 border-red-500/40 font-bold shadow-xs"
                  : "bg-white/[0.04] text-[#969DA8] border-white/10 hover:border-white/30"
              }`}
            >
              Atrito Manual
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(50)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
                sliderPos >= 40 && sliderPos <= 60
                  ? "bg-[#2440FF] text-white border-[#2440FF] font-bold shadow-xs shadow-[#2440FF]/30"
                  : "bg-white/[0.04] text-[#969DA8] border-white/10 hover:border-white/30"
              }`}
            >
              50% Dividido
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(0)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
                sliderPos < 30
                  ? "bg-[#10B981]/20 text-[#B7F36B] border-[#10B981]/40 font-bold shadow-xs"
                  : "bg-white/[0.04] text-[#969DA8] border-white/10 hover:border-white/30"
              }`}
            >
              Fluxo Sanle
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-[#969DA8] font-sans-editorial">
          Arraste o divisor ou clique nos botões acima para comparar o cotidiano de uma rotina
          fragmentada com um fluxo automatizado e orquestrado.
        </p>

        {/* =========================================================================
            SLIDER COMPARATIVO ROBUSTO COM CLIP-PATH
           ========================================================================= */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="mt-6 sm:mt-10 relative w-full h-[440px] sm:h-[460px] md:h-[460px] rounded-2xl md:rounded-3xl border border-white/10 bg-[#111318] overflow-hidden shadow-2xl cursor-ew-resize touch-pan-y"
          aria-label="Comparativo interativo antes e depois"
        >
          {/* CAMADA 1 (DIREITA / DEPOIS: FLUXO ORGANIZADO) - Fica no fundo 100% esticada */}
          <div className="absolute inset-0 p-4 sm:p-7 md:p-12 flex flex-col justify-between bg-[#08090C] text-[#F5F6F8] pointer-events-none">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 font-mono text-[0.66rem] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#B7F36B]">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B7F36B] shadow-[0_0_8px_#B7F36B]" />
                  DEPOIS · FLUXO ORGANIZADO
                </span>
                <span className="text-[#969DA8] hidden sm:inline">AUTOMATIZADO EM TEMPO REAL</span>
              </div>

              <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3.5 max-w-2xl">
                {ORDER_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base leading-snug">
                    <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[#B7F36B] font-bold text-xs mt-0.5 border border-[#10B981]/30">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                    <span className="text-[#F5F6F8] font-medium">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between font-mono text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.12em] text-[#969DA8] pt-3 sm:pt-4 border-t border-white/10">
              <span>SANLE ORQUESTRAÇÃO · PIPELINES</span>
              <span className="text-[#B7F36B] font-bold">LATÊNCIA: 0.38s</span>
            </div>
          </div>

          {/* CAMADA 2 (ESQUERDA / ANTES: ATRITO OPERACIONAL) - Mascarada via clipPath */}
          <div
            className="absolute inset-0 p-4 sm:p-7 md:p-12 flex flex-col justify-between bg-[#130B0B] text-[#F5F6F8] pointer-events-none border-r border-red-500/30"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b border-red-500/20 pb-3 sm:pb-4 font-mono text-[0.66rem] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-red-400">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  ANTES · ATRITO OPERACIONAL
                </span>
                <span className="text-red-300/70 hidden sm:inline">MANUAL / REDUNDANTE</span>
              </div>

              <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3.5 max-w-2xl">
                {CHAOS_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base leading-snug">
                    <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-red-950/80 text-red-400 font-bold text-xs mt-0.5 border border-red-500/40">
                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                    <span className="text-[#F5F6F8] opacity-90">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between font-mono text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.12em] text-[#969DA8] pt-3 sm:pt-4 border-t border-red-500/20">
              <span>ROTINA FRAGMENTADA</span>
              <span className="text-red-400 font-bold">PERDA: 3.4h/DIA</span>
            </div>
          </div>

          {/* LINHA DIVISÓRIA E ALÇA DE CONTROLE TÁTIL */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-[#78A9FF] pointer-events-none shadow-[0_0_16px_rgba(120,169,255,0.8)] z-30 transition-transform duration-75"
            style={{ left: `calc(${sliderPos}% - 1.5px)` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[#08090C] border-2 border-[#78A9FF] text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xl ring-4 ring-[#2440FF]/20">
              <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#78A9FF]" />
            </div>
          </div>
        </div>

        {/* Legenda de Usabilidade */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.68rem] sm:text-xs text-[#969DA8]">
          <span>* Comparativo ilustrativo baseado no diagnóstico médio de processos</span>
          <span>ARRASTE O SELETOR OU USE OS BOTÕES ACIMA</span>
        </div>
      </div>
    </section>
  );
}
