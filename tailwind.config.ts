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
        // 다크 럭셔리 베이스 (Linear/Goldin 영감)
        ink: {
          50:  "#f5f5f7",
          100: "#ebebee",
          200: "#d4d4dc",
          300: "#a3a3ad",
          400: "#7a7a86",
          500: "#5a5a66",
          600: "#3e3e48",
          700: "#2a2a32",
          800: "#1a1a20",
          900: "#111114",
          950: "#0a0a0d"
        },
        // 포켓몬 코어 (절제 사용)
        pkm: {
          red:        "#EE1515",
          redSoft:    "#ff5050",
          redDark:    "#B7090E",
          yellow:     "#FFCB05",
          yellowSoft: "#ffe890",
          gold:       "#d4a017",
          goldDark:   "#8a6f0e",
          blue:       "#6BA0E0",
          blueDark:   "#2A5A9E",
          navy:       "#003A70",
          ink:        "#0a0a0d"
        },
        // 브랜드 = 럭셔리 골드 (yellow → gold 변형)
        brand: {
          50:  "#fff9db", 100: "#fff0a8", 200: "#ffe066", 300: "#ffd11f",
          400: "#FFCB05", 500: "#d4a017", 600: "#a47d0e", 700: "#7a5d0a",
          800: "#574208", 900: "#3a2c05", 950: "#1f1703"
        },
        // 한국 시세 컨벤션
        up:   { 400: "#ff7a7a", 500: "#ff5050", 600: "#EE1515", 700: "#B7090E" },
        down: { 400: "#8fb8e8", 500: "#6BA0E0", 600: "#3D7DCA", 700: "#2A5A9E" },
        accent: { DEFAULT: "#FFCB05", dark: "#d4a017" },
        // 타입 컬러 (다크에 잘 어울리도록 채도 약간 조정)
        type: {
          normal:"#a8a77a", fire:"#ff8a4c", water:"#5b9eff", electric:"#ffd02c",
          grass:"#7acf4c", ice:"#a0e5e0", fighting:"#d63f3a", poison:"#b54fb3",
          ground:"#e6c87a", flying:"#b8a3f5", psychic:"#ff70a0", bug:"#b3c829",
          rock:"#c5b148", ghost:"#8568a8", dragon:"#7e4dff", dark:"#8b7a66",
          steel:"#c8c8d8", fairy:"#e5a0c4"
        }
      },
      fontFamily: {
        sans:    ['"Geist"', '"Pretendard Variable"', "Pretendard", "ui-sans-serif", "system-ui", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"],
        display: ['"Fraunces"', '"Pretendard Variable"', "Pretendard", "ui-serif", "Georgia", "serif"],
        ui:      ['"Geist"', '"Pretendard Variable"', "Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        pixel:   ['"Press Start 2P"', "Galmuri11", "ui-monospace", "monospace"],
        mono:    ['"JetBrains Mono"', "ui-monospace", "SF Mono", "monospace"]
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }]
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.4)",
        card: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        cardLg: "0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)",
        glow: "0 0 0 1px rgba(255, 203, 5, 0.15), 0 0 24px rgba(255, 203, 5, 0.18)",
        glowRed: "0 0 0 1px rgba(255, 80, 80, 0.15), 0 0 24px rgba(255, 80, 80, 0.18)",
        innerLight: "inset 0 1px 0 rgba(255, 255, 255, 0.06)"
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
        "4xl": "2rem"
      },
      animation: {
        "fade-in": "fadeIn 0.6s var(--ease-luxe, ease-out)",
        "fade-up": "fadeUp 0.7s var(--ease-luxe, ease-out)",
        "fade-down": "fadeDown 0.7s var(--ease-luxe, ease-out)",
        "scale-in": "scaleIn 0.5s var(--ease-luxe, ease-out)",
        shimmer: "shimmer 1.8s linear infinite",
        "float-slow": "floatSlow 10s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        "aurora": "auroraFlow 18s ease infinite",
        "shimmer-text": "shimmerText 6s linear infinite"
      },
      keyframes: {
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp:   { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeDown: { from: { opacity: "0", transform: "translateY(-16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn:  { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer:  { "0%": { backgroundPosition: "-800px 0" }, "100%": { backgroundPosition: "800px 0" } },
        floatSlow:{ "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        pulseSlow:{ "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        auroraFlow: { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        shimmerText: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } }
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        luxe: "cubic-bezier(0.32, 0.72, 0, 1)"
      }
    }
  },
  plugins: []
};

export default config;
