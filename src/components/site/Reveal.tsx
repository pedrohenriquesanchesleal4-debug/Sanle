"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  /** y offset in px for the entrance */
  y?: number;
};

/**
 * Revelação no scroll sem dependência pesada: IntersectionObserver + transição CSS.
 * Respeita prefers-reduced-motion automaticamente (o CSS zera as transições).
 * Todo conteúdo permanece acessível mesmo sem JS (estado inicial = visível no SSR? não:
 * usamos opacity via CSS com fallback de no-JS via <noscript> global).
 */
export function Reveal({ children, className, delay = 0, as, y = 18 }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={
        {
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : `translateY(${y}px)`,
          transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
          willChange: "opacity, transform"
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
