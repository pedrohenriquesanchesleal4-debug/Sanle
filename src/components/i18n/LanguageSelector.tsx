"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/types";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

const LANGUAGES: { id: Locale; label: string; flag: string }[] = [
  { id: "pt", label: "PT", flag: "🇧🇷" },
  { id: "en", label: "EN", flag: "🇺🇸" },
  { id: "es", label: "ES", flag: "🇪🇸" }
];

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-8 w-24 rounded-full bg-white/[0.04] animate-pulse ${className}`} />
    );
  }

  return (
    <div 
      className={`inline-flex items-center p-0.5 rounded-full border border-white/15 bg-white/[0.04] shadow-xs text-xs font-mono select-none ${className}`}
      role="group"
      aria-label="Selecionar idioma / Select language"
    >
      <Globe className="h-3 w-3 ml-2 mr-1 text-[#78A9FF] shrink-0 opacity-70" aria-hidden="true" />
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => setLocale(lang.id)}
            className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-[#2440FF] text-white shadow-sm shadow-[#2440FF]/40"
                : "text-[#969DA8] hover:text-white hover:bg-white/[0.06]"
            }`}
            title={`Alternar para ${lang.label}`}
            aria-pressed={isActive}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
