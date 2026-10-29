import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        /* =================================================================
           SALES HUNTER — THE OPPORTUNITY ENGINE PALETTE
           ================================================================= */
        hunter: {
          void: "#08090C",        // Preto profundo
          graphite: "#111318",    // Grafite
          surface: "#191C22",     // Superfícies / Cards
          elevated: "#20242D",    // Superfície em hover / modal
          white: "#F5F6F8",       // Branco principal
          muted: "#969DA8",       // Cinza secundário
          green: "#B7F36B",       // Verde de oportunidade
          greenDim: "rgba(183, 243, 107, 0.14)",
          blue: "#78A9FF",        // Azul de exploração
          blueDim: "rgba(120, 169, 255, 0.14)"
        },
        accent: {
          DEFAULT: "#B7F36B",
          glow: "rgba(183, 243, 107, 0.25)",
          hover: "#A3E655"
        },
        dark: {
          bg: "#08090C",
          surface: "#111318",
          card: "#191C22"
        },
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          soft: "rgb(var(--paper-soft) / <alpha-value>)",
          deep: "rgb(var(--paper-deep) / <alpha-value>)"
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          mute: "rgb(var(--ink-mute) / <alpha-value>)"
        },
        cobalt: {
          DEFAULT: "rgb(var(--cobalt) / <alpha-value>)",
          deep: "rgb(var(--cobalt-deep) / <alpha-value>)",
          soft: "rgba(120, 169, 255, 0.14)"
        },
        signal: {
          DEFAULT: "rgb(var(--signal) / <alpha-value>)",
          deep: "#8FD14F"
        },
        amber: {
          DEFAULT: "rgb(var(--amber) / <alpha-value>)",
          deep: "#D97706"
        },
        rust: "rgb(var(--rust) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-sans)", "var(--font-space)", "system-ui", "sans-serif"],
        heading: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        space: ["var(--font-space)", "sans-serif"]
      },
      fontSize: {
        "clamp-hero": "clamp(2.5rem, 6.4vw, 6.25rem)",
        "clamp-title": "clamp(1.85rem, 4.2vw, 3.85rem)",
        "clamp-sub": "clamp(1.125rem, 2vw, 1.65rem)"
      },
      letterSpacing: {
        tightest: "-0.04em",
        editorial: "-0.032em"
      },
      maxWidth: {
        shell: "1320px",
        prose: "65ch"
      },
      borderRadius: {
        hunter: "14px",
        "hunter-lg": "20px"
      },
      boxShadow: {
        "hunter-card": "0 24px 60px -18px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(245, 246, 248, 0.07)",
        "hunter-glow-green": "0 0 40px -8px rgba(183, 243, 107, 0.32), 0 0 0 1px rgba(183, 243, 107, 0.35)",
        "hunter-glow-blue": "0 0 40px -8px rgba(120, 169, 255, 0.28), 0 0 0 1px rgba(120, 169, 255, 0.3)"
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
        precision: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "flow-dash": {
          to: { strokeDashoffset: "-24" }
        },
        "signal-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.65)", opacity: "0.2" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "flow-dash": "flow-dash 1.2s linear infinite",
        "signal-pulse": "signal-pulse 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        marquee: "marquee 38s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
