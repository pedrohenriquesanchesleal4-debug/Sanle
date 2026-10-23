"use client";

import { Search, MapPin, Compass, CheckCircle2 } from "lucide-react";

interface SearchSceneProps {
  /** Progresso local da Cena 03 [0..1] */
  progress: number;
  active: boolean;
}

const DEMO_SEARCH_RESULTS = [
  {
    name: "Vidraçaria Exemplo",
    district: "SIA Trecho 3 · Brasília, DF",
    rating: "4,8 ★ (183 avaliações)",
    websiteStatus: "Website não identificado nos dados consultados",
    priority: true
  },
  {
    name: "Cristal & Esquadrias Planalto (Demo)",
    district: "Asa Norte · Brasília, DF",
    rating: "4,6 ★ (94 avaliações)",
    websiteStatus: "Presença digital parcial",
    priority: false
  },
  {
    name: "Brasília Temperados & Box (Demo)",
    district: "Taguatinga Sul · Brasília, DF",
    rating: "4,7 ★ (112 avaliações)",
    websiteStatus: "Sem canal de orçamento online identificado",
    priority: false
  },
  {
    name: "Ateliê do Vidro Arquitetural (Demo)",
    district: "Sudoeste · Brasília, DF",
    rating: "4,5 ★ (67 avaliações)",
    websiteStatus: "Website ativo identificado",
    priority: false
  }
] as const;

/**
 * CENA 03 — FIND THE SIGNAL
 * A rede de pontos se reorganiza e faz emergir a interface de busca do Sales Hunter.
 * Usa dados sintéticos explicitamente identificados como demonstração (Zero chamadas reais ao Google Places).
 */
export function SearchScene({ progress, active }: SearchSceneProps) {
  const resultsReveal = Math.max(0, Math.min(1, (progress - 0.22) * 1.6));

  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-12">
        {/* Coluna narrativa */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#78A9FF]/30 bg-[#111318]/90 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
            <Compass className="h-3.5 w-3.5" />
            <span>03 · FIND THE SIGNAL</span>
          </div>

          <h2 className="mt-5 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
            Da malha dispersa para uma busca precisa.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#969DA8] md:text-lg">
            Os pontos da cena anterior se reorganizam nos parâmetros da sua pesquisa. Você escolhe o nicho e a região; o motor localiza candidatos e analisa seus sinais públicos.
          </p>

          <div className="mt-6 rounded-xl border border-[#F5F6F8]/10 bg-[#111318]/80 p-3.5 font-mono text-[11px] text-[#969DA8]">
            <span className="text-[#B7F36B]">MODO DEMONSTRAÇÃO:</span> Simulação interativa com dados sintéticos ilustrativos. Nenhuma chamada automática ao Google Places é disparada na landing page.
          </div>
        </div>

        {/* Interface de pesquisa que emerge da composição */}
        <div className="lg:col-span-7">
          <div
            className="rounded-hunter-lg border border-[#78A9FF]/35 bg-[#191C22]/95 p-5 shadow-hunter-card backdrop-blur-xl md:p-6"
            style={{
              transform: `translate3d(0, ${(1 - Math.min(1, progress * 1.8)) * 24}px, 0)`
            }}
          >
            {/* Barra de busca demonstrativa */}
            <div className="grid gap-3 md:grid-cols-12">
              <div className="rounded-xl border border-[#F5F6F8]/12 bg-[#111318] px-4 py-3 md:col-span-5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  Nicho
                </span>
                <div className="mt-1 flex items-center gap-2 font-medium text-[#F5F6F8]">
                  <Search className="h-4 w-4 text-[#78A9FF]" />
                  <span>Vidraçarias</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#F5F6F8]/12 bg-[#111318] px-4 py-3 md:col-span-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  Localização
                </span>
                <div className="mt-1 flex items-center gap-2 font-medium text-[#F5F6F8]">
                  <MapPin className="h-4 w-4 text-[#78A9FF]" />
                  <span>Brasília, DF</span>
                </div>
              </div>

              <div className="flex items-stretch md:col-span-3">
                <div className="flex w-full items-center justify-center rounded-xl bg-[#B7F36B] px-4 py-3 text-center font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#08090C] shadow-[0_0_24px_rgba(183,243,107,0.3)]">
                  Encontrar oportunidades
                </div>
              </div>
            </div>

            {/* Resultados emergindo progressivamente com o scroll */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                <span>Resultados emergindo da região (Demonstração)</span>
                <span className="text-[#78A9FF]">4 estabelecimentos analisados</span>
              </div>

              {DEMO_SEARCH_RESULTS.map((item, idx) => {
                const itemVis = Math.max(0, Math.min(1, (resultsReveal - idx * 0.16) * 2.2));
                return (
                  <div
                    key={item.name}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                      item.priority
                        ? "border-[#B7F36B]/50 bg-[#111318] shadow-[0_0_25px_rgba(183,243,107,0.12)]"
                        : "border-[#F5F6F8]/8 bg-[#111318]/65"
                    }`}
                    style={{
                      opacity: 0.15 + itemVis * 0.85,
                      transform: `translate3d(0, ${(1 - itemVis) * 14}px, 0)`
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#F5F6F8]">{item.name}</span>
                        {item.priority && (
                          <span className="rounded-full bg-[#B7F36B]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#B7F36B]">
                            Oportunidade detectada
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#969DA8]">
                        {item.district} · {item.rating}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#969DA8]">
                      <CheckCircle2
                        className={`h-4 w-4 ${item.priority ? "text-[#B7F36B]" : "text-[#78A9FF]/60"}`}
                      />
                      <span>{item.websiteStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
