"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * 뷰포트 진입 시 0 → target까지 spring-tween 카운터 애니메이션.
 * KPI Stat 카드 등에 사용.
 */
export function AnimatedCounter({ value, duration = 1.2, format, className, prefix = "", suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20, mass: 0.6 });
  const display = useTransform(spring, (latest) => {
    return format ? format(latest) : new Intl.NumberFormat("ko-KR").format(Math.round(latest));
  });
  const [text, setText] = useState(format ? format(0) : "0");

  useEffect(() => {
    return display.on("change", (v) => setText(v));
  }, [display]);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
