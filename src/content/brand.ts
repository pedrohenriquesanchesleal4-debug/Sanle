/**
 * SANLE — Fonte única da verdade para identidade, posicionamento e informações
 * institucionais.
 *
 * Regra do projeto: NÃO inventar clientes, números, depoimentos, certificações ou
 * parcerias. Toda comunicação reflete arquitetura de software verificável.
 */

export const brand = {
  name: "Sales Hunter",
  legalName: "Sanle · Engenharia de Software & Sistemas",
  tagline: "Produtos digitais, sistemas sob medida, agentes de inteligência artificial e automação operacional",
  positioning:
    "Transformamos necessidades reais de negócio em produtos digitais, sistemas web personalizados, agentes de inteligência artificial e automações que funcionam na prática.",
  shortPitch:
    "Boas ideias merecem sair do papel. Projetamos e desenvolvemos sites autorais, sistemas sob medida, agentes de IA e automações operacionais com arquitetura sólida.",
  founded: { city: "Brasília", uf: "DF", country: "Brasil" },
  serviceRegion:
    "Brasília e Distrito Federal, atendendo empresas em todo o território nacional.",
  contact: {
    email: process.env.NEXT_PUBLIC_SANLE_EMAIL || "pedrohenriquesanchesleal4@gmail.com",
    whatsapp: process.env.NEXT_PUBLIC_SANLE_WHATSAPP || "5561981399051",
    whatsappDisplay: "(61) 98139-9051",
    linkedin:
      process.env.NEXT_PUBLIC_SANLE_LINKEDIN ||
      "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    city: "Brasília · DF"
  },
  social: {
    linkedin:
      process.env.NEXT_PUBLIC_SANLE_LINKEDIN ||
      "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278",
    github:
      process.env.NEXT_PUBLIC_SANLE_GITHUB ||
      "https://github.com/pedrohenriquesanchesleal4-debug"
  }
} as const;

export const hero = {
  eyebrow: "SANLE STUDIO · THE OPPORTUNITY ENGINE · DIGITAL · SISTEMAS · AGENTES · AUTOMAÇÃO",
  headlineTop: "Boas ideias merecem",
  headlineBottom: "sair do",
  headlineItalic: "papel.",
  subheadline:
    "Transformamos necessidades de negócio em produtos digitais, sistemas sob medida, agentes de inteligência artificial e automações operacionais construídos para durar.",
  ctaPrimary: { label: "Tirar meu projeto do papel", href: "/#contato" },
  ctaSecondary: { label: "Explorar as 4 frentes", href: "/#capacidades" },
  microProof: "Digital · Sistemas Web · Agentes de IA · Automação de Processos"
} as const;

/** O atrito operacional e comercial que motiva novos sistemas. */
export const invisibleWork = [
  { title: "Presença digital genérica", note: "Sites que não comunicam o valor real da empresa nem convertem visitantes." },
  { title: "Operação refém de planilhas", note: "Controles paralelos frágeis que não acompanham o crescimento do negócio." },
  { title: "Atendimento lento e sem triagem", note: "Oportunidades comerciais esfriando na fila por falta de qualificação estruturada." },
  { title: "Sistemas que não conversam", note: "Equipes copiando os mesmos dados manualmente entre canais, financeiro e gestão." },
  { title: "Conhecimento interno disperso", note: "Manuais, contratos e regras dependentes da memória individual de colaboradores." },
  { title: "Falta de visibilidade executiva", note: "Decisões tomadas sem indicadores claros sobre funil, prazos e gargalos." },
  { title: "Retrabalho operacional diário", note: "Horas técnicas drenadas em tarefas mecânicas que poderiam fluir por software." }
] as const;

