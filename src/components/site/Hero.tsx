"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { heroContent } from "@/content/hero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
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
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#FAF8F5] text-[#121110] pt-28 pb-12 border-b border-[rgba(18,17,16,0.08)]"
      aria-labelledby="hero-main-title"
    >
      {/* Luz volumétrica natural e suave em tom alabastro e solar */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,rgba(245,158,11,0.03)_40%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center my-auto">
        {/* Lado Esquerdo: Mensagem e Tipografia Monumental em Tom Claro Confortável */}
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

        {/* Lado Direito: Preview da Escultura Cinética e Convite ao Scrollytelling */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/11] rounded-3xl border border-[rgba(18,17,16,0.1)] bg-white overflow-hidden shadow-2xl shadow-stone-300/50 group">
          <Image
            src="/images/scrolly/frame-1.jpg"
            alt="Escultura cinética da Sanle em atelier de arquitetura"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 540px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Sombra sutil de leitura */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Badge superior da escultura */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 backdrop-blur-md border border-[rgba(18,17,16,0.06)] shadow-sm">
            <Sparkles className="h-3 w-3 text-[#2440FF]" />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#121110] font-semibold">
              Objeto Cinético Sanle
            </span>
          </div>

          {/* Card Flutuante de Convite ao Scrollytelling no rodapé da imagem */}
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

      {/* Rótulo de rodapé do hero */}
      <div className="shell mt-10 pt-4 border-t border-[rgba(18,17,16,0.08)] flex items-center justify-between text-xs font-mono text-[#8A837A]">
        <span>01 / 07 · INTRODUÇÃO</span>
        <span className="hidden sm:inline">CONECTANDO DOCUMENTOS · SISTEMAS · IA</span>
      </div>
    </section>
  );
}
