import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { SEGMENTS_DATA } from "@/content/segments";
import { brand, siteUrl } from "@/content/brand";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CostCalculator } from "@/components/site/CostCalculator";
import { DemoFlow } from "@/components/site/DemoFlow";
import { FinalCta } from "@/components/site/FinalCta";

interface PageProps {
  params: Promise<{ segmento: string }>;
}

export async function generateStaticParams() {
  return SEGMENTS_DATA.map((s) => ({
    segmento: s.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segmento } = await params;
  const seg = SEGMENTS_DATA.find((s) => s.slug === segmento);

  if (!seg) return {};

  return {
    title: `${seg.tabLabel} — Automação de Processos e IA · ${brand.name}`,
    description: seg.description,
    alternates: {
      canonical: `${siteUrl}/para/${seg.slug}`
    }
  };
}

export default async function NichoPage({ params }: PageProps) {
  const { segmento } = await params;
  const seg = SEGMENTS_DATA.find((s) => s.slug === segmento);

  if (!seg) notFound();

  const whatsUrl = buildWhatsAppLink({ segmento: seg.tabLabel });

  return (
    <article className="pt-24 bg-[#0A0A09] text-[#F2EEE6]">
      {/* Hero de Nicho */}
      <section className="shell py-16 md:py-24 border-b border-[rgba(242,238,230,0.1)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.12)] font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#FF5B1F]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SOLUÇÃO PARA {seg.tabLabel.toUpperCase()}</span>
          </div>

          <h1 className="mt-6 font-serif-editorial text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.95] text-[#F2EEE6]">
            {seg.headline}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#8F8A80] font-sans-editorial leading-relaxed">
            {seg.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#diagnostico-inbound"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[2px] bg-[#FF5B1F] text-white font-medium text-sm hover:bg-[#E0480E] transition-colors"
            >
              <span>Mapear processo de {seg.tabLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.14)] text-[#F2EEE6] text-sm hover:bg-[#1E1E1B] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#10B981]" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Exemplo de Fluxo em Cards */}
        <div className="mt-16 p-8 rounded-[2px] bg-[#141412] border border-[rgba(242,238,230,0.12)]">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF5B1F] block mb-4">
            ETAPAS DO FLUXO RECOMENDADO
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seg.flowExample.map((step, idx) => (
              <div key={idx} className="p-5 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.08)]">
                <span className="font-mono text-xs text-[#FF5B1F] font-bold block mb-2">
                  0{idx + 1}
                </span>
                <p className="text-sm text-[#F2EEE6] leading-relaxed font-sans-editorial">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <CostCalculator />

      {/* Demonstração */}
      <DemoFlow />

      {/* CTA Final com Formulário */}
      <FinalCta />
    </article>
  );
}
