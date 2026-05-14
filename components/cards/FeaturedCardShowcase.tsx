"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame } from "lucide-react";
import type { ResolvedImage } from "@/lib/data/imageResolver";
import type { CardSet } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface FeatureItem {
  set: CardSet;
  image: ResolvedImage;
  latestPrice: number;
  changePct: number;
}

interface Props {
  items: FeatureItem[];
}

/**
 * 큰 카드 1장 + 작은 3장 그리드 (Goldin auction "featured lots" 스타일).
 * 카드 자체를 비주얼 콘텐츠로 도미넌트하게 노출.
 */
export function FeaturedCardShowcase({ items }: Props) {
  if (items.length === 0) return null;
  const [hero, ...rest] = items;
  const sideItems = rest.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr] gap-3">
      {/* Hero pick */}
      <Link
        href={`/cards/${hero.set.id}`}
        className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] flex aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[480px]"
      >
        {/* 카드 이미지 (배경 풀폭) */}
        <div className="absolute inset-0">
          <Image
            src={hero.image.url}
            alt={hero.image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover blur-2xl scale-125 opacity-50"
            unoptimized={hero.image.isPlaceholder}
          />
        </div>
        {/* 어둠 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
        {/* 메인 카드 */}
        <motion.div
          whileHover={{ scale: 1.03, rotate: -2 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden sm:block"
        >
          <div
            className="absolute -inset-8 rounded-full opacity-50 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 203, 5, 0.30) 0%, rgba(238, 21, 21, 0.15) 40%, transparent 70%)",
              filter: "blur(24px)"
            }}
            aria-hidden
          />
          <div className="relative rounded-xl overflow-hidden ring-2 ring-yellow-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <Image
              src={hero.image.url}
              alt={hero.image.alt}
              width={200}
              height={280}
              className="block"
              unoptimized={hero.image.isPlaceholder}
            />
            <div className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,80,130,0.3), rgba(255,180,50,0.3), rgba(255,230,100,0.3), rgba(100,230,200,0.3), rgba(100,200,255,0.3), rgba(180,100,255,0.3), rgba(255,80,130,0.3))"
              }}
            />
          </div>
        </motion.div>
        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 self-end p-6 sm:p-8 lg:p-10 max-w-[60%]">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-pkm-yellow/15 text-pkm-yellow text-[10px] tracking-widest uppercase font-mono mb-3 border border-pkm-yellow/20">
            <Flame size={10} strokeWidth={2.4} />
            Featured Pick
          </div>
          <div className="font-pixel text-[9px] tracking-widest text-[var(--fg-faint)] uppercase">
            {hero.set.code} · {hero.set.series}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white mt-2 leading-tight">
            {hero.set.nameKo}
          </h3>
          <div className="mt-4 flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xl sm:text-2xl font-medium text-white tnum">
              {formatPrice(hero.latestPrice)}
            </span>
            <span
              className={`text-sm font-mono font-medium tnum ${
                hero.changePct >= 0 ? "text-up" : "text-down"
              }`}
            >
              {hero.changePct >= 0 ? "↑" : "↓"}
              {Math.abs(hero.changePct).toFixed(1)}%
            </span>
          </div>
          <div className="mt-4 inline-flex items-center gap-1 text-sm text-pkm-yellow group-hover:gap-2 transition-all">
            세트 상세 보기
            <ArrowUpRight size={14} strokeWidth={2} />
          </div>
        </div>
      </Link>

      {/* 사이드 3개 */}
      <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
        {sideItems.map((item) => (
          <Link
            key={item.set.id}
            href={`/cards/${item.set.id}`}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col aspect-[3/4] md:aspect-auto md:flex-row md:min-h-[154px]"
          >
            {/* 카드 이미지 (작은 사이즈, 좌측 또는 풀폭) */}
            <div className="relative md:w-[40%] aspect-[3/4] md:aspect-auto overflow-hidden">
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes="(min-width: 768px) 200px, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxe"
                unoptimized={item.image.isPlaceholder}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>
            {/* 정보 */}
            <div className="md:flex-1 p-3 md:p-4 flex flex-col justify-center">
              <div className="font-pixel text-[8px] tracking-widest text-[var(--fg-faint)] uppercase truncate">
                {item.set.code}
              </div>
              <div className="font-display text-sm md:text-base text-[var(--fg)] mt-1 leading-tight line-clamp-2">
                {item.set.nameKo}
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-sm font-medium text-[var(--fg)] tnum">
                  {formatPrice(item.latestPrice)}
                </span>
                <span
                  className={`text-[10px] font-mono tnum ${
                    item.changePct >= 0 ? "text-up" : "text-down"
                  }`}
                >
                  {item.changePct >= 0 ? "+" : ""}
                  {item.changePct.toFixed(1)}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
