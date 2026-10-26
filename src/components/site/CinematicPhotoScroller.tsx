"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Compass, Layers, ShieldCheck, Zap, Sparkles } from "lucide-react";

type PhotoCard = {
  id: string;
  step: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  src: string;
  icon: typeof Compass;
  stats: { label: string; value: string };
};

const PHOTOS: PhotoCard[] = [
  {
    id: "studio",
    step: "01",
    category: "ARQUITETURA DE OPERAÇÕES",
    title: "O Estúdio de Processos",
    tagline: "Do atrito manual à engenharia de precisão.",
    description:
      "Mapeamos cada ponto de contato, planilha duplicada e gargalo da sua empresa. Transformamos rotinas dispersas em pipelines operacionais auditáveis e escaláveis.",
    src: "/images/studio-light.jpg",
    icon: Compass,
    stats: { label: "Redução de retrabalho", value: "-78%" }
  },
  {
    id: "pipeline",
    step: "02",
    category: "AUTOMAÇÃO & REGRAS DE NEGÓCIO",
    title: "Processamento & Conexão Contínua",
    tagline: "Validação instantânea e sincronização com seu ERP.",
    description:
      "Automatizamos conferência de contratos, conciliação fiscal e qualificação de oportunidades com regras de negócio determinísticas em tempo real.",
    src: "/images/pipeline-light.jpg",
    icon: Layers,
    stats: { label: "Velocidade de processamento", value: "14x" }
  },
  {
    id: "boardroom",
    step: "03",
    category: "GOVERNANÇA EXECUTIVA",
    title: "Clareza da Diretoria",
    tagline: "Decisões orientadas a dados limpos.",
    description:
      "Painéis de controle executivo com rastreabilidade total. Os diretores e sócios passam a enxergar gargalos e custos antes que eles impactem a margem da empresa.",
    src: "/images/meeting-light.jpg",
    icon: ShieldCheck,
    stats: { label: "Tempo poupado por gestor", value: "+18h/mês" }
  },
  {
    id: "flow",
    step: "04",
    category: "ESCALA CONTÍNUA",
    title: "Fluxo Sem Fadiga",
    tagline: "Operação que cresce sem inchar a folha.",
    description:
      "Arquitetura operacional de alta precisão. Sua empresa amplia a capacidade de entrega e atendimento mantendo a equipe focada no que gera receita.",
    src: "/images/kinetic-flow.jpg",
    icon: Zap,
    stats: { label: "Escalabilidade operacional", value: "300%" }
  }
];

