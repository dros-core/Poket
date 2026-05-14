"use client";

import Image from "next/image";
import clsx from "clsx";
import type { CardSet } from "@/lib/types";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  set: CardSet;
  cardImage: ResolvedImage;
  logoUrl?: string;
  /** 실제 박스 패키지 사진 (자체 호스팅 또는 외부 URL). 있으면 합성 mockup 대신 이걸 사용 */
  boxPhotoUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  priority?: boolean;
}

/**
 * 포켓몬 카드 부스터박스 패키지 표현.
 *
 * 우선순위:
 *   1) boxPhotoUrl이 있으면 그 이미지를 박스 사진으로 사용 (KREAM 같이 실 박스 사진)
 *   2) 없으면 합성 mockup (세트 로고 + 카드 일러스트 + 박스 외곽 디자인)
 *
 * 실 박스 사진은 자체 호스팅(public/box-images/{set-id}.jpg) 또는
 * 라이선스 클리어한 외부 URL을 setImageMap.boxPhotoUrl 에 매핑.
 */
export function BoxMockup({
  set,
  cardImage,
  logoUrl,
  boxPhotoUrl,
  width = 240,
  height = 320,
  className,
  interactive = false,
  priority = false
}: Props) {
  // === 실 박스 사진이 있으면 그것 우선 사용 ===
  if (boxPhotoUrl) {
    return (
      <div
        className={clsx(
          "relative overflow-hidden rounded-xl bg-[var(--bg-mute)]",
          interactive && "transition-transform duration-700 ease-out-expo hover:scale-[1.03] hover:-rotate-1",
          className
        )}
        style={{
          width,
          height,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
        }}
      >
        <Image
          src={boxPhotoUrl}
          alt={`${set.nameKo} 부스터박스`}
          fill
          sizes={`${width}px`}
          className="object-contain"
          priority={priority}
        />
        {/* 부드러운 보더 글로우 */}
        <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-white/5" />
      </div>
    );
  }

  // === 합성 mockup ===
  // 박스 시리즈별 컬러 (포켓몬 카드 박스 외곽 컬러)
  const seriesColor = (() => {
    const s = set.series.toLowerCase();
    if (s.includes("메가")) return { from: "#3a0608", to: "#8a0a14", accent: "#FF4D5A", label: "MEGA EVOLUTION" };
    if (s.includes("하이클래스")) return { from: "#2d2208", to: "#7a5d0a", accent: "#FFCB05", label: "HIGH CLASS" };
    if (s.includes("강화확장팩")) return { from: "#1f1145", to: "#4d2870", accent: "#a98ff3", label: "ENHANCED" };
    return { from: "#0d1622", to: "#1f3a5f", accent: "#6BA0E0", label: "BOOSTER BOX" };
  })();

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl",
        interactive && "transition-transform duration-700 ease-out-expo hover:scale-[1.03] hover:-rotate-1",
        className
      )}
      style={{
        width,
        height,
        background: `linear-gradient(170deg, ${seriesColor.from} 0%, ${seriesColor.to} 50%, ${seriesColor.from} 100%)`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 0 rgba(255,255,255,0.10), inset 0 -28px 50px rgba(0,0,0,0.35)`
      }}
    >
      {/* 박스 표면 그라데이션 텍스처 */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px)"
        }}
        aria-hidden
      />

      {/* 상단: POKÉMON 띠 + 세트 로고 */}
      <div className="absolute inset-x-0 top-0">
        <div
          className="h-[8%] flex items-center justify-center px-2"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.5), transparent)",
            borderBottom: `1px solid ${seriesColor.accent}30`
          }}
        >
          <span className="font-pixel text-[8px] tracking-[0.3em] text-white/90 uppercase">
            POKÉMON · KR
          </span>
        </div>
        <div className="h-[18%] flex items-center justify-center px-3 pt-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${set.nameKo} 로고`}
              className="max-h-full max-w-full object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]"
              loading={priority ? "eager" : "lazy"}
              style={{ filter: "brightness(1.1) contrast(1.05)" }}
            />
          ) : (
            <div className="text-white font-display tracking-tight text-sm sm:text-base text-center drop-shadow-md leading-tight">
              {set.nameKo}
            </div>
          )}
        </div>
      </div>

      {/* 중앙: 박스 핫포일 카드 일러스트 */}
      <div className="absolute inset-x-0 top-[26%] bottom-[26%] flex items-center justify-center px-4">
        {/* 글로우 halo */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${seriesColor.accent}40 0%, transparent 60%)`,
            filter: "blur(24px)"
          }}
          aria-hidden
        />
        {/* 핫포일 카드 */}
        <div
          className="relative h-full aspect-[5/7] rounded-md overflow-hidden ring-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          style={{ borderColor: `${seriesColor.accent}80`, ringColor: `${seriesColor.accent}80` } as any}
        >
          <Image
            src={cardImage.url}
            alt={`${set.nameKo} 대표 카드`}
            fill
            sizes={`${Math.round(width * 0.55)}px`}
            className="object-cover"
            unoptimized={cardImage.isPlaceholder}
            priority={priority}
          />
          {/* 홀로그래픽 핫포일 sheen */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
            style={{
              background:
                "conic-gradient(from 45deg, rgba(255,80,130,0.3), rgba(255,180,50,0.3), rgba(255,230,100,0.3), rgba(100,230,200,0.3), rgba(100,200,255,0.3), rgba(180,100,255,0.3), rgba(255,80,130,0.3))"
            }}
          />
          {/* 다이아몬드 패턴 sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent 0px, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 9px)"
            }}
          />
        </div>
      </div>

      {/* 하단: 박스 정보 라벨 (KREAM 스타일) */}
      <div className="absolute inset-x-0 bottom-0">
        {/* 분리선 글로우 */}
        <div
          className="h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${seriesColor.accent}, transparent)`,
            boxShadow: `0 0 8px ${seriesColor.accent}80`
          }}
          aria-hidden
        />
        <div className="px-3 py-2.5 flex flex-col items-center"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.65), transparent)" }}
        >
          {/* 박스 카테고리 */}
          <div
            className="font-pixel text-[8px] tracking-[0.25em] uppercase"
            style={{ color: seriesColor.accent }}
          >
            {seriesColor.label}
          </div>
          {/* 세트 이름 */}
          <div className="font-display text-white text-[11px] sm:text-xs leading-tight mt-1 line-clamp-1 text-center font-medium">
            {set.nameKo}
          </div>
          {/* 스펙 */}
          <div className="font-mono text-[8px] text-white/65 tracking-widest uppercase mt-1 text-center">
            {set.packsPerBox} Packs × {set.cardsPerPack} Cards
          </div>
        </div>
      </div>

      {/* 박스 외곽 액센트 코너 빛 */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.30) 100%)"
        }}
        aria-hidden
      />

      {/* 박스 모서리 빛줄기 */}
      <div
        className="absolute top-0 left-0 w-full h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${seriesColor.accent}80, transparent)` }}
        aria-hidden
      />
    </div>
  );
}
