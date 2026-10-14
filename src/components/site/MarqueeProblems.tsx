"use client";

const ITEMS = [
  "PROCURAR DOCUMENTOS DISPERSOS",
  "RENOMEAR ARQUIVOS MANUALMENTE",
  "CONFERIR PLANILHAS DUPLICADAS",
  "COPIAR DADOS ENTRE SISTEMAS",
  "COBRAR RESPOSTAS NO WHATSAPP",
  "REPETIR A MESMA TAREFA TODO DIA"
];

export function MarqueeProblems() {
  return (
    <section
      aria-label="Tarefas repetitivas e trabalhos manuais"
      className="relative overflow-hidden bg-[#F4F0E8] py-4 text-[#121110] select-none border-y border-[rgba(18,17,16,0.08)]"
    >
      <div className="flex w-max animate-marquee gap-8 font-mono text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
        {/* Bloco duplicado para loop contínuo */}
        {Array.from({ length: 4 }).map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-8 shrink-0">
            {ITEMS.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-6 cursor-default transition-all duration-200 hover:text-[#2440FF]"
              >
                <span>{item}</span>
                <span className="text-[#2440FF] font-bold">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
