import type { Lead, ScoreFactor } from "@/lib/types";
import { segments } from "@/content/brand";

/**
 * Pontuação comercial transparente. Cada critério tem peso, valor (0..1),
 * pontos e uma JUSTIFICATIVA legível. Nunca classifica como "necessitada"
 * apenas por não ter site — presença digital é só um sinal de canal.
 */

export type ScoringWeights = Record<string, number>;

export const DEFAULT_WEIGHTS: ScoringWeights = {
  segmento: 1.4,
  processo_manual: 1.3,
  canal_comercial: 1.1,
  geografia: 1.0,
  problema_claro: 1.2,
  contato_acessivel: 0.9,
  evidencias: 1.0
};

function has(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function scoreLead(lead: Lead, weights: ScoringWeights = DEFAULT_WEIGHTS): {
  score: number;
  breakdown: ScoreFactor[];
} {
  const w = { ...DEFAULT_WEIGHTS, ...weights };
  const factors: ScoreFactor[] = [];

  const push = (key: string, label: string, value: number, rationale: string) => {
    const weight = w[key] ?? 1;
    factors.push({ key, label, weight, value, points: Math.round(weight * value * 100), rationale });
  };

  // 1. Compatibilidade com o nicho
  const segMatch = lead.segment && (segments as readonly string[]).includes(lead.segment);
  push(
    "segmento",
    "Compatibilidade com o nicho",
    segMatch ? 1 : has(lead.segment) ? 0.6 : (lead.category ? 0.35 : 0),
    segMatch
      ? `Segmento "${lead.segment}" está entre os nichos prioritários.`
      : has(lead.segment)
        ? `Segmento "${lead.segment}" fora da lista prioritária inicial.`
        : "Segmento não informado."
  );

  // 2. Evidência de processo manual (hipótese/dor declarada/volume)
  const manualSignals =
    (has(lead.problemDescription) ? 1 : 0) +
    (has(lead.bottleneckStep) ? 1 : 0) +
    (has(lead.volumeApprox) ? 1 : 0) +
    (has(lead.hypothesis) ? 1 : 0);
  const manualValue = Math.min(1, manualSignals / 3);
  push(
    "processo_manual",
    "Evidência de processo manual",
    manualValue,
    manualSignals === 0
      ? "Nenhuma evidência de processo manual registrada — hipótese não confirmada."
      : `${manualSignals} sinal(is) de processo manual: dor declarada, etapa gargalo, volume ou hipótese.`
  );

  // 3. Canal comercial disponível
  const channels = [lead.website, lead.phone, lead.email, lead.linkedin].filter(has).length;
  push(
    "canal_comercial",
    "Existência de canal comercial",
    channels === 0 ? 0 : channels === 1 ? 0.5 : 0.85,
    channels === 0
      ? "Nenhum canal comercial identificado — contato inviável no momento."
      : `${channels} canal(is) de contato encontrados (site, telefone, e-mail, LinkedIn).`
  );

  // 4. Compatibilidade geográfica
  const inFocus = (lead.uf ?? "").toUpperCase() === "DF" || /bras[íi]lia/i.test(lead.city ?? "");
  push(
    "geografia",
    "Compatibilidade geográfica",
    inFocus ? 1 : has(lead.city) ? 0.5 : 0,
    inFocus
      ? "Em Brasília/DF — foco inicial da operação."
      : has(lead.city)
        ? `${lead.city ?? ""}${lead.uf ? `/${lead.uf}` : ""} fora do foco inicial (atendimento remoto possível).`
        : "Localização não informada."
  );

  // 5. Clareza do problema
  const desc = (lead.problemDescription ?? "").trim();
  const clarity = desc.length === 0 ? 0 : desc.length < 60 ? 0.4 : desc.length < 160 ? 0.75 : 1;
  push(
    "problema_claro",
    "Clareza do problema",
    clarity,
    desc.length === 0
      ? "Problema ainda não descrito."
      : `Descrição com ${desc.length} caracteres — ${clarity >= 0.75 ? "suficiente para qualificar" : "ainda genérica"}.`
  );

  // 6. Facilidade de contato (canal direto vs. só site)
  const direct = (has(lead.email) ? 1 : 0) + (has(lead.phone) ? 1 : 0);
  push(
    "contato_acessivel",
    "Facilidade de estabelecer contato",
    direct === 0 ? (has(lead.website) ? 0.3 : 0) : direct === 1 ? 0.7 : 1,
    direct === 0
      ? "Sem e-mail/telefone direto — contato dependeria de formulário no site."
      : `${direct} canal(is) direto(s) de contato disponível(is).`
  );

  // 7. Evidências públicas verificáveis
  const evid = (lead.source.providerId ? 1 : 0) + (has(lead.address) ? 1 : 0) + (lead.verification === "verificado" ? 1 : 0);
  push(
    "evidencias",
    "Evidências públicas verificáveis",
    Math.min(1, evid / 2),
    evid === 0
      ? "Sem procedência/endereço verificável registrado."
      : `${evid} evidência(s): procedência da fonte, endereço ou verificação.`
  );

  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  const score = totalWeight > 0 ? Math.round((factors.reduce((s, f) => s + f.points, 0) / (totalWeight * 100)) * 100) : 0;

  return { score, breakdown: factors };
}
