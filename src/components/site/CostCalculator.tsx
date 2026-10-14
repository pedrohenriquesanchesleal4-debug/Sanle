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

    // Despacha evento para preencher o formulário final
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
      className="relative scroll-mt-20 py-20 md:py-28 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)]"
      aria-labelledby="calc-title"
    >
      <div className="shell max-w-5xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2440FF] font-semibold">
          <Calculator className="h-4 w-4" />
          <span>SIMULAÇÃO DE IMPACTO OPERACIONAL</span>
        </div>

        <h2
          id="calc-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[0.98] text-[#121110]"
        >
          Quanto custa o trabalho invisível na sua empresa?
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#4A453E] font-sans-editorial">
          Informe os números reais da sua equipe para calcular as horas e o impacto financeiro
          drenados por rotinas manuais todos os meses.
        </p>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <div className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-md space-y-6">
            <div>
              <label
                htmlFor="calc-team"
                className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium"
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
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] font-mono text-base focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="calc-hours"
                className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium"
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
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] font-mono text-base focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="calc-rate"
                className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium"
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
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] font-mono text-base focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
              />
            </div>

            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8A837A]">
              * Considera média padrão de 22 dias úteis mensais.
            </p>
          </div>

          {/* Resultado */}
          <div className="p-8 md:p-10 rounded-2xl bg-[#F5F2EB] border border-[rgba(18,17,16,0.08)] flex flex-col justify-between min-h-[380px]">
            <div>
              <span className="inline-block px-3 py-1 bg-white border border-[rgba(18,17,16,0.08)] rounded-full font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#4A453E] font-medium">
                Estimativa com os números que você informou
              </span>

              <div className="mt-8">
                <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#4A453E]">
                  Horas mensais consumidas
                </span>
                <div className="font-serif-editorial text-[clamp(3rem,6vw,5.5rem)] leading-none text-[#121110] mt-2">
                  {monthlyHours > 0 ? monthlyHours : "0"}
                  {monthlyHours > 0 && <span className="text-xl font-mono text-[#4A453E] ml-2">h/mês</span>}
                </div>
              </div>

              {monthlyCost !== null && (
                <div className="mt-8 pt-6 border-t border-[rgba(18,17,16,0.08)]">
                  <span className="block font-mono text-xs uppercase tracking-[0.16em] text-[#4A453E]">
                    Custo financeiro estimado
                  </span>
                  <div className="font-serif-editorial text-[clamp(2.5rem,5vw,4.2rem)] leading-none text-[#2440FF] mt-2">
                    R$ {monthlyCost.toLocaleString("pt-BR")}
                    <span className="text-lg font-mono text-[#4A453E] ml-2">/mês</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handleCta}
                disabled={monthlyHours === 0}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#121110] text-white font-medium text-sm transition-all hover:bg-[#2440FF] shadow-md shadow-stone-900/10 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99]"
              >
                <span>Quero reduzir isso</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
