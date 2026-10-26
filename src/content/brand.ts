/**
 * SANLE — Fonte única da verdade para identidade, posicionamento e informações
 * institucionais. Nada de nome duplicado pelo código: tudo lê daqui.
 *
 * Regra do projeto: NÃO inventar clientes, números, depoimentos, certificações ou
 * parcerias. Campos ainda não confirmados ficam explicitamente marcados como
 * pendentes e não são renderizados como prova.
 */

export const brand = {
  name: "Sales Hunter",
  legalName: "Sanle · Sales Hunter",
  tagline: "Engenharia de processos, automação operacional e conexão de sistemas",
  positioning:
    "Engenharia operacional que conecta os sistemas da sua empresa (ERP, WhatsApp, Notas Fiscais e Planilhas), eliminando retrabalho manual e dando previsibilidade ao negócio.",
  shortPitch:
    "Elimine o retrabalho manual. A Sanle conecta seus canais, documentos e ERP para sua empresa escalar com governança e previsibilidade.",
  founded: { city: "Brasília", uf: "DF", country: "Brasil" },
  serviceRegion:
    "Brasília e Distrito Federal, com arquitetura preparada para todo o território nacional.",
  contact: {
    email: process.env.NEXT_PUBLIC_SANLE_EMAIL || "pedrohenriquesanchesleal4@gmail.com",
    whatsapp: process.env.NEXT_PUBLIC_SANLE_WHATSAPP || "5561981399051",
    whatsappDisplay: "(61) 98139-9051",
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN || "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    city: "Brasília · DF"
  },
  social: {
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN || "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    github: process.env.NEXT_PUBLIC_SANLE_GITHUB || "https://github.com/pedrohenriquesanchesleal4-debug"
  }
} as const;

export const hero = {
  eyebrow: "THE OPPORTUNITY ENGINE · ENGENHARIA OPERACIONAL & AUTOMAÇÃO",
  headlineTop: "Toda grande empresa opera",
  headlineBottom: "em regime de fluxo contínuo.",
  subheadline:
    "Sem troca de ERPs. Conectamos WhatsApp, arquivos fiscais, planilhas e sistemas para sua equipe focar no cliente e na margem.",
  ctaPrimary: { label: "Mapear meu processo", href: "/diagnostico" },
  ctaSecondary: { label: "Ver demonstração", href: "/#como-funciona" }
} as const;

/** O problema invisível — tarefas que consomem tempo sem aparecer no resultado. */
export const invisibleWork = [
  { title: "Procurar documentos", note: "Arquivos espalhados entre pastas, e-mails e drives." },
  { title: "Renomear arquivos", note: "Padronização manual, feita pessoa a pessoa." },
  { title: "Conferir informações", note: "Conferência repetida que ninguém consegue auditar." },
  { title: "Copiar dados entre sistemas", note: "Digitar o mesmo dado em três lugares diferentes." },
  { title: "Corrigir inconsistências", note: "Erros descobertos só no fechamento do mês." },
  { title: "Cobrar respostas", note: "Pendências que somem porque não têm dono nem prazo." },
  { title: "Repetir as mesmas tarefas", note: "O mesmo trabalho, todos os dias, sem registro." }
] as const;

/** Transformação — antes e depois de um fluxo. Dados são ILUSTRATIVOS. */
export const transformation = {
  before: {
    label: "Antes",
    items: [
      "Documentos fiscais e recibos perdidos em caixas de entrada",
      "Planilhas paralelas atualizadas manualmente com fórmulas frágeis",
      "Redigitação repetida de dados no ERP e no financeiro",
      "Erros e duplicidades notados tardiamente no fim do mês",
      "Insegurança sobre a margem real e ausência de rastreabilidade"
    ]
  },
  after: {
    label: "Depois",
    items: [
      "Ingestão imediata de notas e recibos com extração estruturada",
      "Conexão direta entre WhatsApp, e-mails e sistemas de gestão",
      "Validação fiscal e contábil em tempo real com alerta de anomalias",
      "Trilha de auditoria append-only 100% verificável",
      "Intervenção humana necessária exclusivamente em divergências reais",
      "Governança total e tempo devolvido à diretoria"
    ]
  }
} as const;

export type Solution = {
  slug: string;
  code: string;
  title: string;
  short: string;
  audience: string;
  problem: string;
  how: string[];
  deliverables: string[];
  faq: { q: string; a: string }[];
};

