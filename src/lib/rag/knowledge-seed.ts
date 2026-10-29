import { brand, solutions, method, faqs, segments } from "@/content/brand";
import { createKnowledgeDoc, listKnowledgeDocs } from "@/lib/db/repo";
import { indexDocument, reprocessAll } from "./ingest";

/** Reexportado para compatibilidade: `knowledge/route.ts` importa daqui. */
export { indexDocument } from "./ingest";

/**
 * Documentos institucionais iniciais da base de conhecimento (RAG).
 * Derivados de `brand.ts` e dos playbooks comerciais comprovados da Sanle.
 * Nada aqui inventa clientes falsos, certificações inexistentes ou métricas sem base.
 */

export function baseKnowledge(): { title: string; category: string; content: string }[] {
  const docs: { title: string; category: string; content: string }[] = [];

  docs.push({
    title: "Institucional — quem é a Sanle",
    category: "institucional",
    content: [
      `# ${brand.name}`,
      brand.positioning,
      "",
      `Pitch curto: ${brand.shortPitch}`,
      "",
      `Região de atuação: ${brand.serviceRegion}`,
      "",
      "## O que a Sanle desenvolve e entrega",
      "- Sites e Landing Pages de alta conversão: portais institucionais, páginas de venda e demonstrações comerciais interativas com foco em conversão e captação de clientes.",
      "- Sistemas Web Personalizados: plataformas completas, portais empresariais, CRMs sob medida, dashboards operacionais e painéis administrativos.",
      "- Automação Operacional e Comercial: automação de tarefas manuais, conciliação bancária, validação de documentos fiscais e integrações entre sistemas legados e ERPs.",
      "- Agentes de Inteligência Artificial: assistentes de atendimento para WhatsApp, atendentes inteligentes de triagem, agentes internos para equipes e soluções RAG sobre bases de conhecimento empresariais.",
      "- APIs e Integrações de Sistemas: conexão entre sistemas que a empresa já utiliza (CRMs, ERPs, gateways de pagamento, plataformas fiscais) para eliminar redigitação.",
      "- Produtos Digitais e MVPs: desenvolvimento ágil de ferramentas próprias de software e produtos digitais completos e prontos para produção.",
      "",
      "## O que a Sanle NÃO faz",
      "Não vende templates prontos sem estratégia nem soluções de IA sem governança. Todas as aplicações têm engenharia robusta, código limpo e foco em resultados operacionais reais.",
      "",
      "## Princípios",
      "Começa pelo problema do negócio; foca em transformar desafios manuais em soluções eficientes; mantém revisão humana e governança rigorosa."
    ].join("\n")
  });

  docs.push({
    title: "Processo comercial",
    category: "processo",
    content: [
      "# Como um projeto da Sanle funciona",
      ...method.map((m) => `## ${m.step}. ${m.title}\n${m.body}`),
      "",
      "Modelo de contratação: começa com projetos delimitados e evolui para contratos de manutenção e melhoria contínua (recorrência mensal). Escopo e valores são definidos em proposta, após o diagnóstico — não há tabela pública de preços."
    ].join("\n\n")
  });

  for (const s of solutions) {
    docs.push({
      title: `Solução ${s.code} — ${s.title}`,
      category: "solucoes",
      content: [
        `# ${s.title}`,
        s.short,
        `## Para quem é indicada\n${s.audience}`,
        `## Problema que resolve\n${s.problem}`,
        `## Como funciona\n${s.how.map((h) => `- ${h}`).join("\n")}`,
        `## O que pode ser entregue\n${s.deliverables.map((d) => `- ${d}`).join("\n")}`,
        `## Perguntas frequentes\n${s.faq.map((f) => `**${f.q}** ${f.a}`).join("\n")}`
      ].join("\n\n")
    });
  }

  docs.push({
    title: "Perguntas frequentes",
    category: "faq",
    content: faqs.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")
  });

  docs.push({
    title: "Limitações e políticas de atendimento",
    category: "politicas",
    content: [
      "# Limitações técnicas e comerciais",
      "- A Sanle não trabalha com scraping de diretórios, redes sociais ou contorno de bloqueios.",
      "- Integrações externas (Google Maps, LinkedIn, WhatsApp, e-mail) só operam com APIs oficiais e credenciais válidas.",
      "- A IA não registra vendas, não envia propostas definitivas, não altera preços e não assume compromissos sem autorização humana.",
      "- Preços, prazos e garantias NÃO são informados pelo assistente: devem ser tratados em conversa com a equipe.",
      "- Quando não há informação suficiente, o assistente informa a limitação e encaminha para o formulário de diagnóstico.",
      "",
      "# Privacidade (LGPD)",
      "Coleta mínima de dados, finalidade documentada, controle de acesso e política de retenção. Conversas só são persistidas com consentimento; conversas anônimas não são associadas a pessoas sem base legítima."
    ].join("\n")
  });

  docs.push({
    title: "Segmentos atendidos",
    category: "qualificacao",
    content: [
      "# Cliente ideal (foco inicial: Brasília/DF)",
      segments.map((s) => `- ${s}`).join("\n"),
      "",
      "# Regras de qualificação",
      "Priorizar empresas com operações repetitivas, processos manuais e uma dor identificável. Não classificar como necessitada de automação apenas por não ter site. Diferenciar FATO (encontrado) de HIPÓTESE (inferida)."
    ].join("\n\n")
  });

  docs.push({
    title: "Modelos de abordagem aprovados",
    category: "comercial",
    content: [
      "# Diretrizes de abordagem",
      "- Tom profissional, direto e natural, em português do Brasil.",
      "- Nunca inventar relação anterior, resultados obtidos ou problemas não identificados.",
      "- Mencionar apenas informações verificadas da empresa-alvo.",
      "- A IA prepara o conteúdo; a pessoa decide quando e onde enviar.",
      "",
      "Estrutura sugerida de primeiro contato: (1) contexto curto e específico; (2) hipótese de problema em forma de pergunta; (3) convite a uma conversa rápida; (4) encerramento respeitoso, sem pressão."
    ].join("\n")
  });

  // =========================================================================
  // DOCUMENTOS ESTRATÉGICOS DE INTELIGÊNCIA COMERCIAL E FECHAMENTO B2B
  // =========================================================================

  docs.push({
    title: "Playbook de Qualificação e Fechamento B2B de Alto Ticket",
    category: "vendas_estrategicas",
    content: [
      "# Playbook de Qualificação e Fechamento B2B de Alto Ticket",
      "Como selecionar as melhores empresas para fechar contrato com a Sanle:",
      "",
      "## 1. Perfil Ideal de Cliente (High-Ticket ICP)",
      "- Faturamento Mensal Estimado: R$ 50.000 a R$ 500.000+",
      "- Equipe: 5 a 50 colaboradores ativos",
      "- Canal Comercial Ativo: Alto volume diário de conversas e cotações pelo WhatsApp",
      "- Gargalo Evidente: Perda de vendas por demora na resposta, falta de catálogo digital estruturado, orçamentos calculados na mão ou planilhas paralelas que travam o crescimento",
      "",
      "## 2. Os 4 Nichos de Maior Probabilidade de Fechamento Imediato",
      "1. Vidraçarias e Esquadrias de Alumínio: Fecham rapidamente quando veem a calculadora interativa de m² no WhatsApp e o catálogo digital de fotos de obras, porque hoje perdem de 20% a 30% das cotações na demora de envio.",
      "2. Clínicas Odontológicas e Médicas: Fecham para resolver o no-show (faltas de 18% a 25%) através de confirmação automática no WhatsApp e secretária de IA para triagem 24/7.",
      "3. Escritórios de Contabilidade e BPO: Fecham para eliminar a cobrança desgastante de extratos OFX e notas no fim do mês, liberando analistas de até 40h/mês de digitação.",
      "4. Distribuidoras e Atacado B2B: Fecham para substituir pedidos informais em áudio e PDF por um portal B2B onde os clientes compram sozinhos.",
      "",
      "## 3. Roteiro de Fechamento em 3 Passos",
      "Passo 1 — Enviar a página de demonstração sob medida (/p/[slug]): 'Preparamos um protótipo funcional para a [Nome da Empresa] demonstrando o catálogo e fluxo de orçamento.'",
      "Passo 2 — Conectar no WhatsApp direto: Mostrar o protótipo funcionando no celular do decisor.",
      "Passo 3 — Apresentar o cronograma de 7 a 14 dias: 'Não paralisamos sua operação. Em 10 dias está publicado no domínio oficial da sua empresa.'"
    ].join("\n")
  });

  docs.push({
    title: "Diferenciação Radical contra IA Genérica e Templates Baratos",
    category: "diferenciacao",
    content: [
      "# Por que Empresas Compram da Sanle e Recusam Templates Prontos",
      "",
      "## 1. O Problema das Soluções Baratas (Wix, WordPress genérico e IA Slop)",
      "- Sites lentos e pesados com dezenas de plugins inseguros que quebram a cada atualização.",
      "- Visual genérico que parece template de IA: o cliente entra e não sente confiança de que a empresa é sólida.",
      "- Nenhuma integração real: formulários que mandam e-mail para caixa de spam em vez de entrar no WhatsApp e no ERP da empresa.",
      "- Ausência de regras de negócio: não calculam m², não validam CPF/CNPJ, não fazem triagem médica nem conciliam extratos.",
      "",
      "## 2. A Vantagem Competitiva da Engenharia Sanle",
      "- Arquitetura de Software Real: Construído em Next.js com React 19, TypeScript estrito e PostgreSQL com RLS.",
      "- Direção de Arte Autoral: Tipografia com personalidade, paleta exclusiva por setor, sem visual repetitivo de IA.",
      "- Conexão Direta com a Operação: O site não é apenas um folheto digital, é uma ferramenta de trabalho que capta leads, calcula orçamentos e sincroniza com o WhatsApp.",
      "- Segurança e Governança LGPD: Sem vazamento de dados, com logs auditáveis e supervisão humana."
    ].join("\n")
  });

  docs.push({
    title: "Matriz de Resolução de Objeções Comerciais B2B",
    category: "objecoes",
    content: [
      "# Matriz de Resolução de Objeções Comerciais",
      "",
      "## Objeção 1: 'Quanto custa esse serviço?'",
      "Resposta recomendada: 'Cada projeto é dimensionado para o retorno do seu negócio. Por exemplo, em [Nicho], o investimento se paga nos primeiros 30 a 60 dias apenas evitando orçamentos perdidos no WhatsApp. Posso te mostrar a demonstração prática de 5 minutos sobre como calculamos isso?'",
      "",
      "## Objeção 2: 'Já temos um sistema interno / ERP.'",
      "Resposta recomendada: 'Excelente! Nosso trabalho não é substituir o sistema que vocês já usam, e sim criar a camada de captação digital e integrações que o ERP não faz — como o catálogo interativo, agendamento no WhatsApp ou entrada rápida de pedidos sem redigitação.'",
      "",
      "## Objeção 3: 'Estamos sem tempo agora, me procure no próximo mês.'",
      "Resposta recomendada: 'Compreendo perfeitamente a correria. Justamente por isso nosso método exige quase zero do seu tempo: nós desenhamos a arquitetura, implementamos e entregamos pronta em até 14 dias. Deixo o link da demonstração da sua empresa aqui para você ver quando tiver 2 minutinhos.'",
      "",
      "## Objeção 4: 'Nossos clientes preferem ligar ou falar no WhatsApp tradicional.'",
      "Resposta recomendada: 'Eles continuarão falando no WhatsApp! A diferença é que a mensagem já chegará com o pedido, as medidas ou o serviço especificado, poupando 15 minutos de perguntas e respostas repetitivas em cada conversa.'"
    ].join("\n")
  });

  return docs;
}

/** Cria/atualiza a base institucional e (re)indexa os chunks. Idempotente por título. */
export async function seedKnowledge(force = false): Promise<{ created: number; indexed: number }> {
  const existing = await listKnowledgeDocs();
  const byTitle = new Map(existing.map((d) => [d.title, d]));
  let created = 0;
  let indexed = 0;

  for (const doc of baseKnowledge()) {
    let docId: string;
    if (byTitle.has(doc.title)) {
      if (!force) continue;
      docId = byTitle.get(doc.title)!.id;
    } else {
      const createdDoc = await createKnowledgeDoc(doc);
      docId = createdDoc.id;
      created++;
    }

    const chunks = await indexDocument({ id: docId, content: doc.content });
    indexed += chunks;
  }

  return { created, indexed };
}

/** Reprocessa todos os documentos existentes (útil após trocar o modelo de embedding). */
export async function reindexAll(): Promise<{ documents: number; chunks: number }> {
  const { documents, chunks } = await reprocessAll();
  return { documents, chunks };
}
