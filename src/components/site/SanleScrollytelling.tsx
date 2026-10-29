"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ChevronLeft,
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
    id: "diagnostico",
    chapter: "01",
    kicker: "CAPÍTULO 01 · O DIAGNÓSTICO E A IDEIA",
    title: "O Ponto de Partida: Onde boas ideias e operações travam",
    lead: "Processos desconectados, controles paralelos e projetos que ficam só no papel.",
    body: "Empresas em crescimento frequentemente enfrentam dois desafios ao mesmo tempo: uma presença digital que não reflete sua maturidade real e uma rotina interna presa em planilhas, mensagens soltas e retrabalho manual entre setores.",
    kpi: "Escopo claro",
    kpiLabel: "Mapeamento real antes de escrever código",
    tag: "Diagnóstico",
    icon: Compass,
    themeColor: "#EF4444"
  },
  {
    id: "digital",
    chapter: "02",
    kicker: "CAPÍTULO 02 · PRESENÇA DIGITAL & ENTRADA",
    title: "A Primeira Camada: Posicionamento e Captação Estruturada",
    lead: "Sites, páginas e canais que comunicam valor e organizam a chegada de demandas.",
    body: "Construímos interfaces autorais e rápidas que apresentam sua empresa com clareza comercial e transformam contatos de clientes em solicitações padronizadas, conectadas diretamente ao WhatsApp e ao seu fluxo de atendimento.",
    kpi: "Zero migração",
    kpiLabel: "Integra com as ferramentas que você já usa",
    tag: "Presença & Canais",
    icon: Layers,
    themeColor: "#2440FF"
  },
  {
    id: "sistemas",
    chapter: "03",
    kicker: "CAPÍTULO 03 · SISTEMAS & AGENTES COM CONTEXTO",
    title: "O Núcleo de Software: Sistemas Sob Medida e IA Aplicada",
    lead: "Regras de negócio estruturadas e inteligência conectada aos documentos da empresa.",
    body: "Quando a operação pede mais controle, desenvolvemos painéis, portais, CRMs e agentes de IA com busca documental (RAG) e chamada de ferramentas. O software organiza o fluxo e mantém o operador humano no comando das decisões críticas.",
    kpi: "Sob medida",
    kpiLabel: "Desenhado para a regra real da sua operação",
    tag: "Sistemas & IA",
    icon: ShieldCheck,
    themeColor: "#C8A24A"
  },
  {
    id: "automacao",
    chapter: "04",
    kicker: "CAPÍTULO 04 · AUTOMAÇÃO & FLUXO CONTÍNUO",
    title: "A Operação Integrada: Menos Retrabalho, Mais Visibilidade",
    lead: "Documentos, APIs e bancos de dados conversando sem redigitação manual.",
    body: "Com integrações e pipelines automatizados, informações extraídas de documentos e canais seguem para os sistemas certos com validação e registro de atividades, liberando a equipe para focar em clientes, análise e crescimento.",
    kpi: "Ponta a ponta",
    kpiLabel: "Rastreabilidade e histórico operacional",
    tag: "Fluxo Contínuo",
    icon: Zap,
    themeColor: "#10B981"
  }
];

