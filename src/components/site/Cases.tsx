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
    badge: "Produto Próprio · No Repositório",
    badgeType: "real",
    problem: "Equipes comerciais perdem tempo pesquisando manualmente empresas e avaliando presença digital sem critério padronizado.",
    solution: "Motor integrado a fontes públicas que analisa a presença digital de empresas, calcula índice de oportunidade e apoia abordagens comerciais contextualizadas.",
    verifiedFeatures: [
      "Consulta territorial de empresas e estabelecimentos ativos",
      "Análise automatizada de presença digital (site, SSL, estrutura)",
      "Cálculo determinístico de pontuação de oportunidade (0 a 100)",
      "Geração assistida de roteiros de abordagem comercial"
    ],
    metrics: { label: "Módulo Proprietário", value: "Auditoria & Score B2B" },
    icon: Building2,
    ctaText: "Quero um sistema comercial",
    ctaCategory: "sistema"
  },
  {
    id: "izanagi-ai",
    name: "Izanagi AI Framework",
    category: "agents",
    categoryLabel: "Arquitetura de Agentes & Orquestração",
    badge: "Framework Interno · Ativo",
    badgeType: "internal",
    problem: "Uso desorganizado de modelos de linguagem sem contexto de projeto, sem validação de qualidade e sem divisão clara de papéis.",
    solution: "Framework de engenharia orientada a agentes especializados, catálogo de skills modulares e memória de contexto estruturada para desenvolvimento de software.",
    verifiedFeatures: [
      "Orquestração de agentes especializados por domínio técnico",
      "Catálogo modular de skills e regras de verificação",
      "Memória persistente de decisões e aprendizados de projeto",
      "Integração multi-linguagem para análise e automação"
    ],
    metrics: { label: "Arquitetura", value: "Agentes & Skills Modulares" },
    icon: Bot,
    ctaText: "Quero implementar agentes de IA",
    ctaCategory: "agente_ia"
  },
  {
    id: "pulsar-crm",
    name: "Painel Comercial & CRM",
    category: "systems",
    categoryLabel: "Pipeline Comercial & Gestão de Funil B2B",
    badge: "Módulo Proprietário · Integrado",
    badgeType: "real",
    problem: "Falta de visibilidade sobre o estágio de cada oportunidade comercial, histórico de contatos e próximas ações da equipe.",
    solution: "Ambiente administrativo para condução do funil comercial: visualização de oportunidades por etapa, gerador de páginas demonstrativas e registro de eventos.",
    verifiedFeatures: [
      "Gestão de oportunidades e leads por estágio operacional",
      "Controle de acesso e autenticação administrativa",
      "Gerador de páginas de demonstração personalizadas (/p/[slug])",
      "Histórico de interações e propostas comerciais"
    ],
    metrics: { label: "Persistência", value: "Supabase / PostgreSQL" },
    icon: Layers,
    ctaText: "Quero um CRM personalizado",
    ctaCategory: "sistema"
  },
  {
    id: "dataflow",
    name: "Pipeline Documental",
    category: "automation",
    categoryLabel: "Automação Documental & Integração",
    badge: "Arquitetura Demonstrativa",
    badgeType: "demo",
    problem: "Horas gastas conferindo documentos recebidos e redigitando informações manualmente em planilhas e sistemas de gestão.",
    solution: "Arquitetura de pipeline para recepção de arquivos, extração em schema JSON tipado, validação de regras de negócio e envio via API.",
    verifiedFeatures: [
      "Recebimento estruturado via webhooks e canais digitais",
      "Extração e validação de campos obrigatórios em JSON",
      "Conferência de regras de negócio e prevenção de duplicidade",
      "Encaminhamento de exceções para revisão humana"
    ],
    metrics: { label: "Padrão Técnico", value: "Pipeline Determinístico" },
    icon: Cpu,
    ctaText: "Quero automatizar documentos",
    ctaCategory: "automacao"
  },
  {
    id: "juridico-ia",
    name: "Assistente Documental RAG",
    category: "agents",
    categoryLabel: "Busca Semântica & Base de Conhecimento",
    badge: "Protótipo Funcional",
    badgeType: "pilot",
    problem: "Equipes técnicas e jurídicas perdem tempo localizando cláusulas, manuais internos e histórico em pastas dispersas.",
    solution: "Arquitetura de recuperação aumentada (RAG) sobre acervo próprio da empresa, priorizando respostas fundamentadas nos documentos indexados.",
    verifiedFeatures: [
      "Indexação de documentos internos, manuais e contratos",
      "Respostas acompanhadas da referência do trecho consultado",
      "Escopo restrito à base documental autorizada pela empresa",
      "Encaminhamento para especialista humano quando necessário"
    ],
    metrics: { label: "Recuperação Documental", value: "RAG com citação de fonte" },
    icon: Database,
    ctaText: "Quero um agente documental",
    ctaCategory: "agente_ia"
  },
  {
    id: "jeaps-group",
    name: "Portais & Presença Digital",
    category: "sites",
    categoryLabel: "Aplicações Web & Experiências Digitais",
    badge: "Arquitetura Web Autoral",
    badgeType: "real",
    problem: "Empresas com entrega técnica sólida, mas com presença digital desatualizada e sem fluxo claro para captação de clientes.",
    solution: "Desenvolvimento de sites institucionais e portais em Next.js com direção editorial autoral, formulários inteligentes de qualificação e integração direta com WhatsApp.",
    verifiedFeatures: [
      "Direção de arte editorial responsiva (Desktop, Tablet e Mobile)",
      "Captação contextual integrada ao WhatsApp e painel de leads",
      " Demonstrações interativas das capacidades da empresa",
      "SEO técnico estruturado e metadados Schema.org"
    ],
    metrics: { label: "Stack Web", value: "Next.js 15 + TypeScript" },
    icon: Globe,
    ctaText: "Quero um site ou portal",
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
      className="relative scroll-mt-20 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] border-b border-white/[0.08] overflow-clip w-full max-w-full"
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
              Módulos próprios, sistemas ativos e arquiteturas demonstráveis.
            </h2>

            <p className="mt-3 max-w-2xl text-base text-[#969DA8] font-sans-editorial leading-relaxed">
              Sem clientes fictícios nem números inventados. Apresentamos os sistemas proprietários, frameworks internos e protótipos funcionais construídos pela nossa engenharia.
            </p>
          </div>

          {/* Filtro por Categoria */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
            {[
              { id: "all", label: "Todos (6)" },
              { id: "sites", label: "Digital & Portais" },
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
                      <strong className="text-[#78A9FF] font-mono text-[11px] block mb-0.5">ARQUITETURA IMPLEMENTADA:</strong>
                      {proj.solution}
                    </p>
                  </div>

                  {/* Funcionalidades Verificadas */}
                  <div className="mt-4 pt-3.5 border-t border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block font-bold">
                      CARACTERÍSTICAS TÉCNICAS:
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
            <span>COMPROMISSO DE TRANSPARÊNCIA: PRODUTOS INTERNOS E PROTÓTIPOS IDENTIFICADOS COM CLAREZA</span>
          </div>
          <span>ARQUITETURAS ADAPTÁVEIS PARA O SEU NEGÓCIO</span>
        </div>
      </div>
    </section>
  );
}
