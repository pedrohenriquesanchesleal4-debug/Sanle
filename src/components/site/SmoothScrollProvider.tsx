"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Em dispositivos com toque ou telas menores que 1024px (celulares e tablets),
    // desativamos o Lenis para preservar a rolagem nativa de 120Hz acelerada por hardware (GPU).
    // Isso elimina completamente qualquer micro-trava, atraso ou conflito com gestos de toque no mobile.
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 1024;

    if (isTouchDevice) {
      // Dispositivos mobile rolam 100% nativamente, sem interceptação de eventos de toque
      return;
    }

    // Inicialização do Lenis apenas em Desktop (mouse wheel) para inércia fluida
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95
    });

    lenisRef.current = lenis;

    // Sincroniza o ScrollTrigger a cada evento de scroll do Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Ticker do GSAP como clock central: evita loops concorrentes e micro-stutter
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    // lagSmoothing(0) é obrigatório pela documentação do GSAP para evitar compensações bruscas
    gsap.ticker.lagSmoothing(0);

    // Fornece instância global opcional para âncoras suaves
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
