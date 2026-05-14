"use client";

import { useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";

/**
 * 마우스 추적 spotlight 효과 — Aceternity UI 패턴.
 * 자식 요소 위에 부드러운 빛 원이 따라옴.
 */
export function Spotlight({
  children,
  className,
  color = "rgba(255, 203, 5, 0.08)",
  size = 600
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 40%)`
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
