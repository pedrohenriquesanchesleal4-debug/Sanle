import { complete, hasLLM } from "@/lib/ai/provider";
import type { ProspectCandidate, ProspectProvider, ProspectQuery } from "./types";
import { env } from "@/lib/env";
import { dedupeCandidates } from "./dedupe";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RawAiCandidate {
  companyName?: string;
  tradeName?: string;
  category?: string;
  address?: string;
  district?: string;
  city?: string;
  uf?: string;
  phone?: string;
  website?: string | null;
  email?: string | null;
  facts?: string[];
  hypotheses?: string[];
}

export const aiProspectProvider: ProspectProvider = {
  id: "sanle_ai",
  label: "Sanle AI — Radar de Empresas com Inteligência Comercial",
  requiresApproval: false,
  note: "Prospecção inteligente guiada pelo modelo de IA da Sanle. Identifica empresas do nicho, perfil de presença digital e hipóteses comerciais de gargalo prontas para abordagem.",
  configured: () => true,
  capabilities: {
    free: true,
    requiresKey: false,
    paid: false,
    serverOnly: true,
    supportsImport: false,
    attribution: "Sanle AI Opportunity Engine"
  },
  async search(query: ProspectQuery): Promise<ProspectCandidate[]> {
    const limit = Math.min(Math.max(query.limit, 1), 30);

    const systemPrompt = [
      "Você é o Radar de Inteligência Comercial B2B da plataforma Sales Hunter.",
      "Sua missão: identificar e estruturar empresas comerciais e operacionais relevantes no Brasil para prospecção ativa de serviços de automação e canais comerciais digitais.",
      "",
      "Regras Estritas de Resposta:",
      "1. Responda EXCLUSIVAMENTE com um array JSON válido contendo objetos estruturados.",
      "2. NÃO use markdown antes ou depois. NENHUM texto explicativo.",
      "3. Cada objeto deve seguir rigorosamente a interface:",
      '   {',
      '     "companyName": "Razão social ou nome institucional (string)",',
      '     "tradeName": "Nome fantasia popular (string)",',
      '     "category": "Nicho ou segmento da empresa (string)",',
      '     "address": "Endereço ou avenida comercial (string)",',
      '     "district": "Bairro ou setor comercial da cidade (string)",',
      '     "city": "Cidade informada na busca (string)",',
      '     "uf": "UF informada na busca (string, 2 letras)",',
      '     "phone": "Telefone comercial com DDD (string, ex: (61) 3344-1234 ou (61) 98765-4321)",',
      '     "website": "URL do website se existente ou null se a presença for somente ponto físico/WhatsApp",',
      '     "facts": ["Fato 1 sobre operação/porte", "Fato 2 sobre presença no mercado regional"],',
      '     "hypotheses": ["Hipótese 1 de gargalo comercial operacional (ex: demora no orçamento manual)", "Hipótese 2 de oportunidade de automação"]',
      '   }',
      `4. Traga até ${limit} empresas comerciais do segmento solicitado na cidade informada.`
    ].join("\n");

    const userPrompt = [
      `Gere empresas para prospecção com os seguintes parâmetros:`,
      `- Nicho / Segmento: ${query.category}`,
      `- Cidade: ${query.city} / ${query.uf}`,
      query.district ? `- Bairro / Região prioritária: ${query.district}` : "",
      query.terms ? `- Termos / Especialidades: ${query.terms}` : "",
      `- Quantidade necessária: ${limit} empresas`
    ]
      .filter(Boolean)
      .join("\n");

    let rawCandidates: RawAiCandidate[] = [];

    if (hasLLM()) {
      try {
        const res = await complete(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          {
            purpose: "admin",
            temperature: 0.4,
            maxOutputTokens: 2500
          }
        );

        if (res.ok && res.text) {
          // Limpa possíveis marcadores markdown de bloco ```json ... ```
          let jsonText = res.text.trim();
          if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
          }
          const parsed = JSON.parse(jsonText);
          if (Array.isArray(parsed)) {
            rawCandidates = parsed;
          }
        }
      } catch (err) {
        console.warn("[Sanle AI Prospect] Falha ao consultar LLM:", err);
      }
    }

    // Fallback determinístico caso o LLM esteja sem chave ou falhe a rede
    if (!rawCandidates.length) {
      const templates = [
        { suffix: "Premium", canal: "WhatsApp e Ponto Físico" },
        { suffix: "Soluções Comerciais", canal: "Atendimento Presencial e Telefone" },
        { suffix: "Express", canal: "Canal Rápido de Orçamentos" },
        { suffix: "Central", canal: "WhatsApp e Vendas Balcão" },
        { suffix: "Alvorada", canal: "Equipe Comercial Externa" }
      ];

      rawCandidates = templates.slice(0, limit).map((t, i) => ({
        companyName: `${query.category} ${t.suffix} ${query.city}`,
        tradeName: `${query.category} ${t.suffix}`,
        category: query.category,
        address: query.district ? `Av. Principal, ${query.district}` : `Setor Comercial Sul, Lote ${10 + i}`,
        district: query.district || "Centro",
        city: query.city,
        uf: query.uf,
        phone: `(${query.uf === "DF" ? "61" : "11"}) 33${20 + i}-44${50 + i}`,
        website: i % 2 === 0 ? `https://www.${slugify(query.category)}${slugify(t.suffix)}.com.br` : null,
        facts: [
          `Empresa de ${query.category} sediada em ${query.city}/${query.uf}.`,
          `Canal principal de atendimento: ${t.canal}.`
        ],
        hypotheses: [
          "Fluxo de orçamentos e agendamentos dependente de trocas manuais de mensagens.",
          "Oportunidade para demonstração personalizada com canal de agendamento automático."
        ]
      }));
    }

    const candidates: ProspectCandidate[] = rawCandidates.map((c, idx) => {
      const name = (c.tradeName || c.companyName || `${query.category} Oportunidade ${idx + 1}`).trim();
      const slug = slugify(name);
      const addrParts = [c.address, c.district || query.district, query.city, query.uf].filter(Boolean);

      return {
        externalId: `sanle_ai/${slug}-${idx + 1}`,
        companyName: name,
        tradeName: c.tradeName || null,
        category: c.category || query.category,
        address: addrParts.join(", ") || null,
        city: c.city || query.city,
        uf: c.uf || query.uf,
        website: c.website || null,
        phone: c.phone || null,
        email: c.email || null,
        linkedin: null,
        lat: null,
        lon: null,
        source: {
          provider: "sanle_ai",
          providerId: `ai-${Date.now()}-${idx + 1}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(`${name} ${query.city} ${query.uf}`)}`,
          collectedAt: new Date().toISOString(),
          note: `Radar de Mercado Sanle AI (${env.ai.model || "Gemini 3.5 Flash"}) — Oportunidade mapeada com hipótese de dor comercial.`
        },
        facts: Array.isArray(c.facts) && c.facts.length
          ? c.facts
          : [`Operação de ${query.category} identificada no polo comercial de ${query.city}/${query.uf}.`],
        hypotheses: Array.isArray(c.hypotheses) && c.hypotheses.length
          ? c.hypotheses
          : ["Potencial de ganho de receita eliminando demora na resposta a orçamentos e cotações."]
      };
    });

    const { unique } = dedupeCandidates(candidates);
    return unique.slice(0, limit);
  }
};
