"use client";

import type { ReactNode } from "react";

interface StorySceneProps {
  id: string;
  active: boolean;
  stackedMode: boolean;
  children: ReactNode;
}

/**
 * Container individual de cena.
 * Em desktop com scroll-scrubbing ativo, sobrepõe-se no palco fixado com transição contínua.
 * Em mobile ou prefers-reduced-motion, renderiza em fluxo vertical natural sem esconder conteúdo.
 */
export function StoryScene({ id, active, stackedMode, children }: StorySceneProps) {
  if (stackedMode) {
    return (
      <section
        id={id}
        className="relative flex min-h-[88dvh] w-full items-center justify-center border-b border-[#F5F6F8]/8 py-20"
      >
        {children}
      </section>
    );
  }

  return (
    <div
      id={id}
      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-500 ${
        active ? "z-20 opacity-100 pointer-events-auto" : "z-10 opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