/** Transformação — contraste estrutural ilustrativo. */
export const transformation = {
  before: {
    label: "Operação Improvisada",
    items: [
      "Presença online defasada ou igual a dezenas de templates prontos",
      "Planilhas desconectadas substituindo um sistema de verdade",
      "Atendimento manual repetitivo sem contexto nem histórico centralizado",
      "Redigitação constante de informações entre ferramentas isoladas",
      "Baixa previsibilidade sobre etapas, prazos e gargalos da operação"
    ]
  },
  after: {
    label: "Engenharia Sanle",
    items: [
      "Experiências digitais autorais pensadas para clareza, autoridade e conversão",
      "Sistemas web, painéis e CRMs desenhados exatamente para a regra do negócio",
      "Agentes de IA com base de conhecimento própria (RAG) e supervisão humana",
      "Integrações via API e webhooks conectando canais aos sistemas existentes",
      "Histórico estruturado e rastreável de cada etapa do fluxo",
      "Autonomia técnica e governança clara sobre dados e processos"
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
    slug: "presenca-digital-e-experiencias-web",
    code: "01",
    title: "Sanle Digital · Sites, Landing Pages & Experiências Web",
    short: "Interfaces autorais, rápidas e responsivas que comunicam posicionamento e convertem visitantes em oportunidades comerciais.",
    audience:
      "Empresas que precisam elevar sua presença digital, lançar produtos ou captar oportunidades qualificadas.",
    problem:
      "Sites lentos, genéricos ou desatualizados que não transmitem a maturidade real da empresa.",
    how: [
      "Direção visual editorial sob medida, sem aparência de template genérico",
      "Arquitetura de informação orientada à clareza comercial e tomada de decisão",
      "Engenharia front-end em Next.js e React com foco em Core Web Vitals e SEO técnico",
      "Formulários inteligentes e integração direta com WhatsApp e CRM",
      "Painel administrativo opcional para gestão autônoma de conteúdo"
    ],
    deliverables: [
      "Site institucional ou landing page de alta conversão",
      "Design system responsivo (desktop, tablet e mobile)",
      "Estrutura de SEO técnico, metadados e dados estruturados (Schema.org)",
      "Integração com canais comerciais e analytics"
    ],
    faq: [
      { q: "O site funciona bem no celular?", a: "Sim. Cada composição é desenhada e testada para telas móveis, tablets e desktops." },
      { q: "Já fica integrado ao WhatsApp e ao CRM?", a: "Sim. Os pontos de conversão podem enviar os dados diretamente para o seu WhatsApp comercial e para o painel de leads." }
    ]
  },
  {
    slug: "sistemas-web-e-aplicacoes-sob-medida",
    code: "02",
    title: "Sanle Systems · Sistemas Web, Painéis, Portais & CRMs",
    short: "Software sob medida para estruturar operações, substituir planilhas críticas e centralizar a gestão do negócio.",
    audience:
      "Operações em crescimento cujos processos já não cabem em planilhas ou softwares engessados de prateleira.",
    problem:
      "Processos espalhados em dezenas de abas de planilhas, sem controle de acesso, histórico ou visão executiva.",
    how: [
      "Mapeamento das entidades, permissões e regras de negócio reais da operação",
      "Desenvolvimento de interfaces limpas e funcionais para equipes internas ou clientes",
      "Modelagem de banco de dados relacional (PostgreSQL) com controle de acesso por perfil",
      "Construção de APIs documentadas para comunicação com outras ferramentas",
      "Entregas incrementais em ambiente de homologação antes da entrada em produção"
    ],
    deliverables: [
      "Aplicação web completa (painel gerencial, portal do cliente, CRM ou sistema interno)",
      "Banco de dados estruturado com controle de permissões",
      "Histórico de atividades e exportação de dados",
      "Documentação técnica e passagem de conhecimento"
    ],
    faq: [
      { q: "Vocês desenvolvem MVPs e produtos digitais do zero?", a: "Sim. Projetamos desde a primeira versão funcional (MVP) até plataformas corporativas completas." },
      { q: "O sistema pode evoluir depois da entrega?", a: "Sim. A arquitetura é modular justamente para permitir novas funcionalidades conforme a operação cresce." }
    ]
  },
  {
    slug: "agentes-de-ia-e-assistentes-rag",
    code: "03",
    title: "Sanle Agents · Agentes de IA, RAG & Atendimento Inteligente",
    short: "Assistentes conectados aos documentos e ferramentas da sua empresa para triar demandas, responder com contexto e apoiar a equipe.",
    audience:
      "Empresas que desejam agilizar o atendimento comercial, padronizar a triagem ou consultar acervos técnicos e jurídicos com rapidez.",
    problem:
      "Clientes esperando horas por respostas iniciais ou equipes perdendo tempo procurando informações em pastas e manuais.",
    how: [
      "Indexação organizada de manuais, catálogos, contratos e políticas da empresa (RAG)",
      "Definição de escopo estrito de atuação e instruções de sistema alinhadas ao tom da marca",
      "Integração com ferramentas (consulta de status, coleta de briefing, qualificação de lead)",
      "Respostas fundamentadas com indicação da fonte consultada",
      "Transferência estruturada para atendimento humano (human-in-the-loop) sempre que necessário"
    ],
    deliverables: [
      "Agente conversacional para WhatsApp, web ou uso interno da equipe",
      "Base de conhecimento indexada e atualizável",
      "Painel de histórico de conversas e supervisão",
      "Regras de transbordo para especialistas humanos"
    ],
    faq: [
      { q: "O agente inventa informações ou preços?", a: "Projetamos os agentes para operar sobre a base de conhecimento fornecida pela empresa (RAG) e transferir para um humano quando a pergunta foge do escopo." },
      { q: "Um atendente humano pode assumir a conversa?", a: "Sim. O fluxo prevê transferência para a equipe com o resumo do que já foi coletado." }
    ]
  },
  {
    slug: "automacao-de-processos-e-integracoes",
    code: "04",
    title: "Sanle Automation · Integrações, Documentos & Fluxos Operacionais",
    short: "Pipelines automatizados que conectam sistemas, extraem dados de documentos e reduzem o trabalho manual repetitivo.",
    audience:
      "Equipes financeiras, contábeis, jurídicas e operacionais sobrecarregadas com digitação, triagem e conciliação manual.",
    problem:
      "Horas diárias gastas baixando anexos, conferindo valores e copiando dados manualmente entre sistemas.",
    how: [
      "Captura estruturada de documentos e eventos vindos de e-mail, WhatsApp, formulários ou webhooks",
      "Extração e validação de dados contra regras de negócio definidas pela operação",
      "Sincronização automatizada via API ou arquivos estruturados com os sistemas utilizados",
      "Separação clara entre casos padrão e exceções que exigem revisão humana",
      "Registro detalhado de cada execução para conferência e governança"
    ],
    deliverables: [
      "Pipeline de automação e transformação de dados",
      "Conectores e webhooks de integração entre sistemas",
      "Fila de revisão para tratamento de divergências",
      "Logs de execução e monitoramento de falhas"
    ],
    faq: [
      { q: "Preciso trocar o ERP ou software que minha empresa já usa?", a: "Não. Quando o objetivo é automação ou integração, conectamos as ferramentas que sua operação já utiliza." },
      { q: "O que acontece quando um documento apresenta divergência?", a: "O fluxo não avança às cegas: ele separa o item divergente e notifica o responsável para validação." }
    ]
  }
];

/** Método de trabalho em 4 etapas (aplicável às 4 frentes). */
export const method = [
  {
    step: "01",
    title: "Imersão & Escopo Claro",
    body: "Ouvimos a necessidade do negócio, entendemos o contexto atual e definimos o que realmente precisa ser construído — sem jargões desnecessários nem escopos inflados."
  },
  {
    step: "02",
    title: "Arquitetura & Prototipagem",
    body: "Desenhamos a experiência visual, a estrutura de dados e as integrações antes de escalar o código, garantindo alinhamento sobre como a solução vai funcionar."
  },
  {
    step: "03",
    title: "Construção & Integração",
    body: "Desenvolvemos o site, sistema, agente ou automação com código limpo, tipagem estrita, testes automatizados e conexão com as ferramentas da sua operação."
  },
  {
    step: "04",
    title: "Homologação & Evolução",
    body: "Validamos cada fluxo junto à sua equipe, colocamos em produção com segurança e acompanhamos a evolução contínua conforme o negócio cresce."
  }
] as const;

/** FAQ institucional da Sanle (cobrindo as 4 frentes). */
export const faqs = [
  {
    q: "Quais tipos de projetos a Sanle desenvolve?",
    a: "Atuamos em quatro frentes complementares: 1) Digital (sites institucionais autorais, landing pages e experiências web); 2) Sistemas (aplicações web sob medida, painéis, portais, CRMs e APIs); 3) Agentes de IA (assistentes com RAG, atendimento inteligente e ferramentas contextualizadas); e 4) Automação (integrações entre sistemas, processamento documental e redução de rotinas manuais)."
  },
  {
    q: "Posso contratar apenas um site, um sistema específico ou uma automação pontual?",
    a: "Sim. Você não precisa contratar um pacote fechado. Começamos exatamente pela frente que traz retorno mais direto para o momento da sua empresa — seja tirar uma ideia de produto digital do papel, renovar sua presença online ou automatizar um processo crítico."
  },
  {
    q: "Minha empresa precisará trocar as ferramentas que já utiliza?",
    a: "Não obrigatoriamente. Quando você já utiliza um ERP, CRM ou canal que atende bem parte da operação, podemos integrar nossos sistemas, agentes e automações a ele via API ou webhooks. E quando uma planilha ou ferramenta antiga limita o crescimento, criamos o sistema sob medida para substituí-la com segurança."
  },
  {
    q: "Como funcionam os prazos e o formato de contratação?",
    a: "Trabalhamos tanto por escopo fechado (ideal para lançamento de sites, MVPs, sistemas delimitados e automações específicas) quanto por evolução contínua e sustentação. O prazo depende da complexidade do escopo; dividimos o projeto em entregas incrementais para que você acompanhe a evolução desde as primeiras semanas."
  },
  {
    q: "Como a Sanle cuida da segurança e da privacidade dos dados?",
    a: "Aplicamos boas práticas de engenharia de software desde o desenho da arquitetura: tráfego criptografado via HTTPS/TLS, separação de ambientes, controle de acesso por perfil, coleta mínima de dados alinhada à LGPD e supervisão humana em fluxos críticos de inteligência artificial."
  }
] as const;

/** Segmentos atendidos (usados no formulário de contato/diagnóstico). */
export const segments = [
  "Serviços corporativos & consultorias B2B",
  "BPO financeiro, contabilidade & finanças",
  "Escritórios jurídicos & advocacia",
  "Saúde, clínicas médicas & odontológicas",
  "Comércio, distribuição & logística",
  "Indústria leve, engenharia & serviços técnicos",
  "Tecnologia, startups & novos produtos digitais"
] as const;

export const finalCta = {
  headline: "Boas ideias merecem sair do papel.",
  body: "Conte o que sua empresa precisa construir, organizar ou automatizar. Respondemos com uma análise técnica clara e o melhor caminho de implementação.",
  cta: "Iniciar conversa sobre meu projeto"
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production" ? "https://sanle.vercel.app" : "http://localhost:3000");
