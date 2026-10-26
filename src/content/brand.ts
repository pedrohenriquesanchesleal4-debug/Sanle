/**
 * SALES HUNTER (SANLE) — Fonte única da verdade para identidade, posicionamento e informações
 * institucionais. Nada de nome duplicado pelo código: tudo lê daqui.
 *
 * Regra do projeto: NÃO inventar clientes, números, depoimentos, certificações ou
 * parcerias. Campos ainda não confirmados ficam explicitamente marcados como
 * pendentes e não são renderizados como prova.
 */

export const brand = {
  name: "Sales Hunter",
  legalName: "Sanle · Sales Hunter",
  tagline: "Inteligência comercial para prospecção B2B, diagnóstico de oportunidades e conversão",
  positioning:
    "Plataforma de inteligência comercial que ajuda a encontrar empresas reais, identificar oportunidades de negócio, priorizar leads, gerar abordagens personalizadas e organizar negociações do primeiro sinal ao fechamento.",
  shortPitch:
    "Do desconhecido à descoberta. Da descoberta à oportunidade. Da oportunidade à conversa. O Sales Hunter transforma informações dispersas de empresas em oportunidades comerciais acionáveis.",
  founded: { city: "Brasília", uf: "DF", country: "Brasil" },
  serviceRegion:
    "Brasília e Distrito Federal, com arquitetura preparada para todo o território nacional.",
  contact: {
    // Somente dados REAIS. Enquanto não confirmados, a UI usa o formulário de
    // diagnóstico como canal primário e não exibe contato inventado.
    email: process.env.NEXT_PUBLIC_SANLE_EMAIL || "pedrohenriquesanchesleal4@gmail.com",
    whatsapp: process.env.NEXT_PUBLIC_SANLE_WHATSAPP || "5561981399051",
    whatsappDisplay: "(61) 98139-9051",
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN || "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    city: "Brasília · DF"
  },
  // Links sociais reais (preenchidos por env; vazios são ocultados na UI)
  social: {
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN || "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    github: process.env.NEXT_PUBLIC_SANLE_GITHUB || "https://github.com/pedrohenriquesanchesleal4-debug"
  }
} as const;

