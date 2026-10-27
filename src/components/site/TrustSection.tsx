"use client";

import { Shield, Lock, Cpu, Server, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const TRUST_PILLARS = [
  {
    icon: Shield,
    badge: "CONFORMIDADE",
    title: "Segurança de Dados & LGPD",
    description:
      "Conformidade integral com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Dados comerciais protegidos com isolamento multi-tenant seguro e permissões estritas no banco de dados.",
    highlight: "Criptografia AES-256 em repouso e TLS 1.3 em trânsito"
  },
  {
    icon: Cpu,
    badge: "COMPATIBILIDADE",
    title: "Zero Substituição de Softwares",
    description:
      "Não forçamos sua empresa a migrar de ferramentas. Conectamos WhatsApp, ERPs de mercado (Omie, ContaAzul, TOTVS, Bling) e bancos de dados diretamente via conectores e webhooks.",
    highlight: "Preserva 100% dos softwares que sua equipe já domina"
  },
  {
    icon: Server,
    badge: "INFRAESTRUTURA",
    title: "Alta Disponibilidade & SLA",
    description:
      "Arquitetura serverless e edge distribuída com 99.9% de uptime garantido. Respostas de triagem e cálculo de score executadas em milissegundos sem filas de espera.",
    highlight: "Execução contínua 24/7 com redundância de servidores"
  },
  {
    icon: Lock,
    badge: "GOVERNANÇA",
    title: "Trilha de Auditoria Append-Only",
    description:
      "Cada alteração de status, abordagem gerada, busca de leads ou ação comercial é registrada em livro-razão imutável, permitindo auditoria executiva completa da operação.",
    highlight: "Histórico detalhado com data, autor e parâmetro de cada evento"
  }
];

const COMPLIANCE_TAGS = [
  "LGPD Compatível",
  "PostgreSQL com RLS",
  "Criptografia TLS 1.3 / AES-256",
  "Conexão Oficial WhatsApp",
  "Sem Lock-in de Plataforma",
  "Backups Diários Automatizados"
];

export function TrustSection() {
  return (
    <section
      id="seguranca-governanca"
      className="relative scroll-mt-20 py-12 sm:py-16 md:py-20 bg-[#08090C] text-[#F5F6F8] border-b border-white/10 overflow-hidden w-full max-w-full"
      aria-labelledby="trust-section-title"
    >
      <div className="shell max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2440FF]/20 border border-[#2440FF]/30 text-[#78A9FF] font-mono text-xs uppercase tracking-wider font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>PADRÕES CORPORATIVOS & CONFIANÇA</span>
            </div>
            <h2
              id="trust-section-title"
              className="mt-4 font-serif-editorial text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-[#F5F6F8]"
            >
              Arquitetura sólida feita para empresas sérias.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#969DA8] font-sans-editorial leading-relaxed">
              Elimine o atrito manual e acelere sua prospecção com a segurança de um ecossistema projetado sob
              os mais rigorosos padrões de integridade técnica e governança.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/30 active:scale-95"
            >
              <span>Solicitar Avaliação Técnica</span>
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

        {/* Faixa de Compliance e Segurança */}
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
