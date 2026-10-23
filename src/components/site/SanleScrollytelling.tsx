"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Layers, ShieldCheck, Zap, Sparkles } from "lucide-react";

interface StoryChapter {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  lead: string;
  body: string;
  kpi: string;
  kpiLabel: string;
  tag: string;
  src: string;
  icon: typeof Compass;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "caos",
    chapter: "01",
    kicker: "CAPÍTULO 01 · O DIAGNÓSTICO",
    title: "O Ponto de Partida: O Objeto em Fragmentos",
    lead: "Peças isoladas, rotinas desconectadas e esforço invisível.",
    body: "Toda empresa em crescimento acumula processos manuais que drenam energia: notas fiscais em pastas dispersas, dados redigitados em três planilhas diferentes e cobranças manuais de pendências. As peças estão soltas no espaço, gerando atrito a cada entrega.",
    kpi: "32% do tempo",
    kpiLabel: "Drenado em retrabalho e conferência",
    tag: "Atrito Inicial",
    src: "/images/scrolly/frame-1.jpg",
    icon: Compass
  },
  {
    id: "engenharia",
    chapter: "02",
    kicker: "CAPÍTULO 02 · A ENGENHARIA",
    title: "O Alinhamento dos Eixos Operacionais",
    lead: "Sem exigir que sua empresa troque de sistemas: conectamos o que já existe.",
    body: "A Sanle mapeia onde as informações se perdem e projeta eixos de comunicação direta entre arquivos, ferramentas e pessoas. Os trilhos de latão e os nós articulados entram em movimento, transformando o caos inicial em um fluxo previsível e seguro.",
    kpi: "Zero troca",
    kpiLabel: "De softwares e ferramentas já usadas",
    tag: "Estruturação",
    src: "/images/scrolly/frame-2.jpg",
    icon: Layers
  },
  {
    id: "convergencia",
    chapter: "03",
    kicker: "CAPÍTULO 03 · A CONVERGÊNCIA",
    title: "A Tríade dos Nós: Documentos, Sistemas e Inteligência",
    lead: "O símbolo da Sanle se consolida em perfeito equilíbrio mecânico.",
    body: "Os três nós de safira azul cobalto formam o arco harmônico da Sanle. As regras de negócio são aplicadas automaticamente na entrada dos dados. Divergências e duplicidades são sinalizadas no mesmo instante, encaminhando para análise humana apenas o que realmente exige julgamento.",
    kpi: "14x mais rápido",
    kpiLabel: "Velocidade média de validação",
    tag: "Precisão Ativa",
    src: "/images/scrolly/frame-3.jpg",
    icon: ShieldCheck
  },
  {
    id: "fluxo",
    chapter: "04",
    kicker: "CAPÍTULO 04 · O FLUXO PERMANENTE",
    title: "A Obra Concluída: Serenidade, Clareza e Escala",
    lead: "A operação passa a funcionar de forma contínua, silenciosa e transparente.",
    body: "A escultura atinge seu estado de equilíbrio com luz quente natural e iluminação suave dos nós. A empresa dobra a capacidade de atendimento mantendo a mesma equipe concentrada em clientes e vendas. Os sócios e gestores recuperam a tranquilidade para liderar.",
    kpi: "100% auditável",
    kpiLabel: "Rastreabilidade e governança total",
    tag: "Harmonia Total",
    src: "/images/scrolly/frame-4.jpg",
    icon: Zap
  }
];

