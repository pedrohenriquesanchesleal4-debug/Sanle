"use client";

import { useState } from "react";
import { MessageCircle, Mail, Linkedin, Copy, Check, ArrowUpRight, MapPin } from "lucide-react";
import { brand } from "@/content/brand";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(brand.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${brand.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Olá Pedro, vi o site da Sanle / Sales Hunter e gostaria de conversar sobre automação e inteligência comercial para minha empresa."
  )}`;

  return (
    <section
      id="contato"
      className="relative scroll-mt-20 py-10 sm:py-16 md:py-24 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] overflow-hidden w-full max-w-full"
      aria-labelledby="contact-section-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(18,17,16,0.08)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#059669] font-mono text-xs uppercase tracking-wider font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>CANAIS DIRETOS & ATENDIMENTO EXECUTIVO</span>
            </div>
            <h2
              id="contact-section-title"
              className="mt-4 font-serif-editorial text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-[#121110]"
            >
              Fale diretamente com quem projeta e implementa.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#4A453E] font-sans-editorial leading-relaxed">
              Sem intermediários ou respostas engessadas. Converse diretamente com Pedro Henrique para avaliar
              gargalos manuais da sua empresa ou desenhar seu motor de prospecção.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#8A837A] bg-white border border-[rgba(18,17,16,0.08)] px-4 py-2.5 rounded-full shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-[#2440FF]" />
            <span>Brasília · DF (Atendimento Brasil)</span>
          </div>
        </div>

        {/* 3 Cartões de Canais de Contato */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. WhatsApp */}
          <div className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#059669] font-semibold border border-[#10B981]/20">
                  CANAL PRIORITÁRIO
                </span>
                <span className="text-[#8A837A]">RESPOSTA RÁPIDA</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#121110]">
                    WhatsApp Direto
                  </h3>
                  <p className="font-mono text-xs text-[#8A837A] mt-0.5">
                    {brand.contact.whatsappDisplay || "(61) 98139-9051"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                Envie uma mensagem para tirar dúvidas, agendar um diagnóstico de 30 minutos ou discutir viabilidade técnica.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(18,17,16,0.06)]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#121110] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#10B981] transition-all shadow-sm group-hover:shadow-md"
              >
                <span>Iniciar conversa no WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 2. E-mail */}
          <div className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] hover:border-[#2440FF]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/10 text-[#2440FF] font-semibold border border-[#2440FF]/15">
                  PROPOSTAS & ESCOPOS
                </span>
                <span className="text-[#8A837A]">CORPORATIVO</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-[#2440FF]/10 text-[#2440FF] flex items-center justify-center group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#121110]">
                    E-mail Direto
                  </h3>
                  <p className="font-mono text-xs text-[#8A837A] mt-0.5 truncate max-w-[190px]">
                    {brand.contact.email}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                Envie documentos de processos, planilhas de exemplo ou solicitações formais de proposta comercial.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(18,17,16,0.06)] flex items-center gap-2">
              <a
                href={`mailto:${brand.contact.email}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#121110] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-sm"
              >
                <span>Enviar E-mail</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="p-3 rounded-xl border border-[rgba(18,17,16,0.12)] text-[#121110] hover:border-[#2440FF] hover:text-[#2440FF] transition-colors"
                title="Copiar endereço de e-mail"
                aria-label="Copiar e-mail"
              >
                {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 3. LinkedIn */}
          <div className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] hover:border-[#0A66C2]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] font-semibold border border-[#0A66C2]/20">
                  NETWORKING
                </span>
                <span className="text-[#8A837A]">LIDERANÇA</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:bg-[#0A66C2] group-hover:text-white transition-colors shrink-0">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#121110]">
                    LinkedIn
                  </h3>
                  <p className="font-mono text-xs text-[#8A837A] mt-0.5">
                    Pedro Henrique Sanches Leal
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                Conecte-se para acompanhar atualizações de arquitetura de software, automação de operações e inteligência B2B.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(18,17,16,0.06)]">
              <a
                href={brand.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#121110] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#0A66C2] transition-all shadow-sm"
              >
                <span>Conectar no LinkedIn</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
