"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Layers, 
  Bot, 
  Workflow, 
  ArrowUpRight, 
  ShieldCheck, 
  Terminal, 
  Smartphone, 
  Monitor, 
  Check, 
  ArrowRight,
  Lock,
  MessageCircle
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n/I18nProvider";

type CapabilityId = "digital" | "systems" | "agents" | "automation";

interface CapabilityTab {
  id: CapabilityId;
  badge: string;
  category: string;
  name: string;
  title: string;
  description: string;
  accentColor: string;
  icon: typeof Globe;
  ctaText: string;
  ctaHref: string;
  services: string[];
}

const CAPABILITIES: CapabilityTab[] = [
  {
    id: "digital",
    badge: "01 · PRESENÇA DE ALTO NÍVEL",
    category: "DIGITAL EXPERIENCES",
    name: "Sanle Digital",
    title: "Sua empresa merece uma presença digital à altura do que entrega.",
    description: "Criamos sites, landing pages e experiências digitais que apresentam seus serviços com clareza, transmitem confiança imediata e facilitam o próximo passo comercial do seu cliente.",
    accentColor: "#2440FF",
    icon: Globe,
    ctaText: "Quero melhorar minha presença digital",
    ctaHref: "/#contato?categoria=site",
    services: [
      "Sites institucionais de direção editorial autoral",
      "Landing pages focadas em clareza e conversão comercial",
      "Redesign completo e modernização de interfaces",
      "Catálogos digitais interativos para produtos e serviços",
      "Páginas de captação e qualificação de oportunidades",
      "Sites com painel administrativo (CMS sob medida)",
      "Integração direta com WhatsApp e CRM comercial",
      "Jornadas comerciais e formulários guiados em etapas",
      "Engenharia de performance web, acessibilidade e SEO técnico"
    ]
  },
  {
    id: "systems",
    badge: "02 · SOFTWARE SOB MEDIDA",
    category: "CUSTOM SOFTWARE",
    name: "Sanle Systems",
    title: "Quando sua operação exige mais do que uma planilha.",
    description: "Desenvolvemos aplicações web, portais, CRMs e painéis gerenciais personalizados para organizar processos, centralizar informações e dar visibilidade real à liderança.",
    accentColor: "#C8A24A",
    icon: Layers,
    ctaText: "Quero desenvolver um sistema",
    ctaHref: "/#contato?categoria=sistema",
    services: [
      "Aplicações web e sistemas empresariais sob medida",
      "Dashboards executivos e painéis de controle operacional",
      "CRMs personalizados para o ciclo real da sua equipe",
      "Portais de autoatendimento para clientes e parceiros",
      "Sistemas de pedidos, orçamentos e esteiras operacionais",
      "Gestão de ordens de serviço, laudos e prazos",
      "Ferramentas internas para equipes de campo e backoffice",
      "APIs REST e camadas de integração entre sistemas",
      "MVPs estruturados para validação e lançamento de produtos"
    ]
  },
  {
    id: "agents",
    badge: "03 · INTELIGÊNCIA ARTIFICIAL",
    category: "AI AGENTS & INTELLIGENCE",
    name: "Sanle Agents",
    title: "Inteligência aplicada com contexto, limites claros e execução.",
    description: "Projetamos agentes de IA e assistentes com busca documental (RAG) que auxiliam no atendimento comercial, consultam acervos internos e acionam ferramentas conectadas à sua operação.",
    accentColor: "#B7F36B",
    icon: Bot,
    ctaText: "Quero um agente para minha empresa",
    ctaHref: "/#contato?categoria=agente_ia",
    services: [
      "Agentes de WhatsApp para triagem e qualificação inicial",
      "Coleta estruturada de informações para elaboração de propostas",
      "Assistentes internos com busca RAG em manuais e políticas",
      "Consulta contextualizada em bases de conhecimento da empresa",
      "Apoio à leitura e triagem de documentos, contratos e certidões",
      "Classificação e roteamento de demandas para especialistas",
      "Execução de ações delimitadas via chamada de ferramentas (tools)",
      "Regras de negócio e escopo de resposta definidos sob medida",
      "Transbordo transparente (human-in-the-loop) com histórico completo"
    ]
  },
  {
    id: "automation",
    badge: "04 · FLUXO CONTÍNUO",
    category: "PROCESS AUTOMATION",
    name: "Sanle Automation",
    title: "Menos trabalho repetitivo. Mais capacidade para avançar.",
    description: "Conectamos ferramentas, documentos e sistemas existentes para reduzir retrabalho manual, validar informações com segurança e manter processos operacionais fluindo.",
    accentColor: "#10B981",
    icon: Workflow,
    ctaText: "Quero automatizar um processo",
    ctaHref: "/#contato?categoria=automacao",
    services: [
      "Extração estruturada de dados de documentos fiscais e recibos",
      "Organização e indexação automática de arquivos digitais",
      "Processamento, saneamento e cruzamento de planilhas",
      "Consolidação automatizada de relatórios operacionais",
      "Fluxos de aprovação com alçadas e revisão humana de exceções",
      "Alertas e notificações operacionais por WhatsApp e e-mail",
      "Sincronização de dados entre sistemas de gestão e canais",
      "Eliminação de redigitação manual entre plataformas",
      "Pipelines determinísticos com registro de atividades"
    ]
  }
];

