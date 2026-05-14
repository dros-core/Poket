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
  YAxis,
  type TooltipProps
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
  { id: "1M", label: "1개월", days: 30 },
  { id: "3M", label: "3개월", days: 90 },
  { id: "6M", label: "6개월", days: 180 },
  { id: "1Y", label: "1년", days: 365 },
  { id: "ALL", label: "전체", days: "all" }
];

export function PriceTrendChart({ history, prediction, height = 320 }: Props) {
  const [range, setRange] = useState<Range>("3M");
  const [showForecast, setShowForecast] = useState(true);
  const [hovered, setHovered] = useState<{
    date: string;
    avg?: number;
    forecast?: number;
    isForecast?: boolean;
  } | null>(null);

  // 범위 필터링
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
      // 예측 시작점이 실측 끝점과 이어지도록 첫 점에 avg도 복사
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

  // 헤더용 표시값 (호버 우선, 없으면 최신)
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

  return (
    <div className="space-y-3">
      {/* 상단 동기화 헤더 */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-[var(--fg-muted)] flex items-center gap-1.5">
            <span>{displayDate ? formatDate(displayDate) : "—"}</span>
            {isForecastPoint && (
              <span className="px-1.5 py-0.5 rounded-md bg-down/10 text-down text-2xs font-semibold">
                예측
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold tnum tracking-tight mt-0.5">
            {displayValue ? formatPrice(displayValue) : "—"}
          </div>
          {!isForecastPoint && (
            <div
              className={clsx(
                "text-sm font-semibold tnum",
                isUp && "text-up",
                isDown && "text-down",
                !isUp && !isDown && "text-[var(--fg-muted)]"
              )}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"} {Math.abs(changeAbs).toLocaleString()}원 ({changePct >= 0 ? "+" : ""}
              {changePct.toFixed(1)}%) <span className="text-[var(--fg-faint)] font-normal">· {range}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* 범위 토글 */}
          <div className="flex rounded-lg bg-[var(--bg-mute)] p-0.5 border border-[var(--border)]">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={clsx(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all tnum",
                  range === r.id
                    ? "bg-[var(--bg-elev)] text-[var(--fg)] shadow-card"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          {/* 예측 토글 */}
          {prediction && (
            <button
              onClick={() => setShowForecast((v) => !v)}
              className={clsx(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all border",
                showForecast
                  ? "bg-down/10 text-down border-down/30"
                  : "bg-[var(--bg-mute)] text-[var(--fg-muted)] border-[var(--border)] hover:text-[var(--fg)]"
              )}
            >
              예측 {showForecast ? "ON" : "OFF"}
            </button>
          )}
        </div>
      </div>

      {/* 차트 */}
      <div style={{ width: "100%", height }} className="touch-pan-y">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
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
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--up)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--up)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="histGradDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--down)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--down)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--down)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--down)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--fg-faint)" }}
              interval="preserveStartEnd"
              minTickGap={36}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--fg-faint)" }}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              width={42}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--fg-muted)", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={() => null}
            />
            {/* 과거 영역 */}
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill={isUp ? "url(#histGrad)" : "url(#histGradDown)"}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
            />
            {/* 실측 라인 */}
            <Line
              type="monotone"
              dataKey="avg"
              stroke={isUp ? "var(--up)" : isDown ? "var(--down)" : "var(--fg-soft)"}
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--bg-elev)" }}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
            {/* 예측 영역 + 라인 */}
            {showForecast && prediction && (
              <>
                <Area type="monotone" dataKey="forecastBand" stroke="none" fill="url(#forecastGrad)" />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--down)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--bg-elev)" }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 text-xs text-[var(--fg-muted)] flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <span className={clsx("w-3 h-0.5", isUp ? "bg-up" : isDown ? "bg-down" : "bg-[var(--fg-muted)]")} />
          실측 시세
        </span>
        {showForecast && prediction && (
          <>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-down" style={{ borderTop: "2px dashed var(--down)" }} />
              90일 예측
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-down/20" />
              95% 신뢰구간
            </span>
          </>
        )}
        {prediction && prediction.signals.length > 0 && (
          <span className="text-[var(--fg-faint)] ml-auto">{prediction.signals[0]}</span>
        )}
      </div>
    </div>
  );
}
