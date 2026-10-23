"use client";

/**
 * Módulo de Rastreamento Ético de Origem e Campanhas (UTM).
 * Captura parâmetros de campanhas pagas (Google Ads, Meta, LinkedIn) e referências orgânicas,
 * persistindo em localStorage para que qualquer conversão futura no site preserve a procedência
 * exata do lead sem violar a privacidade.
 */

export type StoredUtm = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  capturedAt: string;
};

const STORAGE_KEY = "sanle_traffic_origin";

export function captureTrafficOrigin(): void {
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.href);
    const utmSource = url.searchParams.get("utm_source")?.trim();
    const utmMedium = url.searchParams.get("utm_medium")?.trim();
    const utmCampaign = url.searchParams.get("utm_campaign")?.trim();
    const utmContent = url.searchParams.get("utm_content")?.trim();
    const utmTerm = url.searchParams.get("utm_term")?.trim();
    const ref = document.referrer ? new URL(document.referrer).hostname : undefined;

    // Se houver algum parâmetro novo ou ainda não houver UTM armazenada
    if (utmSource || utmMedium || utmCampaign || ref) {
      const payload: StoredUtm = {
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmContent: utmContent || undefined,
        utmTerm: utmTerm || undefined,
        referrer: ref,
        capturedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  } catch {
    // Tolerante a navegadores em modo estrito
  }
}

export function getStoredUtm(): Partial<StoredUtm> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredUtm;
  } catch {
    return {};
  }
}
