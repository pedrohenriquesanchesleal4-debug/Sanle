"use client";

import { Star, Globe, Sparkles } from "lucide-react";

interface OpportunitySceneProps {
  /** Progresso local da Cena 04 [0..1] */
  progress: number;
  active: boolean;
}

/**
 * CENA 04 — SIGNAL TO OPPORTUNITY
 * Os resultados secundários recuam para segundo plano e o card demonstrativo
 * VIDRAÇARIA EXEMPLO assume o centro com composição tridimensional refinada.
 */
export function OpportunityScene({ progress, active }: OpportunitySceneProps) {
  const focusScale = 0.94 + Math.min(1, progress * 1.5) * 0.06;

  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Asset visual de foco seletivo integrado ao fundo */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-lighten"
        style={{ backgroundImage: "url('/media/storytelling/opportunity-focus.jpg')" }}
      />

      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-12">
        {/* Headline de seleção e priorização */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#191C22] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B7F36B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>04 · SIGNAL TO OPPORTUNITY</span>
          </div>

          <h2 className="mt-5 font-display text-clamp-title font-semibold leading-[1.02] tracking-tightest text-[#F5F6F8]">
            Menos ruído.{" "}
            <span className="text-[#B7F36B]">Mais oportunidades.</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#969DA8] md:text-lg">
            Em vez de percorrer dezenas de cadastros frios, o Sales Hunter isola os estabelecimentos onde sua oferta resolve uma lacuna clara.
          </p>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#969DA8]/70">
            * Exemplo demonstrativo ilustrativo.
          </p>
        </div>

        {/* Composição 3D com resultados secundários recuados e card principal conectado */}
        <div className="relative lg:col-span-7">
          {/* Cards em segundo plano (ruído reduzido) */}
          <div className="pointer-events-none mb-3 grid grid-cols-2 gap-3 opacity-30 blur-[1px]">
            <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-3 text-xs text-[#969DA8]">
              Cristal & Esquadrias Planalto · 4,6 ★
            </div>
            <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-3 text-xs text-[#969DA8]">
              Ateliê do Vidro Arquitetural · 4,5 ★
            </div>
          </div>

          {/* Linha luminosa conectando o card à rede 3D */}
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#B7F36B]">
            <span className="h-2 w-2 rounded-full bg-[#B7F36B] shadow-[0_0_12px_#B7F36B]" />
            <span className="h-px flex-1 bg-gradient-to-r from-[#B7F36B] via-[#78A9FF]/50 to-transparent" />
            <span>CONEXÃO ESPACIAL ATIVA · DEMO</span>
          </div>

          {/* Card Principal Destacado — VIDRAÇARIA EXEMPLO */}
          <div
            className="rounded-hunter-lg border border-[#B7F36B]/55 bg-[#191C22]/95 p-6 shadow-hunter-glow-green backdrop-blur-xl md:p-8"
            style={{
              transform: `scale(${focusScale})`
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F5F6F8]/10 pb-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#78A9FF]">
                  EXEMPLO DEMONSTRATIVO · BRASÍLIA, DF
                </span>
                <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-[#F5F6F8] md:text-3xl">
                  VIDRAÇARIA EXEMPLO
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#B7F36B]/12 px-3.5 py-1.5 font-mono text-xs font-semibold text-[#B7F36B]">
                <Star className="h-3.5 w-3.5 fill-[#B7F36B] text-[#B7F36B]" />
                <span>4,8 estrelas · 183 avaliações</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  <Globe className="h-3.5 w-3.5 text-[#78A9FF]" />
                  <span>Sinal público verificado</span>
                </div>
                <p className="mt-2 text-sm font-medium text-[#F5F6F8]">
                  Website não identificado nos dados consultados.
                </p>
                <p className="mt-1 text-xs text-[#969DA8]">
                  Reputação local consolidada com avaliações públicas, mas sem endereço web próprio retornado na consulta.
                </p>
              </div>

              <div className="rounded-xl border border-[#B7F36B]/35 bg-[#B7F36B]/10 p-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7F36B]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Oportunidade sugerida</span>
                </div>
                <p className="mt-2 font-display text-lg font-semibold text-[#F5F6F8]">
                  Presença digital própria.
                </p>
                <p className="mt-1 text-xs text-[#969DA8]">
                  Landing page de captação de orçamentos + atendimento rápido via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
