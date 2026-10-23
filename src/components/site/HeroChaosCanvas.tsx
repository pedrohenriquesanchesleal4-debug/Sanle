"use client";

import { useEffect, useRef, useState } from "react";

interface DocumentChip {
  id: number;
  label: string;
  ext: "PDF" | "XLS" | "DOC" | "CSV" | "MSG" | "TASK";
  chaosX: number;
  chaosY: number;
  chaosRot: number;
  chaosAlpha: number;
  gridX: number;
  gridY: number;
  color: string;
}

const EXT_COLORS: Record<DocumentChip["ext"], string> = {
  PDF: "#FF5B1F",
  XLS: "#10B981",
  DOC: "#3B82F6",
  CSV: "#F59E0B",
  MSG: "#8B5CF6",
  TASK: "#EC4899"
};

const SAMPLE_NAMES = [
  { name: "nota_fiscal_4091.pdf", ext: "PDF" as const },
  { name: "extrato_set2026.csv", ext: "CSV" as const },
  { name: "contrato_prestador.docx", ext: "DOC" as const },
  { name: "conciliacao_banco.xlsx", ext: "XLS" as const },
  { name: "guia_darf_recolh.pdf", ext: "PDF" as const },
  { name: "mensagem_fornecedor.msg", ext: "MSG" as const },
  { name: "aprovacao_gestor.task", ext: "TASK" as const },
  { name: "relatorio_bpo_mensal.xlsx", ext: "XLS" as const },
  { name: "recibo_folha_pgto.pdf", ext: "PDF" as const },
  { name: "faturamento_bruto.csv", ext: "CSV" as const },
  { name: "pedido_orcamento.docx", ext: "DOC" as const },
  { name: "alerta_discrepancia.task", ext: "TASK" as const },
  { name: "comprovante_pix.pdf", ext: "PDF" as const },
  { name: "balancete_q3.xlsx", ext: "XLS" as const },
  { name: "aditivo_contratual.docx", ext: "DOC" as const },
  { name: "importacao_xml.csv", ext: "CSV" as const },
  { name: "solicitacao_cliente.msg", ext: "MSG" as const },
  { name: "verificacao_cnpj.task", ext: "TASK" as const },
  { name: "danfe_mercadoria.pdf", ext: "PDF" as const },
  { name: "tabela_precos_2026.xlsx", ext: "XLS" as const },
  { name: "declaracao_ir.pdf", ext: "PDF" as const },
  { name: "ajuste_lancamento.csv", ext: "CSV" as const },
  { name: "checklist_admissao.docx", ext: "DOC" as const },
  { name: "revisao_auditoria.task", ext: "TASK" as const }
];

