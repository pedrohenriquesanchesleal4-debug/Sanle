"use client";

import { useEffect, useState } from "react";

export function InitialSessionLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Apenas na primeira visita da sessão e se não preferir movimento reduzido
    const alreadyVisited = sessionStorage.getItem("sanle_visited");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyVisited || prefersReduced) {
      return;
    }

    setVisible(true);

    const startTime = performance.now();
    const duration = 900; // suave e rápido

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        sessionStorage.setItem("sanle_visited", "true");
        setTimeout(() => setVisible(false), 160);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#FAF8F5] p-8 md:p-14 text-[#121110] transition-opacity duration-300 pointer-events-none select-none"
    >
      <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#8A837A]">
        <span>SANLE · BRASÍLIA · DF</span>
        <span>SISTEMA OPERACIONAL</span>
      </div>

      <div className="my-auto">
        <div className="font-serif-editorial text-[clamp(4.5rem,15vw,12rem)] leading-none font-normal text-[#121110]">
          {progress.toString().padStart(2, "0")}
          <span className="text-[#2440FF] text-[0.4em] ml-2">%</span>
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-[#4A453E]">
          ORGANIZANDO DADOS · CONECTANDO SISTEMAS
        </p>
      </div>

      <div className="w-full">
        <div className="h-[2px] w-full bg-[rgba(18,17,16,0.08)]">
          <div
            className="h-full bg-[#2440FF] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
