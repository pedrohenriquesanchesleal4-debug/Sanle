"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] animate-pulse ${className}`} 
        aria-hidden="true" 
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer shadow-sm active:scale-95 text-[#F5F6F8] ${className}`}
      aria-label={isDark ? "Alternar para tema claro" : "Alternar para tema escuro"}
      title={isDark ? "Modo Claro" : "Modo Escuro"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#F5B84B] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#78A9FF] transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
