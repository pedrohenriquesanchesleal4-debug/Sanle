"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Plus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Panel, Badge, Spinner, Notice, EmptyState, Field } from "@/components/admin/ui";
import { api, errorMessage } from "@/lib/client-api";
import { timeAgo } from "@/lib/utils";

type Doc = { id: string; title: string; category: string; content: string; status: string; chunkCount: number; createdAt: string; updatedAt: string };
type Knowledge = { documents: Doc[]; totals: { documents: number; chunks: number }; embeddings: string };

export default function ConhecimentoPage() {
  const [data, setData] = useState<Knowledge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api.get<Knowledge>("/api/crm/knowledge"));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/crm/knowledge", form);
      setForm({ title: "", category: "", content: "" });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir este documento e seus chunks?")) return;
    await api.del(`/api/crm/knowledge/${id}`);
    await load();
  }

  async function reindex() {
    setReindexing(true);
    setError(null);
    try {
      await api.post("/api/crm/knowledge/reindex");
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setReindexing(false);
    }
  }

  if (error) return <Notice tone="warn">{error}</Notice>;
  if (!data) return <Spinner label="Carregando conhecimento…" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Conhecimento</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Base RAG da Sanle</h1>
          <p className="mt-1 text-sm text-ink-soft/70">
            {data.totals.documents} documentos · {data.totals.chunks} chunks · embeddings: {data.embeddings}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void reindex()} className="btn btn-ghost" disabled={reindexing}>
            <RefreshCw size={15} className={reindexing ? "animate-spin" : ""} /> Reindexar
          </button>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="btn btn-primary">
            <Plus size={15} /> Novo documento
          </button>
        </div>
      </header>

      {showForm && (
        <Panel title="Novo documento">
          <form onSubmit={create} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Título" required>
                <input className="field" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </Field>
              <Field label="Categoria" required>
                <input className="field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="ex.: processos, precos, faq" required />
              </Field>
            </div>
            <Field label="Conteúdo" required>
              <textarea className="field min-h-[160px]" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required />
            </Field>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving && <Loader2 size={15} className="animate-spin" />} Salvar e indexar
              </button>
            </div>
          </form>
        </Panel>
      )}

      {data.documents.length === 0 ? (
        <EmptyState
          title="Base vazia"
          description="Adicione processos, preços e FAQs da Sanle para o assistente responder com base real."
          action={<button type="button" onClick={() => setShowForm(true)} className="btn btn-primary"><Plus size={15} /> Novo documento</button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.documents.map((d) => (
            <article key={d.id} className="rounded-2xl border border-[var(--rule)] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg text-ink">{d.title}</h2>
                  <p className="mt-1 flex items-center gap-2 text-xs text-ink-soft/70">
                    <Badge tone="cobalt">{d.category}</Badge>
                    <span>{d.chunkCount} chunks</span>
                  </p>
                </div>
                <button type="button" onClick={() => void remove(d.id)} aria-label="Excluir documento" className="rounded-lg p-1.5 text-ink-soft/50 hover:bg-rust/10 hover:text-rust">
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">{d.content}</p>
              <p className="mt-3 text-[0.64rem] text-ink-soft/50">atualizado {timeAgo(d.updatedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
