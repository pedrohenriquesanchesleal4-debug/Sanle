"use client";

import { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CostCalculator() {
  const [teamSize, setTeamSize] = useState<string>("5");
  const [hoursPerDay, setHoursPerDay] = useState<string>("2");
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
            dorTexto: `Simulação operacional: equipe de ${peopleNum} pessoas dedicando ~${monthlyHours}h/mês em rotinas manuais repetitivas${
              monthlyCost ? ` (custo operacional estimado em R$ ${monthlyCost.toLocaleString("pt-BR")}/mês)` : ""
            }.`
          }
        })
      );

      const target = document.getElementById("contato");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="calculadora"
      className="relative scroll-mt-20 border-b border-white/[0.06] bg-[#08090C] py-16 sm:py-20 md:py-24 text-[#F5F6F8] overflow-hidden w-full max-w-full"
      aria-labelledby="calc-title"
    >
      <div 
        className="pointer-events-none absolute top-1/4 right-0 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(36,64,255,0.08)_0%,transparent_70%)] blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="shell max-w-5xl relative z-10 px-4 sm:px-6 md:px-8 mx-auto">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#78A9FF]">
          <Calculator className="h-4 w-4 text-[#B7F36B]" />
          <span>SIMULADOR DE IMPACTO OPERACIONAL · ESTIMATIVA ILUSTRATIVA</span>
        </div>

        <h2
          id="calc-title"
          className="mt-4 font-serif-editorial text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.03] tracking-[-0.03em] text-[#F5F6F8]"
        >
          Quanto o trabalho manual repetitivo custa para a sua operação?
        </h2>

        <p className="mt-4 max-w-2xl text-base text-[#969DA8] md:text-lg font-sans-editorial leading-relaxed">
          Simule o volume de horas e o custo operacional dedicado a tarefas que poderiam ser apoiadas por sistemas sob medida ou automações.
        </p>

        {/* Presets Rápidos */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#969DA8] mr-1">
            Cenários de referência:
          </span>
          <button
            type="button"
            onClick={() => applyPreset(3, 1.5, 40)}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] font-mono text-xs text-[#F5F6F8] transition-all cursor-pointer"
          >
            Equipe Enxuta (3 pessoas · 1.5h/dia)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(5, 2, 45)}
            className="px-3 py-1.5 rounded-full bg-[#2440FF]/20 hover:bg-[#2440FF]/30 border border-[#2440FF]/40 font-mono text-xs text-white transition-all font-semibold cursor-pointer"
          >
            Operação em Expansão (5 pessoas · 2h/dia)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(10, 2.5, 50)}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] font-mono text-xs text-[#F5F6F8] transition-all cursor-pointer"
          >
            Operação Estruturada (10 pessoas · 2.5h/dia)
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
                Pessoas envolvidas em rotinas manuais repetitivas
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
                Horas por dia dedicadas a retrabalho ou conferência (por pessoa)
              </label>
              <input
                id="calc-hours"
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                placeholder="Ex: 2"
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
                Custo médio estimado da hora de trabalho (R$)
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

            <p className="font-mono text-[0.62rem] leading-relaxed text-[#969DA8]">
              * Estimativa ilustrativa calculada diretamente a partir dos parâmetros informados pelo usuário (considerando 22 dias úteis por mês).
            </p>
          </div>

          {/* Painel de Resultados */}
          <div className="flex min-h-[380px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 md:p-10 shadow-2xl">
            <div>
              <span className="inline-block rounded-full border border-white/[0.1] bg-[#191C22] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#969DA8]">
                Cálculo ilustrativo em tempo real
              </span>

              <div className="mt-8">
                <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                  Horas operacionais consumidas por mês
                </span>
                <div className="mt-2 font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-none text-[#F5F6F8]">
                  {monthlyHours > 0 ? monthlyHours : "0"}
                  {monthlyHours > 0 && <span className="ml-2 font-mono text-xl text-[#969DA8]">h/mês</span>}
                </div>
              </div>

              {monthlyCost !== null && (
                <div className="mt-8 border-t border-white/[0.08] pt-6">
                  <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                    Custo mensal estimado dessas horas
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
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#B7F36B] px-6 py-4 text-sm font-semibold text-[#08090C] transition-all hover:bg-[#c8f789] disabled:pointer-events-none disabled:opacity-40 shadow-lg shadow-[#B7F36B]/20 cursor-pointer"
              >
                <span>Avaliar automação para este cenário</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
