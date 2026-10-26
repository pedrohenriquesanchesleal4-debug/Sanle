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
      className="relative scroll-mt-20 py-24 md:py-32 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)]"
      aria-labelledby="trust-section-title"
    >
      <div className="shell max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(18,17,16,0.08)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2440FF]/10 border border-[#2440FF]/15 text-[#2440FF] font-mono text-xs uppercase tracking-wider font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>PADRÕES CORPORATIVOS & CONFIANÇA</span>
            </div>
            <h2
              id="trust-section-title"
              className="mt-4 font-serif-editorial text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-[#121110]"
            >
              Arquitetura sólida feita para empresas sérias.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#4A453E] font-sans-editorial leading-relaxed">
              Elimine o atrito manual e acelere sua prospecção com a segurança de um ecossistema projetado sob
              os mais rigorosos padrões de integridade técnica e governança.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-md active:scale-95"
            >
              <span>Solicitar Avaliação Técnica</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 4 Pilares de Confiança */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] hover:border-[#2440FF]/40 hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(18,17,16,0.06)] font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] text-[#2440FF] font-semibold">
                      {pillar.badge}
                    </span>
                    <span className="text-[#8A837A] font-medium">PADRÃO SANLE</span>
                  </div>

                  <div className="mt-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] flex items-center justify-center text-[#2440FF] group-hover:bg-[#2440FF] group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl text-[#121110] leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#4A453E] leading-relaxed font-sans-editorial">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(18,17,16,0.06)] flex items-center gap-2 text-xs font-mono text-[#2440FF] font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faixa de Compliance e Segurança */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {COMPLIANCE_TAGS.map((tag, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] text-xs font-mono text-[#4A453E]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
