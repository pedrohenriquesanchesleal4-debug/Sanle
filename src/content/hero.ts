export interface HeroContent {
  eyebrow: string;
  headlineTop: string;
  headlineBottom: string;
  headlineItalic: string;
  subheadline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  microProof: string;
  abAlternatives: {
    title: string;
    sub: string;
  }[];
}

export const heroContent: HeroContent = {
  eyebrow: "SANLE · ENGENHARIA DE SOFTWARE · BRASÍLIA - DF",
  headlineTop: "Boas ideias merecem",
  headlineBottom: "sair do",
  headlineItalic: "papel.",
  subheadline:
    "Transformamos necessidades de negócio em produtos digitais, sistemas sob medida, agentes de inteligência artificial e automações que funcionam na prática.",
  ctaPrimary: {
    label: "Tirar projeto do papel",
    href: "/#contato"
  },
  ctaSecondary: {
    label: "Explorar as 4 frentes",
    href: "/#capacidades"
  },
  microProof: "Digital · Sistemas · Agentes de IA · Automação",
  abAlternatives: [
    {
      title: "Boas ideias merecem sair do papel com engenharia de verdade.",
      sub: "Sites autorais, sistemas web personalizados, agentes de IA e automações operacionais."
    },
    {
      title: "Da necessidade de negócio ao software em produção.",
      sub: "Elimine gargalos operacionais que consomem horas diárias da sua equipe em trabalho manual repetitivo."
    }
  ]
};
