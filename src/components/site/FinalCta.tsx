"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { segments } from "@/content/brand";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function FinalCta() {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [segmento, setSegmento] = useState<string>(segments[0]);
  const [dorTexto, setDorTexto] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [hp, setHp] = useState(""); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [whatsappReturnUrl, setWhatsappReturnUrl] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Escuta evento customizado disparado pela calculadora
  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const custom = e as CustomEvent<{ dorTexto?: string }>;
      if (custom.detail?.dorTexto) {
        setDorTexto(custom.detail.dorTexto);
      }
    };

    window.addEventListener("sanle:prefill-inbound", handlePrefill);
    return () => window.removeEventListener("sanle:prefill-inbound", handlePrefill);
  }, []);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent("form_iniciado", { local: "final_cta_inbound" });
    }
  };

  const handleWhatsAppDirect = () => {
    trackEvent("whatsapp_aberto", { local: "final_cta", segmento });
    const url = buildWhatsAppLink({ empresa, segmento });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!consentimento) {
      setErrorMsg("É necessário concordar com a política de privacidade.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/site/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          empresa,
          whatsapp,
          segmento,
          dorTexto: dorTexto.trim() || undefined,
          consentimentoLgpd: consentimento,
          hp
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Ocorreu um erro ao enviar. Tente pelo WhatsApp.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setWhatsappReturnUrl(data.whatsappUrl || buildWhatsAppLink({ empresa, segmento }));
      trackEvent("form_enviado", { empresa, segmento, leadId: data.leadId });
    } catch {
      setErrorMsg("Erro de conexão. Por favor, chame diretamente no WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="diagnostico-inbound"
      className="relative scroll-mt-20 py-24 md:py-36 bg-[#FAF8F5] text-[#121110] overflow-hidden border-t border-[rgba(18,17,16,0.08)]"
      aria-labelledby="cta-final-title"
    >
      {/* Luz volumétrica suave em tom solar e cobalto */}
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(circle,rgba(36,64,255,0.05)_0%,rgba(245,158,11,0.03)_50%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(18,17,16,0.08)] font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#2440FF] font-semibold shadow-sm">
            DIAGNÓSTICO INICIAL SEM COMPROMISSO
          </span>

          <h2
            id="cta-final-title"
            className="mt-6 font-serif-editorial text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.96] text-[#121110]"
          >
            Qual etapa da sua operação não deveria mais depender de trabalho manual?
          </h2>

          <p className="mt-5 text-lg md:text-xl text-[#4A453E] font-sans-editorial leading-relaxed max-w-2xl mx-auto">
            Descreva o processo. Nós mapeamos o fluxo, estimamos a viabilidade técnica e
            propomos um caminho claro para reduzir o atrito da sua empresa.
          </p>

          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-[#8A837A]">
            Leva 1 minuto · Sem compromisso · Não precisa trocar seus sistemas
          </p>
        </div>

        {/* Formulário Curto Embutido na Tela */}
        <div className="mt-14 max-w-2xl mx-auto p-8 md:p-12 rounded-3xl bg-white border border-[rgba(18,17,16,0.08)] shadow-2xl shadow-stone-300/40">
          {success ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-6 font-serif-editorial text-3xl text-[#121110]">
                Diagnóstico recebido com sucesso.
              </h3>

              <p className="mt-3 text-base text-[#4A453E] font-sans-editorial max-w-md mx-auto">
                Nossa equipe técnica já começou a analisar o perfil do seu segmento. Responderemos
                diretamente no seu WhatsApp com os primeiros direcionamentos.
              </p>

              {whatsappReturnUrl && (
                <div className="mt-8">
                  <a
                    href={whatsappReturnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#10B981] text-white font-medium text-sm hover:bg-[#059669] transition-all shadow-md shadow-emerald-500/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Continuar conversa agora no WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" onFocus={handleFirstInteraction}>
              {/* Campo oculto anti-robô */}
              <input
                type="text"
                name="hp"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inbound-nome" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium">
                    Seu nome *
                  </label>
                  <input
                    id="inbound-nome"
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] text-sm focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inbound-empresa" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium">
                    Nome da empresa *
                  </label>
                  <input
                    id="inbound-empresa"
                    type="text"
                    required
                    placeholder="Ex: Alfa Soluções"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] text-sm focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inbound-whatsapp" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium">
                    WhatsApp comercial *
                  </label>
                  <input
                    id="inbound-whatsapp"
                    type="tel"
                    required
                    placeholder="(61) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] text-sm font-mono focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inbound-segmento" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium">
                    Segmento de atuação *
                  </label>
                  <select
                    id="inbound-segmento"
                    value={segmento}
                    onChange={(e) => setSegmento(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] text-sm focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
                  >
                    {segments.map((seg) => (
                      <option key={seg} value={seg} className="bg-white text-[#121110]">
                        {seg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inbound-dor" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#4A453E] mb-2 font-medium">
                  Descreva o processo ou gargalo manual (opcional)
                </label>
                <textarea
                  id="inbound-dor"
                  rows={3}
                  placeholder="Ex: Baixamos extratos de 30 clientes todo dia e digitamos as conciliações manualmente no sistema..."
                  value={dorTexto}
                  onChange={(e) => setDorTexto(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(18,17,16,0.12)] rounded-xl text-[#121110] text-sm focus:outline-none focus:border-[#2440FF] focus:bg-white transition-colors"
                />
              </div>

              {/* Consentimento LGPD */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="inbound-consent"
                  type="checkbox"
                  required
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[rgba(18,17,16,0.2)] bg-white text-[#2440FF] focus:ring-[#2440FF]"
                />
                <label htmlFor="inbound-consent" className="text-xs text-[#4A453E] leading-relaxed">
                  Concordo em receber contato da Sanle exclusivamente para fins deste diagnóstico,
                  conforme a{" "}
                  <Link href="/privacidade" className="text-[#121110] underline font-medium hover:text-[#2440FF]">
                    Política de Privacidade
                  </Link>
                  .
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#121110] text-white font-medium text-sm transition-all hover:bg-[#2440FF] shadow-lg shadow-stone-900/10 disabled:opacity-50"
                >
                  <span>{submitting ? "Processando..." : "Enviar diagnóstico"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-[rgba(18,17,16,0.12)] text-[#121110] text-sm hover:border-[#10B981] hover:text-[#10B981] transition-all shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 text-[#10B981]" />
                  <span>Prefiro chamar no WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
