export interface SegmentInfo {
  id: string;
  slug: string;
  tabLabel: string;
  headline: string;
  description: string;
  flowExample: string[];
  metrics: { label: string; val: string }[];
  ctaLabel: string;
}

export const SEGMENTS_DATA: SegmentInfo[] = [
  {
    id: "bpo-financeiro",
    slug: "bpo-financeiro",
    tabLabel: "Finanças & BPO",
    headline: "Sistemas de controle, triagem documental e conciliação para operações financeiras.",
    description:
      "Reduza a rotina de baixar extratos manualmente, renomear comprovantes e redigitar lançamentos no sistema financeiro de cada cliente.",
    flowExample: [
      "Recebimento estruturado de extratos e comprovantes por e-mail, portal ou WhatsApp",
      "Identificação de CNPJ, valor, data e categoria com validação de regras do processo",
      "Exportação padronizada ou integração via API com o sistema contábil/financeiro",
      "Sinalização de divergências em fila de revisão humana"
    ],
    metrics: [
      { label: "Foco operacional", val: "Triagem & conciliação" },
      { label: "Exceções", val: "Fila de revisão humana" }
    ],
    ctaLabel: "Conversar sobre solução financeira"
  },
  {
    id: "escritorios",
    slug: "escritorios",
    tabLabel: "Jurídico & Consultorias",
    headline: "Portais de clientes, organização de acervo e pesquisa assistida por IA (RAG).",
    description:
      "Transforme documentos dispersos em bases estruturadas, com nomenclatura padronizada e busca contextual em contratos e precedentes internos.",
    flowExample: [
      "Coleta organizada de documentos e briefing inicial de clientes",
      "Classificação automática por cliente, área ou número de referência",
      "Pesquisa semântica (RAG) em contratos e acervo interno com citação de fonte",
      "Apoio na montagem de minutas padronizadas a partir de dados validados"
    ],
    metrics: [
      { label: "Organização", val: "Indexação estruturada" },
      { label: "Consulta interna", val: "RAG com fontes citadas" }
    ],
    ctaLabel: "Conversar sobre solução para escritórios"
  },
  {
    id: "prestadores-de-servico",
    slug: "prestadores-de-servico",
    tabLabel: "Operações & Serviços B2B",
    headline: "Presença digital forte, sistemas de pedidos e atendimento inteligente.",
    description:
      "Para empresas com atendimento consultivo, equipes técnicas ou orçamentos sob medida. Conecte a captação comercial ao controle de execução.",
    flowExample: [
      "Landing page ou site autoral captando demandas qualificadas",
      "Agente de atendimento coletando especificações iniciais pelo WhatsApp",
      "Painel web para gestão de orçamentos, ordens de serviço e prazos",
      "Acompanhamento claro de cada etapa desde o primeiro contato até a entrega"
    ],
    metrics: [
      { label: "Jornada comercial", val: "Captação à entrega" },
      { label: "Controle interno", val: "Painel sob medida" }
    ],
    ctaLabel: "Conversar sobre solução operacional"
  }
];
