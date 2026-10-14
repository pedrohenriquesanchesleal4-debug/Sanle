/**
 * SANLE — Fonte única da verdade para identidade, posicionamento e informações
 * institucionais. Nada de nome duplicado pelo código: tudo lê daqui.
 *
 * Regra do projeto: NÃO inventar clientes, números, depoimentos, certificações ou
 * parcerias. Campos ainda não confirmados ficam explicitamente marcados como
 * pendentes e não são renderizados como prova.
 */

export const brand = {
  name: "Sanle",
  legalName: "Sanle", // razão social/CNPJ somente quando confirmados (ver pendências)
  tagline: "Automação de processos e IA aplicada aos negócios",
  positioning:
    "Identificamos gargalos operacionais e criamos soluções para reduzir trabalho manual, organizar informações e melhorar os processos que sustentam o crescimento das empresas.",
  shortPitch:
    "A Sanle conecta documentos, sistemas e inteligência artificial para reduzir trabalho manual e organizar a operação da sua empresa.",
  founded: { city: "Brasília", uf: "DF", country: "Brasil" },
  serviceRegion:
    "Brasília e Distrito Federal, com arquitetura preparada para outras cidades brasileiras.",
  contact: {
    // Somente dados REAIS. Enquanto não confirmados, a UI usa o formulário de
    // diagnóstico como canal primário e não exibe contato inventado.
    email: process.env.NEXT_PUBLIC_SANLE_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_SANLE_WHATSAPP ?? "",
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN ?? "",
    city: "Brasília · DF"
  },
  // Links sociais reais (preenchidos por env; vazios são ocultados na UI)
  social: {
    linkedin: process.env.NEXT_PUBLIC_SANLE_LINKEDIN ?? "",
    github: process.env.NEXT_PUBLIC_SANLE_GITHUB ?? ""
  }
} as const;

export const hero = {
  eyebrow: "Automação operacional · Brasília · DF",
  headlineTop: "Menos trabalho manual.",
  headlineBottom: "Mais fluxo de operação.",
  subheadline:
    "Identificamos tarefas repetitivas e conectamos documentos, sistemas e inteligência artificial para simplificar a rotina da sua empresa.",
  ctaPrimary: { label: "Mapear um processo", href: "/diagnostico" },
  ctaSecondary: { label: "Ver como funciona", href: "/#como-funciona" }
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
      "Arquivos dispersos em pastas diferentes",
      "Informações inconsistentes entre planilhas",
      "Etapas manuais que dependem de uma pessoa",
      "Dificuldade para acompanhar pendências",
      "Nenhum histórico de quem fez o quê"
    ]
  },
  after: {
    label: "Depois",
    items: [
      "Documentos organizados por regra",
      "Informações extraídas e padronizadas",
      "Validações automáticas de campos",
      "Pendências rastreáveis com dono e prazo",
      "Revisão humana onde realmente importa",
      "Dados prontos para o sistema que a empresa já usa"
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
    title: "Automação documental e financeira",
    short: "Organização de documentos, extração de informações, validação de campos e preparação de dados.",
    audience:
      "BPO financeiro, escritórios contábeis e empresas administrativas com grande volume de documentos (notas, comprovantes, contratos, extratos).",
    problem:
      "Recepção de documentos desorganizada, campos ausentes, duplicidades e conferência manual que consome dias no fechamento.",
    how: [
      "Diagnóstico do fluxo atual de recebimento e conferência",
      "Classificação e renomeação automática de arquivos por regra",
      "Extração de campos de PDFs, notas e comprovantes",
      "Validação de obrigatoriedade, formato e duplicidade",
      "Encaminhamento das exceções para revisão humana",
      "Exportação estruturada para o sistema financeiro da empresa"
    ],
    deliverables: [
      "Pipeline documental executável e agendável",
      "Relatório de exceções e pendências",
      "Base organizada e rastreável",
      "Documentação de operação e manutenção"
    ],
    faq: [
      { q: "A Sanle substitui meu sistema financeiro?", a: "Não. A Sanle organiza e prepara os dados para o sistema que sua empresa já usa." },
      { q: "E quando o documento vem ilegível?", a: "A exceção é marcada e encaminhada para revisão humana, com o motivo registrado." }
    ]
  },
  {
    slug: "integracao-de-sistemas",
    code: "B",
    title: "Integração de sistemas",
    short: "Conexão entre ferramentas, planilhas, formulários, armazenamento e sistemas empresariais.",
    audience:
      "Empresas que operam com várias ferramentas desconectadas: planilhas, formulários, pastas compartilhadas, ERPs e CRMs.",
    problem:
      "O mesmo dado é digitado em vários lugares e a informação só existe quando alguém lembra de copiá-la manualmente.",
    how: [
      "Mapeamento de fontes e destinos de dados",
      "Definição de contratos de integração entre sistemas",
      "Sincronização confiável e idempotente",
      "Tratamento de falhas, retentativas e alertas",
      "Registro de execução para auditoria"
    ],
    deliverables: [
      "Camada de integração entre as ferramentas existentes",
      "Painel de status das sincronizações",
      "Log de erros e reprocessamento",
      "Documentação das regras de negócio aplicadas"
    ],
    faq: [
      { q: "Preciso trocar minhas ferramentas?", a: "Não necessariamente. A Sanle começa integrando o que já existe e evolui conforme a necessidade." },
      { q: "Se a API de um sistema falhar, o que acontece?", a: "A falha é registrada, a operação é reprocessada e a pendência fica visível." }
    ]
  },
  {
    slug: "inteligencia-artificial-aplicada",
    code: "C",
    title: "Inteligência artificial aplicada",
    short: "Assistentes especializados, RAG, classificação, extração e apoio à análise de informações.",
    audience:
      "Empresas com regras específicas e volume de informação que exige leitura, classificação e respostas fundamentadas.",
    problem:
      "Excesso de informação não estruturada e decisões que dependem de leitura humana demorada e sujeita a variação.",
    how: [
      "Definição das regras e do escopo de atuação da IA",
      "Base de conhecimento curada e versionada",
      "Recuperação de contexto com fontes citadas",
      "Classificação e extração assistidas",
      "Guardrails: a IA não inventa e encaminha quando não sabe"
    ],
    deliverables: [
      "Assistente especializado no domínio do cliente",
      "Base de conhecimento gerenciável",
      "Registro de execuções e fontes utilizadas",
      "Avaliação de respostas sem contexto suficiente"
    ],
    faq: [
      { q: "A IA pode inventar informação?", a: "Não deve. Toda resposta cita as fontes recuperadas e, sem evidência, informa a limitação e encaminha." },
      { q: "Meus dados ficam seguros?", a: "As chaves ficam no servidor, o acesso é controlado e a política de tratamento é documentada (LGPD)." }
    ]
  },
  {
    slug: "operacao-comercial",
    code: "D",
    title: "Operação comercial",
    short: "Organização de solicitações, acompanhamento de orçamentos e estruturação de processos de vendas.",
    audience:
      "Prestadores de serviço, vidraçarias, marcenarias, empresas de instalação e recrutamento com muitos pedidos de orçamento.",
    problem:
      "Pedidos chegam por vários canais, orçamentos se perdem e oportunidades ficam sem acompanhamento.",
    how: [
      "Centralização das solicitações de orçamento",
      "Padronização de etapas do funil de vendas",
      "Geração assistida de propostas e acompanhamento",
      "Lembretes e próximas ações por oportunidade",
      "Indicadores de conversão e gargalos"
    ],
    deliverables: [
      "Funil comercial estruturado",
      "Modelos de proposta e mensagens revisáveis",
      "Histórico de interações por oportunidade",
      "Relatórios de acompanhamento"
    ],
    faq: [
      { q: "A Sanle faz disparo de mensagens?", a: "Não. A IA prepara o conteúdo e a pessoa decide quando e onde enviar." },
      { q: "Consigo acompanhar quem não respondeu?", a: "Sim. Cada oportunidade tem próxima ação e lembrete configurável." }
    ]
  }
];