export function SanleScrollytelling() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Pré-carregamento dos 4 frames da história
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    CHAPTERS.forEach((ch, idx) => {
      const img = new Image();
      img.src = ch.src;
      img.onload = () => {
        loadedCount += 1;
        loadedImages[idx] = img;
        if (loadedCount === CHAPTERS.length) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback para não quebrar a montagem
        loadedCount += 1;
        if (loadedCount === CHAPTERS.length) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 2. Função de renderização suave do Canvas com blend/crossfade entre frames
  const renderCanvas = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgs = imagesRef.current;
    if (!imgs || imgs.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calcula o frame base e o próximo frame com interpolação contínua
    const totalFrames = CHAPTERS.length;
    const continuousFrame = progress * (totalFrames - 1);
    const baseIndex = Math.min(Math.floor(continuousFrame), totalFrames - 1);
    const nextIndex = Math.min(baseIndex + 1, totalFrames - 1);
    const blendAlpha = continuousFrame - baseIndex;

    const baseImg = imgs[baseIndex];
    const nextImg = imgs[nextIndex];

    ctx.clearRect(0, 0, width, height);

    // Helper para desenhar a imagem mantendo a proporção de cobertura ('cover')
    const drawCover = (img: HTMLImageElement, alpha: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.globalAlpha = alpha;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;

      let drawW = width;
      let drawH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawW = height * imgRatio;
        offsetX = (width - drawW) / 2;
      } else {
        drawH = width / imgRatio;
        offsetY = (height - drawH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    if (baseImg) {
      drawCover(baseImg, 1);
    }
    if (nextImg && blendAlpha > 0 && baseIndex !== nextIndex) {
      drawCover(nextImg, blendAlpha);
    }

    ctx.globalAlpha = 1;
  }, []);

  // 3. Atualização das dimensões do Canvas com suporte a telas HiDPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      renderCanvas(scrollProgress);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderCanvas, scrollProgress]);

  // 4. Listener de Scroll nativo de alto desempenho com requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const totalHeight = container.offsetHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        // Progresso normalizado de 0.00 a 1.00 ao longo do container
        const rawProgress = -rect.top / totalHeight;
        const clamped = Math.max(0, Math.min(1, rawProgress));

        setScrollProgress(clamped);

        const currentChapterIndex = Math.min(
          Math.floor(clamped * CHAPTERS.length),
          CHAPTERS.length - 1
        );
        setActiveChapter(currentChapterIndex);

        if (imagesLoaded) {
          renderCanvas(clamped);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, renderCanvas]);

  // Ação de navegar até um capítulo específico via clique
  const scrollToChapter = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalHeight = container.offsetHeight - window.innerHeight;
    const targetProgress = index / (CHAPTERS.length - 1);
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetScrollY = containerTop + targetProgress * totalHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  const current = CHAPTERS[activeChapter] ?? CHAPTERS[0]!;
  const IconComponent = current.icon;

  return (
    <section
      ref={containerRef}
      id="historia-sanle"
      className="relative bg-[#FAF8F5] text-[#121110] selection:bg-[#2440FF] selection:text-white"
      style={{ minHeight: "380vh" }}
      aria-label="A História da Sanle · Scrollytelling Operacional"
    >
      {/* Estágio Fixado (Sticky Pin) que permanece na tela durante o scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-5 py-6 md:px-12 md:py-8">
        {/* Glow de fundo solar e alabastro muito sutil para conforto visual */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[950px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,rgba(245,158,11,0.03)_40%,transparent_70%)] blur-[140px] z-0"
          aria-hidden="true"
        />

        {/* 1. Header do Scrollytelling com status em tempo real */}
        <div className="relative z-20 flex items-center justify-between border-b border-[rgba(18,17,16,0.08)] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2440FF]/10 text-[#2440FF]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2440FF] font-semibold">
                Scrollytelling Operacional
              </span>
              <span className="hidden sm:inline font-mono text-xs text-[#8A837A] ml-2">
                · A Construção do Fluxo Sanle
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="font-mono text-xs">
              <span className="text-[#2440FF] font-bold">0{activeChapter + 1}</span>
              <span className="text-[#8A837A] mx-1">/</span>
              <span className="text-[#8A837A]">04</span>
              <span className="hidden sm:inline text-[#8A837A] ml-2">
                ({Math.round(scrollProgress * 100)}% concluído)
              </span>
            </div>

            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(18,17,16,0.12)] bg-white/90 px-4 py-1.5 font-mono text-xs text-[#121110] hover:border-[#2440FF] hover:text-[#2440FF] transition-all shadow-sm"
            >
              <span>Mapear meu processo</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#2440FF]" />
            </Link>
          </div>
        </div>

        {/* 2. Palco Central: Visual do Objeto em Canvas + Narrativa Editorial */}
        <div className="relative z-10 my-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Lado Esquerdo: Canvas Cinematográfico Interativo */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden border border-[rgba(18,17,16,0.1)] bg-white shadow-2xl shadow-stone-300/40">
            {/* O Canvas onde os frames passam a cada scrollada */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
              aria-label={`Frame da escultura de processos: ${current.title}`}
            />

            {/* Badge de KPI no Canto Superior Esquerdo */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2.5 rounded-full bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md shadow-md border border-[rgba(18,17,16,0.06)]">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#2440FF]">
                {current.kpi}
              </span>
              <span className="font-mono text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider text-[#4A453E]">
                {current.kpiLabel}
              </span>
            </div>

            {/* Tag de Fase no Canto Superior Direito */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5 rounded-full bg-[#121110]/80 px-3 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-md text-white font-mono text-[0.68rem] uppercase tracking-wider">
              <span>{current.tag}</span>
            </div>

            {/* Microlegenda de interação no rodapé do frame */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 flex items-center justify-between pointer-events-none text-[0.65rem] font-mono text-[#4A453E] bg-white/80 px-3 py-1.5 rounded-md backdrop-blur-sm border border-black/5">
              <span>ESCULTURA CINÉTICA DE PROCESSOS · SANLE</span>
              <span>ROLE PARA AVANÇAR O OBJETO</span>
            </div>
          </div>

          {/* Lado Direito: Narrativa Editorial que evolui no Scroll */}
          <div className="flex flex-col justify-center space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-[#2440FF] font-mono text-xs uppercase tracking-widest font-semibold">
              <IconComponent className="h-4 w-4" />
              <span>{current.kicker}</span>
            </div>

            <h3 className="font-serif-editorial text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.08] text-[#121110] tracking-tight transition-all duration-300">
              {current.title}
            </h3>

            <p className="font-display text-base sm:text-lg text-[#2440FF] font-medium leading-snug">
              {current.lead}
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-[#4A453E] font-sans-editorial">
              {current.body}
            </p>

            {/* Destaque do Capítulo */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121110] text-white font-medium text-xs hover:bg-[#2440FF] transition-all shadow-md shadow-stone-900/10 active:scale-95"
              >
                <span>Mapear meu processo</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-white" />
              </Link>

              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[rgba(18,17,16,0.14)] bg-white text-xs font-medium text-[#121110] hover:border-[#2440FF] transition-colors"
              >
                <span>Ver demonstração em 6 etapas</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Barra de Navegação de Linha do Tempo e Controle de Capítulos */}
        <div className="relative z-20 border-t border-[rgba(18,17,16,0.08)] pt-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2440FF] animate-pulse" />
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[#8A837A]">
                Role para conduzir a transformação · Clique nos capítulos
              </span>
            </div>

            <div className="flex items-center gap-2">
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(idx)}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all duration-300 ${
                      isActive
                        ? "bg-[#2440FF] text-white shadow-md shadow-[#2440FF]/25 scale-105 font-medium"
                        : "bg-white/90 text-[#8A837A] border border-[rgba(18,17,16,0.1)] hover:text-[#121110] hover:border-[#2440FF]/40"
                    }`}
                  >
                    <span className={isActive ? "text-amber-200" : "text-[#8A837A]"}>
                      {ch.chapter}
                    </span>
                    <span className="hidden sm:inline">
                      {ch.id.charAt(0).toUpperCase() + ch.id.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
