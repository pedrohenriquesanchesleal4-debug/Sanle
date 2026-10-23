"use client";

import { useEffect, useRef } from "react";

type Particle = {
  // Posição inicial (caos/dispersão)
  x: number;
  y: number;
  originX: number;
  originY: number;
  // Posição alvo (glifo da Sanle organizado)
  targetX: number;
  targetY: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  speed: number;
  angle: number;
  isKeyNode: boolean; // se é um dos 3 nós da marca
};

export function CinematicHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    onResize();
    window.addEventListener("resize", onResize);

    // Mouse interativo
    const mouse = { x: -1000, y: -1000, radius: 120 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Criação da constelação de partículas
    const particleCount = prefersReducedMotion ? 25 : 85;
    const particles: Particle[] = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.44;

    // Coordenadas calculadas do arco e nós da logo Sanle
    // Curva proporcional baseada no viewBox 0 0 28 28:
    // Nó 1: (8, 21), Nó 2: (14, 9), Nó 3: (20, 21)
    const scale = Math.min(window.innerWidth * 0.28, 260);

    for (let i = 0; i < particleCount; i++) {
      const isKey = i < 3;
      let targetX = centerX;
      let targetY = centerY;
      let color = "#3B5FFF"; // Cobalto
      let alpha = Math.random() * 0.5 + 0.3;

      if (i === 0) {
        // Nó esquerdo
        targetX = centerX - scale * 0.42;
        targetY = centerY + scale * 0.35;
        color = "#F59E0B"; // Golden Hour Solar
        alpha = 1.0;
      } else if (i === 1) {
        // Nó superior central
        targetX = centerX;
        targetY = centerY - scale * 0.4;
        color = "#2440FF"; // Cobalto de Alta Precisão
        alpha = 1.0;
      } else if (i === 2) {
        // Nó direito
        targetX = centerX + scale * 0.42;
        targetY = centerY + scale * 0.35;
        color = "#10B981"; // Verde Precisão
        alpha = 1.0;
      } else {
        // Partículas que formam o arco e fluxo
        const t = (i - 3) / (particleCount - 3);
        const arcX = (t - 0.5) * scale * 0.95;
        const arcY = Math.sin(t * Math.PI) * -scale * 0.4 + scale * 0.35;
        targetX = centerX + arcX;
        targetY = centerY + arcY;
        color = t > 0.3 && t < 0.7 ? "#2440FF" : "#F59E0B";
      }

      // Posição inicial (dispersa pelo espaço)
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDist = Math.random() * (Math.max(window.innerWidth, window.innerHeight) * 0.45) + 80;
      const startX = centerX + Math.cos(randomAngle) * randomDist;
      const startY = centerY + Math.sin(randomAngle) * randomDist;

      particles.push({
        x: startX,
        y: startY,
        originX: startX,
        originY: startY,
        targetX,
        targetY,
        radius: isKey ? 6 : Math.random() * 2.2 + 1.2,
        baseRadius: isKey ? 6 : Math.random() * 2.2 + 1.2,
        color,
        alpha,
        speed: Math.random() * 0.02 + 0.015,
        angle: Math.random() * Math.PI * 2,
        isKeyNode: isKey
      });
    }

    let progress = 0; // 0 = Caos / Disperso, 1 = Totalmente Organizado no Glifo

    const render = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.85;
      const targetProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      progress += (targetProgress - progress) * 0.1;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      ctx.clearRect(0, 0, screenW, screenH);

      // Linhas de conexão sutis entre partículas
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        if (!pi) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          if (!pj) continue;

          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 95 + progress * 40;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * (progress * 0.8 + 0.2);
            ctx.strokeStyle = `rgba(36, 64, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      // Desenho do Arco Guia quando progress > 0.15
      if (progress > 0.15) {
        const p1 = particles[0];
        const p2 = particles[1];
        const p3 = particles[2];

        if (p1 && p2 && p3) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p2.x, p2.y - 20, p3.x, p3.y);
          ctx.strokeStyle = `rgba(36, 64, 255, ${progress * 0.35})`;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Atualização e renderização das partículas
      particles.forEach((p) => {
        p.angle += 0.02;
        const driftX = Math.sin(p.angle) * 1.5;
        const driftY = Math.cos(p.angle) * 1.5;

        const currentTargetX = p.originX + (p.targetX - p.originX) * progress + driftX;
        const currentTargetY = p.originY + (p.targetY - p.originY) * progress + driftY;

        p.x += (currentTargetX - p.x) * 0.08;
        p.y += (currentTargetY - p.y) * 0.08;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          const force = (1 - mDist / mouse.radius) * 14;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isKeyNode ? p.radius + Math.sin(p.angle * 2) * 0.8 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Glow arquitetural suave nos nós da marca
        if (p.isKeyNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.radius * 3.5);
          grad.addColorStop(0, "rgba(36, 64, 255, 0.25)");
          grad.addColorStop(1, "rgba(36, 64, 255, 0)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-90 transition-opacity duration-1000"
      />
      {/* Vinheta de luz suave arquitetural */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-transparent to-paper" />
    </div>
  );
}
