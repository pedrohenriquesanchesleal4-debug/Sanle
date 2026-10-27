"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, ArrowUpRight } from "lucide-react";
import { segments } from "@/content/brand";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { trackEvent } from "@/lib/analytics";

interface CategoryOption {
  id: string;
  label: string;
  shortTag: string;
  questionHint: string;
  placeholder: string;
  waPrefix: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "site",
    label: "Preciso de um site",
    shortTag: "Sanle Digital",
    questionHint: "Qual o objetivo do site (institucional, vendas, captação de leads) e se já possui domínio ou referências?",
    placeholder: "Ex: Queremos renovar nosso site institucional e criar páginas de conversão para novos serviços corporativos...",
    waPrefix: "gostaria de conversar sobre o desenvolvimento de um site / presença digital"
  },
  {
    id: "sistema",
    label: "Preciso de um sistema",
    shortTag: "Sanle Systems",
    questionHint: "Qual processo da sua empresa você precisa gerenciar no sistema (pedidos, CRM, ordens de serviço, clientes)?",
    placeholder: "Ex: Precisamos de um painel web para nossa equipe de campo lançar laudos técnicos e a diretoria acompanhar prazos...",
    waPrefix: "gostaria de conversar sobre o desenvolvimento de um sistema personalizado / software sob medida"
  },
  {
    id: "agente_ia",
    label: "Quero um agente de IA",
    shortTag: "Sanle Agents",
    questionHint: "Em qual canal o agente deve atuar (WhatsApp, site, interno) e quais dúvidas ou tarefas ele deve atender?",
    placeholder: "Ex: Queremos um agente de WhatsApp para triagem 24/7 de orçamentos e um assistente interno para consulta a manuais...",
    waPrefix: "tenho interesse em desenvolver um Agente de Inteligência Artificial para minha empresa"
  },
  {
    id: "automacao",
    label: "Quero automatizar um processo",
    shortTag: "Sanle Automation",
    questionHint: "Quais tarefas manuais repetitivas você quer eliminar (planilhas, documentos fiscais, conciliação)?",
    placeholder: "Ex: Nossa equipe perde 3 horas por dia conferindo notas fiscais em PDFs e redigitando dados no ERP...",
    waPrefix: "gostaria de conversar sobre automação de processos operacionais e eliminação de retrabalho manual"
  },
  {
    id: "integracao",
    label: "Preciso integrar sistemas",
    shortTag: "APIs & Barramento",
    questionHint: "Quais ferramentas ou ERPs sua empresa já utiliza e precisam conversar entre si em tempo real?",
    placeholder: "Ex: Precisamos conectar nosso WhatsApp Business ao nosso ERP (Omie/ContaAzul) e ao banco de dados...",
    waPrefix: "preciso integrar sistemas que já utilizamos na empresa (APIs, ERP e canais)"
  },
  {
    id: "produto_digital",
    label: "Quero desenvolver um produto digital",
    shortTag: "MVP & SaaS",
    questionHint: "Conte um pouco sobre o produto ou MVP que você quer tirar do papel e qual o público-alvo.",
    placeholder: "Ex: Estamos desenhando uma plataforma B2B para o setor de logística e precisamos construir o MVP funcional...",
    waPrefix: "quero desenvolver um produto digital / MVP de software com a Sanle"
  },
  {
    id: "diagnostico_geral",
    label: "Ainda não sei qual solução preciso",
    shortTag: "Consultoria Inicial",
    questionHint: "Descreva livremente o momento da sua empresa e o principal gargalo operacional ou comercial.",
    placeholder: "Ex: Sentimos que a operação está sobrecarregada com rotinas manuais e queremos entender onde o software pode ajudar...",
    waPrefix: "gostaria de agendar uma conversa para mapear onde o software pode ajudar minha empresa"
  }
];

