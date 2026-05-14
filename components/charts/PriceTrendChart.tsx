"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { PricePrediction, PriceTrendPoint } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface Props {
  history: PriceTrendPoint[];
  prediction?: PricePrediction | null;
  height?: number;
}

export function PriceTrendChart({ history, prediction, height = 320 }: Props) {
  const data = [
    ...history.map((h) => ({
      date: h.date,
      avg: h.avg,
      band: [h.min, h.max] as [number, number],
      type: "actual" as const
    })),
    ...(prediction?.forecast ?? []).map((f) => ({
      date: f.date,
      forecast: f.predicted,
      forecastBand: [f.lowerBound, f.upperBound] as [number, number],
      type: "forecast" as const
    }))
  ];

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 18, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            width={56}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (Array.isArray(value)) {
                const [low, high] = value as unknown as number[];
                return [`${formatPrice(low)} ~ ${formatPrice(high)}`, name];
              }
              return [formatPrice(value), name];
            }}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{ borderRadius: 10, border: "1px solid #e7e5e4" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="band"
            name="과거 변동폭(min/max)"
            stroke="none"
            fill="#fdba74"
            fillOpacity={0.18}
          />
          <Line
            type="monotone"
            dataKey="avg"
            name="실측 평균"
            stroke="#ea580c"
            strokeWidth={2.4}
            dot={false}
          />
          {prediction && (
            <Area
              type="monotone"
              dataKey="forecastBand"
              name="예측 95% 신뢰구간"
              stroke="none"
              fill="#38bdf8"
              fillOpacity={0.16}
            />
          )}
          {prediction && (
            <Line
              type="monotone"
              dataKey="forecast"
              name="예측"
              stroke="#0284c7"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
