"use client";

import { Shield, Lock, Cpu, Server, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const TRUST_PILLARS = [
  {
    icon: Shield,
    badge: "PRIVACIDADE & DADOS",
    title: "Cuidado com Dados & Diretrizes LGPD",
    description:
      "Projetamos formulários, bancos de dados e integrações seguindo princípios de minimização de dados, consentimento explícito e controle de acesso por perfil.",
    highlight: "Comunicação em trânsito via HTTPS/TLS e permissões no banco"
  },
  {
    icon: Cpu,
    badge: "COMPATIBILIDADE",
    title: "Integração sem Troca Forçada de ERP",
    description:
      "Não exigimos que sua empresa abandone os sistemas que já funcionam. Conectamos canais de atendimento, planilhas e ERPs de mercado por meio de APIs e webhooks.",
    highlight: "Preserva o investimento nas ferramentas que sua equipe já domina"
  },
  {
    icon: Server,
    badge: "ARQUITETURA MODERNA",
    title: "Infraestrutura Cloud & Código Proprietário",
    description:
      "Utilizamos stacks consolidadas de mercado (Next.js, TypeScript, Node.js e PostgreSQL/Supabase) com ambientes separados de desenvolvimento e produção.",
    highlight: "Sem lock-in oculto: documentação técnica e código organizado"
  },
  {
    icon: Lock,
    badge: "GOVERNANÇA OPERACIONAL",
    title: "Rastreabilidade & Humano no Comando",
    description:
      "Automações e agentes de IA são desenhados com limites claros de atuação, registro estruturado de eventos e encaminhamento para aprovação humana em casos sensíveis.",
    highlight: "Logs operacionais para conferência e acompanhamento gerencial"
  }
];

const COMPLIANCE_TAGS = [
  "Boas Práticas LGPD",
  "PostgreSQL com RLS",
  "Comunicação HTTPS / TLS",
  "Integração via API & Webhooks",
  "Sem Lock-in de Código",
  "Human-in-the-Loop em IA"
];

export function TrustSection() {
  return (
    <section
      id="seguranca-governanca"
      className="relative scroll-mt-20 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="trust-section-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2440FF]/20 border border-[#2440FF]/30 text-[#78A9FF] font-mono text-xs uppercase tracking-wider font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>ARQUITETURA, SEGURANÇA & GOVERNANÇA</span>
            </div>
            <h2
              id="trust-section-title"
              className="mt-4 font-serif-editorial text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-[#F5F6F8]"
            >
              Engenharia responsável para operações que exigem confiança.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#969DA8] font-sans-editorial leading-relaxed">
              Construímos produtos digitais, sistemas e automações com foco em clareza arquitetural, proteção de dados e controle humano sobre regras críticas.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/30 active:scale-95"
            >
              <span>Conversar com a Engenharia</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 4 Pilares de Confiança */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-[#111318]/90 border border-white/10 hover:border-[#78A9FF]/60 hover:bg-[#161a22] transition-all flex flex-col justify-between group shadow-xl backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#2440FF]/20 border border-[#2440FF]/30 text-[#78A9FF] font-semibold">
                      {pillar.badge}
                    </span>
                    <span className="text-[#969DA8] font-medium">PADRÃO SANLE</span>
                  </div>

                  <div className="mt-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#78A9FF] group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl text-[#F5F6F8] leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#969DA8] leading-relaxed font-sans-editorial">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#B7F36B] font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B7F36B]" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faixa de Boas Práticas */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl md:rounded-3xl bg-[#111318]/80 border border-white/10 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {COMPLIANCE_TAGS.map((tag, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-[#F5F6F8]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7F36B]" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
