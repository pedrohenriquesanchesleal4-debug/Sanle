import type { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { InvisibleWork } from "@/components/site/InvisibleWork";
import { Transformation } from "@/components/site/Transformation";
import { Solutions } from "@/components/site/Solutions";
import { DemoFlow } from "@/components/site/DemoFlow";
import { Method } from "@/components/site/Method";
import { Cases } from "@/components/site/Cases";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.shortPitch,
  alternates: { canonical: "/" }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  description: brand.positioning,
  areaServed: { "@type": "Place", name: brand.serviceRegion },
  address: {
    "@type": "PostalAddress",
    addressLocality: brand.founded.city,
    addressRegion: brand.founded.uf,
    addressCountry: "BR"
  }
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // JSON-stringify NÃO escapa `</script>` — sanitizar para impedir
          // break-out do contexto do script (CWE-80), mesmo com dados estáticos.
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c")
        }}
      />
      <Hero />
      <InvisibleWork />
      <Transformation />
      <Solutions />
      <DemoFlow />
      <Method />
      <Cases />
      <Faq />
      <FinalCta />
    </>
  );
}
