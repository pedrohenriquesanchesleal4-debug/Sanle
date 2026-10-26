import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Linkedin, ArrowUpRight } from "lucide-react";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Contato Direto — Sales Hunter · Sanle",
  description: "Fale diretamente com Pedro Henrique por WhatsApp, e-mail institucional ou LinkedIn para tirar dúvidas e avaliar sua operação.",
  alternates: { canonical: "/contato" }
};

export default function ContatoPage() {
  const whatsappNumber = brand.contact.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá Pedro, vi o site da Sanle / Sales Hunter e gostaria de conversar sobre prospecção e automação de processos para minha empresa."
  )}`;

  return (
    <div className="shell max-w-4xl py-20 md:py-28">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#059669] font-mono text-xs uppercase tracking-wider font-semibold">
        <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
        <span>CANAIS DIRETOS & ATENDIMENTO</span>
      </div>

      <h1 className="mt-5 font-serif-editorial text-[clamp(2.4rem,5vw,3.8rem)] leading-tight text-[#121110]">
        Fale diretamente com nossa liderança técnica.
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-[#4A453E] font-sans-editorial max-w-2xl">
        Sem intermediários ou respostas genéricas. Entre em contato diretamente com Pedro Henrique Leal
        para discutir automação de processos, integração de sistemas ou prospecção comercial B2B.
      </p>

      {/* Grid de 3 Canais */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {/* WhatsApp */}
        <div className="p-7 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-[#8A837A] mt-4">
              WHATSAPP
            </span>
            <strong className="block text-lg text-[#121110] mt-1">
              {brand.contact.whatsappDisplay || "(61) 98139-9051"}
            </strong>
            <p className="mt-2 text-xs text-[#4A453E] leading-relaxed">
              Atendimento rápido para tirar dúvidas ou agendar uma reunião executiva.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#121110] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#10B981] transition-colors"
          >
            <span>Conversar</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* E-mail */}
        <div className="p-7 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm hover:border-[#2440FF] transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-[#2440FF]/10 text-[#2440FF] flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-[#8A837A] mt-4">
              E-MAIL
            </span>
            <strong className="block text-sm text-[#121110] mt-1 break-all">
              {brand.contact.email}
            </strong>
            <p className="mt-2 text-xs text-[#4A453E] leading-relaxed">
              Envio de documentações, propostas comerciais e especificações técnicas.
            </p>
          </div>
          <a
            href={`mailto:${brand.contact.email}`}
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#121110] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-colors"
          >
            <span>Enviar E-mail</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* LinkedIn */}
        <div className="p-7 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm hover:border-[#0A66C2] transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center">
              <Linkedin className="h-5 w-5" />
            </div>
            <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-[#8A837A] mt-4">
              LINKEDIN
            </span>
            <strong className="block text-base text-[#121110] mt-1">
              Pedro Henrique S. Leal
            </strong>
            <p className="mt-2 text-xs text-[#4A453E] leading-relaxed">
              Conexão profissional e histórico de engenharia de software e produtos.
            </p>
          </div>
          <a
            href={brand.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#121110] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#0A66C2] transition-colors"
          >
            <span>Ver Perfil</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Caixa de Diagnóstico Rápido */}
      <div className="mt-12 p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2440FF] font-semibold">
            FORMULÁRIO EXECUTIVO
          </span>
          <h3 className="mt-1 font-serif-editorial text-2xl text-[#121110]">
            Prefere descrever seu gargalo operacional?
          </h3>
          <p className="mt-1.5 text-sm text-[#4A453E]">
            Preencha 4 perguntas rápidas e receba uma análise de viabilidade e arquitetura em até 24h.
          </p>
        </div>
        <Link
          href="/diagnostico"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-md shrink-0"
        >
          <span>Preencher Diagnóstico</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
