"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * SALES HUNTER — FinalCTA (Seção 12)
 * Fechamento visual forte que retoma o ponto luminoso e as coordenadas da abertura,
 * agora organizados em uma composição completa.
 * Headline obrigatória: "Suas próximas oportunidades começam aqui."
 * CTA obrigatório: "Começar a prospectar"
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-[#F5F6F8]/10 bg-[#08090C] py-28 md:py-36">
      {/* Composição geométrica que retoma o ponto central da Cena 01 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[460px] w-[460px] rounded-full border border-[#78A9FF]/12" />
        <div className="absolute h-[280px] w-[280px] rounded-full border border-[#B7F36B]/20" />
        <div className="absolute h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-[#78A9FF]/30 to-transparent" />
      </div>

      <div className="shell relative z-10 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#B7F36B]/40 bg-[#191C22]">
          <span className="h-3 w-3 rounded-full bg-[#B7F36B] shadow-[0_0_20px_#B7F36B]" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#78A9FF]">
          THE OPPORTUNITY ENGINE · SALES HUNTER
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl font-display text-clamp-title font-semibold leading-[1.02] tracking-tightest text-[#F5F6F8]">
          Suas próximas oportunidades começam aqui.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#969DA8] md:text-lg">
          Acesse a plataforma para pesquisar empresas reais, qualificar oportunidades, gerar abordagens personalizadas e organizar seu pipeline comercial.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/admin/login" className="btn btn-primary px-8 py-4 text-sm">
            <span>Começar a prospectar</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link href="/diagnostico" className="btn btn-ghost px-7 py-4 text-sm">
            <span>Solicitar diagnóstico personalizado</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
