"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela palavras sequencialmente (máscara por linha) quando entra em viewport.
 * Usado com moderação — 1-2 momentos-chave da narrativa.
 */
export function WordsReveal({
  text,
  className,
  start = 0,
  stagger = 60
}: {
  text: string;
  className?: string;
  start?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setShown(true); obs.disconnect(); }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("inline", className)}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={{
              transform: shown ? "translateY(0)" : "translateY(105%)",
              opacity: shown ? 1 : 0,
              transition: `transform .8s cubic-bezier(.16,1,.3,1) ${start + i * stagger}ms, opacity .6s ease ${start + i * stagger}ms`
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
