"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowDown } from "lucide-react";

export function LogoPortalZoom() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const emblemWrapperRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const lensGlowRef = useRef<HTMLDivElement | null>(null);
  const [zoomProgress, setZoomProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const pin = pinRef.current;
    const emblem = emblemWrapperRef.current;
    const prompt = promptRef.current;
    const lensGlow = lensGlowRef.current;

    if (!container || !pin || !emblem || !prompt) return;

    const ctx = gsap.context(() => {
      // Timeline com scrub direto: cada milímetro de scroll avança o zoom da logo
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2200",
          pin: pin,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            setZoomProgress(self.progress);
            if (self.progress >= 0.85) {
              window.dispatchEvent(new CustomEvent("sanle:portal-entered"));
            }
          }
        }
      });

      // 1. O prompt ("Role para entrar") desaparece imediatamente nos primeiros pixels
      tl.to(
        prompt,
        {
          opacity: 0,
          y: -20,
          duration: 0.12,
          ease: "power1.out"
        },
        0
      );

      // 2. A logo faz o zoom monumental: de 1x até 55x (a câmera mergulha na abertura central)
      tl.to(
        emblem,
        {
          scale: 48,
          duration: 1,
          ease: "power2.inOut"
        },
        0
      );

      // 3. Brilho óptico cobalto e solar na lente central conforme nos aproximamos
      if (lensGlow) {
        tl.to(
          lensGlow,
          {
            opacity: 1,
            scale: 2.5,
            duration: 0.5,
            ease: "power1.in"
          },
          0.25
        );

        tl.to(
          lensGlow,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out"
          },
          0.75
        );
      }

      // 4. Abertura do portal que dissolve a logo cobrindo a tela no clímax do mergulho
      tl.to(
        emblem,
        {
          opacity: 0,
          filter: "blur(12px)",
          duration: 0.22,
          ease: "power3.in"
        },
        0.78
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const handleSkip = () => {
    const container = containerRef.current;
    if (!container) return;
    const targetY = container.offsetTop + 2250;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      id="portal-intro"
      className="relative w-full bg-[#FAF8F5] select-none"
      style={{ minHeight: "2200px" }}
      aria-label="Introdução: O Mergulho na Logo Sanle"
    >
      {/* Viewport Pinned que fixa na tela */}
      <div
        ref={pinRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF8F5]"
      >
        {/* Fundo solar suave e etéreo */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[750px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.06)_0%,rgba(245,158,11,0.04)_45%,transparent_70%)] blur-[120px]"
          aria-hidden="true"
        />

        {/* =========================================================================
            O OBJETO CENTRAL DA LOGO (Começa Pequeno, Nítido e Solitário no Centro)
           ========================================================================= */}
        <div
          ref={emblemWrapperRef}
          className="relative flex items-center justify-center will-change-transform z-10"
          style={{ transformOrigin: "center center" }}
        >
          {/* O Disco / Emblema Físico Escultural da Sanle */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center">
            {/* Imagem Fotográfica de Alta Resolução do Emblema em Latão e Safira */}
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-stone-400/30 border border-stone-200/60 bg-[#FAF8F5]">
              <Image
                src="/images/zoom/zoom-1.jpg"
                alt="Emblema Sanle"
                fill
                priority
                sizes="240px"
                className="object-cover"
              />
            </div>

            {/* Abertura Central / Portal com Anel de Safira e Lente Óptica */}
            <div
              ref={lensGlowRef}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#2440FF]/60 bg-[radial-gradient(circle,rgba(36,64,255,0.35)_0%,rgba(245,158,11,0.15)_60%,transparent_100%)] opacity-30 blur-sm pointer-events-none transition-opacity"
            />

            {/* Íris interna por onde a câmera entra */}
            <div className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-transparent border border-[#2440FF]/40 shadow-inner" />
          </div>
        </div>

        {/* =========================================================================
            PROMPT INICIAL: "Role para entrar" (Desaparece assim que a rolagem começa)
           ========================================================================= */}
        <div
          ref={promptRef}
          className="absolute bottom-12 inset-x-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none"
        >
          {/* Marca Tipográfica Discreta */}
          <div className="text-center">
            <span className="font-serif-editorial text-2xl tracking-tight text-[#121110] font-normal block">
              sanle
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#8A837A] block mt-1">
              automação operacional
            </span>
          </div>

          {/* Pílula com Ícone Animado */}
          <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,17,16,0.08)] shadow-sm text-xs font-mono text-[#4A453E] uppercase tracking-[0.18em]">
            <span>Role para entrar</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#2440FF] animate-bounce" />
          </div>
        </div>

        {/* Botão de Atalho "Pular Introdução" */}
        <div
          className="absolute bottom-6 right-6 z-30 transition-opacity duration-300"
          style={{ opacity: zoomProgress < 0.8 ? 1 : 0 }}
        >
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[0.68rem] font-mono uppercase tracking-wider text-[#8A837A] hover:text-[#121110] border border-[rgba(18,17,16,0.08)] transition-all shadow-sm"
          >
            <span>Pular introdução</span>
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
