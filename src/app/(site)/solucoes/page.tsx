import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { FinalCta } from "@/components/site/FinalCta";
import { solutions } from "@/content/brand";

export const metadata: Metadata = {
  title: "Soluções — Sanle",
  description:
    "Automação documental e financeira, integração de sistemas, inteligência artificial aplicada e organização da operação comercial.",
  alternates: { canonical: "/solucoes" }
};

export default function SolucoesPage() {
  return (
    <>
      <header className="shell py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Soluções</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] text-ink">
            Quatro frentes para tirar trabalho manual da operação.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Cada frente começa por um problema delimitado. Não vendemos pacotes fechados: desenhamos a
            solução a partir do processo que está custando tempo.
          </p>
        </Reveal>
      </header>

      <section className="shell pb-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-2">
          {solutions.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link
                href={`/solucoes/${s.slug}`}
                className="group flex h-full flex-col justify-between bg-paper p-8 transition hover:bg-white"
              >
                <div>
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-cobalt">
                    {s.code}
                  </span>
                  <h2 className="mt-4 font-display text-2xl text-ink">{s.title}</h2>
                  <p className="mt-3 text-ink-soft">{s.short}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition group-hover:text-cobalt">
                  Ver detalhes <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
