"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  AlertCircle, 
  ArrowDown, 
  FileSearch, 
  Tag, 
  Split, 
  Copy, 
  Clock, 
  MessageSquareWarning, 
  RotateCw,
  CheckCircle2,
  XCircle,
  TrendingDown
} from "lucide-react";
import { invisibleWork } from "@/content/brand";

interface ForensicDossier {
  tag: string;
  metric: string;
  evidenceTitle: string;
  evidenceDetail: string;
  icon: typeof FileSearch;
  badgeColor: string;
}

const FORENSIC_DOSSIERS: ForensicDossier[] = [
  {
    tag: "Dispersão Crítica",
    metric: "~42 min por documento",
    evidenceTitle: "4 Silos Fragmentados de Busca",
    evidenceDetail: "Arquivos espalhados entre WhatsApp pessoal, Google Drive, threads de e-mail e downloads locais sem indexação.",
    icon: FileSearch,
    badgeColor: "text-[#2440FF] bg-[#2440FF]/10 border-[#2440FF]/20"
  },
  {
    tag: "Falta de Padrão",
    metric: "100% manual e variável",
    evidenceTitle: "Nomenclatura Caótica de Arquivos",
    evidenceDetail: "'NF_final_v2(1).pdf' vs 'RECIBO_AGOSTO_NOVO.png' — arquivos ilegíveis para sistemas e impossíveis de auditar.",
    icon: Tag,
    badgeColor: "text-[#C8A24A] bg-[#C8A24A]/10 border-[#C8A24A]/20"
  },
  {
    tag: "Risco Fiscal Oculto",
    metric: "R$ 8 a R$ 2.400 em divergências",
    evidenceTitle: "Divergência Notada Tardiamente",
    evidenceDetail: "Boleto emitido em valor sutilmente diferente do pedido de compra. Invisível a olho nu, trava o fechamento contábil.",
    icon: Split,
    badgeColor: "text-red-600 bg-red-600/10 border-red-600/20"
  },
  {
    tag: "Digitação Tripla",
    metric: "3 a 5 softwares por processo",
    evidenceTitle: "Cópia Manual de Dados entre Telas",
    evidenceDetail: "O mesmo colaborador digita os mesmos dados no ERP, na planilha de fluxo de caixa e no e-mail de confirmação.",
    icon: Copy,
    badgeColor: "text-[#2440FF] bg-[#2440FF]/10 border-[#2440FF]/20"
  },
  {
    tag: "Propagação do Erro",
    metric: "3 dias perdidos no fechamento",
    evidenceTitle: "Timeline de Contaminação Operacional",
    evidenceDetail: "Centavos digitados errados no dia 03 viram fechamento contábil rejeitado e força-tarefa de emergência no dia 30.",
    icon: Clock,
    badgeColor: "text-red-600 bg-red-600/10 border-red-600/20"
  },
  {
    tag: "Comunicação Fragmentada",
    metric: "Zero SLA e zero dono",
    evidenceTitle: "Pendências Perdidas em Mensagens",
    evidenceDetail: "Cobranças de aprovação feitas por chat sem registro central. Faturas vencem e descontos são perdidos por inércia.",
    icon: MessageSquareWarning,
    badgeColor: "text-[#C8A24A] bg-[#C8A24A]/10 border-[#C8A24A]/20"
  },
  {
    tag: "Loop Crônico",
    metric: "32% do tempo sem valor",
    evidenceTitle: "22 Dias Úteis de Repetição Manual",
    evidenceDetail: "As mesmas 38 microtarefas refeitas do zero todos os dias, dependendo exclusivamente da memória das pessoas.",
    icon: RotateCw,
    badgeColor: "text-[#2440FF] bg-[#2440FF]/10 border-[#2440FF]/20"
  }
];