export function HeroChaosCanvas({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detecção honesta de capacidade de dispositivo
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowCores = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 4) < 4;

    if (prefersReduced || lowCores) {
      setIsLowPower(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const chips: DocumentChip[] = [];
    const count = 42;

    const setupDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 620;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    setupDimensions();
    window.addEventListener("resize", setupDimensions);

    // Calcular posições: Caos vs Grid
    const cols = width > 900 ? 6 : width > 600 ? 4 : 3;
    const rows = Math.ceil(count / cols);
    const cellW = width / (cols + 0.5);
    const cellH = height / (rows + 1);

    for (let i = 0; i < count; i++) {
      const sample = SAMPLE_NAMES[i % SAMPLE_NAMES.length]!;
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Posição de Caos (dispersa com rotações)
      const chaosX = Math.random() * (width - 140) + 20;
      const chaosY = Math.random() * (height - 80) + 20;
      const chaosRot = (Math.random() - 0.5) * 0.45; // radianos (~ -13 a +13 deg)
      const chaosAlpha = 0.4 + Math.random() * 0.5;

      // Posição na Grade Alinhada (Ordem)
      const gridX = cellW * 0.5 + col * cellW;
      const gridY = cellH * 0.8 + row * cellH;

      chips.push({
        id: i,
        label: sample.name,
        ext: sample.ext,
        chaosX,
        chaosY,
        chaosRot,
        chaosAlpha,
        gridX,
        gridY,
        color: EXT_COLORS[sample.ext] ?? "#FF5B1F"
      });
    }

    let mouseHoverT = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseHoverT = Math.min(1, mouseHoverT + 0.15);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // Render loop
    let currentT = 0;

    const render = () => {
      // Interpolação de transição: Caos (0) para Ordem (1)
      const targetT = Math.max(Math.min(scrollProgress * 2.2, 1), mouseHoverT);
      currentT += (targetT - currentT) * 0.08;

      ctx.clearRect(0, 0, width, height);

      chips.forEach((c) => {
        // Posição interpolada
        const curX = c.chaosX + (c.gridX - c.chaosX) * currentT;
        const curY = c.chaosY + (c.gridY - c.chaosY) * currentT;
        const curRot = c.chaosRot * (1 - currentT);
        const curAlpha = c.chaosAlpha + (0.95 - c.chaosAlpha) * currentT;

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(curRot);

        // Caixa do chip (Card)
        const chipW = width > 768 ? 165 : 125;
        const chipH = 34;
        const r = 3;

        // Fundo
        ctx.fillStyle = currentT > 0.5 ? "rgba(22, 22, 20, 0.95)" : "rgba(20, 20, 18, 0.75)";
        ctx.beginPath();
        ctx.roundRect(-chipW / 2, -chipH / 2, chipW, chipH, r);
        ctx.fill();

        // Borda
        ctx.strokeStyle =
          currentT > 0.7
            ? "rgba(16, 185, 129, 0.5)" // Verde ordem
            : currentT > 0.3
            ? "rgba(255, 91, 31, 0.4)" // Laranja transição
            : "rgba(242, 238, 230, 0.12)"; // Caos sutil
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tag da extensão (badge)
        const badgeW = 28;
        ctx.fillStyle = c.color;
        ctx.globalAlpha = curAlpha;
        ctx.beginPath();
        ctx.roundRect(-chipW / 2 + 5, -11, badgeW, 22, 2);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.ext, -chipW / 2 + 19, 0);

        // Nome do arquivo
        ctx.fillStyle = "#F2EEE6";
        ctx.font = width > 768 ? "10px monospace" : "9px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const textMax = chipW - 48;
        let displayName = c.label;
        if (ctx.measureText(displayName).width > textMax) {
          displayName = displayName.substring(0, 14) + "…";
        }
        ctx.fillText(displayName, -chipW / 2 + 38, 0);

        // Checkmark quando ordenado
        if (currentT > 0.6) {
          const checkAlpha = Math.min(1, (currentT - 0.6) / 0.4);
          ctx.fillStyle = `rgba(16, 185, 129, ${checkAlpha})`;
          ctx.beginPath();
          ctx.arc(chipW / 2 - 12, 0, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#0A0A09";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(chipW / 2 - 14, 0);
          ctx.lineTo(chipW / 2 - 12, 2);
          ctx.lineTo(chipW / 2 - 9, -2);
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", setupDimensions);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [scrollProgress]);

  if (isLowPower) {
    // Fallback estático e elegante para aparelhos mais fracos / reduced-motion
    return (
      <div
        className="w-full h-full min-h-[460px] flex items-center justify-center p-6"
        aria-label="Representação organizada de documentos e dados operacionais"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-3xl">
          {SAMPLE_NAMES.slice(0, 12).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded bg-[#161614] border border-[rgba(242,238,230,0.12)] text-[0.7rem] font-mono text-[#F2EEE6]"
            >
              <span
                className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold text-white"
                style={{ backgroundColor: EXT_COLORS[item.ext] }}
              >
                {item.ext}
              </span>
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[500px] md:min-h-[580px] pointer-events-auto cursor-crosshair select-none"
      aria-label="Visual interativo: documentos dispersos organizando-se em fluxo ordenado"
    />
  );
}
