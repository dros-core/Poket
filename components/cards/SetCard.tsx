"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from "lucide-react";
import { CardImage } from "@/components/cards/CardImage";
import { Sparkline } from "@/components/cards/Sparkline";
import type { CardSet } from "@/lib/types";
import type { ResolvedImage } from "@/lib/data/imageResolver";
import { formatPrice, formatDate } from "@/lib/format";

interface Props {
  set: CardSet;
  latestPrice: number;
  prevPrice: number;
  sparkData?: number[];
  image: ResolvedImage;
}

export function SetCard({ set, latestPrice, prevPrice, sparkData, image }: Props) {
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;
  const changeAbs = latestPrice - prevPrice;
  const isUp = change > 0.5;
  const isDown = change < -0.5;
  const vsMsrp = ((latestPrice - set.msrpKRW) / set.msrpKRW) * 100;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
      <Link
        href={`/cards/${set.id}`}
        onMouseMove={(e) => {
          const target = e.currentTarget;
          const r = target.getBoundingClientRect();
          target.style.setProperty("--mx", `${e.clientX - r.left}px`);
          target.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        className="card card-hover holo relative flex flex-col gap-4 h-full overflow-hidden group"
      >
        {/* 상단: 코드 · 상태 · 화살표 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--bg-mute)] text-[var(--fg-faint)] border border-[var(--border)]">
              {set.code}
            </span>
            <span
              className={clsx(
                "text-[9px] uppercase tracking-widest font-pixel px-1.5 py-0.5 rounded",
                set.isActive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-[var(--fg-faint)] bg-[var(--bg-mute)] border border-[var(--border)]"
              )}
            >
              {set.isActive ? "Active" : "Closed"}
            </span>
          </div>
          <ChevronRight
            size={14}
            strokeWidth={1.8}
            className="text-[var(--fg-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all"
          />
        </div>

        {/* 메인: 이미지 + 정보 */}
        <div className="flex gap-4 relative">
          <div className="relative shrink-0 overflow-hidden rounded-xl ring-1 ring-white/5">
            <div className="transition-transform duration-700 ease-luxe group-hover:scale-[1.04]">
              <CardImage image={image} variant="card" width={92} height={128} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="min-w-0 flex-1 flex flex-col">
            <div className="text-[10px] font-pixel tracking-widest text-[var(--fg-faint)] uppercase truncate">
              {set.series}
            </div>
            <h3 className="font-display text-lg leading-tight line-clamp-2 mt-1 text-[var(--fg)] tracking-tight">
              {set.nameKo}
            </h3>
            <div className="mt-auto text-[11px] text-[var(--fg-muted)] flex flex-wrap gap-x-3 gap-y-0.5">
              <span className="font-mono tnum">{formatDate(set.releaseDate)}</span>
              <span className="text-[var(--fg-faint)]">·</span>
              <span>{set.packsPerBox}팩</span>
            </div>
          </div>
        </div>

        {/* 하단: 가격 + 스파크라인 */}
        <div className="pt-4 border-t border-[var(--border)] flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-pixel tracking-widest text-[var(--fg-faint)] uppercase">
              Box Price
            </div>
            <div className="font-mono text-xl font-medium tnum leading-none mt-1.5 text-[var(--fg)]">
              {formatPrice(latestPrice)}
            </div>
            <div
              className={clsx(
                "inline-flex items-center gap-0.5 text-xs font-mono font-medium tnum mt-1.5",
                isUp ? "text-up" : isDown ? "text-down" : "text-[var(--fg-muted)]"
              )}
            >
              {isUp ? <ArrowUpRight size={11} strokeWidth={2.4} /> : isDown ? <ArrowDownRight size={11} strokeWidth={2.4} /> : <Minus size={11} strokeWidth={2.4} />}
              {Math.abs(changeAbs).toLocaleString()}원 ({change >= 0 ? "+" : ""}
              {change.toFixed(1)}%)
            </div>
          </div>
          {sparkData && sparkData.length >= 4 && (
            <div className="shrink-0">
              <Sparkline data={sparkData} width={72} height={32} strokeWidth={1.8} fillOpacity={0.16} />
              <div
                className={clsx(
                  "text-[10px] font-pixel tracking-widest uppercase mt-1.5 text-right",
                  vsMsrp > 0 ? "text-up" : vsMsrp < 0 ? "text-down" : "text-[var(--fg-muted)]"
                )}
              >
                MSRP {vsMsrp >= 0 ? "+" : ""}
                {vsMsrp.toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
