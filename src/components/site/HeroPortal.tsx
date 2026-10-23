"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { heroContent } from "@/content/hero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function HeroPortal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const emblemRef = useRef<HTMLDivElement | null>(null);
  const maskHoleRef = useRef<SVGCircleElement | null>(null);
  const curtainSvgRef = useRef<SVGSVGElement | null>(null);
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

    // Raio base da abertura central da logo em pixels (diâmetro 84px)
    const baseHoleRadius = 42;

    const updateZoom = () => {
      // 1. Cálculo de progresso de scroll relativo ao container de 240vh
      const rect = container.getBoundingClientRect();
      const scrollableDist = container.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const rawProgress = -rect.top / scrollableDist;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Evita trabalho inútil se o progresso não variou
      if (Math.abs(progress - lastProgressRef.current) < 0.0003) return;
      lastProgressRef.current = progress;

      // 2. Curva de aproximação tátil da logo:
      // Progress 0.00 a 0.35: Aproximação gradual e cinematográfica (escala 1x a 2.8x)
      // Progress 0.35 a 0.80: Mergulho exponencial através da lente (escala 2.8x a 38x)
      let scale = 1;
      if (progress < 0.35) {
        scale = 1 + (progress / 0.35) * 1.8;
      } else {
        const t = (progress - 0.35) / 0.45;
        scale = 2.8 + Math.pow(Math.min(1, t), 2.2) * 35.2;
      }

      // Aplica a escala na logo física com GPU transform
      emblem.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;

      // 3. A abertura óptica da lente no SVG mask expande em sincronia exata com a logo
      const holeRadius = Math.max(baseHoleRadius, baseHoleRadius * scale);
      maskHole.setAttribute("r", holeRadius.toFixed(1));

      // 4. Dissolução da cortina e do anel conforme a câmera atravessa o portal
      if (progress < 0.6) {
        emblem.style.opacity = "1";
        curtainSvg.style.opacity = "1";
      } else if (progress < 0.85) {
        const fade = Math.max(0, 1 - (progress - 0.6) / 0.25);
        emblem.style.opacity = fade.toFixed(3);
        curtainSvg.style.opacity = fade.toFixed(3);
      } else {
        emblem.style.opacity = "0";
        curtainSvg.style.opacity = "0";
      }

      // 5. O site (Hero) crescendo e clareando de dentro do portal
      const heroOpacity = Math.min(1, 0.45 + progress * 0.65);
      const heroScale = 0.88 + Math.min(1, progress / 0.85) * 0.12;
      heroContent.style.opacity = heroOpacity.toFixed(3);
      heroContent.style.transform = `translate3d(0, 0, 0) scale(${heroScale.toFixed(3)})`;

      // 6. Ativa interações e notifica header quando o portal é ultrapassado
      if (progress >= 0.75) {
        setIsRevealed(true);
        window.dispatchEvent(new CustomEvent("sanle:portal-entered"));
      } else {
        setIsRevealed(false);
      }
    };

    // Render inicial imediato no frame 0 (tela perfeitamente montada sem flash)
    updateZoom();

    // GSAP Ticker garante atualização contínua e suave a 60fps/120fps em qualquer navegador
    gsap.ticker.add(updateZoom);
    window.addEventListener("scroll", updateZoom, { passive: true });
    window.addEventListener("resize", updateZoom);

    return () => {
      gsap.ticker.remove(updateZoom);
      window.removeEventListener("scroll", updateZoom);
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
      className="relative w-full bg-[#FAF8F5] select-none"
      style={{ height: "240vh" }}
      aria-label="Introdução: O Mergulho na Logo Sanle e Revelação do Site"
    >
      {/* Viewport Pinned 100% nativo via CSS Sticky */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
        {/* Glow de fundo solar e alabastro muito sutil */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.06)_0%,rgba(245,158,11,0.04)_40%,transparent_70%)] blur-[140px] z-0"
          aria-hidden="true"
        />

        {/* =========================================================================
            CAMADA 1: O SITE (HERO COMPLETO)
            Fica posicionado atrás da cortina e é revelado através da abertura da logo.
           ========================================================================= */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full h-full flex flex-col justify-between pt-24 pb-10 will-change-transform"
          style={{
            opacity: 0.45,
            transform: "translate3d(0, 0, 0) scale(0.88)",
            pointerEvents: isRevealed ? "auto" : "none"
          }}
        >
          <div className="shell relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center my-auto">
            {/* Lado Esquerdo: Mensagem e Tipografia Monumental em Tom Claro */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(18,17,16,0.08)] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#4A453E] font-medium">
                  {heroContent.eyebrow}
                </span>
              </div>

              <h1
                id="hero-main-title"
                className="mt-6 font-serif-editorial text-[clamp(3.1rem,8vw,7.2rem)] leading-[0.94] tracking-[-0.04em] text-[#121110]"
              >
                {heroContent.headlineTop}
                <span className="block mt-1">
                  {heroContent.headlineBottom}{" "}
                  <em className="italic text-[#2440FF] font-normal not-italic:font-serif">
                    {heroContent.headlineItalic}
                  </em>
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-[#4A453E] font-sans-editorial">
                {heroContent.subheadline}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Link
                  href={heroContent.ctaPrimary.href}
                  onClick={handleCtaClick}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#121110] text-white font-medium text-sm transition-all duration-200 hover:bg-[#2440FF] hover:shadow-[0_10px_25px_rgba(36,64,255,0.3)] active:scale-[0.98]"
                >
                  <span>{heroContent.ctaPrimary.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white border border-[rgba(18,17,16,0.12)] text-[#121110] text-sm hover:border-[#2440FF] hover:text-[#2440FF] transition-all shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4 text-[#10B981]" />
                  <span>{heroContent.ctaSecondary.label}</span>
                </button>
              </div>

              <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#8A837A]">
                {heroContent.microProof}
              </p>
            </div>

            {/* Lado Direito: Preview da Escultura Cinética */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/11] rounded-3xl border border-[rgba(18,17,16,0.1)] bg-white overflow-hidden shadow-2xl shadow-stone-300/50 group">
              <Image
                src="/images/scrolly/frame-1.jpg"
                alt="Escultura cinética da Sanle em atelier de arquitetura"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 backdrop-blur-md border border-[rgba(18,17,16,0.06)] shadow-sm">
                <Sparkles className="h-3 w-3 text-[#2440FF]" />
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#121110] font-semibold">
                  Objeto Cinético Sanle
                </span>
              </div>

              <a
                href="#historia-sanle"
                className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[rgba(18,17,16,0.08)] flex items-center justify-between text-xs text-[#121110] shadow-lg hover:border-[#2440FF] transition-all"
              >
                <div>
                  <strong className="block font-medium">História em Scrollytelling</strong>
                  <span className="text-[#4A453E] text-[0.7rem]">
                    Role para ver o objeto se montar e o fluxo se organizar
                  </span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2440FF] text-white">
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </div>
              </a>
            </div>
          </div>

          <div className="shell pt-4 border-t border-[rgba(18,17,16,0.08)] flex items-center justify-between text-xs font-mono text-[#8A837A]">
            <span>01 / 07 · INTRODUÇÃO</span>
            <span className="hidden sm:inline">CONECTANDO DOCUMENTOS · SISTEMAS · IA</span>
          </div>
        </div>

        {/* =========================================================================
            CAMADA 2: A CORTINA COM MÁSCARA SVG ÓPTICA
            Cobre a tela inteira em #FAF8F5, exceto pelo orifício central da lente
            que expande à medida que o usuário rola a página.
           ========================================================================= */}
        <svg
          ref={curtainSvgRef}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full will-change-transform"
          aria-hidden="true"
        >
          <defs>
            <mask id="portal-aperture-mask">
              {/* O retângulo branco mantém o fundo alabastro opaco */}
              <rect width="100%" height="100%" fill="white" />
              {/* O círculo preto fura a cortina no centro da tela */}
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
            mask="url(#portal-aperture-mask)"
          />
        </svg>

        {/* =========================================================================
            CAMADA 3: O EMBLEMA ESCULTURAL DA LOGO SANLE
            No frame 0, a tela começa limpa: apenas a logo pequena no centro.
            Conforme a pessoa rola a página, a logo e seu portal se aproximam e expandem.
           ========================================================================= */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div
            ref={emblemRef}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center will-change-transform"
            style={{
              transformOrigin: "center center",
              transform: "translate3d(0, 0, 0) scale(1)"
            }}
          >
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
        </div>
      </div>
    </section>
  );
}
