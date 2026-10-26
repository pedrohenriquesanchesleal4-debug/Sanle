"use client";

import { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CostCalculator() {
  const [teamSize, setTeamSize] = useState<string>("");
  const [hoursPerDay, setHoursPerDay] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const peopleNum = parseFloat(teamSize) || 0;
  const hoursNum = parseFloat(hoursPerDay) || 0;
  const rateNum = parseFloat(hourlyRate) || 0;

  const monthlyHours = peopleNum > 0 && hoursNum > 0 ? Math.round(peopleNum * hoursNum * 22) : 0;
  const monthlyCost = monthlyHours > 0 && rateNum > 0 ? Math.round(monthlyHours * rateNum) : null;

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
      className="relative scroll-mt-20 border-b border-white/[0.06] bg-[#08090C] py-10 sm:py-16 md:py-24 text-[#F5F6F8] overflow-hidden w-full max-w-full"
      aria-labelledby="calc-title"
    >
      <div className="shell max-w-5xl">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#78A9FF]">
          <Calculator className="h-4 w-4 text-[#B7F36B]" />
          <span>SIMULAÇÃO DE IMPACTO OPERACIONAL</span>
        </div>

        <h2
          id="calc-title"
          className="mt-4 font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-[#F5F6F8]"
        >
          Quanto custa o trabalho invisível na sua empresa?
        </h2>

        <p className="mt-4 max-w-2xl text-base text-[#969DA8] md:text-lg">
          Informe os números reais da sua equipe para estimar as horas e o impacto financeiro
          drenados por rotinas manuais todos os meses.
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#111318] p-8">
            <div>
              <label
                htmlFor="calc-team"
                className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#969DA8]"
              >
                Número de pessoas na equipe
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
                Custo médio da hora de trabalho (R$, opcional)
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
              * Considera média padrão de 22 dias úteis mensais.
            </p>
          </div>

          <div className="flex min-h-[380px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111318] p-8 md:p-10">
            <div>
              <span className="inline-block rounded-full border border-white/[0.1] bg-[#191C22] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#969DA8]">
                Estimativa com os números informados
              </span>

              <div className="mt-8">
                <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                  Horas mensais consumidas
                </span>
                <div className="mt-2 font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-none text-[#F5F6F8]">
                  {monthlyHours > 0 ? monthlyHours : "0"}
                  {monthlyHours > 0 && <span className="ml-2 font-mono text-xl text-[#969DA8]">h/mês</span>}
                </div>
              </div>

              {monthlyCost !== null && (
                <div className="mt-8 border-t border-white/[0.08] pt-6">
                  <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]">
                    Custo financeiro estimado
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
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#B7F36B] px-6 py-4 text-sm font-semibold text-[#08090C] transition-all hover:bg-[#c8f789] disabled:pointer-events-none disabled:opacity-40"
              >
                <span>Quero converter essas horas em oportunidade</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
