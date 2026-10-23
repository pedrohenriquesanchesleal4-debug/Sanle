"use client";

import type { StorySceneSpec } from "@/lib/motion/motion-config";

interface ScrollProgressProps {
  progress: number;
  activeScene: StorySceneSpec;
}

/**
 * Barra lateral e topo de telemetria indicando o avanço contínuo pela narrativa de 8 cenas.
 */
export function ScrollProgress({ progress, activeScene }: ScrollProgressProps) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="h-[2px] w-full bg-[#111318]">
        <div
          className="h-full bg-gradient-to-r from-[#78A9FF] via-[#B7F36B] to-[#B7F36B] transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="sr-only">
        Cena atual {activeScene.code}: {activeScene.label} ({pct}%)
      </span>
    </div>
  );
}