export const solutions: Solution[] = [
  {
    slug: "automacao-documental-financeira",
    code: "A",
    title: "Ingestão e Validação Documental Financeira",
    short: "Conversão automática de comprovantes, notas fiscais e contratos em dados estruturados com conferência fiscal instantânea.",
    audience:
      "Empresas em crescimento, distribuidoras, escritórios de contabilidade, BPOs financeiros e prestadores de serviços corporativos.",
    problem:
      "Horas gastas redigitando notas e conferindo boletos em planilhas sem rastreabilidade.",
    how: [
      "Ingestão estruturada a partir de WhatsApp Business API, e-mails fiscais e pastas em nuvem",
      "Classificação e extração de schemas tipados sem intervenção manual",
      "Checagem determinística contra tabelas de preço, prazos e duplicidade",
      "Integração contábil direta com ERPs (Omie, ContaAzul, SAP, TOTVS)",
      "Trilha auditável append-only de cada processamento"
    ],
    deliverables: [
      "Pipeline de ingestão documental zero-touch",
      "Mecanismo de validação fiscal e anti-duplicidade",
      "Conectores prontos para os principais ERPs do mercado",
      "Painel de telemetria e reconciliação"
    ],
    faq: [
      { q: "A Sanle exige troca de ERP?", a: "Não. A engenharia conecta-se ao ERP que sua empresa já utiliza, sem migrações traumáticas." },
      { q: "O que acontece em caso de documento ilegível?", a: "O sistema sinaliza a exceção e encaminha para aprovação humana em fila única com 1 clique." }
    ]
  },
  {
    slug: "integracao-de-sistemas",
    code: "B",
    title: "Barramento e Integração Direta de Sistemas",
    short: "Sincronização bidirecional em tempo real entre seus canais de atendimento, bancos de dados e ERP.",
    audience:
      "Operações que sofrem com sistemas desconectados e retrabalho entre setores.",
    problem:
      "Vendas ocorrem no WhatsApp, o estoque está no sistema legado e o financeiro fica no escuro.",
    how: [
      "Desenho de arquitetura de dados e eventos em tempo real",
      "Conexão de APIs com retries idempotentes e tolerância a falhas",
      "Sanitização e conformidade estrita com a LGPD",
      "Redução da latência de sincronização para milissegundos",
      "Monitoramento proativo com alertas de indisponibilidade"
    ],
    deliverables: [
      "Barramento de integração customizado",
      "Webhooks seguros com verificação de integridade",
      "Logs estruturados com retenção segura",
      "Documentação técnica e manual de suporte"
    ],
    faq: [
      { q: "Quais bancos e ERPs são suportados?", a: "Qualquer sistema com API REST, banco relacional (PostgreSQL, SQL Server, MySQL) ou arquivos de exportação estruturados." },
      { q: "Como é garantida a segurança?", a: "Criptografia ponta a ponta (TLS 1.3 e AES-256) e respeito rigoroso às diretrizes da LGPD." }
    ]
  },
  {
    slug: "inteligencia-artificial-aplicada",
    code: "C",
    title: "Automação Operacional & Regras de Negócio",
    short: "Rotinas inteligentes com validação semântica e resolução de exceções sem burocracia.",
    audience:
      "Gestores e equipes operacionais que buscam escalar o volume de atendimento mantendo o mesmo quadro de funcionários.",
    problem:
      "Processos dependentes de memória de funcionários antigos, propensos a erros humanos e sem padronização.",
    how: [
      "Codificação de regras de negócio em nós determinísticos de validação",
      "Triagem e classificação semântica com guardrails estritos",
      "Aprovação humana apenas em desvios e valores discrepantes",
      "Histórico consultável de auditoria de decisões",
      "Integração com bases de conhecimento proprietárias da empresa"
    ],
    deliverables: [
      "Motor de regras operacionais em regime permanente",
      "Fluxo de contingência com aprovação humana rápida",
      "Relatórios de eficiência e gargalos eliminados",
      "Treinamento e passagem de bastão para a liderança interna"
    ],
    faq: [
      { q: "O sistema toma decisões arriscadas sozinho?", a: "Não. Parâmetros críticos exigem confirmação explícita do operador humano." },
      { q: "Quanto tempo dura a implementação?", a: "Geralmente os primeiros fluxos entram em operação plena dentro de 7 a 15 dias úteis." }
    ]
  },
  {
    slug: "operacao-comercial",
    code: "D",
    title: "Governança e Visibilidade Executiva em Tempo Real",
    short: "Painéis e relatórios consolidados para diretores enxergarem margem, custos e prazos antes do fim do mês.",
    audience:
      "Sócios e diretores que precisam de previsibilidade estratégica sem depender de planilhas defasadas.",
    problem:
      "Diretoria toma decisões no escuro com base em dados de fechamento do mês anterior.",
    how: [
      "Consolidação de métricas em painel executivo responsivo",
      "Alertas antecipados de desvios de margem ou custos fora do padrão",
      "Rastreabilidade por centro de custo e contrato",
      "Redução drástica do ciclo de fechamento contábil e financeiro",
      "Autonomia total para exportação de dados"
    ],
    deliverables: [
      "Dashboard executivo em tempo real",
      "Automação de relatórios periódicos",
      "Trilhas de auditoria para compliance",
      "Mapeamento de KPIs críticos de margem"
    ],
    faq: [
      { q: "Consigo acompanhar métricas pelo celular?", a: "Sim, os painéis são 100% responsivos e desenhados para visualização rápida no celular e desktop." },
      { q: "Como solicitar um diagnóstico inicial?", a: "Basta preencher o formulário no site ou falar diretamente com nosso especialista no WhatsApp." }
    ]
  }
];

