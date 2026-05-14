"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Sparkline } from "@/components/cards/Sparkline";
import { formatPrice, formatPct } from "@/lib/format";
import type { CardSet } from "@/lib/types";

export interface TrendRow {
  set: CardSet;
  latest: number;
  msrp: number;
  change30d: number;
  change90d: number;
  sinceLaunch: number;
  spark?: number[];
}

interface Props {
  rows: TrendRow[];
}

export function TrendsTable({ rows }: Props) {
  return (
    <>
      <div className="hidden md:block card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-mute)] text-2xs uppercase tracking-wider text-[var(--fg-muted)]">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">세트</th>
                <th className="text-right px-4 py-2.5 font-semibold">정가</th>
                <th className="text-right px-4 py-2.5 font-semibold">현재가</th>
                <th className="text-right px-4 py-2.5 font-semibold">정가 대비</th>
                <th className="text-right px-4 py-2.5 font-semibold">30일</th>
                <th className="text-right px-4 py-2.5 font-semibold">90일</th>
                <th className="text-right px-4 py-2.5 font-semibold">누적</th>
                <th className="text-right px-4 py-2.5 font-semibold">추세</th>
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
                    <div className="text-2xs text-[var(--fg-faint)] mt-0.5">
                      <span className="font-mono">{r.set.code}</span> · {r.set.series}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tnum text-[var(--fg-muted)]">{formatPrice(r.msrp)}</td>
                  <td className="px-4 py-3 text-right tnum font-bold">{formatPrice(r.latest)}</td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={((r.latest - r.msrp) / r.msrp) * 100} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={r.change30d} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={r.change90d} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={r.sinceLaunch} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.spark && r.spark.length >= 4 && (
                      <div className="inline-block">
                        <Sparkline data={r.spark} width={60} height={24} />
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 */}
      <div className="md:hidden space-y-2.5">
        {rows.map((r, i) => {
          const vsMsrp = ((r.latest - r.msrp) / r.msrp) * 100;
          return (
            <motion.div
              key={r.set.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
            >
              <Link href={`/cards/${r.set.id}`} className="card card-hover block">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-2xs text-[var(--fg-faint)] font-mono">{r.set.code}</div>
                    <div className="font-bold leading-tight mt-0.5">{r.set.nameKo}</div>
                    <div className="text-2xs text-[var(--fg-muted)] mt-0.5">{r.set.series}</div>
                  </div>
                  {r.spark && r.spark.length >= 4 && <Sparkline data={r.spark} width={64} height={28} />}
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">
                      현재가
                    </div>
                    <div className="font-bold tnum text-base mt-0.5">{formatPrice(r.latest)}</div>
                    <div className="text-2xs text-[var(--fg-faint)] tnum">정가 {formatPrice(r.msrp)}</div>
                  </div>
                  <div>
                    <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">
                      정가 대비
                    </div>
                    <div className="mt-0.5">
                      <ChangeText value={vsMsrp} size="lg" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Mini label="30일" value={r.change30d} />
                  <Mini label="90일" value={r.change90d} />
                  <Mini label="누적" value={r.sinceLaunch} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function ChangeText({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const isUp = value > 0.1;
  const isDown = value < -0.1;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 font-semibold tnum",
        size === "sm" ? "text-xs" : "text-base",
        isUp ? "text-up" : isDown ? "text-down" : "text-[var(--fg-muted)]"
      )}
    >
      {isUp ? <ArrowUpRight size={size === "sm" ? 11 : 14} strokeWidth={3} /> : isDown ? <ArrowDownRight size={size === "sm" ? 11 : 14} strokeWidth={3} /> : <Minus size={size === "sm" ? 11 : 14} strokeWidth={3} />}
      {formatPct(value)}
    </span>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[var(--bg-mute)] py-1.5 px-1">
      <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">{label}</div>
      <div className="mt-0.5">
        <ChangeText value={value} />
      </div>
    </div>
  );
}
