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
    <div className="relative w-full rounded-2xl md:rounded-3xl border border-white/10 bg-[#111318]/90 p-3.5 sm:p-5 md:p-6 shadow-2xl backdrop-blur-xl select-none overflow-hidden transition-all duration-300 text-[#F5F6F8]">
      {/* Detalhes de hardware arquitetural: Parafusos de latão nos 4 cantos */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />

      {/* Barra de cabeçalho do console: Seletor Tátil + Telemetria */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30">
            <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#F5F6F8] font-bold">
              CONSOLE DE FLUXO
            </span>
            <span className="font-mono text-[0.55rem] sm:text-[0.62rem] text-[#969DA8]">
              SISTEMA SANLE · THE OPPORTUNITY ENGINE
            </span>
          </div>
        </div>

        {/* Chave comutadora tátil (Caos Manual vs Fluxo Sanle) */}
        <div className="inline-flex rounded-full bg-white/[0.04] p-0.5 sm:p-1 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`px-2.5 sm:px-3 py-1 rounded-full font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider transition-all duration-200 ${
              mode === "manual"
                ? "bg-amber-500/80 text-white shadow-sm font-semibold"
                : "text-[#969DA8] hover:text-[#F5F6F8]"
            }`}
          >
            Atrito Manual
          </button>
          <button
            type="button"
            onClick={() => setMode("flow")}
            className={`px-2.5 sm:px-3 py-1 rounded-full font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider transition-all duration-200 ${
              mode === "flow"
                ? "bg-[#2440FF] text-white shadow-sm font-semibold shadow-[#2440FF]/40"
                : "text-[#969DA8] hover:text-[#F5F6F8]"
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
        <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 sm:px-3.5 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 animate-pulse" />
              <span className="font-mono text-[0.64rem] sm:text-[0.7rem] uppercase tracking-wider text-amber-300 font-medium">
                Gargalo Operacional Identificado
              </span>
            </div>
            <span className="font-mono text-[0.6rem] sm:text-[0.68rem] text-amber-300/80 hidden sm:inline">
              Perda média: 3.4h/dia/operador
            </span>
          </div>

          <div className="grid gap-2 sm:gap-2.5">
            {/* Etapa 1 Manual */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-dashed border-amber-500/30 bg-white/[0.02] shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-amber-400 font-bold">
                  01 · Entrada Descentralizada
                </span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                  Fila: 4h a 24h
                </span>
              </div>
              <p className="mt-1 text-xs text-[#F5F6F8] font-medium leading-snug">
                Notas fiscais, recibos e pedidos dispersos em WhatsApp pessoal e caixas de e-mail.
              </p>
              <span className="mt-1 block text-[0.64rem] sm:text-[0.68rem] text-[#969DA8] font-mono">
                Sem validação prévia de duplicidade ou formatação.
              </span>
            </div>

            {/* Etapa 2 Manual */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-dashed border-amber-500/30 bg-white/[0.02] shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-amber-400 font-bold">
                  02 · Redigitação & Planilhas Paralelas
                </span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                  34 min / documento
                </span>
              </div>
              <p className="mt-1 text-xs text-[#F5F6F8] font-medium leading-snug">
                Operador redigita o mesmo dado no ERP e em planilhas Excel de controle de estoque.
              </p>
              <span className="mt-1 block text-[0.64rem] sm:text-[0.68rem] text-[#969DA8] font-mono">
                Risco contínuo de erro de digitação, valores trocados e retrabalho.
              </span>
            </div>

            {/* Etapa 3 Manual */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-dashed border-amber-500/30 bg-white/[0.02] shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-amber-400 font-bold">
                  03 · Cobrança & Fechamento no Escuro
                </span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                  Inconsistência mensal
                </span>
              </div>
              <p className="mt-1 text-xs text-[#F5F6F8] font-medium leading-snug">
                Pendências só são notadas no fim do mês. Relatórios exigem conferência manual exaustiva.
              </p>
              <span className="mt-1 block text-[0.64rem] sm:text-[0.68rem] text-[#969DA8] font-mono">
                Falta de visibilidade em tempo real sobre a margem do negócio.
              </span>
            </div>
          </div>

          <div className="pt-1.5 sm:pt-2 flex items-center justify-between">
            <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#969DA8]">
              Veja a alternativa arquitetada:
            </span>
            <button
              type="button"
              onClick={() => setMode("flow")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2440FF] text-white font-mono text-[0.64rem] sm:text-[0.68rem] hover:bg-[#3856ff] transition-colors shadow-xs"
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
        <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300">
          {/* Faixa de telemetria ativa e comutador de visão */}
          <div className="flex items-center justify-between rounded-xl bg-[#2440FF]/15 border border-[#2440FF]/30 px-3 py-1.5 sm:px-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F36B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B7F36B]" />
              </span>
              <span className="font-mono text-[0.64rem] sm:text-[0.68rem] uppercase tracking-wider text-[#B7F36B] font-semibold">
                Fluxo Ativo ({simLatency})
              </span>
            </div>

            <div className="inline-flex rounded-md bg-white/[0.05] p-0.5 border border-white/10 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pipeline")}
                className={`px-2 py-0.5 rounded font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider transition-all ${
                  activeTab === "pipeline"
                    ? "bg-[#2440FF] text-white font-bold"
                    : "text-[#969DA8] hover:text-[#F5F6F8]"
                }`}
              >
                Três Nós
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payload")}
                className={`px-2 py-0.5 rounded font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider transition-all ${
                  activeTab === "payload"
                    ? "bg-[#08090C] text-[#B7F36B] font-bold border border-white/10"
                    : "text-[#969DA8] hover:text-[#F5F6F8]"
                }`}
              >
                Payload JSON
              </button>
            </div>
          </div>

          {activeTab === "payload" ? (
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#08090C] text-[#B7F36B] font-mono text-[0.58rem] sm:text-[0.62rem] leading-relaxed shadow-md border border-white/10 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[0.54rem] sm:text-[0.56rem] text-[#969DA8]">
                <span>{"// PAYLOAD REAL SINCRONIZADO COM OMIE ERP"}</span>
                <span className="text-[#B7F36B]">TOQUES HUMANOS: 0</span>
              </div>
              <pre className="mt-2 overflow-x-auto whitespace-pre font-mono">
{`{
  "transacao_id": "sanle_tx_98412e8b",
  "origem": "WhatsApp Business Ingest",
  "documento": {
    "tipo": "NOTA_FISCAL_ELETRONICA",
    "numero": "00010482",
    "emissor_cnpj": "12.345.678/0001-90",
    "valor_total": 4850.00
  },
  "regras_aplicadas": {
    "anti_duplicidade": "PASS (0.012s)",
    "limite_alcada": "PASS (abaixo de R$ 10.000)",
    "conciliacao_bancaria": "LANCADO_AUTOMATICO"
  },
  "destino_erp": {
    "sistema": "Omie ERP API v1",
    "status": 200,
    "tempo_execucao": "${simLatency}"
  }
}`}
              </pre>
            </div>
          ) : (
            <div className="relative space-y-2 sm:space-y-2.5">
              {/* Linha vertical conectora dos três nós */}
              <div className="absolute top-4 bottom-4 left-4 sm:left-5 w-0.5 bg-gradient-to-b from-[#2440FF] via-[#C8A24A] to-[#10B981] opacity-40" />

              {/* Nó 1: Ingestão de Documentos */}
              <div className={`relative z-10 flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                simulationStep === 1 
                  ? "bg-[#2440FF]/15 border-[#2440FF] shadow-lg shadow-[#2440FF]/20 scale-[1.01]" 
                  : "bg-white/[0.02] border-white/10 shadow-xs"
              }`}>
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.68rem] sm:text-xs font-bold transition-colors ${
                  simulationStep === 1 
                    ? "bg-[#2440FF] text-white ring-4 ring-[#2440FF]/20" 
                    : "bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30"
                }`}>
                  01
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider text-[#78A9FF] font-semibold">
                      Ingestão Estruturada Multi-canal
                    </span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30 font-medium">
                      0.18s
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.72rem] sm:text-xs text-[#F5F6F8] font-medium leading-snug">
                    WhatsApp, e-mails fiscais e PDFs capturados e convertidos em dados estruturados.
                  </p>
                </div>
              </div>

              {/* Nó 2: Sistemas & Regras de Negócio */}
              <div className={`relative z-10 flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                simulationStep === 2 
                  ? "bg-amber-500/15 border-[#C8A24A] shadow-lg shadow-amber-500/20 scale-[1.01]" 
                  : "bg-white/[0.02] border-white/10 shadow-xs"
              }`}>
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.68rem] sm:text-xs font-bold transition-colors ${
                  simulationStep === 2 
                    ? "bg-[#C8A24A] text-black font-bold ring-4 ring-[#C8A24A]/20" 
                    : "bg-[#C8A24A]/20 text-[#C8A24A] border border-[#C8A24A]/30"
                }`}>
                  02
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider text-[#C8A24A] font-semibold">
                      Validação Fiscal & Regras de Negócio
                    </span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30 font-medium">
                      0.12s
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.72rem] sm:text-xs text-[#F5F6F8] font-medium leading-snug">
                    Checagem determinística contra tabelas de preço, estoque e verificação de duplicatas.
                  </p>
                </div>
              </div>

              {/* Nó 3: Conciliação & ERP Sync */}
              <div className={`relative z-10 flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                simulationStep === 3 
                  ? "bg-emerald-500/15 border-[#10B981] shadow-lg shadow-emerald-500/20 scale-[1.01]" 
                  : "bg-white/[0.02] border-white/10 shadow-xs"
              }`}>
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.68rem] sm:text-xs font-bold transition-colors ${
                  simulationStep === 3 
                    ? "bg-[#10B981] text-black font-bold ring-4 ring-[#10B981]/20" 
                    : "bg-[#10B981]/20 text-[#B7F36B] border border-[#10B981]/30"
                }`}>
                  03
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider text-[#B7F36B] font-semibold">
                      Sync Bidirecional (Omie · ContaAzul)
                    </span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30 font-medium">
                      0.08s
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.72rem] sm:text-xs text-[#F5F6F8] font-medium leading-snug">
                    Lançamento contábil imediato com trilha auditável append-only e zero intervenção manual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Painel de Ação Interativa: Disparo de Demonstração */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[0.64rem] sm:text-[0.68rem] font-mono text-[#969DA8]">
              {simulationStep === 4 ? (
                <span className="inline-flex items-center gap-1 text-[#B7F36B] font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Fluxo validado em {simLatency} · 0 toques humanos</span>
                </span>
              ) : isSimulating ? (
                <span className="inline-flex items-center gap-1 text-[#78A9FF] font-semibold">
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
              className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full font-mono text-[0.68rem] sm:text-xs transition-all ${
                isSimulating 
                  ? "bg-[#2440FF]/20 text-[#78A9FF] cursor-not-allowed" 
                  : "bg-[#2440FF] text-white hover:bg-[#3856ff] shadow-md shadow-[#2440FF]/30 active:scale-95"
              }`}
            >
              <Zap className="h-3 w-3 text-[#B7F36B]" />
              <span>{isSimulating ? "Simulando..." : "Simular Disparo"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Faixa inferior de micro-garantia de engenharia */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[0.58rem] sm:text-[0.62rem] font-mono text-[#969DA8]">
        <span>SEM MIGRAR DE BANCO OU ERP</span>
        <span className="hidden sm:inline">GOVERNANÇA & RASTREABILIDADE 100% AUDITÁVEL</span>
      </div>
    </div>
  );
}
