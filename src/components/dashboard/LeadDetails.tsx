"use client";

import { Globe, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Lead } from "@/lib/types";

interface LeadDetailsDiagnosticProps {
  lead: Lead;
}

/**
 * SALES HUNTER — LeadDetails Diagnostic Banner (Seção 13 & 15)
 * Apresenta o resumo executivo da oportunidade identificada no topo do lead:
 * EMPRESA -> OPORTUNIDADE IDENTIFICADA -> SERVIÇO RECOMENDADO -> PRÓXIMA AÇÃO.
 * Respeita rigorosamente a regra de autenticidade: quando `lead.website` está vazio,
 * informa "Website não identificado nos dados consultados" (nunca afirma categoricamente que não existe).
 */
export function LeadDetails({ lead }: LeadDetailsDiagnosticProps) {
  const hasWebsite = Boolean(lead.website && lead.website.trim().length > 0);
  const opportunityLabel = lead.hypothesis
    ? lead.hypothesis
    : !hasWebsite
      ? "Presença digital própria e canal estruturado de orçamentos"
      : "Otimização de captação comercial e automação de atendimento";

  const recommendedService = !hasWebsite
    ? "Criação de página de demonstração (/p/[slug]) + atendimento rápido via WhatsApp"
    : "Integração de funil comercial, qualificação rápida e automação de propostas";

  return (
    <section className="rounded-hunter-lg border border-[#B7F36B]/30 bg-[#191C22] p-5 shadow-hunter-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F6F8]/8 pb-3.5">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B7F36B]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>DIAGNÓSTICO DE OPORTUNIDADE COMERCIAL</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
          EMPRESA → OPORTUNIDADE → SERVIÇO → AÇÃO
        </span>
      </div>

      <div className="mt-4 grid gap-3.5 md:grid-cols-4">
        <div className="rounded-xl border border-[#F5F6F8]/8 bg-[#111318] p-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#78A9FF]">
            <Globe className="h-3.5 w-3.5" />
            <span>Presença digital</span>
          </div>
          <p className="mt-1.5 text-xs font-medium text-[#F5F6F8]">
            {hasWebsite
              ? lead.website
              : "Website não identificado nos dados consultados."}
          </p>
        </div>

        <div className="rounded-xl border border-[#F5F6F8]/8 bg-[#111318] p-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#B7F36B]">
            Oportunidade identificada
          </span>
          <p className="mt-1.5 text-xs font-medium text-[#F5F6F8]">{opportunityLabel}</p>
        </div>

        <div className="rounded-xl border border-[#F5F6F8]/8 bg-[#111318] p-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#78A9FF]">
            Serviço recomendado
          </span>
          <p className="mt-1.5 text-xs text-[#969DA8]">{recommendedService}</p>
        </div>

        <div className="rounded-xl border border-[#B7F36B]/30 bg-[#B7F36B]/10 p-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#B7F36B]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Próxima ação</span>
          </div>
          <p className="mt-1.5 text-xs font-semibold text-[#F5F6F8]">
            {lead.nextAction || "Gerar abordagem personalizada e abrir conversa no WhatsApp"}
          </p>
          {lead.nextAction && (
            <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-[#B7F36B]">
              <span>Ação definida</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