/** Método de trabalho em 4 etapas. */
export const method = [
  {
    step: "01",
    title: "Diagnóstico e Mapeamento",
    body: "Analisamos cada etapa da sua rotina atual: onde dados são copiados manualmente, quais arquivos se perdem e onde estão os gargalos que drenam tempo."
  },
  {
    step: "02",
    title: "Arquitetura e Conexão",
    body: "Projetamos a tubulação invisível entre seus canais, documentos e ERP sem exigir a troca de nenhum software que sua empresa já utiliza."
  },
  {
    step: "03",
    title: "Implementação e Homologação",
    body: "Implementamos os fluxos em regime de testes assistidos, com validação de regras fiscais e conferência de conciliação com precisão estrita."
  },
  {
    step: "04",
    title: "Regime Permanente de Fluxo",
    body: "A operação entra em regime silencioso e contínuo. A equipe ganha horas úteis diárias e a liderança passa a gerir com previsibilidade."
  }
] as const;

/** FAQ institucional da Sanle. */
export const faqs = [
  { q: "O que a Sanle faz exatamente?", a: "Projetamos a infraestrutura operacional da sua empresa: conectamos seus sistemas existentes (ERPs como Omie, ContaAzul, canais de WhatsApp e arquivos fiscais) para que os dados fluam sem redigitação humana e sem retrabalho." },
  { q: "Minha empresa precisará trocar de softwares ou ERP?", a: "Não. A nossa engenharia conecta os sistemas que sua empresa já utiliza hoje, sem exigir migrações arriscadas nem descarte de softwares em operação." },
  { q: "Como contratar ou solicitar um projeto?", a: "Você pode solicitar um diagnóstico de processos diretamente pelo formulário do site ou entrar em contato pelo nosso WhatsApp institucional. Mapeamos seus fluxos e desenhamos a solução sob medida." },
  { q: "Quanto tempo leva para implementar os primeiros fluxos?", a: "Geralmente os primeiros pipelines entram em operação em poucos dias úteis, com validação de regras fiscais e trilha auditável completa." },
  { q: "Os dados da minha empresa ficam seguros?", a: "Sim. A arquitetura segue padrões rigorosos de segurança e LGPD, com isolamento de dados, criptografia em trânsito e em repouso e governança estrita de permissões." }
] as const;

/** Segmentos-alvo iniciais (usados no formulário de diagnóstico). */
export const segments = [
  "BPO financeiro e contabilidade",
  "Vidraçaria / marcenaria / indústria leve",
  "Distribuidora e logística",
  "Clínica médica e odontológica",
  "Escritório jurídico e consultoria",
  "Prestador de serviços corporativos B2B"
] as const;

export const finalCta = {
  headline: "Pronto para eliminar o atrito da sua operação?",
  body: "Mapeie seus processos com nossa equipe e descubra quanto tempo e margem sua empresa pode poupar a partir deste mês.",
  cta: "Mapear meu processo"
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production" ? "https://sanle.vercel.app" : "http://localhost:3000");
