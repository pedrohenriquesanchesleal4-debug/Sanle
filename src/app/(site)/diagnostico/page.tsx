import type { Metadata } from "next";
import { DiagnosticoForm } from "@/components/site/DiagnosticoForm";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Diagnóstico de Projeto & Processo — Sanle",
  description:
    "Descreva sua ideia de produto digital, sistema sob medida, agente de IA ou processo que precisa ser automatizado.",
  alternates: { canonical: "/diagnostico" }
};

export default function DiagnosticoPage() {
  return (
    <div className="shell pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Diagnóstico Técnico</p>
            <h1 className="mt-5 font-serif-editorial text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] text-ink">
              Comece descrevendo sua ideia ou gargalo operacional.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft font-sans-editorial">
              Compartilhe o contexto do seu projeto ou rotina manual — nossa engenharia analisa o cenário e retorna com um caminho técnico concreto.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 space-y-5 border-t border-[var(--rule)] pt-8 text-sm text-ink-soft">
              {[
                ["O que acontece depois", "A equipe analisa o cenário descrito e responde com uma avaliação arquitetural inicial."],
                ["O que não fazemos", "Não enviamos respostas robóticas genéricas, não inventamos prazos irreais e não compartilhamos seus dados."],
                ["Seus dados", "Coleta mínima, finalidade restrita ao atendimento e remoção sob solicitação — conforme boas práticas da LGPD."]
              ].map(([t, d]) => (
                <li key={t}>
                  <p className="font-medium text-ink">{t}</p>
                  <p className="mt-1 leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <DiagnosticoForm />
        </Reveal>
      </div>
    </div>
  );
}
