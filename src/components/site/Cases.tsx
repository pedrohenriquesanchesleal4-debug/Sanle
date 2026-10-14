"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";

interface ProductProof {
  name: string;
  category: string;
  description: string;
  whatItProves: string;
  badge: string;
  link?: string;
}

const PRODUCTS_BUILT: ProductProof[] = [
  {
    name: "Izanagi AI",
    category: "Framework Open Source & Engenharia Autônoma",
    description: "Framework multiagente modular publicado no npm para engenharia autônoma de software.",
    whatItProves: "Capacidade de arquitetar pipelines de inteligência artificial com 23 agentes e mais de 200 skills.",
    badge: "npm: izanagi-ai",
    link: "https://www.npmjs.com/package/izanagi-ai"
  },
  {
    name: "PULSAR",
    category: "SaaS Comercial & CRM Operacional",
    description: "Plataforma completa de prospecção, qualificação e gestão comercial desenvolvida do zero.",
    whatItProves: "Domínio de modelagem relacional, isolamento multi-tenant, segurança RLS e pipelines assíncronos.",
    badge: "SaaS Proprietário"
  },
  {
    name: "Jurídico IA",
    category: "RAG & Inteligência Documental",
    description: "Sistema de recuperação aumentada por geração e indexação vetorial sobre acervos contratuais.",
    whatItProves: "Engenharia de RAG, embeddings locais, busca híbrida e guardrails determinísticos sem alucinação.",
    badge: "RAG & Vetores"
  },
  {
    name: "JEAPS Group",
    category: "Plataforma de Automação & IA",
    description: "Ecossistema de integração de sistemas, automação de processos internos e inteligência aplicada.",
    whatItProves: "Integração resiliente de APIs heterogêneas, orquestração de rotinas e mitigação de falhas.",
    badge: "Plataforma"
  }
];

const CASE_STRUCTURE_FIELDS = [
  { label: "01. Problema inicial", desc: "Mapeamento rigoroso do gargalo e das horas drenadas." },
  { label: "02. Processo analisado", desc: "Diagrama do fluxo anterior com todos os pontos de atrito manual." },
  { label: "03. Solução implementada", desc: "Arquitetura técnica, integrações e automações construídas." },
  { label: "04. Tempo antes e depois", desc: "Medição empírica de redução de horas e prazos operacionais." },
  { label: "05. Indicadores medidos", desc: "Taxa de erro, custo por transação e ganho de capacidade." },
  { label: "06. Limitações encontradas", desc: "Transparência sobre exceções e o que ainda requer atenção humana." },
  { label: "07. Depoimento autorizado", desc: "Validação direta pelo gestor responsável na empresa atendida." },
  { label: "08. Data e contexto", desc: "Ambiente, volume mensal e parâmetros reais de operação." }
];

export function Cases() {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const showPilotOffer = process.env.NEXT_PUBLIC_PILOT_OFFER === "true";

  return (
    <section
      id="prova"
      className="relative scroll-mt-20 py-24 md:py-32 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)]"
      aria-labelledby="cases-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2440FF] font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>PROVA TÉCNICA E TRANSPARÊNCIA</span>
        </div>

        <h2
          id="cases-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#121110]"
        >
          Ainda não publicamos cases. Mostramos o que já construímos.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#4A453E] font-sans-editorial">
          A postura da Sanle é rigorosa: nada de números, depoimentos ou clientes inventados.
          Em vez de simular cases fictícios, apresentamos os produtos de engenharia e software
          criados pelo nosso fundador.
        </p>

        {/* 4 Cartões de Produtos Próprios */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS_BUILT.map((prod, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] flex flex-col justify-between hover:border-[#2440FF]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/10 text-[#2440FF] font-semibold border border-[#2440FF]/15">
                    {prod.badge}
                  </span>
                  <span className="text-[#8A837A]">PRODUTO PRÓPRIO</span>
                </div>

                <h3 className="mt-5 font-serif-editorial text-2xl md:text-3xl text-[#121110]">
                  {prod.name}
                </h3>

                <p className="mt-1 font-mono text-xs text-[#8A837A] uppercase tracking-wider">
                  {prod.category}
                </p>

                <p className="mt-4 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                  {prod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(18,17,16,0.06)]">
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#2440FF] font-semibold mb-1">
                  O que este produto prova:
                </span>
                <p className="text-xs text-[#121110] leading-relaxed">
                  {prod.whatItProves}
                </p>

                {prod.link && (
                  <a
                    href={prod.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#2440FF] font-semibold hover:underline"
                  >
                    <span>Acessar repositório / pacote</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
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
            <span>O formato do nosso primeiro case autorizado já está definido</span>
            <div className="flex items-center gap-2">
              <span className="text-[#2440FF] font-semibold">{accordionOpen ? "Recolher modelo" : "Ver estrutura de 8 itens"}</span>
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
