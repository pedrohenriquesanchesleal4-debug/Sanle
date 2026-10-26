"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Check, TriangleAlert } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Stage = {
  id: number;
  title: string;
  verb: string;
  detail: string;
};

const STAGES: Stage[] = [
  { id: 0, title: "Recebidos", verb: "Entrada", detail: "6 arquivos chegam de múltiplos canais e origens." },
  { id: 1, title: "Classificados", verb: "Tipo", detail: "Cada documento é identificado por tipo, formato e contexto." },
  { id: 2, title: "Processados", verb: "Extração", detail: "Campos essenciais e metadados são extraídos estruturadamente." },
  { id: 3, title: "Verificados", verb: "Validação", detail: "Regras de negócio, obrigatoriedade e duplicidade são conferidas." },
  { id: 4, title: "Revisão humana", verb: "Exceção", detail: "Apenas exceções com inconsistências vão para julgamento humano." },
  { id: 5, title: "Preparados", verb: "Saída", detail: "Dados prontos e formatados são entregues ao ERP da empresa." }
];

type Doc = { id: string; name: string; rows: string[] };

const DOCS: Doc[] = [
  { id: "d1", name: "nota_fiscal_1024.pdf", rows: ["Nº 1024", "R$ 3.450,00", "Data 03/09"] },
  { id: "d2", name: "comprovante_pix.jpg", rows: ["R$ 1.200,00", "Data 05/09", "Campo ausente"] },
  { id: "d3", name: "extrato_setembro.csv", rows: ["12 lançamentos", "R$ 28.400,00", "09/2026"] },
  { id: "d4", name: "contrato_servico.pdf", rows: ["12 meses", "R$ 980,00/mês", "Assinado"] },
  { id: "d5", name: "nota_fiscal_1024(2).pdf", rows: ["Nº 1024", "Duplicidade detectada", "Divergência"] },
  { id: "d6", name: "solicitacao_compra.txt", rows: ["Item: hardware", "Brasília", "Aprovado"] }
];

// Documentos que falham deterministamente na etapa de validação (indo para revisão)
const REVIEW_DOCS = new Set(["d2", "d5"]);

export function DemoFlow() {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }, []);

  const handleStart = () => {
    if (!running) {
      trackEvent("demo_iniciada", { etapaInicial: stage });
      setRunning(true);
    } else {
      stop();
    }
  };

  const handleReset = () => {
    stop();
    setStage(0);
  };

  useEffect(() => {
    if (!running) return;

    timer.current = setInterval(() => {
      setStage((prev) => {
        if (prev >= STAGES.length - 1) {
          stop();
          trackEvent("demo_concluida", { etapasConcluidas: 6 });
          return STAGES.length - 1;
        }
        return prev + 1;
      });
    }, 1800);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, stop]);

  const activeStage = STAGES[stage] ?? STAGES[0]!;

  return (
    <section
      id="como-funciona"
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] overflow-hidden w-full max-w-full"
      aria-labelledby="demo-flow-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-[rgba(18,17,16,0.08)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2440FF] font-semibold">
              PROCESSO EM EXECUÇÃO
            </span>
            <h2
              id="demo-flow-title"
              className="mt-3 font-serif-editorial text-[clamp(2.1rem,5vw,4.5rem)] leading-[0.96] text-[#121110]"
            >
              Como os documentos fluem em 6 etapas.
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-[#4A453E] font-sans-editorial">
              Observe como dados não estruturados são classificados, validados e encaminhados sem atrito.
            </p>
          </div>

          {/* Controles de Execução */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#121110] text-white font-mono text-[0.7rem] sm:text-xs uppercase tracking-[0.14em] hover:bg-[#2440FF] transition-all shadow-xs"
            >
              {running ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Executar fluxo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 sm:p-3 rounded-full bg-white border border-[rgba(18,17,16,0.12)] text-[#4A453E] hover:text-[#121110] hover:border-[#2440FF] transition-colors shadow-xs"
              title="Reiniciar fluxo"
              aria-label="Reiniciar demonstração"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Linha das 6 Etapas */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {STAGES.map((s, idx) => {
            const isCurrent = idx === stage;
            const isPassed = idx < stage;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  stop();
                  setStage(idx);
                }}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all border ${
                  isCurrent
                    ? "bg-white border-[#2440FF] shadow-md shadow-[#2440FF]/10 ring-1 ring-[#2440FF]"
                    : isPassed
                    ? "bg-[#F5F2EB] border-emerald-500/30 text-[#121110]"
                    : "bg-white/70 border-[rgba(18,17,16,0.08)] opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={isCurrent ? "text-[#2440FF] font-bold" : isPassed ? "text-[#059669] font-semibold" : "text-[#8A837A]"}>
                    0{idx + 1}
                  </span>
                  {isPassed && <Check className="h-3.5 w-3.5 text-[#059669]" />}
                  {isCurrent && <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-ping" />}
                </div>

                <div className="mt-2 sm:mt-3 font-medium text-xs sm:text-sm text-[#121110]">{s.title}</div>
                <div className="mt-0.5 sm:mt-1 font-mono text-[0.62rem] sm:text-[0.68rem] text-[#8A837A] uppercase tracking-[0.1em]">
                  {s.verb}
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel do Pipeline em Tempo Real */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-lg shadow-stone-200/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[0.68rem] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#4A453E] pb-3 sm:pb-4 border-b border-[rgba(18,17,16,0.08)] gap-2">
            <span>ETAPA ATIVA: {activeStage.title.toUpperCase()}</span>
            <span className="text-[#8A837A]">{activeStage.detail}</span>
          </div>

          {/* Cards dos 6 Documentos Fictícios Transitando */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {DOCS.map((doc) => {
              const isException = REVIEW_DOCS.has(doc.id);
              const isHeldInReview = stage >= 4 && isException;
              const isProcessed = stage === 5 && !isException;

              return (
                <div
                  key={doc.id}
                  className={`p-3 sm:p-4 rounded-xl border transition-all ${
                    isHeldInReview
                      ? "bg-amber-50/80 border-amber-500/60 text-[#121110] shadow-xs"
                      : isProcessed
                      ? "bg-emerald-50/80 border-emerald-500/60 text-[#121110] shadow-xs"
                      : "bg-[#FAF8F5] border-[rgba(18,17,16,0.08)] text-[#121110]"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold truncate max-w-[130px] sm:max-w-[170px] text-[0.72rem] sm:text-xs">{doc.name}</span>
                    {isHeldInReview ? (
                      <span className="flex items-center gap-1 text-amber-700 font-bold text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider">
                        <TriangleAlert className="h-3 w-3" />
                        Revisão
                      </span>
                    ) : isProcessed ? (
                      <span className="flex items-center gap-1 text-[#059669] font-bold text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider">
                        <Check className="h-3 w-3" />
                        Pronto
                      </span>
                    ) : (
                      <span className="text-[#8A837A] text-[0.62rem] sm:text-[0.68rem] uppercase">
                        {activeStage.verb}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-xs font-mono text-[#4A453E]">
                    {doc.rows.map((r, i) => (
                      <span key={i} className="px-1.5 sm:px-2 py-0.5 rounded bg-white border border-[rgba(18,17,16,0.06)] text-[0.62rem] sm:text-[0.68rem]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legenda Obrigatória */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[0.64rem] sm:text-xs text-[#8A837A]">
          <span>* Demonstração conceitual com dados fictícios.</span>
          <span>NENHUM DADO REAL É UTILIZADO NESTA SIMULAÇÃO</span>
        </div>
      </div>
    </section>
  );
}
