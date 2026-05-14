"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Sparkles, TrendingUp } from "lucide-react";
import { PokeballLogo, PokeballOutline } from "@/components/brand/PokeballLogo";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  /** 카드 fan-out에 사용할 hero 카드 이미지 3장 */
  featuredImages?: ResolvedImage[];
}

export function Hero({ featuredImages = [] }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--bg-card)]">
      {/* 배경 레이어 1: 옐로우 → 빨강 라디얼 그라데이션 */}
      <div className="absolute inset-0 bg-radial-pkm" aria-hidden />
      <div className="absolute inset-0 bg-radial-yellow" aria-hidden />

      {/* 배경 레이어 2: 포켓볼 도트 패턴 */}
      <div className="absolute inset-0 bg-pokeball-tile opacity-40" aria-hidden />

      {/* 거대 포켓볼 워터마크 — 우측 상단 */}
      <motion.div
        initial={{ opacity: 0, rotate: -25, scale: 0.7 }}
        animate={{ opacity: 0.18, rotate: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-20 -top-20 sm:-right-24 sm:-top-24 hidden sm:block pointer-events-none"
        aria-hidden
      >
        <PokeballLogo size={380} />
      </motion.div>

      {/* 작은 부유 포켓볼들 */}
      <motion.div
        className="absolute left-8 bottom-12 hidden md:block text-pkm-red/20 animate-float pointer-events-none"
        style={{ animationDelay: "0s" }}
        aria-hidden
      >
        <PokeballOutline size={48} />
      </motion.div>
      <motion.div
        className="absolute left-32 bottom-36 hidden md:block text-pkm-yellow/30 animate-float pointer-events-none"
        style={{ animationDelay: "2s" }}
        aria-hidden
      >
        <PokeballOutline size={28} />
      </motion.div>

      {/* 카드 fan-out — 우측 (lg+) */}
      {featuredImages.length >= 3 && (
        <div className="absolute right-10 bottom-8 hidden lg:flex items-end pointer-events-none">
          {featuredImages.slice(0, 3).map((img, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: (i - 1) * 10 }}
              transition={{
                delay: 0.4 + i * 0.12,
                type: "spring",
                stiffness: 180,
                damping: 22
              }}
              className="relative rounded-xl shadow-cardLg ring-2 ring-pkm-ink/40 overflow-hidden bg-[var(--bg-card)]"
              style={{
                width: 132,
                height: 184,
                marginLeft: i === 0 ? 0 : -42,
                zIndex: 10 - i
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="132px"
                className="object-cover"
                unoptimized={img.isPlaceholder}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative px-6 sm:px-10 lg:px-14 py-14 sm:py-20 lg:py-24">
        {/* 픽셀 칩 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-pixel text-[10px] bg-pkm-ink text-pkm-yellow tracking-wider shadow-card">
            <span className="w-1.5 h-1.5 rounded-full bg-pkm-yellow animate-pulse" />
            LIVE · 29 SETS
          </span>
        </motion.div>

        {/* 메인 헤드라인 (Jua) */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] max-w-2xl"
        >
          한국 포켓몬 카드,
          <br />
          <span className="text-gradient-pkm">시세부터 매입처까지</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 sm:mt-6 text-base sm:text-lg text-[var(--fg-muted)] max-w-xl leading-relaxed"
        >
          KREAM · 너정다(ICU) · TCGBOX · 번개장터 · Mercari JP를 단일 대시보드로 통합.
          박스 EV, 90일 예측, 채널간 차익 기회까지 — 매수/매도 의사결정의 모든 근거.
        </motion.p>

        {/* CTA — 옐로우 글로우 빨강 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 sm:mt-8 flex flex-wrap gap-2.5"
        >
          <Link
            href="/cards"
            className="group inline-flex items-center gap-2 bg-pkm-red hover:bg-pkm-redDark text-white px-5 sm:px-6 py-3 rounded-2xl font-display font-bold text-base shadow-lg ring-2 ring-pkm-yellow/0 hover:ring-pkm-yellow hover:shadow-glowYellow transition-all"
          >
            <Sparkles size={18} strokeWidth={2.5} />
            박스 시세 둘러보기
            <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/arbitrage"
            className="inline-flex items-center gap-2 bg-[var(--bg-elev)] hover:bg-[var(--bg-mute)] border-2 border-[var(--border-strong)] hover:border-pkm-yellow px-5 sm:px-6 py-3 rounded-2xl font-display font-bold text-base transition-all"
          >
            <Coins size={18} strokeWidth={2.5} />
            차익 기회
          </Link>
          <Link
            href="/guide/arbitrage-playbook"
            className="inline-flex items-center gap-2 text-[var(--fg-muted)] hover:text-[var(--fg)] px-3 py-3 rounded-2xl font-medium text-base transition-colors"
          >
            <TrendingUp size={16} strokeWidth={2.5} />
            전략 가이드
          </Link>
        </motion.div>

        {/* 데이터 소스 픽셀 칩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--fg-muted)]"
        >
          <span className="font-pixel text-2xs uppercase tracking-wider text-[var(--fg-faint)]">
            DATA
          </span>
          {["KREAM", "ICU.gg", "TCGBOX", "번개", "Mercari", "TCGdex"].map((src, i) => (
            <motion.span
              key={src}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="font-semibold"
            >
              {src}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
