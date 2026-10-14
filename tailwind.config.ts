import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#FF5B1F",
          glow: "rgba(255, 91, 31, 0.25)",
          hover: "#E0480E"
        },
        dark: {
          bg: "#0A0A09",
          surface: "#141412",
          card: "#161614"
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
          soft: "#E4E8FF"
        },
        signal: {
          DEFAULT: "rgb(var(--signal) / <alpha-value>)",
          deep: "#059669"
        },
        amber: {
          DEFAULT: "rgb(var(--amber) / <alpha-value>)",
          deep: "#D97706"
        },
        rust: "rgb(var(--rust) / <alpha-value>)"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "var(--font-fraunces)", "Georgia", "serif"],
        display: ["var(--font-serif)", "var(--font-fraunces)", "serif"],
        sans: ["var(--font-sans)", "var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      fontSize: {
        "clamp-hero": "clamp(2.75rem, 8vw, 8.5rem)",
        "clamp-title": "clamp(2rem, 5vw, 4.5rem)",
        "clamp-sub": "clamp(1.25rem, 2.5vw, 2.25rem)"
      },
      letterSpacing: {
        tightest: "-0.045em"
      },
      maxWidth: {
        shell: "1280px",
        prose: "68ch"
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "flow-dash": {
          to: { strokeDashoffset: "-24" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "flow-dash": "flow-dash 1.2s linear infinite",
        marquee: "marquee 38s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