export const hero = {
  eyebrow: "THE OPPORTUNITY ENGINE · PROSPECÇÃO B2B",
  headlineTop: "Todo negócio começa",
  headlineBottom: "com uma oportunidade.",
  subheadline:
    "Do desconhecido à descoberta. Da descoberta à oportunidade. Da oportunidade à conversa.",
  ctaPrimary: { label: "Começar a prospectar", href: "/admin/login" },
  ctaSecondary: { label: "Explorar a plataforma", href: "/#produto-real" }
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
      "Pesquisa manual em dezenas de abas e mapas soltos",
      "Empresas sem qualificação nem critério de prioridade",
      "Abordagens genéricas ignoradas no WhatsApp",
      "Dificuldade para lembrar quem respondeu ou pediu retorno",
      "Nenhum histórico centralizado do funil comercial"
    ]
  },
  after: {
    label: "Depois",
    items: [
      "Descoberta estruturada de empresas por nicho e região",
      "Diagnóstico claro da presença digital e oportunidade sugerida",
      "Score de priorização explicável antes do primeiro contato",
      "Mensagens personalizadas e páginas de demonstração 1-a-1",
      "Pipeline Kanban com próximas ações e lembretes rastreáveis",
      "Histórico completo da primeira busca ao relacionamento comercial"
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
    title: "Descoberta territorial e mapeamento de empresas",
    short: "Localização de negócios reais por nicho, cidade e bairro usando fontes abertas e verificáveis.",
    audience:
      "Equipes comerciais B2B, agências digitais, consultorias, software houses e prestadores de serviços corporativos.",
    problem:
      "Prospecção feita no escuro, copiando telefones manualmente sem contexto sobre a maturidade digital de cada empresa.",
    how: [
      "Busca estruturada por categoria, cidade, UF e bairro via OpenStreetMap/Overpass ou CSV",
      "Higienização e deduplicação automática contra a base atual do CRM",
      "Identificação de sinais públicos (endereço, telefone, presença ou ausência de website nos dados consultados)",
      "Importação seletiva para o funil com trilha de procedência auditável",
      "Organização imediata em listas e buscas salvas"
    ],
    deliverables: [
      "Buscador territorial multi-provedor integrado ao CRM",
      "Detector de duplicatas sem mesclagem destrutiva",
      "Importador de planilhas CSV com validação",
      "Histórico de buscas salvas por região e nicho"
    ],
    faq: [
      { q: "O buscador exige API paga para funcionar?", a: "Não. O provedor padrão utiliza OpenStreetMap/Overpass gratuitamente, mantendo Google Places como opcional controlado." },
      { q: "Os leads encontrados são mesclados sozinhos?", a: "Não. Possíveis duplicatas são sinalizadas para decisão humana." }
    ]
  },
  {
    slug: "integracao-de-sistemas",
    code: "B",
    title: "Diagnóstico de oportunidade e score explicável",
    short: "Priorização inteligente baseada em sinais públicos e justificativa transparente de cada pontuação.",
    audience:
      "Operações comerciais que precisam focar energia nas empresas com maior aderência ao serviço ofertado.",
    problem:
      "Vendedores gastam o mesmo tempo com leads frios e com empresas que têm necessidade imediata.",
    how: [
      "Análise automática dos dados disponíveis do estabelecimento",
      "Cálculo determinístico de score de priorização (0 a 100) com fatores abertos",
      "Identificação de lacunas (ex.: website não identificado nos dados consultados, canais de contato)",
      "Sugestão de oportunidade comercial e serviço recomendado",
      "Classificação em prioridade alta, média ou baixa"
    ],
    deliverables: [
      "Motor de scoring transparente por fatores",
      "Painel de diagnóstico por empresa",
      "Hipótese comercial editável pelo operador",
      "Filtros de priorização na base de leads"
    ],
    faq: [
      { q: "Como o score é calculado?", a: "Por fatores objetivos e visíveis no detalhe de cada lead, sem caixa-preta." },
      { q: "Posso ajustar a prioridade manualmente?", a: "Sim. O operador tem controle total sobre etapa, prioridade e hipótese comercial." }
    ]
  },
  {
    slug: "inteligencia-artificial-aplicada",
    code: "C",
    title: "Geração de abordagens e demonstrações 1-a-1",
    short: "Mensagens personalizadas para WhatsApp e e-mail + páginas de demonstração exclusivas por lead.",
    audience:
      "Prospecção consultiva que precisa iniciar conversas relevantes sem parecer disparo em massa.",
    problem:
      "Mensagens copiadas e coladas geram rejeição imediata e não demonstram valor concreto para o negócio prospectado.",
    how: [
      "Geração de rascunhos de primeiro contato, follow-up, convite de reunião e proposta",
      "Criação com 1 clique de página personalizada (/p/[slug]) com diagnóstico para o prospect",
      "Abertura direta do WhatsApp com mensagem contextualizada e link da demonstração",
      "Rastreamento de leitura e eventos quando o lead acessa a demonstração",
      "Aprovação humana obrigatória antes de qualquer envio"
    ],
    deliverables: [
      "Gerador de abordagens multi-canal (WhatsApp, E-mail, LinkedIn, Ligação)",
      "Gerador de landing pages personalizadas por lead",
      "Integração rápida com WhatsApp Web/App",
      "Biblioteca de rascunhos com controle de status"
    ],
    faq: [
      { q: "A plataforma faz disparos automáticos em massa?", a: "Não. O Sales Hunter prepara a abordagem personalizada e o profissional inicia a conversa com qualidade." },
      { q: "Preciso de ferramentas ou assinaturas externas para começar?", a: "Não. O Sales Hunter conta com motor nativo integrado de geração contextual e bases territoriais gratuitas, sem depender de assinaturas adicionais." }
    ]
  },
  {
    slug: "operacao-comercial",
    code: "D",
    title: "Pipeline Kanban, follow-ups e gestão de relacionamento",
    short: "Organização visual de todas as negociações, da primeira busca ao fechamento.",
    audience:
      "Times e profissionais que precisam de previsibilidade comercial sem perder oportunidades por falta de acompanhamento.",
    problem:
      "Conversas iniciadas no WhatsApp esquecidas sem próximo passo, sem lembrete e sem visibilidade de funil.",
    how: [
      "Quadro Kanban interativo com atualização real no banco de dados",
      "Registro automático de cada mudança de etapa na linha do tempo do lead",
      "Alertas de leads sem próxima ação definida e lembretes com vencimento",
      "Assistente interno com acesso ao contexto do CRM e base de conhecimento",
      "Visão executiva do funil e atividades dos últimos 30 dias"
    ],
    deliverables: [
      "Pipeline comercial completo em 11 estágios",
      "Timeline auditável de atividades e notas por lead",
      "Sistema de lembretes e alertas de estagnação",
      "Mecanismo de consulta e inteligência operacional integrada"
    ],
    faq: [
      { q: "Consigo saber quais leads estão parados?", a: "Sim. O painel destaca imediatamente todos os leads sem próxima ação ou com lembretes vencidos." },
      { q: "Funciona com Supabase gratuito?", a: "Sim, opera em Supabase Free ou armazenamento local sem custos." }
    ]
  }
];

