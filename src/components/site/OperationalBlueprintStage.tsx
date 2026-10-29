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
  const [events, setEvents] = useState([
    { id: 1, time: "11:42:01", doc: "Lead #4910", flow: "Site ➔ Qualificação ➔ CRM", detail: "Schema validado", status: "Sincronizado" },
    { id: 2, time: "11:42:19", doc: "OS #391", flow: "Portal ➔ Regra de Alçada ➔ ERP", detail: "RLS ativo", status: "Registrado" },
    { id: 3, time: "11:42:44", doc: "Doc #982", flow: "WhatsApp ➔ Extração ➔ Revisão", detail: "Log gravado", status: "Auditável" }
  ]);

  useEffect(() => {
    if (activeChapter !== 3) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0] ?? "11:43:00";
      const randomDocNum = Math.floor(1000 + Math.random() * 9000);
      const newEvent = {
        id: Date.now(),
        time: timeStr,
        doc: `Evento #${randomDocNum}`,
        flow: "Entrada ➔ Regras de Negócio ➔ Sistema",
        detail: "Schema JSON",
        status: "Sincronizado"
      };

      setEvents((prev) => [newEvent, prev[0]!, prev[1]!]);
    }, 3200);

    return () => clearInterval(interval);
  }, [activeChapter]);

  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[390px] rounded-2xl md:rounded-3xl border border-white/10 bg-[#111318]/90 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl text-[#F5F6F8]">
      {/* Grade técnica discreta */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      {/* CABEÇALHO TÉCNICO DO ESQUEMÁTICO */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#2440FF]/20 text-[#78A9FF] border border-[#2440FF]/30">
            <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#F5F6F8] font-bold">
              DIAGRAMA DE ARQUITETURA SANLE
            </span>
            <span className="font-mono text-[0.55rem] sm:text-[0.6rem] text-[#969DA8]">
              SIMULAÇÃO ILUSTRATIVA DE ENGENHARIA
            </span>
          </div>
        </div>

        {/* Indicador de fase */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.58rem] sm:text-[0.64rem] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#F5F6F8] font-medium shadow-xs">
            {activeChapter === 0 && "01 · DIAGNÓSTICO"}
            {activeChapter === 1 && "02 · INTERFACES & CANAIS"}
            {activeChapter === 2 && "03 · SISTEMAS & IA"}
            {activeChapter === 3 && "04 · AUTOMAÇÃO CONTÍNUA"}
          </span>
        </div>
      </div>

      {/* CORPO DO ESQUEMÁTICO */}
      <div className="relative z-10 my-auto py-2">
        {/* ESTÁGIO 1: DIAGNÓSTICO E FRAGMENTAÇÃO */}
        {activeChapter === 0 && (
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
                <span className="font-bold">MAPEAMENTO DE GARGALOS OPERACIONAIS</span>
              </div>
              <span className="hidden sm:inline">CANAIS E PLANILHAS DESCONECTADOS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-red-500/40 bg-red-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-red-500/30">
                  ISOLADO
                </span>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  Atendimento & Documentos
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug">
                  Solicitações, orçamentos e arquivos chegam pelo WhatsApp e e-mail sem padronização.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-amber-500/30">
                  MANUAL
                </span>
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  Planilhas Paralelas
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug">
                  Controles duplicados entre setores dificultam a visão em tempo real de pedidos e prazos.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 relative">
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono text-[0.55rem] sm:text-[0.58rem] font-bold border border-amber-500/30">
                  RETRABALHO
                </span>
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mb-1" />
                <span className="font-mono text-[0.62rem] sm:text-[0.64rem] font-bold text-[#F5F6F8] block">
                  Sistemas Sem Conexão
                </span>
                <p className="text-[0.62rem] sm:text-[0.66rem] text-[#969DA8] mt-0.5 leading-snug">
                  A equipe precisa copiar e colar informações manualmente entre plataformas todos os dias.
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
              <span className="text-[#969DA8] text-[0.64rem] sm:text-[0.68rem]">
                PRIMEIRO PASSO SANLE:
              </span>
              <span className="text-[#78A9FF] font-bold text-[0.68rem] sm:text-[0.72rem]">
                Delimitar o escopo e desenhar a arquitetura antes de codificar
              </span>
            </div>
          </div>
        )}

        {/* ESTÁGIO 2: PRESENÇA DIGITAL & CAPTAÇÃO ESTRUTURADA */}
        {activeChapter === 1 && (
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#2440FF]/15 border border-[#2440FF]/30 text-[#78A9FF] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="font-bold">INTERFACES DIGITAIS & ENTRADA PADRONIZADA</span>
              </div>
              <span className="hidden sm:inline">EXPERIÊNCIA WEB + INTEGRAÇÃO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-2.5 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5 sm:space-y-2">
                <span className="font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider text-[#78A9FF] font-bold block">
                  Pontos de Entrada Conectados:
                </span>
                <div className="space-y-1 sm:space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">Site / Landing Page</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] font-bold">ATIVO</span>
                  </div>
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">WhatsApp & Formulários</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#B7F36B] font-bold">WEBHOOK</span>
                  </div>
                  <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[0.64rem] sm:text-[0.68rem] text-[#F5F6F8]">Painel / CRM / ERP</span>
                    <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#78A9FF] font-bold">CONECTADO</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-[#08090C] text-[#B7F36B] font-mono text-[0.58rem] sm:text-[0.64rem] overflow-x-auto shadow-md leading-relaxed border border-white/10 max-h-[140px] sm:max-h-none">
                <span className="text-[#969DA8] block pb-1 border-b border-white/10 text-[0.54rem] sm:text-[0.58rem]">
                  {"// PAYLOAD PADRONIZADO COM VALIDAÇÃO DE SCHEMA"}
                </span>
                <pre className="mt-1 overflow-x-auto">
{`{
  "origem": "portal_corporativo",
  "empresa": "Cliente B2B",
  "escopo": "sistema_e_automacao",
  "validacao_schema": true,
  "destino": "painel_operacional"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ESTÁGIO 3: SISTEMAS SOB MEDIDA & AGENTES COM CONTEXTO */}
        {activeChapter === 2 && (
          <div className="space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#B7F36B] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B7F36B]" />
                <span className="font-bold">CAMADA DE SISTEMA, REGRAS & AGENTES</span>
              </div>
              <span className="hidden sm:inline">REGRAS DETERMINÍSTICAS + HUMANO NO COMANDO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <div className="p-2.5 sm:p-3 rounded-xl border border-[#2440FF]/40 bg-[#2440FF]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#78A9FF]">CAMADA 01</span>
                  <span className="h-2 w-2 rounded-full bg-[#2440FF]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  Sistema Web & CRM
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Visão centralizada de clientes, pedidos, etapas e permissões por usuário.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-[#C8A24A]/40 bg-[#C8A24A]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#C8A24A]">CAMADA 02</span>
                  <span className="h-2 w-2 rounded-full bg-[#C8A24A]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  Agente com RAG & Tools
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Consulta documentos internos autorizados e executa tarefas delimitadas.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.58rem] sm:text-[0.6rem] font-bold text-[#B7F36B]">CAMADA 03</span>
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                </div>
                <strong className="block text-[0.72rem] sm:text-xs text-[#F5F6F8] mt-1">
                  Validação & Governança
                </strong>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-[#969DA8] mt-0.5">
                  Exceções e aprovações sensíveis são encaminhadas para decisão humana.
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
              <span className="text-[#969DA8] text-[0.64rem] sm:text-[0.68rem]">
                ARQUITETURA DE DADOS:
              </span>
              <span className="text-[#B7F36B] font-bold text-[0.68rem] sm:text-[0.72rem]">
                Banco relacional PostgreSQL com controle de acesso por linha (RLS)
              </span>
            </div>
          </div>
        )}

        {/* ESTÁGIO 4: AUTOMAÇÃO & MONITORAMENTO */}
        {activeChapter === 3 && (
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#B7F36B] font-mono text-[0.64rem] sm:text-[0.68rem]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B7F36B]" />
                <span className="font-bold">FLUXO OPERACIONAL INTEGRADO (SIMULAÇÃO)</span>
              </div>
              <span className="hidden sm:inline">RASTREABILIDADE PONTA A PONTA</span>
            </div>

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
                      {ev.detail}
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
                RESULTADO OPERACIONAL:
              </span>
              <span className="text-[#78A9FF] font-bold text-[0.68rem] sm:text-[0.72rem]">
                Menos trabalho manual repetitivo e histórico centralizado para a gestão
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ DO ESQUEMÁTICO */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 sm:pt-2.5 text-[0.56rem] sm:text-[0.62rem] font-mono text-[#969DA8]">
        <span>BOAS PRÁTICAS LGPD · HTTPS / TLS</span>
        <span>REGISTRO DE ATIVIDADES OPERACIONAIS</span>
      </div>
    </div>
  );
}
