import { sleep } from "@/lib/utils";
import { env } from "@/lib/env";

/**
 * Pacing por chave: serializa chamadas e garante um intervalo mínimo entre elas.
 *
 * Por que existe: a política do Nominatim impõe **no máximo 1 requisição/segundo**
 * por aplicação, e o Overpass aplica carga (2 slots por IP + 429 monitorado).
 * Disparar em paralelo viola ambos. Aqui, cada host tem uma fila própria e o
 * próximo envio espera o intervalo mínimo — sem `sleep` espalhado pelo código.
 *
 * Contrato: `paced(key, minIntervalMs, fn)` nunca roda duas `fn` da mesma chave em
 * paralelo e nunca começa uma antes de `minIntervalMs` após o início da anterior.
 */

const tails = new Map<string, Promise<unknown>>();
const lastStartedAt = new Map<string, number>();

export async function paced<T>(key: string, minIntervalMs: number, fn: () => Promise<T>): Promise<T> {
  const previous = tails.get(key) ?? Promise.resolve();

  const run = previous.then(async () => {
    const last = lastStartedAt.get(key) ?? 0;
    const wait = last + minIntervalMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastStartedAt.set(key, Date.now());
    return fn();
  });

  // A cauda avança mesmo em falha — um erro não pode travar a fila para sempre.
  tails.set(
    key,
    run.then(
      () => undefined,
      () => undefined
    )
  );

  return run;
}

/** Intervalo mínimo configurado para um host (respeita OSM por padrão). */
export function minIntervalFor(): number {
  return env.prospecting.minIntervalMs;
}

export const __test = {
  reset(): void {
    tails.clear();
    lastStartedAt.clear();
  }
};
