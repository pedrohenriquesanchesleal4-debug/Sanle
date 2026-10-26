"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ChevronRight
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

    let rafId = 0;
    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollableDist = container.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const raw = -rect.top / scrollableDist;
      const progress = Math.max(0, Math.min(1, raw));
      setScrollProgress(progress);

      // Mapeia o progresso 0..1 nos 4 capítulos
      if (progress < 0.28) {
        setActiveChapter(0);
      } else if (progress < 0.54) {
        setActiveChapter(1);
      } else if (progress < 0.80) {
        setActiveChapter(2);
      } else {
        setActiveChapter(3);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]!;
  const Icon = currentChapter.icon;

  // Efeito de Gate Zoom no final da seção para transicionar ao Ambiente 02
  const gateZoomProgress = Math.max(0, (scrollProgress - 0.88) / 0.12);

  return (
    <section
      id="historia-sanle"
      ref={containerRef}
      className="relative w-full h-[280vh] sm:h-[320vh] bg-[#FAF8F5] text-[#121110] select-none"
      aria-label="Ambiente 01: Engenharia Operacional · Scrollytelling da Construção do Fluxo Sanle"
    >
      {/* =========================================================================
          VIEWPORT FIXA DE SCROLLYTELLING (Sticky top-0 h-screen estilo why.zero.university)
         ========================================================================= */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 transition-colors duration-700"
        style={{
          backgroundColor: gateZoomProgress > 0.4 ? "#08090C" : "#FAF8F5",
          color: gateZoomProgress > 0.4 ? "#F5F6F8" : "#121110"
        }}
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
        <div className="relative z-20 flex items-center justify-between border-b border-current/10 pb-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#2440FF]/10 text-[#2440FF] border border-[#2440FF]/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="font-mono text-[0.62rem] sm:text-xs uppercase tracking-[0.2em] font-bold block text-[#2440FF]">
                AMBIENTE 01 · ENGENHARIA OPERACIONAL
              </span>
              <span className="text-[0.62rem] sm:text-xs text-[#8A837A] font-mono hidden sm:inline">
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
                      ? "bg-[#2440FF] text-white font-bold shadow-md shadow-[#2440FF]/30 scale-105"
                      : "bg-black/5 text-[#8A837A] opacity-60"
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
            <OperationalBlueprintStage activeChapter={activeChapter} />
          </div>

          {/* Lado Direito: A Narrativa do Capítulo com Tipografia Editorial */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#2440FF]">
              <Icon className="h-4 w-4" />
              <span>{currentChapter.kicker}</span>
            </div>

            <h2 className="font-serif-editorial text-[clamp(1.8rem,3.8vw,3.6rem)] leading-[1.03] tracking-[-0.03em] transition-all duration-300">
              {currentChapter.title}
            </h2>

            <p className="font-display text-sm sm:text-base md:text-lg text-[#2440FF] font-medium leading-snug">
              {currentChapter.lead}
            </p>

            <p className="text-sm sm:text-base text-current opacity-80 font-sans-editorial leading-relaxed max-w-xl">
              {currentChapter.body}
            </p>

            {/* Métrica de Impacto / KPI do Capítulo */}
            <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold block">
                  {currentChapter.kpi}
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#8A837A] block">
                  {currentChapter.kpiLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/diagnostico"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121110] text-white font-medium text-xs hover:bg-[#2440FF] transition-all shadow-md"
                >
                  <span>Mapear processo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RODAPÉ DE NAVEGAÇÃO E INDICADOR DE TRANSIÇÃO
           ======================================================================= */}
        <div className="relative z-20 flex items-center justify-between border-t border-current/10 pt-3 max-w-7xl mx-auto w-full font-mono text-xs">
          <div className="flex items-center gap-2 text-[#8A837A]">
            <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
            <span className="text-[0.65rem] sm:text-xs">
              ROLE PARA AVANÇAR NA HISTÓRIA ({(scrollProgress * 100).toFixed(0)}%)
            </span>
          </div>

          <a
            href="#problema"
            className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs text-[#2440FF] hover:underline"
          >
            <span>Pular para Custo Invisível</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* =======================================================================
            GATE ZOOM PORTAL OVERLAY (Acionado no final da seção para transição estilo why.zero)
           ======================================================================= */}
        {gateZoomProgress > 0.05 && (
          <div 
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center transition-all duration-300"
            style={{
              opacity: gateZoomProgress,
              transform: `scale(${1 + gateZoomProgress * 0.4})`
            }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#2440FF]/60 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-2xl">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-[#C8A24A]/70 animate-ping [animation-duration:3s]" />
              <div className="absolute text-center space-y-1">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#78A9FF] font-bold block">
                  ENTRANDO NO AMBIENTE 02
                </span>
                <span className="font-serif-editorial text-lg sm:text-xl text-white font-semibold block">
                  Investigação Forense
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
