"use client";

interface TerritorySceneProps {
  /** Progresso local da Cena 02 [0..1] */
  progress: number;
  active: boolean;
}

const ILLUSTRATIVE_REGIONS = [
  { code: "REG-01", sector: "SIA & Setor de Indústrias", count: "148 estabelecimentos mapeados", signal: "Exploração ativa" },
  { code: "REG-02", sector: "Asa Norte & Comércio Local", count: "214 estabelecimentos mapeados", signal: "Densidade alta" },
  { code: "REG-03", sector: "Taguatinga & Polo Técnico", count: "176 estabelecimentos mapeados", signal: "Sinais identificados" }
] as const;

/**
 * CENA 02 — A WORLD OF BUSINESSES
 * O ponto inicial se expande em uma rede espacial tridimensional de empresas e conexões.
 */
export function TerritoryScene({ progress, active }: TerritorySceneProps) {
  return (
    <div
      aria-hidden={!active}
      className={`relative flex h-full w-full items-center px-6 transition-opacity duration-500 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Imagem de apoio atmosférica da rede territorial integrada em baixa opacidade */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen"
        style={{ backgroundImage: "url('/media/storytelling/network-territory.jpg')" }}
      />

      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-12">
        <div
          className="lg:col-span-7"
          style={{
            transform: `translate3d(0, ${(0.5 - progress) * 24}px, 0)`
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#78A9FF]/30 bg-[#111318]/90 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#78A9FF]" />
            <span>02 · A WORLD OF BUSINESSES</span>
          </div>

          <h2 className="mt-5 font-display text-clamp-title font-semibold leading-[1.02] tracking-tightest text-[#F5F6F8]">
            Existem oportunidades por toda parte.
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#969DA8] md:text-xl">
            O desafio não é encontrar empresas. É identificar quais merecem sua atenção.
          </p>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#969DA8]/70">
            * Visualização territorial com dados demonstrativos ilustrativos.
          </p>
        </div>

        {/* Marcadores espaciais de clusters de negócios */}
        <div className="grid gap-3.5 lg:col-span-5">
          {ILLUSTRATIVE_REGIONS.map((reg, idx) => {
            const itemProgress = Math.max(0, Math.min(1, (progress - idx * 0.14) * 1.8));
            return (
              <div
                key={reg.code}
                className="rounded-hunter border border-[#F5F6F8]/10 bg-[#191C22]/85 p-4 backdrop-blur-md transition-transform duration-200"
                style={{
                  opacity: 0.25 + itemProgress * 0.75,
                  transform: `translate3d(${(1 - itemProgress) * 28}px, 0, 0)`
                }}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                  <span className="text-[#78A9FF]">{reg.code} · DEMO</span>
                  <span className="text-[#B7F36B]">{reg.signal}</span>
                </div>
                <p className="mt-1.5 font-display text-base font-medium text-[#F5F6F8]">
                  {reg.sector}
                </p>
                <p className="mt-0.5 text-xs text-[#969DA8]">{reg.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
