import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px"
    },
    extend: {
      colors: {
        // 따뜻한 중성톤 (Anthropic 영감)
        sand: {
          50: "#fbf9f7",
          100: "#f4f0eb",
          200: "#e7e0d5",
          300: "#d4c9b8",
          400: "#b3a48b",
          500: "#8a7a62",
          600: "#6b5d49",
          700: "#534839",
          800: "#3a322a",
          900: "#221d18",
          950: "#15110e"
        },
        // 브랜드 (포켓몬 오렌지 + 코랄 톤)
        brand: {
          50: "#fff5ed",
          100: "#ffe6d4",
          200: "#fec9a8",
          300: "#fda270",
          400: "#fb7138",
          500: "#f95012",
          600: "#ea3608",
          700: "#c12509",
          800: "#9a2010",
          900: "#7c1d11",
          950: "#430b06"
        },
        // 한국 시세 컨벤션: 상승=빨강, 하락=파랑
        up: {
          50: "#fef2f2",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c"
        },
        down: {
          50: "#eff6ff",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        },
        accent: {
          DEFAULT: "#fbbf24",
          dark: "#b45309"
        }
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif"
        ],
        display: [
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"]
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }]
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 14px rgba(15,23,42,0.06)",
        cardLg: "0 4px 8px rgba(15,23,42,0.06), 0 12px 36px rgba(15,23,42,0.10)",
        glow: "0 0 0 1px rgba(249,80,18,0.10), 0 0 24px rgba(249,80,18,0.18)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        gradient: "gradient 12s ease infinite"
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-800px 0" },
          "100%": { backgroundPosition: "800px 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" }
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }
    }
  },
  plugins: []
};

export default config;
