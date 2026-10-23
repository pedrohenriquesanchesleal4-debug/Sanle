"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Check,
  Copy,
  Building2
} from "lucide-react";

interface ShowcaseLead {
  id: string;
  name: string;
  niche: string;
  city: string;
  district: string;
  rating: string;
  websiteStatus: string;
  opportunity: string;
  recommendedService: string;
  score: number;
  stage: "Novo lead" | "Primeiro contato" | "Respondeu" | "Reunião" | "Proposta";
  factors: { label: string; points: string }[];
  suggestedMessage: string;
  demoSlug: string;
}

const SHOWCASE_LEADS: ShowcaseLead[] = [
  {
    id: "demo-vidracaria",
    name: "Vidraçaria Exemplo",
    niche: "Vidraçarias",
    city: "Brasília, DF",
    district: "SIA Trecho 3",
    rating: "4,8 ★ (183 avaliações)",
    websiteStatus: "Website não identificado nos dados consultados",
    opportunity: "Presença digital própria e captação de orçamentos",
    recommendedService: "Landing page de orçamentos + atendimento rápido no WhatsApp",
    score: 92,
    stage: "Respondeu",
    factors: [
      { label: "Reputação local ativa sem site identificado", points: "+40 pts" },
      { label: "Nicho de alto ticket por orçamento", points: "+30 pts" },
      { label: "Telefone comercial disponível", points: "+22 pts" }
    ],
    suggestedMessage:
      "Olá, tudo bem? Conheci a empresa de vocês pelo Google e tive uma ideia para melhorar a forma como clientes encontram seus serviços online.",
    demoSlug: "vidracaria-exemplo"
  },
  {
    id: "demo-oficina",
    name: "Oficina Técnica Planalto (Demo)",
    niche: "Oficinas",
    city: "Brasília, DF",
    district: "Asa Norte",
    rating: "4,7 ★ (142 avaliações)",
    websiteStatus: "Website não identificado nos dados consultados",
    opportunity: "Agendamento digital de revisões e orçamentos",
    recommendedService: "Página técnica com agendamento direto via WhatsApp",
    score: 88,
    stage: "Primeiro contato",
    factors: [
      { label: "Volume recorrente de buscas locais", points: "+36 pts" },
      { label: "Ausência de página de agendamento nos dados", points: "+32 pts" },
      { label: "Localização comercial densa", points: "+20 pts" }
    ],
    suggestedMessage:
      "Olá, tudo bem? Vi as avaliações da oficina em Brasília e montei uma demonstração de como organizar agendamentos e orçamentos pelo WhatsApp.",
    demoSlug: "oficina-tecnica-planalto"
  },
  {
    id: "demo-clinica",
    name: "Clínica Integrada Eixo Monumental (Demo)",
    niche: "Clínicas",
    city: "Brasília, DF",
    district: "Asa Sul",
    rating: "4,9 ★ (210 avaliações)",
    websiteStatus: "Canal de triagem online não identificado",
    opportunity: "Triagem inteligente e confirmação de consultas",
    recommendedService: "Página institucional + automação de pré-atendimento",
    score: 86,
    stage: "Reunião",
    factors: [
      { label: "Alta demanda de atendimento diário", points: "+35 pts" },
      { label: "Potencial de redução de faltas", points: "+31 pts" },
      { label: "Dados cadastrais completos", points: "+20 pts" }
    ],
    suggestedMessage:
      "Olá! Conheci a clínica de vocês e preparei uma ideia prática para agilizar a confirmação de horários e dúvidas frequentes de pacientes no WhatsApp.",
    demoSlug: "clinica-integrada-eixo"
  }
];

const NICHES = ["Todos", "Vidraçarias", "Oficinas", "Clínicas"] as const;

/**
 * SALES HUNTER — ProductShowcase (Seção 12 — Seção de Produto Real)
 * Demonstração interativa que permite testar o buscador, inspecionar os resultados,
 * ver o diagnóstico completo, copiar/abrir a abordagem no WhatsApp e atualizar a etapa no pipeline.
 * Identificado explicitamente como demonstração sintética (zero chamadas reais ao Google Places).
 */
