import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1120px",
      },
    },
    extend: {
      colors: {
        background: "#050608",
        foreground: "#f8fafc",
        muted: "#99a1af",
        border: "rgba(148, 163, 184, 0.16)",
        accent: {
          DEFAULT: "#9fb3a8",
          soft: "rgba(159, 179, 168, 0.12)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(0, 0, 0, 0.28)",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(32px)" },
        },
      },
      animation: {
        grid: "grid 18s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
