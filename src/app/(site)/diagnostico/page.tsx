import type { Metadata } from "next";
import { DiagnosticoForm } from "@/components/site/DiagnosticoForm";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Diagnóstico de processo — Sanle",
  description:
    "Descreva a tarefa manual que mais consome tempo na sua operação. A Sanle mapeia o processo e propõe um caminho para reduzi-lo.",
  alternates: { canonical: "/diagnostico" }
};

export default function DiagnosticoPage() {
  return (
    <div className="shell py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Diagnóstico</p>
            <h1 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.02] text-ink">
              Comece descrevendo um processo.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Não pedimos uma reunião antes de entender o problema. Descreva a tarefa manual — nós
              analisamos o fluxo e retornamos com um caminho concreto.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 space-y-5 border-t border-[var(--rule)] pt-8 text-sm text-ink-soft">
              {[
                ["O que acontece depois", "A equipe analisa o processo descrito e responde com um diagnóstico inicial."],
                ["O que não fazemos", "Não enviamos proposta automática, não inventamos prazos e não compartilhamos seus dados."],
                ["Seus dados", "Coleta mínima, finalidade restrita e remoção sob solicitação — conforme a LGPD."]
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
