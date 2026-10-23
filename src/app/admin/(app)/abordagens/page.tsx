"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Badge, Spinner, Notice, EmptyState } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import type { OutreachDraft } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function AbordagensPage() {
  const [drafts, setDrafts] = useState<OutreachDraft[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setDrafts(await api.get<OutreachDraft[]>("/api/crm/drafts"));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(d: OutreachDraft, status: OutreachDraft["status"]) {
    await api.patch(`/api/crm/drafts/${d.id}`, { status });
    await load();
  }

  async function copy(d: OutreachDraft) {
    await navigator.clipboard.writeText(d.editedBody || d.body);
    setCopied(d.id);
    setTimeout(() => setCopied(null), 1500);
  }

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!drafts) return <Spinner label="Carregando abordagens…" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">ABORDAGENS · OUTREACH STUDIO</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F6F8]">Rascunhos de contato</h1>
          <p className="mt-1 text-sm text-[#969DA8]">
            Gerados por IA contextual por lead — revise, aprove e acione fora da plataforma.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost">
          <RefreshCw size={15} /> Atualizar
        </button>
      </header>

      {drafts.length === 0 ? (
        <EmptyState
          title="Nenhum rascunho ainda"
          description="Abra um lead e use “Gerar abordagem” para criar o primeiro rascunho comercial."
          action={<Link href="/admin/leads" className="btn btn-primary">Ver leads</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {drafts.map((d) => (
            <article key={d.id} className="rounded-2xl border border-white/[0.08] bg-[#111318] p-5 shadow-[0_12px_36px_-18px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/admin/leads/${d.leadId}`} className="font-mono text-xs font-medium text-[#78A9FF] hover:text-[#B7F36B]">
                  Lead #{d.leadId.slice(0, 8)}…
                </Link>
                <div className="flex items-center gap-2">
                  <Badge tone={d.status === "aprovado" ? "lime" : d.status === "enviado_externamente" ? "cobalt" : d.status === "cancelado" ? "rust" : "neutral"}>
                    {d.status}
                  </Badge>
                  <span className="font-mono text-[0.62rem] uppercase text-[#969DA8]">{d.channel}</span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[#969DA8]">{d.kind}</p>
              {d.subject && <p className="mt-1 text-sm font-medium text-[#F5F6F8]">{d.subject}</p>}
              <p className="mt-2 line-clamp-5 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-[#191C22]/65 p-3 text-xs leading-relaxed text-[#F5F6F8]/90">
                {d.editedBody || d.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => void copy(d)} className="btn btn-ghost !py-1.5 text-xs">
                  {copied === d.id ? <Check size={12} className="text-[#B7F36B]" /> : <Copy size={12} />} {copied === d.id ? "Copiado" : "Copiar"}
                </button>
                {d.status === "rascunho" && (
                  <button type="button" onClick={() => void setStatus(d, "aprovado")} className="btn btn-ghost !py-1.5 text-xs text-[#B7F36B]">
                    Aprovar
                  </button>
                )}
                {d.status === "aprovado" && (
                  <button type="button" onClick={() => void setStatus(d, "enviado_externamente")} className="btn btn-ghost !py-1.5 text-xs text-[#78A9FF]">
                    Marcar enviado
                  </button>
                )}
                {d.status !== "cancelado" && (
                  <button type="button" onClick={() => void setStatus(d, "cancelado")} className="btn btn-ghost !py-1.5 text-xs text-[#FF6B6B]">
                    Cancelar
                  </button>
                )}
              </div>
              <p className="mt-3 font-mono text-[0.65rem] text-[#969DA8]">atualizado {timeAgo(d.updatedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
