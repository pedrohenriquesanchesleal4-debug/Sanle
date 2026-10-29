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
  eyebrow: "Sanle Studio · Engenharia de Software Autoral · Brasília e Atendimento Nacional",
  headlineTop: "Software desenhado para a",
  headlineBottom: "realidade da sua",
  headlineItalic: "operação comercial.",
  subheadline:
    "Construímos presenças digitais autorais de alto padrão, sistemas web sob medida e inteligência artificial prática. Sem templates pré-fabricados, sem dependência de plataformas de aluguel e com entrega ágil em 7 a 14 dias.",
  ctaPrimary: {
    label: "Tirar projeto do papel",
    href: "/#contato"
  },
  ctaSecondary: {
    label: "Explorar o estúdio interativo",
    href: "#portal-hero-container"
  },
  microProof: "Código 100% de propriedade do cliente · Entrega de 7 a 14 dias",
  abAlternatives: [
    {
      title: "Software sob medida que faz sua empresa vender mais e parar de perder tempo.",
      sub: "Vitrines de alta conversão, portais internos seguros e agentes de IA com contexto real."
    },
    {
      title: "Da dor operacional ao produto digital em produção.",
      sub: "Elimine o retrabalho de planilhas e feche mais negócios direto pelo WhatsApp."
    }
  ]
};
