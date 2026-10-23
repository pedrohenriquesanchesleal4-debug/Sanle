"use client";

import { Badge } from "@/components/admin/ui";
import { STAGE_LABELS, type FunnelStage, type VerificationStatus } from "@/lib/types";

const STAGE_TONE: Record<string, string> = {
  identificado: "neutral",
  a_pesquisar: "neutral",
  qualificado: "cobalt",
  primeiro_contato: "cobalt",
  respondeu: "cobalt",
  reuniao: "lime",
  proposta_enviada: "lime",
  negociacao: "lime",
  ganho: "lime",
  perdido: "rust",
  sem_prioridade: "neutral"
};

export function StageBadge({ stage }: { stage: FunnelStage }) {
  return <Badge tone={STAGE_TONE[stage] ?? "neutral"}>{STAGE_LABELS[stage]}</Badge>;
}

const VERIF_LABEL: Record<VerificationStatus, { label: string; tone: string }> = {
  nao_verificado: { label: "não verificado", tone: "neutral" },
  parcial: { label: "parcial", tone: "cobalt" },
  verificado: { label: "verificado", tone: "lime" },
  invalido: { label: "inválido", tone: "rust" }
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const v = VERIF_LABEL[status];
  return <Badge tone={v.tone}>{v.label}</Badge>;
}

export function ScorePill({ score }: { score?: number | null }) {
  if (score == null) return <span className="font-mono text-xs text-[#969DA8]/50">—</span>;
  const tone = score >= 65 ? "lime" : score >= 40 ? "cobalt" : "neutral";
  return <Badge tone={tone}>{score}</Badge>;
}

export function PriorityDot({ priority }: { priority: string }) {
  const color =
    priority === "alta"
      ? "bg-[#B7F36B] shadow-[0_0_8px_#B7F36B]"
      : priority === "media"
        ? "bg-[#78A9FF]"
        : "bg-[#969DA8]/45";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#969DA8]">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      {priority}
    </span>
  );
}
