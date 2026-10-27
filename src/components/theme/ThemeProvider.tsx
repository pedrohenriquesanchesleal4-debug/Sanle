"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // 1. Lê preferência salva em localStorage
    const savedTheme = (localStorage.getItem("sanle_theme") as Theme) || "system";
    setThemeState(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      let active: "light" | "dark";
      if (currentTheme === "system") {
        active = mediaQuery.matches ? "dark" : "light";
      } else {
        active = currentTheme;
      }

      setResolvedTheme(active);

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(active);
      root.setAttribute("data-theme", active);
      root.style.colorScheme = active;
    };

    applyTheme(savedTheme);

    const handleSystemChange = () => {
      const current = (localStorage.getItem("sanle_theme") as Theme) || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("sanle_theme", newTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const active = newTheme === "system" ? (mediaQuery.matches ? "dark" : "light") : newTheme;

    setResolvedTheme(active);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(active);
    root.setAttribute("data-theme", active);
    root.style.colorScheme = active;

    // Dispara evento customizado para componentes que necessitem reagir imediatamente
    window.dispatchEvent(new CustomEvent("sanle:theme-changed", { detail: { theme: newTheme, resolved: active } }));
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
