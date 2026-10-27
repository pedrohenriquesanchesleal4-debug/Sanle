"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Globe,
  Layers,
  Bot,
  Workflow,
  CheckCircle2,
  Terminal,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { heroContent } from "@/content/hero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StudioFrontId = "digital" | "systems" | "agents" | "automation";

interface StudioFrontMeta {
  id: StudioFrontId;
  code: string;
  label: string;
  sublabel: string;
  accent: string;
  badgeText: string;
  icon: typeof Globe;
  ideaInput: string;
  architectureOutput: string;
}

const STUDIO_FRONTS: StudioFrontMeta[] = [
  {
    id: "digital",
    code: "01",
    label: "Digital",
    sublabel: "Sites & Experiências",
    accent: "#2440FF",
    badgeText: "PRESENÇA DIGITAL & CONVERSÃO",
    icon: Globe,
    ideaInput: "“Precisamos de um site que transmita o nível real da nossa empresa e gere oportunidades comerciais.”",
    architectureOutput: "Arquitetura editorial em Next.js com direção de arte autoral, SEO estruturado e captação integrada ao CRM/WhatsApp."
  },
  {
    id: "systems",
    code: "02",
    label: "Sistemas",
    sublabel: "Web Apps, Portais & CRMs",
    accent: "#C8A24A",
    badgeText: "SOFTWARE SOB MEDIDA",
    icon: Layers,
    ideaInput: "“Nossa operação cresceu e as planilhas paralelas não dão mais conta de pedidos, prazos e clientes.”",
    architectureOutput: "Sistema web sob medida com painéis por perfil de acesso, banco PostgreSQL com RLS e histórico completo."
  },
  {
    id: "agents",
    code: "03",
    label: "Agentes",
    sublabel: "IA Aplicada & RAG",
    accent: "#B7F36B",
    badgeText: "AGENTES COM CONTEXTO REAL",
    icon: Bot,
    ideaInput: "“Queremos qualificar clientes no WhatsApp e responder dúvidas técnicas usando nossos próprios manuais.”",
    architectureOutput: "Agente conectado à base documental (RAG) com chamada de ferramentas delimitadas e transbordo humano."
  },
  {
    id: "automation",
    code: "04",
    label: "Automação",
    sublabel: "Fluxos, Docs & APIs",
    accent: "#10B981",
    badgeText: "INTEGRAÇÃO & FLUXO CONTÍNUO",
    icon: Workflow,
    ideaInput: "“Nossa equipe gasta horas todos os dias conferindo documentos e redigitando dados entre sistemas.”",
    architectureOutput: "Pipeline automatizado com leitura estruturada, validação de regras de negócio e sincronização via API."
  }
];