export function FinalCta() {
  const { dict } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("site");
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

  // Lê parâmetros da URL para pré-selecionar categoria vinda de outros CTAs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkUrlParams = () => {
      const url = new URL(window.location.href);
      const catParam = url.searchParams.get("categoria");
      if (catParam) {
        const found = CATEGORIES.find((c) => c.id === catParam);
        if (found) {
          setSelectedCategory(found.id);
        }
      }
    };

    checkUrlParams();
    window.addEventListener("hashchange", checkUrlParams);
    window.addEventListener("popstate", checkUrlParams);
    return () => {
      window.removeEventListener("hashchange", checkUrlParams);
      window.removeEventListener("popstate", checkUrlParams);
    };
  }, []);

  // Escuta evento customizado disparado pela calculadora
  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const custom = e as CustomEvent<{ dorTexto?: string }>;
      if (custom.detail?.dorTexto) {
        setDorTexto(custom.detail.dorTexto);
        setSelectedCategory("automacao");
      }
    };

    window.addEventListener("sanle:prefill-inbound", handlePrefill);
    return () => window.removeEventListener("sanle:prefill-inbound", handlePrefill);
  }, []);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent("form_iniciado", { local: "final_cta_inbound", categoria: selectedCategory });
    }
  };

  const activeCatObj = CATEGORIES.find((c) => c.id === selectedCategory) ?? CATEGORIES[0]!;

  const handleWhatsAppDirect = () => {
    trackEvent("whatsapp_aberto", { local: "final_cta", categoria: selectedCategory, segmento });
    const customText = `Olá Pedro! Vim pelo site da Sanle e ${activeCatObj.waPrefix}${empresa ? ` para a empresa ${empresa}` : ""}.`;
    const url = buildWhatsAppLink({ customText });
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

    // Concatena a categoria escolhida junto à descrição do projeto para persistência
    const compositeDor = `[CATEGORIA: ${activeCatObj.label}] ${dorTexto.trim()}`;

    try {
      const res = await fetch("/api/site/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          empresa,
          whatsapp,
          segmento,
          dorTexto: compositeDor,
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
      const customText = `Olá Pedro! Enviei minha solicitação pelo site da Sanle (${activeCatObj.label}) para a ${empresa}.`;
      setWhatsappReturnUrl(data.whatsappUrl || buildWhatsAppLink({ customText }));
      trackEvent("form_enviado", { empresa, segmento, categoria: selectedCategory, leadId: data.leadId });
    } catch {
      setErrorMsg("Erro de conexão. Por favor, chame diretamente no WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      className="relative scroll-mt-16 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] overflow-clip border-t border-white/10 select-none"
      aria-labelledby="cta-final-title"
    >
      {/* Glow volumétrico */}
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(circle,rgba(36,64,255,0.08)_0%,rgba(183,243,107,0.04)_50%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#78A9FF] font-semibold shadow-sm backdrop-blur-md">
            {dict.contactForm.badge}
          </span>

          <h2
            id="cta-final-title"
            className="mt-5 font-serif-editorial text-[clamp(2.3rem,6vw,4.8rem)] leading-[0.98] text-[#F5F6F8]"
          >
            {dict.contactForm.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#969DA8] font-sans-editorial leading-relaxed max-w-2xl mx-auto">
            {dict.contactForm.desc}
          </p>
        </div>

        {/* =======================================================================
            SELETOR INTELIGENTE DE NECESSIDADE (Requisito da Seção 11)
           ======================================================================= */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <span className="block font-mono text-xs uppercase tracking-wider text-[#969DA8] mb-3 text-center font-semibold">
            {dict.contactForm.selectNature}
          </span>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#2440FF] text-white font-bold shadow-lg shadow-[#2440FF]/30 scale-105 border border-[#78A9FF]/50"
                      : "bg-[#111319] text-[#969DA8] border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulário Contextual Embutido */}
        <div className="mt-8 max-w-2xl mx-auto p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {success ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#B7F36B] flex items-center justify-center mx-auto shadow-lg shadow-[#10B981]/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-6 font-serif-editorial text-3xl text-[#F5F6F8]">
                {dict.contactForm.successTitle}
              </h3>

              <p className="mt-3 text-base text-[#969DA8] font-sans-editorial max-w-md mx-auto">
                Registramos seu interesse em <strong className="text-white">{activeCatObj.label}</strong>. 
                {dict.contactForm.successDesc}
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
                    <span>{dict.contactForm.continueOnWhatsapp}</span>
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

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono text-[#78A9FF]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B7F36B]" />
                  <span>ÁREA: {activeCatObj.shortTag.toUpperCase()}</span>
                </div>
                <span className="text-[#969DA8]">Etapa 2 de 2</span>
              </div>

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

              {/* Campo Contextual Adaptado à Categoria Escolhida */}
              <div>
                <label htmlFor="inbound-dor" className="block font-mono text-xs uppercase tracking-[0.14em] text-[#969DA8] mb-2 font-medium">
                  {activeCatObj.questionHint}
                </label>
                <textarea
                  id="inbound-dor"
                  rows={3}
                  placeholder={activeCatObj.placeholder}
                  value={dorTexto}
                  onChange={(e) => setDorTexto(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#F5F6F8] text-sm focus:outline-none focus:border-[#78A9FF] focus:bg-white/[0.06] transition-colors"
                />
              </div>

              {/* Consentimento LGPD */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="inbound-consent"
                  type="checkbox"
                  required
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#2440FF] focus:ring-[#2440FF]"
                />
                <label htmlFor="inbound-consent" className="text-xs text-[#969DA8] leading-relaxed">
                  Concordo em receber contato da equipe técnica da Sanle para avaliação deste projeto,
                  conforme as diretrizes da nossa{" "}
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

              {/* CTAs Principais (Seção 11) */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-sm transition-all hover:bg-[#3856ff] shadow-lg shadow-[#2440FF]/25 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  <span>{submitting ? "Processando..." : "Conversar sobre meu projeto"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/15 text-white text-xs hover:border-[#B7F36B] hover:text-[#B7F36B] hover:bg-white/[0.08] transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Abrir WhatsApp com o briefing da categoria selecionada"
                >
                  <MessageCircle className="h-4 w-4 text-[#B7F36B]" />
                  <span>{dict.contactForm.whatsappCta}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="#capacidades"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[#969DA8] hover:text-white transition-colors"
                >
                  <span>Quer ver o que desenvolvemos antes? Ver demonstrações</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
