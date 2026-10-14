"use client";

export type LandingEventType =
  | "pagina_vista"
  | "scroll_50"
  | "cta_clicado"
  | "calculadora_usada"
  | "demo_iniciada"
  | "demo_concluida"
  | "segmento_selecionado"
  | "form_iniciado"
  | "form_enviado"
  | "whatsapp_aberto"
  | "pagina_personalizada_vista";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sId = sessionStorage.getItem("sanle_session_id");
  if (!sId) {
    sId = "s_" + Math.random().toString(36).substring(2, 12);
    sessionStorage.setItem("sanle_session_id", sId);
  }
  return sId;
}

export function trackEvent(
  evento: LandingEventType,
  meta: Record<string, unknown> = {},
  options?: { segmento?: string; prospectSlug?: string }
) {
  if (typeof window === "undefined") return;

  const payload = {
    sessionId: getSessionId(),
    evento,
    caminho: window.location.pathname,
    segmento: options?.segmento,
    prospectSlug: options?.prospectSlug,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/site/events", blob);
    } else {
      fetch("/api/site/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Falha silenciosa para não afetar UX
  }
}
