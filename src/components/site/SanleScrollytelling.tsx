"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Layers, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { OperationalBlueprintStage } from "@/components/site/OperationalBlueprintStage";

interface StoryChapter {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  lead: string;
  body: string;
  kpi: string;
  kpiLabel: string;
  tag: string;
  icon: typeof Compass;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "caos",
    chapter: "01",
    kicker: "CAPÍTULO 01 · O DIAGNÓSTICO",
    title: "O Ponto de Partida: A Fragmentação Manual",
    lead: "Rotinas desconectadas, cópia de dados e esforço invisível.",
    body: "Toda empresa em crescimento acumula processos manuais que drenam energia: notas fiscais perdidas em caixas de entrada, dados redigitados repetidamente em três planilhas diferentes e conferências manuais exaustivas. O atrito consome a margem antes que a liderança perceba.",
    kpi: "32% do tempo",
    kpiLabel: "Drenado em retrabalho e conferência",
    tag: "Atrito Crítico",
    icon: Compass
  },
  {
    id: "engenharia",
    chapter: "02",
    kicker: "CAPÍTULO 02 · A ENGENHARIA",
    title: "A Tubulação Invisível: Ingestão Estruturada",
    lead: "Sem forçar sua empresa a trocar de sistemas: conectamos o que já existe.",
    body: "A Sanle mapeia onde os dados se perdem e projeta conexões diretas entre arquivos, canais e sistemas. Arquivos de WhatsApp, e-mails fiscais e PDFs são convertidos em schemas tipados e validados em menos de 0.2 segundos, sem intervenção humana.",
    kpi: "Zero migração",
    kpiLabel: "De softwares e ERPs atuais",
    tag: "Tubulação Ativa",
    icon: Layers
  },
  {
    id: "convergencia",
    chapter: "03",
    kicker: "CAPÍTULO 03 · A CONVERGÊNCIA",
    title: "A Tríade dos Nós: Documentos, Sistemas e Regras",
    lead: "Regras de negócio aplicadas no milissegundo de entrada dos dados.",
    body: "Os três nós da Sanle operam em sincronismo determinístico: checagem contra tabelas de preço, validação fiscal e verificação contra duplicidade. 98% dos fluxos ocorrem silenciosamente; apenas anomalias reais vão para aprovação humana com 1 clique.",
    kpi: "14x mais veloz",
    kpiLabel: "Velocidade média de conciliação",
    tag: "Precisão Estrita",
    icon: ShieldCheck
  },
  {
    id: "fluxo",
    chapter: "04",
    kicker: "CAPÍTULO 04 · O FLUXO PERMANENTE",
    title: "A Operação em Regime Silencioso: Escala e Margem",
    lead: "A empresa passa a funcionar de forma contínua, previsível e sem fadiga.",
    body: "Os lançamentos contábeis no ERP e as baixas bancárias acontecem em tempo real com trilha auditável append-only. A empresa dobra a capacidade de atendimento mantendo a mesma equipe concentrada em clientes e vendas, devolvendo horas úteis aos sócios.",
    kpi: "100% auditável",
    kpiLabel: "Rastreabilidade e governança total",
    tag: "Fluxo Contínuo",
    icon: Zap
  }
];

