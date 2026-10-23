"use client";

import Link from "next/link";
import { ArrowRight, Compass, Sparkles, MessageSquare, Columns3 } from "lucide-react";

interface FinaleSceneProps {
  /** Progresso local da Cena 08 [0..1] */
  progress: number;
  active: boolean;
}

const CONVERGENCE_PILLARS = [
  {
    icon: Compass,
    code: "TERRITÓRIO",
    title: "Busca multi-provedor",
    detail: "OpenStreetMap gratuito, CSV e filtros regionais."
  },
  {
    icon: Sparkles,
    code: "DIAGNÓSTICO",
    title: "Score e oportunidade",
    detail: "Justificativa clara do que oferecer a cada empresa."
  },
  {
    icon: MessageSquare,
    code: "DIÁLOGO",
    title: "Abordagem + Demo 1-a-1",
    detail: "Mensagens personalizadas e páginas /p/[slug]."
  },
  {
    icon: Columns3,
    code: "RELACIONAMENTO",
    title: "Pipeline CRM vivo",
    detail: "Etapas, lembretes, histórico e conversão."
  }
] as const;

/**
 * CENA 08 — THE OPPORTUNITY ENGINE (Clímax)
 * Todos os elementos visuais anteriores convergem em uma única composição
 * revelando a plataforma completa Sales Hunter.
 */
export function FinaleScene({ progress, active }: FinaleSceneProps) {
  const reveal = Math.max(0.2, Math.min(1, progress * 1.8));

  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center justify-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Imagem de convergência tridimensional integrada ao fundo */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen"
        style={{ backgroundImage: "url('/media/storytelling/engine-convergence.jpg')" }}
      />

      <div
        className="shell relative z-10 max-w-5xl text-center"
        style={{
          opacity: reveal,
          transform: `scale(${0.96 + reveal * 0.04})`
        }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/40 bg-[#191C22]/90 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7F36B]">
          <span className="h-2 w-2 rounded-full bg-[#B7F36B] shadow-[0_0_12px_#B7F36B]" />
          <span>08 · THE OPPORTUNITY ENGINE</span>
        </div>

        <h2 className="mt-6 font-display text-clamp-hero font-semibold leading-[0.98] tracking-tightest text-[#F5F6F8]">
          Encontre oportunidades.{" "}
          <span className="text-[#78A9FF]">Inicie conversas.</span>{" "}
          <span className="text-[#B7F36B]">Construa negócios.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#969DA8] md:text-lg">
          Do primeiro sinal no mapa ao acompanhamento no CRM: uma plataforma de inteligência comercial construída para transformar dados dispersos em clientes reais.
        </p>

        {/* CTAs principais da Cena 08 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/admin/login" className="btn btn-primary px-7 py-4 text-sm">
            <span>Começar a prospectar</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a href="#produto-real" className="btn btn-ghost px-7 py-4 text-sm">
            <span>Explorar a plataforma</span>
          </a>
        </div>

        {/* Convergência dos 4 pilares em composição espacial */}
        <div className="mt-10 grid grid-cols-1 gap-3.5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {CONVERGENCE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.code}
                className="rounded-hunter border border-[#F5F6F8]/10 bg-[#191C22]/85 p-4 backdrop-blur-md"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF]">
                  <span>{pillar.code}</span>
                  <Icon className="h-3.5 w-3.5 text-[#B7F36B]" />
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-[#F5F6F8]">
                  {pillar.title}
                </p>
                <p className="mt-1 text-xs text-[#969DA8]">{pillar.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
