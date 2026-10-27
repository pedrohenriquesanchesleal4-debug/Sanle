"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/content/brand";

export function Solutions() {
  return (
    <section
      id="solucoes"
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="solutions-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#78A9FF]">
          <span>ARQUITETURA DE SOLUÇÕES</span>
        </div>

        <h2
          id="solutions-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#F5F6F8]"
        >
          Quatro pilares para tirar o atrito da rotina.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#969DA8] font-sans-editorial">
          Cada solução parte de um gargalo operacional delimitado e integra o que sua empresa já utiliza.
        </p>

        {/* Grade Assimétrica de Cards Editoriais */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {solutions.map((s, idx) => {
            // Layout assimétrico: 2 cards maiores (col-span-7 e col-span-5) e 2 balanceados
            const colSpan =
              idx === 0
                ? "md:col-span-7"
                : idx === 1
                ? "md:col-span-5"
                : idx === 2
                ? "md:col-span-5"
                : "md:col-span-7";

            return (
              <Link
                key={s.slug}
                href={`/solucoes/${s.slug}`}
                className={`group relative ${colSpan} p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 text-[#F5F6F8] flex flex-col justify-between transition-all duration-300 hover:border-[#78A9FF]/60 hover:bg-[#161a22] shadow-xl backdrop-blur-xl`}
              >
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-white/10 transition-colors">
                    <span className="font-mono text-sm font-bold text-[#78A9FF]">
                      [{s.code}]
                    </span>
                    <div className="h-9 w-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center transition-all duration-300 group-hover:border-[#2440FF] group-hover:bg-[#2440FF] group-hover:text-white group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-serif-editorial text-2xl md:text-3xl text-[#F5F6F8] group-hover:text-[#B7F36B] transition-colors leading-snug">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-sm md:text-base text-[#969DA8] transition-colors leading-relaxed font-sans-editorial">
                    {s.short}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#969DA8] transition-colors flex items-center justify-between">
                  <span>
                    INDICADO PARA: <strong className="text-[#F5F6F8]">{s.audience.split(",")[0]}</strong>
                  </span>
                  <span className="text-[#78A9FF] group-hover:translate-x-1 transition-transform font-bold">
                    EXPLORAR →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
