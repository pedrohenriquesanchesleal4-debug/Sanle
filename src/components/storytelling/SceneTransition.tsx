"use client";

import type { StorySceneSpec } from "@/lib/motion/motion-config";

interface SceneTransitionProps {
  activeScene: StorySceneSpec;
  sceneLocalProgress: number;
}

/**
 * Camada de continuidade óptica entre cenas: conector vertical e feixe de energia
 * que une visualmente o ponto -> rede -> busca -> oportunidade -> diagnóstico -> mensagem -> pipeline.
 */
export function SceneTransition({ activeScene, sceneLocalProgress }: SceneTransitionProps) {
  const pulseOpacity = Math.sin(sceneLocalProgress * Math.PI) * 0.35;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {/* Eixo central contínuo que conecta todas as 8 cenas */}
      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#78A9FF]/15 to-transparent" />

      {/* Brilho ambiental que reage à troca de capítulo */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pulseOpacity,
          background:
            activeScene.index >= 4
              ? "radial-gradient(circle at 60% 50%, rgba(183, 243, 107, 0.08), transparent 60%)"
              : "radial-gradient(circle at 50% 50%, rgba(120, 169, 255, 0.08), transparent 60%)"
        }}
      />
    </div>
  );
}
