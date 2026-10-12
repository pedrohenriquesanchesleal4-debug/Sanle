import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/content/brand";
import { Reveal } from "./Reveal";

export function Solutions() {
  return (
    <section id="solucoes" className="scroll-mt-24 border-y border-[var(--rule)] bg-paper-soft py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Soluções</p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight">
            Quatro linhas de atuação, um mesmo princípio: reduzir trabalho manual.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-2">
          {solutions.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60} className="bg-paper">
              <Link
                href={`/solucoes/${s.slug}`}
                className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors hover:bg-cobalt-soft/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-cobalt">{s.code}</span>
                    <ArrowUpRight className="h-5 w-5 text-ink-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.short}</p>
                </div>
                <p className="text-[0.8rem] text-ink-mute">
                  <span className="font-mono uppercase tracking-[0.12em]">Indicado para </span>
                  {s.audience.split(",")[0]}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
