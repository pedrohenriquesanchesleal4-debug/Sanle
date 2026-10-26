"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, MessageCircle, ChevronDown } from "lucide-react";
import { heroContent } from "@/content/hero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

import { TactileFlowConsole } from "@/components/site/TactileFlowConsole";

export function HeroPortal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const emblemRef = useRef<HTMLDivElement | null>(null);
  const maskHoleRef = useRef<SVGCircleElement | null>(null);
  const curtainSvgRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const lastProgressRef = useRef<number>(-1);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const emblem = emblemRef.current;
    const maskHole = maskHoleRef.current;
    const curtainSvg = curtainSvgRef.current;
    const heroContent = heroContentRef.current;

    if (!container || !emblem || !maskHole || !curtainSvg || !heroContent) return;

    const isMobile = window.innerWidth < 768;
    // Raio base da abertura central da logo em pixels (diâmetro ~80px mobile / ~88px desktop)
    const baseHoleRadius = isMobile ? 38 : 44;

    const updateZoom = () => {
      // 1. Cálculo de progresso de scroll dinâmico e enxuto (105vh mobile / 120vh desktop)
      const rect = container.getBoundingClientRect();
      const scrollableDist = container.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const rawProgress = -rect.top / scrollableDist;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Evita recalcular se o progresso não mudou significativamente
      if (Math.abs(progress - lastProgressRef.current) < 0.0004) return;
      lastProgressRef.current = progress;

      const maxMultiplier = isMobile ? 20 : 34;
      const threshold = isMobile ? 0.2 : 0.3;

      // 2. Curva rápida e imediata de aproximação tátil:
      let scale = 1;
      if (progress < threshold) {
        scale = 1 + (progress / threshold) * 1.6;
      } else {
        const t = (progress - threshold) / (1 - threshold);
        scale = 2.6 + Math.pow(Math.min(1, t), 2) * maxMultiplier;
      }

      // Aplica escala com GPU transform translate3d
      emblem.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;

      // 3. Abertura do orifício óptico na máscara SVG
      const holeRadius = Math.max(baseHoleRadius, baseHoleRadius * scale);
      maskHole.setAttribute("r", holeRadius.toFixed(1));

      // 4. Dissolução imediata e suave da cortina no mobile
      const fadeStart = isMobile ? 0.22 : 0.38;
      const fadeEnd = isMobile ? 0.5 : 0.68;
      if (progress < fadeStart) {
        emblem.style.opacity = "1";
        curtainSvg.style.opacity = "1";
      } else if (progress < fadeEnd) {
        const fade = Math.max(0, 1 - (progress - fadeStart) / (fadeEnd - fadeStart));
        emblem.style.opacity = fade.toFixed(3);
        curtainSvg.style.opacity = fade.toFixed(3);
      } else {
        emblem.style.opacity = "0";
        curtainSvg.style.opacity = "0";
      }

      // 5. O Hero clareando e ganhando escala rapidamente
      const heroOpacity = Math.min(1, (isMobile ? 0.6 : 0.45) + progress * 0.7);
      const heroScale = 0.92 + Math.min(1, progress / (isMobile ? 0.5 : 0.7)) * 0.08;
      heroContent.style.opacity = heroOpacity.toFixed(3);
      heroContent.style.transform = `translate3d(0, 0, 0) scale(${heroScale.toFixed(3)})`;

      // 6. Ativa interações rapidamente
      const revealThreshold = isMobile ? 0.35 : 0.5;
      if (progress >= revealThreshold) {
        setIsRevealed(true);
        window.dispatchEvent(new CustomEvent("sanle:portal-entered"));
      } else {
        setIsRevealed(false);
      }
    };

    updateZoom();

    // Listener de scroll passivo throttled por requestAnimationFrame:
    // Elimina chamadas desnecessárias de getBoundingClientRect() e zero layout thrashing no mobile
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateZoom();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateZoom, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateZoom);
    };
  }, []);

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_aberto", { local: "hero" });
    const url = buildWhatsAppLink();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCtaClick = () => {
    trackEvent("cta_clicado", { cta: "mapear_meu_processo", local: "hero" });
  };

  return (
    <section
      ref={containerRef}
      id="portal-hero-container"
      className="relative w-full bg-[#FAF8F5] select-none h-[105vh] md:h-[125vh]"
      aria-label="Introdução: O Mergulho na Logo Sanle e Revelação do Site"
    >
      {/* Viewport Pinned 100% nativo com suporte a Dynamic Viewport Height (100dvh) */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
        {/* Glow de fundo solar e alabastro muito sutil */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] md:h-[800px] w-[500px] md:w-[800px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.06)_0%,rgba(245,158,11,0.04)_40%,transparent_70%)] blur-[100px] md:blur-[140px] z-0"
          aria-hidden="true"
        />

        {/* =========================================================================
            CAMADA 1: O SITE (HERO COMPLETO)
           ========================================================================= */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full h-full flex flex-col justify-between pt-16 md:pt-20 pb-6 md:pb-8 will-change-transform overflow-y-auto lg:overflow-visible"
          style={{
            opacity: 0.45,
            transform: "translate3d(0, 0, 0) scale(0.9)",
            pointerEvents: isRevealed ? "auto" : "none"
          }}
        >
          <div className="shell relative z-10 grid lg:grid-cols-[1.08fr_0.92fr] gap-6 lg:gap-12 items-center my-auto w-full max-w-7xl">
            {/* Lado Esquerdo: Mensagem e Tipografia Monumental em Tom Claro */}
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[rgba(18,17,16,0.08)] shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#4A453E] font-medium">
                    {heroContent.eyebrow}
                  </span>
                </div>
                <span className="font-mono text-[0.62rem] text-[#8A837A] hidden sm:inline">
                  LAT 15°47&apos;38&quot;S LONG 47°52&apos;58&quot;W
                </span>
              </div>

              <h1
                id="hero-main-title"
                className="mt-4 md:mt-5 font-serif-editorial text-[clamp(2.1rem,5vw,5rem)] leading-[1.02] tracking-[-0.03em] text-[#121110]"
              >
                {heroContent.headlineTop}
                <span className="block mt-1 font-serif-editorial">
                  {heroContent.headlineBottom}{" "}
                  <em className="italic text-[#2440FF] font-normal not-italic:font-serif">
                    {heroContent.headlineItalic}
                  </em>
                </span>
              </h1>

              <p className="mt-3 md:mt-5 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#4A453E] font-sans-editorial">
                {heroContent.subheadline}
              </p>

              {/* Três capacidades arquiteturais de fluxo */}
              <div className="mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl">
                <div className="p-2 sm:p-2.5 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white/80 shadow-xs">
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#2440FF] font-bold block">
                    01 · Ingestão
                  </span>
                  <span className="text-[0.72rem] text-[#121110] font-medium block mt-0.5">
                    WhatsApp & OCR direto
                  </span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white/80 shadow-xs">
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#C8A24A] font-bold block">
                    02 · Regras
                  </span>
                  <span className="text-[0.72rem] text-[#121110] font-medium block mt-0.5">
                    Validação em 0.12s
                  </span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white/80 shadow-xs">
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#10B981] font-bold block">
                    03 · ERP Sync
                  </span>
                  <span className="text-[0.72rem] text-[#121110] font-medium block mt-0.5">
                    Omie, ContaAzul & Ledger
                  </span>
                </div>
              </div>

              <div className="mt-6 md:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={heroContent.ctaPrimary.href}
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#121110] text-white font-medium text-sm transition-all duration-200 hover:bg-[#2440FF] hover:shadow-[0_8px_20px_rgba(36,64,255,0.25)] active:scale-[0.98]"
                >
                  <span>{heroContent.ctaPrimary.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full bg-white border border-[rgba(18,17,16,0.12)] text-[#121110] text-sm hover:border-[#2440FF] hover:text-[#2440FF] transition-all shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4 text-[#10B981]" />
                  <span>{heroContent.ctaSecondary.label}</span>
                </button>
              </div>

              <p className="mt-4 md:mt-5 font-mono text-[0.66rem] sm:text-[0.68rem] uppercase tracking-[0.14em] text-[#8A837A]">
                {heroContent.microProof}
              </p>
            </div>

            {/* Lado Direito: O Console Tátil (visível em desktop e tablets) */}
            <div className="w-full hidden md:block">
              <TactileFlowConsole />
              
              <div className="mt-3 flex items-center justify-between px-2">
                <a
                  href="#historia-sanle"
                  className="inline-flex items-center gap-1.5 text-[0.68rem] font-mono text-[#4A453E] hover:text-[#2440FF] transition-colors"
                >
                  <ChevronDown className="h-3 w-3 animate-bounce text-[#2440FF]" />
                  <span>Role para ver o fluxo em movimento</span>
                </a>
                <span className="font-mono text-[0.62rem] text-[#8A837A]">
                  4 ETAPAS
                </span>
              </div>
            </div>
          </div>

          <div className="shell pt-3 border-t border-[rgba(18,17,16,0.08)] flex items-center justify-between text-xs font-mono text-[#8A837A]">
            <span>01 / 07 · REVELAÇÃO DO FLUXO OPERACIONAL</span>
            <span className="hidden sm:inline">CONECTANDO DOCUMENTOS · SISTEMAS · REGRAS DE NEGÓCIO</span>
          </div>
        </div>

        {/* =========================================================================
            CAMADA 2: A CORTINA COM MÁSCARA SVG ÓPTICA
           ========================================================================= */}
        <div
          ref={curtainSvgRef}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full will-change-transform"
          style={{ opacity: 1 }}
          aria-hidden="true"
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <mask id="hero-portal-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle
                  ref={maskHoleRef}
                  cx="50%"
                  cy="50%"
                  r="42"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#FAF8F5"
              mask="url(#hero-portal-mask)"
            />
          </svg>
        </div>

        {/* =========================================================================
            CAMADA 3: O EMBLEMA ESCULTURAL SANLE (A LENTE FÍSICA E OS TRÊS NÓS)
           ========================================================================= */}
        <div
          ref={emblemRef}
          className="pointer-events-none absolute z-30 flex flex-col items-center justify-center will-change-transform"
          style={{
            transformOrigin: "center center",
            transform: "translate3d(0, 0, 0) scale(1)",
            opacity: 1
          }}
          aria-hidden="true"
        >
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center">
            {/* Anel de Latão Escultural com Centro Aberto */}
            <div className="absolute inset-0 rounded-full border-[10px] sm:border-[13px] border-[#C8A24A] shadow-2xl shadow-stone-500/25 bg-transparent flex items-center justify-center">
              {/* Anel Interno de Safira / Lente Óptica */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#2440FF]/70 bg-transparent shadow-inner flex items-center justify-center" />
            </div>

            {/* Os Três Nós de Safira Azul Cobalto da Marca Sanle */}
            {/* Nó 1 (Superior / 12 horas) */}
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2440FF] shadow-lg shadow-[#2440FF]/60 border-2 border-white ring-2 ring-[#C8A24A]" />

            {/* Nó 2 (Inferior Esquerdo / 7 horas) */}
            <div className="absolute bottom-2.5 left-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2440FF] shadow-lg shadow-[#2440FF]/60 border-2 border-white ring-2 ring-[#C8A24A]" />

            {/* Nó 3 (Inferior Direito / 5 horas) */}
            <div className="absolute bottom-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2440FF] shadow-lg shadow-[#2440FF]/60 border-2 border-white ring-2 ring-[#C8A24A]" />
          </div>

          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
            <span className="font-serif-editorial text-xl sm:text-2xl tracking-[-0.03em] text-[#121110]">
              sanle
            </span>
            <span className="font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.24em] text-[#8A837A] mt-0.5">
              Role para entrar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
