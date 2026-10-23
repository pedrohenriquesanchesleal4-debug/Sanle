import { STORY_SCENES, type StorySceneSpec } from "./motion-config";

/**
 * Utilitário puro para interpolar linearmente entre dois valores.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Normaliza o progresso global [0..1] para o progresso local [0..1] de um intervalo.
 */
export function rangeProgress(globalProgress: number, start: number, end: number): number {
  if (end <= start) return 0;
  return Math.max(0, Math.min(1, (globalProgress - start) / (end - start)));
}

/**
 * Curva smoothstep para transições orgânicas entre cenas.
 */
export function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export interface InterpolatedStoryState {
  activeSceneIndex: number;
  activeScene: StorySceneSpec;
  sceneLocalProgress: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  networkIntensity: number;
  opportunityFocus: number;
}

/**
 * Dado o progresso global de scroll [0..1], calcula a cena ativa, o progresso local da cena
 * e interpola continuamente câmera e parâmetros do campo 3D.
 */
export function computeStoryTimelineState(globalProgress: number): InterpolatedStoryState {
  const clamped = Math.max(0, Math.min(1, globalProgress));
  const total = STORY_SCENES.length;

  let activeIdx = 0;
  for (let i = 0; i < total; i++) {
    const scene = STORY_SCENES[i]!;
    if (clamped >= scene.range[0] && clamped <= scene.range[1]) {
      activeIdx = i;
      break;
    }
    if (clamped > scene.range[1]) {
      activeIdx = i;
    }
  }

  const current = STORY_SCENES[activeIdx] ?? STORY_SCENES[0]!;
  const next = STORY_SCENES[Math.min(total - 1, activeIdx + 1)] ?? current;
  const localT = rangeProgress(clamped, current.range[0], current.range[1]);
  const smoothT = smoothstep(localT);

  return {
    activeSceneIndex: activeIdx,
    activeScene: current,
    sceneLocalProgress: localT,
    cameraPosition: [
      lerp(current.cameraPosition[0], next.cameraPosition[0], smoothT),
      lerp(current.cameraPosition[1], next.cameraPosition[1], smoothT),
      lerp(current.cameraPosition[2], next.cameraPosition[2], smoothT)
    ],
    cameraTarget: [
      lerp(current.cameraTarget[0], next.cameraTarget[0], smoothT),
      lerp(current.cameraTarget[1], next.cameraTarget[1], smoothT),
      lerp(current.cameraTarget[2], next.cameraTarget[2], smoothT)
    ],
    networkIntensity: lerp(current.networkIntensity, next.networkIntensity, smoothT),
    opportunityFocus: lerp(current.opportunityFocus, next.opportunityFocus, smoothT)
  };
}
