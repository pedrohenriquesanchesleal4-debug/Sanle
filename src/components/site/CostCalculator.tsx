"use client";

import { useState } from "react";
import { ArrowRight, Calculator, Sparkles, ArrowDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CostCalculator() {
  const [teamSize, setTeamSize] = useState<string>("5");
  const [hoursPerDay, setHoursPerDay] = useState<string>("2.5");
  const [hourlyRate, setHourlyRate] = useState<string>("45");
  const [hasCalculated, setHasCalculated] = useState(false);

  const peopleNum = parseFloat(teamSize) || 0;
  const hoursNum = parseFloat(hoursPerDay) || 0;
  const rateNum = parseFloat(hourlyRate) || 0;

  const monthlyHours = peopleNum > 0 && hoursNum > 0 ? Math.round(peopleNum * hoursNum * 22) : 0;
  const monthlyCost = monthlyHours > 0 && rateNum > 0 ? Math.round(monthlyHours * rateNum) : null;

  const applyPreset = (people: number, hours: number, rate: number) => {
    setTeamSize(people.toString());
    setHoursPerDay(hours.toString());
    setHourlyRate(rate.toString());
    setHasCalculated(true);
    trackEvent("calculadora_usada", {
      preset: `${people}p_${hours}h`,
      pessoas: people,
      horasPorDia: hours,
      valorHora: rate,
      horasMensais: Math.round(people * hours * 22),
      custoMensal: Math.round(people * hours * 22 * rate)
    });
  };

  const handleCalculateOrChange = () => {
    if (!hasCalculated && (peopleNum > 0 || hoursNum > 0)) {
      setHasCalculated(true);
      trackEvent("calculadora_usada", {
        pessoas: peopleNum,
        horasPorDia: hoursNum,
        valorHora: rateNum,
        horasMensais: monthlyHours,
        custoMensal: monthlyCost
      });
    }
  };

  const handleCta = () => {
    trackEvent("cta_clicado", {
      cta: "quero_reduzir_isso_calculadora",
      horasMensais: monthlyHours,
      custoMensal: monthlyCost
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("sanle:prefill-inbound", {
          detail: {
            dorTexto: `Estimativa calculada: ${peopleNum} pessoas perdendo ~${monthlyHours}h/mês em trabalho manual repetitivo${
              monthlyCost ? ` (custo estimado: R$ ${monthlyCost.toLocaleString("pt-BR")}/mês)` : ""
            }.`
          }
        })
      );

      const target = document.getElementById("diagnostico-inbound");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="calculadora"
      className="relative scroll-mt-20 border-b border-white/[0.06] bg-[#08090C] py-10 sm:py-16 md:py-24 text-[#F5F6F8] overflow-hidden w-full max-w-full select-none"
      aria-labelledby="calc-title"
    >
      {/* Luz ambiente volumétrica de profundidade */}
      <div 
        className="pointer-events-none absolute top-1/4 right-0 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(36,64,255,0.08)_0%,transparent_70%)] blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="shell max-w-5xl relative z-10 px-4 sm:px-6 md:px-8 mx-auto">
        {/* Cabeçalho do Clímax da Investigação Forense */}
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#78A9FF]">
          <Calculator className="h-4 w-4 text-[#B7F36B]" />
          <span>CLÍMAX DA INVESTIGAÇÃO FORENSE · IMPACTO FINANCEIRO</span>
        </div>

        <h2
          id="calc-title"
          className="mt-4 font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-[#F5F6F8]"
        >
          Quanto o custo invisível tira da sua empresa todos os meses?
        </h2>

        <p className="mt-4 max-w-2xl text-base text-[#969DA8] md:text-lg">
          Após mapear os 7 gargalos, informe os números reais da sua equipe. A fórmula baseia-se na média nacional de 22 dias úteis mensais.
        </p>

        {/* Presets Rápidos com 1 Toque */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#969DA8] mr-1">
            Simulações rápidas:
          </span>
          <button
            type="button"
            onClick={() => applyPreset(3, 2, 40)}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] font-mono text-xs text-[#F5F6F8] transition-all"
          >
            Pequena Operação (3 pessoas · 2h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(6, 2.5, 45)}
            className="px-3 py-1.5 rounded-full bg-[#2440FF]/20 hover:bg-[#2440FF]/30 border border-[#2440FF]/40 font-mono text-xs text-white transition-all font-semibold"
          >
            Média Operação (6 pessoas · 2.5h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(12, 3, 50)}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] font-mono text-xs text-[#F5F6F8] transition-all"
          >
            Operação Robusta (12 pessoas · 3h)
          </button>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
          {/* Painel de Entradas */}
          <div className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 shadow-xl">
            <div>
              <label
                htmlFor="calc-team"
                className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#969DA8]"
              >
                Número de pessoas na equipe que operam rotinas manuais
              </label>
              <input
                id="calc-team"
                type="number"
                min="1"
                placeholder="Ex: 5"
                value={teamSize}
                onChange={(e) => {
                  setTeamSize(e.target.value);
                  handleCalculateOrChange();
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#191C22] px-4 py-3 font-mono text-base text-[#F5F6F8] placeholder:text-[#969DA8]/45 focus:border-[#78A9FF] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="calc-hours"
                className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#969DA8]"
              >
                Horas por dia em tarefas repetitivas (por pessoa)
              </label>
              <input
                id="calc-hours"
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                placeholder="Ex: 2.5"
                value={hoursPerDay}
                onChange={(e) => {
                  setHoursPerDay(e.target.value);
                  handleCalculateOrChange();
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#191C22] px-4 py-3 font-mono text-base text-[#F5F6F8] placeholder:text-[#969DA8]/45 focus:border-[#78A9FF] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="calc-rate"
                className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#969DA8]"
              >
                Custo médio da hora de trabalho (R$, base salarial + encargos)
              </label>
              <input
                id="calc-rate"
                type="number"
                min="1"
                placeholder="Ex: 45"
                value={hourlyRate}
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                  handleCalculateOrChange();
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#191C22] px-4 py-3 font-mono text-base text-[#F5F6F8] placeholder:text-[#969DA8]/45 focus:border-[#78A9FF] focus:outline-none"
              />
            </div>

            <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#969DA8]">
              * Premissa auditada: 22 dias úteis de faturamento e operação mensal.
            </p>
          </div>

          {/* Painel de Resultados */}
          <div className="flex min-h-[380px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 md:p-10 shadow-2xl">
            <div>
              <span className="inline-block rounded-full border border-white/[0.1] bg-[#191C22] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#969DA8]">
                Estimativa calculada em tempo real
              </span>

              <div className="mt-8">
                <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                  Horas úteis drenadas por mês
                </span>
                <div className="mt-2 font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-none text-[#F5F6F8]">
                  {monthlyHours > 0 ? monthlyHours : "0"}
                  {monthlyHours > 0 && <span className="ml-2 font-mono text-xl text-[#969DA8]">h/mês</span>}
                </div>
              </div>

              {monthlyCost !== null && (
                <div className="mt-8 border-t border-white/[0.08] pt-6">
                  <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                    Custo financeiro invisível desperdiçado
                  </span>
                  <div className="mt-2 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-semibold leading-none text-[#B7F36B]">
                    R$ {monthlyCost.toLocaleString("pt-BR")}
                    <span className="ml-2 font-mono text-lg text-[#969DA8]">/mês</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handleCta}
                disabled={monthlyHours === 0}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#B7F36B] px-6 py-4 text-sm font-semibold text-[#08090C] transition-all hover:bg-[#c8f789] disabled:pointer-events-none disabled:opacity-40 shadow-lg shadow-[#B7F36B]/20"
              >
                <span>Quero converter essas horas em oportunidade</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TRANSIÇÃO 2 ➔ 3: O SISTEMA SE REORGANIZA (DO ATRITO AO FLUXO)
            (Ponte narrativa entre Investigação Forense e a Demonstração de Fluxo)
           ========================================================================= */}
        <div className="mt-12 sm:mt-16 pt-10 border-t border-white/[0.08]">
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#111318] to-[#151922] border border-white/[0.1] relative overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>TRANSIÇÃO 2 ➔ 3 · REORGANIZAÇÃO DO SISTEMA</span>
                </div>

                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-stone-100 leading-tight">
                  Identificado o atrito, os caminhos redundantes são eliminados.
                </h3>

                <p className="text-sm text-stone-300 font-sans-editorial leading-relaxed max-w-xl">
                  Os nós da arquitetura Sanle assumem o controle: os desvios desaparecem, as regras fiscais sincronizam instantaneamente com o ERP e a operação entra no terceiro ambiente: <strong>Do Atrito ao Fluxo</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href="#transformacao"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-[#08090C] font-semibold text-xs uppercase tracking-wider hover:bg-stone-200 transition-all shadow-md"
                >
                  <span>Ver contraste de transformação</span>
                  <ArrowDown className="h-3.5 w-3.5 text-[#2440FF]" />
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1] font-mono text-xs transition-all"
                >
                  <span>Ver demonstração em 6 etapas</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
