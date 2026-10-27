"use client";

import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  Target,
  Zap,
  BookmarkPlus
} from "lucide-react";
import type { Lead } from "@/lib/types";
import { api, errorMessage } from "@/lib/client-api";

interface ProspectReplyAssistantProps {
  lead: Lead;
  onActivitySaved?: () => void;
}

type ReplyResult = {
  diagnosis: string;
  recommendedReply: string;
  shortAlternative: string;
  suggestedAction: string;
  provider: string;
  model: string;
};

const PRESETS = [
  "Quanto custa esse serviço?",
  "Já temos um sistema próprio aqui na empresa.",
  "Estamos sem tempo agora, me procure no próximo mês.",
  "Vocês também desenvolvem sites e landing pages?",
  "Como funciona o assistente de atendimento no WhatsApp?"
];

export function ProspectReplyAssistant({ lead, onActivitySaved }: ProspectReplyAssistantProps) {
  const [clientReply, setClientReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReplyResult | null>(null);
  const [copiedType, setCopiedType] = useState<"rec" | "short" | null>(null);
  const [savedActivity, setSavedActivity] = useState(false);

  const phone = (lead.contactPhone || lead.phone || "").replace(/\D/g, "");
  const cleanPhone = phone.startsWith("55") ? phone : phone ? `55${phone}` : "";

  async function handleAnalyze(textToAnalyze?: string) {
    const text = textToAnalyze || clientReply;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setSavedActivity(false);

    try {
      const data = await api.post<ReplyResult>("/api/crm/reply-assistant", {
        leadId: lead.id,
        clientReply: text.trim(),
        channel: "whatsapp"
      });
      setResult(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string, type: "rec" | "short") {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }

  function handleOpenWhatsApp(text: string) {
    if (!cleanPhone) return;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  async function handleSaveActivity() {
    if (!result) return;
    try {
      await api.post(`/api/crm/leads/${lead.id}/activities`, {
        kind: "contato",
        summary: `Objeção respondida com IA: "${clientReply.slice(0, 80)}${clientReply.length > 80 ? "..." : ""}"`,
        detail: `Diagnóstico: ${result.diagnosis}\n\nResposta gerada: ${result.recommendedReply}\n\nAção sugerida: ${result.suggestedAction}`
      });
      setSavedActivity(true);
      if (onActivitySaved) onActivitySaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#78A9FF]/20 bg-gradient-to-b from-[#111318]/95 to-[#0A0B0E]/95 p-6 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#78A9FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#B7F36B]/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F6F8]/8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#78A9FF]/30 bg-[#78A9FF]/15 text-[#78A9FF]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#78A9FF]">
                Assistente de Resposta Comercial
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#78A9FF]/30 bg-[#78A9FF]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#78A9FF]">
                IA Consultiva Sanle
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#969DA8]">
              A empresa respondeu no WhatsApp ou e-mail? Cole a mensagem abaixo e a IA analisa a real objeção e gera uma réplica consultiva.
            </p>
          </div>
        </div>
      </div>

      {/* Input de mensagem do cliente */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
            Exemplos comuns:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setClientReply(preset);
                void handleAnalyze(preset);
              }}
              className="rounded-md border border-[#F5F6F8]/10 bg-[#161920] px-2 py-1 text-[11px] text-[#C2C7D0] transition-colors hover:border-[#78A9FF]/40 hover:text-[#F5F6F8]"
            >
              &ldquo;{preset.length > 32 ? preset.slice(0, 32) + "..." : preset}&rdquo;
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={clientReply}
            onChange={(e) => setClientReply(e.target.value)}
            rows={3}
            placeholder="Cole aqui o que a empresa respondeu (ex: 'Já temos um sistema aqui', 'Quanto custa?', 'Não temos tempo agora', etc.)..."
            className="w-full resize-none rounded-xl border border-[#F5F6F8]/12 bg-[#161920]/90 p-3.5 text-xs font-medium text-[#F5F6F8] placeholder-[#969DA8]/60 focus:border-[#78A9FF] focus:outline-none focus:ring-1 focus:ring-[#78A9FF]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => void handleAnalyze()}
            disabled={loading || !clientReply.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#78A9FF]/40 bg-gradient-to-r from-[#78A9FF]/20 to-[#78A9FF]/10 px-4 py-2 font-mono text-xs font-semibold text-[#78A9FF] transition-all hover:border-[#78A9FF]/70 hover:from-[#78A9FF]/30 hover:to-[#78A9FF]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{loading ? "Analisando com IA..." : "Analisar com IA e Gerar Resposta"}</span>
          </button>

          {error && <span className="text-xs text-[#F26464]">{error}</span>}
        </div>
      </div>

      {/* Resultados da Análise */}
      {result && (
        <div className="mt-5 space-y-4 rounded-xl border border-[#78A9FF]/25 bg-[#14171E] p-4.5 shadow-inner">
          {/* 1. Diagnóstico */}
          <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#0F1116] p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#78A9FF]">
              <Lightbulb className="h-4 w-4" />
              <span>Diagnóstico da Resposta & Objeção Real</span>
            </div>
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#F5F6F8]">
              {result.diagnosis}
            </p>
          </div>

          {/* 2. Resposta Recomendada */}
          <div className="rounded-lg border border-[#B7F36B]/25 bg-[#0F1116] p-4">
            <div className="flex items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B7F36B]">
                <MessageSquare className="h-4 w-4" />
                <span>Resposta Recomendada para WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(result.recommendedReply, "rec")}
                  className="inline-flex items-center gap-1 rounded-md border border-[#F5F6F8]/10 bg-[#161920] px-2.5 py-1 text-[11px] font-medium text-[#F5F6F8] transition-colors hover:border-[#B7F36B]/40 hover:text-[#B7F36B]"
                >
                  {copiedType === "rec" ? (
                    <>
                      <Check className="h-3 w-3 text-[#B7F36B]" />
                      <span className="text-[#B7F36B]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                {cleanPhone && (
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(result.recommendedReply)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#B7F36B]/40 bg-[#B7F36B]/15 px-2.5 py-1 text-[11px] font-semibold text-[#B7F36B] transition-colors hover:bg-[#B7F36B]/25"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Abrir no WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
            <p className="whitespace-pre-wrap text-xs font-medium leading-relaxed text-[#F5F6F8]">
              {result.recommendedReply}
            </p>
          </div>

          {/* 3. Alternativa Curta e Ação Sugerida */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#0F1116] p-3">
              <div className="flex items-center justify-between gap-1 pb-1.5">
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                  <Zap className="h-3 w-3 text-[#78A9FF]" />
                  Opção Rápida / Direta
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(result.shortAlternative, "short")}
                  className="text-[10px] text-[#78A9FF] hover:underline"
                >
                  {copiedType === "short" ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-xs text-[#C2C7D0]">{result.shortAlternative}</p>
            </div>

            <div className="rounded-lg border border-[#F5F6F8]/8 bg-[#0F1116] p-3">
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#969DA8]">
                <Target className="h-3 w-3 text-[#B7F36B]" />
                Próxima Ação no CRM
              </span>
              <p className="mt-1 text-xs font-medium text-[#F5F6F8]">{result.suggestedAction}</p>
            </div>
          </div>

          {/* Botão de Salvar no Histórico */}
          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={() => void handleSaveActivity()}
              disabled={savedActivity}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#969DA8] transition-colors hover:text-[#F5F6F8] disabled:text-[#B7F36B]"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>{savedActivity ? "Salvo no histórico de atividades!" : "Registrar esta interação nas atividades do lead"}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
