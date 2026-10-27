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
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] overflow-hidden border-t border-white/10"
      aria-labelledby="cta-final-title"
    >
      {/* Luz volumétrica suave em tom cobalto e verde */}
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(circle,rgba(36,64,255,0.08)_0%,rgba(183,243,107,0.04)_50%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#78A9FF] font-semibold shadow-sm backdrop-blur-md">
            DIAGNÓSTICO INICIAL SEM COMPROMISSO
          </span>

          <h2
            id="cta-final-title"
            className="mt-5 font-serif-editorial text-[clamp(2.5rem,6.5vw,5.2rem)] leading-[0.96] text-[#F5F6F8]"
          >
            Qual etapa da sua operação não deveria mais depender de trabalho manual?
          </h2>

          <p className="mt-4 text-lg md:text-xl text-[#969DA8] font-sans-editorial leading-relaxed max-w-2xl mx-auto">
            Descreva o processo. Nós mapeamos o fluxo, estimamos a viabilidade técnica e
            propomos um caminho claro para reduzir o atrito da sua empresa.
          </p>

          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-[#969DA8]/70">
            Leva 1 minuto · Sem compromisso · Não precisa trocar seus sistemas
          </p>
        </div>

        {/* Formulário Curto Embutido na Tela */}
        <div className="mt-10 sm:mt-12 max-w-2xl mx-auto p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {success ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#B7F36B] flex items-center justify-center mx-auto shadow-lg shadow-[#10B981]/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-6 font-serif-editorial text-3xl text-[#F5F6F8]">
                Diagnóstico recebido com sucesso.
              </h3>

              <p className="mt-3 text-base text-[#969DA8] font-sans-editorial max-w-md mx-auto">
                Nossa equipe técnica já começou a analisar o perfil do seu segmento. Responderemos
                diretamente no seu WhatsApp com os primeiros direcionamentos.
              </p>

              {whatsappReturnUrl && (
                <div className="mt-8">
                  <a
                    href={whatsappReturnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-sm hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Continuar conversa agora no WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" onFocus={handleFirstInteraction}>
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
                  <label htmlFor="inbound-nome" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                    Seu nome *
                  </label>
                  <input
                    id="inbound-nome"
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#F5F6F8] text-sm focus:outline-none focus:border-[#78A9FF] focus:bg-white/[0.06] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inbound-empresa" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                    Nome da empresa *
                  </label>
                  <input
                    id="inbound-empresa"
                    type="text"
                    required
                    placeholder="Ex: Alfa Soluções"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#F5F6F8] text-sm focus:outline-none focus:border-[#78A9FF] focus:bg-white/[0.06] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inbound-whatsapp" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                    WhatsApp comercial *
                  </label>
                  <input
                    id="inbound-whatsapp"
                    type="tel"
                    required
                    placeholder="(61) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#F5F6F8] text-sm font-mono focus:outline-none focus:border-[#78A9FF] focus:bg-white/[0.06] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inbound-segmento" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                    Segmento de atuação *
                  </label>
                  <select
                    id="inbound-segmento"
                    value={segmento}
                    onChange={(e) => setSegmento(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111318] border border-white/10 rounded-xl text-[#F5F6F8] text-sm focus:outline-none focus:border-[#78A9FF] transition-colors"
                  >
                    {segments.map((seg) => (
                      <option key={seg} value={seg} className="bg-[#111318] text-[#F5F6F8]">
                        {seg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inbound-dor" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                  Descreva o processo ou gargalo manual (opcional)
                </label>
                <textarea
                  id="inbound-dor"
                  rows={3}
                  placeholder="Ex: Baixamos extratos de 30 clientes todo dia e digitamos as conciliações manualmente no sistema..."
                  value={dorTexto}
                  onChange={(e) => setDorTexto(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#F5F6F8] text-sm focus:outline-none focus:border-[#78A9FF] focus:bg-white/[0.06] transition-colors"
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
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#2440FF] focus:ring-[#2440FF]"
                />
                <label htmlFor="inbound-consent" className="text-xs text-[#969DA8] leading-relaxed">
                  Concordo em receber contato da Sanle exclusivamente para fins deste diagnóstico,
                  conforme a{" "}
                  <Link href="/privacidade" className="text-[#F5F6F8] underline font-medium hover:text-[#78A9FF]">
                    Política de Privacidade
                  </Link>
                  .
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-sm transition-all hover:bg-[#3856ff] shadow-lg shadow-[#2440FF]/25 disabled:opacity-50 active:scale-95"
                >
                  <span>{submitting ? "Processando..." : "Enviar diagnóstico"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.04] border border-white/15 text-white text-sm hover:border-[#B7F36B] hover:text-[#B7F36B] hover:bg-white/[0.08] transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 text-[#B7F36B]" />
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
