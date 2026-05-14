"use client";

import { useMemo } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  className?: string;
}

/**
 * 의존성 없는 경량 SVG 스파크라인.
 * Recharts보다 압도적으로 빠름. 카드/리스트에 인라인 표시.
 */
export function Sparkline({
  data,
  width = 80,
  height = 28,
  color,
  strokeWidth = 1.5,
  fillOpacity = 0.18,
  className
}: Props) {
  const { pathLine, pathArea, isUp } = useMemo(() => {
    if (data.length < 2) return { pathLine: "", pathArea: "", isUp: false };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const points = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return [x, y] as const;
    });

    const lineCmds = points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");

    const areaCmds = `${lineCmds} L ${width} ${height} L 0 ${height} Z`;

    return {
      pathLine: lineCmds,
      pathArea: areaCmds,
      isUp: data[data.length - 1] >= data[0]
    };
  }, [data, width, height]);

  if (!pathLine) return null;
  const resolvedColor = color ?? (isUp ? "var(--up)" : "var(--down)");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={pathArea} fill={resolvedColor} opacity={fillOpacity} />
      <path
        d={pathLine}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
