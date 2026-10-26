import type { Metadata } from "next";
import { HeroPortal } from "@/components/site/HeroPortal";
import { SanleScrollytelling } from "@/components/site/SanleScrollytelling";
import { MarqueeProblems } from "@/components/site/MarqueeProblems";
import { PinnedProblems } from "@/components/site/PinnedProblems";
import { CostCalculator } from "@/components/site/CostCalculator";
import { Transformation } from "@/components/site/Transformation";
import { DemoFlow } from "@/components/site/DemoFlow";
import { SegmentTabs } from "@/components/site/SegmentTabs";
import { Solutions } from "@/components/site/Solutions";
import { Cases } from "@/components/site/Cases";
import { TrustSection } from "@/components/site/TrustSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Method } from "@/components/site/Method";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: `${brand.name} · ${brand.tagline}`,
  description: brand.shortPitch,
  alternates: { canonical: "/" }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  description: brand.positioning,
  areaServed: { "@type": "Place", name: brand.serviceRegion }
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c")
        }}
      />

      {/* 1. Portal Zoom Inicial + Revelação do Site (Máscara Óptica SVG na Logo Sanle) */}
      <HeroPortal />

      {/* 2. O Grande Scrollytelling: A História da Sanle e os 4 Capítulos com Fotografia Real */}
      <SanleScrollytelling />

      {/* 3. Faixa Marquee de Alabastro (Tarefas Manuais Mapeadas) */}
      <MarqueeProblems />

      {/* 4. O Problema: Os 7 Trabalhos Invisíveis Pinned */}
      <PinnedProblems />

      {/* 5. Calculadora Interativa do Custo Invisível */}
      <CostCalculator />

      {/* 6. Antes e Depois (Slider Interativo em Seção Clara) */}
      <Transformation />

      {/* 7. Demonstração Interativa em 6 Etapas */}
      <DemoFlow />

      {/* 8. Para quem é: Seletor de Segmentos com Abas */}
      <SegmentTabs />

      {/* 9. As 4 Soluções Arquitetadas (Grade de Engenharia) */}
      <Solutions />

      {/* 10. Prova Técnica de Software: Sistemas em Operação */}
      <Cases />

      {/* 11. Padrões Corporativos, Segurança e Governança LGPD */}
      <TrustSection />

      {/* 12. Método de Trabalho em 4 Etapas */}
      <Method />

      {/* 13. Perguntas Frequentes Acessíveis + JSON-LD */}
      <Faq />

      {/* 14. Canais Diretos de Contato & Liderança Técnica */}
      <ContactSection />

      {/* 15. Chamada Final + Formulário Curto de Diagnóstico */}
      <FinalCta />
    </>
  );
}
