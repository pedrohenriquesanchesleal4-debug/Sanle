"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Animação-assinatura da Sanle: fragmentos de trabalho manual (documentos,
 * planilhas, tarefas) que se organizam num fluxo ordenado.
 * Respeita prefers-reduced-motion: sem movimento, o estado final já é o organizado.
 */
type Chip = { id: string; label: string; kind: "doc" | "sheet" | "task" | "mail" };

const CHIPS: Chip[] = [
  { id: "c1", label: "nota_fiscal.pdf", kind: "doc" },
  { id: "c2", label: "comprovante_0321", kind: "doc" },
  { id: "c3", label: "planilha_contas.xlsx", kind: "sheet" },
  { id: "c4", label: "conferir duplicidade", kind: "task" },
  { id: "c5", label: "cobrar retorno", kind: "task" },
  { id: "c6", label: "contrato_v2_final.pdf", kind: "doc" },
  { id: "c7", label: "pedido_orcamento", kind: "mail" },
  { id: "c8", label: "extrato_2026_09.csv", kind: "sheet" }
];

// Posições iniciais espalhadas (caos) e finais alinhadas (fluxo).
const SCATTER = [
  { x: -120, y: -60, r: -8 },
  { x: 90, y: -80, r: 6 },
  { x: -60, y: 40, r: 4 },
  { x: 140, y: 20, r: -5 },
  { x: -150, y: 80, r: 7 },
  { x: 40, y: 90, r: -3 },
  { x: 160, y: -30, r: 5 },
  { x: -20, y: -110, r: 2 }
];

const KIND_LABEL: Record<Chip["kind"], string> = {
  doc: "PDF",
  sheet: "XLS",
  task: "FLUXO",
  mail: "MSG"
};

export function HeroFlow() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chips = el.querySelectorAll<HTMLElement>("[data-chip]");
    const rail = el.querySelector<SVGPathElement>("[data-rail]");

    // Estado final (organizado) — aplicado já no reduced motion.
    const finalize = () => {
      chips.forEach((c) => {
        c.style.transform = "translate(0px, 0px) rotate(0deg)";
        c.style.opacity = "1";
      });
      if (rail) rail.style.strokeDashoffset = "0";
    };

    if (reduce) {
      finalize();
      return;
    }

    const ctx = gsap.context(() => {
      chips.forEach((c, i) => {
        const s = SCATTER[i] ?? { x: 0, y: 0, r: 0 };
        gsap.set(c, { x: s.x, y: s.y, rotate: s.r, opacity: 0 });
      });

      if (rail) {
        const len = rail.getTotalLength();
        gsap.set(rail, { strokeDasharray: len, strokeDashoffset: len });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
      tl.to(chips, { opacity: 1, duration: 0.5, stagger: 0.04 })
        .to(chips, { x: 0, y: 0, rotate: 0, duration: 1.05, stagger: 0.05 }, 0.15);
      if (rail) tl.to(rail, { strokeDashoffset: 0, duration: 1.1 }, 0.35);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative aspect-square w-full max-w-[440px] select-none p-4 rounded-3xl border border-black/10 bg-white/85 backdrop-blur-2xl shadow-2xl shadow-black/5">
      {/* Moldura de janela arquitetural */}
      <div className="absolute top-4 left-5 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-rust/60" />
        <span className="h-2 w-2 rounded-full bg-amber/60" />
        <span className="h-2 w-2 rounded-full bg-cobalt/60" />
        <span className="ml-2 font-mono text-[0.62rem] uppercase tracking-widest text-ink-mute">
          Pipeline de Organização
        </span>
      </div>

      {/* Régua de fluxo luminosa */}
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full pointer-events-none">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2440FF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          data-rail
          d="M60 320 C 110 320, 120 200, 200 200 S 290 80, 340 80"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Chips */}
      <div className="absolute inset-0 grid grid-cols-2 content-center gap-x-4 gap-y-3.5 px-6 pt-6">
        {CHIPS.map((chip) => (
          <div
            key={chip.id}
            data-chip
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-black/8 bg-white shadow-sm will-change-transform hover:border-cobalt/40 transition-colors"
          >
            <span className="grid h-5 w-6 place-items-center rounded-md border border-cobalt/20 bg-cobalt/5 font-mono text-[0.55rem] font-bold text-cobalt">
              {KIND_LABEL[chip.kind]}
            </span>
            <span className="truncate font-mono text-[0.68rem] text-ink">{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
