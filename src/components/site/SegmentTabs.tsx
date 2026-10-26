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
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#F2EEE6] text-[#0A0A09] border-b border-[rgba(10,10,9,0.12)]"
      aria-labelledby="segment-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#FF5B1F]">
          <span>SEGMENTOS PRIORITÁRIOS</span>
        </div>

        <h2
          id="segment-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#0A0A09]"
        >
          Para quem foi pensada a Sanle.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#5A564F] font-sans-editorial">
          Selecione o segmento da sua empresa para entender o modelo de fluxo específico para a sua rotina.
        </p>

        {/* As 3 Abas Grandes */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-[rgba(10,10,9,0.15)] pb-2">
          {SEGMENTS_DATA.map((s, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleTabChange(idx)}
                className={`p-5 text-left rounded-[2px] transition-all font-mono text-sm uppercase tracking-[0.12em] ${
                  isSelected
                    ? "bg-[#0A0A09] text-[#F2EEE6] shadow-md font-semibold"
                    : "bg-white/60 text-[#5A564F] hover:bg-white hover:text-[#0A0A09]"
                }`}
              >
                <div className="text-[0.68rem] text-[#8F8A80] mb-1">0{idx + 1}</div>
                {s.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Conteúdo Bespoke do Segmento Selecionado */}
        <div className="mt-10 p-8 md:p-12 rounded-[2px] bg-white border border-[rgba(10,10,9,0.12)] shadow-sm grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF5B1F]">
              DIAGNÓSTICO E FLUXO · {active.tabLabel.toUpperCase()}
            </span>

            <h3 className="mt-4 font-serif-editorial text-2xl md:text-3xl leading-snug text-[#0A0A09]">
              {active.headline}
            </h3>

            <p className="mt-4 text-[#5A564F] text-base leading-relaxed font-sans-editorial">
              {active.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/para/${active.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[2px] bg-[#0A0A09] text-white font-medium text-sm hover:bg-[#1E1E1B] transition-colors"
              >
                <span>{active.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[2px] border border-[rgba(10,10,9,0.2)] text-[#0A0A09] text-sm hover:bg-[#F2EEE6] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#10B981]" />
                <span>Conversar sobre este segmento</span>
              </button>
            </div>
          </div>

          {/* Exemplo de Fluxo e Métricas */}
          <div className="p-6 md:p-8 rounded-[2px] bg-[#FAF8F5] border border-[rgba(10,10,9,0.1)]">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#0A0A09] font-bold">
              Exemplo de fluxo automatizado
            </span>

            <ol className="mt-5 space-y-3 font-sans-editorial text-sm text-[#4A463F]">
              {active.flowExample.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#FF5B1F] font-bold shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-[rgba(10,10,9,0.1)] grid grid-cols-2 gap-4">
              {active.metrics.map((m, i) => (
                <div key={i}>
                  <div className="font-serif-editorial text-2xl text-[#0A0A09] font-bold">
                    {m.val}
                  </div>
                  <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8F8A80]">
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
