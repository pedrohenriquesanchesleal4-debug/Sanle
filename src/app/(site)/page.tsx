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
import { SanleStageHUD } from "@/components/site/SanleStageHUD";
import { brand, faqs, siteUrl } from "@/content/brand";

export const metadata: Metadata = {
  title: "Sanle · Engenharia Operacional & Automação de Processos",
  description: brand.shortPitch,
  alternates: { canonical: "/" }
};

const structuredData = [
  // 1. Organização / Serviço Profissional de Engenharia Local
  {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: "Sanle",
    legalName: "Sanle · Engenharia Operacional",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/images/studio-light.jpg`,
    description: brand.positioning,
    telephone: "+55-61-98139-9051",
    email: "pedrohenriquesanchesleal4@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -15.7975,
      longitude: -47.8919
    },
    areaServed: [
      { "@type": "City", name: "Brasília" },
      { "@type": "AdministrativeArea", name: "Distrito Federal" },
      { "@type": "Country", name: "Brasil" }
    ],
    founder: {
      "@type": "Person",
      name: "Pedro Henrique Sanches Leal",
      jobTitle: "Fundador & Engenheiro Operacional",
      url: "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278"
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00"
      }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Soluções de Engenharia e Automação Sanle",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automação Documental e Conciliação Fiscal em 0.18s",
            description: "Extração estruturada de notas e recibos sem redigitação humana."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Barramento e Integração Direta de ERPs",
            description: "Conexão bidirecional entre WhatsApp, Omie, ContaAzul e bancos de dados."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automação de Regras de Negócio e Anti-Duplicidade",
            description: "Conferência determinística de preços e estoque em tempo real."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Governança e Visibilidade Executiva de Margem",
            description: "Painéis e relatórios executivos em tempo real com conformidade LGPD."
          }
        }
      ]
    }
  },
  // 2. WebSite com SearchAction
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Sanle",
    description: brand.shortPitch,
    publisher: {
      "@id": `${siteUrl}/#organization`
    }
  },
  // 3. FAQPage para Rich Snippets, Voice Search e Answer Engines (AEO/GEO)
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
    }))
  }
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
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

      {/* 16. HUD Flutuante de Estágios e Profundidade (Inspirado no why.zero.university) */}
      <SanleStageHUD />
    </>
  );
}
