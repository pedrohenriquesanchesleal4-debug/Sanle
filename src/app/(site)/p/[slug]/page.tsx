import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import {
  getProspectPageBySlug,
  decodeProspectPayload,
  cleanCompanyNameFromSlug
} from "@/lib/db/repo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CostCalculator } from "@/components/site/CostCalculator";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { ProspectPageTracker } from "./tracker";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ d?: string; empresa?: string; cidade?: string; nicho?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Diagnóstico Operacional Personalizado · Sanle",
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false }
    }
  };
}

function getDeterministicOpportunities(nicho: string, customOportunidade?: string | null) {
  const n = (nicho || "").toLowerCase();

  const baseList =
    n.includes("bpo") || n.includes("contabil") || n.includes("financeiro")
      ? [
          {
            title: "Conciliação bancária e triagem documental",
            desc: "Captura de extratos OFX/PDF de clientes e conciliação automatizada com o sistema contábil/financeiro.",
            impact: "Redução de horas gastas no fechamento mensal."
          },
          {
            title: "Baixa estruturada de comprovantes Pix e boletos",
            desc: "Leitura de comprovantes de pagamento e registro de liquidação sem redigitação manual.",
            impact: "Menos divergências por digitação repetida de valores."
          },
          {
            title: "Cobrança organizada de documentos pendentes",
            desc: "Lembretes automáticos e pontuais solicitando recibos e notas que ainda faltam no mês.",
            impact: "Previsibilidade na rotina mensal da carteira."
          }
        ]
      : n.includes("juridico") || n.includes("advoc") || n.includes("direito")
        ? [
            {
              title: "Classificação automática de peças e documentos",
              desc: "Identificação do tipo de documento e encaminhamento estruturado para a pasta do cliente.",
              impact: "Controle organizado de prazos e fluxo documental."
            },
            {
              title: "Busca contextual no acervo de contratos (RAG)",
              desc: "Localização rápida de cláusulas, minutas e precedentes internos com citação da fonte.",
              impact: "Economia de horas em pesquisas manuais em diretórios."
            },
            {
              title: "Geração padronizada de minutas e procurações",
              desc: "Preenchimento de dados a partir do cadastro do cliente em modelos aprovados pelo escritório.",
              impact: "Agilidade na abertura de novos atendimentos."
            }
          ]
        : [
            {
              title: "Presença digital autoral e atendimento imediato",
              desc: "Experiência digital estruturada para apresentar seus serviços com clareza e captar clientes pelo WhatsApp.",
              impact: "Melhor aproveitamento de buscas comerciais e indicações."
            },
            {
              title: "Triagem inteligente e respostas rápidas",
              desc: "Agente de atendimento e formulários estruturados para coletar dados essenciais antes do orçamento.",
              impact: "Atendimento ágil sem sobrecarregar a equipe."
            },
            {
              title: "Painel de acompanhamento de clientes e pedidos",
              desc: "Sistema sob medida para visibilidade sobre cada negociação e serviço em andamento.",
              impact: "Nenhum orçamento ou próximo passo esquecido."
            }
          ];

  if (customOportunidade && customOportunidade.trim()) {
    baseList[0] = {
      title: "Oportunidade prioritária mapeada para a operação",
      desc: customOportunidade.trim(),
      impact: "Desenhado sob medida para a realidade atual da empresa."
    };
  }

  return baseList;
}

export default async function ProspectPersonalizedPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};

  const prospect = await getProspectPageBySlug(slug);
  const decoded = decodeProspectPayload(sp?.d);

  const empresa =
    prospect?.empresa ||
    decoded?.empresa ||
    (sp?.empresa ? sp.empresa.trim() : "") ||
    cleanCompanyNameFromSlug(slug);
  const cidade =
    prospect?.cidade ||
    decoded?.cidade ||
    (sp?.cidade ? sp.cidade.trim() : "") ||
    "Brasília";
  const nicho =
    prospect?.nicho ||
    decoded?.nicho ||
    (sp?.nicho ? sp.nicho.trim() : "") ||
    "sua operação";
  const oportunidade = prospect?.oportunidade ?? decoded?.oportunidade ?? null;

  const opportunities = getDeterministicOpportunities(nicho, oportunidade);

  const whatsUrl = buildWhatsAppLink({
    empresa,
    segmento: nicho,
    customText: `Olá, acessei o diagnóstico personalizado preparado para a ${empresa} e gostaria de conversar sobre as oportunidades mapeadas.`
  });

  return (
    <article className="bg-[#08090C] pt-28 text-[#F5F6F8]">
      <ProspectPageTracker slug={slug} empresa={empresa} nicho={nicho} />

      <section className="shell border-b border-white/[0.06] py-16 md:py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/30 bg-[#B7F36B]/10 px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#B7F36B]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>DIAGNÓSTICO COMERCIAL EXCLUSIVO · {empresa.toUpperCase()}</span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#F5F6F8]">
            {empresa}: oportunidades comerciais e operacionais identificadas em {cidade}.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#969DA8]">
            Preparamos esta demonstração sob medida para apresentar os pontos de alavancagem digital,
            sistemas, agentes de IA e automação mais relevantes para a realidade de {nicho}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#oportunidades"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#B7F36B] px-6 py-3.5 text-sm font-semibold text-[#08090C] transition hover:bg-[#c8f789]"
            >
              <span>Ver oportunidades mapeadas</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#111318] px-5 py-3.5 text-sm font-medium text-[#F5F6F8] transition hover:border-[#B7F36B]/40"
            >
              <MessageCircle className="h-4 w-4 text-[#B7F36B]" />
              <span>Conversar sobre a {empresa}</span>
            </a>
          </div>
        </div>

        <div id="oportunidades" className="mt-16 border-t border-white/[0.06] pt-10">
          <span className="mb-6 block font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#78A9FF]">
            3 ALAVANCAS DE CRESCIMENTO E EFICIÊNCIA IDENTIFICADAS
          </span>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111318] p-6 transition hover:border-[#B7F36B]/35 md:p-8"
              >
                <div>
                  <span className="mb-3 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#78A9FF]">
                    OPORTUNIDADE 0{idx + 1}
                  </span>

                  <h3 className="font-display text-xl font-semibold leading-snug text-[#F5F6F8]">
                    {opp.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#969DA8]">
                    {opp.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-2 border-t border-white/[0.06] pt-4 font-mono text-xs text-[#B7F36B]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{opp.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CostCalculator />

      <FinalCTA />
    </article>
  );
}
