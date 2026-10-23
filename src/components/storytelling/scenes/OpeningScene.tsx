"use client";

import { ProceduralFilm } from "../ProceduralFilms";

interface OpeningSceneProps {
  /** Progresso local da Cena 01 [0..1] */
  progress: number;
  active: boolean;
}

/**
 * CENA 01 — BEFORE THE SIGNAL
 * Começa quase vazia com espaço negativo profundo (#08090C), um ponto luminoso
 * central e coordenada discreta. Conforme o scroll avança, o ponto ganha
 * intensidade, emite um halo óptico, uma linha atravessa o espaço e a headline emerge.
 */
export function OpeningScene({ progress, active }: OpeningSceneProps) {
  const lineScale = Math.min(1, progress * 1.65);
  const haloScale = 1 + progress * 2.2;
  const textOpacity = Math.min(1, Math.max(0.18, (progress - 0.04) * 2.4));
  const coordsOpacity = Math.min(1, Math.max(0, (progress - 0.18) * 1.8));

  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full flex-col items-center justify-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Filme procedural sutil de abertura + textura hero */}
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <ProceduralFilm variant="opening" />
      </div>

      {/* Ponto central + Halo + Linha atravessando o espaço */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Linha horizontal que atravessa o espaço no scroll */}
        <div
          className="pointer-events-none absolute top-1/2 h-px w-[82vw] max-w-[1100px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#78A9FF]/50 to-transparent transition-transform duration-150"
          style={{
            transform: `translateY(-50%) scaleX(${Math.max(0.04, lineScale)})`,
            opacity: 0.25 + progress * 0.65
          }}
        />

        {/* Coordenadas secundárias que surgem lentamente */}
        <div
          className="pointer-events-none absolute -top-14 flex items-center gap-16 font-mono text-[10px] uppercase tracking-[0.22em] text-[#969DA8]"
          style={{ opacity: coordsOpacity }}
        >
          <span>LAT -15.793889</span>
          <span className="text-[#78A9FF]">SIGNAL::ORIGIN</span>
          <span>LON -47.882778</span>
        </div>

        {/* Halo óptico e ponto focal */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            className="absolute h-12 w-12 rounded-full border border-[#B7F36B]/40 transition-transform duration-150"
            style={{
              transform: `scale(${haloScale})`,
              opacity: Math.max(0.12, 0.75 - progress * 0.45)
            }}
          />
          <div
            className="absolute h-20 w-20 rounded-full border border-[#78A9FF]/25 transition-transform duration-150"
            style={{
              transform: `scale(${0.6 + progress * 1.5})`,
              opacity: coordsOpacity * 0.6
            }}
          />
          <span
            className="relative z-10 h-3 w-3 rounded-full bg-[#B7F36B] shadow-[0_0_28px_6px_rgba(183,243,107,0.75)]"
            style={{
              transform: `scale(${1 + progress * 0.55})`
            }}
          />
        </div>

        {/* Headline contida e monumental */}
        <div
          className="mt-10 max-w-3xl text-center transition-transform duration-200"
          style={{
            opacity: textOpacity,
            transform: `translate3d(0, ${(1 - textOpacity) * 18}px, 0)`
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#969DA8]">
            01 · BEFORE THE SIGNAL
          </p>
          <h1 className="mt-4 font-display text-clamp-hero font-semibold leading-[0.98] tracking-tightest text-[#F5F6F8]">
            Todo negócio começa com uma{" "}
            <span className="text-[#B7F36B]">oportunidade.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#969DA8] md:text-lg"
            style={{ opacity: Math.min(1, Math.max(0, (progress - 0.12) * 2)) }}
          >
            Role para explorar como informações dispersas em um território de empresas se transformam em conversas comerciais reais.
          </p>
        </div>
      </div>
    </div>
  );
}
