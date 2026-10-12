import { invisibleWork } from "@/content/brand";
import { Reveal } from "./Reveal";

export function InvisibleWork() {
  return (
    <section id="problema" className="shell scroll-mt-24 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">O problema invisível</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight">
            Tarefas pequenas que somadas custam a operação inteira.
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Elas não aparecem no relatório. Não entram no orçamento. Ninguém as mede.
            Mas consomem tempo todos os dias e tornam cada processo lento de acompanhar.
          </p>
          <p className="mt-6 max-w-md text-sm text-ink-mute">
            A Sanle mapeia essas tarefas e transforma as repetitivas em fluxo rastreável.
          </p>
        </div>

        <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {invisibleWork.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 40} className="grid grid-cols-[auto_1fr] gap-5 py-6">
              <span className="font-mono text-xs text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-xl tracking-tight">{item.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
