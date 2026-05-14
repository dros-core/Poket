"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Package } from "lucide-react";
import { BoxMockup } from "@/components/cards/BoxMockup";
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
  logoUrl?: string;
  boxPhotoUrl?: string;
}

export function SetCard({ set, latestPrice, prevPrice, sparkData, image, logoUrl, boxPhotoUrl }: Props) {
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;
  const changeAbs = latestPrice - prevPrice;
  const isUp = change > 0.5;
  const isDown = change < -0.5;
  const vsMsrp = ((latestPrice - set.msrpKRW) / set.msrpKRW) * 100;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
      <Link
        href={`/cards/${set.id}`}
        className="card card-hover relative flex flex-col gap-4 h-full overflow-hidden group"
      >
        {/* 상단 메타 */}
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

        {/* 박스 패키지 mockup */}
        <div className="flex gap-4 items-start">
          <div className="shrink-0">
            <BoxMockup
              set={set}
              cardImage={image}
              logoUrl={logoUrl}
              boxPhotoUrl={boxPhotoUrl}
              width={108}
              height={144}
              interactive
            />
          </div>
          <div className="min-w-0 flex-1 flex flex-col h-[144px]">
            <div className="text-[10px] font-pixel tracking-widest text-[var(--fg-faint)] uppercase truncate">
              {set.series}
            </div>
            <h3 className="font-display text-base sm:text-lg leading-tight line-clamp-2 mt-1 text-[var(--fg)] tracking-tight">
              {set.nameKo}
            </h3>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-[var(--accent)] uppercase tracking-wider">
              <Package size={10} strokeWidth={2.4} />
              1 Booster Box
            </div>
            <div className="mt-auto text-[11px] text-[var(--fg-muted)] flex flex-wrap gap-x-2 gap-y-0.5">
              <span className="font-mono tnum">{formatDate(set.releaseDate)}</span>
              <span className="text-[var(--fg-faint)]">·</span>
              <span>{set.packsPerBox}팩</span>
              <span className="text-[var(--fg-faint)]">·</span>
              <span>정가 {formatPrice(set.msrpKRW)}</span>
            </div>
          </div>
        </div>

        {/* 박스 시세 (가장 prominently) */}
        <div className="pt-4 border-t border-[var(--border)] flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-pixel tracking-widest text-[var(--accent)] uppercase">
              Box Price
            </div>
            <div className="font-mono text-xl sm:text-2xl font-medium tnum leading-none mt-1.5 text-[var(--fg)]">
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
