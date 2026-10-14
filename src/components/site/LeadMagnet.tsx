"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Loader2, Sparkles, Lock, ArrowRight } from "lucide-react";
import { getStoredUtm } from "@/lib/utm";

export function LeadMagnet() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !name.trim()) {
      setError("Informe seu nome e e-mail.");
      return;
    }

    setLoading(true);
    try {
      const utm = getStoredUtm();
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: name,
          companyName: company || "Não informado",
          contactEmail: email,
          segment: "Download Lead Magnet",
          problemDescription: "Solicitação de download: Checklist Executivo de Processos Automatizáveis 2026.",
          consent: true,
          ...utm
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Erro ao processar. Tente novamente.");
        return;
      }

      setDownloadReady(true);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleTriggerDownload() {
    // Gera o arquivo de Checklist em Markdown estruturado para download direto
    const content = `# SANLE — Checklist Executivo de Automação de Processos (2026)
Guia de Auditoria Operacional para Empresas e Consultorias.

## 1. Triagem de Documentos e Arquivos
[ ] Documentos fiscais e comprovantes chegam organizados em pastas padronizadas?
[ ] Há renomeação automática de arquivos baseada em regras de data, CNPJ e valor?
[ ] Dados de notas fiscais são extraídos automaticamente para o ERP ou planilha de controle?
[ ] Casos de documentos ilegíveis ou com campos faltantes são direcionados automaticamente para exceção humana?

## 2. Redigitação e Integração de Sistemas
[ ] A equipe redigita os mesmos dados de clientes ou pedidos em mais de uma ferramenta?
[ ] Há sincronização automática e idempotente entre planilhas, formulários e sistemas centrais?
[ ] Em caso de falha de conexão de uma API, a operação é reprocessada com histórico de auditoria?

## 3. Fluxo de Vendas e Cobrança de Pendências
[ ] Solicitações de orçamentos recebidas no WhatsApp e e-mail possuem rastreamento de próxima ação?
[ ] Lembretes de acompanhamento são gerados automaticamente para oportunidades sem resposta?
[ ] A equipe perde prazos de fechamento de mês por acúmulo de conferência manual?

## 4. IA Aplicada com Segurança e LGPD
[ ] A empresa utiliza inteligência artificial com base de conhecimento curada e fontes auditáveis?
[ ] Nenhuma informação sensível ou chave de acesso trafega desprotegida no navegador do usuário?
[ ] As respostas da IA possuem guardrails determinísticos para não inventar fatos ou números?

---
Precisa de ajuda para implementar este fluxo na sua empresa?
Acesse: https://sanle.com.br ou solicite um diagnóstico com a equipe Sanle em Brasília.`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sanle-Checklist-Automacao-Processos-2026.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <section id="checklist" className="relative scroll-mt-24 py-20 md:py-28 overflow-hidden">
      <div className="shell max-w-5xl">
        <div className="relative rounded-3xl border border-black/8 bg-gradient-to-br from-white via-white to-paper-deep/40 p-8 md:p-14 shadow-2xl shadow-black/5">
          {/* Brilho decorativo sutil */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cobalt/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Apresentação do Material */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cobalt/30 bg-cobalt/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-cobalt">
                <FileText size={13} />
                <span>Material Gratuito</span>
              </div>

              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.2rem)] font-medium leading-[1.08] tracking-tightest text-ink">
                Checklist Executivo: 25 Gargalos Automatizáveis na Sua Empresa.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                Compilamos os 25 pontos críticos mais comuns que geram perda de tempo, retrabalho e
                custos invisíveis em empresas de serviços, escritórios e consultorias.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-ink-soft">
                {[
                  "Matriz de priorização: o que vale automatizar e o que manter humano",
                  "Protocolo de recepção e extração documental sem digitação",
                  "Checklist de conformidade de dados e LGPD com IA"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal text-xs font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulário de Download */}
            <div className="rounded-2xl border border-black/8 bg-white p-6 md:p-8 shadow-md">
              {downloadReady ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal/20 text-signal">
                    <CheckCircle2 size={32} />
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-medium text-ink">
                    Acesso Liberado!
                  </h3>

                  <p className="mt-2 text-sm text-ink-soft">
                    Seu material está pronto para download. Guardamos seu registro para envio de atualizações.
                  </p>

                  <button
                    type="button"
                    onClick={handleTriggerDownload}
                    className="btn btn-accent mt-6 w-full py-3.5"
                  >
                    <Download size={18} />
                    Baixar Checklist (.md)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/8 pb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                      Acesso Imediato
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-cobalt font-semibold">
                      <Sparkles size={12} /> Gratuito
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1">
                      Seu Nome *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ana Souza"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1">
                      E-mail Profissional *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ana@suaempresa.com.br"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1">
                      Empresa (Opcional)
                    </label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nome da sua empresa"
                      className="field"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-rust/10 p-2 text-xs text-rust">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary mt-2 w-full py-3.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Liberando...
                      </>
                    ) : (
                      <>
                        Receber Checklist Agora
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[0.72rem] text-ink-mute">
                    <Lock size={11} /> Seus dados não são compartilhados com terceiros.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
