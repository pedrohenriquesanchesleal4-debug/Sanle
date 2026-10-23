/**
 * SALES HUNTER — Motion System Configuration
 * Define curvas de easing, velocidades, capítulos da timeline de 8 cenas
 * e parâmetros de câmera espacial para manter consistência em toda a aplicação.
 */

export const MOTION_EASING = {
  /** Easing principal para entrada de elementos e revelações editoriais */
  precisionOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Easing suave para transições de estado e expansão de painéis */
  editorialInOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** GSAP eases equivalentes */
  gsapOut: "power3.out",
  gsapInOut: "power2.inOut",
  gsapScrub: "none"
} as const;

export const MOTION_DURATION = {
  micro: 0.18,
  fast: 0.28,
  normal: 0.55,
  editorial: 0.85,
  sceneTransition: 1.1
} as const;

export type StorySceneId =
  | "scene-01-signal"
  | "scene-02-world"
  | "scene-03-search"
  | "scene-04-opportunity"
  | "scene-05-diagnosis"
  | "scene-06-dialogue"
  | "scene-07-pipeline"
  | "scene-08-engine";

export interface StorySceneSpec {
  id: StorySceneId;
  index: number;
  code: string;
  label: string;
  title: string;
  subtitle: string;
  /** Intervalo normalizado [0..1] na timeline global de scroll */
  range: [number, number];
  /** Posição alvo da câmera 3D [x, y, z] */
  cameraPosition: [number, number, number];
  /** Alvo de olhar da câmera 3D [x, y, z] */
  cameraTarget: [number, number, number];
  /** Intensidade da rede espacial (0..1) */
  networkIntensity: number;
  /** Destaque do nó de oportunidade principal (0..1) */
  opportunityFocus: number;
}

export const STORY_SCENES: StorySceneSpec[] = [
  {
    id: "scene-01-signal",
    index: 1,
    code: "01",
    label: "BEFORE THE SIGNAL",
    title: "Todo negócio começa com uma oportunidade.",
    subtitle: "Antes da conversa, antes da proposta, existe um sinal silencioso esperando para ser descoberto.",
    range: [0.0, 0.125],
    cameraPosition: [0, 0.2, 11.5],
    cameraTarget: [0, 0, 0],
    networkIntensity: 0.12,
    opportunityFocus: 0.15
  },
  {
    id: "scene-02-world",
    index: 2,
    code: "02",
    label: "A WORLD OF BUSINESSES",
    title: "Existem oportunidades por toda parte.",
    subtitle: "O desafio não é encontrar empresas. É identificar quais merecem sua atenção.",
    range: [0.125, 0.25],
    cameraPosition: [0, 2.4, 7.8],
    cameraTarget: [0, -0.3, 0],
    networkIntensity: 0.92,
    opportunityFocus: 0.25
  },
  {
    id: "scene-03-search",
    index: 3,
    code: "03",
    label: "FIND THE SIGNAL",
    title: "Filtre o território com precisão.",
    subtitle: "Defina o nicho e a localização para transformar um mapa disperso em candidatos reais.",
    range: [0.25, 0.375],
    cameraPosition: [-1.1, 1.1, 5.4],
    cameraTarget: [0.3, 0, 0],
    networkIntensity: 0.78,
    opportunityFocus: 0.45
  },
  {
    id: "scene-04-opportunity",
    index: 4,
    code: "04",
    label: "SIGNAL TO OPPORTUNITY",
    title: "Menos ruído. Mais oportunidades.",
    subtitle: "O ruído recua e as empresas com maior potencial comercial emergem em primeiro plano.",
    range: [0.375, 0.5],
    cameraPosition: [0.85, 0.35, 3.3],
    cameraTarget: [0.9, 0.15, 0],
    networkIntensity: 0.35,
    opportunityFocus: 1.0
  },
  {
    id: "scene-05-diagnosis",
    index: 5,
    code: "05",
    label: "UNDERSTAND THE OPPORTUNITY",
    title: "Saiba por que vale a pena entrar em contato.",
    subtitle: "Transforme informações públicas em um próximo passo comercial mais inteligente.",
    range: [0.5, 0.625],
    cameraPosition: [1.2, 0.1, 3.8],
    cameraTarget: [0.6, 0, 0],
    networkIntensity: 0.28,
    opportunityFocus: 0.95
  },
  {
    id: "scene-06-dialogue",
    index: 6,
    code: "06",
    label: "FROM DATA TO DIALOGUE",
    title: "Cada oportunidade merece uma abordagem melhor.",
    subtitle: "O diagnóstico se transforma em uma mensagem contextualizada pronta para iniciar conversa no WhatsApp.",
    range: [0.625, 0.75],
    cameraPosition: [-0.6, 0.2, 4.4],
    cameraTarget: [-0.2, 0, 0],
    networkIntensity: 0.32,
    opportunityFocus: 0.85
  },
  {
    id: "scene-07-pipeline",
    index: 7,
    code: "07",
    label: "BUILD THE RELATIONSHIP",
    title: "Da primeira busca ao relacionamento comercial.",
    subtitle: "Cada conversa ingressa em um pipeline vivo com etapas claras, prioridades e acompanhamento.",
    range: [0.75, 0.875],
    cameraPosition: [0, 1.0, 6.2],
    cameraTarget: [0, -0.2, 0],
    networkIntensity: 0.55,
    opportunityFocus: 0.75
  },
  {
    id: "scene-08-engine",
    index: 8,
    code: "08",
    label: "THE OPPORTUNITY ENGINE",
    title: "Encontre oportunidades. Inicie conversas. Construa negócios.",
    subtitle: "Território, diagnóstico, abordagem e CRM reunidos em um único instrumento de inteligência comercial.",
    range: [0.875, 1.0],
    cameraPosition: [0, 1.6, 8.8],
    cameraTarget: [0, 0, 0],
    networkIntensity: 0.88,
    opportunityFocus: 1.0
  }
];
