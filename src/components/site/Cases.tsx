"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Building2, 
  Layers, 
  Cpu, 
  Database, 
  Bot, 
  Globe, 
  ArrowUpRight, 
  CheckCircle2
} from "lucide-react";

interface ProjectProof {
  id: string;
  name: string;
  category: "sites" | "systems" | "agents" | "automation";
  categoryLabel: string;
  badge: string;
  badgeType: "real" | "internal" | "pilot" | "demo";
  problem: string;
  solution: string;
  verifiedFeatures: string[];
  metrics: { label: string; value: string };
  icon: typeof Building2;
  ctaText: string;
  ctaCategory: string;
}

const PROJECTS_PORTFOLIO: ProjectProof[] = [
  {
    id: "sales-hunter",
    name: "Sales Hunter Engine",
    category: "systems",
    categoryLabel: "Prospecção B2B & Inteligência Comercial",
    badge: "Produto Próprio · Em Operação",
    badgeType: "real",
    problem: "Empresas perdem semanas construindo listas frias e desatualizadas de prospects sem dados territoriais confiáveis.",
    solution: "Motor geoespacial integrado a fontes públicas abertas que audita a presença digital de empresas, calcula índice de oportunidade e gera abordagens 1-a-1 contextualizadas.",
    verifiedFeatures: [
      "Varredura territorial de CNPJs e estabelecimentos ativos",
      "Auditoria automática de presença digital (site, SSL, mobile)",
      "Cálculo determinístico de oportunidade (0 a 100)",
      "Geração contextual de cópias de abordagem comercial"
    ],
    metrics: { label: "Capacidade de análise", value: "Milhares de negócios" },
    icon: Building2,
    ctaText: "Quero um sistema de prospecção",
    ctaCategory: "sistema"
  },
  {
    id: "izanagi-ai",
    name: "Izanagi AI Framework",
    category: "agents",
    categoryLabel: "Arquitetura de Agentes & Orquestração Multiagente",
    badge: "Projeto de Software · Ativo",
    badgeType: "internal",
    problem: "Agentes de IA genéricos sofrem com alucinação, código incompleto (stubs) e falta de governança estruturada.",
    solution: "Framework meta para engenharia de software autônoma com 23 agentes especializados, memória persistente anti-repetição, 107 skills no catálogo e motor poliglota (Rust, Go, Python e TypeScript).",
    verifiedFeatures: [
      "Orquestração em swarm com isolamento de contexto",
      "Heurísticas anti-slop e qualidade de código em Rust",
      "Análise sintática de AST multilíngue em Python",
      "Memória persistente entre sessões (.agents/memoria/)"
    ],
    metrics: { label: "Catálogo de agentes", value: "23 agentes especializados" },
    icon: Bot,
    ctaText: "Quero implementar agentes de IA",
    ctaCategory: "agente_ia"
  },
  {
    id: "pulsar-crm",
    name: "PULSAR CRM",
    category: "systems",
    categoryLabel: "Pipeline Comercial & Gestão de Funil B2B",
    badge: "Módulo Ativo · Em Operação",
    badgeType: "real",
    problem: "Vendas B2B estagnadas por falta de visibilidade entre as etapas de qualificação, proposta e fechamento.",
    solution: "Plataforma de alta precisão para condução do ciclo de vendas: visualização Kanban em 11 estágios, alertas de estagnação de negociações, timeline auditável e permissões seguras.",
    verifiedFeatures: [
      "Kanban de vendas com 11 fases operacionais configuráveis",
      "Isolamento multi-tenant seguro com Row Level Security (RLS)",
      "Registro de atividades e histórico de interações com clientes",
      "Lembretes automáticos para acompanhamento de propostas"
    ],
    metrics: { label: "Arquitetura", value: "PostgreSQL RLS Seguro" },
    icon: Layers,
    ctaText: "Quero um CRM personalizado",
    ctaCategory: "sistema"
  },
  {
    id: "dataflow",
    name: "DataFlow Enterprise",
    category: "automation",
    categoryLabel: "Automação Documental & Conciliação Financeira",
    badge: "Demonstração Operacional",
    badgeType: "demo",
    problem: "Horas gastas redigitando notas fiscais, faturas e comprovantes em planilhas sem rastreabilidade nem validação.",
    solution: "Pipeline de alta velocidade para ingestão, OCR estruturado e validação de regras de negócio em pedidos e faturas em menos de 0.2 segundos com conciliação contábil.",
    verifiedFeatures: [
      "Ingestão imediata via WhatsApp e caixas de e-mail",
      "Extração determinística de schemas JSON tipados",
      "Conferência fiscal instantânea contra regras de contrato",
      "Sincronização com ERPs (Omie, ContaAzul, SAP, TOTVS)"
    ],
    metrics: { label: "Velocidade média", value: "0.18s por documento" },
    icon: Cpu,
    ctaText: "Quero automatizar documentos",
    ctaCategory: "automacao"
  },
  {
    id: "juridico-ia",
    name: "Jurídico IA",
    category: "agents",
    categoryLabel: "Inteligência Artificial Aplicada & RAG",
    badge: "Piloto em Testes Controlados",
    badgeType: "pilot",
    problem: "Escritórios de advocacia perdem tempo excessivo localizando teses, contratos antigos e precedentes internos em pastas desorganizadas.",
    solution: "Assistente de recuperação semântica (RAG) em bases processuais e contratos com busca vetorial estrita, citação precisa de páginas e fontes e limites rígidos contra alucinações.",
    verifiedFeatures: [
      "Indexação vetorial de PDFs jurídicos e peças processuais",
      "Respostas com citação explícita de trechos e páginas",
      "Guardrails de compliance e privacidade de dados",
      "Triagem preliminar de certidões e prazos"
    ],
    metrics: { label: "RAG Determinístico", value: "Zero alucinação factual" },
    icon: Database,
    ctaText: "Quero um agente documental",
    ctaCategory: "agente_ia"
  },
  {
    id: "jeaps-group",
    name: "Jeaps Group Portal",
    category: "sites",
    categoryLabel: "Aplicação Web & Portal Corporativo",
    badge: "Estudo de Caso · Sistema Web",
    badgeType: "real",
    problem: "Apresentação institucional fragmentada sem canal estruturado para captação de clientes e controle de chamados.",
    solution: "Plataforma web integrada combinando presença digital de alto impacto visual, formulários dinâmicos de atendimento e painel administrativo para gestão de solicitações em tempo real.",
    verifiedFeatures: [
      "Interface corporativa responsiva com carregamento sub-segundo",
      "Integração direta de captação de leads com WhatsApp",
      "Painel administrativo para controle e despacho de demandas",
      "SEO técnico estruturado com pontuação máxima"
    ],
    metrics: { label: "Design System", value: "Next.js 15 + Tailwind" },
    icon: Globe,
    ctaText: "Quero um portal para minha empresa",
    ctaCategory: "site"
  }
];

