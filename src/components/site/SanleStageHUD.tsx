"use client";

import { useEffect, useState } from "react";
import { Compass, ShieldAlert, Zap, ArrowDown } from "lucide-react";

export type SanleStageId = 
  | "hero"
  | "historia-sanle"
  | "problema"
  | "calculadora"
  | "transformacao"
  | "como-funciona";

interface StageInfo {
  environment: "01 · ENGENHARIA" | "02 · CUSTO INVISÍVEL" | "03 · FLUXO CONTÍNUO";
  theme: "light" | "dark";
  title: string;
  progress: number; // 0..100
  icon: typeof Compass;
  accentColor: string;
}

const STAGES: Record<string, StageInfo> = {
  "historia-sanle": {
    environment: "01 · ENGENHARIA",
    theme: "light",
    title: "Engenharia Operacional",
    progress: 25,
    icon: Compass,
    accentColor: "#2440FF"
  },
  "problema": {
    environment: "02 · CUSTO INVISÍVEL",
    theme: "dark",
    title: "Investigação Forense (7 Gargalos)",
    progress: 50,
    icon: ShieldAlert,
    accentColor: "#F59E0B"
  },
  "calculadora": {
    environment: "02 · CUSTO INVISÍVEL",
    theme: "dark",
    title: "Clímax: Custo Financeiro em R$",
    progress: 70,
    icon: ShieldAlert,
    accentColor: "#EF4444"
  },
  "transformacao": {
    environment: "03 · FLUXO CONTÍNUO",
    theme: "light",
    title: "Do Atrito ao Fluxo Sanle",
    progress: 85,
    icon: Zap,
    accentColor: "#10B981"
  },
  "como-funciona": {
    environment: "03 · FLUXO CONTÍNUO",
    theme: "light",
    title: "Demonstração em 6 Etapas",
    progress: 100,
    icon: Zap,
    accentColor: "#10B981"
  }
};

export function SanleStageHUD() {
  const [currentStageId, setCurrentStageId] = useState<string>("historia-sanle");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = [
      document.getElementById("historia-sanle"),
      document.getElementById("problema"),
      document.getElementById("calculadora"),
      document.getElementById("transformacao"),
      document.getElementById("como-funciona")
    ].filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const scrollY = window.scrollY;
      const portalThreshold = 550; // Surge após passar o zoom da logo inicial
      setIsVisible(scrollY > portalThreshold);

      // Detecta qual seção está mais visível no centro da viewport
      const viewportMid = scrollY + window.innerHeight * 0.45;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= viewportMid) {
          if (sec.id !== currentStageId) {
            setCurrentStageId(sec.id);
            // Sincroniza tema no body (estilo setPageTheme do why.zero.university)
            const info = STAGES[sec.id];
            if (info) {
              document.body.setAttribute("data-sanle-env", info.environment);
              document.body.classList.toggle("sanle-theme-dark", info.theme === "dark");
              document.body.classList.toggle("sanle-theme-light", info.theme === "light");
            }
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
  const isDark = currentInfo.theme === "dark";

  return (
    <aside
      aria-label="Controle de Estágios e HUD da Experiência"
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 will-change-transform max-w-[94vw] sm:max-w-md select-none"
    >
      {/* Pílula de Vidro Fosco HUD (Inspirada no visual do why.zero.university) */}
      <div
        className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-500 ${
          isDark
            ? "bg-[#090A0E]/85 text-white border-white/15 shadow-black/80"
            : "bg-white/85 text-[#121110] border-black/10 shadow-stone-500/15"
        }`}
        style={{
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)"
        }}
      >
        {/* Ícone de Estágio com Pulso de Radar */}
        <div 
          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-colors"
          style={{ 
            backgroundColor: `${currentInfo.accentColor}20`,
            color: currentInfo.accentColor 
          }}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>

        {/* Informação Textual do Ambiente Atual */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5 font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.16em] opacity-75 truncate">
            <span 
              className="h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: currentInfo.accentColor }} 
            />
            <span>{currentInfo.environment}</span>
          </div>

          <span className="font-serif-editorial text-xs sm:text-sm font-semibold truncate leading-tight">
            {currentInfo.title}
          </span>
        </div>

        {/* Régua de Progresso do Estágio */}
        <div className="hidden sm:flex flex-col items-end pl-2 border-l border-current/10 font-mono text-[0.62rem]">
          <span className="font-bold opacity-80">{currentInfo.progress}%</span>
          <div className="w-12 h-1 rounded-full bg-current/15 overflow-hidden mt-0.5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${currentInfo.progress}%`,
                backgroundColor: currentInfo.accentColor
              }}
            />
          </div>
        </div>

        {/* Botão de Avanço Rápido para a Próxima Seção */}
        <a
          href={
            currentStageId === "historia-sanle"
              ? "#problema"
              : currentStageId === "problema"
              ? "#calculadora"
              : currentStageId === "calculadora"
              ? "#transformacao"
              : "#como-funciona"
          }
          className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95 ${
            isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"
          }`}
          aria-label="Avançar para o próximo ambiente"
          title="Avançar ambiente"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
