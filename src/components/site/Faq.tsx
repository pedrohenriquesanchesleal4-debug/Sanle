import { faqs } from "@/content/brand";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section className="shell py-20 md:py-24">
      <Reveal>
        <p className="eyebrow">Perguntas frequentes</p>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.05] tracking-tight">
          Dúvidas antes de conversar.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-x-12 gap-y-2 md:grid-cols-2">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 40}>
            <details className="group border-b border-[var(--rule)] py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="font-display text-lg tracking-tight">{f.q}</h3>
                <span className="font-mono text-xl text-cobalt transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
