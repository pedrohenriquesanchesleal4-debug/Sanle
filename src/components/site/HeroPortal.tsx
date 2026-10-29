"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Send,
  Lock
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type InteractiveMode = "showcase" | "system" | "agent";

const AGENT_DIALOGS = [
  {
    question: "“Vocês emitem nota fiscal para PJ e fornecem garantia técnica contratual?”",
    source: "Manual_Padrao_Sanle.pdf (Cláusula 4ª)",
    answer: "Sim. Todos os projetos acompanham nota fiscal de serviços, contrato jurídico com escopo fechado, homologação assistida e garantia técnica direta com o engenheiro responsável.",
    actionTag: "Qualificação comercial concluída · Transbordo imediato para Pedro Leal"
  },
  {
    question: "“Como funciona o prazo de entrega de um sistema sob medida ou site autoral?”",
    source: "Diretrizes_Operacionais.pdf (Seção 2.1)",
    answer: "A entrega ocorre entre 7 e 14 dias úteis. Entregamos o projeto homologado em ambiente de produção com código-fonte 100% de propriedade do cliente, sem mensalidades ocultas de plataforma.",
    actionTag: "Cronograma de 10 dias confirmado no CRM"
  },
  {
    question: "“É possível conectar o site ou agente ao ERP que já usamos hoje?”",
    source: "Arquitetura_Integracoes.pdf (Módulo APIs)",
    answer: "Perfeitamente. Construímos integrações diretas via API e Webhooks com Omie, ContaAzul, Bling ou banco de dados próprio, sem alterar a rotina da sua equipe contábil ou financeira.",
    actionTag: "Webhook verificado · Sem duplicidade de dados"
  }
];

