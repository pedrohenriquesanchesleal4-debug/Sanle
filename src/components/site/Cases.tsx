"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ShieldCheck, Sparkles, Building2, Layers, Cpu, Database } from "lucide-react";

interface ProductProof {
  name: string;
  category: string;
  description: string;
  whatItProves: string;
  badge: string;
  icon: typeof Building2;
  metrics: { label: string; value: string };
}

const PRODUCTS_BUILT: ProductProof[] = [
  {
    name: "Sales Hunter Engine",
    category: "Inteligência Territorial & Prospecção B2B",
    description: "Motor de busca geoespacial que localiza empresas em fontes públicas verificáveis, audita presença digital e calcula índices explicáveis de oportunidade por nicho e região.",
    whatItProves: "Engenharia de dados territorial, pontuação determinística sem consumo abusivo de APIs externas e geração contextual de abordagens 1-a-1.",
    badge: "Plataforma Ativa",
    icon: Building2,
    metrics: { label: "Capacidade de varredura", value: "Milhares de negócios" }
  },
  {
    name: "PULSAR CRM",
    category: "Pipeline Comercial & Gestão de Funil",
    description: "Plataforma de alta precisão para condução do ciclo de vendas B2B: visualização Kanban em 11 estágios, alertas de estagnação de negociações e timeline auditável de interações.",
    whatItProves: "Modelagem relacional corporativa, isolamento multi-tenant seguro com Row Level Security (RLS) e persistência de dados tolerante a falhas.",
    badge: "SaaS Comercial",
    icon: Layers,
    metrics: { label: "Controle de estágios", value: "11 fases mapeadas" }
  },
  {
    name: "Hub de Validação Documental",
    category: "Automação Operacional & Backoffice",
    description: "Pipeline de alta velocidade para ingestão, OCR estruturado e validação de regras de negócio em pedidos, faturas e contratos fiscais em menos de 0.2 segundos.",
    whatItProves: "Execução estrita de regras de negócio sem erros humanos de digitação, prevenção de duplicidades e conciliação direta com ERPs corporativos.",
    badge: "Motor Operacional",
    icon: Cpu,
    metrics: { label: "Velocidade média", value: "0.18s por doc" }
  },
  {
    name: "Barramento de ERPs & APIs",
    category: "Integração Contínua & Conectores",
    description: "Infraestrutura de microsserviços para sincronização bidirecional entre WhatsApp Business API, Omie, ContaAzul e bancos de dados relacionais.",
    whatItProves: "Tolerância a falhas com filas idempotentes, retries com backoff exponencial e consistência atômica entre sistemas terceiros.",
    badge: "Arquitetura Corporativa",
    icon: Database,
    metrics: { label: "Integridade de dados", value: "99.9% de uptime" }
  }
];

const CASE_STRUCTURE_FIELDS = [
  { label: "01. Problema inicial", desc: "Mapeamento rigoroso do gargalo e das horas drenadas na rotina." },
  { label: "02. Processo analisado", desc: "Diagrama do fluxo anterior com todos os pontos de atrito manual." },
  { label: "03. Solução implementada", desc: "Arquitetura técnica, integrações e automações construídas." },
  { label: "04. Tempo antes e depois", desc: "Medição empírica de redução de horas e prazos operacionais." },
  { label: "05. Indicadores medidos", desc: "Taxa de erro, custo por transação e ganho de capacidade comercial." },
  { label: "06. Limitações encontradas", desc: "Transparência sobre exceções e pontos que exigem aprovação humana." },
  { label: "07. Depoimento autorizado", desc: "Validação direta pelo gestor responsável na empresa atendida." },
  { label: "08. Data e contexto", desc: "Ambiente, volume mensal e parâmetros reais de operação." }
];

export function Cases() {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const showPilotOffer = process.env.NEXT_PUBLIC_PILOT_OFFER === "true";

  return (
    <section
      id="prova"
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="cases-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#78A9FF] font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>PROVA TÉCNICA E CAPACIDADE OPERACIONAL</span>
        </div>

        <h2
          id="cases-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#F5F6F8]"
        >
          Engenharia comprovada em software e sistemas reais.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#969DA8] font-sans-editorial">
          Não inventamos depoimentos nem clientes fictícios. Apresentamos a arquitetura de software,
          as plataformas proprietárias e os módulos em operação construídos para resolver problemas
          reais de mercado.
        </p>

        {/* 4 Cartões de Produtos Próprios */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {PRODUCTS_BUILT.map((prod, idx) => {
            const Icon = prod.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 flex flex-col justify-between hover:border-[#78A9FF]/60 hover:bg-[#161a22] transition-all group shadow-xl backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/20 text-[#78A9FF] font-semibold border border-[#2440FF]/30">
                      {prod.badge}
                    </span>
                    <span className="text-[#B7F36B] font-bold">{prod.metrics.value}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#78A9FF] group-hover:bg-[#2440FF] group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl md:text-3xl text-[#F5F6F8]">
                        {prod.name}
                      </h3>
                      <p className="font-mono text-xs text-[#969DA8] uppercase tracking-wider">
                        {prod.category}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#78A9FF] font-semibold mb-1">
                    Capacidade técnica comprovada:
                  </span>
                  <p className="text-xs text-[#F5F6F8] leading-relaxed">
                    {prod.whatItProves}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faixa Opcional de Projeto-Piloto */}
        {showPilotOffer && (
          <div className="mt-10 p-6 rounded-2xl bg-[#111318] border border-[#2440FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#B7F36B] shrink-0" />
              <div>
                <strong className="block text-sm text-[#F5F6F8]">
                  Estamos selecionando poucas empresas do DF para projetos-piloto
                </strong>
                <span className="text-xs text-[#969DA8]">
                  Diagnóstico completo com condições diferenciadas e acompanhamento executivo direto.
                </span>
              </div>
            </div>
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2440FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#3856ff] transition-colors shrink-0"
            >
              <span>Candidatar empresa</span>
            </Link>
          </div>
        )}

        {/* O Accordion Didático: Como a Sanle estrutura e publica novos casos */}
        <div className="mt-8 border border-white/10 rounded-2xl bg-[#111318]/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-[#969DA8]">
              Como a Sanle estrutura a documentação de novos sistemas
            </span>
            <ChevronDown className={`h-4 w-4 text-[#78A9FF] transition-transform ${accordionOpen ? "rotate-180" : ""}`} />
          </button>

          {accordionOpen && (
            <div className="p-4 sm:p-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-[#969DA8]">
              {CASE_STRUCTURE_FIELDS.map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[#F5F6F8] font-bold block mb-1">{f.label}</span>
                  <span>{f.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
