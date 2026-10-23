"use client";

import { ArrowRight, Building2, AlertCircle, Layers, Zap } from "lucide-react";

interface IntelligenceSceneProps {
  /** Progresso local da Cena 05 [0..1] */
  progress: number;
  active: boolean;
}

const DIAGNOSIS_LAYERS = [
  {
    step: "01",
    chainLabel: "EMPRESA",
    icon: Building2,
    title: "Informações da empresa & presença digital",
    detail: "Vidraçaria Exemplo · Brasília, DF · 4,8 ★ (183 avaliações). Website não identificado nos dados consultados.",
    accent: "border-[#F5F6F8]/15 text-[#F5F6F8]"
  },
  {
    step: "02",
    chainLabel: "OPORTUNIDADE",
    icon: AlertCircle,
    title: "Lacuna de captação digital identificada",
    detail: "Clientes pesquisam no Google, encontram avaliações positivas, mas não dispõem de página rápida para solicitar orçamento.",
    accent: "border-[#78A9FF]/40 text-[#78A9FF]"
  },
  {
    step: "03",
    chainLabel: "SERVIÇO RECOMENDADO",
    icon: Layers,
    title: "Página de alta conversão + fluxo de atendimento",
    detail: "Argumento comercial: converter buscas locais em pedidos de orçamento organizados direto no WhatsApp da vidraçaria.",
    accent: "border-[#B7F36B]/45 text-[#B7F36B]"
  },
  {
    step: "04",
    chainLabel: "AÇÃO",
    icon: Zap,
    title: "Próxima ação sugerida",
    detail: "Gerar demonstração visual personalizada + iniciar primeiro contato consultivo via WhatsApp.",
    accent: "border-[#B7F36B]/60 text-[#B7F36B]"
  }
] as const;

/**
 * CENA 05 — UNDERSTAND THE OPPORTUNITY
 * O card da empresa se desdobra em camadas de diagnóstico conectadas:
 * EMPRESA -> OPORTUNIDADE -> SERVIÇO RECOMENDADO -> AÇÃO.
 */
export function IntelligenceScene({ progress, active }: IntelligenceSceneProps) {
  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#78A9FF]/35 bg-[#111318] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
            <span>05 · UNDERSTAND THE OPPORTUNITY</span>
          </div>

          <h2 className="mt-5 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
            Saiba por que vale a pena entrar em contato.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#969DA8] md:text-lg">
            Transforme informações públicas em um próximo passo comercial mais inteligente.
          </p>

          {/* Cadeia visual explícita: EMPRESA -> OPORTUNIDADE -> SERVIÇO RECOMENDADO -> AÇÃO */}
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#F5F6F8]/10 bg-[#111318]/90 p-3.5 font-mono text-[10px] uppercase tracking-[0.13em]">
            <span className="rounded bg-[#191C22] px-2 py-1 text-[#F5F6F8]">EMPRESA</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#78A9FF]" />
            <span className="rounded bg-[#78A9FF]/15 px-2 py-1 text-[#78A9FF]">OPORTUNIDADE</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#78A9FF]" />
            <span className="rounded bg-[#B7F36B]/15 px-2 py-1 text-[#B7F36B]">SERVIÇO RECOMENDADO</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#B7F36B]" />
            <span className="rounded bg-[#B7F36B] px-2 py-1 font-semibold text-[#08090C]">AÇÃO</span>
          </div>
        </div>

        {/* Camadas desdobradas progressivamente pelo scroll */}
        <div className="space-y-3 lg:col-span-7">
          {DIAGNOSIS_LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            const layerReveal = Math.max(0, Math.min(1, (progress - idx * 0.14) * 2.1));
            return (
              <div
                key={layer.step}
                className={`rounded-hunter border bg-[#191C22]/95 p-4 shadow-hunter-card backdrop-blur-md transition-all duration-200 ${layer.accent}`}
                style={{
                  opacity: 0.2 + layerReveal * 0.8,
                  transform: `translate3d(${(1 - layerReveal) * 24}px, ${(1 - layerReveal) * 10}px, 0)`
                }}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-current/25 bg-[#111318]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                      <span>
                        CAMADA {layer.step} · {layer.chainLabel}
                      </span>
                      <span className="text-[#969DA8]">DIAGNÓSTICO ILUSTRATIVO</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-semibold text-[#F5F6F8]">
                      {layer.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#969DA8] md:text-sm">
                      {layer.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
