"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Layers 
} from "lucide-react";

interface OperationalBlueprintStageProps {
  activeChapter: number;
  scrollProgress?: number;
}

export function OperationalBlueprintStage({
  activeChapter
}: OperationalBlueprintStageProps) {
  // Simulação de eventos em tempo real para o Capítulo 4
  const [events, setEvents] = useState([
    { id: 1, time: "11:42:01", doc: "NF-e #4910", flow: "WhatsApp ➔ Schema OCR ➔ Omie ERP", latency: "0.32s", status: "Conciliado" },
    { id: 2, time: "11:42:19", doc: "Pedido #391", flow: "Inbound ➔ Estoque ➔ ContaAzul", latency: "0.29s", status: "Faturado" },
    { id: 3, time: "11:42:44", doc: "PIX #982", flow: "Comprovante ➔ Baixa Bancária", latency: "0.24s", status: "Auditado" }
  ]);

  useEffect(() => {
    if (activeChapter !== 3) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0] ?? "11:43:00";
      const randomDocNum = Math.floor(1000 + Math.random() * 9000);
      const newEvent = {
        id: Date.now(),
        time: timeStr,
        doc: `Doc #${randomDocNum}`,
        flow: "Entrada ➔ Regras Fiscais ➔ ERP Sync",
        latency: (0.22 + Math.random() * 0.15).toFixed(2) + "s",
        status: "Conciliado"
      };

      setEvents((prev) => [newEvent, prev[0]!, prev[1]!]);
    }, 2800);

    return () => clearInterval(interval);
  }, [activeChapter]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] md:min-h-[460px] rounded-2xl md:rounded-3xl border border-[rgba(18,17,16,0.12)] bg-[#FDFCFB] p-5 md:p-7 flex flex-col justify-between overflow-hidden shadow-2xl shadow-stone-300/40 select-none">
      {/* Grid de régua técnica e marcas de engenharia (Zero fotos de IA) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#121110_1.5px,transparent_1.5px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      {/* Parafusos de hardware de precisão nos cantos */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-stone-300 bg-stone-200/80 shadow-inner" aria-hidden="true" />

      {/* =========================================================================
          CABEÇALHO TÉCNICO DO ESQUEMÁTICO
         ========================================================================= */}
      <div className="relative z-10 flex items-center justify-between border-b border-[rgba(18,17,16,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2440FF]/10 text-[#2440FF]">
            <Terminal className="h-3.5 w-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#121110] font-bold">
              ESQUEMA TÉCNICO OPERACIONAL
            </span>
            <span className="font-mono text-[0.6rem] text-[#8A837A]">
              VETOR NATIVO · SEM FOTOS SINTÉTICAS
            </span>
          </div>
        </div>

        {/* Indicador de fase em tempo real */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.64rem] px-2.5 py-1 rounded-full bg-white border border-[rgba(18,17,16,0.08)] text-[#121110] font-medium shadow-xs">
            {activeChapter === 0 && "FASE 01 · CAOS MANUAL"}
            {activeChapter === 1 && "FASE 02 · INGESTÃO ESTRUTURADA"}
            {activeChapter === 2 && "FASE 03 · NÚCLEO DOS TRÊS NÓS"}
            {activeChapter === 3 && "FASE 04 · FLUXO PERMANENTE"}
          </span>
        </div>
      </div>

      {/* =========================================================================
          CORPO DO ESQUEMÁTICO: TRANSFORMAÇÃO DINÂMICA PELO SCROLL
         ========================================================================= */}
      <div className="relative z-10 my-auto py-2">
        {/* -----------------------------------------------------------------------
            ESTÁGIO 1: O CAOS DO ATRITO MANUAL
           ----------------------------------------------------------------------- */}
        {activeChapter === 0 && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 font-mono text-[0.68rem]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />
                <span className="font-bold">DESCONEXÃO CRÍTICA DETECTADA</span>
              </div>
              <span>32% DO TEMPO PERDIDO EM DIGITAÇÃO</span>
            </div>

            {/* Três pacotes desarticulados no espaço */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-dashed border-red-300 bg-red-50/40 relative">
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-mono text-[0.58rem] font-bold">
                  FILA: 18h
                </span>
                <FileText className="h-5 w-5 text-red-600 mb-1" />
                <span className="font-mono text-[0.64rem] font-bold text-[#121110] block">
                  NF-e #4910 (PDF)
                </span>
                <p className="text-[0.66rem] text-[#6A6359] mt-0.5 leading-snug">
                  Presa no WhatsApp do comercial. Ninguém lançou no financeiro ainda.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 relative">
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[0.58rem] font-bold">
                  DIVERGÊNCIA
                </span>
                <Layers className="h-5 w-5 text-amber-600 mb-1" />
                <span className="font-mono text-[0.64rem] font-bold text-[#121110] block">
                  Excel &quot;Controle_v3.xlsx&quot;
                </span>
                <p className="text-[0.66rem] text-[#6A6359] mt-0.5 leading-snug">
                  Planilha paralela não bate com o faturamento do ERP. Erro descoberto só no mês seguinte.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 relative">
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[0.58rem] font-bold">
                  SEM DONO
                </span>
                <MessageSquare className="h-5 w-5 text-amber-600 mb-1" />
                <span className="font-mono text-[0.64rem] font-bold text-[#121110] block">
                  Comprovante PIX
                </span>
                <p className="text-[0.66rem] text-[#6A6359] mt-0.5 leading-snug">
                  Print de banco sem identificação. Operador precisa perguntar no grupo quem pagou.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white/70 flex items-center justify-between text-xs font-mono">
              <span className="text-[#8A837A] text-[0.68rem]">
                CUSTO DO PROCESSO MANUAL:
              </span>
              <span className="text-red-600 font-bold text-[0.72rem]">
                R$ 3.840/mês por operador em horas redundantes
              </span>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 2: A INGESTÃO ESTRUTURADA
           ----------------------------------------------------------------------- */}
        {activeChapter === 1 && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#2440FF]/10 border border-[#2440FF]/20 text-[#2440FF] font-mono text-[0.68rem]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="font-bold">TUBULAÇÃO INVISÍVEL ATIVA</span>
              </div>
              <span>ZERO EXIGÊNCIA DE TROCA DE SOFTWARES</span>
            </div>

            {/* Conversão em Schema Tipado em Tempo Real */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3">
              <div className="p-3 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white space-y-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#2440FF] font-bold block">
                  Canais Conectados:
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-black/5">
                    <span className="font-mono text-[0.68rem] text-[#121110]">WhatsApp Business API</span>
                    <span className="font-mono text-[0.62rem] text-emerald-600 font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-black/5">
                    <span className="font-mono text-[0.68rem] text-[#121110]">E-mail Fiscal / PDF Parser</span>
                    <span className="font-mono text-[0.62rem] text-emerald-600 font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-black/5">
                    <span className="font-mono text-[0.68rem] text-[#121110]">Omie / ContaAzul Connector</span>
                    <span className="font-mono text-[0.62rem] text-emerald-600 font-bold">SYNC ATIVO</span>
                  </div>
                </div>
              </div>

              {/* Payload estruturado limpo */}
              <div className="p-3 rounded-xl bg-[#121110] text-emerald-400 font-mono text-[0.64rem] overflow-x-auto shadow-md leading-relaxed">
                <span className="text-stone-400 block pb-1 border-b border-stone-800 text-[0.58rem]">
                  {"// DADOS EXTRAÍDOS EM 0.18s COM SCHEMA TIPADO"}
                </span>
                <pre className="mt-1.5 overflow-x-auto">
                  {JSON.stringify(
                    {
                      documento: "NF-e 4910",
                      valor_total: 14850.0,
                      cnpj: "12.345.678/0001-90",
                      duplicatas: 0,
                      status: "VALIDADO_AUTOMATICO"
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 3: O NÚCLEO DOS TRÊS NÓS
           ----------------------------------------------------------------------- */}
        {activeChapter === 2 && (
          <div className="space-y-3.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-mono text-[0.68rem]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-bold">TRÍADE MECÂNICA SANLE CONVERGIDA</span>
              </div>
              <span>98% AUTOMÁTICO · 2% EXCEÇÕES HUMANAS</span>
            </div>

            {/* A Tríade de Nós em Formato de Hardware */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-[#2440FF]/30 bg-blue-50/50 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] font-bold text-[#2440FF]">NÓ 01</span>
                  <span className="h-2 w-2 rounded-full bg-[#2440FF]" />
                </div>
                <strong className="block text-xs text-[#121110] mt-1">
                  Documentos & Ingestão
                </strong>
                <p className="text-[0.65rem] text-[#6A6359] mt-0.5">
                  OCR neural com validação sintática estrita sem alucinação.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#C8A24A]/40 bg-amber-50/50 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] font-bold text-[#927022]">NÓ 02</span>
                  <span className="h-2 w-2 rounded-full bg-[#C8A24A]" />
                </div>
                <strong className="block text-xs text-[#121110] mt-1">
                  Regras de Negócio
                </strong>
                <p className="text-[0.65rem] text-[#6A6359] mt-0.5">
                  Conferência fiscal de preços, prazos e anti-duplicidade em 0.12s.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] font-bold text-emerald-700">NÓ 03</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <strong className="block text-xs text-[#121110] mt-1">
                  Sincronização & ERP
                </strong>
                <p className="text-[0.65rem] text-[#6A6359] mt-0.5">
                  Lançamento contábil e confirmação instantânea para o cliente.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-[rgba(18,17,16,0.08)] bg-white flex items-center justify-between text-xs font-mono">
              <span className="text-[#8A837A] text-[0.66rem]">
                PORTÃO DE GOVERNANÇA:
              </span>
              <span className="text-[#10B981] font-bold text-[0.7rem] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Intervenção humana acionada exclusivamente onde há divergência</span>
              </span>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 4: O FLUXO PERMANENTE (A MÁQUINA EM SILÊNCIO)
           ----------------------------------------------------------------------- */}
        {activeChapter === 3 && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 font-mono text-[0.68rem]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold">MÁQUINA EM REGIME PERMANENTE</span>
              </div>
              <span className="text-emerald-700 font-bold">100% AUDITÁVEL (APPEND-ONLY)</span>
            </div>

            {/* Feed de Telemetria ao Vivo */}
            <div className="rounded-xl border border-[rgba(18,17,16,0.1)] bg-white p-3 space-y-2">
              <div className="flex items-center justify-between text-[0.64rem] font-mono text-[#8A837A] pb-1.5 border-b border-black/5">
                <span>FEED OPERACIONAL AO VIVO</span>
                <span>LATÊNCIA MÉDIA: 0.28s</span>
              </div>

              <div className="space-y-1.5">
                {events.map((ev) => (
                  <div 
                    key={ev.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-black/5 text-xs font-mono transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#8A837A] text-[0.62rem]">{ev.time}</span>
                      <strong className="text-[#121110] text-[0.68rem]">{ev.doc}</strong>
                      <span className="text-[#6A6359] text-[0.64rem] hidden sm:inline">
                        {ev.flow}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[0.62rem] font-bold border border-emerald-200">
                        {ev.status}
                      </span>
                      <span className="text-[#8A837A] text-[0.6rem]">{ev.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-white border border-[rgba(18,17,16,0.06)]">
                <span className="text-[0.6rem] text-[#8A837A] block">TEMPO POUPADO</span>
                <strong className="text-xs text-[#2440FF]">+18h/semana</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[rgba(18,17,16,0.06)]">
                <span className="text-[0.6rem] text-[#8A837A] block">ERRO DE DIGITAÇÃO</span>
                <strong className="text-xs text-[#10B981]">0.00%</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[rgba(18,17,16,0.06)]">
                <span className="text-[0.6rem] text-[#8A837A] block">GOVERNANÇA</span>
                <strong className="text-xs text-[#121110]">Total</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          RODAPÉ DO ESQUEMÁTICO: MÉTRICA DE ENGENHARIA
         ========================================================================= */}
      <div className="relative z-10 pt-3 border-t border-[rgba(18,17,16,0.08)] flex items-center justify-between font-mono text-[0.62rem] text-[#8A837A]">
        <span>ARQUITETURA DE DADOS SILENCIOSA</span>
        <span className="hidden sm:inline">SANLE · SISTEMA DE FLUXO v3.4</span>
      </div>
    </div>
  );
}
