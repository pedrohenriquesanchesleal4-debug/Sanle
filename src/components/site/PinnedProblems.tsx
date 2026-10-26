"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, AlertCircle, ArrowDown } from "lucide-react";
import { invisibleWork } from "@/content/brand";

const IMPACT_METRICS = [
  { tag: "Dreno Semanal", label: "~4h a 8h por colaborador", color: "text-[#2440FF]" },
  { tag: "Falta de Padrão", label: "Arquivos ilegíveis para sistemas", color: "text-[#C8A24A]" },
  { tag: "Risco Fiscal", label: "Divergência notada tardiamente", color: "text-red-600" },
  { tag: "Retrabalho Crítico", label: "Digitação manual em 3 softwares", color: "text-[#2440FF]" },
  { tag: "Gargalo Mensal", label: "Fechamento contábil atrasado", color: "text-red-600" },
  { tag: "Comunicação Fragmentada", label: "Pendências sem dono nem prazo", color: "text-[#C8A24A]" },
  { tag: "Custo Invisível", label: "32% do tempo sem valor agregado", color: "text-[#2440FF]" }
];

export function PinnedProblems() {
  const [activeItem, setActiveItem] = useState(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) {
              setActiveItem(index);
              entry.target.classList.add("is-visible");
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.2
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="problema"
      className="relative bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)] py-10 sm:py-16 md:py-24 select-none"
      aria-label="Os 7 Trabalhos Invisíveis que Drenam a Operação"
    >
      {/* Luz ambiente de fundo */}
      <div
        className="pointer-events-none absolute top-1/4 -left-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.04)_0%,transparent_70%)] blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* Coluna Esquerda Fixada Elegantemente no Desktop (Sticky sem travar scroll) */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(18,17,16,0.08)] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#2440FF]" />
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#4A453E] font-medium">
                O CUSTO INVISÍVEL DA OPERAÇÃO
              </span>
            </div>

            <h2 className="font-serif-editorial text-[clamp(2rem,4vw,3.6rem)] leading-[1.04] tracking-[-0.03em] text-[#121110]">
              Tarefas pequenas que, somadas, custam a operação inteira.
            </h2>

            <p className="text-base sm:text-lg text-[#4A453E] font-sans-editorial leading-relaxed max-w-lg">
              Elas não aparecem no relatório de diretoria nem constam em nenhuma linha de orçamento. 
              Ninguém as mede. Mas consomem até 32% do tempo todos os dias, tornando qualquer crescimento pesado e caro.
            </p>

            {/* Painel de status em tempo real sincronizado com a leitura */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[rgba(18,17,16,0.08)] shadow-sm space-y-3 max-w-lg">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8A837A] uppercase tracking-wider">Gargalo em leitura:</span>
                <span className="text-[#2440FF] font-bold">
                  0{activeItem + 1} / 0{invisibleWork.length}
                </span>
              </div>

              {/* Barra de progresso dos 7 gargalos */}
              <div className="flex gap-1.5 w-full">
                {invisibleWork.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                      i === activeItem
                        ? "bg-[#2440FF] scale-y-125"
                        : i < activeItem
                        ? "bg-[#121110] opacity-40"
                        : "bg-[rgba(18,17,16,0.1)]"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#8A837A] font-mono pt-1">
                Role para baixo para examinar cada um dos 7 gargalos mapeados pela Sanle.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-sm"
              >
                <span>Mapear meus gargalos</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#calculadora"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4A453E] hover:text-[#2440FF] transition-colors"
              >
                <ArrowDown className="h-3.5 w-3.5 text-[#2440FF]" />
                <span>Calcular custo em R$</span>
              </a>
            </div>
          </div>

          {/* Coluna Direita: Os 7 Trabalhos que vão aparecendo suavemente no scroll */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {invisibleWork.map((item, index) => {
              const metric = IMPACT_METRICS[index] ?? {
                tag: "Impacto Operacional",
                label: "Atrito manual frequente",
                color: "text-[#2440FF]"
              };

              const isActive = index === activeItem;

              return (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  data-index={index}
                  className={`group relative p-4 sm:p-6 md:p-7 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? "bg-white border-[#2440FF]/30 shadow-lg shadow-stone-300/30 translate-x-0.5"
                      : "bg-white/70 hover:bg-white border-[rgba(18,17,16,0.08)] shadow-xs"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[rgba(18,17,16,0.06)] pb-2.5">
                    <span className="font-mono text-[0.66rem] sm:text-xs uppercase tracking-[0.18em] text-[#2440FF] font-bold">
                      TRABALHO INVISÍVEL #{index + 1}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[rgba(18,17,16,0.08)] font-mono text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider text-[#4A453E]">
                      <AlertCircle className={`h-3 w-3 ${metric.color}`} />
                      <span>{metric.tag}</span>
                    </span>
                  </div>

                  <div className="pt-3 space-y-1.5">
                    <h3 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-[#121110] tracking-tight group-hover:text-[#2440FF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#4A453E] font-sans-editorial leading-relaxed">
                      {item.note}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-dashed border-[rgba(18,17,16,0.08)] flex items-center justify-between font-mono text-xs">
                    <span className="text-[0.66rem] sm:text-[0.7rem] text-[#8A837A]">Impacto no time:</span>
                    <span className={`font-semibold text-[0.7rem] sm:text-xs ${metric.color}`}>
                      {metric.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
