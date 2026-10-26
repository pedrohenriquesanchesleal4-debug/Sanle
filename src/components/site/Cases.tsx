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
    metrics: { label: "Tempo de validação", value: "< 0.2s por arquivo" }
  },
  {
    name: "Barramento Corporativo de Integrações",
    category: "Conectores de Sistemas & APIs",
    description: "Infraestrutura de sincronização bidirecional conectando canais de atendimento direto (WhatsApp), bancos de dados relacionais e ERPs de mercado (Omie, ContaAzul, TOTVS).",
    whatItProves: "Integração resiliente de sistemas heterogêneos, mensageria com retry automático e integridade contínua de registros sem perdas.",
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
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] overflow-hidden w-full max-w-full"
      aria-labelledby="cases-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2440FF] font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>PROVA TÉCNICA E CAPACIDADE OPERACIONAL</span>
        </div>

        <h2
          id="cases-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#121110]"
        >
          Engenharia comprovada em software e sistemas reais.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#4A453E] font-sans-editorial">
          Não inventamos depoimentos nem clientes fictícios. Apresentamos a arquitetura de software,
          as plataformas proprietárias e os módulos em operação construídos para resolver problemas
          reais de mercado.
        </p>

        {/* 4 Cartões de Produtos Próprios */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS_BUILT.map((prod, idx) => {
            const Icon = prod.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] flex flex-col justify-between hover:border-[#2440FF]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/10 text-[#2440FF] font-semibold border border-[#2440FF]/15">
                      {prod.badge}
                    </span>
                    <span className="text-[#8A837A] font-medium">{prod.metrics.value}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] flex items-center justify-center text-[#2440FF] group-hover:bg-[#2440FF] group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl md:text-3xl text-[#121110]">
                        {prod.name}
                      </h3>
                      <p className="font-mono text-xs text-[#8A837A] uppercase tracking-wider">
                        {prod.category}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(18,17,16,0.06)]">
                  <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#2440FF] font-semibold mb-1">
                    Capacidade técnica comprovada:
                  </span>
                  <p className="text-xs text-[#121110] leading-relaxed">
                    {prod.whatItProves}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faixa Opcional de Projeto-Piloto */}
        {showPilotOffer && (
          <div className="mt-10 p-6 rounded-2xl bg-white border border-[#2440FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#2440FF] shrink-0" />
              <div>
                <strong className="block text-sm text-[#121110]">
                  Estamos selecionando poucas empresas do DF para projetos-piloto
                </strong>
                <span className="text-xs text-[#4A453E]">
                  Diagnóstico completo com condições diferenciadas e acompanhamento executivo direto.
                </span>
              </div>
            </div>
            <Link
              href="/diagnostico"
              className="px-5 py-2.5 rounded-full bg-[#121110] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-sm shrink-0"
            >
              Candidatar minha empresa
            </Link>
          </div>
        )}

        {/* Acordeão Recolhido: Modelo do Primeiro Case Autorizado */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm">
          <button
            type="button"
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex items-center justify-between text-left font-mono text-xs uppercase tracking-[0.16em] text-[#4A453E] hover:text-[#121110] transition-colors"
          >
            <span>Critérios rigorosos de auditoria para cada projeto implementado</span>
            <div className="flex items-center gap-2">
              <span className="text-[#2440FF] font-semibold">{accordionOpen ? "Recolher estrutura" : "Ver metodologia de 8 etapas"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${accordionOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {accordionOpen && (
            <div className="mt-6 pt-6 border-t border-[rgba(18,17,16,0.06)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CASE_STRUCTURE_FIELDS.map((field, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(18,17,16,0.06)]">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[#2440FF] font-semibold block mb-1">
                    {field.label}
                  </span>
                  <span className="text-xs text-[#4A453E] leading-relaxed">
                    {field.desc}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
