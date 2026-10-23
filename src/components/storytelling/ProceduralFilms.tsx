"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/reduced-motion";

export type FilmVariant = "opening" | "discovery" | "transformation";

interface ProceduralFilmProps {
  variant: FilmVariant;
  className?: string;
  ariaLabel?: string;
}

/**
 * SALES HUNTER — Filmes Procedurais em Tempo Real (Seção 9)
 * Implementa as 3 peças de motion design em loop contínuo (6–10s) sem arquivos .mp4
 * falsos e sem serviços externos pagos, usando Canvas 2D HiDPI acelerado e
 * pausando automaticamente fora da viewport ou com prefers-reduced-motion.
 */
export function ProceduralFilm({ variant, className = "", ariaLabel }: ProceduralFilmProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    const startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Nós determinísticos para evitar flicker entre frames
    const nodes = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 0.12 + ((i * 37) % 100) / 260;
      return {
        nx: 0.5 + Math.cos(angle) * radius * 1.15,
        ny: 0.5 + Math.sin(angle) * radius * 0.72,
        depth: 0.4 + ((i * 19) % 60) / 100,
        isPriority: i === 7 || i === 19
      };
    });

    const renderFrame = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (w > 0 && h > 0) {
        // Duração do loop: 8 segundos com retorno suave ao frame 0 (sinusoidal / cíclico)
        const loopDuration = variant === "opening" ? 8000 : 7000;
        const rawT = reducedMotion ? 0.55 : ((now - startTime) % loopDuration) / loopDuration;
        // Curva cíclica suave (0 -> 1 -> 0) para loop sem corte abrupto
        const cycle = 0.5 - 0.5 * Math.cos(rawT * Math.PI * 2);

        ctx.clearRect(0, 0, w, h);

        // Fundo profundo #08090C com iluminação atmosférica sutil
        ctx.fillStyle = "#08090C";
        ctx.fillRect(0, 0, w, h);

        const grad = ctx.createRadialGradient(
          w * 0.5,
          h * 0.5,
          10,
          w * 0.5,
          h * 0.5,
          Math.max(w, h) * 0.6
        );
        grad.addColorStop(0, variant === "opening" ? "rgba(120, 169, 255, 0.09)" : "rgba(183, 243, 107, 0.08)");
        grad.addColorStop(0.55, "rgba(17, 19, 24, 0.45)");
        grad.addColorStop(1, "rgba(8, 9, 12, 1)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        if (variant === "opening") {
          // VÍDEO 01 — OPENING FILM: ponto central -> feixes espaciais -> coordenadas
          const cx = w * 0.5;
          const cy = h * 0.5;

          // Linhas horizontais e coordenadas que atravessam o espaço
          ctx.strokeStyle = `rgba(120, 169, 255, ${0.08 + cycle * 0.18})`;
          ctx.lineWidth = 1;
          const span = w * (0.15 + cycle * 0.38);
          ctx.beginPath();
          ctx.moveTo(cx - span, cy);
          ctx.lineTo(cx + span, cy);
          ctx.stroke();

          // Conexões delicadas emergindo do centro
          nodes.forEach((n, idx) => {
            const reach = Math.max(0, Math.min(1, (cycle - (idx % 6) * 0.08) * 1.6));
            if (reach <= 0.02) return;
            const px = cx + (n.nx * w - cx) * reach;
            const py = cy + (n.ny * h - cy) * reach;

            ctx.strokeStyle = n.isPriority
              ? `rgba(183, 243, 107, ${0.22 * reach})`
              : `rgba(120, 169, 255, ${0.14 * reach * n.depth})`;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, py);
            ctx.stroke();

            ctx.fillStyle = n.isPriority
              ? `rgba(183, 243, 107, ${0.85 * reach})`
              : `rgba(245, 246, 248, ${0.45 * reach * n.depth})`;
            ctx.beginPath();
            ctx.arc(px, py, n.isPriority ? 3.2 : 1.8 * n.depth, 0, Math.PI * 2);
            ctx.fill();
          });

          // Halo óptico central
          const haloRadius = 14 + cycle * 38;
          ctx.strokeStyle = `rgba(183, 243, 107, ${0.35 - cycle * 0.2})`;
          ctx.beginPath();
          ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#B7F36B";
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === "discovery") {
          // VÍDEO 02 — OPPORTUNITY DISCOVERY: rede de empresas -> foco seletivo -> oportunidade isolada
          const targetNode = nodes[7]!;
          const tx = targetNode.nx * w;
          const ty = targetNode.ny * h;

          // Desenha malha territorial secundária
          for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i]!;
            const b = nodes[(i + 3) % nodes.length]!;
            const dimFactor = 1 - cycle * 0.65;
            ctx.strokeStyle = `rgba(120, 169, 255, ${0.16 * dimFactor})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.nx * w, a.ny * h);
            ctx.lineTo(b.nx * w, b.ny * h);
            ctx.stroke();

            ctx.fillStyle = `rgba(150, 157, 168, ${0.42 * dimFactor})`;
            ctx.beginPath();
            ctx.arc(a.nx * w, a.ny * h, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Linha de isolamento conectando o nó prioritário ao quadro de oportunidade
          const cardX = w * 0.68;
          const cardY = h * 0.42;
          ctx.strokeStyle = `rgba(183, 243, 107, ${0.35 + cycle * 0.55})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + (cardX - tx) * cycle, ty + (cardY - ty) * cycle);
          ctx.stroke();

          // Ponto prioritário em destaque #B7F36B
          ctx.fillStyle = "#B7F36B";
          ctx.beginPath();
          ctx.arc(tx, ty, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(183, 243, 107, ${0.5 * cycle})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 18 + cycle * 12, 0, Math.PI * 2);
          ctx.stroke();

          // Representação geométrica abstrata da oportunidade isolada
          if (cycle > 0.2) {
            const alpha = Math.min(1, (cycle - 0.2) * 1.4);
            ctx.fillStyle = `rgba(25, 28, 34, ${0.88 * alpha})`;
            ctx.strokeStyle = `rgba(183, 243, 107, ${0.55 * alpha})`;
            ctx.lineWidth = 1.2;
            const bw = Math.min(190, w * 0.26);
            const bh = 74;
            ctx.beginPath();
            ctx.roundRect(cardX - bw * 0.5, cardY - bh * 0.5, bw, bh, 10);
            ctx.fill();
            ctx.stroke();

            // Barras de sinal internas (sem texto falso)
            ctx.fillStyle = `rgba(183, 243, 107, ${0.85 * alpha})`;
            ctx.fillRect(cardX - bw * 0.38, cardY - 16, bw * 0.45, 5);
            ctx.fillStyle = `rgba(245, 246, 248, ${0.45 * alpha})`;
            ctx.fillRect(cardX - bw * 0.38, cardY - 2, bw * 0.72, 4);
            ctx.fillStyle = `rgba(120, 169, 255, ${0.45 * alpha})`;
            ctx.fillRect(cardX - bw * 0.38, cardY + 12, bw * 0.58, 4);
          }
        } else {
          // VÍDEO 03 — COMMERCIAL TRANSFORMATION: dados -> mensagem -> colunas de pipeline
          const cols = 4;
          const colW = Math.min(130, (w * 0.72) / cols);
          const gap = Math.min(20, w * 0.025);
          const totalW = cols * colW + (cols - 1) * gap;
          const startX = (w - totalW) * 0.5;
          const topY = h * 0.24;
          const colH = h * 0.52;

          for (let c = 0; c < cols; c++) {
            const x = startX + c * (colW + gap);
            const isTargetCol = c === 2;
            ctx.fillStyle = "rgba(17, 19, 24, 0.85)";
            ctx.strokeStyle = isTargetCol
              ? `rgba(183, 243, 107, ${0.2 + cycle * 0.35})`
              : "rgba(245, 246, 248, 0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x, topY, colW, colH, 10);
            ctx.fill();
            ctx.stroke();

            // Cards estáticos nas colunas
            for (let r = 0; r < 2; r++) {
              const cyCard = topY + 18 + r * 54;
              ctx.fillStyle = "rgba(25, 28, 34, 0.9)";
              ctx.beginPath();
              ctx.roundRect(x + 10, cyCard, colW - 20, 42, 7);
              ctx.fill();
            }
          }

          // Card de oportunidade se movendo coreografadamente da coluna 0 para a coluna 2
          const fromX = startX + 10;
          const toX = startX + 2 * (colW + gap) + 10;
          const activeX = fromX + (toX - fromX) * cycle;
          const activeY = topY + 126 - Math.sin(cycle * Math.PI) * 18;

          ctx.fillStyle = "#191C22";
          ctx.strokeStyle = "#B7F36B";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(activeX, activeY, colW - 20, 46, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#B7F36B";
          ctx.fillRect(activeX + 10, activeY + 14, (colW - 40) * 0.65, 5);
          ctx.fillStyle = "rgba(245, 246, 248, 0.55)";
          ctx.fillRect(activeX + 10, activeY + 26, (colW - 40) * 0.45, 4);
        }
      }

      if (!reducedMotion && isVisible) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [variant, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={
        ariaLabel ??
        (variant === "opening"
          ? "Animação procedural de abertura mostrando coordenadas e conexões de negócios"
          : variant === "discovery"
            ? "Animação procedural mostrando uma oportunidade comercial sendo isolada na rede"
            : "Animação procedural mostrando dados se transformando em um pipeline comercial organizado")
      }
      className={`block h-full w-full ${className}`}
    />
  );
}
