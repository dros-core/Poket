"use client";

import { motion, type MotionStyle } from "framer-motion";
import clsx from "clsx";

interface Props {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  reverse?: boolean;
  initialOffset?: number;
  className?: string;
}

/**
 * Magic UI 패턴: 보더 위를 빛이 따라 흐름.
 * 럭셔리 액센트로 hero/hot pick 카드에 사용.
 * MIT 라이선스 기반 자체 구현.
 */
export function BorderBeam({
  size = 60,
  duration = 8,
  delay = 0,
  colorFrom = "#C69B3C",
  colorTo = "#FFCB05",
  borderWidth = 1,
  reverse = false,
  initialOffset = 0,
  className
}: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{ padding: borderWidth }}
    >
      <motion.div
        className={clsx(
          "absolute aspect-square rounded-[inherit]",
          "bg-[linear-gradient(to_left,var(--cf),var(--ct),transparent)]",
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ["--cf" as any]: colorFrom,
          ["--ct" as any]: colorTo
        } as MotionStyle}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`]
        }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay }}
      />
    </div>
  );
}
