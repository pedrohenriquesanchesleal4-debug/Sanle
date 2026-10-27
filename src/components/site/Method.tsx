"use client";

import { method } from "@/content/brand";

export function Method() {
  return (
    <section
      id="metodo"
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="method-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#78A9FF] font-semibold">
          <span>MÉTODO DE IMPLEMENTAÇÃO</span>
        </div>

        <h2
          id="method-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#F5F6F8]"
        >
          Começamos por um problema delimitado, não pela troca de tudo.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#969DA8] font-sans-editorial">
          Sem projetos faraônicos ou meses de paralisação. Entregamos valor rápido e mensurável em 4 etapas contínuas.
        </p>

        {/* Linha do Tempo: Horizontal no Desktop / Vertical no Mobile */}
        <div className="mt-12 sm:mt-14 relative">
          {/* Linha guia de fundo */}
          <div
            className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-white/10"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {method.map((m, idx) => (
              <li
                key={m.step}
                className="p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 flex flex-col justify-between hover:border-[#78A9FF]/60 hover:bg-[#161a22] transition-all group shadow-xl backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="font-mono text-sm font-bold text-[#78A9FF]">
                      {m.step}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#B7F36B] shadow-[0_0_8px_#B7F36B] opacity-80 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-5 font-serif-editorial text-2xl text-[#F5F6F8] leading-snug">
                    {m.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                    {m.body}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#969DA8]">
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
