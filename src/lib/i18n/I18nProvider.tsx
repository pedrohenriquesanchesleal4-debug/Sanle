"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale, Dictionary } from "./types";
import { pt } from "./dictionaries/pt";
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";

const DICTIONARIES: Record<Locale, Dictionary> = {
  pt,
  en,
  es
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  t: (path: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "pt";

  const saved = localStorage.getItem("sanle_locale") as Locale | null;
  if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
    return saved;
  }

  const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("en")) return "en";
  return "pt";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const detected = detectBrowserLocale();
    setLocaleState(detected);
    document.documentElement.lang = detected === "pt" ? "pt-BR" : detected;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("sanle_locale", newLocale);
    document.cookie = `sanle_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale === "pt" ? "pt-BR" : newLocale;

    window.dispatchEvent(new CustomEvent("sanle:locale-changed", { detail: { locale: newLocale } }));
  };

  const dict = DICTIONARIES[locale] || pt;

  // Helper de tradução por chave composta, ex: t('header.capabilities')
  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: unknown = dict;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return fallback ?? path;
      }
    }

    return typeof current === "string" ? current : fallback ?? path;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, dict, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
