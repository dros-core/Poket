"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Marquee } from "@/components/ui/Marquee";
import { PokeballOutline } from "@/components/brand/PokeballLogo";
import { PokemonMascot } from "@/components/brand/PokemonMascot";
import { ENERGY_TYPES } from "@/components/brand/EnergyIcons";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  /** 카드 컬렉션 — 첫 번째가 메인 hero 카드 */
  featuredImages?: ResolvedImage[];
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
  const mainCard = featuredImages[0];
  const sideCards = featuredImages.slice(1, 3);

  return (
    <Spotlight className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]" color="rgba(255, 203, 5, 0.10)" size={800}>
      <BorderBeam size={140} duration={14} colorFrom="#C69B3C" colorTo="#FFCB05" />

      <section className="relative isolate overflow-hidden rounded-3xl">
        {/* 1. 백드롭 그라데이션 */}
        <div className="absolute inset-0 bg-grid-luxe opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-aurora opacity-60" aria-hidden />

        {/* 2. 거대 글로우 halo (메인 카드 뒤) */}
        <div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-50 hidden md:block"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 203, 5, 0.20) 0%, rgba(238, 21, 21, 0.10) 30%, transparent 60%)",
            filter: "blur(40px)"
          }}
          aria-hidden
        />

        {/* 3. 부유하는 에너지 심볼 — 미세하게 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {ENERGY_TYPES.slice(0, 6).map((t, i) => {
            const positions = [
              { left: "5%", top: "15%", delay: 0 },
              { left: "92%", top: "70%", delay: 1 },
              { left: "8%", top: "70%", delay: 2 },
              { left: "45%", top: "8%", delay: 1.5 },
              { left: "55%", top: "85%", delay: 0.5 },
              { left: "85%", top: "12%", delay: 2.5 }
            ][i];
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.10, scale: 1 }}
                transition={{ delay: 0.8 + positions.delay * 0.2, duration: 1.2 }}
                className="absolute float-slow"
                style={{
                  left: positions.left,
                  top: positions.top,
                  color: t.color,
                  animationDelay: `${positions.delay}s`
                }}
              >
                <t.Icon size={i % 2 === 0 ? 48 : 32} />
              </motion.div>
            );
          })}
        </div>

        {/* 4. 우측 메인 카드 디스플레이 */}
        {mainCard && (
          <div className="absolute right-0 top-0 bottom-0 hidden md:flex items-center justify-end pr-8 lg:pr-14 pointer-events-none w-[48%] lg:w-[46%]">
            <div className="relative w-full h-[480px]">
              {/* 사이드 카드 (블러, 회전) */}
              {sideCards.map((img, i) => {
                const isLeft = i === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 60, rotate: 0, x: 0 }}
                    animate={{
                      opacity: 0.55,
                      y: 0,
                      rotate: isLeft ? -12 : 12,
                      x: isLeft ? -110 : 110
                    }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    style={{ zIndex: 1, filter: "blur(2px) brightness(0.7)" }}
                  >
                    <div className="relative w-[200px] h-[280px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-cardLg">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="200px"
                        className="object-cover"
                        unoptimized={img.isPlaceholder}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {/* 메인 카드 (도미넌트) */}
              <motion.div
                initial={{ opacity: 0, y: 80, scale: 0.85, rotate: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
                transition={{ delay: 0.3, duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ zIndex: 3 }}
              >
                {/* 카드 글로우 halo */}
                <div
                  className="absolute -inset-12 rounded-full opacity-60 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 203, 5, 0.35) 0%, rgba(238, 21, 21, 0.15) 40%, transparent 70%)",
                    filter: "blur(30px)"
                  }}
                  aria-hidden
                />
                {/* 회전 광선 (Linear style border beam) */}
                <div className="relative rounded-2xl overflow-hidden ring-2 ring-yellow-400/30 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(255,203,5,0.25)]">
                  <Image
                    src={mainCard.url}
                    alt={mainCard.alt}
                    width={280}
                    height={392}
                    className="block"
                    unoptimized={mainCard.isPlaceholder}
                    priority
                  />
                  {/* 홀로그래픽 오버레이 */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
                    style={{
                      background:
                        "conic-gradient(from 0deg at 50% 50%, rgba(255,80,130,0.25), rgba(255,180,50,0.25), rgba(255,230,100,0.25), rgba(100,230,200,0.25), rgba(100,200,255,0.25), rgba(180,100,255,0.25), rgba(255,80,130,0.25))"
                    }}
                  />
                  {/* 하단 페이드 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* 작은 부유 포켓볼 (장식) */}
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 0.15, rotate: 0 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="absolute top-4 right-4 text-pkm-yellow/30 spin-slow"
              >
                <PokeballOutline size={48} />
              </motion.div>

              {/* 피카츄 마스코트 — 카드 옆 작게 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 0.9, scale: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="absolute bottom-0 -left-4 lg:left-0 pointer-events-none"
                style={{ zIndex: 4 }}
              >
                <div className="relative">
                  <div
                    className="absolute -inset-6 rounded-full opacity-60 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(255,203,5,0.45) 0%, transparent 60%)",
                      filter: "blur(20px)"
                    }}
                    aria-hidden
                  />
                  <PokemonMascot pokemon="pikachu" size={130} floating priority />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* 좌측 큰 마스코트 — 메가리자몽 분위기 (절제된 opacity) */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.8 }}
          animate={{ opacity: 0.08, x: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.4 }}
          className="absolute -left-32 bottom-0 hidden lg:block pointer-events-none"
          aria-hidden
        >
          <PokemonMascot pokemon="charizard" size={420} />
        </motion.div>

        {/* 5. 메인 콘텐츠 */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 sm:py-20 lg:py-24 max-w-full md:max-w-[600px]">
          {/* Live chip */}
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

          {/* 헤드라인 */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={luxeFadeUp}
            transition={{ delay: 0.08 }}
            className="mt-6 font-display text-[2.75rem] leading-[1] sm:text-6xl lg:text-7xl tracking-tight text-[var(--fg)]"
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

          {/* 모바일 메인 카드 + 피카츄 */}
          {mainCard && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.32, 0.72, 0, 1] }}
              className="md:hidden mt-8 flex justify-center items-end gap-2"
            >
              <div className="relative">
                <div
                  className="absolute -inset-8 rounded-full opacity-50 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 203, 5, 0.35) 0%, rgba(238, 21, 21, 0.15) 40%, transparent 70%)",
                    filter: "blur(20px)"
                  }}
                  aria-hidden
                />
                <div className="relative rounded-2xl overflow-hidden ring-2 ring-yellow-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(255,203,5,0.25)]">
                  <Image
                    src={mainCard.url}
                    alt={mainCard.alt}
                    width={200}
                    height={280}
                    className="block"
                    unoptimized={mainCard.isPlaceholder}
                    priority
                  />
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
                    style={{
                      background:
                        "conic-gradient(from 0deg at 50% 50%, rgba(255,80,130,0.25), rgba(255,180,50,0.25), rgba(255,230,100,0.25), rgba(100,230,200,0.25), rgba(100,200,255,0.25), rgba(180,100,255,0.25), rgba(255,80,130,0.25))"
                    }}
                  />
                </div>
              </div>
              <div className="-mb-2">
                <PokemonMascot pokemon="pikachu" size={86} floating />
              </div>
            </motion.div>
          )}

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

        {/* 6. KPI Ticker */}
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

        {/* 7. Data source marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
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
      </section>
    </Spotlight>
  );
}
