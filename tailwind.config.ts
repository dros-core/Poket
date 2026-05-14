import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        accent: {
          DEFAULT: "#fbbf24",
          dark: "#b45309"
        },
        ink: {
          DEFAULT: "#0f172a",
          soft: "#1e293b",
          muted: "#475569"
        }
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        card: "0 4px 14px rgba(15, 23, 42, 0.08)",
        cardLg: "0 10px 30px rgba(15, 23, 42, 0.10)"
      },
      animation: {
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