/** Método de trabalho em 4 etapas. */
export const method = [
  {
    step: "01",
    title: "Diagnóstico do processo",
    body: "Entendemos onde o trabalho manual está custando tempo, mapeamos o fluxo real e medimos a situação atual."
  },
  {
    step: "02",
    title: "Definição de escopo e indicadores",
    body: "Você aprova um problema delimitado, com critérios de sucesso mensuráveis. Começamos pequeno, sem exigir que a empresa troque tudo."
  },
  {
    step: "03",
    title: "Implementação e validação",
    body: "Construímos, testamos com dados reais e validamos com quem executa a rotina, ajustando antes de ir para produção."
  },
  {
    step: "04",
    title: "Acompanhamento e melhoria contínua",
    body: "Medimos os indicadores, corrigimos desvios e evoluímos para automações maiores e manutenção recorrente."
  }
] as const;

/** Demonstrativo conceitual — claramente identificado como protótipo, sem dados reais. */
export const demoNotice =
  "Demonstração conceitual com dados fictícios. Ilustra o fluxo proposto e não está conectada a nenhum sistema financeiro real.";

/** FAQ institucional (base para SEO e para o RAG). */
export const faqs = [
  { q: "Como começa um projeto com a Sanle?", a: "Por um diagnóstico de um processo específico. Você descreve a dor, nós mapeamos o fluxo e propomos um escopo delimitado com indicadores." },
  { q: "Preciso trocar todos os meus sistemas?", a: "Não. A Sanle parte de um problema delimitado e integra o que a empresa já utiliza." },
  { q: "Quanto tempo leva?", a: "Depende do escopo. Cada proposta define etapas e prazos específicos após o diagnóstico — não trabalhamos com promessas genéricas." },
  { q: "A Sanle usa meus dados para treinar IA?", a: "Não. Os dados são tratados conforme a finalidade do projeto e a política de privacidade." },
  { q: "Vocês trabalham só em Brasília?", a: "O foco inicial é Brasília e o DF, com atendimento remoto e arquitetura preparada para outras cidades." },
  { q: "Como funciona a cobrança?", a: "O escopo e o modelo comercial são definidos na proposta. A Sanle evolui de projetos para contratos de manutenção e recorrência." }
] as const;

/** Segmentos-alvo iniciais (usados no formulário e na prospecção). */
export const segments = [
  "BPO financeiro",
  "Escritório contábil",
  "Empresa administrativa",
  "Grande volume de documentos",
  "Recrutamento e seleção",
  "Prestador de serviços com orçamentos",
  "Vidraçaria / marcenaria / instalação",
  "Pequena ou média empresa (planilhas e e-mail)"
] as const;

export const finalCta = {
  headline: "Qual etapa da sua operação não deveria mais depender de trabalho manual?",
  body: "Descreva o problema. Nós mapeamos o processo e propomos um caminho para reduzi-lo.",
  cta: "Conversar sobre meu processo"
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production" ? "https://sanle.vercel.app" : "http://localhost:3000");
