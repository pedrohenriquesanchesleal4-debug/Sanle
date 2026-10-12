import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { finalCta } from "@/content/brand";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="shell py-24 md:py-32">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">Próximo passo</p>
        <h2 className="mt-6 font-display text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] tracking-tightest">
          {finalCta.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">{finalCta.body}</p>
        <div className="mt-9 flex justify-center">
          <Link href="/diagnostico" className="btn btn-primary text-base">
            {finalCta.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
