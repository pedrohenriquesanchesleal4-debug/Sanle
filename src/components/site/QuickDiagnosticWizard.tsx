"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { getStoredUtm } from "@/lib/utm";

const SEGMENT_OPTIONS = [
  { id: "bpo", label: "BPO Financeiro / Gestão de Contas", icon: "📊" },
  { id: "contabil", label: "Escritório Contábil / Fiscal", icon: "📑" },
  { id: "servicos", label: "Prestador de Serviços / Instalação", icon: "⚙️" },
  { id: "consultoria", label: "Consultoria / Administrativo", icon: "🏢" },
  { id: "outro", label: "PME com planilhas e sistemas desconectados", icon: "📁" }
];

const BOTTLENECK_OPTIONS = [
  "Recebimento e triagem manual de PDFs/comprovantes",
  "Digitação do mesmo dado em múltiplos sistemas",
  "Fechamento de mês demorado por conferência manual",
  "Cobrança de clientes e pendências sem dono",
  "Orçamentos e propostas que se perdem no WhatsApp/e-mail",
  "Erros e duplicidades descobertos tarde demais"
];

export function QuickDiagnosticWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [segment, setSegment] = useState<string>("");
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([]);
  const [calculatorDetail, setCalculatorDetail] = useState<string>("");

  const [contactName, setContactName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState<string>(""); // Honeypot
  const [consent, setConsent] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Escuta evento emitido pela Calculadora de Custo para pré-vincular
  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const custom = e as CustomEvent<{ summary?: string }>;
      if (custom.detail?.summary) {
        setCalculatorDetail(custom.detail.summary);
      }
    };
    window.addEventListener("sanle:prefill-calculator", handlePrefill);
    return () => window.removeEventListener("sanle:prefill-calculator", handlePrefill);
  }, []);

  function toggleBottleneck(item: string) {
    setSelectedBottlenecks((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!contactName.trim() || !companyName.trim() || !contactEmail.trim()) {
      setErrorMsg("Por favor, preencha seu nome, empresa e e-mail.");
      return;
    }

    if (!consent) {
      setErrorMsg("É necessário concordar com o contato para prosseguir.");
      return;
    }

    setLoading(true);
    try {
      const utm = getStoredUtm();
      const problemDesc = [
        `Gargalos selecionados: ${selectedBottlenecks.join("; ") || "Geral"}`,
        calculatorDetail ? `Dados da calculadora: ${calculatorDetail}` : ""
      ].filter(Boolean).join(". ");

      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          companyName,
          contactEmail,
          contactPhone,
          segment: segment || "Não informado",
          problemDescription: problemDesc.length >= 20 ? problemDesc : `${problemDesc} - Diagnóstico expresso via Home`,
          bottleneckStep: selectedBottlenecks[0] || "",
          calculatorEstimate: calculatorDetail,
          consent: true,
          website: websiteHoneypot, // deve ser vazio
          ...utm
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Não foi possível enviar o diagnóstico.");
        return;
      }

      setProtocol(data.data?.protocol || "SANLE-PROT");
    } catch {
      setErrorMsg("Erro de conexão ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="diagnostico-rapido" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="shell max-w-4xl">
        <Reveal className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-signal">
            <Sparkles size={13} />
            <span>Mapeamento em 3 Etapas</span>
          </div>

          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.04] tracking-tightest text-ink">
            Receba o diagnóstico inicial do seu processo.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
            Leva menos de 90 segundos. Nossa equipe analisa os dados reais da sua operação e
            apresenta um plano prático para eliminar o trabalho manual.
          </p>
        </Reveal>

        {protocol ? (
          /* Estado de sucesso */
          <Reveal className="mt-12 rounded-2xl border border-signal/40 bg-white p-8 md:p-12 text-center shadow-xl shadow-signal/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-signal/15 text-signal">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="mt-6 font-display text-3xl font-medium text-ink">
              Diagnóstico recebido com sucesso!
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Registramos sua solicitação sob o protocolo oficial:
            </p>

            <div className="mx-auto mt-4 inline-block rounded-xl border border-cobalt/20 bg-cobalt/5 px-6 py-3 font-mono text-xl font-bold tracking-wider text-cobalt">
              {protocol}
            </div>

            <p className="mx-auto mt-6 max-w-md text-sm text-ink-mute">
              Um engenheiro de processos da Sanle vai revisar os gargalos apontados e entrar em contato
              em até 24 horas úteis com o desenho preliminar da automação.
            </p>
          </Reveal>
        ) : (
          /* Wizard em 3 Passos */
          <div className="mt-12 overflow-hidden rounded-2xl border border-black/8 bg-white p-6 md:p-10 shadow-2xl shadow-black/5">
            {/* Barra de progresso */}
            <div className="mb-8 flex items-center justify-between border-b border-black/8 pb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cobalt font-mono text-sm font-bold text-white">
                  {step}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-soft font-semibold">
                  {step === 1 && "Etapa 1: Seu Segmento"}
                  {step === 2 && "Etapa 2: Onde a Operação Trava"}
                  {step === 3 && "Etapa 3: Dados para Retorno"}
                </span>
              </div>

              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-1.5 w-7 rounded-full transition-all duration-300 ${
                      step >= s ? "bg-cobalt" : "bg-black/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {calculatorDetail && (
              <div className="mb-6 flex items-center justify-between rounded-lg border border-cobalt/30 bg-cobalt/5 px-4 py-2.5 text-xs text-cobalt">
                <span>Vinculado à Calculadora: <strong>{calculatorDetail}</strong></span>
                <span className="font-mono text-[0.65rem] uppercase text-cobalt font-bold">Ativo</span>
              </div>
            )}

            {/* Passo 1: Segmento */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-ink">Qual área melhor descreve sua empresa?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SEGMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSegment(opt.label)}
                      className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${
                        segment === opt.label
                          ? "border-cobalt bg-cobalt/10 text-ink shadow-sm font-medium"
                          : "border-black/8 bg-paper/50 text-ink-soft hover:border-black/20 hover:bg-white"
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled={!segment}
                    onClick={() => setStep(2)}
                    className="btn btn-primary text-sm px-6 py-3 disabled:opacity-40"
                  >
                    Próxima etapa <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Passo 2: Onde trava */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-ink">
                  Selecione os processos que mais consomem tempo manual:
                </p>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {BOTTLENECK_OPTIONS.map((item) => {
                    const isSelected = selectedBottlenecks.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleBottleneck(item)}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-all ${
                          isSelected
                            ? "border-cobalt bg-cobalt/10 text-ink font-medium shadow-sm"
                            : "border-black/8 bg-paper/50 text-ink-soft hover:border-black/20 hover:bg-white"
                        }`}
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isSelected ? "border-cobalt bg-cobalt text-white" : "border-black/20"
                        }`}>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </span>
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-ghost text-sm px-5 py-2.5"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>

                  <button
                    type="button"
                    disabled={selectedBottlenecks.length === 0}
                    onClick={() => setStep(3)}
                    className="btn btn-primary text-sm px-6 py-3 disabled:opacity-40"
                  >
                    Continuar <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Passo 3: Dados de contato */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5">
                <p className="text-sm font-medium text-ink">Para onde enviamos a análise preliminar?</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1.5">Seu Nome *</label>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: Pedro Leal"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1.5">Nome da Empresa *</label>
                    <input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Leal Consultoria"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1.5">E-mail Corporativo *</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-ink-mute mb-1.5">WhatsApp / Telefone</label>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(61) 99999-9999"
                      className="field"
                    />
                  </div>
                </div>

                {/* Honeypot invisível para bots */}
                <input
                  type="text"
                  name="website"
                  value={websiteHoneypot}
                  onChange={(e) => setWebsiteHoneypot(e.target.value)}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <label className="mt-4 flex items-start gap-2.5 text-xs text-ink-soft cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-black/20 bg-white accent-cobalt"
                  />
                  <span>
                    Concordo em receber o diagnóstico e contato da equipe Sanle. Seus dados são protegidos conforme a LGPD.
                  </span>
                </label>

                {errorMsg && (
                  <p className="rounded-lg border border-rust/40 bg-rust/10 p-3 text-xs text-rust">
                    {errorMsg}
                  </p>
                )}

                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-ghost text-sm px-5 py-2.5"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-accent text-sm px-7 py-3.5 font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processando diagnóstico...
                      </>
                    ) : (
                      <>
                        Enviar e Gerar Protocolo
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