export function CinematicPhotoScroller() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const pinStage = pinStageRef.current;
    if (!container || !pinStage) return;

    const slides = gsap.utils.toArray<HTMLElement>("[data-photo-slide]");
    const texts = gsap.utils.toArray<HTMLElement>("[data-photo-text]");

    const ctx = gsap.context(() => {
      // Timeline pinned que avança as fotos conforme o usuário rola a página
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2800",
          pin: pinStage,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * PHOTOS.length),
              PHOTOS.length - 1
            );
            setActiveIndex(index);
          }
        }
      });

      // Animação de transição suave entre as 4 fotografias (crossfade & scale cinematográfico)
      slides.forEach((slide, i) => {
        const text = texts[i];
        if (i > 0) {
          const startTime = (i - 0.5) * 1;
          // Entrada da nova foto e texto correspondente
          tl.fromTo(
            slide,
            { opacity: 0, scale: 1.06, filter: "blur(6px)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power2.out"
            },
            startTime
          );

          if (text) {
            tl.fromTo(
              text,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
              startTime + 0.1
            );
          }
        }

        // Saída se não for o último
        if (i < slides.length - 1) {
          const exitTime = i * 1 + 0.6;
          tl.to(
            slide,
            {
              opacity: 0,
              scale: 0.96,
              filter: "blur(4px)",
              duration: 0.9,
              ease: "power2.inOut"
            },
            exitTime
          );

          if (text) {
            tl.to(
              text,
              { opacity: 0, y: -25, duration: 0.7, ease: "power2.inOut" },
              exitTime
            );
          }
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="galeria-obra"
      ref={containerRef}
      className="relative bg-paper text-ink selection:bg-cobalt selection:text-white"
      aria-label="A Obra Operacional Sanle — Galeria Cinematográfica"
    >
      <div
        ref={pinStageRef}
        className="relative flex h-screen w-full flex-col justify-between overflow-hidden px-6 py-8 md:px-14 md:py-10"
      >
        {/* Glow de fundo solar e cobalto sutil */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-gradient-to-r from-cobalt/8 via-amber/6 to-transparent blur-[160px] z-0"
          aria-hidden="true"
        />

        {/* Top Header da Galeria com status em tempo real */}
        <div className="relative z-10 flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cobalt font-semibold">
                A Obra Operacional
              </span>
              <span className="hidden sm:inline font-mono text-xs text-ink-mute ml-2">
                · Fotografia do Fluxo Concluído
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="font-mono text-xs">
              <span className="text-cobalt font-bold">0{activeIndex + 1}</span>
              <span className="text-black/25 mx-1.5">/</span>
              <span className="text-ink-mute">04</span>
            </div>

            <a
              href="#diagnostico-rapido"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 py-1.5 font-mono text-xs text-ink hover:border-cobalt transition-colors shadow-sm"
            >
              <span>Mapear minha empresa</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-cobalt" />
            </a>
          </div>
        </div>

        {/* =========================================================================
            PALCO CINEMATOGRÁFICO CENTRAL (Cinema Frame estilo Apple & Casa Di Solare)
           ========================================================================= */}
        <div className="relative z-10 my-auto flex h-full max-h-[70vh] w-full max-w-5xl flex-col items-center justify-center mx-auto">
          {/* O Quadro de Cinema 16:9 — Imagens nunca esticam nem bugam */}
          <div className="relative aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-black/12 bg-paper-deep shadow-2xl shadow-black/10">
            {PHOTOS.map((item, idx) => (
              <div
                key={item.id}
                data-photo-slide
                className={`absolute inset-0 transition-opacity duration-300 ${
                  idx === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Imagem de alta fidelidade renderizada com proporções exatas 1376x768 */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  priority={idx === 0}
                  unoptimized
                  sizes="(max-width: 1024px) 95vw, 896px"
                  className="object-cover"
                />

                {/* Sombra de viés cinematográfico para legibilidade perfeita */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Badge Flutuante de KPI no Canto Superior Esquerdo */}
                <div className="absolute top-5 left-5 flex items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 backdrop-blur-md shadow-lg border border-black/5">
                  <span className="font-mono text-sm font-bold text-cobalt">
                    {item.stats.value}
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft">
                    {item.stats.label}
                  </span>
                </div>

                {/* Badge de Fase no Canto Superior Direito */}
                <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 backdrop-blur-md text-white font-mono text-xs">
                  <span>FASE {item.step}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Camada de Texto Editorial Sincronizada com o Slide */}
          <div className="relative mt-6 w-full max-w-4xl min-h-[90px] flex items-center justify-between">
            {PHOTOS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  data-photo-text
                  className={`absolute inset-x-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity duration-300 ${
                    idx === 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 text-cobalt font-mono text-xs uppercase tracking-widest font-semibold">
                      <IconComp className="h-3.5 w-3.5" />
                      <span>{item.category}</span>
                    </div>

                    <h3 className="mt-1 font-display text-2xl md:text-3xl font-medium text-ink tracking-tight">
                      {item.title}
                      <span className="ml-3 text-base md:text-lg font-light text-ink-soft italic font-display">
                        · {item.tagline}
                      </span>
                    </h3>

                    <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>

                  <a
                    href="#calculadora"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-cobalt hover:underline shrink-0"
                  >
                    <span>Calcular impacto desta fase</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BARRA DE NAVEGAÇÃO DE LINHA DO TEMPO (Pills magnéticas interativas)
           ========================================================================= */}
        <div className="relative z-10 border-t border-black/8 pt-4">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-mute">
              Role a página para navegar pelas fases
            </span>

            <div className="flex items-center gap-2">
              {PHOTOS.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all duration-300 ${
                    idx === activeIndex
                      ? "bg-cobalt text-white shadow-md shadow-cobalt/25 scale-105 font-medium"
                      : "bg-white/80 text-ink-mute border border-black/8"
                  }`}
                >
                  <span className={idx === activeIndex ? "text-amber" : "text-ink-mute"}>
                    {item.step}
                  </span>
                  <span className="hidden sm:inline">{item.title.split(" ")[1] || item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
