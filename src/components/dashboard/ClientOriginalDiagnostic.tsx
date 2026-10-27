"use client";

import { useState } from "react";
import {
  MessageSquareText,
  Copy,
  Check,
  Calendar,
  Layers,
  Cpu,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import type { Lead } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface ClientOriginalDiagnosticProps {
  lead: Lead;
}

export function ClientOriginalDiagnostic({ lead }: ClientOriginalDiagnosticProps) {
  const [copied, setCopied] = useState(false);

  const rawDescription = lead.problemDescription?.trim();
  const hasInboundMessage = Boolean(rawDescription && rawDescription.length > 0);

  const phone = (lead.contactPhone || lead.phone || "").replace(/\D/g, "");
  const cleanPhone = phone.startsWith("55") ? phone : phone ? `55${phone}` : "";

  async function handleCopy() {
    if (!rawDescription) return;
    await navigator.clipboard.writeText(rawDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenWhatsApp() {
    if (!cleanPhone) return;
    const name = lead.contactName ? ` ${lead.contactName.split(" ")[0]}` : "";
    const greeting = `Olá${name}! Sou da equipe da Sanle. Analisei o diagnóstico que você enviou sobre a operação da ${lead.tradeName || lead.companyName}:`;
    const snippet = rawDescription
      ? `\n\n"${rawDescription.length > 120 ? rawDescription.slice(0, 120) + "..." : rawDescription}"`
      : "";
    const cta = "\n\nSeparei algumas oportunidades práticas para agilizar esse processo. Gostaria de ver uma demonstração rápida?";
    const msg = `${greeting}${snippet}${cta}`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#78A9FF]/25 bg-gradient-to-b from-[#111318]/95 to-[#08090C]/95 p-6 shadow-2xl backdrop-blur-xl">
      {/* Luz ambiente de destaque no topo */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#78A9FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#B7F36B]/10 blur-3xl" />

      {/* Header do Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F6F8]/8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#78A9FF]/30 bg-[#78A9FF]/15 text-[#78A9FF]">
            <MessageSquareText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#78A9FF]">
                Diagnóstico Original Enviado pelo Cliente
              </span>
              {hasInboundMessage ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#B7F36B]/30 bg-[#B7F36B]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#B7F36B]">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Submissão Direta
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#F5F6F8]/10 bg-[#F5F6F8]/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#969DA8]">
                  Prospecção Ativa
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#969DA8]">
              {hasInboundMessage
                ? "Texto exato enviado pelo cliente no formulário do site ou calculadora de gargalo."
                : "Lead identificado via busca territorial ou prospecção ativa sem formulário inbound preenchido."}
            </p>
          </div>
        </div>

        {/* Metadados de Envio */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#969DA8]">
          {lead.protocol && (
            <span className="rounded-md border border-[#F5F6F8]/10 bg-[#111318] px-2.5 py-1 text-[#F5F6F8]">
              Protocolo: <strong className="text-[#B7F36B]">{lead.protocol}</strong>
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md border border-[#F5F6F8]/10 bg-[#111318] px-2.5 py-1">
            <Calendar className="h-3 w-3 text-[#78A9FF]" />
            {formatDateTime(lead.createdAt)}
          </span>
        </div>
      </div>

      {/* Conteúdo do Relato */}
      <div className="mt-4">
        {hasInboundMessage ? (
          <div className="space-y-4">
            <div className="relative rounded-xl border border-[#78A9FF]/20 bg-[#191C22]/80 p-4.5 shadow-inner">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF]">
                  Palavras do cliente sobre a dor / gargalo da empresa:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-md border border-[#F5F6F8]/10 bg-[#111318] px-2.5 py-1 text-[11px] font-medium text-[#F5F6F8] transition-colors hover:border-[#78A9FF]/40 hover:text-[#78A9FF]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-[#B7F36B]" />
                      <span className="text-[#B7F36B]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar relato</span>
                    </>
                  )}
                </button>
              </div>

              <blockquote className="whitespace-pre-wrap font-sans text-sm font-medium leading-relaxed text-[#F5F6F8]">
                &ldquo;{rawDescription}&rdquo;
              </blockquote>

              {/* Informações complementares fornecidas */}
              {(lead.bottleneckStep || lead.volumeApprox || lead.currentSystem) && (
                <div className="mt-3.5 grid gap-2 border-t border-[#F5F6F8]/8 pt-3 sm:grid-cols-3">
                  {lead.bottleneckStep && (
                    <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#111318] p-2.5">
                      <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#969DA8]">
                        <Layers className="h-2.5 w-2.5 text-[#78A9FF]" />
                        Etapa Gargalo
                      </span>
                      <p className="mt-1 text-xs font-semibold text-[#F5F6F8]">{lead.bottleneckStep}</p>
                    </div>
                  )}

                  {lead.volumeApprox && (
                    <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#111318] p-2.5">
                      <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#969DA8]">
                        <FileCheck2 className="h-2.5 w-2.5 text-[#B7F36B]" />
                        Volume Declarado
                      </span>
                      <p className="mt-1 text-xs font-semibold text-[#F5F6F8]">{lead.volumeApprox}</p>
                    </div>
                  )}

                  {lead.currentSystem && (
                    <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#111318] p-2.5">
                      <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#969DA8]">
                        <Cpu className="h-2.5 w-2.5 text-[#78A9FF]" />
                        Sistema Atual
                      </span>
                      <p className="mt-1 text-xs font-semibold text-[#F5F6F8]">{lead.currentSystem}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ações imediatas de resposta */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#969DA8]">
                <span>
                  Contato que submeteu:{" "}
                  <strong className="text-[#F5F6F8]">
                    {lead.contactName || "Responsável comercial"}
                  </strong>
                </span>
                {lead.contactPhone && (
                  <span>
                    WhatsApp: <strong className="text-[#B7F36B]">{lead.contactPhone}</strong>
                  </span>
                )}
                {lead.contactEmail && (
                  <span>
                    E-mail: <strong className="text-[#78A9FF]">{lead.contactEmail}</strong>
                  </span>
                )}
              </div>

              {cleanPhone && (
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#B7F36B]/40 bg-[#B7F36B]/15 px-3.5 py-1.5 font-mono text-xs font-semibold text-[#B7F36B] transition-colors hover:bg-[#B7F36B]/25"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Responder no WhatsApp citando esta dor</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#F5F6F8]/8 bg-[#111318]/60 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#969DA8]" />
              <div className="space-y-1">
                <p className="text-xs text-[#F5F6F8]">
                  Este lead ainda não enviou um relato detalhado pelo formulário do site.
                </p>
                <p className="text-[11px] text-[#969DA8]">
                  Origem do cadastro: <strong className="text-[#F5F6F8]">{lead.source.provider}</strong>
                  {lead.source.note ? ` (${lead.source.note})` : ""}. Você pode registrar a dor identificada
                  no campo &quot;Dor / Diagnóstico declarado&quot; abaixo no formulário de qualificação.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
