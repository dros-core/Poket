"use client";

import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import clsx from "clsx";
import type { PricePrediction, PriceTrendPoint } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/format";

interface Props {
  history: PriceTrendPoint[];
  prediction?: PricePrediction | null;
  height?: number;
}

type Range = "1M" | "3M" | "6M" | "1Y" | "ALL";

const ranges: { id: Range; label: string; days: number | "all" }[] = [
  { id: "1M", label: "1M", days: 30 },
  { id: "3M", label: "3M", days: 90 },
  { id: "6M", label: "6M", days: 180 },
  { id: "1Y", label: "1Y", days: 365 },
  { id: "ALL", label: "ALL", days: "all" }
];

export function PriceTrendChart({ history, prediction, height = 340 }: Props) {
  const [range, setRange] = useState<Range>("3M");
  const [showForecast, setShowForecast] = useState(true);
  const [hovered, setHovered] = useState<{
    date: string;
    avg?: number;
    forecast?: number;
    isForecast?: boolean;
  } | null>(null);

  const filteredHistory = useMemo(() => {
    if (history.length === 0) return [];
    const r = ranges.find((x) => x.id === range)!;
    if (r.days === "all") return history;
    return history.slice(Math.max(0, history.length - Math.ceil(r.days / 7)));
  }, [history, range]);

  const data = useMemo(() => {
    const arr: any[] = filteredHistory.map((h) => ({
      date: h.date,
      avg: h.avg,
      band: [h.min, h.max] as [number, number]
    }));
    if (showForecast && prediction) {
      prediction.forecast.forEach((f, i) => {
        arr.push({
          date: f.date,
          forecast: f.predicted,
          forecastBand: [f.lowerBound, f.upperBound] as [number, number],
          ...(i === 0 ? { avg: filteredHistory[filteredHistory.length - 1]?.avg } : {})
        });
      });
    }
    return arr;
  }, [filteredHistory, prediction, showForecast]);

  const latestPoint = filteredHistory[filteredHistory.length - 1];
  const firstPoint = filteredHistory[0];
  const displayValue = hovered?.avg ?? hovered?.forecast ?? latestPoint?.avg;
  const displayDate = hovered?.date ?? latestPoint?.date;
  const startValue = firstPoint?.avg;
  const changeAbs = displayValue && startValue ? displayValue - startValue : 0;
  const changePct = startValue ? (changeAbs / startValue) * 100 : 0;
  const isUp = changeAbs > 0;
  const isDown = changeAbs < 0;
  const isForecastPoint = !!hovered?.isForecast;
  const accentColor = isUp ? "var(--up)" : isDown ? "var(--down)" : "var(--fg-soft)";

  return (
    <div className="space-y-4">
      {/* 상단 헤더 — Robinhood 스타일 호버 동기화 */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--fg-faint)] font-mono flex items-center gap-1.5">
            <span>{displayDate ? formatDate(displayDate) : "—"}</span>
            {isForecastPoint && (
              <span className="px-1.5 py-0.5 rounded bg-[var(--accent-bg)] text-[var(--accent)] text-[9px] uppercase tracking-widest">
                Forecast
              </span>
            )}
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-medium tnum mt-1 text-[var(--fg)]">
            {displayValue ? formatPrice(displayValue) : "—"}
          </div>
          {!isForecastPoint && (
            <div
              className={clsx(
                "text-sm font-mono font-medium tnum mt-1",
                isUp && "text-up",
                isDown && "text-down",
                !isUp && !isDown && "text-[var(--fg-muted)]"
              )}
            >
              {isUp ? "↑" : isDown ? "↓" : "—"} {Math.abs(changeAbs).toLocaleString()}원
              <span className="text-[var(--fg-faint)] mx-1.5">·</span>
              {changePct >= 0 ? "+" : ""}{changePct.toFixed(1)}%
              <span className="text-[var(--fg-faint)] ml-2 text-xs">{range}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Range toggle */}
          <div className="flex rounded-lg bg-[var(--bg-mute)] p-0.5 border border-[var(--border)]">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={clsx(
                  "px-3 py-1 text-[11px] font-mono rounded-md transition-all tnum tracking-wider",
                  range === r.id
                    ? "bg-[var(--bg-elev)] text-[var(--fg)] shadow-card"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg-soft)]"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          {prediction && (
            <button
              onClick={() => setShowForecast((v) => !v)}
              className={clsx(
                "px-3 py-1 text-[11px] font-mono rounded-md transition-all border tracking-wider",
                showForecast
                  ? "bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent)]/30"
                  : "bg-[var(--bg-mute)] text-[var(--fg-muted)] border-[var(--border)] hover:text-[var(--fg-soft)]"
              )}
            >
              Forecast {showForecast ? "ON" : "OFF"}
            </button>
          )}
        </div>
      </div>

      {/* Chart canvas */}
      <div style={{ width: "100%", height }} className="touch-pan-y">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 4, bottom: 0, left: 0 }}
            onMouseLeave={() => setHovered(null)}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                const p = state.activePayload[0].payload;
                setHovered({
                  date: p.date,
                  avg: p.avg,
                  forecast: p.forecast,
                  isForecast: p.forecast !== undefined && p.avg === undefined
                });
              }
            }}
          >
            <defs>
              <linearGradient id="histGradUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--up)" stopOpacity={0.30} />
                <stop offset="100%" stopColor="var(--up)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="histGradDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--down)" stopOpacity={0.30} />
                <stop offset="100%" stopColor="var(--down)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.20} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              {/* Glow filter */}
              <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--fg-faint)", fontFamily: "Geist Mono, monospace" }}
              interval="preserveStartEnd"
              minTickGap={48}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--fg-faint)", fontFamily: "Geist Mono, monospace" }}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              width={42}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--fg-muted)", strokeWidth: 1, strokeDasharray: "3 6" }}
              content={() => null}
            />
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill={isUp ? "url(#histGradUp)" : "url(#histGradDown)"}
              isAnimationActive
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke={accentColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-card)", fill: accentColor }}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            />
            {showForecast && prediction && (
              <>
                <Area type="monotone" dataKey="forecastBand" stroke="none" fill="url(#forecastGrad)" />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-card)", fill: "var(--accent)" }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend strip */}
      <div className="flex items-center gap-5 text-xs text-[var(--fg-muted)] flex-wrap font-mono tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className={clsx("w-3 h-0.5", isUp ? "bg-up" : isDown ? "bg-down" : "bg-[var(--fg-muted)]")} />
          실측 시세
        </span>
        {showForecast && prediction && (
          <>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[var(--accent)]" style={{ background: "repeating-linear-gradient(to right, var(--accent) 0 4px, transparent 4px 8px)" }} />
              90일 예측
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-2 rounded-sm bg-[var(--accent-bg)]" />
              95% 신뢰구간
            </span>
          </>
        )}
        {prediction && prediction.signals.length > 0 && (
          <span className="text-[var(--fg-faint)] ml-auto text-[10px] tracking-widest uppercase">
            {prediction.signals[0]}
          </span>
        )}
      </div>
    </div>
  );
}
