"use client";

import type { StorySceneSpec } from "@/lib/motion/motion-config";

interface SpatialMarkersProps {
  activeScene: StorySceneSpec;
  globalProgress: number;
}

/**
 * Marcadores espaciais e telemetria integrados ao palco 3D.
 * Exibe coordenadas ilustrativas e deixa explícito que a visualização é demonstrativa.
 */
export function SpatialMarkers({ activeScene, globalProgress }: SpatialMarkersProps) {
  const showTerritoryHUD = globalProgress >= 0.08 && globalProgress <= 0.62;
  const showPriorityMarker = globalProgress >= 0.33 && globalProgress <= 0.65;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none" aria-hidden="true">
      {/* Coordenada superior esquerda — Telemetria do motor */}
      <div className="absolute left-6 top-20 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#969DA8]/75 lg:flex">
        <span className="inline-block h-2 w-2 rounded-full bg-[#B7F36B] shadow-[0_0_12px_#B7F36B]" />
        <span>SALES HUNTER · STAGE {activeScene.code}/08</span>
        <span className="text-[#969DA8]/40">|</span>
        <span className="text-[#78A9FF]">{activeScene.label}</span>
      </div>

      {/* Aviso explícito de visualização ilustrativa (Regra de Autenticidade Seção 6 & 19) */}
      <div className="absolute bottom-5 left-6 hidden items-center gap-2 rounded-full border border-[#F5F6F8]/10 bg-[#08090C]/80 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8] backdrop-blur-md md:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-[#78A9FF]" />
        <span>Simulação espacial ilustrativa · Dados de demonstração</span>
      </div>

      {/* Marcadores regionais sutis durante as cenas de território e busca */}
      {showTerritoryHUD && (
        <>
          <div
            className="absolute left-[14%] top-[28%] hidden rounded-lg border border-[#78A9FF]/25 bg-[#111318]/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[#969DA8] backdrop-blur-sm transition-opacity duration-500 xl:block"
            style={{ opacity: activeScene.index === 2 || activeScene.index === 3 ? 0.85 : 0.25 }}
          >
            <span className="text-[#78A9FF]">CLUSTER BSB-NORTE</span> · 42 ESTABELECIMENTOS (DEMO)
          </div>

          <div
            className="absolute right-[12%] bottom-[24%] hidden rounded-lg border border-[#F5F6F8]/10 bg-[#111318]/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[#969DA8] backdrop-blur-sm transition-opacity duration-500 xl:block"
            style={{ opacity: activeScene.index === 2 || activeScene.index === 3 ? 0.75 : 0.2 }}
          >
            <span className="text-[#F5F6F8]">CLUSTER SIA / SOF</span> · SERVIÇOS & VIDRAÇARIAS
          </div>
        </>
      )}

      {/* Retícula de travamento de oportunidade prioritária */}
      {showPriorityMarker && (
        <div className="absolute right-[18%] top-[22%] hidden items-center gap-2.5 rounded-full border border-[#B7F36B]/40 bg-[#191C22]/90 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7F36B] shadow-[0_0_30px_rgba(183,243,107,0.2)] lg:inline-flex">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#B7F36B]" />
          <span>SINAL PRIORITÁRIO IDENTIFICADO · SCORE 92</span>
        </div>
      )}
    </div>
  );
}
