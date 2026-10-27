"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles
} from "lucide-react";
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
  themeColor: string;
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
    icon: Compass,
    themeColor: "#EF4444"
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
    icon: Layers,
    themeColor: "#2440FF"
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
    icon: ShieldCheck,
    themeColor: "#C8A24A"
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
    icon: Zap,
    themeColor: "#10B981"
  }
];

export function SanleScrollytelling() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const totalDist = container.offsetHeight - window.innerHeight;
          if (totalDist > 0) {
            const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
            setScrollProgress(progress);

            // Divide os 4 capítulos igualmente no percurso de scroll
            const chapterIdx = Math.min(
              CHAPTERS.length - 1,
              Math.floor(progress * CHAPTERS.length)
            );
            setActiveChapter(chapterIdx);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]!;
  const Icon = currentChapter.icon;

  return (
    <section
      id="historia-sanle"
      ref={containerRef}
      className="relative w-full h-[220vh] sm:h-[250vh] bg-[#08090C] text-[#F5F6F8] select-none"
      aria-label="Ambiente 01: Engenharia Operacional · Scrollytelling da Construção do Fluxo Sanle"
    >
      {/* =========================================================================
          VIEWPORT FIXA DE SCROLLYTELLING (Sticky top-0 h-screen estilo why.zero.university)
         ========================================================================= */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 transition-colors duration-700 bg-transparent"
      >
        {/* Glow dinâmico de fundo que reage ao capítulo ativo */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000 blur-[140px] opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentChapter.themeColor} 0%, transparent 65%)`
          }}
          aria-hidden="true"
        />

        {/* =======================================================================
            BARRA DE CONTROLE SUPERIOR (Estilo HUD do why.zero.university)
           ======================================================================= */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="font-mono text-[0.62rem] sm:text-xs uppercase tracking-[0.2em] font-bold block text-[#78A9FF]">
                AMBIENTE 01 · ENGENHARIA OPERACIONAL
              </span>
              <span className="text-[0.62rem] sm:text-xs text-[#969DA8] font-mono hidden sm:inline">
                A CONSTRUÇÃO DO FLUXO CONTÍNUO
              </span>
            </div>
          </div>

          {/* Timeline de Capítulos estilo Depth Meter */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapter;
              return (
                <div
                  key={ch.id}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-mono text-xs transition-all duration-300 ${
                    isActive
                      ? "bg-[#2440FF] text-white font-bold shadow-md shadow-[#2440FF]/40 scale-105"
                      : "bg-white/[0.04] text-[#969DA8] border border-white/5 opacity-70"
                  }`}
                >
                  <span>{ch.chapter}</span>
                  <span className="hidden md:inline">{ch.id.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =======================================================================
            PALCO PRINCIPAL CINEMATOGRÁFICO: DUAS COLUNAS EM LOCKSTEP
           ======================================================================= */}
        <div className="relative z-20 my-auto max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-10 md:gap-14 items-center">
          {/* Lado Esquerdo: O Esquemático Operacional que Reage Dinamicamente ao Capítulo */}
          <div className="w-full transform transition-all duration-500">
            <OperationalBlueprintStage activeChapter={activeChapter} scrollProgress={scrollProgress} />
          </div>

          {/* Lado Direito: A Narrativa do Capítulo com Tipografia Editorial */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#78A9FF]">
              <Icon className="h-4 w-4" />
              <span>{currentChapter.kicker}</span>
            </div>

            <h2 className="font-serif-editorial text-[clamp(1.8rem,3.8vw,3.6rem)] leading-[1.03] tracking-[-0.03em] transition-all duration-300 text-[#F5F6F8]">
              {currentChapter.title}
            </h2>

            <p className="font-display text-sm sm:text-base md:text-lg text-[#78A9FF] font-medium leading-snug">
              {currentChapter.lead}
            </p>

            <p className="text-sm sm:text-base text-[#969DA8] font-sans-editorial leading-relaxed max-w-xl">
              {currentChapter.body}
            </p>

            {/* Métrica de Impacto / KPI do Capítulo */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold block text-[#F5F6F8]">
                  {currentChapter.kpi}
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#969DA8] block">
                  {currentChapter.kpiLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/diagnostico"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2440FF] text-white font-medium text-xs hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/30"
                >
                  <span>Mapear processo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé da Viewport: Barra de Progresso SVG scrub contínuo */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-3 max-w-7xl mx-auto w-full text-xs font-mono text-[#969DA8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#B7F36B] animate-pulse" />
            <span>PROGRESSO DA JORNADA: {Math.round(scrollProgress * 100)}%</span>
          </div>

          <div className="w-32 sm:w-48 h-1 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2440FF] via-[#C8A24A] to-[#10B981] transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