export function CapabilitiesShowcase() {
  const { dict } = useI18n();
  const [activeTab, setActiveTab] = useState<CapabilityId>("digital");

  // Estados interativos do simulador Digital
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  // Estados interativos do simulador Systems (Kanban)
  const [systemTasks, setSystemTasks] = useState([
    { id: "OS-491", client: "Construtora Horizonte", service: "Laudo Estrutural", stage: "analise", date: "Hoje, 10:14" },
    { id: "OS-492", client: "Metalúrgica São Paulo", service: "Calibração de Prensa", stage: "execucao", date: "Ontem" },
    { id: "OS-493", client: "Distribuidora Atlas", service: "Integração Logística", stage: "concluido", date: "24/10" }
  ]);

  const advanceTask = (taskId: string) => {
    setSystemTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStage = t.stage === "analise" ? "execucao" : t.stage === "execucao" ? "concluido" : "analise";
        return { ...t, stage: nextStage };
      })
    );
  };

  // Estados interativos do simulador Agents (Chat + Tools)
  const [agentStep, setAgentStep] = useState<number>(0);
  const agentScenarios = [
    {
      user: "Olá, gostaria de solicitar um orçamento para manutenção em nossos compressores industriais.",
      agent: "Posso ajudar. Quantos equipamentos precisam de manutenção preventiva ou corretiva e qual a localização da sua unidade?",
      tool: "identificar_categoria(tipo: 'industrial', servico: 'manutencao_preventiva')",
      toolOutput: "Demanda classificada · Prioridade: Alta · Escopo técnico pré-selecionado"
    },
    {
      user: "São 4 compressores na unidade de Brasília (SIA Trecho 3). Temos preferência para atendimento ainda esta semana.",
      agent: "Perfeito! Consultei a disponibilidade regional e registrei sua solicitação. Já estou transferindo seu atendimento para o engenheiro responsável com todo o resumo técnico.",
      tool: "criar_oportunidade_crm(unidade: 'Brasilia-SIA', ativos: 4, transferir_humano: true)",
      toolOutput: "Oportunidade registrada no CRM · Especialista acionado com histórico"
    }
  ];

  // Estados interativos do simulador Automation (Pipeline)
  const [activeAutoNode, setActiveAutoNode] = useState<number>(2);

  const currentCap = CAPABILITIES.find((c) => c.id === activeTab) ?? CAPABILITIES[0]!;

  return (
    <section
      id="capacidades"
      className="relative scroll-mt-20 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] border-b border-white/[0.08] overflow-clip w-full max-w-full"
      aria-label="As Quatro Capacidades Comerciais da Sanle"
    >
      {/* Luz ambiente volumétrica de fundo */}
      <div 
        className="pointer-events-none absolute top-1/3 -left-40 h-[600px] w-[600px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentCap.accentColor} 0%, transparent 70%)`
        }}
        aria-hidden="true"
      />

      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* =======================================================================
            CABEÇALHO DA SEÇÃO: POSICIONAMENTO E ESCOPO
           ======================================================================= */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#B7F36B]" />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#969DA8] font-medium">
              {dict.capabilities.badge}
            </span>
          </div>

          <h2 className="mt-4 font-serif-editorial text-[clamp(2.1rem,4.8vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-[#F5F6F8]">
            {dict.capabilities.headline}{" "}
            <span className="italic text-[#78A9FF] font-normal not-italic:font-serif">
              {dict.capabilities.headlineItalic}
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#969DA8] font-sans-editorial leading-relaxed max-w-2xl">
            {dict.capabilities.subheadline}
          </p>
        </div>

        {/* =======================================================================
            SELETOR PRINCIPAL DAS QUATRO CAPACIDADES
           ======================================================================= */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl md:rounded-3xl bg-[#111319]/90 border border-white/10 backdrop-blur-xl">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isActive = cap.id === activeTab;

            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => setActiveTab(cap.id)}
                className={`relative p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-[#181B23] border border-white/20 shadow-xl shadow-black/60 scale-[1.01]"
                    : "bg-transparent border border-transparent hover:bg-white/[0.03] text-[#969DA8] hover:text-white"
                }`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: cap.accentColor }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                      isActive
                        ? "bg-white/10 text-white border-white/20 shadow-inner"
                        : "bg-white/[0.03] text-[#969DA8] border-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider text-[#969DA8]">
                    {cap.badge.split("·")[0]}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] block text-[#969DA8]">
                    {cap.category}
                  </span>
                  <span className="font-serif-editorial text-lg sm:text-xl text-[#F5F6F8] font-bold block mt-0.5">
                    {cap.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =======================================================================
            PALCO DA EXPERIÊNCIA COMERCIAL: VISÃO GERAL + DEMONSTRAÇÃO INTERATIVA
           ======================================================================= */}
        <div className="mt-8 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start p-6 sm:p-8 md:p-10 rounded-3xl bg-[#111319]/80 border border-white/10 shadow-2xl backdrop-blur-2xl">
          
          {/* LADO ESQUERDO: ESCOPO COMERCIAL, ENTREGÁVEIS E CTA */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#78A9FF]">
                <currentCap.icon className="h-4 w-4" />
                <span>{currentCap.category}</span>
              </div>

              <h3 className="mt-3 font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-[#F5F6F8] leading-[1.08] tracking-tight">
                {currentCap.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-[#969DA8] font-sans-editorial leading-relaxed">
                {currentCap.description}
              </p>
            </div>

            {/* Lista dos 9 Serviços / Entregáveis */}
            <div>
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#F5F6F8] font-semibold block mb-3">
                O QUE DESENVOLVEMOS NESTA FRENTE:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentCap.services.map((srv, idx) => (
                  <div 
                    key={idx}
                    className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-2"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#B7F36B] mt-0.5" />
                    <span className="text-xs text-stone-300 font-sans-editorial leading-snug">
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ação e Contratação Direta */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              <Link
                href={currentCap.ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-xs sm:text-sm hover:bg-[#3856ff] transition-all shadow-lg shadow-[#2440FF]/30 active:scale-95"
              >
                <span>{currentCap.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={buildWhatsAppLink({ customText: `Olá! Estive no site da Sanle e gostaria de conversar sobre a solução ${currentCap.name} (${currentCap.category}).` })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-white/15 bg-white/[0.03] text-stone-300 text-xs hover:text-white hover:border-white/30 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
                <span>{dict.capabilities.talkOnWhatsapp}</span>
              </a>
            </div>
          </div>

          {/* LADO DIREITO: DEMONSTRAÇÃO VISUAL INTERATIVA ESPECÍFICA */}
          <div className="w-full">
            {/* -------------------------------------------------------------------
                DEMONSTRAÇÃO 1: SANLE DIGITAL (PREVIEW DE SITE PROFISSIONAL)
               ------------------------------------------------------------------- */}
            {activeTab === "digital" && (
              <div className="rounded-2xl border border-white/15 bg-[#090A0E] overflow-hidden shadow-2xl">
                {/* Barra do Navegador */}
                <div className="px-4 py-3 border-b border-white/10 bg-[#141720] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-[0.65rem] text-[#969DA8] hidden sm:inline">
                      preview://arquitetura-editorial
                    </span>
                  </div>

                  {/* Alternador Desktop / Mobile */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setDevicePreview("desktop")}
                      className={`p-1.5 rounded-md font-mono text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        devicePreview === "desktop"
                          ? "bg-[#2440FF] text-white"
                          : "text-[#969DA8] hover:text-white"
                      }`}
                    >
                      <Monitor className="h-3 w-3" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDevicePreview("mobile")}
                      className={`p-1.5 rounded-md font-mono text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        devicePreview === "mobile"
                          ? "bg-[#2440FF] text-white"
                          : "text-[#969DA8] hover:text-white"
                      }`}
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Área de Visualização do Site */}
                <div className={`p-5 transition-all duration-300 mx-auto ${devicePreview === "mobile" ? "max-w-[340px]" : "w-full"}`}>
                  <div className="rounded-xl border border-white/10 bg-[#12141A] p-4 sm:p-6 space-y-4">
                    {/* Header do mock */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-serif-editorial text-lg text-white font-bold">
                        Vanguard Engenharia
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-[#B7F36B] font-mono text-[10px]">
                        Protótipo Ilustrativo
                      </span>
                    </div>

                    {/* Hero do mock */}
                    <div className="space-y-2 py-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#78A9FF] block">
                        Construção Civil & Projetos Corporativos
                      </span>
                      <h4 className="font-serif-editorial text-xl sm:text-2xl text-white leading-tight">
                        Engenharia de precisão para obras e infraestrutura.
                      </h4>
                      <p className="text-xs text-[#969DA8] leading-relaxed">
                        Apresentação clara de escopo técnico, acervo de obras executadas e solicitação de proposta integrada ao WhatsApp e CRM.
                      </p>
                    </div>

                    {/* Botões do mock */}
                    <div className="flex gap-2 pt-2">
                      <span className="px-3 py-1.5 rounded-full bg-[#2440FF] text-white text-[11px] font-medium inline-flex items-center gap-1">
                        <span>Solicitar Proposta</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px]">
                        Acervo Técnico
                      </span>
                    </div>

                    {/* Pilares de Engenharia Web */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                      <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                        <span className="text-[#B7F36B] font-bold block text-xs">SSR / SSG</span>
                        <span className="text-[#969DA8] text-[9px]">Next.js 15</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                        <span className="text-[#78A9FF] font-bold block text-xs">Schema.org</span>
                        <span className="text-[#969DA8] text-[9px]">SEO Técnico</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                        <span className="text-white font-bold block text-xs">CMS + CRM</span>
                        <span className="text-[#969DA8] text-[9px]">Integrado</span>
                      </div>
                    </div>
                  </div>

                  <span className="block mt-3 text-center font-mono text-[10px] text-[#969DA8]">
                    SIMULAÇÃO ILUSTRATIVA DE COMPOSIÇÃO EDITORIAL RESPONSIVA
                  </span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                DEMONSTRAÇÃO 2: SANLE SYSTEMS (SISTEMA WEB & KANBAN INTERATIVO)
               ------------------------------------------------------------------- */}
            {activeTab === "systems" && (
              <div className="rounded-2xl border border-white/15 bg-[#090A0E] overflow-hidden shadow-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C8A24A]/20 text-[#C8A24A] border border-[#C8A24A]/40 font-mono text-xs">
                      S
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      PAINEL OPERACIONAL SOB MEDIDA
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-300">
                    Simulação · Clique nos cards
                  </span>
                </div>

                {/* Kanban Interativo com 3 Colunas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Coluna 1: Análise */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="font-mono text-[10px] uppercase text-[#969DA8] font-bold">
                        01 · Triagem
                      </span>
                      <span className="h-4 w-4 rounded-full bg-white/10 text-[9px] font-mono flex items-center justify-center text-white">
                        {systemTasks.filter((t) => t.stage === "analise").length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {systemTasks
                        .filter((t) => t.stage === "analise")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => advanceTask(task.id)}
                            className="p-3 rounded-xl border border-white/10 bg-[#13161F] hover:border-[#C8A24A]/60 transition-all cursor-pointer space-y-1 shadow-sm active:scale-98"
                            title="Clique para avançar estágio"
                          >
                            <span className="font-mono text-[9px] text-[#78A9FF] block">
                              {task.id}
                            </span>
                            <span className="text-xs font-bold text-white block">
                              {task.client}
                            </span>
                            <span className="text-[11px] text-[#969DA8] block">
                              {task.service}
                            </span>
                            <span className="text-[9px] font-mono text-amber-300 block pt-1">
                              Avançar estágio →
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Coluna 2: Em Execução */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="font-mono text-[10px] uppercase text-[#969DA8] font-bold">
                        02 · Em Execução
                      </span>
                      <span className="h-4 w-4 rounded-full bg-white/10 text-[9px] font-mono flex items-center justify-center text-white">
                        {systemTasks.filter((t) => t.stage === "execucao").length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {systemTasks
                        .filter((t) => t.stage === "execucao")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => advanceTask(task.id)}
                            className="p-3 rounded-xl border border-[#C8A24A]/40 bg-[#161822] hover:border-[#C8A24A] transition-all cursor-pointer space-y-1 shadow-md active:scale-98"
                            title="Clique para avançar estágio"
                          >
                            <span className="font-mono text-[9px] text-[#C8A24A] block">
                              {task.id}
                            </span>
                            <span className="text-xs font-bold text-white block">
                              {task.client}
                            </span>
                            <span className="text-[11px] text-[#969DA8] block">
                              {task.service}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-300 block pt-1">
                              Finalizar pedido →
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Coluna 3: Concluído */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="font-mono text-[10px] uppercase text-[#969DA8] font-bold">
                        03 · Concluído
                      </span>
                      <span className="h-4 w-4 rounded-full bg-white/10 text-[9px] font-mono flex items-center justify-center text-white">
                        {systemTasks.filter((t) => t.stage === "concluido").length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {systemTasks
                        .filter((t) => t.stage === "concluido")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => advanceTask(task.id)}
                            className="p-3 rounded-xl border border-white/10 bg-[#0E1015] hover:border-white/30 transition-all cursor-pointer space-y-1 opacity-75 active:scale-98"
                            title="Clique para reiniciar ciclo de teste"
                          >
                            <span className="font-mono text-[9px] text-emerald-400 block">
                              {task.id} · Concluído
                            </span>
                            <span className="text-xs font-bold text-white block">
                              {task.client}
                            </span>
                            <span className="text-[11px] text-[#969DA8] block">
                              {task.service}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400 block pt-1">
                              Reiniciar ciclo ↺
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-[#969DA8]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#B7F36B]" />
                    <span>PostgreSQL com Row Level Security (RLS)</span>
                  </span>
                  <span>Controle de acesso por perfil</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                DEMONSTRAÇÃO 3: SANLE AGENTS (SIMULADOR DE CONVERSA & TOOL CALLING)
               ------------------------------------------------------------------- */}
            {activeTab === "agents" && (
              <div className="rounded-2xl border border-white/15 bg-[#090A0E] overflow-hidden shadow-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#B7F36B]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      AGENTE COM RAG & TOOL CALLING
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#B7F36B]/10 text-[#B7F36B] border border-[#B7F36B]/20">
                    Simulação Ilustrativa
                  </span>
                </div>

                {/* Janela de Conversa Interativa */}
                <div className="space-y-3 min-h-[190px]">
                  {/* Mensagem do Cliente */}
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <span className="h-6 w-6 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center text-white shrink-0 mt-0.5">
                      C
                    </span>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/10 text-xs text-stone-200 leading-relaxed font-sans-editorial">
                      {agentScenarios[agentStep]?.user}
                    </div>
                  </div>

                  {/* Resposta do Agente */}
                  <div className="flex items-start gap-2 max-w-[85%] ml-auto flex-row-reverse">
                    <span className="h-6 w-6 rounded-full bg-[#2440FF] text-[10px] font-mono flex items-center justify-center text-white shrink-0 mt-0.5">
                      IA
                    </span>
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-[#2440FF]/20 border border-[#2440FF]/30 text-xs text-white leading-relaxed font-sans-editorial">
                      {agentScenarios[agentStep]?.agent}
                    </div>
                  </div>

                  {/* Ação de Ferramenta Executada (Tool-calling transparente) */}
                  <div className="p-2.5 rounded-xl border border-white/10 bg-[#12151D] font-mono text-[10px] space-y-1">
                    <div className="flex items-center justify-between text-[#B7F36B]">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Terminal className="h-3 w-3" />
                        <span>AÇÃO ESTRUTURADA (TOOL CALL):</span>
                      </span>
                      <span className="text-[#969DA8]">Escopo Delimitado</span>
                    </div>
                    <code className="text-[#78A9FF] block text-[9.5px]">
                      {agentScenarios[agentStep]?.tool}
                    </code>
                    <span className="text-stone-300 block text-[9.5px]">
                      Resultado: {agentScenarios[agentStep]?.toolOutput}
                    </span>
                  </div>
                </div>

                {/* Botão de Avanço do Diálogo */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAgentStep((prev) => (prev === 0 ? 1 : 0))}
                    className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 font-mono text-xs text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{agentStep === 0 ? "Próxima mensagem do cliente →" : "Reiniciar diálogo ↺"}</span>
                  </button>

                  <span className="font-mono text-[10px] text-[#969DA8]">
                    Passo {agentStep + 1} de {agentScenarios.length}
                  </span>
                </div>

                {/* Card de Arquitetura e Confiança */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[10px] text-[#969DA8] space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-[#B7F36B]" />
                    <span>GOVERNANÇA DE IA & LIMITES OPERACIONAIS</span>
                  </span>
                  <p className="text-[9.5px] leading-relaxed text-stone-300">
                    Agentes projetados para consultar bases documentais autorizadas da empresa (RAG), aplicar validação de schema nas chamadas de ferramentas e transferir para atendimento humano em decisões críticas.
                  </p>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                DEMONSTRAÇÃO 4: SANLE AUTOMATION (PIPELINE DE FLUXO CONTÍNUO)
               ------------------------------------------------------------------- */}
            {activeTab === "automation" && (
              <div className="rounded-2xl border border-white/15 bg-[#090A0E] overflow-hidden shadow-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      PIPELINE OPERACIONAL EM 5 ETAPAS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Simulação de Fluxo
                  </span>
                </div>

                {/* Sequência dos 5 Nós Clicáveis */}
                <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                  {[
                    { step: "01", label: "Entrada", desc: "WhatsApp / E-mail" },
                    { step: "02", label: "Extração", desc: "Schema Tipado" },
                    { step: "03", label: "Validação", desc: "Regras Fiscais" },
                    { step: "04", label: "Integração", desc: "ERP / Sistema" },
                    { step: "05", label: "Registro", desc: "Log de Evento" }
                  ].map((node, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveAutoNode(i)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        activeAutoNode === i
                          ? "bg-[#10B981]/20 border-[#10B981] text-white shadow-md scale-105 font-bold"
                          : "bg-white/[0.03] border-white/10 text-[#969DA8] hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="block text-[8.5px] opacity-75">{node.step}</span>
                      <span className="block text-[10px] truncate">{node.label}</span>
                    </button>
                  ))}
                </div>

                {/* Detalhe do Nó Ativo */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#12141A] font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[#10B981]">
                    <span className="font-bold">
                      ETAPA ATIVA: {["ENTRADA DE DADOS", "PROCESSAMENTO & EXTRAÇÃO", "VALIDAÇÃO DE REGRAS", "INTEGRAÇÃO COM SISTEMA", "REGISTRO OPERACIONAL"][activeAutoNode]}
                    </span>
                    <span className="text-[#969DA8] text-[10px]">Rastreável</span>
                  </div>

                  {activeAutoNode === 0 && (
                    <p className="text-[#969DA8] text-[11px] leading-relaxed">
                      Recebimento automático de documentos (PDF/XML), formulários ou anexos enviados por clientes em canais oficiais de comunicação.
                    </p>
                  )}
                  {activeAutoNode === 1 && (
                    <div className="p-2 rounded bg-black/50 text-[10px] text-stone-300 font-mono">
                      <code>{`{\n  "doc": "NF-e #4912",\n  "cnpj_emitente": "18.234.567/0001-90",\n  "valor_total": 4890.50,\n  "itens": 3\n}`}</code>
                    </div>
                  )}
                  {activeAutoNode === 2 && (
                    <p className="text-[#969DA8] text-[11px] leading-relaxed">
                      Conferência automática contra parâmetros do pedido e checagem anti-duplicidade. Caso haja divergência, encaminha para fila de revisão humana.
                    </p>
                  )}
                  {activeAutoNode === 3 && (
                    <p className="text-[#969DA8] text-[11px] leading-relaxed">
                      Envio estruturado via API ou webhook para o ERP, CRM ou banco de dados utilizado pela empresa, evitando redigitação manual.
                    </p>
                  )}
                  {activeAutoNode === 4 && (
                    <p className="text-[#969DA8] text-[11px] leading-relaxed">
                      Atualização do status no painel gerencial e gravação de log estruturado com horário, origem e resultado do processamento.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-[#969DA8]">
                  <span>Validação de schema JSON + retries controlados</span>
                  <span className="text-[#10B981]">Revisão humana para exceções</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
