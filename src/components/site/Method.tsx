import { method } from "@/content/brand";
import { Reveal } from "./Reveal";

export function Method() {
  return (
    <section id="como-funciona" className="shell scroll-mt-24 py-20 md:py-28">
      <Reveal>
        <p className="eyebrow">Como funciona</p>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight">
          Começamos por um problema delimitado, não pela troca de tudo.
        </h2>
      </Reveal>

      <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {method.map((m, i) => (
          <Reveal as="li" key={m.step} delay={i * 70}>
            <div className="flex h-full flex-col border-t-2 border-ink pt-5">
              <span className="font-mono text-sm text-cobalt">{m.step}</span>
              <h3 className="mt-4 font-display text-xl leading-tight tracking-tight">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
