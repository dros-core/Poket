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
        // 따뜻한 중성톤 (베이스)
        sand: {
          50: "#fbf9f7", 100: "#f4f0eb", 200: "#e7e0d5", 300: "#d4c9b8",
          400: "#b3a48b", 500: "#8a7a62", 600: "#6b5d49", 700: "#534839",
          800: "#3a322a", 900: "#221d18", 950: "#15110e"
        },
        // === 포켓몬 코어 3색 ===
        pkm: {
          red:       "#EE1515",      // Pokéball Red (공식)
          redDark:   "#B7090E",
          redDeep:   "#7A0A0E",
          yellow:    "#FFCB05",      // Pikachu Yellow (공식)
          yellowDark:"#E6B400",
          blue:      "#3D7DCA",      // Trainer Blue (공식)
          blueDark:  "#2A5A9E",
          navy:      "#003A70",
          ink:       "#222224",      // 포켓볼 띠
          cream:     "#FFF9DB"
        },
        // 브랜드 = 포켓볼 빨강 시리즈
        brand: {
          50:  "#FEE7E7", 100: "#FCC8C8", 200: "#F89696", 300: "#F45F5F",
          400: "#F03333", 500: "#EE1515", 600: "#D40E0E", 700: "#B7090E",
          800: "#8E0709", 900: "#5C0405", 950: "#2F0102"
        },
        // 한국 시세 컨벤션 — 상승 빨강, 하락 파랑 (포켓몬 톤)
        up:   { 50: "#FEE7E7", 400: "#F45F5F", 500: "#EE1515", 600: "#B7090E", 700: "#8E0709" },
        down: { 50: "#E7F0FB", 400: "#6BA0E0", 500: "#3D7DCA", 600: "#2A5A9E", 700: "#1E4576" },
        accent: { DEFAULT: "#FFCB05", dark: "#B98D00" },
        // 포켓몬 타입 18색 (PokeAPI 표준)
        type: {
          normal:"#A8A77A", fire:"#EE8130", water:"#6390F0", electric:"#F7D02C",
          grass:"#7AC74C", ice:"#96D9D6",  fighting:"#C22E28", poison:"#A33EA1",
          ground:"#E2BF65", flying:"#A98FF3", psychic:"#F95587", bug:"#A6B91A",
          rock:"#B6A136", ghost:"#735797", dragon:"#6F35FC", dark:"#705746",
          steel:"#B7B7CE", fairy:"#D685AD"
        }
      },
      fontFamily: {
        sans:    ["Pretendard Variable", "Pretendard", "ui-sans-serif", "system-ui", "-apple-system", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"],
        display: ['"Jua"', "Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
        pixel:   ['"Press Start 2P"', "Galmuri11", "ui-monospace", "monospace"],
        mono:    ['"JetBrains Mono"', "ui-monospace", "SF Mono", "monospace"]
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }]
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15,23,42,0.04)",
        card: "0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.03)",
        cardLg: "0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)",
        glow: "0 0 0 4px rgba(238,21,21,0.12)",
        glowYellow: "0 0 0 4px rgba(255,203,5,0.30), 0 0 24px rgba(255,203,5,0.30)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      borderRadius: {
        card: "16px",
        pill: "9999px"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        gradient: "gradient 12s ease infinite",
        "spin-slow": "spin 18s linear infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-800px 0" }, "100%": { backgroundPosition: "800px 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulseSoft: { "0%, 100%": { opacity: "0.7" }, "50%": { opacity: "1" } },
        gradient: { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        bounceSoft: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-3px)" } }
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
