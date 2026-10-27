"use client";

import { useEffect, useState } from "react";
import { Compass, ShieldAlert, Zap, ArrowDown, Activity } from "lucide-react";

export type SanleStageId = 
  | "historia-sanle"
  | "problema"
  | "calculadora"
  | "transformacao"
  | "como-funciona"
  | "solucoes"
  | "prova";

interface StageInfo {
  environment: "01 · ENGENHARIA" | "02 · CUSTO INVISÍVEL" | "03 · FLUXO CONTÍNUO" | "04 · SOLUÇÕES";
  title: string;
  stageCode: string;
  progress: number; // 0..100
  icon: typeof Compass;
  accentColor: string;
  nextTarget: string;
}

const STAGES: Record<string, StageInfo> = {
  "historia-sanle": {
    environment: "01 · ENGENHARIA",
    stageCode: "STG 01",
    title: "Engenharia Operacional",
    progress: 20,
    icon: Compass,
    accentColor: "#78A9FF",
    nextTarget: "#problema"
  },
  "problema": {
    environment: "02 · CUSTO INVISÍVEL",
    stageCode: "STG 02",
    title: "Investigação Forense (7 Gargalos)",
    progress: 40,
    icon: ShieldAlert,
    accentColor: "#F59E0B",
    nextTarget: "#calculadora"
  },
  "calculadora": {
    environment: "02 · CUSTO INVISÍVEL",
    stageCode: "STG 03",
    title: "Impacto Financeiro em R$",
    progress: 60,
    icon: ShieldAlert,
    accentColor: "#EF4444",
    nextTarget: "#transformacao"
  },
  "transformacao": {
    environment: "03 · FLUXO CONTÍNUO",
    stageCode: "STG 04",
    title: "Do Atrito ao Fluxo Sanle",
    progress: 75,
    icon: Zap,
    accentColor: "#B7F36B",
    nextTarget: "#como-funciona"
  },
  "como-funciona": {
    environment: "03 · FLUXO CONTÍNUO",
    stageCode: "STG 05",
    title: "Demonstração em 6 Etapas",
    progress: 88,
    icon: Zap,
    accentColor: "#10B981",
    nextTarget: "#solucoes"
  },
  "solucoes": {
    environment: "04 · SOLUÇÕES",
    stageCode: "STG 06",
    title: "Arquitetura & Prova Técnica",
    progress: 100,
    icon: Activity,
    accentColor: "#78A9FF",
    nextTarget: "#prova"
  }
};

export function SanleStageHUD() {
  const [currentStageId, setCurrentStageId] = useState<string>("historia-sanle");
  const [isVisible, setIsVisible] = useState(false);
  const [globalScrollPct, setGlobalScrollPct] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = [
      document.getElementById("historia-sanle"),
      document.getElementById("problema"),
      document.getElementById("calculadora"),
      document.getElementById("transformacao"),
      document.getElementById("como-funciona"),
      document.getElementById("solucoes")
    ].filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setGlobalScrollPct(Math.min(100, Math.round((scrollY / docHeight) * 100)));
      }

      const portalThreshold = 450;
      setIsVisible(scrollY > portalThreshold);

      // Detecta qual seção está mais visível no centro da viewport
      const viewportMid = scrollY + window.innerHeight * 0.45;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= viewportMid) {
          if (sec.id !== currentStageId) {
            setCurrentStageId(sec.id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [currentStageId]);

  if (!isVisible) return null;

  const currentInfo = STAGES[currentStageId] ?? STAGES["historia-sanle"]!;
  const Icon = currentInfo.icon;

  return (
    <aside
      aria-label="Controle de Estágios e HUD da Experiência"
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 will-change-transform max-w-[94vw] sm:max-w-lg select-none"
    >
      {/* Pílula de Vidro HUD (Inspirada no visual e precisão do why.zero.university) */}
      <div
        className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full backdrop-blur-2xl border border-white/15 bg-[#08090C]/85 text-white shadow-2xl transition-all duration-500"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)"
        }}
      >
        {/* Badge XP/Stage no estilo do Zero University */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[0.62rem] sm:text-xs font-bold border transition-colors"
          style={{ 
            backgroundColor: `${currentInfo.accentColor}15`,
            borderColor: `${currentInfo.accentColor}35`,
            color: currentInfo.accentColor 
          }}
        >
          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
          <span>{currentInfo.stageCode}</span>
        </div>

        {/* Informação Textual do Ambiente Atual */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5 font-mono text-[0.56rem] sm:text-[0.6rem] uppercase tracking-[0.16em] text-[#969DA8] truncate">
            <span>{currentInfo.environment}</span>
          </div>

          <span className="font-serif-editorial text-xs sm:text-sm font-semibold truncate leading-tight text-[#F5F6F8]">
            {currentInfo.title}
          </span>
        </div>

        {/* Régua de Progresso em Tempo Real */}
        <div className="hidden sm:flex flex-col items-end pl-2.5 border-l border-white/10 font-mono text-[0.62rem]">
          <span className="font-bold text-[#B7F36B]">{globalScrollPct}%</span>
          <div className="w-14 h-1 rounded-full bg-white/10 overflow-hidden mt-0.5">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${globalScrollPct}%`,
                backgroundColor: currentInfo.accentColor
              }}
            />
          </div>
        </div>

        {/* Botão de Avanço Rápido para a Próxima Seção */}
        <a
          href={currentInfo.nextTarget}
          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-[#2440FF] text-white transition-all hover:scale-105 active:scale-95"
          aria-label="Avançar para o próximo ambiente"
          title="Avançar ambiente"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
