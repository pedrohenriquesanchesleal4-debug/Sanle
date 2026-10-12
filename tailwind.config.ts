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
        paper: {
          DEFAULT: "#F4F1EA",
          soft: "#EDE9DF",
          deep: "#E3DDD0"
        },
        ink: {
          DEFAULT: "#121110",
          soft: "#3A3733",
          mute: "#6B665E"
        },
        cobalt: {
          DEFAULT: "#2440FF",
          deep: "#1730D6",
          soft: "#E4E8FF"
        },
        signal: {
          DEFAULT: "#C8FF4D",
          deep: "#9FDB1B"
        },
        rust: "#B4462A"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
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