export function ProductShowcase() {
  const [selectedNiche, setSelectedNiche] = useState<(typeof NICHES)[number]>("Todos");
  const [leads, setLeads] = useState<ShowcaseLead[]>(SHOWCASE_LEADS);
  const [activeLeadId, setActiveLeadId] = useState<string>(SHOWCASE_LEADS[0]!.id);
  const [copied, setCopied] = useState(false);

  const filteredLeads =
    selectedNiche === "Todos"
      ? leads
      : leads.filter((l) => l.niche === selectedNiche);

  const activeLead =
    leads.find((l) => l.id === activeLeadId) ?? filteredLeads[0] ?? leads[0]!;

  const updateStage = (id: string, nextStage: ShowcaseLead["stage"]) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage: nextStage } : item))
    );
  };

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(activeLead.suggestedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="produto-real"
      className="relative border-t border-[#F5F6F8]/8 bg-[#111318] py-24 md:py-32"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#191C22] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#B7F36B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SIMULADOR INTERATIVO DO PRODUTO</span>
            </span>
            <h2 className="mt-4 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
              Experimente o fluxo do Sales Hunter agora.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#969DA8]">
              Selecione um nicho, inspecione o diagnóstico da oportunidade, teste a abordagem personalizada e mova o lead no funil.
            </p>
          </div>

          <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#08090C] px-4 py-3 font-mono text-[11px] text-[#969DA8]">
            <span className="text-[#78A9FF]">AVISO DE AUTENTICIDADE:</span> Dados sintéticos de demonstração. Na área autenticada, o buscador opera sobre o backend real (OpenStreetMap / CSV / Supabase).
          </div>
        </div>

        {/* Workspace interativo de 12 colunas */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Coluna Esquerda (5 cols): Buscador + Lista de Oportunidades */}
          <div className="space-y-4 rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#08090C] p-5 lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F6F8]/8 pb-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#F5F6F8]">
                <Search className="h-4 w-4 text-[#78A9FF]" />
                <span>Buscador Demonstrativo</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#969DA8]">
                <MapPin className="h-3.5 w-3.5 text-[#78A9FF]" />
                <span>Brasília, DF</span>
              </div>
            </div>

            {/* Filtro por Nicho */}
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => {
                const active = selectedNiche === niche;
                return (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => {
                      setSelectedNiche(niche);
                      const first =
                        niche === "Todos"
                          ? leads[0]
                          : leads.find((l) => l.niche === niche);
                      if (first) setActiveLeadId(first.id);
                    }}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "bg-[#B7F36B] font-semibold text-[#08090C]"
                        : "border border-[#F5F6F8]/12 bg-[#191C22] text-[#969DA8] hover:text-[#F5F6F8]"
                    }`}
                  >
                    {niche}
                  </button>
                );
              })}
            </div>

            {/* Lista de Resultados */}
            <div className="space-y-2.5 pt-2">
              {filteredLeads.map((lead) => {
                const isSelected = lead.id === activeLead.id;
                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setActiveLeadId(lead.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-[#B7F36B]/60 bg-[#191C22] shadow-[0_0_25px_rgba(183,243,107,0.12)]"
                        : "border-[#F5F6F8]/8 bg-[#111318] hover:border-[#78A9FF]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-semibold text-[#F5F6F8]">
                          {lead.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#969DA8]">
                          {lead.district} · {lead.rating}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#B7F36B]/40 bg-[#B7F36B]/12 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#B7F36B]">
                        Score {lead.score}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F5F6F8]/8 pt-2.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                      <span className="text-[#78A9FF]">{lead.niche}</span>
                      <span className="text-[#B7F36B]">Etapa: {lead.stage}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita (7 cols): Diagnóstico + Abordagem + Etapa no CRM */}
          <div className="rounded-hunter-lg border border-[#F5F6F8]/12 bg-[#191C22] p-6 shadow-hunter-card md:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F5F6F8]/10 pb-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF]">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>DIAGNÓSTICO DE OPORTUNIDADE · DEMO</span>
                </div>
                <h3 className="mt-1.5 font-display text-2xl font-semibold text-[#F5F6F8] md:text-3xl">
                  {activeLead.name}
                </h3>
                <p className="mt-1 text-xs text-[#969DA8]">
                  {activeLead.district} · {activeLead.city} · {activeLead.rating}
                </p>
              </div>

              {/* Seletor de Etapa do Pipeline */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  Etapa no Pipeline (Demo)
                </label>
                <select
                  aria-label="Atualizar etapa do lead na demonstração"
                  value={activeLead.stage}
                  onChange={(e) =>
                    updateStage(activeLead.id, e.target.value as ShowcaseLead["stage"])
                  }
                  className="field mt-1 !py-1.5 !px-3 text-xs"
                >
                  <option value="Novo lead">Novo lead</option>
                  <option value="Primeiro contato">Primeiro contato</option>
                  <option value="Respondeu">Respondeu</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Proposta">Proposta</option>
                </select>
              </div>
            </div>

            {/* Sinais e Serviço Recomendado */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  Presença digital consultada
                </span>
                <p className="mt-1.5 text-sm font-medium text-[#F5F6F8]">
                  {activeLead.websiteStatus}
                </p>
              </div>

              <div className="rounded-xl border border-[#B7F36B]/35 bg-[#B7F36B]/10 p-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7F36B]">
                  Serviço recomendado
                </span>
                <p className="mt-1.5 text-sm font-semibold text-[#F5F6F8]">
                  {activeLead.recommendedService}
                </p>
              </div>
            </div>

            {/* Composição explicável do Score */}
            <div className="mt-5 rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                <span>Justificativa do Score ({activeLead.score}/100)</span>
                <span className="text-[#B7F36B]">Prioridade Alta</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {activeLead.factors.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-lg border border-[#F5F6F8]/8 bg-[#191C22] p-2.5"
                  >
                    <span className="font-mono text-xs font-semibold text-[#B7F36B]">
                      {f.points}
                    </span>
                    <p className="mt-1 text-[11px] leading-snug text-[#969DA8]">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensagem Recomendada + Ações */}
            <div className="mt-5 rounded-xl border border-[#78A9FF]/30 bg-[#111318] p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF]">
                Abordagem personalizada sugerida
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[#F5F6F8]">
                “{activeLead.suggestedMessage}”
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleCopyMessage()}
                  className="btn btn-ghost !py-2 !px-3.5 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#B7F36B]" />
                      <span className="text-[#B7F36B]">Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#78A9FF]" />
                      <span>Copiar mensagem</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeLead.suggestedMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary !py-2 !px-4 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Abrir WhatsApp</span>
                </a>

                <Link
                  href={`/p/${activeLead.demoSlug}`}
                  className="btn btn-ghost !py-2 !px-3.5 text-xs"
                >
                  <span>Abrir página demo (/p/{activeLead.demoSlug})</span>
                </Link>

                <Link
                  href="/admin/prospects"
                  className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-[#B7F36B] hover:underline"
                >
                  <span>Abrir buscador completo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
