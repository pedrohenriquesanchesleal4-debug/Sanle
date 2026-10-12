import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { hero } from "@/content/brand";
import { HeroFlow } from "./HeroFlow";
import { WordsReveal } from "./WordsReveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[68px]" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-70" aria-hidden="true" />
      <div className="shell relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <p className="eyebrow animate-fade-up">{hero.eyebrow}</p>

          <h1
            id="hero-title"
            className="mt-6 font-display font-medium leading-[0.95] tracking-tightest text-[clamp(2.6rem,7vw,5.6rem)]"
          >
            <span className="block animate-fade-up" style={{ animationDelay: "80ms" }}>
              {hero.headlineTop}
            </span>
            <span
              className="mt-1 block animate-fade-up text-cobalt"
              style={{ animationDelay: "200ms" }}
            >
              {hero.headlineBottom}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft animate-fade-up" style={{ animationDelay: "320ms" }}>
            {hero.subheadline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "420ms" }}>
            <Link href={hero.ctaPrimary.href} className="btn btn-primary">
              {hero.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={hero.ctaSecondary.href} className="btn btn-ghost">
              {hero.ctaSecondary.label}
            </Link>
          </div>

          <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute animate-fade-up" style={{ animationDelay: "520ms" }}>
            Diagnóstico inicial · sem compromisso de substituição de sistemas
          </p>
        </div>

        <div className="order-first lg:order-none lg:justify-self-end">
          <HeroFlow />
        </div>
      </div>

      <div className="shell pb-10">
        <a
          href="#problema"
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
        >
          <ArrowDown className="h-4 w-4" />
          <WordsReveal text="O trabalho que você não vê" />
        </a>
      </div>
    </section>
  );
}
