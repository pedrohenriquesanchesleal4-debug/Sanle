"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/content/brand";

export function Solutions() {
  return (
    <section
      id="solucoes"
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#F2EEE6] text-[#0A0A09] border-b border-[rgba(10,10,9,0.12)]"
      aria-labelledby="solutions-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#FF5B1F]">
          <span>ARQUITETURA DE SOLUÇÕES</span>
        </div>

        <h2
          id="solutions-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#0A0A09]"
        >
          Quatro pilares para tirar o atrito da rotina.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#5A564F] font-sans-editorial">
          Cada solução parte de um gargalo operacional delimitado e integra o que sua empresa já utiliza.
        </p>

        {/* Grade Assimétrica de Cards Editoriais */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
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
                className={`group relative ${colSpan} p-8 md:p-10 rounded-[2px] bg-white border border-[rgba(10,10,9,0.14)] text-[#0A0A09] flex flex-col justify-between transition-all duration-300 hover:bg-[#0A0A09] hover:text-[#F2EEE6] hover:border-[#0A0A09] shadow-sm hover:shadow-2xl`}
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-[rgba(10,10,9,0.1)] group-hover:border-[rgba(242,238,230,0.12)] transition-colors">
                    <span className="font-mono text-sm font-bold text-[#FF5B1F]">
                      [{s.code}]
                    </span>
                    <div className="h-9 w-9 rounded-full border border-[rgba(10,10,9,0.15)] flex items-center justify-center transition-transform group-hover:border-[#FF5B1F] group-hover:bg-[#FF5B1F] group-hover:text-white group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-serif-editorial text-2xl md:text-3xl text-[#0A0A09] group-hover:text-[#F2EEE6] transition-colors leading-snug">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-sm md:text-base text-[#5A564F] group-hover:text-[#8F8A80] transition-colors leading-relaxed font-sans-editorial">
                    {s.short}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[rgba(10,10,9,0.08)] group-hover:border-[rgba(242,238,230,0.08)] font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#8F8A80] transition-colors flex items-center justify-between">
                  <span>
                    INDICADO PARA: <strong className="text-[#0A0A09] group-hover:text-[#F2EEE6]">{s.audience.split(",")[0]}</strong>
                  </span>
                  <span className="text-[#FF5B1F] group-hover:translate-x-1 transition-transform">
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
