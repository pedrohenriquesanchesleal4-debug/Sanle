import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { getProspectPageBySlug } from "@/lib/db/repo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CostCalculator } from "@/components/site/CostCalculator";
import { FinalCta } from "@/components/site/FinalCta";
import { ProspectPageTracker } from "./tracker";

interface PageProps {
  params: Promise<{ slug: string }>;
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

// Oportunidades determinísticas por nicho (sem IA paga)
function getDeterministicOpportunities(nicho: string) {
  const n = (nicho || "").toLowerCase();

  if (n.includes("bpo") || n.includes("contabil") || n.includes("financeiro")) {
    return [
      {
        title: "Conciliação bancária multi-extratos",
        desc: "Captura de extratos OFX/PDF de clientes e conciliação automática com o ERP.",
        impact: "Redução de até 70% do tempo de fechamento mensal."
      },
      {
        title: "Baixa de comprovantes Pix e boletos",
        desc: "Leitura de comprovantes de pagamento e registro de liquidação sem digitação manual.",
        impact: "Zero divergências por erros de digitação de valores."
      },
      {
        title: "Cobrança proativa de documentos pendentes",
        desc: "Mensagens automáticas e pontuais cobrando recibos e notas que ainda faltam.",
        impact: "Fim das pendências acumuladas para a última semana do mês."
      }
    ];
  }

  if (n.includes("juridico") || n.includes("advoc") || n.includes("direito")) {
    return [
      {
        title: "Classificação automática de peças e intimações",
        desc: "Identificação do tipo de documento e encaminhamento para a pasta correta.",
        impact: "Controle rigoroso de prazos e fluxo documental."
      },
      {
        title: "Busca semântica no acervo de contratos",
        desc: "Localização instantânea de cláusulas e precedentes em segundos.",
        impact: "Economia de horas em pesquisas manuais em diretórios."
      },
      {
        title: "Geração padronizada de minutas e procurações",
        desc: "Preenchimento de dados a partir do cadastro do cliente em modelos aprovados.",
        impact: "Agilidade na montagem inicial de processos."
      }
    ];
  }

  // Padrão para prestadores e PMEs
  return [
    {
      title: "Eliminação da cópia de dados entre sistemas",
      desc: "Integração direta entre planilhas, WhatsApp e sistema de gestão.",
      impact: "Elimina a redigitação do mesmo dado em múltiplos lugares."
    },
    {
      title: "Orçamentos e propostas em segundos",
      desc: "Geração de PDFs padronizados prontos para envio ao cliente.",
      impact: "Aumento na taxa de conversão pela resposta imediata."
    },
    {
      title: "Trilha clara de aprovação e pendências",
      desc: "Visibilidade em tempo real sobre quem precisa aprovar cada etapa.",
      impact: "Nenhuma tarefa esquecida sem responsável ou prazo."
    }
  ];
}

export default async function ProspectPersonalizedPage({ params }: PageProps) {
  const { slug } = await params;
  const prospect = await getProspectPageBySlug(slug);

  // Se não existir registro no banco, permite fallback com slug formatado para demonstração
  const empresa = prospect?.empresa || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const cidade = prospect?.cidade || "Brasília";
  const nicho = prospect?.nicho || "sua operação";

  const opportunities = getDeterministicOpportunities(nicho);

  const whatsUrl = buildWhatsAppLink({
    empresa,
    segmento: nicho,
    customText: `Olá, acessei a página personalizada da ${empresa} na Sanle e gostaria de conversar sobre as oportunidades de automação.`
  });

  return (
    <article className="pt-24 bg-[#0A0A09] text-[#F2EEE6]">
      {/* Componente cliente que dispara o evento pagina_personalizada_vista */}
      <ProspectPageTracker slug={slug} empresa={empresa} nicho={nicho} />

      {/* Hero Personalizado 1-to-1 */}
      <section className="shell py-16 md:py-24 border-b border-[rgba(242,238,230,0.1)]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.12)] font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#FF5B1F]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ESTUDO DE FLUXO EXCLUSIVO · {empresa.toUpperCase()}</span>
          </div>

          <h1 className="mt-6 font-serif-editorial text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.95] text-[#F2EEE6]">
            {empresa}, quanto do tempo do seu time em {cidade} vai para tarefas repetitivas de {nicho}?
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#8F8A80] font-sans-editorial leading-relaxed max-w-2xl">
            Estruturamos esta página para mapear as principais oportunidades de redução de atrito
            manual especificamente desenhadas para a realidade da sua empresa.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#oportunidades"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[2px] bg-[#FF5B1F] text-white font-medium text-sm hover:bg-[#E0480E] transition-colors"
            >
              <span>Ver oportunidades de automação</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.14)] text-[#F2EEE6] text-sm hover:bg-[#1E1E1B] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#10B981]" />
              <span>Conversar sobre a {empresa}</span>
            </a>
          </div>
        </div>

        {/* 3 Oportunidades Determinísticas de Automação */}
        <div id="oportunidades" className="mt-16 pt-10 border-t border-[rgba(242,238,230,0.1)]">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF5B1F] block mb-6">
            3 GARGALOS OPERACIONAIS COM POTENCIAL DE AUTOMAÇÃO IMEDIATA
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-6 md:p-8 rounded-[2px] bg-[#141412] border border-[rgba(242,238,230,0.12)] flex flex-col justify-between hover:border-[rgba(255,91,31,0.4)] transition-colors"
              >
                <div>
                  <span className="font-mono text-xs text-[#FF5B1F] font-bold block mb-3">
                    OPORTUNIDADE 0{idx + 1}
                  </span>

                  <h3 className="font-serif-editorial text-2xl text-[#F2EEE6] leading-snug">
                    {opp.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#8F8A80] leading-relaxed font-sans-editorial">
                    {opp.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(242,238,230,0.08)] flex items-start gap-2 text-xs font-mono text-[#10B981]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{opp.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora de Custo para o Lead Simular */}
      <CostCalculator />

      {/* Chamada Final */}
      <FinalCta />
    </article>
  );
}
