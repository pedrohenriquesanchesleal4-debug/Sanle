import { transformation } from "@/content/brand";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

function Column({
  tone,
  label,
  items
}: {
  tone: "before" | "after";
  label: string;
  items: readonly string[];
}) {
  const isAfter = tone === "after";
  return (
    <div className={`panel p-7 ${isAfter ? "border-cobalt/40" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span
          className={`font-mono text-[0.62rem] uppercase tracking-[0.16em] ${
            isAfter ? "text-cobalt" : "text-ink-mute"
          }`}
        >
          {isAfter ? "fluxo organizado" : "trabalho disperso"}
        </span>
      </div>
      <ul className="mt-6 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.95rem] leading-snug">
            <span
              aria-hidden="true"
              className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                isAfter ? "bg-cobalt" : "bg-ink-mute"
              }`}
            />
            <span className={isAfter ? "text-ink" : "text-ink-soft"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Transformation() {
  return (
    <section className="shell scroll-mt-24 py-20 md:py-28">
      <Reveal>
        <p className="eyebrow">A transformação</p>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight">
          Do trabalho invisível ao fluxo inteligente.
        </h2>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
        <Reveal>
          <Column tone="before" label={transformation.before.label} items={transformation.before.items} />
        </Reveal>
        <div className="hidden items-center justify-center md:flex">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--rule-strong)]">
            <ArrowRight className="h-5 w-5 text-cobalt" aria-hidden="true" />
          </span>
        </div>
        <Reveal delay={120}>
          <Column tone="after" label={transformation.after.label} items={transformation.after.items} />
        </Reveal>
      </div>

      <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
        Ilustrativo — representa o modelo de organização proposto, não um caso real.
      </p>
    </section>
  );
}
