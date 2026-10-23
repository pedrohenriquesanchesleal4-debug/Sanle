"use client";

import Link from "next/link";
import {
  Compass,
  Sparkles,
  MessageSquare,
  Globe,
  Columns3,
  Bell,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { ProceduralFilm } from "@/components/storytelling/ProceduralFilms";

/**
 * SALES HUNTER — FeatureNarrative (Seção 12)
 * Apresenta os 6 recursos fundamentais de maneira editorial assimétrica
 * (nunca uma grade repetitiva de 6 cards iguais), alternando fotografia comercial,
 * filmes procedurais, interfaces reais e composições de diferentes proporções:
 * 1. Encontrar empresas
 * 2. Identificar oportunidades
 * 3. Gerar mensagens
 * 4. Criar demonstrações
 * 5. Gerenciar o CRM
 * 6. Acompanhar follow-ups
 */
export function FeatureNarrative() {
  return (
    <section
      id="recursos"
      className="relative border-t border-[#F5F6F8]/8 bg-[#08090C] py-24 md:py-32"
    >
      <div className="shell space-y-28">
        {/* Cabeçalho editorial da seção */}
        <div className="grid items-end gap-8 border-b border-[#F5F6F8]/10 pb-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-[#78A9FF]">ARQUITETURA COMERCIAL COMPLETA</p>
            <h2 className="mt-3 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]">
              Seis movimentos integrados entre o território e o fechamento.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[#969DA8]">
              O Sales Hunter substitui planilhas desconectadas por uma sequência contínua de descoberta, qualificação, abordagem, demonstração e gestão de funil.
            </p>
          </div>
        </div>

        {/* BLOCO EDITORIAL 01 & 02 — Encontrar Empresas + Identificar Oportunidades (Proporção 7:5 com fotografia real + filme procedural) */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* 01. Encontrar empresas — Grande painel com fotografia editorial de negócio real */}
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#111318] lg:col-span-7">
            <div className="relative h-64 w-full overflow-hidden sm:h-80">
              <img
                src="/media/businesses/glazier-workshop.jpg"
                alt="Oficina de vidraçaria e arquitetura em vidro representando negócios locais reais"
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/35 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#F5F6F8]/15 bg-[#08090C]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF] backdrop-blur-md">
                <Compass className="h-3.5 w-3.5" />
                <span>01 · ENCONTRAR EMPRESAS</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-[#F5F6F8] md:text-3xl">
                Localize negócios reais por nicho, cidade e bairro sem depender de listas frias.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#969DA8] md:text-base">
                Pesquise vidraçarias, oficinas, clínicas, escritórios ou restaurantes diretamente via OpenStreetMap/Overpass gratuito, importe sua base CSV ou conecte o Google Places sob controle estrito de orçamento.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                <span className="rounded-full border border-[#F5F6F8]/10 bg-[#191C22] px-3 py-1">
                  OpenStreetMap Free Default
                </span>
                <span className="rounded-full border border-[#F5F6F8]/10 bg-[#191C22] px-3 py-1">
                  Deduplicação segura
                </span>
                <span className="rounded-full border border-[#F5F6F8]/10 bg-[#191C22] px-3 py-1">
                  Importação CSV
                </span>
              </div>
            </div>
          </article>

          {/* 02. Identificar oportunidades — Composição vertical com Vídeo 02 (Opportunity Discovery) */}
          <article className="flex flex-col justify-between overflow-hidden rounded-hunter-lg border border-[#B7F36B]/30 bg-[#191C22] lg:col-span-5">
            <div className="relative h-56 w-full border-b border-[#F5F6F8]/8 bg-[#08090C]">
              <ProceduralFilm
                variant="discovery"
                ariaLabel="Filme procedural demonstrando a identificação de uma oportunidade comercial"
              />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#08090C]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B7F36B]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>02 · IDENTIFICAR OPORTUNIDADES</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#F5F6F8]">
                  Score explicável e diagnóstico imediato do que oferecer.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#969DA8]">
                  Cada empresa recebe uma pontuação transparente baseada nos dados consultados (website não identificado, canais de contato, segmento e aderência operacional), destacando onde há oportunidade real.
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-[#F5F6F8]/10 bg-[#111318] p-4">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#969DA8]">FATOR DE PRIORIZAÇÃO</span>
                  <span className="text-[#B7F36B]">+35 PTS</span>
                </div>
                <p className="mt-1 text-xs text-[#F5F6F8]">
                  Presença digital ausente ou incompleta nos dados consultados → Oportunidade de site + captação.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* BLOCO EDITORIAL 03 & 04 — Gerar Mensagens + Criar Demonstrações (Layout Split Horizontal Editorial) */}
        <div className="grid items-center gap-10 rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#111318] p-6 md:p-10 lg:grid-cols-12">
          {/* 03. Gerar mensagens */}
          <div className="space-y-5 lg:col-span-6 lg:border-r lg:border-[#F5F6F8]/10 lg:pr-8">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
              <MessageSquare className="h-4 w-4" />
              <span>03 · GERAR MENSAGENS</span>
            </div>

            <h3 className="font-display text-2xl font-semibold text-[#F5F6F8] md:text-3xl">
              Abordagens sob medida para abrir conversas pelo WhatsApp.
            </h3>

            <p className="text-sm leading-relaxed text-[#969DA8] md:text-base">
              Gere rascunhos de primeiro contato, follow-up, convite de reunião ou proposta adaptados ao contexto da empresa. Nada é disparado no escuro: você revisa, edita e abre o WhatsApp com um clique.
            </p>

            <div className="rounded-xl border border-[#F5F6F8]/10 bg-[#191C22] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7F36B]">
                EXEMPLO DE RASCUNHO CONSULTIVO
              </p>
              <p className="mt-2 text-xs italic leading-relaxed text-[#F5F6F8]">
                “Olá! Vi as avaliações da empresa no Google e preparei uma demonstração rápida de como centralizar os pedidos de orçamento pelo WhatsApp.”
              </p>
            </div>
          </div>

          {/* 04. Criar demonstrações */}
          <div className="space-y-5 lg:col-span-6 lg:pl-2">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B7F36B]">
              <Globe className="h-4 w-4" />
              <span>04 · CRIAR DEMONSTRAÇÕES DE SITES</span>
            </div>

            <h3 className="font-display text-2xl font-semibold text-[#F5F6F8] md:text-3xl">
              Landing pages personalizadas 1-a-1 para cada lead.
            </h3>

            <p className="text-sm leading-relaxed text-[#969DA8] md:text-base">
              Em vez de apenas prometer um serviço, gere um link exclusivo (<code className="font-mono text-[#78A9FF]">/p/nome-da-empresa</code>) com o diagnóstico operacional da empresa prospectada e envie direto no WhatsApp.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#B7F36B]/30 bg-[#191C22] p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
                  DEMONSTRAÇÃO REAL DISPONÍVEL
                </p>
                <p className="mt-1 text-sm font-semibold text-[#F5F6F8]">
                  /p/vidracaria-exemplo
                </p>
              </div>
              <Link
                href="/p/vidracaria-exemplo"
                className="btn btn-ghost !py-2 !px-3.5 text-xs text-[#B7F36B]"
              >
                <span>Ver página demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* BLOCO EDITORIAL 05 & 06 — Gerenciar o CRM + Acompanhar Follow-ups (Proporção 5:7 com Vídeo 03 e Fotografia de Precisão) */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* 05. Gerenciar o CRM */}
          <article className="flex flex-col justify-between overflow-hidden rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#191C22] lg:col-span-5">
            <div className="relative h-56 w-full border-b border-[#F5F6F8]/8 bg-[#08090C]">
              <ProceduralFilm
                variant="transformation"
                ariaLabel="Filme procedural demonstrando cartões de leads avançando pelas etapas do CRM"
              />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#78A9FF]/35 bg-[#08090C]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF]">
                <Columns3 className="h-3.5 w-3.5" />
                <span>05 · GERENCIAR O CRM</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-[#F5F6F8]">
                Pipeline Kanban sincronizado com o banco de dados.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#969DA8]">
                Organize cada negociação desde a identificação até o ganho. Toda mudança de estágio registra automaticamente uma atividade auditável na linha do tempo do lead.
              </p>
            </div>
          </article>

          {/* 06. Acompanhar follow-ups */}
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#111318] lg:col-span-7">
            <div className="relative h-60 w-full overflow-hidden sm:h-72">
              <img
                src="/media/businesses/precision-service.jpg"
                alt="Ambiente técnico organizado representando precisão operacional e acompanhamento comercial"
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/45 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#B7F36B]/35 bg-[#08090C]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B7F36B] backdrop-blur-md">
                <Bell className="h-3.5 w-3.5" />
                <span>06 · ACOMPANHAR FOLLOW-UPS</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-[#F5F6F8] md:text-3xl">
                Nenhuma oportunidade esquecida sem próxima ação.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#969DA8] md:text-base">
                O painel sinaliza automaticamente leads sem próximo passo agendado, lembretes vencidos e possíveis duplicatas — mantendo o ritmo comercial consistente todos os dias.
              </p>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <li className="flex items-center gap-2 text-xs text-[#F5F6F8]">
                  <CheckCircle2 className="h-4 w-4 text-[#B7F36B]" />
                  <span>Alertas de leads sem próxima ação</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-[#F5F6F8]">
                  <CheckCircle2 className="h-4 w-4 text-[#B7F36B]" />
                  <span>Lembretes por data e horário</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
