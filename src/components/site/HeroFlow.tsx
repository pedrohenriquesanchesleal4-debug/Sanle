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
  doc: "DOC",
  sheet: "XLS",
  task: "TASK",
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
    <div ref={root} className="relative aspect-square w-full max-w-[420px] select-none">
      {/* Régua de fluxo */}
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <path
          data-rail
          d="M60 320 C 110 320, 120 200, 200 200 S 290 80, 340 80"
          fill="none"
          stroke="rgb(var(--cobalt))"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* Chips */}
      <div className="absolute inset-0 grid grid-cols-2 content-center gap-x-6 gap-y-4 px-2">
        {CHIPS.map((chip) => (
          <div
            key={chip.id}
            data-chip
            className="panel flex items-center gap-2.5 px-[0.7rem] py-[0.55rem] will-change-transform"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-ink font-mono text-[0.55rem] font-medium text-paper">
              {KIND_LABEL[chip.kind]}
            </span>
            <span className="truncate font-mono text-[0.68rem] text-ink-soft">{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
