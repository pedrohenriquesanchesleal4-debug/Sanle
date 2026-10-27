import { brand, solutions, method, faqs, segments } from "@/content/brand";
import { createKnowledgeDoc, listKnowledgeDocs } from "@/lib/db/repo";
import { indexDocument, reprocessAll } from "./ingest";

/** Reexportado para compatibilidade: `knowledge/route.ts` importa daqui. */
export { indexDocument } from "./ingest";

/**
 * Documentos institucionais iniciais da base de conhecimento.
 * Derivados de `brand.ts` para manter uma única fonte da verdade.
 * Nada aqui inventa clientes, preços ou prazos.
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
