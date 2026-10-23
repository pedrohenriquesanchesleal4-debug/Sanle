"use client";

import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

const CHAOS_POINTS = [
  "Documentos dispersos entre e-mails, pastas locais e drives compartilhados.",
  "Planilhas inconsistentes atualizadas manualmente por diferentes pessoas.",
  "Dados digitados repetidas vezes em múltiplos sistemas sem integração.",
  "Erros e duplicidades descobertos tardiamente no fechamento de mês.",
  "Pendências que se perdem sem responsável claro e sem prazo definido."
];

const ORDER_POINTS = [
  "Documentos centralizados, classificados e renomeados por regras automáticas.",
  "Dados integrados entre sistemas sem necessidade de intervenção humana.",
  "Validação imediata na entrada com alerta proativo de discrepâncias.",
  "Trilha completa de auditoria com histórico de cada processamento.",
  "Revisão humana acionada exclusivamente onde o julgamento é indispensável."
];

export function Transformation() {
  const [sliderPos, setSliderPos] = useState(50); // 0 a 100%
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <section
      id="transformacao"
      className="relative scroll-mt-20 py-24 md:py-32 bg-[#F2EEE6] text-[#0A0A09] border-b border-[rgba(10,10,9,0.12)]"
      aria-labelledby="transf-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#FF5B1F]">
          <Sparkles className="h-4 w-4" />
          <span>DO ATRITO AO FLUXO</span>
        </div>

        <h2
          id="transf-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[0.98] text-[#0A0A09]"
        >
          O contraste de uma operação com fluxo.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#5A564F] font-sans-editorial">
          Arraste o divisor para comparar o cotidiano de uma rotina fragmentada com um fluxo
          automatizado e orquestrado.
        </p>

        {/* Slider Interativo de Alta Precisão */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="mt-12 relative w-full h-[520px] md:h-[460px] rounded-[2px] border border-[rgba(10,10,9,0.15)] bg-white overflow-hidden select-none cursor-ew-resize shadow-lg"
          aria-label="Comparativo interativo antes e depois"
        >
          {/* Lado Direito (Ordem / Depois) - Fundo completo */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-[#FAF8F5] text-[#0A0A09]">
            <div>
              <div className="flex items-center justify-between border-b border-[rgba(10,10,9,0.1)] pb-4 font-mono text-xs uppercase tracking-[0.16em] text-[#10B981]">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  DEPOIS · FLUXO ORGANIZADO
                </span>
                <span className="text-[#8F8A80]">AUTOMATIZADO</span>
              </div>

              <ul className="mt-6 space-y-3.5 max-w-lg">
                {ORDER_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base leading-snug">
                    <span className="text-[#10B981] font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-[#1A1A18] font-medium">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8F8A80]">
              SANLE ORQUESTRAÇÃO · PIPELINES VERIFICADOS
            </div>
          </div>

          {/* Lado Esquerdo (Caos / Antes) - Mascarado pelo slider */}
          <div
            className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-[#161614] text-[#F2EEE6] border-r border-[#FF5B1F]"
            style={{ width: `${sliderPos}%`, overflow: "hidden" }}
          >
            <div className="min-w-[320px] md:min-w-[500px]">
              <div className="flex items-center justify-between border-b border-[rgba(242,238,230,0.12)] pb-4 font-mono text-xs uppercase tracking-[0.16em] text-[#FF5B1F]">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5B1F]" />
                  ANTES · ATRITO OPERACIONAL
                </span>
                <span className="text-[#8F8A80]">MANUAL</span>
              </div>

              <ul className="mt-6 space-y-3.5 max-w-lg">
                {CHAOS_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base leading-snug">
                    <span className="text-[#FF5B1F] font-bold shrink-0 mt-0.5">✕</span>
                    <span className="text-[#D6D1C7]">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-[320px] md:min-w-[500px] font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8F8A80]">
              ROTINA FRAGMENTADA · RETRABALHO DIÁRIO
            </div>
          </div>

          {/* Linha Divisória e Alça de Controle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#FF5B1F] pointer-events-none shadow-[0_0_12px_rgba(255,91,31,0.6)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[#0A0A09] border-2 border-[#FF5B1F] text-[#F2EEE6] flex items-center justify-center font-mono text-xs font-bold shadow-xl">
              ↔
            </div>
          </div>
        </div>

        {/* Legenda Obrigatória */}
        <div className="mt-4 flex items-center justify-between font-mono text-xs text-[#8F8A80]">
          <span>* Ilustrativo, não é um caso real.</span>
          <span>ARRASTE O SELETOR HORIZONTALMENTE</span>
        </div>
      </div>
    </section>
  );
}
