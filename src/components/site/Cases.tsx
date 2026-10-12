import { Reveal } from "./Reveal";
import { FlaskConical } from "lucide-react";

const FIELDS = [
  "Problema inicial",
  "Processo analisado",
  "Solução implementada",
  "Tempo antes e depois",
  "Indicadores medidos",
  "Limitações encontradas",
  "Depoimento autorizado",
  "Data e contexto"
] as const;

export function Cases() {
  return (
    <section id="aplicacoes" className="shell scroll-mt-24 py-20 md:py-28">
      <Reveal>
        <p className="eyebrow">Casos e provas</p>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight">
          Publicamos resultados apenas quando eles existem e são autorizados.
        </h2>
        <p className="mt-6 max-w-2xl text-ink-soft">
          Ainda não temos estudos de caso reais publicados. Em vez de inventar números,
          deixamos explícito o formato com que cada projeto será documentado. Sem clientes,
          logos, depoimentos ou indicadores fabricados.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-12 panel overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--rule)] bg-paper px-7 py-5">
          <FlaskConical className="h-5 w-5 text-cobalt" aria-hidden="true" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
            Estrutura preparada para o primeiro caso autorizado
          </span>
        </div>
        <dl className="grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((f) => (
            <div key={f} className="bg-paper-soft p-6">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">{f}</dt>
              <dd className="mt-3 text-sm text-ink-mute">— aguardando projeto autorizado</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
