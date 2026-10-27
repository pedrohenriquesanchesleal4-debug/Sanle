import type { Metadata } from "next";
import { HeroPortal } from "@/components/site/HeroPortal";
import { CapabilitiesShowcase } from "@/components/site/CapabilitiesShowcase";
import { SanleScrollytelling } from "@/components/site/SanleScrollytelling";
import { Cases } from "@/components/site/Cases";
import { CostCalculator } from "@/components/site/CostCalculator";
import { Method } from "@/components/site/Method";
import { TrustSection } from "@/components/site/TrustSection";
import { CommercialModels } from "@/components/site/CommercialModels";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { brand, faqs, siteUrl } from "@/content/brand";

export const metadata: Metadata = {
  title: "Sanle · Produtos Digitais, Sistemas Sob Medida, Agentes de IA & Automação",
  description: brand.shortPitch,
  alternates: { canonical: "/" }
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: "Sanle",
    legalName: "Sanle · Engenharia de Software & Sistemas",
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
      jobTitle: "Fundador & Engenheiro de Software",
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
      name: "As 4 Frentes de Engenharia de Software da Sanle",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Digital · Sites, Landing Pages e Experiências Digitais",
            description: "Presença digital autoral, páginas de alta conversão, SEO técnico e integração com WhatsApp e CRM."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Systems · Sistemas Web, Portais, CRMs e Dashboards",
            description: "Aplicações web sob medida para organizar processos operacionais, clientes e dados em tempo real."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Agents · Agentes de IA, RAG e Atendimento Inteligente",
            description: "Agentes de inteligência artificial conectados aos documentos da empresa com chamada de ferramentas e transbordo humano."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Automation · Automação de Processos, Documentos e APIs",
            description: "Integração entre sistemas, leitura estruturada de documentos e eliminação de retrabalho manual."
          }
        }
      ]
    }
  },
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

      {/* 1. Hero Editorial + Estúdio Interativo das 4 Frentes ("Boas ideias merecem sair do papel.") */}
      <HeroPortal />

      {/* 2. As 4 Frentes Comerciais da Sanle (Digital, Sistemas, Agentes, Automação) + Demonstrações Reais */}
      <CapabilitiesShowcase />

      {/* 3. Scrollytelling Editorial: Do Diagnóstico à Operação Integrada em 4 Capítulos */}
      <SanleScrollytelling />

      {/* 4. Provas de Capacidade: Produtos Próprios, Sistemas Reais e Arquiteturas Demonstráveis */}
      <Cases />

      {/* 5. Simulador de Impacto Operacional (Estimativa Ilustrativa Transparente) */}
      <CostCalculator />

      {/* 6. Método de Implementação em 4 Etapas */}
      <Method />

      {/* 7. Arquitetura, Segurança, Privacidade & Governança */}
      <TrustSection />

      {/* 8. Modelos de Engajamento Comercial & Transparência de Custos Cloud/IA */}
      <CommercialModels />

      {/* 9. Perguntas Frequentes (FAQ) */}
      <Faq />

      {/* 10. Seletor Inteligente de Necessidade, Briefing Contextual & Canais Diretos */}
      <FinalCta />
    </>
  );
}
