"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { PokemonMascot, type MascotKey } from "@/components/brand/PokemonMascot";

interface Props {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  description?: string;
  /** 헤더 우측 떠있는 포켓몬 마스코트 */
  mascot?: MascotKey;
  /** 마스코트 크기 (기본 110) */
  mascotSize?: number;
  /** 백드롭 그라데이션 강도 */
  accent?: "gold" | "red" | "blue" | "purple";
  children?: React.ReactNode;
}

const accentMap = {
  gold: "rgba(255, 203, 5, 0.18)",
  red: "rgba(238, 21, 21, 0.16)",
  blue: "rgba(61, 125, 202, 0.16)",
  purple: "rgba(126, 77, 255, 0.16)"
};

export function PageHero({ eyebrow, eyebrowIcon, title, description, mascot, mascotSize = 110, accent = "gold", children }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] px-6 sm:px-10 py-10 sm:py-14">
      {/* Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 80% 20%, ${accentMap[accent]}, transparent 70%)`
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid-luxe opacity-40" aria-hidden />

      {/* Mascot */}
      {mascot && (
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div className="relative">
            <div
              className={clsx(
                "absolute rounded-full pointer-events-none",
                "opacity-50 blur-2xl"
              )}
              style={{
                inset: -mascotSize * 0.15,
                background: `radial-gradient(circle, ${accentMap[accent]} 0%, transparent 70%)`
              }}
              aria-hidden
            />
            <PokemonMascot pokemon={mascot} size={mascotSize} floating />
          </div>
        </motion.div>
      )}

      <div className="relative z-10 max-w-2xl">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-mono tracking-widest uppercase mb-4"
          >
            {eyebrowIcon}
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--fg)] leading-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="mt-4 text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed max-w-xl pr-20 sm:pr-32"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.18 }}
            className="mt-5"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
