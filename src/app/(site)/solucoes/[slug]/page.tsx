import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { solutions } from "@/content/brand";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) return { title: "Solução não encontrada — Sanle" };
  return {
    title: `${s.title} — Sanle`,
    description: s.short,
    alternates: { canonical: `/solucoes/${s.slug}` }
  };
}

export default async function SolucaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <article className="shell py-20 md:py-28">
      <Reveal>
        <Link href="/solucoes" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft hover:text-cobalt">
          ← Soluções
        </Link>
        <span className="mt-8 block font-mono text-[0.72rem] uppercase tracking-[0.18em] text-cobalt">
          Solução {s.code}
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] text-ink">
          {s.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{s.short}</p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <section>
            <h2 className="eyebrow">Para quem é indicada</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{s.audience}</p>

            <h2 className="eyebrow mt-10">Problema que resolve</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{s.problem}</p>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section>
            <h2 className="eyebrow">Como funciona</h2>
            <ol className="mt-4 space-y-3">
              {s.how.map((step, i) => (
                <li key={step} className="flex gap-3 text-ink-soft">
                  <span className="mt-0.5 font-mono text-[0.72rem] text-cobalt">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      </div>

      <Reveal>
        <section className="mt-16 rounded-2xl border border-[var(--rule)] bg-white p-8 md:p-10">
          <h2 className="eyebrow">O que pode ser entregue</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {s.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-ink-soft">
                <Check size={16} className="mt-1 shrink-0 text-cobalt" aria-hidden />
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-16">
          <h2 className="eyebrow">Perguntas frequentes</h2>
          <dl className="mt-6 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {s.faq.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-display text-lg text-ink">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal>
        <div className="mt-16 flex flex-wrap items-center gap-4">
          <Link href="/diagnostico" className="btn btn-primary">
            Mapear um processo <ArrowRight size={16} />
          </Link>
          <Link href="/solucoes" className="btn btn-ghost">
            Ver outras soluções
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
