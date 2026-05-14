"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
  className?: string;
}

/**
 * Magic UI 패턴: 무한 스크롤 마퀴.
 * 데이터 소스, 카드 행 등에 사용. 양 가장자리 페이드 마스크 자동 적용.
 */
export function Marquee({
  children,
  pauseOnHover = false,
  reverse = false,
  vertical = false,
  repeat = 4,
  duration = "40s",
  className
}: Props) {
  return (
    <div
      className={clsx(
        "group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] scroll-fade-x",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={{ ["--duration" as any]: duration }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-v flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
