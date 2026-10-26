"use client";

import { method } from "@/content/brand";

export function Method() {
  return (
    <section
      id="metodo"
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] overflow-hidden w-full max-w-full"
      aria-labelledby="method-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2440FF] font-semibold">
          <span>MÉTODO DE IMPLEMENTAÇÃO</span>
        </div>

        <h2
          id="method-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#121110]"
        >
          Começamos por um problema delimitado, não pela troca de tudo.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#4A453E] font-sans-editorial">
          Sem projetos faraônicos ou meses de paralisação. Entregamos valor rápido e mensurável em 4 etapas contínuas.
        </p>

        {/* Linha do Tempo: Horizontal no Desktop / Vertical no Mobile */}
        <div className="mt-16 relative">
          {/* Linha guia de fundo */}
          <div
            className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-[rgba(18,17,16,0.08)]"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {method.map((m, idx) => (
              <li
                key={m.step}
                className="p-6 md:p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] flex flex-col justify-between hover:border-[#2440FF]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)]">
                    <span className="font-mono text-sm font-bold text-[#2440FF]">
                      {m.step}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#059669] opacity-70 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-5 font-serif-editorial text-2xl text-[#121110] leading-snug">
                    {m.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                    {m.body}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(18,17,16,0.06)] font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8A837A]">
                  ETAPA 0{idx + 1} DE 04
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