/** Método de trabalho em 4 etapas. */
export const method = [
  {
    step: "01",
    title: "Exploração territorial",
    body: "Você define o nicho e a localização. O Sales Hunter mapeia estabelecimentos reais e organiza os dados disponíveis sem ruído."
  },
  {
    step: "02",
    title: "Sinal e diagnóstico",
    body: "O motor identifica lacunas digitais, calcula o score de prioridade explicável e aponta qual serviço oferecer a cada empresa."
  },
  {
    step: "03",
    title: "Abordagem e demonstração",
    body: "Em segundos, você gera uma mensagem sob medida e uma página de demonstração exclusiva para abrir conversa no WhatsApp."
  },
  {
    step: "04",
    title: "Pipeline e conversão",
    body: "O lead entra no CRM Kanban com próxima ação, histórico completo e lembretes de follow-up até se tornar cliente."
  }
] as const;

/** Demonstrativo conceitual — claramente identificado como protótipo, sem dados reais. */
export const demoNotice =
  "Demonstração interativa com dados sintéticos ilustrativos. Não executa chamadas automáticas ao Google Places na página pública.";

/** FAQ institucional (base para SEO e para o RAG). */
export const faqs = [
  { q: "O que é o Sales Hunter?", a: "É uma plataforma de inteligência comercial B2B que integra descoberta de empresas, diagnóstico de oportunidades, geração de abordagens, páginas de demonstração e CRM em um único fluxo." },
  { q: "A plataforma exige assinatura de APIs pagas?", a: "Não. A arquitetura é Free-First: funciona com OpenStreetMap gratuito, armazenamento local ou Supabase Free e geração determinística sem custo obrigatório." },
  { q: "Os dados mostrados na animação da página inicial são de clientes reais?", a: "Não. As cenas narrativas da landing page utilizam dados demonstrativos identificados como ilustrativos para explicar o funcionamento da plataforma sem expor terceiros nem consumir API." },
  { q: "Posso usar o Google Places se eu tiver uma chave própria?", a: "Sim. O conector Google Places já existe no sistema e permanece desligado por padrão para proteger seu orçamento, podendo ser habilitado nas configurações." },
  { q: "O Sales Hunter envia mensagens sozinho no WhatsApp?", a: "Não. A plataforma cria a abordagem personalizada e abre o WhatsApp pronto para envio, garantindo revisão humana e zero bloqueio por spam." },
  { q: "Como acesso a área de trabalho?", a: "Basta clicar em 'Acessar conta' ou 'Começar a prospectar' para entrar diretamente no ambiente operacional." }
] as const;

/** Segmentos-alvo iniciais (usados no formulário e na prospecção). */
export const segments = [
  "Vidraçaria / marcenaria / instalação",
  "Oficina mecânica e estética automotiva",
  "Clínica médica e odontológica",
  "Restaurante e gastronomia",
  "Barbearia e estética",
  "BPO financeiro e contabilidade",
  "Escritório jurídico e consultoria",
  "Prestador de serviços locais B2B"
] as const;

export const finalCta = {
  headline: "Suas próximas oportunidades começam aqui.",
  body: "Transforme dados públicos dispersos em diagnósticos claros, abordagens inteligentes e negociações organizadas no CRM.",
  cta: "Começar a prospectar"
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production" ? "https://sanle.vercel.app" : "http://localhost:3000");
