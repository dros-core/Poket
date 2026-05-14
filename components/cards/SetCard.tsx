"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
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
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>
      <Link
        href={`/cards/${set.id}`}
        className="card card-hover relative flex flex-col gap-3 h-full overflow-hidden group"
      >
        {/* 상단: 코드 칩 + 상태 */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-2xs uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[var(--bg-mute)] text-[var(--fg-muted)]">
            {set.code}
          </span>
          <span
            className={clsx(
              "text-2xs font-semibold px-2 py-0.5 rounded-full",
              set.isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
            )}
          >
            {set.isActive ? "유통중" : "절판"}
          </span>
        </div>

        {/* 중앙: 이미지 + 정보 */}
        <div className="flex gap-3.5">
          <div className="relative shrink-0 overflow-hidden rounded-lg">
            <div className="transition-transform duration-500 ease-out-expo group-hover:scale-[1.06]">
              <CardImage image={image} variant="card" width={88} height={123} />
            </div>
          </div>
          <div className="min-w-0 flex-1 flex flex-col">
            <div className="text-2xs text-[var(--fg-faint)] truncate">{set.series}</div>
            <h3 className="font-bold text-base leading-tight line-clamp-2 mt-0.5">{set.nameKo}</h3>
            <div className="mt-auto text-2xs text-[var(--fg-muted)] flex flex-wrap gap-x-2 gap-y-0.5">
              <span>{formatDate(set.releaseDate)}</span>
              <span>·</span>
              <span>{set.packsPerBox}팩</span>
            </div>
          </div>
        </div>

        {/* 하단: 가격 + 스파크라인 */}
        <div className="pt-3 border-t border-[var(--border)] flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-2xs uppercase tracking-wider text-[var(--fg-faint)] font-semibold">
              박스 시세
            </div>
            <div className="font-bold text-lg tnum tracking-tight leading-none mt-1">
              {formatPrice(latestPrice)}
            </div>
            <div
              className={clsx(
                "inline-flex items-center gap-0.5 text-xs font-semibold tnum mt-1",
                isUp ? "text-up" : isDown ? "text-down" : "text-[var(--fg-muted)]"
              )}
            >
              {isUp ? <ArrowUpRight size={11} strokeWidth={3} /> : isDown ? <ArrowDownRight size={11} strokeWidth={3} /> : <Minus size={11} strokeWidth={3} />}
              {Math.abs(changeAbs).toLocaleString()}원 ({change >= 0 ? "+" : ""}
              {change.toFixed(1)}%)
            </div>
          </div>
          {sparkData && sparkData.length >= 4 && (
            <div className="shrink-0">
              <Sparkline data={sparkData} width={68} height={32} />
              <div
                className={clsx(
                  "text-2xs font-semibold mt-1 text-right",
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
