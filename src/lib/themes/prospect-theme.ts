export type PrototypeKind =
  | "clinic_scheduler"
  | "glass_calculator"
  | "bpo_vault"
  | "legal_rag"
  | "b2b_orders"
  | "auto_os"
  | "general_catalog";

export interface NicheThemeConfig {
  id: string;
  categoryName: string;
  badgeLabel: string;
  tagline: string;
  palette: {
    bg: string;
    bgSubtle: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentLight: string;
    accentDim: string;
    accentHover: string;
    accentGlow: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    buttonBg: string;
    buttonText: string;
    cardBorderHover: string;
  };
  typography: {
    fontDisplay: string;
    fontBody: string;
  };
  heroVisual: {
    imageUrl: string;
    alt: string;
    caption: string;
  };
  services: {
    title: string;
    desc: string;
    benefit: string;
    imageUrl?: string;
  }[];
  transformation: {
    beforeTitle: string;
    beforeItems: string[];
    afterTitle: string;
    afterItems: string[];
  };
  prototype: {
    kind: PrototypeKind;
    badge: string;
    title: string;
    description: string;
  };
  roadmap: {
    step: string;
    title: string;
    duration: string;
    detail: string;
  }[];
}

export function getNicheTheme(rawNicho?: string | null, rawEmpresa?: string | null): NicheThemeConfig {
  const n = (rawNicho || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const e = (rawEmpresa || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const combined = `${n} ${e}`;

  // 1. Clínicas Médicas, Odontologia, Saúde, Estética, Bem-Estar
  if (
    combined.includes("odonto") ||
    combined.includes("dent") ||
    combined.includes("clinic") ||
    combined.includes("medic") ||
    combined.includes("saude") ||
    combined.includes("estetica") ||
    combined.includes("dermato") ||
    combined.includes("terapia") ||
    combined.includes("hospital")
  ) {
    return {
      id: "saude_clinica",
      categoryName: "Saúde & Odontologia Especializada",
      badgeLabel: "SAÚDE, CLÍNICAS & BEM-ESTAR",
      tagline: "Atendimento humanizado com triagem no WhatsApp, confirmação automática de consultas e prontuário integrado.",
      palette: {
        bg: "#06131D",
        bgSubtle: "#0A1C2A",
        surface: "#0E2436",
        surfaceElevated: "#132E44",
        border: "rgba(45, 212, 191, 0.15)",
        borderStrong: "rgba(45, 212, 191, 0.35)",
        textPrimary: "#F0FDFA",
        textSecondary: "#99F6E4",
        textMuted: "#5EEAD4",
        accent: "#14B8A6",
        accentLight: "#2DD4BF",
        accentDim: "rgba(20, 184, 166, 0.16)",
        accentHover: "#0D9488",
        accentGlow: "rgba(45, 212, 191, 0.25)",
        badgeBg: "rgba(20, 184, 166, 0.14)",
        badgeBorder: "rgba(45, 212, 191, 0.35)",
        badgeText: "#2DD4BF",
        buttonBg: "#0D9488",
        buttonText: "#FFFFFF",
        cardBorderHover: "rgba(45, 212, 191, 0.5)"
      },
      typography: {
        fontDisplay: "font-serif-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
        alt: "Consultório odontológico e médico moderno e tecnológico",
        caption: "Ambiente clínico tecnológico com foco em acolhimento e agilidade no atendimento."
      },
      services: [
        {
          title: "Portal do Paciente & Agendamento Digital",
          desc: "Página moderna apresentando corpo clínico, especialidades, convênios aceitos e localização.",
          benefit: "Pacientes encontram tudo facilmente sem ligar repetidamente.",
          imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Secretária de IA para WhatsApp 24/7",
          desc: "Triagem imediata de novos pacientes, esclarecimento de dúvidas sobre preparo de exames e coleta de dados.",
          benefit: "Nenhum paciente fica sem resposta, inclusive à noite e nos fins de semana.",
          imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Confirmação Automática & Redução de Faltas",
          desc: "Disparo programado no WhatsApp para confirmação, cancelamento antecipado e fila de espera.",
          benefit: "Redução de até 70% nas faltas (no-show) na agenda dos doutores.",
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Como a recepção da clínica funciona hoje:",
        beforeItems: [
          "Pacientes esperando horas no WhatsApp por uma resposta de horário livre.",
          "Recepcionista gastando 3 a 4 horas por dia ligando ou digitando confirmações manualmente.",
          "Taxa de faltas e horários ociosos na cadeira gerando perda financeira semanal.",
          "Falta de catálogo claro de tratamentos estéticos e ortodônticos para o paciente escolher."
        ],
        afterTitle: "Com o Sistema & Presença Digital Sanle:",
        afterItems: [
          "Presença digital de alto padrão que transmite autoridade e segurança aos novos pacientes.",
          "Agente de IA no WhatsApp atendendo imediatamente com triagem da especialidade desejada.",
          "Confirmação automática com 1 clique (Sim/Não) e remanejamento automático de vagas.",
          "Recepção liberada para cuidar do atendimento presencial e do acolhimento na clínica."
        ]
      },
      prototype: {
        kind: "clinic_scheduler",
        badge: "PROTÓTIPO INTERATIVO · CLÍNICA DIGITAL",
        title: "Experimente o Fluxo de Agendamento Inteligente",
        description: "Simule a experiência do seu paciente escolhendo a especialidade médica/odontológica e recebendo atendimento imediato pelo WhatsApp."
      },
      roadmap: [
        {
          step: "01",
          title: "Personalização Visual & Especialidades",
          duration: "Dias 1 a 4",
          detail: "Definição das cores da clínica, fotos dos consultórios, listagem dos médicos/dentistas e regras de agendamento."
        },
        {
          step: "02",
          title: "Integração WhatsApp & Fluxo de Confirmação",
          duration: "Dias 5 a 9",
          detail: "Conexão do número comercial da clínica ao agente de triagem e teste dos disparos de confirmação."
        },
        {
          step: "03",
          title: "Entrada em Produção & Acompanhamento",
          duration: "Dias 10 a 14",
          detail: "Publicação do site no domínio oficial da clínica, treinamento rápido da recepção e monitoramento."
        }
      ]
    };
  }

  // 2. Vidraçaria, Esquadrias, Alumínio, Fachadas, Serralheria, Marmoraria
  if (
    combined.includes("vidr") ||
    combined.includes("esquadr") ||
    combined.includes("alumin") ||
    combined.includes("fachad") ||
    combined.includes("box") ||
    combined.includes("temperad") ||
    combined.includes("marmor") ||
    combined.includes("serralh") ||
    combined.includes("espelho")
  ) {
    return {
      id: "vidracaria_esquadrias",
      categoryName: "Vidraçaria, Esquadrias & Fachadas",
      badgeLabel: "ARQUITETURA, VIDROS & ESQUADRIAS",
      tagline: "Catálogo interativo com cálculo ágil de m², orçamentos pré-formatados no WhatsApp e gestão de medidas.",
      palette: {
        bg: "#0D0F14",
        bgSubtle: "#141720",
        surface: "#1A1E29",
        surfaceElevated: "#222736",
        border: "rgba(245, 158, 11, 0.18)",
        borderStrong: "rgba(245, 158, 11, 0.4)",
        textPrimary: "#FEF3C7",
        textSecondary: "#FDE68A",
        textMuted: "#D97706",
        accent: "#F59E0B",
        accentLight: "#FBBF24",
        accentDim: "rgba(245, 158, 11, 0.15)",
        accentHover: "#D97706",
        accentGlow: "rgba(245, 158, 11, 0.28)",
        badgeBg: "rgba(245, 158, 11, 0.14)",
        badgeBorder: "rgba(245, 158, 11, 0.35)",
        badgeText: "#FBBF24",
        buttonBg: "#F59E0B",
        buttonText: "#0D0F14",
        cardBorderHover: "rgba(245, 158, 11, 0.55)"
      },
      typography: {
        fontDisplay: "font-sans-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        alt: "Fachada arquitetônica em pele de vidro e esquadrias de alumínio preto",
        caption: "Design arquitetural de alto padrão com projetos executados em vidro temperado e laminado."
      },
      services: [
        {
          title: "Catálogo Interativo de Linhas & Acabamentos",
          desc: "Apresentação em alta definição de esquadrias Linha Suprema/Gold, peles de vidro, guarda-corpos e box Elegance.",
          benefit: "O cliente final e arquitetos visualizam os acabamentos antes de pedir orçamento.",
          imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Calculadora de Pré-Orçamento por m²",
          desc: "O cliente digita a largura e altura da janela/porta/box e recebe uma estimativa inicial instantânea.",
          benefit: "Elimina curiosos e entrega ao vendedor um lead pronto para fechamento.",
          imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Atendimento no WhatsApp com Envio de Medidas",
          desc: "Formulário rápido que compila medidas, espessura do vidro e endereço da obra em 1 clique para o WhatsApp.",
          benefit: "Reduz o tempo de confecção de orçamentos de horas para minutos.",
          imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Como a vidraçaria/esquadrias perde tempo hoje:",
        beforeItems: [
          "Orçamentos travados em cadernos e planilhas manuais demorando até 2 dias para sair.",
          "Cliente pede cotação no WhatsApp, não recebe fotos profissionais e fecha com concorrente mais rápido.",
          "Dúvidas repetitivas sobre espessura do vidro, cores de perfis e prazo de entrega.",
          "Dificuldade de passar autoridade para construtoras e escritórios de arquitetura de alto padrão."
        ],
        afterTitle: "Com o Portal & Engenharia da Sanle:",
        afterItems: [
          "Presença digital imponente que posiciona sua fábrica como referência técnica na região.",
          "Simulador interativo onde o cliente simula m² e já chega com as medidas prontas.",
          "Mensagem de WhatsApp formatada com especificação técnica completa, agilizando o fechamento.",
          "Histórico organizado de obras e pedidos para evitar divergências de corte e instalação."
        ]
      },
      prototype: {
        kind: "glass_calculator",
        badge: "PROTÓTIPO INTERATIVO · ESTIMADOR DE M²",
        title: "Simule a Calculadora de Esquadrias e Vidros",
        description: "Teste como seu cliente selecionará a tipologia (Box, Janela, Porta ou Pele de Vidro) e gerará a cotação pronta no seu WhatsApp."
      },
      roadmap: [
        {
          step: "01",
          title: "Curadoria do Catálogo & Portfólio",
          duration: "Dias 1 a 4",
          detail: "Seleção das melhores fotos de obras da sua empresa, tipos de perfis, vidros e tabela de referência."
        },
        {
          step: "02",
          title: "Configuração da Calculadora & WhatsApp",
          duration: "Dias 5 a 8",
          detail: "Ajuste das fórmulas de m², formulário de medidas e integração com o número comercial da vidraçaria."
        },
        {
          step: "03",
          title: "Lançamento Comercial & Ativação",
          duration: "Dias 9 a 12",
          detail: "Publicação do site com domínio próprio e ativação nas campanhas e perfil do Google Meu Negócio."
        }
      ]
    };
  }

  // 3. Contabilidade, BPO Financeiro, Gestão Fiscal & Tributária
  if (
    combined.includes("contab") ||
    combined.includes("bpo") ||
    combined.includes("financ") ||
    combined.includes("tribut") ||
    combined.includes("fiscal") ||
    combined.includes("auditor")
  ) {
    return {
      id: "contabilidade_bpo",
      categoryName: "Contabilidade & BPO Financeiro",
      badgeLabel: "BPO FINANCEIRO & GESTÃO CONTÁBIL",
      tagline: "Posicionamento consultivo para empresas, recepção estruturada de documentos e conciliação ágil.",
      palette: {
        bg: "#0A111E",
        bgSubtle: "#0F1A2D",
        surface: "#15243E",
        surfaceElevated: "#1D3154",
        border: "rgba(59, 130, 246, 0.18)",
        borderStrong: "rgba(59, 130, 246, 0.38)",
        textPrimary: "#EFF6FF",
        textSecondary: "#BFDBFE",
        textMuted: "#60A5FA",
        accent: "#3B82F6",
        accentLight: "#60A5FA",
        accentDim: "rgba(59, 130, 246, 0.15)",
        accentHover: "#2563EB",
        accentGlow: "rgba(59, 130, 246, 0.3)",
        badgeBg: "rgba(59, 130, 246, 0.14)",
        badgeBorder: "rgba(59, 130, 246, 0.35)",
        badgeText: "#93C5FD",
        buttonBg: "#2563EB",
        buttonText: "#FFFFFF",
        cardBorderHover: "rgba(59, 130, 246, 0.55)"
      },
      typography: {
        fontDisplay: "font-serif-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        alt: "Reunião de planejamento financeiro corporativo com relatórios e tecnologia",
        caption: "Gestão contábil e consultoria estratégica para empresas que buscam segurança fiscal e lucro."
      },
      services: [
        {
          title: "Portal Corporativo de Serviços & Planos",
          desc: "Apresentação dos planos de contabilidade consultiva, BPO de contas a pagar/receber e folha de pagamento.",
          benefit: "Atrai clientes do Simples, Lucro Presumido e Real com proposta de valor clara.",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Cofre Digital & Cobrança de Documentos",
          desc: "Área prática para clientes enviarem extratos OFX, comprovantes e notas com avisos automáticos de vencimento.",
          benefit: "Elimina a corrida manual no fim do mês cobrando documentos pendentes.",
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Integração Direta com ERPs (Omie, ContaAzul)",
          desc: "Conexão de dados entre o canal de recebimento e os sistemas contábeis da carteira.",
          benefit: "Reduz em mais de 60% as horas de digitação manual de lançamentos.",
          imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Desafios operacionais comuns na contabilidade:",
        beforeItems: [
          "Clientes enviando fotos de comprovantes borrados pelo WhatsApp misturados com conversas pessoais.",
          "Analistas fiscais perdendo dias redigitando extratos bancários e notas fiscais.",
          "Site institucional antigo que parece estagnado e não atrai empresas de maior faturamento.",
          "Dificuldade de justificar honorários contábeis mais altos por falta de ferramentas visíveis."
        ],
        afterTitle: "Com o Ecossistema Digital Sanle:",
        afterItems: [
          "Site moderno e sóbrio com posicionamento de consultoria de alto valor para empresários.",
          "Canal padronizado de upload de arquivos que valida o formato antes de passar para a equipe.",
          "Lembretes automáticos no WhatsApp alertando datas-limite de envio de guias e impostos.",
          "Percepção imediata de tecnologia e governança na relação com o cliente."
        ]
      },
      prototype: {
        kind: "bpo_vault",
        badge: "PROTÓTIPO INTERATIVO · RECEPÇÃO FISCAL",
        title: "Simule a Entrega Digital de Documentos",
        description: "Experimente como seus clientes corporativos enviam notas fiscais e extratos bancários de forma organizada e segura."
      },
      roadmap: [
        {
          step: "01",
          title: "Arquitetura dos Planos & Segmentos",
          duration: "Dias 1 a 4",
          detail: "Definição das mensagens para médicos, prestadores de serviço, comércio e indústrias da sua carteira."
        },
        {
          step: "02",
          title: "Construção do Portal & Canais Rápidos",
          duration: "Dias 5 a 9",
          detail: "Desenvolvimento do site, formulários de diagnóstico tributário e botões de atendimento setorial."
        },
        {
          step: "03",
          title: "Validação & Lançamento",
          duration: "Dias 10 a 14",
          detail: "Configuração do domínio, validação com primeiros clientes e ativação do funil comercial."
        }
      ]
    };
  }

  // 4. Advocacia, Escritórios Jurídicos, Despachantes
  if (
    combined.includes("advoc") ||
    combined.includes("jurid") ||
    combined.includes("direito") ||
    combined.includes("despach") ||
    combined.includes("cartor")
  ) {
    return {
      id: "advocacia_juridico",
      categoryName: "Advocacia & Serviços Jurídicos",
      badgeLabel: "DIREITO & CONSULTORIA JURÍDICA",
      tagline: "Presença digital de alta credibilidade, triagem de casos com sigilo e acervo de teses consultáveis.",
      palette: {
        bg: "#100F11",
        bgSubtle: "#17151A",
        surface: "#211D26",
        surfaceElevated: "#2C2733",
        border: "rgba(217, 119, 6, 0.2)",
        borderStrong: "rgba(217, 119, 6, 0.45)",
        textPrimary: "#FAF5EE",
        textSecondary: "#FDE68A",
        textMuted: "#B45309",
        accent: "#D97706",
        accentLight: "#F59E0B",
        accentDim: "rgba(217, 119, 6, 0.16)",
        accentHover: "#B45309",
        accentGlow: "rgba(217, 119, 6, 0.3)",
        badgeBg: "rgba(217, 119, 6, 0.15)",
        badgeBorder: "rgba(217, 119, 6, 0.38)",
        badgeText: "#FCD34D",
        buttonBg: "#D97706",
        buttonText: "#100F11",
        cardBorderHover: "rgba(217, 119, 6, 0.6)"
      },
      typography: {
        fontDisplay: "font-serif-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
        alt: "Escritório de advocacia sofisticado com biblioteca jurídica",
        caption: "Banca jurídica de referência com tradição, rigor técnico e soluções ágeis para clientes."
      },
      services: [
        {
          title: "Site Institucional de Notório Saber",
          desc: "Apresentação elegante das áreas de atuação, sócios, publicações e artigos jurídicos relevantes.",
          benefit: "Gera credibilidade imediata em contratos empresariais e ações estratégicas.",
          imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Triagem Prévia de Casos & LGPD",
          desc: "Formulário protegido para coleta segura dos primeiros dados do caso antes da consulta com o advogado.",
          benefit: "Filtra causas viáveis e prepara o advogado com contexto antes da reunião.",
          imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Consulta Inteligente a Contratos & Minutas (RAG)",
          desc: "Assistente interno para advogados consultarem cláusulas, contratos anteriores e modelos em segundos.",
          benefit: "Economia de dezenas de horas na elaboração de novas peças e pareceres.",
          imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Gargalos habituais em escritórios jurídicos:",
        beforeItems: [
          "Muitas mensagens no WhatsApp de casos que não têm aderência à especialidade do escritório.",
          "Dificuldade de localizar rapidamente minutas e precedentes salvos em pastas desorganizadas.",
          "Site desatualizado sem conformidade clara com as novas diretrizes de publicidade da OAB.",
          "Lentidão no envio de documentos para assinatura e procurações."
        ],
        afterTitle: "Com a Presença & Ferramentas da Sanle:",
        afterItems: [
          "Presença web com estética sóbria e refinada, em total harmonia com as regras éticas da OAB.",
          "Triagem qualificada no WhatsApp direcionando clientes diretamente para a área do direito correta.",
          "Sistema de busca inteligente no acervo do escritório para elaboração rápida de minutas.",
          "Agendamento de consultas com integração automática com o Google Agenda do advogado."
        ]
      },
      prototype: {
        kind: "legal_rag",
        badge: "PROTÓTIPO INTERATIVO · TRIAGEM JURÍDICA",
        title: "Simule a Triagem de Atendimento Jurídico",
        description: "Veja como o cliente seleciona a área jurídica, descreve brevemente o caso e é encaminhado com privacidade à banca certa."
      },
      roadmap: [
        {
          step: "01",
          title: "Alinhamento das Áreas & Identidade",
          duration: "Dias 1 a 4",
          detail: "Definição do perfil dos sócios, áreas de atuação e tom de comunicação institucional."
        },
        {
          step: "02",
          title: "Desenvolvimento do Portal & Triagem",
          duration: "Dias 5 a 9",
          detail: "Construção das páginas com tipografia refinada e formulário seguro de triagem."
        },
        {
          step: "03",
          title: "Revisão Ética & Publicação",
          duration: "Dias 10 a 14",
          detail: "Validação final com a equipe e publicação no domínio oficial do escritório."
        }
      ]
    };
  }

  // 5. Oficinas Mecânicas, Auto Centers, Peças & Diagnóstico Automotivo
  if (
    combined.includes("mecan") ||
    combined.includes("auto") ||
    combined.includes("oficin") ||
    combined.includes("injec") ||
    combined.includes("pneu") ||
    combined.includes("reparo") ||
    combined.includes("manutencao")
  ) {
    return {
      id: "oficina_mecanica",
      categoryName: "Oficina Mecânica & Diagnóstico Automotivo",
      badgeLabel: "OFICINA MECÂNICA & AUTO CENTER",
      tagline: "Acompanhamento de Ordens de Serviço (OS) online, aprovação de orçamentos e confiança automotiva.",
      palette: {
        bg: "#0B0E14",
        bgSubtle: "#121721",
        surface: "#1A202C",
        surfaceElevated: "#232B3B",
        border: "rgba(234, 88, 12, 0.2)",
        borderStrong: "rgba(234, 88, 12, 0.45)",
        textPrimary: "#FFF7ED",
        textSecondary: "#FED7AA",
        textMuted: "#EA580C",
        accent: "#EA580C",
        accentLight: "#FB923C",
        accentDim: "rgba(234, 88, 12, 0.16)",
        accentHover: "#C2410C",
        accentGlow: "rgba(234, 88, 12, 0.3)",
        badgeBg: "rgba(234, 88, 12, 0.15)",
        badgeBorder: "rgba(234, 88, 12, 0.38)",
        badgeText: "#FDBA74",
        buttonBg: "#EA580C",
        buttonText: "#FFFFFF",
        cardBorderHover: "rgba(234, 88, 12, 0.6)"
      },
      typography: {
        fontDisplay: "font-sans-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80",
        alt: "Oficina mecânica limpa e equipada com tecnologia de diagnóstico veicular",
        caption: "Precisão mecânica, transparência nos laudos e peças de procedência garantida."
      },
      services: [
        {
          title: "Consulta de Status da OS por Placa",
          desc: "O cliente acessa pelo celular e vê fotos do serviço, peças trocadas e quando o carro estará liberado.",
          benefit: "Elimina dezenas de ligações diárias perguntando 'meu carro já está pronto?'.",
          imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Aprovação de Orçamentos via WhatsApp",
          desc: "Envio de laudo técnico com fotos das peças desgastadas e botão de aprovação rápida.",
          benefit: "Acelera a liberação do serviço de dias para minutos.",
          imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Lembrete Automático de Revisão Periódica",
          desc: "Avisos automáticos após 6 meses para troca de óleo, freios e correias preventivas.",
          benefit: "Traz clientes antigos de volta para a oficina sem custo de anúncio.",
          imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Rotina operacional típica de uma oficina:",
        beforeItems: [
          "Mecânicos interrompendo o serviço para responder mensagens de clientes sobre status.",
          "Orçamentos em blocos de papel perdidos ou com valores difíceis de ler.",
          "Clientes desconfiados por não verem fotos do que realmente precisava ser trocado.",
          "Oficina cheia de carros parados aguardando aprovação demorada de cotação."
        ],
        afterTitle: "Com o Sistema de Atendimento Sanle:",
        afterItems: [
          "Portal da oficina transmitindo profissionalismo e credibilidade com avaliações reais.",
          "Página de acompanhamento onde o cliente digita a placa e vê o progresso da bancada.",
          "Orçamento transparente enviado no WhatsApp com fotos nítidas e botão de aceite.",
          "Fidelização automática com avisos de troca de óleo preventiva após a quilometragem média."
        ]
      },
      prototype: {
        kind: "auto_os",
        badge: "PROTÓTIPO INTERATIVO · PAINEL DE OS",
        title: "Consulte o Rastreamento de Veículo na Oficina",
        description: "Simule a consulta de um cliente digitando a placa do veículo para visualizar o laudo técnico e peças aprovadas."
      },
      roadmap: [
        {
          step: "01",
          title: "Apresentação dos Serviços & Box",
          duration: "Dias 1 a 4",
          detail: "Fotos da oficina, listagem dos serviços (injeção, suspensão, câmbio, ar condicionado) e localização."
        },
        {
          step: "02",
          title: "Configuração do Rastreamento & WhatsApp",
          duration: "Dias 5 a 8",
          detail: "Módulo leve de consulta por placa e modelos de orçamento padronizados no WhatsApp."
        },
        {
          step: "03",
          title: "Treinamento & Go-Live",
          duration: "Dias 9 a 12",
          detail: "Lançamento do site e integração com o perfil do Google Meu Negócio da oficina."
        }
      ]
    };
  }

  // 6. Distribuidoras, Atacado & Logística B2B
  if (
    combined.includes("distrib") ||
    combined.includes("atacad") ||
    combined.includes("logist") ||
    combined.includes("pecas") ||
    combined.includes("estoque") ||
    combined.includes("forneced")
  ) {
    return {
      id: "distribuidora_logistica",
      categoryName: "Distribuidora & Atacado B2B",
      badgeLabel: "DISTRIBUIÇÃO, ATACADO & LOGÍSTICA B2B",
      tagline: "Portal B2B de autoatendimento, catálogo de produtos em lote e sincronização com ERP.",
      palette: {
        bg: "#0B111E",
        bgSubtle: "#101A2D",
        surface: "#17253F",
        surfaceElevated: "#1E3052",
        border: "rgba(14, 165, 233, 0.2)",
        borderStrong: "rgba(14, 165, 233, 0.45)",
        textPrimary: "#F0F9FF",
        textSecondary: "#BAE6FD",
        textMuted: "#38BDF8",
        accent: "#0284C7",
        accentLight: "#38BDF8",
        accentDim: "rgba(2, 132, 199, 0.16)",
        accentHover: "#0369A1",
        accentGlow: "rgba(14, 165, 233, 0.3)",
        badgeBg: "rgba(2, 132, 199, 0.15)",
        badgeBorder: "rgba(14, 165, 233, 0.38)",
        badgeText: "#7DD3FC",
        buttonBg: "#0284C7",
        buttonText: "#FFFFFF",
        cardBorderHover: "rgba(14, 165, 233, 0.6)"
      },
      typography: {
        fontDisplay: "font-sans-editorial",
        fontBody: "font-sans"
      },
      heroVisual: {
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        alt: "Galpão logístico e centro de distribuição moderno com mercadorias organizadas",
        caption: "Logística ágil e distribuição em escala para o mercado corporativo e varejo."
      },
      services: [
        {
          title: "Catálogo B2B para Lojistas e Frotistas",
          desc: "Tabela de preços por volume, estoque em tempo real e busca rápida por código de fábrica.",
          benefit: "Seus clientes compram repetidamente sem depender de ligar para o televendas.",
          imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Esteira Rápida de Pedidos no WhatsApp",
          desc: "Formulário de carrinho corporativo onde o comprador seleciona quantidades e gera o pedido formal.",
          benefit: "Reduz o tempo de digitação de pedidos dos vendedores internos em até 80%.",
          imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Integração Direta com ERP & Faturamento",
          desc: "Conexão dos pedidos aprovados diretamente na esteira de expedição e emissão de NF-e.",
          benefit: "Elimina gargalos e atrasos no despacho de mercadorias.",
          imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80"
        }
      ],
      transformation: {
        beforeTitle: "Desafios comerciais da distribuição tradicional:",
        beforeItems: [
          "Vendedores internos gastando metade do dia redigitando listas de pedidos enviadas em PDF.",
          "Clientes reclamando de demora no envio da tabela de preços atualizada.",
          "Erros de digitação de códigos de peças gerando devoluções de mercadorias caras.",
          "Concorrentes com portais modernos captando os melhores clientes da região."
        ],
        afterTitle: "Com o Portal B2B da Sanle:",
        afterItems: [
          "Portal B2B com navegação rápida em mobile e desktop para pedidos em lote.",
          "Catálogo digital sempre sincronizado com as condições de pagamento e estoque.",
          "Pedidos chegando prontos e validados para separação imediata no depósito.",
          "Visão gerencial dos clientes que pararam de comprar para reativação comercial ágil."
        ]
      },
      prototype: {
        kind: "b2b_orders",
        badge: "PROTÓTIPO INTERATIVO · PEDIDO B2B EM LOTE",
        title: "Simule o Carrinho Rápido para Compradores",
        description: "Experimente como um cliente lojista ou corporativo seleciona itens, ajusta quantidades e gera o pedido em 1 clique."
      },
      roadmap: [
        {
          step: "01",
          title: "Mapeamento das Linhas & Preços",
          duration: "Dias 1 a 4",
          detail: "Organização das categorias de produtos, regras de frete e prazos de entrega da distribuidora."
        },
        {
          step: "02",
          title: "Construção do Catálogo & Carrinho",
          duration: "Dias 5 a 9",
          detail: "Desenvolvimento do portal B2B responsivo com envio de pedidos diretamente para a equipe comercial."
        },
        {
          step: "03",
          title: "Validação com Clientes Piloto",
          duration: "Dias 10 a 14",
          detail: "Liberação do portal para os primeiros clientes corporativos e ativação da esteira."
        }
      ]
    };
  }

  // 7. Geral, Comércio, Serviços Corporativos & Consultorias (Default High-Craft)
  return {
    id: "servicos_geral",
    categoryName: "Serviços Corporativos & Negócios",
    badgeLabel: "PRESENÇA DIGITAL & ENGENHARIA DE PROCESSOS",
    tagline: "Presença digital autoral, atendimento ágil no WhatsApp e esteira de vendas desenhada sob medida.",
    palette: {
      bg: "#0B0D14",
      bgSubtle: "#111520",
      surface: "#181D2C",
      surfaceElevated: "#20273B",
      border: "rgba(99, 102, 241, 0.2)",
      borderStrong: "rgba(99, 102, 241, 0.45)",
      textPrimary: "#F5F7FF",
      textSecondary: "#C7D2FE",
      textMuted: "#818CF8",
      accent: "#6366F1",
      accentLight: "#818CF8",
      accentDim: "rgba(99, 102, 241, 0.16)",
      accentHover: "#4F46E5",
      accentGlow: "rgba(99, 102, 241, 0.3)",
      badgeBg: "rgba(99, 102, 241, 0.15)",
      badgeBorder: "rgba(99, 102, 241, 0.38)",
      badgeText: "#A5B4FC",
      buttonBg: "#4F46E5",
      buttonText: "#FFFFFF",
      cardBorderHover: "rgba(99, 102, 241, 0.6)"
    },
    typography: {
      fontDisplay: "font-serif-editorial",
      fontBody: "font-sans"
    },
    heroVisual: {
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      alt: "Espaço corporativo moderno com ambiente de trabalho colaborativo",
      caption: "Engenharia de processos e presença digital autoral para empresas em crescimento."
    },
    services: [
      {
        title: "Site Institucional & Páginas de Conversão",
        desc: "Design exclusivo que destaca os diferenciais da sua empresa e transforma visitas em propostas comerciais.",
        benefit: "Posicionamento comercial sólido para fechar mais negócios.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Atendente de IA Integrado ao WhatsApp",
        desc: "Triagem imediata de leads, respostas a perguntas frequentes e encaminhamento qualificado para o vendedor.",
        benefit: "Velocidade máxima no primeiro contato comercial.",
        imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Painel Gerencial de Clientes & Oportunidades",
        desc: "Sistema web sob medida para organizar demandas, pedidos e histórico sem depender de planilhas frágeis.",
        benefit: "Visibilidade completa sobre o andamento de cada cliente.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
      }
    ],
    transformation: {
      beforeTitle: "O que limita o crescimento da operação hoje:",
      beforeItems: [
        "Presença online que não reflete a qualidade real dos serviços entregues pela empresa.",
        "Leads comerciais esfriando no WhatsApp por falta de resposta rápida e catálogo organizado.",
        "Controles manuais em planilhas que geram erros e retrabalho diário na equipe.",
        "Falta de um sistema próprio centralizando clientes e histórico de pedidos."
      ],
      afterTitle: "Com o Ecossistema Desenvolvido pela Sanle:",
      afterItems: [
        "Presença digital autoral de alto impacto que transmite confiança imediata.",
        "Canal comercial conectado ao WhatsApp com triagem e apresentação clara de soluções.",
        "Sistemas web desenhados exatamente para a regra do seu negócio, sem mensalidades abusivas.",
        "Previsibilidade comercial e tempo livre para a diretoria focar em novas vendas."
      ]
    },
    prototype: {
      kind: "general_catalog",
      badge: "PROTÓTIPO INTERATIVO · VITRINE & COTAÇÃO",
      title: "Simule a Experiência do Seu Cliente no Canal Digital",
      description: "Experimente a jornada de um cliente escolhendo uma solução e iniciando o atendimento consultivo imediatamente."
    },
    roadmap: [
      {
        step: "01",
        title: "Mapeamento & Direção Visual",
        duration: "Dias 1 a 4",
        detail: "Definição do posicionamento, identidade de marca e principais pontos de conversão."
      },
      {
        step: "02",
        title: "Construção do Site & Canais Comerciais",
        duration: "Dias 5 a 9",
        detail: "Desenvolvimento da interface, catálogo de soluções e automação de atendimento."
      },
      {
        step: "03",
        title: "Homologação & Lançamento",
        duration: "Dias 10 a 14",
        detail: "Testes finais de usabilidade, publicação no domínio oficial e treinamento da equipe."
      }
    ]
  };
}
