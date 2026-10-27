import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { FinalCta } from "@/components/site/FinalCta";
import { solutions } from "@/content/brand";

export const metadata: Metadata = {
  title: "Soluções — Sanle",
  description:
    "Produtos digitais, sistemas sob medida, agentes de inteligência artificial e automação operacional para empresas.",
  alternates: { canonical: "/solucoes" }
};

export default function SolucoesPage() {
  return (
    <>
      <header className="shell pt-28 pb-16 md:pt-36 md:pb-20">
        <Reveal>
          <p className="eyebrow">Catálogo de Engenharia</p>
          <h1 className="mt-5 max-w-3xl font-serif-editorial text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] text-ink">
            Quatro frentes para tirar boas ideias do papel e organizar sua operação.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft font-sans-editorial">
            Cada frente começa por um escopo delimitado. Projetamos sites, sistemas, agentes de IA e automações a partir da necessidade real do seu negócio.
          </p>
        </Reveal>
      </header>

      <section className="shell pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {solutions.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link
                href={`/solucoes/${s.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#111319]/90 p-8 transition hover:border-[#78A9FF]/50 hover:bg-[#151822]"
              >
                <div>
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#78A9FF]">
                    FRENTE {s.code}
                  </span>
                  <h2 className="mt-4 font-serif-editorial text-2xl text-ink">{s.title}</h2>
                  <p className="mt-3 text-ink-soft font-sans-editorial leading-relaxed">{s.short}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF] transition group-hover:text-white">
                  Ver escopo e entregas <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
