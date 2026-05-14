"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Coins } from "lucide-react";

const orbVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  })
};

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]">
      {/* 백드롭 - 방사형 그라데이션 + 그리드 */}
      <div className="absolute inset-0 bg-radial-brand" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_30%,transparent_75%)]" aria-hidden />

      {/* 부유하는 오브 */}
      <motion.div
        custom={0}
        variants={orbVariants}
        initial="hidden"
        animate="show"
        className="absolute -top-16 -right-8 w-48 h-48 rounded-full bg-gradient-to-br from-brand-300 to-brand-600 blur-3xl opacity-30 animate-float"
        aria-hidden
      />
      <motion.div
        custom={1}
        variants={orbVariants}
        initial="hidden"
        animate="show"
        className="absolute -bottom-20 -left-8 w-56 h-56 rounded-full bg-gradient-to-tr from-accent to-brand-500 blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />

      <div className="relative px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold backdrop-blur">
            <Sparkles size={12} strokeWidth={2.5} />
            29개 세트 · 실시간 시세 추적 중
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
        >
          한국 포켓몬 카드,<br className="hidden sm:inline" />{" "}
          <span className="text-gradient-brand">시세부터 매입처까지</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 sm:mt-6 text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl leading-relaxed"
        >
          KREAM · 너정다(ICU) · TCGBOX · 번개장터 · Mercari JP를 단일 대시보드로 통합.
          박스 EV, 90일 예측, 채널간 차익 기회까지 — 매수/매도 의사결정의 모든 근거.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-wrap gap-2.5"
        >
          <Link
            href="/cards"
            className="group inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-card hover:shadow-glow transition-all"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            박스 시세 둘러보기
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/arbitrage"
            className="inline-flex items-center gap-1.5 bg-[var(--bg-elev)] hover:bg-[var(--bg-mute)] border border-[var(--border)] px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Coins size={16} strokeWidth={2.5} />
            차익 기회 보기
          </Link>
          <Link
            href="/guide/arbitrage-playbook"
            className="inline-flex items-center gap-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] px-3 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <TrendingUp size={16} strokeWidth={2.5} />
            전략 플레이북
          </Link>
        </motion.div>

        {/* 신뢰 소스 표시 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--fg-muted)]"
        >
          <span className="font-semibold uppercase tracking-wider text-2xs">데이터 소스</span>
          {["KREAM", "너정다 (ICU)", "TCGBOX", "번개장터", "Mercari JP", "TCGdex"].map((src) => (
            <span key={src} className="font-medium">
              {src}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
