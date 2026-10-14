import { invisibleWork } from "@/content/brand";
import { Reveal } from "./Reveal";
import { ZapOff, Sparkles } from "lucide-react";

const IMPACT_TAGS = [
  "~4h a 8h perdidas por semana",
  "Risco de duplicidade e erro humano",
  "Gargalo no fechamento de mês",
  "Trabalho duplicado sem auditoria",
  "Inconsistências descobertas tarde",
  "Comunicação fragmentada",
  "Esforço manual sem registro"
];

export function InvisibleWork() {
  return (
    <section id="problema" className="relative scroll-mt-24 py-24 md:py-36 overflow-hidden border-t border-black/8 bg-paper">
      {/* Luz volumétrica de fundo */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-cobalt/5 blur-[150px]"
        aria-hidden="true"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-rust/30 bg-rust/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-rust">
            <ZapOff size={13} />
            <span>O Custo Oculto da Operação</span>
          </div>

          <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] tracking-tightest text-ink">
            Tarefas pequenas que, somadas, drenam a empresa inteira.
          </h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Elas não aparecem no relatório de diretoria. Não constam em nenhuma linha de orçamento.
            Ninguém as mede. Mas consomem horas todos os dias e tornam qualquer crescimento pesado e caro.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
              <span className="font-mono text-2xl font-bold text-ink">30% a 40%</span>
              <p className="mt-1 text-xs text-ink-soft">do tempo de equipes operacionais é gasto em atrito manual repetitivo.</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
              <span className="font-mono text-2xl font-bold text-cobalt">R$ 0</span>
              <p className="mt-1 text-xs text-ink-soft">de valor novo gerado por redigitar dados de um sistema para outro.</p>
            </div>
          </div>

          <p className="mt-8 max-w-md text-sm text-ink-mute flex items-center gap-2">
            <Sparkles size={14} className="text-cobalt shrink-0" />
            A Sanle mapeia exatamente esses gargalos e os transforma em pipelines autônomos.
          </p>
        </div>

        {/* Lista escaneável e detalhada com scrollytelling */}
        <ul className="divide-y divide-black/8 border-y border-black/8">
          {invisibleWork.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 45}
              className="group grid grid-cols-[auto_1fr] gap-6 py-7 transition-colors hover:bg-black/[0.015] px-2 rounded-xl"
            >
              <span className="font-mono text-sm font-semibold text-cobalt pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl tracking-tight text-ink group-hover:text-cobalt transition-colors">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-mute rounded-md border border-black/10 px-2 py-0.5 bg-white">
                    {IMPACT_TAGS[i] || "Impacto operacional"}
                  </span>
                </div>
                <p className="mt-2 text-base text-ink-soft leading-relaxed">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
