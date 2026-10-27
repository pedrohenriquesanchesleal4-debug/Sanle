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
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="contact-section-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#B7F36B] font-mono text-xs uppercase tracking-wider font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#B7F36B] animate-pulse" />
              <span>CANAIS DIRETOS & ATENDIMENTO EXECUTIVO</span>
            </div>
            <h2
              id="contact-section-title"
              className="mt-4 font-serif-editorial text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-[#F5F6F8]"
            >
              Fale diretamente com quem projeta e implementa.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#969DA8] font-sans-editorial leading-relaxed">
              Sem intermediários ou respostas engessadas. Converse diretamente com Pedro Henrique para avaliar
              gargalos manuais da sua empresa ou desenhar seu motor de prospecção.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#969DA8] bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-full shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-[#78A9FF]" />
            <span>Brasília · DF (Atendimento Brasil)</span>
          </div>
        </div>

        {/* 3 Cartões de Canais de Contato */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* 1. WhatsApp */}
          <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 hover:border-[#10B981]/50 hover:bg-[#161a22] transition-all flex flex-col justify-between group shadow-xl backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#B7F36B] font-semibold border border-[#10B981]/30">
                  CANAL PRIORITÁRIO
                </span>
                <span className="text-[#969DA8]">RESPOSTA RÁPIDA</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 text-[#B7F36B] flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-black transition-colors shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#F5F6F8]">
                    WhatsApp Direto
                  </h3>
                  <p className="font-mono text-xs text-[#969DA8] mt-0.5">
                    {brand.contact.whatsappDisplay || "(61) 98139-9051"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                Envie uma mensagem para tirar dúvidas, agendar um diagnóstico de 30 minutos ou discutir viabilidade técnica.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2440FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25 active:scale-95"
              >
                <span>Iniciar conversa no WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 2. E-mail */}
          <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 hover:border-[#78A9FF]/50 hover:bg-[#161a22] transition-all flex flex-col justify-between group shadow-xl backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/20 text-[#78A9FF] font-semibold border border-[#2440FF]/30">
                  PROPOSTAS & ESCOPOS
                </span>
                <span className="text-[#969DA8]">CORPORATIVO</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 text-[#78A9FF] flex items-center justify-center group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#F5F6F8]">
                    E-mail Direto
                  </h3>
                  <p className="font-mono text-xs text-[#969DA8] mt-0.5 truncate max-w-[190px]">
                    {brand.contact.email}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                Envie documentos de processos, planilhas de exemplo ou solicitações formais de proposta comercial.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2">
              <a
                href={`mailto:${brand.contact.email}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#2440FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25 active:scale-95"
              >
                <span>Enviar E-mail</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="p-3 rounded-full border border-white/15 bg-white/[0.04] text-[#F5F6F8] hover:bg-white/[0.08] hover:border-[#78A9FF] transition-colors"
                title="Copiar endereço de e-mail"
                aria-label="Copiar e-mail"
              >
                {copied ? <Check className="h-4 w-4 text-[#B7F36B]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 3. LinkedIn */}
          <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 hover:border-[#78A9FF]/50 hover:bg-[#161a22] transition-all flex flex-col justify-between group shadow-xl backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#78A9FF]/20 text-[#78A9FF] font-semibold border border-[#78A9FF]/30">
                  NETWORKING
                </span>
                <span className="text-[#969DA8]">LIDERANÇA</span>
              </div>

              <div className="mt-6 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 text-[#78A9FF] flex items-center justify-center group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#F5F6F8]">
                    LinkedIn
                  </h3>
                  <p className="font-mono text-xs text-[#969DA8] mt-0.5">
                    Pedro Henrique Sanches Leal
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                Conecte-se para acompanhar atualizações de arquitetura de software, automação de operações e inteligência B2B.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <a
                href={brand.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/15 text-white text-xs font-mono uppercase tracking-wider hover:bg-[#2440FF] hover:border-[#2440FF] transition-all shadow-sm active:scale-95"
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