export function SanleScrollytelling() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  const handleSelectChapter = useCallback((index: number) => {
    setActiveChapter(index);
    setScrollProgress((index + 0.5) / CHAPTERS.length);
    setUserInteracted(true);

    if (typeof window !== "undefined" && window.innerWidth >= 1024 && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset;
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist > 0) {
        const targetScrollY = currentScrollY + rect.top + (index / (CHAPTERS.length - 1)) * totalDist;
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });
      }
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (activeChapter + 1) % CHAPTERS.length;
    handleSelectChapter(nextIdx);
  }, [activeChapter, handleSelectChapter]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeChapter - 1 + CHAPTERS.length) % CHAPTERS.length;
    handleSelectChapter(prevIdx);
  }, [activeChapter, handleSelectChapter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const windowH = window.innerHeight;
          const totalDist = container.offsetHeight - windowH;

          if (rect.top <= windowH * 0.4 && rect.bottom >= windowH * 0.2) {
            if (totalDist > 0) {
              const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
              setScrollProgress(progress);

              const chapterIdx = Math.min(
                CHAPTERS.length - 1,
                Math.floor(progress * CHAPTERS.length)
              );
              setActiveChapter(chapterIdx);
            }
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

  useEffect(() => {
    if (userInteracted) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % CHAPTERS.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [userInteracted]);

  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]!;
  const Icon = currentChapter.icon;

  return (
    <section
      id="historia-sanle"
      ref={containerRef}
      className="relative w-full bg-[#08090C] text-[#F5F6F8] border-b border-white/[0.08] lg:min-h-[175vh]"
      aria-label="Arquitetura em Movimento: Os 4 Capítulos de Engenharia da Sanle"
    >
      <div 
        className="relative lg:sticky lg:top-0 w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-6 md:px-10 transition-colors duration-700 bg-transparent z-10 lg:min-h-[100dvh]"
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000 blur-[140px] opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentChapter.themeColor} 0%, transparent 65%)`
          }}
          aria-hidden="true"
        />

        {/* BARRA DE CONTROLE SUPERIOR */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="font-mono text-[0.62rem] sm:text-xs uppercase tracking-[0.2em] font-bold block text-[#78A9FF]">
                ARQUITETURA EM MOVIMENTO · 4 ETAPAS
              </span>
              <span className="text-[0.62rem] sm:text-xs text-[#969DA8] font-mono hidden sm:inline">
                DO DIAGNÓSTICO À OPERAÇÃO INTEGRADA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapter;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#2440FF] text-white font-bold shadow-lg shadow-[#2440FF]/40 scale-105 border border-[#78A9FF]/50"
                      : "bg-white/[0.04] text-[#969DA8] border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/[0.08]"
                  }`}
                  title={`Ir para o Capítulo ${ch.chapter}: ${ch.title}`}
                >
                  <span className="font-bold">{ch.chapter}</span>
                  <span className="hidden sm:inline text-[11px]">{ch.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PALCO PRINCIPAL */}
        <div className="relative z-20 my-auto py-4 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="w-full transform transition-all duration-500">
            <OperationalBlueprintStage activeChapter={activeChapter} scrollProgress={scrollProgress} />
          </div>

          <div className="space-y-3.5 sm:space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#78A9FF]">
                <Icon className="h-4 w-4" />
                <span>{currentChapter.kicker}</span>
              </div>

              <div className="flex items-center gap-1.5 sm:hidden">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.05] text-[#969DA8] hover:text-white"
                  aria-label="Capítulo anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.05] text-[#969DA8] hover:text-white"
                  aria-label="Próximo capítulo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h2 className="font-serif-editorial text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.05] tracking-[-0.03em] transition-all duration-300 text-[#F5F6F8]">
              {currentChapter.title}
            </h2>

            <p className="font-display text-sm sm:text-base md:text-lg text-[#78A9FF] font-medium leading-snug">
              {currentChapter.lead}
            </p>

            <p className="text-xs sm:text-sm md:text-base text-[#969DA8] font-sans-editorial leading-relaxed max-w-xl">
              {currentChapter.body}
            </p>

            <div className="pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-lg sm:text-2xl font-bold block text-[#F5F6F8]">
                  {currentChapter.kpi}
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#969DA8] block">
                  {currentChapter.kpiLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/#contato"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2440FF] text-white font-medium text-xs hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/30 active:scale-95"
                >
                  <span>Conversar sobre meu projeto</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé da Viewport */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 max-w-7xl mx-auto w-full text-xs font-mono text-[#969DA8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#B7F36B]" />
            <span>CAPÍTULO {activeChapter + 1} DE {CHAPTERS.length} · {currentChapter.tag.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[11px] text-[#969DA8] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[11px] text-[#969DA8] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <span>Próximo</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="w-28 sm:w-44 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2440FF] via-[#C8A24A] to-[#10B981] transition-all duration-300"
                style={{ width: `${Math.round(((activeChapter + 1) / CHAPTERS.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
