"use client";

import { Columns3 } from "lucide-react";

interface PipelineSceneProps {
  /** Progresso local da Cena 07 [0..1] */
  progress: number;
  active: boolean;
}

const PIPELINE_COLUMNS = [
  {
    id: "novo",
    label: "Novo lead",
    cards: [{ name: " Serralheria & Box Sul (Demo)", tag: "Aguardando análise", highlight: false }]
  },
  {
    id: "contato",
    label: "Primeiro contato",
    cards: [{ name: "Esquadrias Alvorada (Demo)", tag: "Mensagem enviada", highlight: false }]
  },
  {
    id: "respondeu",
    label: "Respondeu",
    cards: [{ name: "Vidraçaria Exemplo", tag: "Oportunidade: Presença digital", highlight: true }]
  },
  {
    id: "reuniao",
    label: "Reunião",
    cards: [{ name: "Clínica Odonto Eixo (Demo)", tag: "Diagnóstico quinta 14h", highlight: false }]
  },
  {
    id: "proposta",
    label: "Proposta",
    cards: [{ name: "Oficina Técnica BSB (Demo)", tag: "Escopo em avaliação", highlight: false }]
  },
  {
    id: "cliente",
    label: "Cliente",
    cards: [{ name: "Contábil Planalto (Demo)", tag: "Projeto implantado", highlight: false }]
  }
] as const;

/**
 * CENA 07 — BUILD THE RELATIONSHIP
 * A mensagem se transforma em um cartão de lead e ingressa em um pipeline Kanban
 * de 6 etapas (Novo lead, Primeiro contato, Respondeu, Reunião, Proposta, Cliente).
 */
export function PipelineScene({ progress, active }: PipelineSceneProps) {
  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="shell relative z-10 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#78A9FF]/35 bg-[#111318] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
            <Columns3 className="h-3.5 w-3.5" />
            <span>07 · BUILD THE RELATIONSHIP</span>
          </div>

          <h2 className="mt-4 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
            Da primeira busca ao relacionamento comercial.
          </h2>

          <p className="mt-3 text-base leading-relaxed text-[#969DA8]">
            Organização clara de cada conversa: alguns leads avançam, outros aguardam retorno com lembretes definidos — sem promessas irreais e sem oportunidades esquecidas.
          </p>
        </div>

        {/* Quadro de pipeline de 6 etapas coreografado */}
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {PIPELINE_COLUMNS.map((col, idx) => {
            const colReveal = Math.max(0, Math.min(1, (progress - idx * 0.08) * 2.2));
            return (
              <div
                key={col.id}
                className="rounded-hunter border border-[#F5F6F8]/10 bg-[#111318]/90 p-3.5 backdrop-blur-md transition-transform duration-200"
                style={{
                  opacity: 0.25 + colReveal * 0.75,
                  transform: `translate3d(0, ${(1 - colReveal) * 18}px, 0)`
                }}
              >
                <div className="flex items-center justify-between border-b border-[#F5F6F8]/8 pb-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-[#191C22] px-2 py-0.5 font-mono text-[10px] text-[#F5F6F8]">
                    {col.cards.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {col.cards.map((card) => (
                    <div
                      key={card.name}
                      className={`rounded-xl border p-3 transition-all ${
                        card.highlight
                          ? "border-[#B7F36B]/60 bg-[#191C22] shadow-[0_0_24px_rgba(183,243,107,0.18)]"
                          : "border-[#F5F6F8]/8 bg-[#191C22]/70"
                      }`}
                    >
                      {card.highlight && (
                        <span className="mb-1.5 inline-block rounded bg-[#B7F36B]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#B7F36B]">
                          Lead em foco
                        </span>
                      )}
                      <p className="text-xs font-semibold text-[#F5F6F8]">{card.name}</p>
                      <p className="mt-1 text-[11px] text-[#969DA8]">{card.tag}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
