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
  eyebrow: "ARQUITETURA DE OPERAÇÕES · BRASÍLIA - DF",
  headlineTop: "Menos atrito manual.",
  headlineBottom: "Mais",
  headlineItalic: "fluxo contínuo.",
  subheadline:
    "Substituímos o copia-e-cola de planilhas, a redigitação de notas e as cobranças manuais por uma malha de automação invisível — sem forçar sua empresa a trocar nenhum software que já utiliza.",
  ctaPrimary: {
    label: "Mapear meu processo",
    href: "/diagnostico"
  },
  ctaSecondary: {
    label: "Falar com Engenheiro no WhatsApp",
    href: "#whatsapp"
  },
  microProof: "Diagnóstico executivo de 30 min · Sem troca de softwares · Retorno de margem mensurável",
  abAlternatives: [
    {
      title: "Seu time não foi contratado para redigitar dados entre telas.",
      sub: "Conectamos WhatsApp, ERPs e documentos em fluxos auditáveis e automáticos."
    },
    {
      title: "Onde o atrito manual termina, a engenharia de fluxo começa.",
      sub: "Elimine gargalos invisíveis que drenam até 32% das horas úteis da sua equipe."
    }
  ]
};
