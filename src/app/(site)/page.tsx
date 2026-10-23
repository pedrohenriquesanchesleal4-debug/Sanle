import type { Metadata } from "next";
import { StorytellingExperience } from "@/components/storytelling/StorytellingExperience";
import { FeatureNarrative } from "@/components/landing/FeatureNarrative";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Faq } from "@/components/site/Faq";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: `${brand.name} · ${brand.tagline}`,
  description: brand.shortPitch,
  alternates: { canonical: "/" }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: brand.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
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

      {/* 1. Narrativa Cinematográfica de 8 Cenas Controlada pelo Scroll + Palco 3D WebGL */}
      <StorytellingExperience />

      {/* 2. Seção Editorial de Recursos (6 movimentos com fotografia real e filmes procedurais) */}
      <FeatureNarrative />

      {/* 3. Seção de Produto Real (Simulador interativo de busca, diagnóstico, mensagem e pipeline) */}
      <ProductShowcase />

      {/* 4. Perguntas Frequentes sobre autenticidade, operação Free-First e privacidade */}
      <Faq />

      {/* 5. Fechamento Visual Forte ("Suas próximas oportunidades começam aqui.") */}
      <FinalCTA />
    </>
  );
}
