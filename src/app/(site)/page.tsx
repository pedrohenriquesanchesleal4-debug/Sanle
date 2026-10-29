import type { Metadata } from "next";
import { HeroPortal } from "@/components/site/HeroPortal";
import { Transformation } from "@/components/site/Transformation";
import { Cases } from "@/components/site/Cases";
import { CostCalculator } from "@/components/site/CostCalculator";
import { Method } from "@/components/site/Method";
import { TrustSection } from "@/components/site/TrustSection";
import { CommercialModels } from "@/components/site/CommercialModels";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { brand, faqs, siteUrl } from "@/content/brand";

export const metadata: Metadata = {
  title: "Sanle · Estúdio de Engenharia de Software, Produtos Digitais & IA",
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
      name: "Soluções de Engenharia de Software da Sanle",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Digital · Vitrines e Experiências Digitais de Alta Conversão",
            description: "Presença digital autoral, páginas de alto ticket e captação integrada ao WhatsApp e CRM."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Systems · Sistemas Web, Portais e CRMs Sob Medida",
            description: "Aplicações web para organizar processos operacionais, clientes e dados em tempo real."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sanle Agents · Agentes de IA Conectados a Documentos (RAG)",
            description: "Agentes de inteligência artificial treinados nos documentos da empresa sem alucinação."
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

      {/* 1. O Ateliê Vivo de Engenharia Sanle: Bancada de Degustação Interativa ao Vivo */}
      <HeroPortal />

      {/* 2. O Contraste da Verdade: Comparativo Interativo entre o Atrito Manual e a Engenharia Sanle */}
      <Transformation />

      {/* 3. Provas de Capacidade e Arquitetura: Produtos Próprios e Sistemas Reais em Produção */}
      <Cases />

      {/* 4. Calculadora Transparente de Retorno e Impacto Operacional */}
      <CostCalculator />

      {/* 5. Método de Implementação Ágil em 7 a 14 dias com Código 100% Proprietário */}
      <Method />

      {/* 6. Arquitetura, Segurança e Governança de Dados (PostgreSQL + RLS) */}
      <TrustSection />

      {/* 7. Modelos de Engajamento Comercial Transparentes */}
      <CommercialModels />

      {/* 8. Perguntas Frequentes (FAQ) */}
      <Faq />

      {/* 9. Seletor de Demanda e Contato Direto com Pedro Leal */}
      <FinalCta />
    </>
  );
}
