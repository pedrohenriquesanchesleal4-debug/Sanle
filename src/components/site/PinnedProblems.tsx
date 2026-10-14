"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invisibleWork } from "@/content/brand";

export function PinnedProblems() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=2600",
      pin: pin,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          invisibleWork.length - 1,
          Math.floor(self.progress * invisibleWork.length)
        );
        setActiveIndex(idx);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const current = invisibleWork[activeIndex] ?? invisibleWork[0]!;

  return (
    <section
      ref={containerRef}
      id="problema"
      className="relative bg-[#F5F2EB] text-[#121110] border-b border-[rgba(18,17,16,0.08)]"
    >
      <div
        ref={pinRef}
        className="min-h-screen flex flex-col justify-between p-6 sm:p-12 md:p-20 relative overflow-hidden"
      >
        {/* Topo do monitor */}
        <div className="flex items-center justify-between border-b border-[rgba(18,17,16,0.1)] pb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#4A453E]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2440FF]" />
            O CUSTO INVISÍVEL DA OPERAÇÃO
          </span>
          <span className="text-[#2440FF] font-bold">
            0{activeIndex + 1} / 0{invisibleWork.length}
          </span>
        </div>

        {/* Centro: O Trabalho com Tipografia Monumental */}
        <div className="my-auto py-12 max-w-5xl">
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.24em] text-[#2440FF] mb-4 font-semibold">
            TRABALHO INVISÍVEL #{activeIndex + 1}
          </p>

          <h2 className="font-serif-editorial text-[clamp(2.8rem,7.5vw,7.2rem)] leading-[0.94] tracking-[-0.03em] text-[#121110] min-h-[1.9em] flex items-center transition-all duration-300">
            {current.title}
          </h2>

          <p className="mt-8 text-xl md:text-2xl text-[#4A453E] max-w-2xl font-sans-editorial leading-relaxed">
            {current.note}
          </p>

          {/* Barra de progresso dos 7 itens */}
          <div className="mt-12 flex gap-2 max-w-md">
            {invisibleWork.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-[#2440FF] scale-y-125"
                    : i < activeIndex
                    ? "bg-[#121110] opacity-40"
                    : "bg-[rgba(18,17,16,0.1)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Rodapé da seção pinned */}
        <div className="pt-6 border-t border-[rgba(18,17,16,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[#8A837A]">
          <p className="uppercase tracking-[0.16em]">
            {activeIndex === invisibleWork.length - 1 ? (
              <strong className="text-[#121110]">
                Somadas, essas tarefas custam a operação inteira.
              </strong>
            ) : (
              "Role para inspecionar os outros gargalos"
            )}
          </p>
          <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[#2440FF] font-semibold">
            SANLE ANALYTICS · MAPEAMENTO DE PROCESSO
          </span>
        </div>
      </div>
    </section>
  );
}
