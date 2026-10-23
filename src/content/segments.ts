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
    tabLabel: "BPO Financeiro",
    headline: "Automação documental e conciliação para carteiras de clientes com alto volume.",
    description:
      "Elimine a rotina de baixar extratos bancários manualmente, renomear comprovantes Pix e redigitar lançamentos no ERP de cada cliente atendido.",
    flowExample: [
      "Extratos e comprovantes recebidos automaticamente por e-mail ou WhatsApp",
      "Reconhecimento de CNPJ, valor, data e categoria com validação cruzada",
      "Geração de arquivo de importação ou envio direto via API para o Omie, ContaAzul ou ERP",
      "Alerta imediato apenas para divergências ou ausência de documento suporte"
    ],
    metrics: [
      { label: "Tempo de fechamento", val: "-60%" },
      { label: "Erros de conciliação", val: "Quase zero" }
    ],
    ctaLabel: "Ver solução para BPO financeiro"
  },
  {
    id: "escritorios",
    slug: "escritorios",
    tabLabel: "Escritórios (Contábil e Jurídico)",
    headline: "Organização de pastas, certidões e extração de dados de processos.",
    description:
      "Transforme documentos despadronizados enviados pelos clientes em pastas estruturadas, com renomeação padronizada e leitura inteligente de termos e prazos.",
    flowExample: [
      "Upload centralizado de guias, contratos e documentos probatórios",
      "Classificação instantânea por cliente, exercício contábil ou número de processo",
      "Extração automática de metadados críticos (valores, partes, datas limite)",
      "Indexação com busca semântica para localização instantânea de qualquer cláusula"
    ],
    metrics: [
      { label: "Localização de arquivos", val: "Instantânea" },
      { label: "Padronização de acervo", val: "100%" }
    ],
    ctaLabel: "Ver solução para escritórios"
  },
  {
    id: "prestadores-de-servico",
    slug: "prestadores-de-servico",
    tabLabel: "Prestadores de Serviço",
    headline: "Agilidade na emissão de orçamentos, contratos e cobrança de pendências.",
    description:
      "Para empresas com equipes em campo ou orçamentos customizados (marcenarias, vidraçarias, instalações, consultorias). Reduza o tempo entre a solicitação e o contrato assinado.",
    flowExample: [
      "Solicitação de orçamento recebida via formulário ou mensagem",
      "Cálculo automático de custos e composição de proposta em PDF padronizado",
      "Disparo do link para aprovação e assinatura digital do cliente",
      "Criação automática da ordem de serviço e cobrança de entrada"
    ],
    metrics: [
      { label: "Tempo de proposta", val: "Sob demanda" },
      { label: "Contratos perdidos por demora", val: "-75%" }
    ],
    ctaLabel: "Ver solução para prestadores de serviço"
  }
];
