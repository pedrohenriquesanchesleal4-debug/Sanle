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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Listener de Scroll nativo com cálculo preciso de progresso
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalHeight = container.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const rawProgress = -rect.top / totalHeight;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);

      const chapterIdx = Math.min(
        Math.floor(clamped * CHAPTERS.length),
        CHAPTERS.length - 1
      );
      setActiveChapter(chapterIdx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToChapter = (index: number) => {
    setActiveChapter(index);
    const container = containerRef.current;
    if (!container) return;
    const totalHeight = container.offsetHeight - window.innerHeight;
    const targetProgress = index / (CHAPTERS.length - 1);
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetScrollY = containerTop + targetProgress * totalHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  const current = CHAPTERS[activeChapter] ?? CHAPTERS[0]!;
  const IconComponent = current.icon;

  return (
    <section
      ref={containerRef}
      id="historia-sanle"
      className="relative bg-[#FAF8F5] text-[#121110] selection:bg-[#2440FF] selection:text-white min-h-[160vh] md:min-h-[220vh]"
      aria-label="A História da Sanle · Scrollytelling Operacional"
    >
      {/* Estágio Fixado (Sticky Pin) que permanece na tela durante o scroll em 100dvh para evitar saltos no mobile */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between overflow-hidden px-4 py-3 sm:px-6 sm:py-5 md:px-12 md:py-8">
        {/* Glow de fundo solar e alabastro muito sutil para conforto visual */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[950px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,rgba(245,158,11,0.03)_40%,transparent_70%)] blur-[140px] z-0"
          aria-hidden="true"
        />

        {/* 1. Header do Scrollytelling com status em tempo real */}
        <div className="relative z-20 flex items-center justify-between border-b border-[rgba(18,17,16,0.08)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#2440FF]/10 text-[#2440FF]">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </span>
            <div>
              <span className="font-mono text-[0.68rem] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#2440FF] font-semibold">
                Engenharia Operacional
              </span>
              <span className="hidden sm:inline font-mono text-xs text-[#8A837A] ml-2">
                · A Construção do Fluxo Sanle
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="font-mono text-xs">
              <span className="text-[#2440FF] font-bold">0{activeChapter + 1}</span>
              <span className="text-[#8A837A] mx-1">/</span>
              <span className="text-[#8A837A]">04</span>
              <span className="hidden sm:inline text-[#8A837A] ml-2">
                ({Math.round(scrollProgress * 100)}% concluído)
              </span>
            </div>

            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(18,17,16,0.12)] bg-white/90 px-3 py-1 sm:px-4 sm:py-1.5 font-mono text-[0.7rem] sm:text-xs text-[#121110] hover:border-[#2440FF] hover:text-[#2440FF] transition-all shadow-xs"
            >
              <span>Mapear processo</span>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2440FF]" />
            </Link>
          </div>

          {/* Micro-barra de progresso fluida sob o cabeçalho */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[#2440FF] transition-all duration-100 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            aria-hidden="true"
          />
        </div>

        {/* 2. Palco Central: Esquemático Vetorial Nativo + Narrativa Editorial */}
        <div className="relative z-10 my-auto grid lg:grid-cols-[1.12fr_0.88fr] gap-4 sm:gap-6 md:gap-10 items-center max-w-7xl mx-auto w-full overflow-hidden">
          {/* Lado Esquerdo: O Esquemático de Engenharia Operacional */}
          <div className="w-full">
            <OperationalBlueprintStage 
              activeChapter={activeChapter} 
              scrollProgress={scrollProgress} 
            />
          </div>

          {/* Lado Direito: Narrativa Editorial com transição fluida */}
          <div key={current.id} className="flex flex-col justify-center space-y-2 sm:space-y-3.5 max-w-xl transition-all duration-300 animate-in fade-in">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#2440FF] font-mono text-[0.66rem] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold">
              <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{current.kicker}</span>
            </div>

            <h3 className="font-serif-editorial text-[clamp(1.25rem,2.5vw,2.5rem)] leading-[1.1] text-[#121110] tracking-tight">
              {current.title}
            </h3>

            <p className="font-display text-xs sm:text-sm md:text-base text-[#2440FF] font-medium leading-snug">
              {current.lead}
            </p>

            <p className="text-[0.72rem] sm:text-xs md:text-sm leading-relaxed text-[#4A453E] font-sans-editorial line-clamp-3 sm:line-clamp-none">
              {current.body}
            </p>

            {/* Destaque do Capítulo com Ação Rápida */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#121110] text-white font-medium text-[0.7rem] sm:text-xs hover:bg-[#2440FF] transition-all shadow-md shadow-stone-900/10 active:scale-95"
              >
                <span>Mapear meu processo</span>
                <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </Link>

              <a
                href="#como-funciona"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full border border-[rgba(18,17,16,0.14)] bg-white text-[0.7rem] sm:text-xs font-medium text-[#121110] hover:border-[#2440FF] transition-colors"
              >
                <span>Demonstração</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Barra de Navegação de Linha do Tempo e Controle de Capítulos */}
        <div className="relative z-20 border-t border-[rgba(18,17,16,0.08)] pt-2.5 sm:pt-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
              <span className="font-mono text-[0.62rem] sm:text-[0.7rem] uppercase tracking-widest text-[#8A837A]">
                Toque nos capítulos ou role
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(idx)}
                    className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 font-mono text-[0.66rem] sm:text-xs transition-all duration-300 ${
                      isActive
                        ? "bg-[#2440FF] text-white shadow-md shadow-[#2440FF]/25 scale-105 font-medium"
                        : "bg-white/90 text-[#8A837A] border border-[rgba(18,17,16,0.1)] hover:text-[#121110] hover:border-[#2440FF]/40"
                    }`}
                  >
                    <span className={isActive ? "text-amber-200" : "text-[#8A837A]"}>
                      {ch.chapter}
                    </span>
                    <span className="hidden sm:inline">
                      {ch.id.charAt(0).toUpperCase() + ch.id.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
