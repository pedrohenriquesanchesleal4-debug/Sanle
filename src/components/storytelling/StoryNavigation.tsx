"use client";

import { STORY_SCENES, type StorySceneSpec } from "@/lib/motion/motion-config";

interface StoryNavigationProps {
  activeScene: StorySceneSpec;
  onSelectScene: (index: number) => void;
}

/**
 * Navegação lateral discreta entre as 8 cenas da jornada "The Opportunity Engine".
 * Permite que o visitante salte diretamente para qualquer capítulo ou acompanhe onde está.
 */
export function StoryNavigation({ activeScene, onSelectScene }: StoryNavigationProps) {
  return (
    <nav
      aria-label="Capítulos da narrativa Sales Hunter"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
    >
      {STORY_SCENES.map((scene, idx) => {
        const isActive = scene.id === activeScene.id;
        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => onSelectScene(idx)}
            aria-label={`Ir para cena ${scene.code}: ${scene.label}`}
            aria-current={isActive ? "step" : undefined}
            className="group flex items-center justify-end gap-2.5 text-right focus:outline-none"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-200 ${
                isActive
                  ? "translate-x-0 text-[#B7F36B] opacity-100"
                  : "translate-x-2 text-[#969DA8] opacity-0 group-hover:translate-x-0 group-hover:opacity-80"
              }`}
            >
              {scene.code} · {scene.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-200 ${
                isActive
                  ? "h-5 w-1.5 bg-[#B7F36B] shadow-[0_0_12px_#B7F36B]"
                  : "h-1.5 w-1.5 bg-[#969DA8]/45 group-hover:bg-[#78A9FF]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