export function HeroPortal() {
  const [activeMode, setActiveMode] = useState<InteractiveMode>("showcase");

  // Estado do Modo 1: Vitrine & Catálogo Comercial
  const [glassArea, setGlassArea] = useState<number>(14);
  const [selectedFinish, setSelectedFinish] = useState<"temperado" | "laminado" | "acustico">("temperado");
  const [simulatedSent, setSimulatedSent] = useState<boolean>(false);

  const pricePerM2 = {
    temperado: 280,
    laminado: 420,
    acustico: 650
  };
  const estimatedTotal = glassArea * pricePerM2[selectedFinish];

  // Estado do Modo 2: Sistema & Painel Operacional
  const [orders, setOrders] = useState([
    { id: "OS-842", client: "Construtora Vértice", scope: "Esquadrias Torre A", status: "Em Produção", value: 18400 },
    { id: "OS-843", client: "Clínica Horizonte", scope: "Divisórias Acústicas", status: "Aprovado", value: 7200 },
    { id: "OS-844", client: "Empório Capital", scope: "Fachada Glazing", status: "Cotação", value: 24500 }
  ]);
  const [totalRevenue, setTotalRevenue] = useState<number>(50100);

  const advanceOrderStatus = (id: string) => {
    const nextMap: Record<string, string> = {
      Cotação: "Aprovado",
      Aprovado: "Em Produção",
      "Em Produção": "Concluído",
      Concluído: "Cotação"
    };
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: nextMap[ord.status] || "Cotação" } : ord))
    );
  };

  const addSimulatedOrder = () => {
    const randomNum = Math.floor(845 + Math.random() * 50);
    const clients = ["Studio Arquitetura", "Grupo Aliança", "Prime Distribuidora", "Centro Médico"];
    const scopes = ["Painel Administrativo", "Portal de Clientes", "Catálogo B2B", "Checkout Integrado"];
    const val = Math.floor(4500 + Math.random() * 12000);

    const newOrd = {
      id: `OS-${randomNum}`,
      client: clients[Math.floor(Math.random() * clients.length)]!,
      scope: scopes[Math.floor(Math.random() * scopes.length)]!,
      status: "Aprovado",
      value: val
    };

    setOrders((prev) => [newOrd, prev[0]!, prev[1]!]);
    setTotalRevenue((prev) => prev + val);
  };

  // Estado do Modo 3: Agente de IA com RAG
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [agentTyping, setAgentTyping] = useState<boolean>(false);
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");

  useEffect(() => {
    setAgentTyping(true);
    setDisplayedAnswer("");
    const targetText = AGENT_DIALOGS[selectedPromptIdx]?.answer || "";

    const timer = setTimeout(() => {
      setAgentTyping(false);
      setDisplayedAnswer(targetText);
    }, 380);

    return () => clearTimeout(timer);
  }, [selectedPromptIdx]);

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_aberto", { local: "hero_interactive_atelier", mode: activeMode });
    const modeNames = {
      showcase: "Vitrine & Catálogo Comercial",
      system: "Sistema Web & Painel Operacional",
      agent: "Agente de IA com RAG"
    };
    const url = buildWhatsAppLink({
      customText: `Olá Pedro! Estava navegando no estúdio da Sanle (${modeNames[activeMode]}) e gostaria de conversar sobre um projeto sob medida para minha empresa.`
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="portal-hero-container"
      className="relative w-full max-w-full bg-[#090A0F] text-[#F3F4F6] pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 border-b border-white/[0.07] overflow-clip"
      aria-label="Sanle Studio — Engenharia de Software e Produtos Digitais"
    >
      {/* Granulação táctil e atmosfera física de estúdio */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full blur-[180px] opacity-15"
        style={{
          background: "radial-gradient(circle, #2563EB 0%, rgba(37,99,235,0) 70%)"
        }}
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Barra superior de status e disciplina técnica */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#9CA3AF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-[0.68rem] tracking-wide text-[#E5E7EB]">
              Sanle Studio · Engenharia de Software Autoral
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-[#9CA3AF] font-mono text-[0.68rem]">
            <span>Brasília · Atendimento Nacional</span>
            <span className="text-white/20">/</span>
            <span className="text-[#60A5FA]">Código 100% Proprietário</span>
          </div>
        </div>

        {/* Bloco de Título e Posicionamento Monumental */}
        <div className="max-w-4xl">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.2rem)] font-normal tracking-[-0.035em] text-[#F9FAFB] leading-[1.02]">
            Software desenhado para a realidade da sua operação.
          </h1>

          <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#9CA3AF] font-sans">
            Construímos presenças digitais autorais de alto padrão, sistemas web sob medida e inteligência artificial prática.
            Sem templates prontos, sem dependência de plataformas de aluguel e com entrega ágil em 7 a 14 dias.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Link
              href="/#contato"
              onClick={() => trackEvent("cta_clicado", { cta: "hero_iniciar_projeto" })}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2563EB] text-white font-medium text-sm transition-all hover:bg-[#1D4ED8] shadow-[0_10px_30px_rgba(37,99,235,0.35)] active:scale-[0.98]"
            >
              <span>Tirar projeto do papel</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.03] border border-white/15 text-[#E5E7EB] text-sm hover:border-[#60A5FA] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4 text-[#10B981]" />
              <span>Falar no WhatsApp com Pedro Leal</span>
            </button>

            <span className="w-full sm:w-auto text-xs text-[#6B7280] font-mono pt-1 sm:pt-0">
              Resposta direta em horário comercial · Sem robôs de atendimento frio
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* A BANCADA INTERATIVA DE ENGENHARIA (O ATELIÊ VIVO DA SANLE)     */}
        {/* ============================================================== */}
        <div className="mt-12 lg:mt-16 rounded-3xl border border-white/12 bg-[#0E1017] p-4 sm:p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          {/* Seletor de Modos da Bancada */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#60A5FA] mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ateliê Interativo de Software · Deguste a Experiência</span>
              </div>
              <p className="text-sm text-[#9CA3AF]">
                Selecione uma das soluções abaixo para testar a mecânica em tempo real:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
              {[
                { id: "showcase", label: "01. Vitrine & Catálogo", desc: "Conversão no WhatsApp" },
                { id: "system", label: "02. Sistema & Painel", desc: "Gestão sem Planilhas" },
                { id: "agent", label: "03. Agente com RAG", desc: "IA com Documentos Reais" }
              ].map((tab) => {
                const isActive = activeMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveMode(tab.id as InteractiveMode);
                      trackEvent("segmento_selecionado", { modo: tab.id });
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-md font-semibold"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="block font-mono text-[0.68rem] tracking-wide">{tab.label}</span>
                    <span className="block text-xs opacity-85 leading-tight">{tab.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ÁREA DE TESTE AO VIVO DO MODO SELECIONADO */}
          <div className="mt-6">
            {/* -------------------------------------------------------- */}
            {/* MODO 01: VITRINE COMERCIAL & CATÁLOGO DE ORÇAMENTO        */}
            {/* -------------------------------------------------------- */}
            {activeMode === "showcase" && (
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#2563EB]/15 border border-[#2563EB]/30 font-mono text-[0.66rem] text-[#60A5FA]">
                    Páginas e Vitrines Digitais Autorais
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-snug">
                    O cliente experimenta e calcula antes de chamar no WhatsApp.
                  </h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    Substituímos PDFs pesados e descrições confusas por catálogos interativos e calculadoras de especificação.
                    O lead chega no seu WhatsApp já sabendo metragem, modelo e valor estimado.
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#D1D5DB]">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    <span>Redução de até 80% do tempo gasto enviando tabelas manuais</span>
                  </div>
                </div>

                <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#090B10] border border-white/10 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-[#9CA3AF]">
                      Simulador Comercial Integrado (Exemplo: Esquadrias & Vidros)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 font-mono text-[0.65rem] text-[#10B981]">
                      Calculadora Ativa
                    </span>
                  </div>

                  {/* Seleção de Linha */}
                  <div>
                    <label className="block font-mono text-[0.68rem] text-[#9CA3AF] mb-2 uppercase tracking-wider">
                      Escolha o Padrão de Acabamento:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "temperado", name: "Temperado 10mm", rate: "R$ 280/m²" },
                        { id: "laminado", name: "Laminado Duplo", rate: "R$ 420/m²" },
                        { id: "acustico", name: "Isolamento Acústico", rate: "R$ 650/m²" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedFinish(item.id as typeof selectedFinish);
                            setSimulatedSent(false);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedFinish === item.id
                              ? "bg-[#2563EB]/20 border-[#2563EB] text-white"
                              : "bg-white/[0.02] border-white/10 text-[#9CA3AF] hover:text-white"
                          }`}
                        >
                          <span className="block text-xs font-medium">{item.name}</span>
                          <span className="block font-mono text-[0.65rem] text-[#60A5FA]">{item.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Controle de Metragem */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div>
                      <span className="block text-xs font-medium text-white">Área Estimada do Projeto</span>
                      <span className="block text-[0.68rem] text-[#9CA3AF]">Ajuste a metragem com os botões</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setGlassArea((a) => Math.max(2, a - 2));
                          setSimulatedSent(false);
                        }}
                        className="h-8 w-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center font-mono font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-base font-bold text-white min-w-[50px] text-center">
                        {glassArea} m²
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setGlassArea((a) => Math.min(100, a + 2));
                          setSimulatedSent(false);
                        }}
                        className="h-8 w-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center font-mono font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Resumo e Ação */}
                  <div className="p-3.5 rounded-xl bg-[#141824] border border-[#2563EB]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#9CA3AF] block">
                        Estimativa Pré-Calculada:
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#60A5FA]">
                        R$ {estimatedTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSimulatedSent(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{simulatedSent ? "Simulação Enviada!" : "Testar Envio Estruturado"}</span>
                    </button>
                  </div>

                  {simulatedSent && (
                    <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#E5E7EB] font-mono leading-relaxed">
                      💬 <span className="text-[#10B981] font-bold">Mensagem que chegaria no seu WhatsApp:</span>
                      <br />
                      “Olá! Gostaria de cotar o acabamento *{selectedFinish.toUpperCase()}* para uma área de *{glassArea} m²* (estimativa preliminar de *R$ {estimatedTotal.toLocaleString("pt-BR")}*). Podemos agendar a medição?”
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* MODO 02: SISTEMA WEB & PAINEL OPERACIONAL SOB MEDIDA      */}
            {/* -------------------------------------------------------- */}
            {activeMode === "system" && (
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#D97706]/15 border border-[#D97706]/30 font-mono text-[0.66rem] text-[#FBBF24]">
                    Sistemas Web & Portais Administrativos
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-snug">
                    Sua equipe no comando, sem depender de 15 planilhas paralelas.
                  </h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    Criamos sistemas web seguros (PostgreSQL + RLS) onde cada funcionário vê exatamente o que precisa:
                    pedidos, ordens de serviço, aprovações e histórico de faturamento sem perigo de perda de dados.
                  </p>

                  <div className="pt-1 space-y-2 text-xs font-mono text-[#D1D5DB]">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-[#FBBF24]" />
                      <span>Segurança por perfil de acesso e auditoria completa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-[#60A5FA]" />
                      <span>Banco de dados próprio, sem limite de registros ou taxas ocultas</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#090B10] border border-white/10 space-y-3.5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="font-mono text-xs text-white block font-semibold">
                        Painel Operacional de Ordens em Aberto
                      </span>
                      <span className="font-mono text-[0.65rem] text-[#9CA3AF]">
                        Clique no badge de status para avançar o estágio da ordem
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={addSimulatedOrder}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>+ Nova OS</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="p-3 rounded-xl bg-[#12151E] border border-white/10 hover:border-[#60A5FA]/60 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[#60A5FA] font-bold">{ord.id}</span>
                            <span className="text-xs font-semibold text-white">{ord.client}</span>
                          </div>
                          <span className="text-[0.72rem] text-[#9CA3AF] block mt-0.5">{ord.scope}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-semibold text-white hidden sm:inline">
                            R$ {ord.value.toLocaleString("pt-BR")}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/15 font-mono text-[0.62rem] text-[#10B981] group-hover:bg-[#10B981]/20 transition-all flex items-center gap-1">
                            <RefreshCw className="h-2.5 w-2.5" />
                            <span>{ord.status}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs text-[#9CA3AF]">
                    <span>Faturamento em Produção:</span>
                    <span className="text-[#10B981] font-bold text-sm">
                      R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* MODO 03: AGENTE DE IA COM RAG DOCUMENTAL REAL            */}
            {/* -------------------------------------------------------- */}
            {activeMode === "agent" && (
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 font-mono text-[0.66rem] text-[#34D399]">
                    Agentes de IA Conectados aos Seus Documentos (RAG)
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-snug">
                    Atendimento imediato no WhatsApp sem inventar respostas.
                  </h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    O agente Sanle não alucina: ele consulta as minutas, manuais e tabelas reais da sua empresa para
                    responder com segurança jurídica e encaminha o lead qualificado para o operador humano.
                  </p>

                  <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#D1D5DB]">
                    <ShieldCheck className="h-4 w-4 text-[#34D399]" />
                    <span>Conformidade com LGPD, sem vazamento de dados internos</span>
                  </div>
                </div>

                <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#090B10] border border-white/10 space-y-3.5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-white font-semibold">
                      Simulador de Consulta com o Agente Sanle
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] font-mono text-[0.62rem]">
                      RAG Ativo
                    </span>
                  </div>

                  {/* Perguntas Interativas Rápidas */}
                  <div>
                    <span className="block font-mono text-[0.65rem] text-[#9CA3AF] mb-1.5 uppercase">
                      Clique em uma pergunta para ver o agente responder:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {AGENT_DIALOGS.map((dialog, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPromptIdx(idx)}
                          className={`p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            selectedPromptIdx === idx
                              ? "bg-[#2563EB]/20 border border-[#2563EB] text-white font-medium"
                              : "bg-white/[0.02] border border-white/10 text-[#9CA3AF] hover:text-white"
                          }`}
                        >
                          {dialog.question}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Janela de Resposta com Base de Conhecimento */}
                  <div className="p-3.5 rounded-xl bg-[#111522] border border-[#2563EB]/40 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#60A5FA] text-[0.65rem]">
                      <span className="flex items-center gap-1 font-semibold">
                        <Terminal className="h-3 w-3" />
                        <span>Fonte: {AGENT_DIALOGS[selectedPromptIdx]!.source}</span>
                      </span>
                      <span className="text-[#10B981]">Latência 380ms</span>
                    </div>

                    <p className="font-sans text-xs text-[#F3F4F6] leading-relaxed pt-1">
                      {agentTyping ? (
                        <span className="text-[#9CA3AF] animate-pulse">Consultando base documental e formulando resposta...</span>
                      ) : (
                        displayedAnswer
                      )}
                    </p>

                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[0.62rem] text-[#9CA3AF]">
                      <span>{AGENT_DIALOGS[selectedPromptIdx]!.actionTag}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Faixa Inferior de Compromissos de Engenharia */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-[#9CA3AF]">
            <div>
              <span className="block text-[#60A5FA] font-bold">7 A 14 DIAS</span>
              <span className="text-[0.7rem] block mt-0.5">Prazo de entrega do protótipo</span>
            </div>
            <div>
              <span className="block text-[#10B981] font-bold">CÓDIGO 100% SEU</span>
              <span className="text-[0.7rem] block mt-0.5">Repositório privado no GitHub</span>
            </div>
            <div>
              <span className="block text-white font-bold">SEM MENSALIDADES</span>
              <span className="text-[0.7rem] block mt-0.5">Sem amarras a plataformas de terceiros</span>
            </div>
            <div>
              <span className="block text-[#FBBF24] font-bold">CONTATO DIRETO</span>
              <span className="text-[0.7rem] block mt-0.5">Atendimento com o desenvolvedor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
