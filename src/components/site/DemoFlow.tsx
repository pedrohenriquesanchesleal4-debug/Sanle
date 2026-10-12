"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Check, TriangleAlert } from "lucide-react";
import { demoNotice } from "@/content/brand";
import { cn } from "@/lib/utils";

type Stage = {
  id: number;
  title: string;
  verb: string;
  detail: string;
};

const STAGES: Stage[] = [
  { id: 0, title: "Recebidos", verb: "Entrada", detail: "6 arquivos chegam de canais diferentes." },
  { id: 1, title: "Classificados", verb: "Tipo", detail: "Cada arquivo é reconhecido por tipo e origem." },
  { id: 2, title: "Processados", verb: "Extração", detail: "Campos são extraídos dos documentos." },
  { id: 3, title: "Verificados", verb: "Validação", detail: "Obrigatoriedade, formato e duplicidade." },
  { id: 4, title: "Revisão humana", verb: "Exceção", detail: "Só o que falha na validação vai para conferência." },
  { id: 5, title: "Preparados", verb: "Saída", detail: "Dados organizados para o sistema da empresa." }
];

type Doc = { id: string; name: string; rows: string[] };

const DOCS: Doc[] = [
  { id: "d1", name: "nota_fiscal_1024.pdf", rows: ["Nº 1024", "Valor 3.450,00", "Data 03/09"] },
  { id: "d2", name: "comprovante_transf.jpg", rows: ["Valor 1.200,00", "Data 05/09", "Campo ausente"] },
  { id: "d3", name: "extrato_setembro.csv", rows: ["12 lançamentos", "Soma 28.400,00", "Período 09/2026"] },
  { id: "d4", name: "contrato_servico.pdf", rows: ["Vigência 12m", "Valor mensal 980,00", "Assinado"] },
  { id: "d5", name: "nota_fiscal_1024(2).pdf", rows: ["Nº 1024", "Duplicidade", "—"] },
  { id: "d6", name: "solicitacao_orcamento.txt", rows: ["Serviço: instalação", "Cidade: Brasília", "Urgente"] }
];

// Quais documentos ficam retidos para revisão em cada execução (determinístico).
const REVIEW_PHASE = { d2: 4, d5: 4 } as Record<string, number>;

export function DemoFlow() {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running || reduced) return;
    timer.current = setInterval(() => {
      setStage((s) => {
        if (s >= STAGES.length - 1) {
          stop();
          return s;
        }
        return s + 1;
      });
    }, 1400);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, reduced, stop]);

  const reset = () => {
    stop();
    setStage(0);
  };

  const play = () => {
    if (reduced) {
      setStage(STAGES.length - 1);
      return;
    }
    if (stage >= STAGES.length - 1) setStage(0);
    setRunning(true);
  };

  const docState = useMemo(() => {
    return (doc: Doc): "waiting" | "active" | "review" | "done" => {
      const reviewAt = REVIEW_PHASE[doc.id];
      if (reviewAt !== undefined && stage >= reviewAt) return "review";
      if (stage === 0) return "waiting";
      if (stage >= 5) return "done";
      if (stage >= 2) return "active";
      return "active";
    };
  }, [stage]);

  return (
    <section className="border-y border-[var(--rule)] bg-ink py-20 text-paper md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow !text-paper/50">Demonstração interativa</p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight text-paper">
              Veja um fluxo documental se organizando em seis etapas.
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={running ? stop : play}
              className="btn btn-accent"
              aria-pressed={running}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pausar" : "Executar"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn border border-white/20 text-paper hover:bg-white/10"
              aria-label="Reiniciar demonstração"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trilha de etapas */}
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-white/15 bg-white/10 md:grid-cols-6">
          {STAGES.map((s) => {
            const active = s.id === stage;
            const done = stage > s.id;
            return (
              <li key={s.id} className={cn("bg-ink p-5 transition-colors", active && "bg-cobalt")}>
                <div className="flex items-center justify-between">
                  <span className={cn("font-mono text-[0.68rem]", active ? "text-white" : "text-paper/50")}>
                    {String(s.id + 1).padStart(2, "0")}
                  </span>
                  {done && <Check className="h-4 w-4 text-signal" aria-hidden="true" />}
                </div>
                <h3 className={cn("mt-3 font-display text-lg tracking-tight", active ? "text-white" : "text-paper")}>
                  {s.title}
                </h3>
                <p className={cn("mt-1.5 text-[0.8rem] leading-snug", active ? "text-white/85" : "text-paper/55")}>
                  {s.detail}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Documentos + barra de progresso */}
        <div className="mt-8">
          <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/50">
            <span>{STAGES[stage]?.verb ?? "—"}</span>
            <span aria-live="polite">
              Etapa {stage + 1} de {STAGES.length}
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-white/15" role="presentation">
            <div
              className="h-px bg-cobalt transition-[width] duration-500 ease-editorial"
              style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
            />
          </div>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOCS.map((doc) => {
              const st = docState(doc);
              const isReview = st === "review";
              return (
                <li
                  key={doc.id}
                  className={cn(
                    "rounded-[10px] border p-4 transition-colors duration-500",
                    isReview
                      ? "border-rust/60 bg-rust/10"
                      : st === "done"
                        ? "border-signal/40 bg-white/[0.06]"
                        : "border-white/15 bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em]">
                    {isReview ? (
                      <TriangleAlert className="h-3.5 w-3.5 text-rust" aria-hidden="true" />
                    ) : (
                      <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-paper/40" aria-hidden="true">
                        {st === "done" && <Check className="h-2.5 w-2.5 text-signal" />}
                      </span>
                    )}
                    <span className={isReview ? "text-rust" : "text-paper/60"}>
                      {st === "done" ? "Pronto" : isReview ? "Revisão" : "Processando"}
                    </span>
                  </div>
                  <p className="mt-3 truncate font-mono text-[0.72rem] text-paper/85">{doc.name}</p>
                  <ul className="mt-2 space-y-0.5">
                    {doc.rows.map((r) => (
                      <li key={r} className="truncate text-[0.74rem] text-paper/55">{r}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-8 max-w-3xl text-[0.78rem] leading-relaxed text-paper/45">{demoNotice}</p>
      </div>
    </section>
  );
}
