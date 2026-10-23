"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export interface SegmentInfo {
  id: string;
  slug: string;
  tabLabel: string;
  headline: string;
  description: string;
  flowExample: string[];
  metrics: { label: string; val: string }[];
  ctaLabel: string;
}

export const SEGMENTS_DATA: SegmentInfo[] = [
  {
    id: "bpo-financeiro",
    slug: "bpo-financeiro",
    tabLabel: "BPO Financeiro",
    headline: "Automação documental e conciliação para carteiras de clientes com alto volume.",
    description:
      "Elimine a rotina de baixar extratos bancários manualmente, renomear comprovantes Pix e redigitar lançamentos no ERP de cada cliente atendido.",
    flowExample: [
      "Extratos e comprovantes recebidos automaticamente por e-mail ou WhatsApp",
      "Reconhecimento de CNPJ, valor, data e categoria com validação cruzada",
      "Geração de arquivo de importação ou envio direto via API para o Omie, ContaAzul ou ERP",
      "Alerta imediato apenas para divergências ou ausência de documento suporte"
    ],
    metrics: [
      { label: "Tempo de fechamento", val: "-60%" },
      { label: "Erros de conciliação", val: "Quase zero" }
    ],
    ctaLabel: "Ver solução para BPO financeiro"
  },
  {
    id: "escritorios",
    slug: "escritorios",
    tabLabel: "Escritórios (Contábil e Jurídico)",
    headline: "Organização de pastas, certidões e extração de dados de processos.",
    description:
      "Transforme documentos despadronizados enviados pelos clientes em pastas estruturadas, com renomeação padronizada e leitura inteligente de termos e prazos.",
    flowExample: [
      "Upload centralizado de guias, contratos e documentos probatórios",
      "Classificação instantânea por cliente, exercício contábil ou número de processo",
      "Extração automática de metadados críticos (valores, partes, datas limite)",
      "Indexação com busca semântica para localização instantânea de qualquer cláusula"
    ],
    metrics: [
      { label: "Localização de arquivos", val: "Instantânea" },
      { label: "Padronização de acervo", val: "100%" }
    ],
    ctaLabel: "Ver solução para escritórios"
  },
  {
    id: "prestadores-de-servico",
    slug: "prestadores-de-servico",
    tabLabel: "Prestadores de Serviço",
    headline: "Agilidade na emissão de orçamentos, contratos e cobrança de pendências.",
    description:
      "Para empresas com equipes em campo ou orçamentos customizados (marcenarias, vidraçarias, instalações, consultorias). Reduza o tempo entre a solicitação e o contrato assinado.",
    flowExample: [
      "Solicitação de orçamento recebida via formulário ou mensagem",
      "Cálculo automático de custos e composição de proposta em PDF padronizado",
      "Disparo do link para aprovação e assinatura digital do cliente",
      "Criação automática da ordem de serviço e cobrança de entrada"
    ],
    metrics: [
      { label: "Tempo de proposta", val: "Sob demanda" },
      { label: "Contratos perdidos por demora", val: "-75%" }
    ],
    ctaLabel: "Ver solução para prestadores de serviço"
  }
];

export function SegmentTabs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SEGMENTS_DATA[activeIdx] ?? SEGMENTS_DATA[0]!;

  const handleTabChange = (idx: number) => {
    setActiveIdx(idx);
    const seg = SEGMENTS_DATA[idx];
    if (seg) {
      trackEvent("segmento_selecionado", {
        segmento: seg.id
      });
    }
  };

  const handleWhatsApp = () => {
    trackEvent("whatsapp_aberto", { local: "segment_tabs", segmento: active.id });
    const url = buildWhatsAppLink({ segmento: active.tabLabel });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="para-quem"
      className="relative scroll-mt-20 py-24 md:py-32 bg-[#F2EEE6] text-[#0A0A09] border-b border-[rgba(10,10,9,0.12)]"
      aria-labelledby="segment-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#FF5B1F]">
          <span>SEGMENTOS PRIORITÁRIOS</span>
        </div>

        <h2
          id="segment-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#0A0A09]"
        >
          Para quem foi pensada a Sanle.
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-[#5A564F] font-sans-editorial">
          Selecione o segmento da sua empresa para entender o modelo de fluxo específico para a sua rotina.
        </p>

        {/* As 3 Abas Grandes */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-[rgba(10,10,9,0.15)] pb-2">
          {SEGMENTS_DATA.map((s, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleTabChange(idx)}
                className={`p-5 text-left rounded-[2px] transition-all font-mono text-sm uppercase tracking-[0.12em] ${
                  isSelected
                    ? "bg-[#0A0A09] text-[#F2EEE6] shadow-md font-semibold"
                    : "bg-white/60 text-[#5A564F] hover:bg-white hover:text-[#0A0A09]"
                }`}
              >
                <div className="text-[0.68rem] text-[#8F8A80] mb-1">0{idx + 1}</div>
                {s.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Conteúdo Bespoke do Segmento Selecionado */}
        <div className="mt-10 p-8 md:p-12 rounded-[2px] bg-white border border-[rgba(10,10,9,0.12)] shadow-sm grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF5B1F]">
              DIAGNÓSTICO E FLUXO · {active.tabLabel.toUpperCase()}
            </span>

            <h3 className="mt-4 font-serif-editorial text-2xl md:text-3xl leading-snug text-[#0A0A09]">
              {active.headline}
            </h3>

            <p className="mt-4 text-[#5A564F] text-base leading-relaxed font-sans-editorial">
              {active.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/para/${active.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[2px] bg-[#0A0A09] text-white font-medium text-sm hover:bg-[#1E1E1B] transition-colors"
              >
                <span>{active.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[2px] border border-[rgba(10,10,9,0.2)] text-[#0A0A09] text-sm hover:bg-[#F2EEE6] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#10B981]" />
                <span>Conversar sobre este segmento</span>
              </button>
            </div>
          </div>

          {/* Exemplo de Fluxo e Métricas */}
          <div className="p-6 md:p-8 rounded-[2px] bg-[#FAF8F5] border border-[rgba(10,10,9,0.1)]">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#0A0A09] font-bold">
              Exemplo de fluxo automatizado
            </span>

            <ol className="mt-5 space-y-3 font-sans-editorial text-sm text-[#4A463F]">
              {active.flowExample.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#FF5B1F] font-bold shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-[rgba(10,10,9,0.1)] grid grid-cols-2 gap-4">
              {active.metrics.map((m, i) => (
                <div key={i}>
                  <div className="font-serif-editorial text-2xl text-[#0A0A09] font-bold">
                    {m.val}
                  </div>
                  <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8F8A80]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
