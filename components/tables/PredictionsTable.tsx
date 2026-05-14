"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { CardSet, PricePrediction } from "@/lib/types";

export interface PredictionRow {
  set: CardSet;
  latest: number;
  prediction: PricePrediction;
  last: { date: string; predicted: number; lowerBound: number; upperBound: number };
  expectedChange: number;
}

export function PredictionsTable({ rows }: { rows: PredictionRow[] }) {
  return (
    <>
      <div className="hidden md:block card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-mute)] text-2xs uppercase tracking-wider text-[var(--fg-muted)]">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">세트</th>
                <th className="text-right px-4 py-2.5 font-semibold">현재가</th>
                <th className="text-right px-4 py-2.5 font-semibold">90일 예측</th>
                <th className="text-right px-4 py-2.5 font-semibold">기대 변동</th>
                <th className="text-right px-4 py-2.5 font-semibold">95% 하한</th>
                <th className="text-right px-4 py-2.5 font-semibold">95% 상한</th>
                <th className="text-right px-4 py-2.5 font-semibold">신뢰도</th>
                <th className="text-left px-4 py-2.5 font-semibold">시그널</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.set.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.4) }}
                  className="border-t border-[var(--border)] hover:bg-[var(--bg-mute)]/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/cards/${r.set.id}`} className="font-medium hover:text-brand-600 transition-colors">
                      {r.set.nameKo}
                    </Link>
                    <div className="text-2xs text-[var(--fg-faint)] font-mono mt-0.5">{r.set.code}</div>
                  </td>
                  <td className="px-4 py-3 text-right tnum">{formatPrice(r.latest)}</td>
                  <td className="px-4 py-3 text-right tnum font-bold">{formatPrice(r.last.predicted)}</td>
                  <td className="px-4 py-3 text-right">
                    <ExpectedDelta value={r.expectedChange} />
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--fg-muted)] tnum">
                    {formatPrice(r.last.lowerBound)}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--fg-muted)] tnum">
                    {formatPrice(r.last.upperBound)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ConfidenceBar value={r.prediction.confidence} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--fg-muted)]">
                    {r.prediction.signals.slice(0, 2).join(" · ")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.set.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
          >
            <Link href={`/cards/${r.set.id}`} className="card card-hover block">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-2xs font-mono text-[var(--fg-faint)]">{r.set.code}</div>
                  <h3 className="font-bold leading-tight mt-0.5">{r.set.nameKo}</h3>
                </div>
                <ConfidenceBar value={r.prediction.confidence} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[var(--bg-mute)] p-2.5">
                  <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">현재가</div>
                  <div className="font-bold tnum text-sm mt-0.5">{formatPrice(r.latest)}</div>
                </div>
                <div className="rounded-lg bg-[var(--bg-mute)] p-2.5">
                  <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">예측</div>
                  <div className="font-bold tnum text-sm mt-0.5">{formatPrice(r.last.predicted)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">기대 변동</div>
                <ExpectedDelta value={r.expectedChange} size="lg" />
              </div>
              <div className="text-2xs text-[var(--fg-muted)] mt-2 leading-snug">
                {r.prediction.signals.slice(0, 2).join(" · ")}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function ExpectedDelta({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const isUp = value > 0.5;
  const isDown = value < -0.5;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-bold tnum ${
        size === "sm" ? "text-sm" : "text-lg"
      } ${isUp ? "text-up" : isDown ? "text-down" : "text-[var(--fg-muted)]"}`}
    >
      {isUp ? <ArrowUpRight size={size === "sm" ? 13 : 16} strokeWidth={3} /> : isDown ? <ArrowDownRight size={size === "sm" ? 13 : 16} strokeWidth={3} /> : null}
      {value >= 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = value * 100;
  const tone = value > 0.7 ? "bg-emerald-500" : value > 0.5 ? "bg-sky-500" : "bg-amber-500";
  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <div className="w-12 h-1.5 rounded-full bg-[var(--bg-mute)] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-xs font-semibold tnum w-9 text-right">{pct.toFixed(0)}%</span>
    </div>
  );
}
