"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

const STATEMENTS = [
  {
    step: "01",
    eyebrow: "O Diagnóstico Inicial",
    headline: "Todo dia, sua operação perde dezenas de horas em tarefas que nunca deveriam ser manuais.",
    accent: "Tempo drenado silenciosamente.",
    context: "Equipes qualificadas presas em Ctrl+C, conferência de notas fiscais e alimentação de sistemas legados."
  },
  {
    step: "02",
    eyebrow: "O Atrito Oculto",
    headline: "Planilhas duplicadas. Documentos dispersos. Mensagens comerciais perdidas no WhatsApp.",
    accent: "O custo do retrabalho invisível.",
    context: "Cada troca de aba é uma falha potencial de comunicação e uma brecha para perda de receita."
  },
  {
    step: "03",
    eyebrow: "O Teto de Vidro",
    headline: "Esse gargalo não é apenas cansaço da equipe. É o limite invisível do seu faturamento.",
    accent: "Crescer sem automatizar multiplica custos.",
    context: "Para dobrar de tamanho, a empresa não deveria precisar dobrar a burocracia operacional."
  },
  {
    step: "04",
    eyebrow: "A Solução Sanle",
    headline: "A Sanle projeta o fluxo onde a informação corre sem atrito. Do primeiro lead ao financeiro.",
    accent: "Infraestrutura humana & digital integrada.",
    context: "Automação profunda, integração de APIs e agentes de IA que trabalham 24/7 com precisão militar."
  }
];

export function ManifestoScroller() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const pinSection = pinSectionRef.current;
    if (!container || !pinSection) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-manifesto-card]");

    const ctx = gsap.context(() => {
      // Timeline pinned que controla a progressão das declarações
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=3200",
          scrub: 0.8,
          pin: pinSection,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * STATEMENTS.length),
              STATEMENTS.length - 1
            );
            setActiveIndex(index);
          }
        }
      });

      cards.forEach((card, i) => {
        if (i === 0) {
          // O primeiro card começa visível e desaparece quando entra o segundo
          tl.to(card, {
            opacity: 0,
            y: -50,
            scale: 0.96,
            filter: "blur(8px)",
            duration: 1,
            ease: "power2.inOut"
          }, 0.8);
        } else {
          const startTime = i * 1;
          // Entrada suave do card
          tl.fromTo(
            card,
            { opacity: 0, y: 70, scale: 0.97, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power2.out"
            },
            startTime
          );

          // Se não for o último, faz a saída
          if (i < cards.length - 1) {
            tl.to(card, {
              opacity: 0,
              y: -50,
              scale: 0.96,
              filter: "blur(8px)",
              duration: 1,
              ease: "power2.inOut"
            }, startTime + 0.8);
          }
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative bg-paper text-ink selection:bg-cobalt selection:text-white"
      aria-label="Manifesto Operacional Sanle"
    >
      <div
        ref={pinSectionRef}
        className="relative flex h-screen w-full flex-col justify-between overflow-hidden px-6 py-10 md:px-16 md:py-14"
      >
        {/* Luz de fundo atmosférica inspirada em why.zero.university */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-gradient-to-b from-amber/15 via-cobalt/10 to-transparent blur-[160px]"
          aria-hidden="true"
        />

        {/* Top bar com index e badge */}
        <div className="relative z-10 flex items-center justify-between border-b border-black/8 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-mute">
              Manifesto · Sanle Infraestrutura
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-ink-soft">
            <span className="text-cobalt font-semibold">0{activeIndex + 1}</span>
            <span className="text-black/20">/</span>
            <span className="text-ink-mute">04</span>
          </div>
        </div>

        {/* Palco central scrollytelling com cards sobrepostos */}
        <div className="relative z-10 my-auto flex h-full max-h-[580px] w-full max-w-5xl items-center justify-center mx-auto">
          {STATEMENTS.map((item, idx) => (
            <div
              key={item.step}
              data-manifesto-card
              className={`absolute inset-0 flex flex-col justify-center text-center transition-opacity duration-300 ${
                idx === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-cobalt shadow-sm">
                <span>{item.eyebrow}</span>
              </div>

              <h2 className="mt-8 font-display text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[1.08] tracking-tightest text-ink">
                {item.headline}
              </h2>

              <p className="mt-6 text-xl md:text-2xl font-light text-cobalt italic tracking-tight font-display">
                &ldquo;{item.accent}&rdquo;
              </p>

              <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-ink-soft">
                {item.context}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom bar com indicador de progresso e barra magnética */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/8 pt-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-mute">
            Role para avançar na narrativa operacional
          </p>

          <div className="flex items-center gap-2">
            {STATEMENTS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "w-10 bg-cobalt"
                    : "w-2.5 bg-black/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
