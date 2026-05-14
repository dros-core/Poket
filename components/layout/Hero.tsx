"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Marquee } from "@/components/ui/Marquee";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  featuredImages?: ResolvedImage[];
  /** 상단 KPI ticker용 데이터 */
  ticker?: Array<{ label: string; value: string; delta?: string; up?: boolean }>;
}

const luxeFadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.32, 0.72, 0, 1] } }
};

const dataSources = [
  "KREAM", "ICU.gg", "TCGBOX", "Bunjang", "Joongna", "Daangn",
  "Mercari JP", "Rakuten", "Amazon JP", "TCGdex", "PokeAPI", "PSA"
];

export function Hero({ featuredImages = [], ticker = [] }: Props) {
  return (
    <Spotlight className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] relative">
      {/* 럭셔리 보더 글로우 */}
      <BorderBeam size={120} duration={12} colorFrom="#C69B3C" colorTo="#FFCB05" />
      <section className="relative isolate overflow-hidden rounded-3xl">
        {/* 1. 백드롭: 미세 그리드 + 오로라 + 노이즈 */}
        <div className="absolute inset-0 bg-grid-luxe" aria-hidden />
        <div className="absolute inset-0 bg-aurora opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-pokeball-luxe opacity-30" aria-hidden />

        {/* 2. 측면 글로우 (subtle) */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-25 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 203, 5, 0.25), rgba(238, 21, 21, 0.10) 40%, transparent 70%)"
          }}
          aria-hidden
        />

        {/* 3. 우측 거대 카드 컬렉션 (스택) — md+ */}
        {featuredImages.length >= 3 && (
          <div className="absolute right-0 top-0 bottom-0 hidden md:flex items-center justify-end pr-8 lg:pr-12 pointer-events-none w-[42%] lg:w-[40%]">
            <div className="relative h-[420px] w-full">
              {featuredImages.slice(0, 3).map((img, i) => {
                const positions = [
                  { x: "-25%", y: "8%", rot: -8, z: 1, scale: 0.88, opacity: 0.4, blur: "2px" },
                  { x: "0%",   y: "-2%", rot: -3, z: 2, scale: 0.95, opacity: 0.75, blur: "0px" },
                  { x: "28%",  y: "12%", rot: 6, z: 3, scale: 1.0, opacity: 1.0, blur: "0px" }
                ][i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.8 }}
                    animate={{
                      opacity: positions.opacity,
                      y: 0,
                      rotate: positions.rot,
                      scale: positions.scale
                    }}
                    transition={{
                      delay: 0.5 + i * 0.15,
                      duration: 1.1,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    className="absolute top-1/2 left-1/2 will-change-transform"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${positions.x}) translateY(${positions.y})`,
                      zIndex: positions.z,
                      filter: `blur(${positions.blur})`
                    }}
                  >
                    <div className="relative w-[180px] h-[252px] lg:w-[220px] lg:h-[308px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-cardLg">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 220px, 180px"
                        className="object-cover"
                        unoptimized={img.isPlaceholder}
                        priority={i === 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                );
              })}
              {/* 하단 빛 (카드 하단에 글로우) */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[80px] opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255, 203, 5, 0.3), transparent 70%)",
                  filter: "blur(20px)"
                }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {/* 4. 메인 콘텐츠 */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-16 sm:py-24 lg:py-28 max-w-[640px]">
          {/* Eyebrow — Live indicator */}
          <motion.div initial="hidden" animate="show" variants={luxeFadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-mute)]/60 backdrop-blur-sm">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-up animate-ping opacity-75" />
                <span className="relative rounded-full bg-up w-1.5 h-1.5" />
              </span>
              <span className="font-pixel text-[9px] tracking-widest text-[var(--fg-muted)] uppercase">
                Live · 29 Sets · KR Market
              </span>
            </div>
          </motion.div>

          {/* 헤드라인 — 절제된 럭셔리 */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={luxeFadeUp}
            transition={{ delay: 0.08 }}
            className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.98] text-[var(--fg)]"
          >
            한국 포켓몬 카드,
            <br />
            <span className="text-luxe italic font-medium">시세의 표준</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate="show"
            variants={luxeFadeUp}
            transition={{ delay: 0.15 }}
            className="mt-6 text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed max-w-lg"
          >
            KREAM · 너정다 · TCGBOX · 번개장터 · Mercari를 하나의 데이터 레이어로.
            <span className="text-[var(--fg-soft)]"> 박스 EV, 90일 예측, 채널간 차익 기회</span>까지 — 매수·매도 의사결정의 전 영역.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={luxeFadeUp}
            transition={{ delay: 0.22 }}
            className="mt-9 sm:mt-10 flex flex-wrap gap-2.5"
          >
            <Link
              href="/cards"
              className="group inline-flex items-center gap-2 bg-[var(--fg)] hover:bg-white text-[var(--bg)] px-5 sm:px-6 py-3 rounded-full font-medium text-sm shadow-lg transition-all"
            >
              <Sparkles size={14} strokeWidth={2.2} />
              마켓 둘러보기
              <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/arbitrage"
              className="inline-flex items-center gap-2 border border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-5 sm:px-6 py-3 rounded-full font-medium text-sm transition-colors"
            >
              차익 기회
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </Link>
          </motion.div>

        </div>

        {/* Data source marquee (StockX trust strip) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 border-t border-[var(--border)] py-3"
        >
          <Marquee duration="50s" pauseOnHover className="text-[10px] tracking-[0.2em] uppercase text-[var(--fg-faint)] font-mono">
            {dataSources.map((src) => (
              <span key={src} className="inline-flex items-center gap-3">
                <span>{src}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              </span>
            ))}
          </Marquee>
        </motion.div>

        {/* 5. 하단 KPI Ticker (StockX 스타일) */}
        {ticker.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-mute)]/40 backdrop-blur-sm"
          >
            <div className="px-6 sm:px-10 lg:px-14 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {ticker.slice(0, 4).map((t) => (
                <div key={t.label} className="min-w-0">
                  <div className="text-[10px] font-pixel tracking-widest text-[var(--fg-faint)] uppercase">
                    {t.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-mono font-medium text-base sm:text-lg text-[var(--fg)] tnum">
                      {t.value}
                    </span>
                    {t.delta && (
                      <span
                        className={`text-xs font-mono font-medium tnum ${
                          t.up ? "text-up" : "text-down"
                        }`}
                      >
                        {t.up ? "▲" : "▼"}
                        {t.delta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </Spotlight>
  );
}