export function HeroPortal() {
  const { dict } = useI18n();
  const [activeFront, setActiveFront] = useState<StudioFrontId>("digital");

  // Estado interativo da frente 01 (Digital)
  const [digitalFocus, setDigitalFocus] = useState<"posicionamento" | "conversao" | "performance">("posicionamento");

  // Estado interativo da frente 02 (Sistemas)
  const [orders, setOrders] = useState([
    { id: "OS-204", client: "Grupo Vértice", scope: "Portal do Cliente B2B", status: "Em Produção" },
    { id: "OS-205", client: "Atlas Logística", scope: "Painel de Despacho", status: "Homologação" },
    { id: "OS-206", client: "Clínica Horizonte", scope: "Triagem & Agenda", status: "Escopo" }
  ]);

  const cycleOrderStatus = (id: string) => {
    const nextMap: Record<string, string> = {
      "Escopo": "Homologação",
      "Homologação": "Em Produção",
      "Em Produção": "Escopo"
    };
    setOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextMap[item.status] || "Em Produção" } : item))
    );
  };

  // Estado interativo da frente 03 (Agentes)
  const [agentPromptIdx, setAgentPromptIdx] = useState<0 | 1>(0);
  const agentPrompts = [
    {
      question: "Cliente no WhatsApp: “Vocês atendem projetos industriais em Brasília com contrato de manutenção?”",
      source: "Base RAG: Politica_Comercial_2026.pdf (Seção 2.4)",
      toolCall: "qualificar_lead({ regiao: 'DF', modalidade: 'contrato_recorrente', prioridade: 'alta' })",
      response: "Sim, atendemos em Brasília e região com SLA contratual. Para preparar a proposta técnica, quantos ativos entram no escopo?",
      handoff: "Oportunidade registrada no CRM · Consultor técnico notificado"
    },
    {
      question: "Equipe interna: “Qual a cláusula de garantia padrão para projetos de software sob medida?”",
      source: "Base RAG: Minuta_Padrao_Engenharia.pdf (Cláusula 8ª)",
      toolCall: "buscar_documento_interno({ doc: 'Minuta_Padrao', clausula: 8 })",
      response: "A Cláusula 8ª prevê ciclo de homologação assistida, garantia técnica sobre o escopo entregue e opção de sustentação evolutiva.",
      handoff: "Trecho citado com link direto para o documento original"
    }
  ];

  // Estado interativo da frente 04 (Automação)
  const [autoStage, setAutoStage] = useState<number>(2);

  const currentFront = STUDIO_FRONTS.find((f) => f.id === activeFront) ?? STUDIO_FRONTS[0]!;
  const ActiveIcon = currentFront.icon;

  const handleCtaClick = () => {
    trackEvent("cta_clicado", { cta: "hero_tirar_do_papel", frente: activeFront });
  };

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_aberto", { local: "hero_portal", frente: activeFront });
    const url = buildWhatsAppLink({
      customText: `Olá Pedro! Vim pelo site da Sanle (${currentFront.label} - ${currentFront.sublabel}) e gostaria de conversar sobre um projeto.`
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="portal-hero-container"
      className="relative w-full max-w-full bg-[#08090C] text-[#F5F6F8] pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 border-b border-white/[0.08] overflow-clip"
      aria-labelledby="hero-main-title"
    >
      {/* Luz direcional sutil e grade arquitetônica discreta */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-[520px] w-[520px] rounded-full blur-[150px] opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentFront.accent} 0%, transparent 70%)`
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Linha editorial superior */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#B7F36B]" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#969DA8] font-medium">
              {dict.hero.eyebrow}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#969DA8]">
            <span>BRASÍLIA · DF</span>
            <span className="text-white/20">/</span>
            <span>PRODUTOS DIGITAIS · SISTEMAS · IA · AUTOMAÇÃO</span>
          </div>
        </div>

        {/* Composição Assimétrica Editorial */}
        <div className="grid lg:grid-cols-[1.06fr_0.94fr] gap-10 lg:gap-12 items-start">
          {/* COLUNA ESQUERDA: Tese Central, Seletor das 4 Frentes e Ação */}
          <div className="max-w-2xl">
            <h1
              id="hero-main-title"
              className="font-serif-editorial font-normal text-[clamp(2.65rem,5.8vw,5.4rem)] leading-[0.96] tracking-[-0.035em] text-[#F5F6F8]"
            >
              {dict.hero.headlineTop}{" "}
              <span className="block mt-1 font-display font-bold tracking-[-0.04em] text-[#F5F6F8]">
                {dict.hero.headlineBottom}{" "}
                <span className="italic font-serif-editorial font-normal text-[#78A9FF]">
                  {dict.hero.headlineItalic}
                </span>
              </span>
            </h1>

            <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#969DA8] font-sans-editorial">
              {dict.hero.subheadline}
            </p>

            {/* Seletor Interativo das 4 Frentes no Hero */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#969DA8]">
                  SELECIONE UMA FRENTE PARA INSPECIONAR A ARQUITETURA:
                </span>
                <span className="font-mono text-[0.6rem] text-[#78A9FF] hidden sm:inline">
                  4 FRENTES INTEGRADAS
                </span>
              </div>

              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                role="tablist"
                aria-label="Frentes de atuação da Sanle"
              >
                {STUDIO_FRONTS.map((front) => {
                  const isActive = front.id === activeFront;
                  return (
                    <button
                      key={front.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveFront(front.id)}
                      className={`group relative p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#141822] border-white/25 shadow-lg shadow-black/40"
                          : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className="h-0.5 w-6 rounded-full mb-2 transition-all"
                        style={{
                          backgroundColor: isActive ? front.accent : "rgba(255,255,255,0.15)",
                          width: isActive ? "2rem" : "1.25rem"
                        }}
                      />
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#969DA8] block">
                        {front.code} · {front.label}
                      </span>
                      <span className="text-xs font-medium text-[#F5F6F8] block mt-0.5 leading-snug">
                        {front.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTAs Claros e Diretos */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={heroContent.ctaPrimary.href}
                onClick={handleCtaClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-sm transition-all duration-200 hover:bg-[#3856ff] shadow-[0_8px_28px_rgba(36,64,255,0.32)] active:scale-[0.99]"
              >
                <span>{dict.hero.ctaPrimary}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={heroContent.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/15 text-[#F5F6F8] text-sm hover:border-[#78A9FF] hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <span>{dict.hero.ctaSecondary}</span>
                <ArrowUpRight className="h-4 w-4 text-[#78A9FF]" />
              </Link>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-white/[0.02] border border-white/10 text-[#969DA8] text-xs font-mono uppercase tracking-wider hover:text-white hover:border-white/25 transition-all cursor-pointer"
                title="Conversar diretamente no WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
                <span>WhatsApp</span>
              </button>
            </div>

            <p className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[#969DA8]">
              {dict.hero.microProof}
            </p>
          </div>

          {/* COLUNA DIREITA: Estúdio Interativo "Do Papel para a Operação" (Visível em Desktop e Mobile) */}
          <div className="w-full">
            <div className="rounded-3xl border border-white/12 bg-[#0F1219]/95 p-4 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
              {/* Barra Superior do Estúdio */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg border text-white"
                    style={{
                      backgroundColor: `${currentFront.accent}20`,
                      borderColor: `${currentFront.accent}55`
                    }}
                  >
                    <ActiveIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#F5F6F8] font-semibold block">
                      ESTÚDIO DE ARQUITETURA · FRENTE {currentFront.code}
                    </span>
                    <span className="font-mono text-[0.58rem] text-[#969DA8] block">
                      {currentFront.badgeText}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[0.58rem] uppercase tracking-wider text-[#969DA8]">
                  Simulação interativa ilustrativa
                </span>
              </div>

              {/* Bloco 1: A Necessidade Bruta ("No Papel") */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#969DA8] mb-1">
                  <span>1. A NECESSIDADE NO PAPEL</span>
                  <span className="text-[#78A9FF]">PONTO DE PARTIDA</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F5F6F8] font-serif-editorial italic leading-relaxed">
                  {currentFront.ideaInput}
                </p>
              </div>

              {/* Bloco 2: Artefato Interativo Específico da Frente */}
              <div className="mt-3.5 p-4 rounded-2xl bg-[#090B10] border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#B7F36B] font-semibold">
                    2. SOLUÇÃO EM OPERAÇÃO ({currentFront.label.toUpperCase()})
                  </span>
                  <span className="font-mono text-[0.58rem] text-[#969DA8]">
                    Interaja abaixo
                  </span>
                </div>

                {/* INTERAÇÃO 01: DIGITAL */}
                {activeFront === "digital" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "posicionamento", label: "Narrativa & Direção Visual" },
                        { id: "conversao", label: "Jornada de Conversão" },
                        { id: "performance", label: "SEO & Estrutura Técnica" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setDigitalFocus(tab.id as typeof digitalFocus)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[0.62rem] transition-all cursor-pointer ${
                            digitalFocus === tab.id
                              ? "bg-[#2440FF] text-white font-semibold"
                              : "bg-white/[0.04] text-[#969DA8] hover:text-white border border-white/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#111520] border border-white/10 space-y-2">
                      {digitalFocus === "posicionamento" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-serif-editorial text-base text-white">
                              Identidade editorial com autoridade imediata
                            </span>
                            <span className="font-mono text-[0.6rem] text-[#78A9FF]">Design Autoral</span>
                          </div>
                          <p className="text-xs text-[#969DA8] leading-relaxed">
                            Substituímos templates genéricos por uma composição tipográfica clara, vitrine interativa dos seus serviços e provas reais de engenharia.
                          </p>
                        </>
                      )}
                      {digitalFocus === "conversao" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-serif-editorial text-base text-white">
                              Qualificação comercial sem fricção
                            </span>
                            <span className="font-mono text-[0.6rem] text-[#B7F36B]">WhatsApp + CRM</span>
                          </div>
                          <p className="text-xs text-[#969DA8] leading-relaxed">
                            Formulários contextuais que identificam a demanda do visitante e encaminham o briefing estruturado diretamente para o time comercial.
                          </p>
                        </>
                      )}
                      {digitalFocus === "performance" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-serif-editorial text-base text-white">
                              Engenharia web enxuta e indexável
                            </span>
                            <span className="font-mono text-[0.6rem] text-[#78A9FF]">Next.js + Schema.org</span>
                          </div>
                          <p className="text-xs text-[#969DA8] leading-relaxed">
                            Renderização híbrida, metadados semânticos JSON-LD, responsividade mobile-first e painel administrativo sob medida.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* INTERAÇÃO 02: SISTEMAS */}
                {activeFront === "systems" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[0.62rem] font-mono text-[#969DA8]">
                      <span>CLIQUE EM UMA ORDEM PARA ALTERAR O ESTÁGIO:</span>
                      <span className="text-[#C8A24A]">PostgreSQL + RLS</span>
                    </div>
                    <div className="space-y-1.5">
                      {orders.map((ord) => (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => cycleOrderStatus(ord.id)}
                          className="w-full p-2.5 rounded-xl bg-[#12151E] border border-white/10 hover:border-[#C8A24A]/50 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                          <div>
                            <span className="font-mono text-[0.62rem] text-[#78A9FF] font-semibold mr-2">
                              {ord.id}
                            </span>
                            <span className="text-xs font-medium text-white">
                              {ord.client}
                            </span>
                            <span className="block text-[0.68rem] text-[#969DA8]">
                              {ord.scope}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 font-mono text-[0.6rem] text-[#B7F36B] flex items-center gap-1 shrink-0">
                            <RefreshCw className="h-2.5 w-2.5" />
                            <span>{ord.status}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* INTERAÇÃO 03: AGENTES */}
                {activeFront === "agents" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] text-[#969DA8]">
                        CENÁRIO {agentPromptIdx + 1} DE {agentPrompts.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAgentPromptIdx((prev) => (prev === 0 ? 1 : 0))}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/15 font-mono text-[0.6rem] text-white cursor-pointer"
                      >
                        Alternar cenário de IA →
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-stone-200">
                      {agentPrompts[agentPromptIdx]!.question}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#111520] border border-[#2440FF]/30 font-mono text-[0.62rem] space-y-1">
                      <div className="flex items-center justify-between text-[#78A9FF]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Terminal className="h-3 w-3" />
                          <span>{agentPrompts[agentPromptIdx]!.source}</span>
                        </span>
                      </div>
                      <code className="block text-[#B7F36B] text-[0.6rem]">
                        {agentPrompts[agentPromptIdx]!.toolCall}
                      </code>
                      <p className="font-sans-editorial text-xs text-white pt-1">
                        {agentPrompts[agentPromptIdx]!.response}
                      </p>
                    </div>
                  </div>
                )}

                {/* INTERAÇÃO 04: AUTOMAÇÃO */}
                {activeFront === "automation" && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-4 gap-1.5 font-mono text-[0.6rem]">
                      {[
                        { idx: 0, title: "01 Entrada", sub: "Webhook / Doc" },
                        { idx: 1, title: "02 Extração", sub: "Schema JSON" },
                        { idx: 2, title: "03 Regras", sub: "Validação" },
                        { idx: 3, title: "04 Destino", sub: "ERP / CRM" }
                      ].map((step) => (
                        <button
                          key={step.idx}
                          type="button"
                          onClick={() => setAutoStage(step.idx)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            autoStage === step.idx
                              ? "bg-[#10B981]/20 border-[#10B981] text-white font-semibold"
                              : "bg-white/[0.03] border-white/10 text-[#969DA8] hover:text-white"
                          }`}
                        >
                          <span className="block text-[0.58rem]">{step.title}</span>
                          <span className="block text-[0.55rem] opacity-75 truncate">{step.sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-[#111520] border border-white/10 font-mono text-[0.64rem] text-stone-200 leading-relaxed">
                      {autoStage === 0 && "Recebimento automático de arquivos, formulários ou eventos via API/WhatsApp sem download manual."}
                      {autoStage === 1 && "Transformação do documento bruto em estrutura JSON tipada com validação de campos obrigatórios."}
                      {autoStage === 2 && "Conferência de regras de negócio, prevenção de duplicidade e fila de revisão humana para exceções."}
                      {autoStage === 3 && "Sincronização direta com seu sistema de gestão ou ERP e gravação de log de atividade."}
                    </div>
                  </div>
                )}
              </div>

              {/* Bloco 3: Entrega Arquitetural */}
              <div className="mt-3.5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start sm:items-center gap-2 text-[#969DA8]">
                  <CheckCircle2 className="h-4 w-4 text-[#B7F36B] shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[0.72rem] leading-snug">{currentFront.architectureOutput}</span>
                </div>

                <Link
                  href={`/#capacidades`}
                  className="inline-flex items-center gap-1 font-mono text-[0.64rem] text-[#78A9FF] hover:text-white shrink-0 uppercase tracking-wider"
                >
                  <span>Ver em detalhe</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
