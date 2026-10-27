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
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[390px] rounded-2xl md:rounded-3xl border border-white/10 bg-[#111318]/90 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-[#F5F6F8]">
      {/* Grid de régua técnica e marcas de engenharia */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      {/* Parafusos de hardware de precisão nos cantos */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-white/20 bg-white/10 shadow-inner" aria-hidden="true" />

      {/* =========================================================================
          CABEÇALHO TÉCNICO DO ESQUEMÁTICO
         ========================================================================= */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30">
            <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#F5F6F8] font-bold">
              ESQUEMA TÉCNICO OPERACIONAL
            </span>
            <span className="font-mono text-[0.55rem] sm:text-[0.6rem] text-[#969DA8]">
              VETOR NATIVO · THE OPPORTUNITY ENGINE
            </span>
          </div>
        </div>

        {/* Indicador de fase em tempo real */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.58rem] sm:text-[0.64rem] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#F5F6F8] font-medium shadow-xs">
            {activeChapter === 0 && "01 · CAOS MANUAL"}
            {activeChapter === 1 && "02 · INGESTÃO"}
            {activeChapter === 2 && "03 · TRÊS NÓS"}
            {activeChapter === 3 && "04 · FLUXO PERMANENTE"}
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
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 animate-pulse" />
                <span className="font-bold">DESCONEXÃO CRÍTICA DETECTADA</span>
              </div>
              <span className="hidden sm:inline">32% DO TEMPO PERDIDO EM DIGITAÇÃO</span>
            </div>

            {/* Três pacotes desarticulados no espaço */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-red-500/40 bg-red-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-red-500/30">
                  FILA: 18h
                </span>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  NF-e #4910 (PDF)
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">
                  Presa no WhatsApp do comercial. Ninguém lançou no financeiro ainda.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-amber-500/30">
                  DIVERGÊNCIA
                </span>
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  Excel Controle_v3.xlsx
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">
                  Planilha paralela não bate com o faturamento do ERP. Erro descoberto só no mês seguinte.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-amber-500/30">
                  SEM DONO
                </span>
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  Comprovante PIX
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">
                  Print de banco sem identificação. Operador precisa perguntar no grupo quem pagou.
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
              <span className="text-[#969DA8] text-[0.64rem] sm:text-[0.68rem]">
                CUSTO DO PROCESSO MANUAL:
              </span>
              <span className="text-red-400 font-bold text-[0.68rem] sm:text-[0.72rem]">
                R$ 3.840/mês por operador em horas redundantes
              </span>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 2: A INGESTÃO ESTRUTURADA
           ----------------------------------------------------------------------- */}
        {activeChapter === 1 && (
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#2440FF]/15 border border-[#2440FF]/30 text-[#78A9FF] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
                <span className="font-bold">TUBULAÇÃO INVISÍVEL ATIVA</span>
              </div>
              <span className="hidden sm:inline">ZERO EXIGÊNCIA DE TROCA DE SOFTWARES</span>
            </div>

            {/* Conversão em Schema Tipado em Tempo Real */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-2.5 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5 sm:space-y-2">
                <span className="font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider text-[#78A9FF] font-bold block">
                  Canais Conectados:
                </span>
                <div className="space-y-1 sm:space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">WhatsApp API</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">Parser Fiscal / PDF</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">Omie / ContaAzul</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#78A9FF] font-bold">SYNC ATIVO</span>
                  </div>
                </div>
              </div>

              {/* Payload estruturado limpo */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#08090C] text-[#B7F36B] font-mono text-[0.58rem] sm:text-[0.64rem] overflow-x-auto shadow-md leading-relaxed border border-white/10 max-h-[140px] sm:max-h-none">
                <span className="text-[#969DA8] block pb-1 border-b border-white/10 text-[0.54rem] sm:text-[0.58rem]">
                  {"// DADOS EXTRAÍDOS EM 0.18s COM SCHEMA TIPADO"}
                </span>
                <pre className="mt-1 overflow-x-auto">
{`{
  "documento": "NF-e 4910",
  "valor_total": 14850.0,
  "cnpj": "12.345.678/0001-90",
  "duplicatas": 0,
  "status": "VALIDADO_AUTOMATICO"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 3: O NÚCLEO DOS TRÊS NÓS
           ----------------------------------------------------------------------- */}
        {activeChapter === 2 && (
          <div className="space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#B7F36B] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B7F36B]" />
                <span className="font-bold">TRÍADE MECÂNICA SANLE CONVERGIDA</span>
              </div>
              <span className="hidden sm:inline">98% AUTOMÁTICO · 2% EXCEÇÕES</span>
            </div>

            {/* A Tríade de Nós em Formato de Hardware */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <div className="p-2.5 sm:p-3 rounded-xl border border-[#2440FF]/40 bg-[#2440FF]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#78A9FF]">NÓ 01</span>
                  <span className="h-2 w-2 rounded-full bg-[#2440FF] shadow-[0_0_8px_#2440FF]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  Documentos & Ingestão
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Reconhecimento ótico e extração tabular com validação sintática estrita.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-[#C8A24A]/40 bg-[#C8A24A]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#C8A24A]">NÓ 02</span>
                  <span className="h-2 w-2 rounded-full bg-[#C8A24A] shadow-[0_0_8px_#C8A24A]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  Regras de Negócio
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Preços, alçadas, validação de duplicidade e impostos retidos.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#B7F36B]">NÓ 03</span>
                  <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  ERP & Escrituração
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Lançamento contábil e conciliação bancária direta sem redigitação.
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
              <span className="text-[#969DA8] text-[0.64rem] sm:text-[0.68rem]">
                TAXA DE PASSAGEM DIRETA:
              </span>
              <span className="text-[#B7F36B] font-bold text-[0.68rem] sm:text-[0.72rem]">
                98.2% dos lançamentos sem intervenção humana
              </span>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ESTÁGIO 4: FLUXO PERMANENTE E MONITORAMENTO LIVE
           ----------------------------------------------------------------------- */}
        {activeChapter === 3 && (
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#B7F36B] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B7F36B]" />
                <span className="font-bold">REGIME SILENCIOSO · FEED AO VIVO</span>
              </div>
              <span className="hidden sm:inline">ZERO FADIGA DE EQUIPE</span>
            </div>

            {/* Feed Dinâmico de Eventos que se atualiza sozinho */}
            <div className="space-y-1.5 sm:space-y-2">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs animate-in slide-in-from-top-1 duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-[0.58rem] sm:text-[0.64rem] text-[#969DA8]">
                      {ev.time}
                    </span>
                    <span className="font-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-[#F5F6F8]">
                      {ev.doc}
                    </span>
                    <span className="text-[0.6rem] sm:text-[0.66rem] text-[#969DA8] hidden sm:inline">
                      {ev.flow}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.58rem] sm:text-[0.64rem] text-[#B7F36B]">
                      {ev.latency}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#B7F36B] font-mono text-[0.54rem] sm:text-[0.58rem] font-bold border border-[#10B981]/30">
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
              <span className="text-[#969DA8] text-[0.64rem] sm:text-[0.68rem]">
                CAPACIDADE OPERACIONAL:
              </span>
              <span className="text-[#78A9FF] font-bold text-[0.68rem] sm:text-[0.72rem]">
                Escala para 10.000+ documentos/mês sem novas contratações
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          RODAPÉ DO ESQUEMÁTICO: PADRÃO DE GOVERNANÇA TÉCNICA
         ========================================================================= */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 sm:pt-2.5 text-[0.56rem] sm:text-[0.62rem] font-mono text-[#969DA8]">
        <span>CONFORMIDADE LGPD · CRIPTOGRAFIA AES-256</span>
        <span>TRILHA APPEND-ONLY</span>
      </div>
    </div>
  );
}