export function Cases() {
  const [activeFilter, setActiveFilter] = useState<"all" | "sites" | "systems" | "agents" | "automation">("all");

  const filteredProjects = activeFilter === "all" 
    ? PROJECTS_PORTFOLIO 
    : PROJECTS_PORTFOLIO.filter((p) => p.category === activeFilter);

  return (
    <section
      id="prova"
      className="relative scroll-mt-16 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] border-b border-white/[0.08] select-none overflow-clip w-full max-w-full"
      aria-labelledby="cases-title"
    >
      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Cabeçalho de Provas Reais */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#78A9FF] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>PROVAS DE CAPACIDADE & ENGENHARIA</span>
            </div>

            <h2
              id="cases-title"
              className="mt-3 font-serif-editorial text-[clamp(2.1rem,4.8vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-[#F5F6F8]"
            >
              Projetos próprios, sistemas reais e demonstrações funcionais.
            </h2>

            <p className="mt-3 max-w-2xl text-base text-[#969DA8] font-sans-editorial leading-relaxed">
              Não inventamos depoimentos nem clientes fictícios. Apresentamos a arquitetura de software, as plataformas 
              proprietárias e os módulos em operação construídos para resolver problemas reais de mercado.
            </p>
          </div>

          {/* Filtro por Categoria */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
            {[
              { id: "all", label: "Todos (6)" },
              { id: "sites", label: "Sites & Portais" },
              { id: "systems", label: "Sistemas & CRMs" },
              { id: "agents", label: "Agentes & IA" },
              { id: "automation", label: "Automação" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-[#2440FF] text-white font-bold shadow-md shadow-[#2440FF]/30"
                    : "text-[#969DA8] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade dos 6 Projetos */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const Icon = proj.icon;

            const badgeStyles = {
              real: "bg-[#2440FF]/20 text-[#78A9FF] border-[#2440FF]/40",
              internal: "bg-[#B7F36B]/15 text-[#B7F36B] border-[#B7F36B]/30",
              pilot: "bg-amber-500/15 text-amber-300 border-amber-500/30",
              demo: "bg-white/10 text-stone-300 border-white/20"
            }[proj.badgeType];

            return (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-2xl md:rounded-3xl bg-[#111319]/90 border border-white/10 flex flex-col justify-between hover:border-[#78A9FF]/50 hover:bg-[#151822] transition-all group shadow-xl backdrop-blur-xl"
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${badgeStyles}`}>
                      {proj.badge}
                    </span>
                    <span className="font-mono text-xs text-[#B7F36B] font-bold">
                      {proj.metrics.value}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#78A9FF] group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl text-[#F5F6F8] leading-tight">
                        {proj.name}
                      </h3>
                      <p className="font-mono text-[11px] text-[#969DA8] uppercase tracking-wider">
                        {proj.categoryLabel}
                      </p>
                    </div>
                  </div>

                  {/* Problema & Solução */}
                  <div className="mt-4 space-y-2.5 font-sans-editorial text-xs sm:text-sm">
                    <p className="text-[#969DA8] leading-relaxed">
                      <strong className="text-white font-mono text-[11px] block mb-0.5">O DESAFIO:</strong>
                      {proj.problem}
                    </p>
                    <p className="text-stone-300 leading-relaxed">
                      <strong className="text-[#78A9FF] font-mono text-[11px] block mb-0.5">SOLUÇÃO IMPLEMENTADA:</strong>
                      {proj.solution}
                    </p>
                  </div>

                  {/* Funcionalidades Verificadas */}
                  <div className="mt-4 pt-3.5 border-t border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block font-bold">
                      FUNCIONALIDADES VERIFICADAS:
                    </span>
                    {proj.verifiedFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#B7F36B] shrink-0 mt-0.5" />
                        <span className="text-[11.5px] leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rodapé e CTA Contextual */}
                <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#969DA8]">
                    {proj.metrics.label}
                  </span>

                  <Link
                    href={`/#contato?categoria=${proj.ctaCategory}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#78A9FF] group-hover:text-white transition-colors"
                  >
                    <span>{proj.ctaText}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé de Rigor e Transparência */}
        <div className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#969DA8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>TRANSPARÊNCIA TOTAL: PRODUTOS PRÓPRIOS IDENTIFICADOS · SEM FALSOS CLIENTES</span>
          </div>
          <span>ARQUITETURAS DISPONÍVEIS PARA ADAPTAÇÃO EMPRESARIAL</span>
        </div>
      </div>
    </section>
  );
}
