"use client";

import { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  Activity
} from "lucide-react";

export function TactileFlowConsole() {
  const [mode, setMode] = useState<"flow" | "manual">("flow");
  const [activeTab, setActiveTab] = useState<"pipeline" | "payload">("pipeline");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simLatency, setSimLatency] = useState("0.38s");
  const simTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    // Limpa timeouts anteriores se houver
    simTimeoutRef.current.forEach(clearTimeout);
    simTimeoutRef.current = [];

    const t1 = setTimeout(() => {
      setSimulationStep(2);
    }, 450);

    const t2 = setTimeout(() => {
      setSimulationStep(3);
      setSimLatency((0.28 + Math.random() * 0.15).toFixed(2) + "s");
    }, 950);

    const t3 = setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
    }, 1800);

    simTimeoutRef.current.push(t1, t2, t3);
  };

  useEffect(() => {
    return () => {
      simTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl border border-[rgba(18,17,16,0.12)] bg-[#FDFCFB] p-5 md:p-6 shadow-2xl shadow-stone-300/40 select-none overflow-hidden transition-all duration-300">
      {/* Detalhes de hardware arquitetural: Parafusos de latão nos 4 cantos */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />

      {/* Barra de cabeçalho do console: Seletor Tátil + Telemetria */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(18,17,16,0.08)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2440FF]/10 text-[#2440FF]">
            <Activity className="h-3.5 w-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#121110] font-bold">
              CONSOLE DE FLUXO OPERACIONAL
            </span>
            <span className="font-mono text-[0.62rem] text-[#8A837A]">
              SISTEMA SANLE · REV 3.4
            </span>
          </div>
        </div>

        {/* Chave comutadora tátil (Caos Manual vs Fluxo Sanle) */}
        <div className="inline-flex rounded-full bg-[#F2EDE4] p-1 border border-[rgba(18,17,16,0.06)] shadow-inner">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`px-3 py-1 rounded-full font-mono text-[0.66rem] uppercase tracking-wider transition-all duration-200 ${
              mode === "manual"
                ? "bg-[#D97706] text-white shadow-sm font-semibold"
                : "text-[#6A6359] hover:text-[#121110]"
            }`}
          >
            Atrito Manual
          </button>
          <button
            type="button"
            onClick={() => setMode("flow")}
            className={`px-3 py-1 rounded-full font-mono text-[0.66rem] uppercase tracking-wider transition-all duration-200 ${
              mode === "flow"
                ? "bg-[#2440FF] text-white shadow-sm font-semibold"
                : "text-[#6A6359] hover:text-[#121110]"
            }`}
          >
            Fluxo Sanle
          </button>
        </div>
      </div>

      {/* =========================================================================
          ESTADO 1: ATRITO MANUAL (A dor invisível que drena tempo e margem)
         ========================================================================= */}
      {mode === "manual" && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-900 font-medium">
                Gargalo Operacional Identificado
              </span>
            </div>
            <span className="font-mono text-[0.68rem] text-amber-800">
              Perda média: 3.4h/dia/operador
            </span>
          </div>

          <div className="grid gap-2.5">
            {/* Etapa 1 Manual */}
            <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white/70 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber-800 font-bold">
                  01 · Entrada Descentralizada
                </span>
                <span className="text-[0.65rem] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Fila: 4h a 24h
                </span>
              </div>
              <p className="mt-1 text-xs text-[#121110] font-medium">
                Notas fiscais, recibos e pedidos dispersos em WhatsApp pessoal e caixas de e-mail.
              </p>
              <span className="mt-1 block text-[0.68rem] text-[#8A837A] font-mono">
                Sem validação prévia de duplicidade ou formatação.
              </span>
            </div>

            {/* Etapa 2 Manual */}
            <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white/70 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber-800 font-bold">
                  02 · Redigitação & Planilhas Paralelas
                </span>
                <span className="text-[0.65rem] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  34 min / documento
                </span>
              </div>
              <p className="mt-1 text-xs text-[#121110] font-medium">
                Operador redigita o mesmo dado no ERP e em planilhas Excel de controle de estoque.
              </p>
              <span className="mt-1 block text-[0.68rem] text-[#8A837A] font-mono">
                Risco contínuo de erro de digitação, valores trocados e retrabalho.
              </span>
            </div>

            {/* Etapa 3 Manual */}
            <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white/70 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber-800 font-bold">
                  03 · Cobrança & Fechamento no Escuro
                </span>
                <span className="text-[0.65rem] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Inconsistência mensal
                </span>
              </div>
              <p className="mt-1 text-xs text-[#121110] font-medium">
                Pendências só são notadas no fim do mês. Relatórios exigem conferência manual exaustiva.
              </p>
              <span className="mt-1 block text-[0.68rem] text-[#8A837A] font-mono">
                Falta de visibilidade em tempo real sobre a margem do negócio.
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-[0.68rem] text-[#8A837A]">
              Veja a alternativa arquitetada:
            </span>
            <button
              type="button"
              onClick={() => setMode("flow")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2440FF] text-white font-mono text-[0.68rem] hover:bg-[#1a32cc] transition-colors shadow-sm"
            >
              <span>Ver Fluxo Sanle</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ESTADO 2: FLUXO SANLE (Engenharia silenciosa, contínua e previsível)
         ========================================================================= */}
      {mode === "flow" && (
        <div className="mt-4 space-y-3.5 animate-in fade-in duration-300">
          {/* Faixa de telemetria ativa e comutador de visão */}
          <div className="flex items-center justify-between rounded-xl bg-[#2440FF]/8 border border-[#2440FF]/15 px-3.5 py-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2440FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2440FF]" />
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[#2440FF] font-semibold">
                Fluxo Ativo ({simLatency})
              </span>
            </div>

            <div className="inline-flex rounded-md bg-white p-0.5 border border-black/5 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pipeline")}
                className={`px-2 py-0.5 rounded font-mono text-[0.62rem] uppercase tracking-wider transition-all ${
                  activeTab === "pipeline"
                    ? "bg-[#2440FF] text-white font-bold"
                    : "text-[#6A6359] hover:text-[#121110]"
                }`}
              >
                Três Nós
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payload")}
                className={`px-2 py-0.5 rounded font-mono text-[0.62rem] uppercase tracking-wider transition-all ${
                  activeTab === "payload"
                    ? "bg-[#121110] text-emerald-400 font-bold"
                    : "text-[#6A6359] hover:text-[#121110]"
                }`}
              >
                Payload JSON
              </button>
            </div>
          </div>

          {activeTab === "payload" ? (
            <div className="p-3 rounded-xl bg-[#121110] text-emerald-400 font-mono text-[0.62rem] leading-relaxed shadow-md border border-stone-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 text-[0.56rem] text-stone-400">
                <span>{"// PAYLOAD REAL SINCRONIZADO COM OMIE ERP"}</span>
                <span>TOQUES HUMANOS: 0</span>
              </div>
              <pre className="mt-1.5 overflow-x-auto max-h-[175px]">
                {JSON.stringify(
                  {
                    origem: "WhatsApp Inbound API",
                    documento: "NF-e #4910.pdf",
                    parser: "Sanle OCR Neural v3.4",
                    tempo_total: simLatency,
                    dados: {
                      emissor: "Vidraçaria Alvorada",
                      cnpj: "12.345.678/0001-90",
                      valor_total: 14850.0,
                      itens_validados: 14
                    },
                    regras_fiscais: {
                      preco_tabela: "CONFORME",
                      anti_duplicidade: "PASS"
                    },
                    erp_destino: {
                      sistema: "Omie ERP",
                      lancamento_id: "LNC-88219",
                      status: "CONCILIADO_SEM_DIGITACAO"
                    }
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
          /* O Pipeline dos Três Nós da Sanle */
          <div className="relative space-y-2.5">
            {/* Linha vertical conectora de latão e safira */}
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#2440FF] via-[#C8A24A] to-[#10B981] z-0 opacity-40" />

            {/* Nó 1: Documentos & Ingestão */}
            <div className={`relative z-10 flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
              simulationStep === 1 
                ? "bg-blue-50/90 border-[#2440FF] shadow-md shadow-blue-500/10 scale-[1.01]" 
                : "bg-white border-[rgba(18,17,16,0.08)] shadow-sm"
            }`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                simulationStep === 1 
                  ? "bg-[#2440FF] text-white ring-4 ring-blue-100" 
                  : "bg-[#2440FF]/10 text-[#2440FF]"
              }`}>
                01
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#2440FF] font-semibold">
                    Ingestão Zero-Touch (WhatsApp & OCR)
                  </span>
                  <span className="font-mono text-[0.62rem] text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    0.18s
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#121110] font-medium leading-snug">
                  Documento ou mensagem recebida é estruturado em schema tipado automaticamente.
                </p>
              </div>
            </div>

            {/* Nó 2: Sistemas & Regras de Negócio */}
            <div className={`relative z-10 flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
              simulationStep === 2 
                ? "bg-amber-50/90 border-[#C8A24A] shadow-md shadow-amber-500/10 scale-[1.01]" 
                : "bg-white border-[rgba(18,17,16,0.08)] shadow-sm"
            }`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                simulationStep === 2 
                  ? "bg-[#C8A24A] text-white ring-4 ring-amber-100" 
                  : "bg-[#C8A24A]/15 text-[#927022]"
              }`}>
                02
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#927022] font-semibold">
                    Validação Fiscal & Regras de Negócio
                  </span>
                  <span className="font-mono text-[0.62rem] text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    0.12s
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#121110] font-medium leading-snug">
                  Checagem determinística contra tabelas de preço, estoque e verificação de duplicatas.
                </p>
              </div>
            </div>

            {/* Nó 3: Conciliação & ERP Sync */}
            <div className={`relative z-10 flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
              simulationStep === 3 
                ? "bg-emerald-50/90 border-[#10B981] shadow-md shadow-emerald-500/10 scale-[1.01]" 
                : "bg-white border-[rgba(18,17,16,0.08)] shadow-sm"
            }`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                simulationStep === 3 
                  ? "bg-[#10B981] text-white ring-4 ring-emerald-100" 
                  : "bg-emerald-50 text-[#059669]"
              }`}>
                03
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-[#059669] font-semibold">
                    Sync Bidirecional (Omie · ContaAzul)
                  </span>
                  <span className="font-mono text-[0.62rem] text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    0.08s
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#121110] font-medium leading-snug">
                  Lançamento contábil imediato com trilha auditável append-only e zero intervenção manual.
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Painel de Ação Interativa: Disparo de Demonstração */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(18,17,16,0.06)]">
            <div className="flex items-center gap-1.5 text-[0.68rem] font-mono text-[#4A453E]">
              {simulationStep === 4 ? (
                <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Fluxo validado em {simLatency} · 0 toques humanos</span>
                </span>
              ) : isSimulating ? (
                <span className="inline-flex items-center gap-1 text-[#2440FF] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
                  <span>Processando malha operacional...</span>
                </span>
              ) : (
                <span>Três nós conectados · Latão, Safira e Dados</span>
              )}
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
                isSimulating 
                  ? "bg-[#2440FF]/20 text-[#2440FF] cursor-not-allowed" 
                  : "bg-[#121110] text-white hover:bg-[#2440FF] shadow-sm active:scale-95"
              }`}
            >
              <Zap className="h-3 w-3 text-amber-300" />
              <span>{isSimulating ? "Simulando..." : "Simular Disparo de Fluxo"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Faixa inferior de micro-garantia de engenharia */}
      <div className="mt-4 pt-3 border-t border-[rgba(18,17,16,0.06)] flex items-center justify-between text-[0.62rem] font-mono text-[#8A837A]">
        <span>SEM MIGRAR DE BANCO OU ERP</span>
        <span className="hidden sm:inline">GOVERNANÇA & RASTREABILIDADE 100% AUDITÁVEL</span>
      </div>
    </div>
  );
}
