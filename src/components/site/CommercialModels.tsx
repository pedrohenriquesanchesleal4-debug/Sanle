"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Check, 
  Info 
} from "lucide-react";

const CONTRACTING_MODELS = [
  {
    id: "implementacao",
    code: "01",
    name: "Implementação de Solução",
    category: "ESCOPO FECHADO",
    headline: "Do desenho da arquitetura à entrega final em produção.",
    description: "Desenvolvimento completo de sites, sistemas personalizados, integrações ou fluxos automatizados com escopo delimitado, prazos acordados e investimento fixo definido.",
    deliverables: [
      "Mapeamento técnico e arquitetura de solução",
      "Desenvolvimento de código limpo e testável",
      "Homologação em ambiente de testes seguro",
      "Passagem de bastão e treinamento da equipe"
    ],
    idealFor: "Projetos novos, lançamento de sites, MVPs ou substituição de processos manuais críticos."
  },
  {
    id: "evolucao",
    code: "02",
    name: "Evolução Contínua",
    category: "SPRINTS & EXPANSÃO",
    headline: "Seu produto de software evoluindo no ritmo da sua empresa.",
    description: "Ciclos periódicos de engenharia dedicados a novas funcionalidades, refinamento de interfaces, relatórios estratégicos e novas integrações conforme a empresa cresce.",
    deliverables: [
      "Priorização conjunta de demandas com a diretoria",
      "Ciclos de desenvolvimento ágil com entregas quinzenais",
      "Refatoração e garantia de alta escalabilidade",
      "Adaptação a novas rotinas operacionais"
    ],
    idealFor: "Sistemas em crescimento, plataformas corporativas e produtos que exigem evolução permanente."
  },
  {
    id: "suporte",
    code: "03",
    name: "Suporte & Sustentação",
    category: "DISPONIBILIDADE & SLA",
    headline: "Tranquilidade operacional com acompanhamento técnico contínuo.",
    description: "Monitoramento proativo da infraestrutura, correções de bugs, atualização de dependências de segurança e suporte técnico garantido sob Acordo de Nível de Serviço (SLA).",
    deliverables: [
      "Monitoramento proativo de disponibilidade (uptime)",
      "Correção de incidentes técnicos prioritários",
      "Backups automatizados e testes de restauração",
      "Canal de suporte direto com a equipe de engenharia"
    ],
    idealFor: "Operações críticas que não podem sofrer interrupções nem perda de dados."
  },
  {
    id: "operacao-ia",
    code: "04",
    name: "Operação de Agentes & Automações",
    category: "TELEMETRIA & CONSUMO",
    headline: "Gestão de infraestrutura, rotinas em tempo real e orquestração de IA.",
    description: "Operação dos pipelines de integração e assistentes de IA, com auditoria permanente de respostas, telemetria de chamadas, reindexação de bases e custos transparentes.",
    deliverables: [
      "Supervisão contínua da qualidade dos agentes",
      "Curadoria e atualização periódica da base RAG",
      "Telemetria de chamadas de API e taxas de exceção",
      "Gestão de custos de computação e consumo de LLMs"
    ],
    idealFor: "Empresas com agentes de atendimento ativo ou alto volume de processamento documental."
  }
];

export function CommercialModels() {
  return (
    <section
      id="contratacao"
      className="relative scroll-mt-16 py-16 sm:py-20 md:py-24 bg-[#08090C] text-[#F5F6F8] border-b border-white/[0.08] select-none overflow-clip w-full max-w-full"
      aria-label="Modalidades de Contratação e Parceria Técnica da Sanle"
    >
      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#78A9FF] animate-pulse" />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#969DA8] font-medium">
              MODELOS DE ENGAJAMENTO
            </span>
          </div>

          <h2 className="mt-4 font-serif-editorial text-[clamp(2.1rem,4.8vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-[#F5F6F8]">
            Clareza comercial.{" "}
            <span className="italic text-[#78A9FF] font-normal not-italic:font-serif">
              Como podemos trabalhar juntos.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#969DA8] font-sans-editorial leading-relaxed max-w-2xl">
            Estruturamos nossos contratos para alinhar investimento com o momento real da sua empresa: 
            da entrega de um projeto com escopo definido até a sustentação de longo prazo.
          </p>
        </div>

        {/* Grade dos 4 Modelos */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTRACTING_MODELS.map((model) => (
            <div
              key={model.id}
              className="p-6 sm:p-7 rounded-2xl md:rounded-3xl bg-[#111319]/90 border border-white/10 flex flex-col justify-between hover:border-white/25 hover:bg-[#151822] transition-all group shadow-xl backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <span className="font-mono text-xs text-[#78A9FF] font-bold">
                    MODALIDADE [{model.code}]
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#969DA8] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
                    {model.category}
                  </span>
                </div>

                <h3 className="mt-4 font-serif-editorial text-2xl text-white leading-tight">
                  {model.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#969DA8] font-sans-editorial leading-relaxed">
                  {model.description}
                </p>

                {/* Entregáveis */}
                <div className="mt-5 space-y-2 pt-3 border-t border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                    O que está contemplado:
                  </span>
                  {model.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-300">
                      <Check className="h-3.5 w-3.5 text-[#B7F36B] shrink-0 mt-0.5" />
                      <span className="text-[11.5px] leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/10">
                <span className="font-mono text-[10px] text-[#969DA8] block mb-2">
                  <strong className="text-white">Indicado para:</strong> {model.idealFor}
                </span>

                <Link
                  href={`/#contato?modelo=${model.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#78A9FF] group-hover:text-white transition-colors"
                >
                  <span>Solicitar proposta</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Box Transparente de Custos Operacionais e Serviços de Terceiros (Requisito da Seção 12) */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-[#090A0E] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#B7F36B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">
                TRANSPARÊNCIA SOBRE CUSTOS DE INFRAESTRUTURA E CONSUMO DE IA
              </span>
              <p className="text-[#969DA8] leading-relaxed max-w-4xl text-[11px]">
                Não misturamos investimento em engenharia com consumo de nuvem. Serviços de terceiros (hospedagem Vercel/AWS, 
                bancos de dados Supabase, WhatsApp Business API oficial e consumo de tokens de modelos OpenAI/Anthropic) 
                são faturados de forma transparente diretamente pelos provedores ou sob demanda auditada, sem margens ocultas.
              </p>
            </div>
          </div>

          <Link
            href="/#contato"
            className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/15 text-stone-200 hover:text-white hover:border-white/30 transition-colors text-xs shrink-0 whitespace-nowrap"
          >
            Tirar dúvidas de contratação →
          </Link>
        </div>
      </div>
    </section>
  );
}
