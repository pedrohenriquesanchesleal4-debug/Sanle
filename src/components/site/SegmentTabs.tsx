"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import { SEGMENTS_DATA, type SegmentInfo } from "@/content/segments";
export { SEGMENTS_DATA, type SegmentInfo };

export function SegmentTabs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SEGMENTS_DATA[activeIdx] ?? SEGMENTS_DATA[0]!;

  const handleTabChange = (idx: number) => {
    setActiveIdx(idx);
    const seg = SEGMENTS_DATA[idx];
    if (seg) {
      trackEvent("segmento_selecionado", {
        segmento: seg.id
      });
    }
  };

  const handleWhatsApp = () => {
    trackEvent("whatsapp_aberto", { local: "segment_tabs", segmento: active.id });
    const url = buildWhatsAppLink({ segmento: active.tabLabel });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="para-quem"
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="segment-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#78A9FF]">
          <span>SEGMENTOS PRIORITÁRIOS</span>
        </div>

        <h2
          id="segment-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#F5F6F8]"
        >
          Para quem foi pensada a Sanle.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#969DA8] font-sans-editorial">
          Selecione o segmento da sua empresa para entender o modelo de fluxo específico para a sua rotina.
        </p>

        {/* As 3 Abas Grandes */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-2.5 border-b border-white/10 pb-3">
          {SEGMENTS_DATA.map((s, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleTabChange(idx)}
                className={`p-4 sm:p-5 text-left rounded-xl transition-all font-mono text-sm uppercase tracking-[0.12em] border ${
                  isSelected
                    ? "bg-[#2440FF] text-white shadow-lg shadow-[#2440FF]/25 border-[#2440FF] font-semibold"
                    : "bg-white/[0.03] text-[#969DA8] border-white/5 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <div className={`text-[0.68rem] mb-1 ${isSelected ? "text-white/80" : "text-[#78A9FF]"}`}>
                  0{idx + 1}
                </div>
                {s.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Conteúdo Bespoke do Segmento Selecionado */}
        <div className="mt-8 p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 shadow-2xl backdrop-blur-xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#78A9FF] font-semibold">
              DIAGNÓSTICO E FLUXO · {active.tabLabel.toUpperCase()}
            </span>

            <h3 className="mt-4 font-serif-editorial text-2xl md:text-3xl leading-snug text-[#F5F6F8]">
              {active.headline}
            </h3>

            <p className="mt-4 text-[#969DA8] text-base leading-relaxed font-sans-editorial">
              {active.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/para/${active.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-sm hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25 active:scale-95"
              >
                <span>{active.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-white text-sm hover:bg-white/[0.08] hover:border-[#78A9FF] transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4 text-[#B7F36B]" />
                <span>Conversar sobre este segmento</span>
              </button>
            </div>
          </div>

          {/* Exemplo de Fluxo e Métricas */}
          <div className="p-6 md:p-8 rounded-xl md:rounded-2xl bg-[#08090C] border border-white/10">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F5F6F8] font-bold block">
              Exemplo de fluxo automatizado
            </span>

            <ol className="mt-5 space-y-3 font-sans-editorial text-sm text-[#969DA8]">
              {active.flowExample.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#78A9FF] font-bold shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <span className="text-[#F5F6F8]">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              {active.metrics.map((m, i) => (
                <div key={i}>
                  <div className="font-serif-editorial text-2xl text-[#B7F36B] font-bold">
                    {m.val}
                  </div>
                  <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#969DA8]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
