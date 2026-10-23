"use client";

import { useEffect } from "react";
import { captureTrafficOrigin } from "@/lib/utm";

/**
 * Registrador silencioso de procedência de tráfego.
 * Executa na montagem inicial no cliente e extrai parâmetros de campanha (UTMs)
 * e referrer para armazenamento em sessão local.
 */
export function TrafficTracker() {
  useEffect(() => {
    captureTrafficOrigin();
  }, []);

  return null;
}
