"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Panel, Badge, Spinner, Notice, EmptyState } from "@/components/admin/ui";
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
          <p className="eyebrow">Abordagens</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Rascunhos de contato</h1>
          <p className="mt-1 text-sm text-ink-soft/70">Gerados por IA por lead — revise, aprove e envie fora da plataforma.</p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost">
          <RefreshCw size={15} /> Atualizar
        </button>
      </header>

      {drafts.length === 0 ? (
        <EmptyState
          title="Nenhum rascunho ainda"
          description="Abra um lead e use “Gerar abordagem” para criar o primeiro rascunho com IA."
          action={<Link href="/admin/leads" className="btn btn-primary">Ver leads</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {drafts.map((d) => (
            <article key={d.id} className="rounded-2xl border border-[var(--rule)] bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/admin/leads/${d.leadId}`} className="text-sm font-medium text-cobalt hover:underline">
                  {d.leadId.slice(0, 8)}…
                </Link>
                <div className="flex items-center gap-2">
                  <Badge tone={d.status === "aprovado" ? "lime" : d.status === "enviado_externamente" ? "cobalt" : d.status === "cancelado" ? "rust" : "neutral"}>{d.status}</Badge>
                  <span className="font-mono text-[0.62rem] uppercase text-ink-soft/60">{d.channel}</span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft/60">{d.kind}</p>
              {d.subject && <p className="mt-1 text-sm font-medium text-ink">{d.subject}</p>}
              <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">{d.editedBody || d.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => void copy(d)} className="btn btn-ghost !py-1 text-xs">
                  {copied === d.id ? <Check size={12} /> : <Copy size={12} />} {copied === d.id ? "Copiado" : "Copiar"}
                </button>
                {d.status === "rascunho" && (
                  <button type="button" onClick={() => void setStatus(d, "aprovado")} className="btn btn-ghost !py-1 text-xs">Aprovar</button>
                )}
                {d.status === "aprovado" && (
                  <button type="button" onClick={() => void setStatus(d, "enviado_externamente")} className="btn btn-ghost !py-1 text-xs">Marcar enviado</button>
                )}
                {d.status !== "cancelado" && (
                  <button type="button" onClick={() => void setStatus(d, "cancelado")} className="btn btn-ghost !py-1 text-xs text-rust">Cancelar</button>
                )}
              </div>
              <p className="mt-3 text-xs text-ink-soft/50">atualizado {timeAgo(d.updatedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