export function PinnedProblems() {
  const [activeItem, setActiveItem] = useState(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) {
              setActiveItem(index);
              entry.target.classList.add("is-visible");
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.2
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="problema"
      className="relative bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] py-10 sm:py-16 md:py-24 select-none overflow-hidden w-full max-w-full"
      aria-label="Ambiente 02: O Custo Invisível da Operação · Investigação dos 7 Gargalos"
    >
      {/* Luz ambiente forense de fundo (azul cobalto e latão) */}
      <div
        className="pointer-events-none absolute top-1/4 -left-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,transparent_70%)] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-48 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,162,74,0.04)_0%,transparent_70%)] blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* =======================================================================
              PAINEL FIXADO DO INVESTIGADOR (Sticky Companion no Desktop)
             ======================================================================= */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(18,17,16,0.08)] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#4A453E] font-medium">
                AMBIENTE 02 · INVESTIGAÇÃO FORENSE
              </span>
            </div>

            <h2 className="font-serif-editorial text-[clamp(2rem,4vw,3.6rem)] leading-[1.04] tracking-[-0.03em] text-[#121110]">
              Tarefas pequenas que, somadas, custam a operação inteira.
            </h2>

            <p className="text-base sm:text-lg text-[#4A453E] font-sans-editorial leading-relaxed max-w-lg">
              Elas não aparecem no relatório de diretoria nem constam em nenhuma linha de orçamento. 
              Ninguém as mede. Mas consomem até 32% do tempo todos os dias, tornando qualquer crescimento pesado e caro.
            </p>

            {/* Painel de status forense em tempo real */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm space-y-3 max-w-lg">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8A837A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2440FF]" />
                  <span>Dossiê sob análise:</span>
                </span>
                <span className="text-[#2440FF] font-bold">
                  0{activeItem + 1} / 0{invisibleWork.length}
                </span>
              </div>

              {/* Barra de progresso dos 7 gargalos investigados */}
              <div className="flex gap-1.5 w-full">
                {invisibleWork.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                      i === activeItem
                        ? "bg-[#2440FF] scale-y-125"
                        : i < activeItem
                        ? "bg-[#121110] opacity-40"
                        : "bg-[rgba(18,17,16,0.1)]"
                    }`}
                  />
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-[#8A837A] font-mono">
                <span>Investigação em andamento</span>
                <span className="text-[#2440FF] font-semibold">
                  {invisibleWork[activeItem]?.title}
                </span>
              </div>
            </div>

            {/* Ações diretas e ponte para o clímax financeiro */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-sm"
              >
                <span>Mapear meus gargalos</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#calculadora"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4A453E] hover:text-[#2440FF] transition-colors py-2 px-3 rounded-lg border border-[rgba(18,17,16,0.06)] hover:border-[#2440FF]/30 bg-white"
              >
                <ArrowDown className="h-3.5 w-3.5 text-[#2440FF]" />
                <span>Calcular custo em R$</span>
              </a>
            </div>

            {/* Chamada para o Clímax da Investigação */}
            <div className="p-3.5 rounded-xl bg-[#2440FF]/5 border border-[#2440FF]/15 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2440FF] font-semibold mb-1">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>CLÍMAX DA INVESTIGAÇÃO</span>
              </div>
              <p className="text-xs text-[#4A453E] leading-relaxed">
                Ao término dos 7 gargalos, a calculadora logo abaixo quantifica o valor monetário exato que sua empresa perde por mês com base em 22 dias úteis.
              </p>
            </div>
          </div>

          {/* =======================================================================
              COLUNA DE EVIDÊNCIAS FORENSES: OS 7 GARGALOS COM REPRESENTAÇÃO VISUAL
             ======================================================================= */}
          <div className="space-y-4 sm:space-y-6">
            {invisibleWork.map((item, index) => {
              const dossier = FORENSIC_DOSSIERS[index] ?? FORENSIC_DOSSIERS[0]!;
              const DossierIcon = dossier.icon;
              const isActive = index === activeItem;

              return (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  data-index={index}
                  className={`group relative p-4 sm:p-6 md:p-7 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? "bg-white border-[#2440FF]/30 shadow-lg shadow-stone-300/30 translate-x-0.5"
                      : "bg-white/70 hover:bg-white border-[rgba(18,17,16,0.08)] shadow-xs"
                  }`}
                >
                  {/* Cabeçalho do Cartão Forense */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[rgba(18,17,16,0.06)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2440FF]/10 text-[#2440FF]">
                        <DossierIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-mono text-[0.66rem] sm:text-xs uppercase tracking-[0.18em] text-[#2440FF] font-bold">
                        EVIDÊNCIA #{index + 1} · {item.title}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider font-semibold border ${dossier.badgeColor}`}>
                      <AlertCircle className="h-3 w-3" />
                      <span>{dossier.tag}</span>
                    </span>
                  </div>

                  {/* Descrição Editorial */}
                  <div className="pt-3.5 space-y-1.5">
                    <h3 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-[#121110] tracking-tight group-hover:text-[#2440FF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#4A453E] font-sans-editorial leading-relaxed">
                      {item.note}
                    </p>
                  </div>

                  {/* =================================================================
                      REPRESENTAÇÃO VISUAL BESPOKE PARA CADA UM DOS 7 GARGALOS
                     ================================================================= */}
                  <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] space-y-2.5">
                    <div className="flex items-center justify-between font-mono text-[0.66rem] sm:text-xs">
                      <span className="text-[#121110] font-bold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C8A24A]" />
                        <span>{dossier.evidenceTitle}</span>
                      </span>
                      <span className="text-[#8A837A]">{dossier.metric}</span>
                    </div>

                    {/* Renderização Específica do Cenário Forense */}
                    {index === 0 && (
                      /* Gargalo 1: Silos de Busca Desconectados */
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[0.62rem]">
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] text-center">
                          <span className="block text-[#8A837A]">Canal 01</span>
                          <span className="font-semibold text-[#121110]">WhatsApp</span>
                          <span className="block text-red-500 text-[0.55rem]">sem indexação</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] text-center">
                          <span className="block text-[#8A837A]">Canal 02</span>
                          <span className="font-semibold text-[#121110]">Google Drive</span>
                          <span className="block text-amber-500 text-[0.55rem]">pastas soltas</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] text-center">
                          <span className="block text-[#8A837A]">Canal 03</span>
                          <span className="font-semibold text-[#121110]">Outlook Mail</span>
                          <span className="block text-red-500 text-[0.55rem]">thread de 14 msgs</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] text-center">
                          <span className="block text-[#8A837A]">Canal 04</span>
                          <span className="font-semibold text-[#121110]">Downloads</span>
                          <span className="block text-amber-500 text-[0.55rem]">disco local</span>
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      /* Gargalo 2: Nomenclatura Caótica vs Padrão Sanle */
                      <div className="space-y-1.5 pt-1 font-mono text-[0.66rem]">
                        <div className="flex items-center justify-between p-2 rounded bg-red-50/70 border border-red-200/50 text-red-900">
                          <span className="flex items-center gap-1.5">
                            <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span>NF_final_v2_editada(1).pdf</span>
                          </span>
                          <span className="text-[0.6rem] text-red-600 uppercase">Não tipado</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-emerald-50/70 border border-emerald-200/50 text-emerald-900">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>SANLE_2024_08_NF4910.json</span>
                          </span>
                          <span className="text-[0.6rem] text-emerald-700 uppercase">Schema Sanle</span>
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      /* Gargalo 3: Divergência Fiscal Lado a Lado */
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[0.66rem]">
                        <div className="p-2.5 rounded bg-white border border-[rgba(18,17,16,0.08)]">
                          <span className="text-[#8A837A] text-[0.6rem] block">Pedido de Compra #891</span>
                          <span className="font-bold text-[#121110] text-sm">R$ 14.850,00</span>
                          <span className="text-[0.58rem] text-stone-500 block">10 un x R$ 1.485,00</span>
                        </div>
                        <div className="p-2.5 rounded bg-red-50/80 border border-red-200 text-red-900">
                          <span className="text-red-700 text-[0.6rem] block">Boleto Emitido</span>
                          <span className="font-bold text-red-900 text-sm">R$ 14.858,00</span>
                          <span className="text-[0.58rem] text-red-600 block">Divergência de +R$ 8,00</span>
                        </div>
                      </div>
                    )}

                    {index === 3 && (
                      /* Gargalo 4: Digitação Tripla Manual */
                      <div className="flex items-center justify-between gap-1 pt-1 font-mono text-[0.62rem] text-center">
                        <div className="flex-1 p-2 rounded bg-white border border-[rgba(18,17,16,0.06)]">
                          <span className="text-[#8A837A] block">1. ERP</span>
                          <span className="font-semibold text-[#121110]">Digitar CNPJ</span>
                        </div>
                        <span className="text-[#8A837A]">➔</span>
                        <div className="flex-1 p-2 rounded bg-white border border-[rgba(18,17,16,0.06)]">
                          <span className="text-[#8A837A] block">2. Excel</span>
                          <span className="font-semibold text-[#121110]">Copiar Valor</span>
                        </div>
                        <span className="text-[#8A837A]">➔</span>
                        <div className="flex-1 p-2 rounded bg-white border border-[rgba(18,17,16,0.06)]">
                          <span className="text-[#8A837A] block">3. Email</span>
                          <span className="font-semibold text-[#121110]">Avisar Diretor</span>
                        </div>
                      </div>
                    )}

                    {index === 4 && (
                      /* Gargalo 5: Timeline de Propagação do Erro */
                      <div className="space-y-1 pt-1 font-mono text-[0.62rem]">
                        <div className="flex items-center justify-between p-1.5 rounded bg-white border border-[rgba(18,17,16,0.06)]">
                          <span className="text-[#8A837A]">Dia 03</span>
                          <span className="text-[#121110]">Digitação com centavos trocados</span>
                          <span className="text-amber-500">Silencioso</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-white border border-[rgba(18,17,16,0.06)]">
                          <span className="text-[#8A837A]">Dia 15</span>
                          <span className="text-[#121110]">Relatório gerencial contaminado</span>
                          <span className="text-amber-600">Não auditado</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-red-50 border border-red-200 text-red-900">
                          <span className="text-red-700 font-bold">Dia 30</span>
                          <span className="font-bold">Fechamento fiscal rejeitado</span>
                          <span className="text-red-600 font-bold">3 dias de crise</span>
                        </div>
                      </div>
                    )}

                    {index === 5 && (
                      /* Gargalo 6: Comunicação Fragmentada e Cobranças */
                      <div className="space-y-1.5 pt-1 font-mono text-[0.62rem]">
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] flex items-center justify-between">
                          <span className="text-[#121110]">"Você já aprovou a fatura #402?"</span>
                          <span className="text-[#8A837A]">10:14 · Lida sem resposta</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-[rgba(18,17,16,0.06)] flex items-center justify-between">
                          <span className="text-[#121110]">"Consegue olhar isso até as 17h?"</span>
                          <span className="text-red-500 font-semibold">16:48 · Prazo estourado</span>
                        </div>
                      </div>
                    )}

                    {index === 6 && (
                      /* Gargalo 7: Loop Repetitivo Crônico */
                      <div className="p-2.5 rounded bg-white border border-[rgba(18,17,16,0.06)] flex items-center justify-between font-mono text-[0.66rem]">
                        <div className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4 text-[#2440FF] animate-spin" />
                          <span className="text-[#121110] font-semibold">22 dias úteis de repetição manual</span>
                        </div>
                        <span className="text-red-600 font-bold text-xs">Zero log / Zero auditoria</span>
                      </div>
                    )}

                    <p className="text-xs text-[#4A453E] font-sans-editorial leading-relaxed pt-1">
                      {dossier.evidenceDetail}
                    </p>
                  </div>

                  {/* Rodapé do Cartão */}
                  <div className="mt-3.5 pt-2.5 border-t border-dashed border-[rgba(18,17,16,0.08)] flex items-center justify-between font-mono text-xs">
                    <span className="text-[0.66rem] sm:text-[0.7rem] text-[#8A837A]">Impacto no time:</span>
                    <span className={`font-semibold text-[0.7rem] sm:text-xs ${dossier.badgeColor.split(" ")[0]}`}>
                      {dossier.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
