import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Zap,
  Check
} from "lucide-react";
import {
  getProspectPageBySlug,
  decodeProspectPayload,
  cleanCompanyNameFromSlug
} from "@/lib/db/repo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getNicheTheme } from "@/lib/themes/prospect-theme";
import { ProspectInteractivePrototype } from "@/components/site/ProspectInteractivePrototype";
import { ProspectPageTracker } from "./tracker";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ d?: string; empresa?: string; cidade?: string; nicho?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const prospect = await getProspectPageBySlug(slug);
  const decoded = decodeProspectPayload(sp?.d);
  const empresa =
    prospect?.empresa ||
    decoded?.empresa ||
    (sp?.empresa ? sp.empresa.trim() : "") ||
    cleanCompanyNameFromSlug(slug);

  return {
    title: `Proposta & Protótipo Digital Exclusivo · ${empresa}`,
    description: `Demonstração personalizada de presença digital, sistemas e atendimento inteligente desenvolvida sob medida para a ${empresa}.`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false }
    }
  };
}

export default async function ProspectPersonalizedPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};

  const prospect = await getProspectPageBySlug(slug);
  const decoded = decodeProspectPayload(sp?.d);

  const empresa =
    prospect?.empresa ||
    decoded?.empresa ||
    (sp?.empresa ? sp.empresa.trim() : "") ||
    cleanCompanyNameFromSlug(slug);

  const cidade =
    prospect?.cidade ||
    decoded?.cidade ||
    (sp?.cidade ? sp.cidade.trim() : "") ||
    "Brasília";

  const nicho =
    prospect?.nicho ||
    decoded?.nicho ||
    (sp?.nicho ? sp.nicho.trim() : "") ||
    "sua operação";

  const customOportunidade = prospect?.oportunidade ?? decoded?.oportunidade ?? null;

  // Resolve o tema sob medida do nicho da empresa do lead
  const theme = getNicheTheme(nicho, empresa);

  // Link do WhatsApp pré-formatado para falar sobre a empresa com Pedro Leal
  const whatsUrl = buildWhatsAppLink({
    empresa,
    segmento: theme.categoryName,
    customText: `Olá Pedro! Acessei a proposta e demonstração personalizada da ${empresa} (${theme.categoryName}) em ${cidade} e gostaria de conversar sobre a implementação.`
  });

  // Iniciais da empresa para monograma elegante
  const initials = empresa
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "SP";

  return (
    <article
      className="min-h-screen text-slate-100 transition-colors duration-300 selection:bg-amber-400 selection:text-black overflow-x-hidden"
      style={{
        backgroundColor: theme.palette.bg,
        color: theme.palette.textPrimary
      }}
    >
      <ProspectPageTracker slug={slug} empresa={empresa} nicho={nicho} />

      {/* =====================================================================
          1. BARRA DE IDENTIDADE & BADGE INSTITUCIONAL DO CLIENTE
          ===================================================================== */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors"
        style={{
          backgroundColor: `${theme.palette.bg}E6`,
          borderColor: theme.palette.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-md"
              style={{
                backgroundColor: theme.palette.accent,
                color: theme.palette.buttonText
              }}
            >
              {initials}
            </span>
            <div>
              <span className="font-semibold text-sm sm:text-base leading-tight block" style={{ color: theme.palette.textPrimary }}>
                {empresa}
              </span>
              <span className="text-[11px] font-mono flex items-center gap-1" style={{ color: theme.palette.textSecondary }}>
                <MapPin className="h-3 w-3" />
                <span>{cidade} · {theme.categoryName}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
              style={{
                backgroundColor: theme.palette.badgeBg,
                border: `1px solid ${theme.palette.badgeBorder}`,
                color: theme.palette.badgeText
              }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>PROTÓTIPO PERSONALIZADO SANLE</span>
            </span>

            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Falar com Pedro</span>
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO BESPOKE DA EMPRESA (TEMÁTICA EXCLUSIVA DO NICHO)
          ===================================================================== */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b" style={{ borderColor: theme.palette.border }}>
        {/* Glow temático sutil no fundo */}
        <div
          className="pointer-events-none absolute top-12 left-1/3 h-[500px] w-[500px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: theme.palette.accent }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Coluna Texto da Proposta */}
            <div className="lg:col-span-7">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider mb-5"
                style={{
                  backgroundColor: theme.palette.badgeBg,
                  border: `1px solid ${theme.palette.badgeBorder}`,
                  color: theme.palette.badgeText
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{theme.badgeLabel} · PROPOSTA EXCLUSIVA</span>
              </div>

              <h1
                className="font-serif-editorial text-[clamp(2.4rem,5.2vw,4.5rem)] leading-[1.02] tracking-[-0.03em] font-normal"
                style={{ color: theme.palette.textPrimary }}
              >
                {empresa}:{" "}
                <span className="block mt-1 italic font-light" style={{ color: theme.palette.accentLight }}>
                  uma presença digital à altura do que você entrega em {cidade}.
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl font-sans" style={{ color: theme.palette.textSecondary }}>
                {customOportunidade || theme.tagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#prototipo-interativo"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95"
                  style={{
                    backgroundColor: theme.palette.buttonBg,
                    color: theme.palette.buttonText
                  }}
                >
                  <span>Testar protótipo interativo</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href={whatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-medium transition hover:brightness-125"
                  style={{
                    backgroundColor: theme.palette.surface,
                    borderColor: theme.palette.borderStrong,
                    color: theme.palette.textPrimary
                  }}
                >
                  <MessageCircle className="h-4 w-4" style={{ color: theme.palette.accentLight }} />
                  <span>Conversar sobre a {empresa}</span>
                </a>
              </div>

              {/* Badges de credibilidade técnica */}
              <div className="mt-8 pt-6 border-t flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono" style={{ borderColor: theme.palette.border }}>
                <span className="flex items-center gap-1.5" style={{ color: theme.palette.textSecondary }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: theme.palette.accentLight }} />
                  <span>Sem templates genéricos</span>
                </span>
                <span className="flex items-center gap-1.5" style={{ color: theme.palette.textSecondary }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: theme.palette.accentLight }} />
                  <span>Atendimento no WhatsApp integrado</span>
                </span>
                <span className="flex items-center gap-1.5" style={{ color: theme.palette.textSecondary }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: theme.palette.accentLight }} />
                  <span>No ar em 7 a 14 dias</span>
                </span>
              </div>
            </div>

            {/* Coluna Imagem de Alto Impacto do Nicho */}
            <div className="lg:col-span-5">
              <div
                className="relative rounded-3xl border overflow-hidden shadow-2xl p-2"
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: theme.palette.borderStrong
                }}
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden">
                  <Image
                    src={theme.heroVisual.imageUrl}
                    alt={theme.heroVisual.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider block text-amber-300">
                      DIREÇÃO DE ARTE EXCLUSIVA
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                      {theme.heroVisual.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PROTÓTIPO INTERATIVO EM TEMPO REAL (SIMULAÇÃO DA OPERAÇÃO)
          ===================================================================== */}
      <section
        id="prototipo-interativo"
        className="py-16 md:py-24 border-b scroll-mt-20"
        style={{ borderColor: theme.palette.border }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider mb-3"
              style={{
                backgroundColor: theme.palette.badgeBg,
                border: `1px solid ${theme.palette.badgeBorder}`,
                color: theme.palette.badgeText
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>EXPERIÊNCIA VIVA DO CLIENTE FINAL</span>
            </span>
            <h2
              className="font-serif-editorial text-3xl md:text-4xl font-normal tracking-tight"
              style={{ color: theme.palette.textPrimary }}
            >
              Veja como seu cliente será atendido na prática.
            </h2>
            <p className="mt-3 text-base" style={{ color: theme.palette.textSecondary }}>
              Experimente a ferramenta interativa abaixo. Este módulo é conectado diretamente ao WhatsApp comercial da {empresa}.
            </p>
          </div>

          <ProspectInteractivePrototype
            theme={theme}
            empresa={empresa}
            cidade={cidade}
          />
        </div>
      </section>

      {/* =====================================================================
          4. CATÁLOGO DOS SERVIÇOS & SOLUÇÕES DA EMPRESA DO CLIENTE
          ===================================================================== */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: theme.palette.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mb-12">
            <span
              className="font-mono text-xs uppercase tracking-widest block mb-2"
              style={{ color: theme.palette.accentLight }}
            >
              ESTRUTURA DIGITAL PLANEJADA PARA A {empresa.toUpperCase()}
            </span>
            <h2
              className="font-serif-editorial text-3xl md:text-4xl font-normal tracking-tight"
              style={{ color: theme.palette.textPrimary }}
            >
              Os 3 pilares que transformarão sua presença em {cidade}.
            </h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: theme.palette.textSecondary }}>
              Desenvolvemos uma estrutura completa para que você pare de perder orçamentos e projete a autoridade real do seu trabalho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {theme.services.map((srv, idx) => (
              <div
                key={idx}
                className="rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-xl group"
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: theme.palette.borderStrong
                }}
              >
                <div>
                  {srv.imageUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 border" style={{ borderColor: theme.palette.border }}>
                      <Image
                        src={srv.imageUrl}
                        alt={srv.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <span
                    className="font-mono text-[11px] uppercase tracking-wider block mb-2"
                    style={{ color: theme.palette.accentLight }}
                  >
                    PILAR 0{idx + 1}
                  </span>

                  <h3
                    className="text-xl font-semibold leading-snug"
                    style={{ color: theme.palette.textPrimary }}
                  >
                    {srv.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.palette.textSecondary }}>
                    {srv.desc}
                  </p>
                </div>

                <div
                  className="mt-6 pt-4 border-t flex items-start gap-2 text-xs font-medium"
                  style={{
                    borderColor: theme.palette.border,
                    color: theme.palette.accentLight
                  }}
                >
                  <Check className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{srv.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TRANSFORMAÇÃO OPERACIONAL (ANTES VS. DEPOIS)
          ===================================================================== */}
      <section
        className="py-16 md:py-24 border-b"
        style={{
          backgroundColor: theme.palette.bgSubtle,
          borderColor: theme.palette.border
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span
              className="font-mono text-xs uppercase tracking-widest block mb-2"
              style={{ color: theme.palette.accentLight }}
            >
              COMPARATIVO DE EFICIÊNCIA
            </span>
            <h2
              className="font-serif-editorial text-3xl md:text-4xl font-normal"
              style={{ color: theme.palette.textPrimary }}
            >
              O impacto direto na rotina da {empresa}.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Antes: Gargalos do Modelo Atual */}
            <div
              className="rounded-3xl border p-6 md:p-8 flex flex-col justify-between"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: "rgba(239, 68, 68, 0.25)"
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-semibold">
                    CENÁRIO MANUAL TRADICIONAL
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">
                  {theme.transformation.beforeTitle}
                </h3>
                <ul className="space-y-3.5">
                  {theme.transformation.beforeItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-red-500/20 text-xs text-red-300 font-mono">
                Resultado: Orçamentos perdidos e sobrecarga da equipe.
              </div>
            </div>

            {/* Depois: Solução de Engenharia Sanle */}
            <div
              className="rounded-3xl border p-6 md:p-8 flex flex-col justify-between shadow-xl"
              style={{
                backgroundColor: theme.palette.surfaceElevated,
                borderColor: theme.palette.accent
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: theme.palette.accentLight }}>
                    ENGENHARIA DIGITAL SANLE
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: theme.palette.textPrimary }}>
                  {theme.transformation.afterTitle}
                </h3>
                <ul className="space-y-3.5">
                  {theme.transformation.afterItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: theme.palette.textSecondary }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.palette.accentLight }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="mt-6 pt-4 border-t text-xs font-mono font-semibold"
                style={{
                  borderColor: theme.palette.border,
                  color: theme.palette.accentLight
                }}
              >
                Resultado: Mais orçamentos fechados com menos tempo gasto.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CRONOGRAMA DE IMPLEMENTAÇÃO (7 A 14 DIAS)
          ===================================================================== */}
      <section className="py-16 md:py-20 border-b" style={{ borderColor: theme.palette.border }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="font-mono text-xs uppercase tracking-widest block mb-2"
              style={{ color: theme.palette.accentLight }}
            >
              PREVISIBILIDADE E RAPIDEZ
            </span>
            <h2
              className="font-serif-editorial text-3xl md:text-4xl font-normal"
              style={{ color: theme.palette.textPrimary }}
            >
              Como colocamos seu projeto no ar em até 14 dias:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {theme.roadmap.map((step, idx) => (
              <div
                key={idx}
                className="rounded-3xl border p-6 flex flex-col justify-between"
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: theme.palette.borderStrong
                }}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.palette.border }}>
                    <span className="font-mono text-xs font-bold" style={{ color: theme.palette.accentLight }}>
                      ETAPA {step.step}
                    </span>
                    <span className="font-mono text-xs" style={{ color: theme.palette.textMuted }}>
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mt-4" style={{ color: theme.palette.textPrimary }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.palette.textSecondary }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. CTA FINAL EXCLUSIVO (DIRECIONADO A PEDRO LEAL)
          ===================================================================== */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider mb-6"
            style={{
              backgroundColor: theme.palette.badgeBg,
              border: `1px solid ${theme.palette.badgeBorder}`,
              color: theme.palette.badgeText
            }}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ENGENHARIA DE SOFTWARE & PRESENÇA DIGITAL SOB MEDIDA</span>
          </div>

          <h2
            className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-normal leading-tight"
            style={{ color: theme.palette.textPrimary }}
          >
            Vamos colocar a nova experiência da {empresa} em produção?
          </h2>

          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: theme.palette.textSecondary }}>
            Esta demonstração foi preparada especialmente para apresentar as oportunidades reais mapeadas para a sua empresa em {cidade}.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-2xl active:scale-95"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Falar diretamente com Pedro no WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border px-6 py-4 text-sm font-medium transition hover:brightness-125"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.borderStrong,
                color: theme.palette.textPrimary
              }}
            >
              <span>Conhecer a Sanle</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 font-mono text-xs" style={{ color: theme.palette.textMuted }}>
            Sanle · Engenharia de Software, Sistemas & Agentes de IA · Brasília / DF
          </div>
        </div>
      </section>
    </article>
  );
}