export function SanleScrollytelling() {
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-chapter-index"));
            if (!Number.isNaN(idx)) {
              setActiveChapter(idx);
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.2
      }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (index: number) => {
    setActiveChapter(index);
    const targetEl = chapterRefs.current[index];
    if (targetEl) {
      const topOffset = targetEl.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="historia-sanle"
      className="relative bg-[#FAF8F5] text-[#121110] selection:bg-[#2440FF] selection:text-white py-16 sm:py-24 md:py-32 border-b border-[rgba(18,17,16,0.08)] select-none"
      aria-label="A História da Sanle · Engenharia Operacional"
    >
      {/* Glow de fundo solar e alabastro muito sutil para conforto visual */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,rgba(245,158,11,0.03)_40%,transparent_70%)] blur-[140px] z-0"
        aria-hidden="true"
      />

      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Cabeçalho da Seção com navegação rápida de capítulos */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(18,17,16,0.08)] pb-8 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2440FF]/10 text-[#2440FF]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2440FF] font-semibold">
                Engenharia Operacional · A Construção do Fluxo Sanle
              </span>
            </div>

            <h2 className="font-serif-editorial text-[clamp(2.1rem,4.2vw,3.8rem)] leading-[1.04] tracking-[-0.03em] text-[#121110]">
              Como transformamos atrito manual em fluxos contínuos e autônomos.
            </h2>

            <p className="text-base sm:text-lg text-[#4A453E] font-sans-editorial leading-relaxed">
              Quatro etapas estruturadas para conectar canais, arquivos e sistemas legados sem exigir migrações dolorosas ou rupturas no seu dia a dia.
            </p>
          </div>

          {/* Seletor de Capítulos Rápido */}
          <div className="flex flex-wrap items-center gap-2">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapter;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToChapter(idx)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all duration-300 ${
                    isActive
                      ? "bg-[#2440FF] text-white shadow-md shadow-[#2440FF]/25 font-semibold scale-105"
                      : "bg-white text-[#4A453E] border border-[rgba(18,17,16,0.1)] hover:text-[#121110] hover:border-[#2440FF]"
                  }`}
                >
                  <span className={isActive ? "text-amber-200" : "text-[#2440FF]"}>
                    {ch.chapter}
                  </span>
                  <span>{ch.id.charAt(0).toUpperCase() + ch.id.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout de Duas Colunas Fluido (Sem travamento de scroll) */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-start">
          {/* Lado Esquerdo: O Esquemático Técnico que acompanha suavemente no Desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start w-full space-y-4">
            <OperationalBlueprintStage 
              activeChapter={activeChapter} 
            />

            <div className="hidden lg:flex items-center justify-between px-2 font-mono text-xs text-[#8A837A] border-t border-[rgba(18,17,16,0.06)] pt-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
                <span>SINCRONIZAÇÃO EM TEMPO REAL</span>
              </span>
              <span>CAPÍTULO 0{activeChapter + 1} DE 04</span>
            </div>
          </div>

          {/* Lado Direito: Os 4 Capítulos com rolagem 100% natural e sem travas */}
          <div className="space-y-6 sm:space-y-8">
            {CHAPTERS.map((ch, idx) => {
              const IconComp = ch.icon;
              const isActive = idx === activeChapter;

              return (
                <div
                  key={ch.id}
                  ref={(el) => {
                    chapterRefs.current[idx] = el;
                  }}
                  data-chapter-index={idx}
                  className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
                    isActive
                      ? "bg-white border-[#2440FF]/30 shadow-xl shadow-stone-300/40 translate-x-1"
                      : "bg-white/60 hover:bg-white border-[rgba(18,17,16,0.08)] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[rgba(18,17,16,0.06)] pb-3">
                    <div className="inline-flex items-center gap-2 text-[#2440FF] font-mono text-xs uppercase tracking-wider font-semibold">
                      <IconComp className="h-4 w-4" />
                      <span>{ch.kicker}</span>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#8A837A]">
                      0{idx + 1} / 04
                    </span>
                  </div>

                  <div className="pt-4 space-y-3">
                    <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#121110] tracking-tight">
                      {ch.title}
                    </h3>

                    <p className="font-display text-sm sm:text-base text-[#2440FF] font-medium leading-snug">
                      {ch.lead}
                    </p>

                    <p className="text-sm sm:text-base text-[#4A453E] font-sans-editorial leading-relaxed">
                      {ch.body}
                    </p>
                  </div>

                  {/* KPI e Ação do Capítulo */}
                  <div className="mt-6 pt-4 border-t border-[rgba(18,17,16,0.06)] flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-mono text-lg sm:text-xl font-bold text-[#121110] block">
                        {ch.kpi}
                      </span>
                      <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#8A837A] block">
                        {ch.kpiLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/diagnostico"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121110] text-white font-medium text-xs hover:bg-[#2440FF] transition-all shadow-sm"
                      >
                        <span>Mapear processo</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
