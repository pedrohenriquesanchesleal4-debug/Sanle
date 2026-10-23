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
  eyebrow: "AUTOMAÇÃO OPERACIONAL · BRASÍLIA · DF",
  headlineTop: "Menos trabalho manual.",
  headlineBottom: "Mais",
  headlineItalic: "fluxo.",
  subheadline:
    "Conectamos documentos, sistemas e inteligência artificial para tirar da rotina da sua empresa o que ninguém deveria fazer à mão.",
  ctaPrimary: {
    label: "Mapear meu processo",
    href: "/diagnostico"
  },
  ctaSecondary: {
    label: "Chamar no WhatsApp",
    href: "#whatsapp"
  },
  microProof: "Diagnóstico inicial · sem exigir troca de sistemas",
  abAlternatives: [
    {
      title: "Seu time não deveria copiar dados o dia inteiro.",
      sub: "Conectamos planilhas, ERPs e documentos em fluxos confiáveis e automáticos."
    },
    {
      title: "O trabalho que ninguém vê é o que mais custa.",
      sub: "Elimine gargalos operacionais invisíveis antes que eles limitem o crescimento."
    }
  ]
};
