import { cn } from "@/lib/utils";

/**
 * Logotipo tipográfico da Sanle.
 * Marca: wordmark "sanle" + glifo de fluxo (nó que se organiza), sem emoji.
 * O "a" carrega um nó cobalto que representa o ponto de organização do fluxo.
 */
export function Logo({
  className,
  tone = "ink"
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  const node = tone === "paper" ? "fill-signal" : "fill-cobalt";
  return (
    <span className={cn("inline-flex items-center gap-2.5", color, className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 28 28"
        className="h-[1.35em] w-[1.35em] shrink-0"
        fill="none"
      >
        <path
          d="M4 20.5 C 4 12, 10 8, 14 8 S 24 10, 24 20.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="8" cy="21" r="1.6" className={node} />
        <circle cx="14" cy="9" r="1.9" className={node} />
        <circle cx="20" cy="21" r="1.6" className={node} />
      </svg>
      <span className="font-display text-[1.55em] font-medium lowercase leading-none tracking-tightest">
        sanle
      </span>
    </span>
  );
}
