import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Method } from "@/components/site/Method";
import { FinalCta } from "@/components/site/FinalCta";
import { brand, segments } from "@/content/brand";

export const metadata: Metadata = {
  title: "Sobre — Sanle",
  description:
    "A Sanle identifica gargalos operacionais e cria soluções para reduzir trabalho manual, organizar informações e melhorar processos.",
  alternates: { canonical: "/sobre" }
};

export default function SobrePage() {
  return (
    <>
      <header className="shell py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Sobre</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] text-ink">
            Automação a partir do processo que existe hoje.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{brand.positioning}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <section>
              <h2 className="eyebrow">No que acreditamos</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
                <p>
                  A maior parte do trabalho perdido numa empresa não está nas decisões — está nas tarefas
                  repetitivas que ninguém mede. Procurar documento, copiar dado, cobrar resposta, conferir
                  planilha.
                </p>
                <p>
                  A Sanle começa por essa camada invisível. Mapeamos o fluxo real, delimitamos um problema e
                  automatizamos o que consome tempo sem exigir que a empresa troque tudo.
                </p>
                <p>
                  Não vendemos tecnologia pela tecnologia. Medimos o antes e o depois, e mantemos revisão
                  humana onde a decisão importa.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.08}>
            <section>
              <h2 className="eyebrow">O que fazemos — e o que não fazemos</h2>
              <ul className="mt-5 space-y-4 text-ink-soft">
                <li>
                  <strong className="text-ink">Fazemos:</strong> automação documental e financeira, integração
                  de sistemas, IA aplicada e organização da operação comercial.
                </li>
                <li>
                  <strong className="text-ink">Não somos:</strong> uma software house genérica nem uma agência
                  de sites. Não substituímos o sistema financeiro do cliente.
                </li>
                <li>
                  <strong className="text-ink">Não fazemos:</strong> scraping de diretórios ou redes sociais,
                  disparo em massa de mensagens e promessas de resultado sem medição.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </header>

      <section className="shell pb-4">
        <Reveal>
          <h2 className="eyebrow">Quem atendemos</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Foco inicial em {brand.serviceRegion}
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {segments.map((s) => (
              <li key={s} className="tag">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Method />

      <section className="shell py-16">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/diagnostico" className="btn btn-primary">
              Conversar sobre meu processo <ArrowRight size={16} />
            </Link>
            <Link href="/solucoes" className="btn btn-ghost">
              Ver soluções
            </Link>
          </div>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
