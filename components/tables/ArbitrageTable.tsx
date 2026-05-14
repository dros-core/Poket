"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowRight, TrendingUp, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { repository } from "@/lib/data/repository";
import { formatPrice } from "@/lib/format";
import type { ArbitrageOpportunity } from "@/lib/types";

interface Props {
  opportunities: ArbitrageOpportunity[];
  compact?: boolean;
}

const riskStyle = {
  LOW: { label: "저위험", variant: "success" as const, Icon: ShieldCheck },
  MEDIUM: { label: "중위험", variant: "warning" as const, Icon: AlertTriangle },
  HIGH: { label: "고위험", variant: "danger" as const, Icon: ShieldAlert }
};

export function ArbitrageTable({ opportunities, compact = false }: Props) {
  const list = compact ? opportunities.slice(0, 6) : opportunities;

  return (
    <>
      {/* 데스크탑 테이블 */}
      <div className="hidden md:block card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-mute)] text-2xs uppercase tracking-wider text-[var(--fg-muted)]">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">세트</th>
                <th className="text-left px-4 py-2.5 font-semibold">매수처</th>
                <th className="text-right px-4 py-2.5 font-semibold">매수가</th>
                <th className="text-left px-4 py-2.5 font-semibold">매도처</th>
                <th className="text-right px-4 py-2.5 font-semibold">매도가</th>
                <th className="text-right px-4 py-2.5 font-semibold">NET 수익</th>
                <th className="text-right px-4 py-2.5 font-semibold">마진</th>
                <th className="px-4 py-2.5 font-semibold">리스크</th>
              </tr>
            </thead>
            <tbody>
              {list.map((opp, i) => {
                const set = repository.getSet(opp.productId);
                const risk = riskStyle[opp.riskLevel];
                return (
                  <motion.tr
                    key={opp.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-t border-[var(--border)] hover:bg-[var(--bg-mute)]/60 transition-colors group"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/cards/${opp.productId}`} className="hover:text-brand-600 transition-colors">
                        {set?.nameKo ?? opp.productId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">{opp.buyChannel}</td>
                    <td className="px-4 py-3 text-right tnum">{formatPrice(opp.buyPrice)}</td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">{opp.sellChannel}</td>
                    <td className="px-4 py-3 text-right tnum">{formatPrice(opp.sellPrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-up tnum">+{formatPrice(opp.estimatedNetProfit)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <MarginBar value={opp.marginPct} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={risk.variant}>
                        <risk.Icon size={11} strokeWidth={2.5} />
                        {risk.label}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 스택 */}
      <div className="md:hidden space-y-2.5">
        {list.map((opp, i) => {
          const set = repository.getSet(opp.productId);
          const risk = riskStyle[opp.riskLevel];
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="card overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <Link
                  href={`/cards/${opp.productId}`}
                  className="font-bold leading-tight hover:text-brand-600 transition-colors"
                >
                  {set?.nameKo ?? opp.productId}
                </Link>
                <Badge variant={risk.variant}>
                  <risk.Icon size={11} strokeWidth={2.5} />
                  {risk.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="rounded-lg bg-[var(--bg-mute)] p-2.5">
                  <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">매수처</div>
                  <div className="font-semibold mt-0.5 truncate">{opp.buyChannel}</div>
                  <div className="font-bold tnum text-sm mt-1">{formatPrice(opp.buyPrice)}</div>
                </div>
                <div className="rounded-lg bg-[var(--bg-mute)] p-2.5">
                  <div className="text-2xs text-[var(--fg-muted)] uppercase tracking-wider font-semibold">매도처</div>
                  <div className="font-semibold mt-0.5 truncate">{opp.sellChannel}</div>
                  <div className="font-bold tnum text-sm mt-1">{formatPrice(opp.sellPrice)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
                <div>
                  <div className="text-2xs uppercase tracking-wider text-[var(--fg-muted)] font-semibold">
                    NET 수익
                  </div>
                  <div className="font-bold text-lg text-up tnum">
                    +{formatPrice(opp.estimatedNetProfit)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xs uppercase tracking-wider text-[var(--fg-muted)] font-semibold">
                    마진
                  </div>
                  <div className="font-bold text-lg tnum">{opp.marginPct.toFixed(1)}%</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <MarginBar value={opp.marginPct} />
                <p className="text-2xs text-[var(--fg-muted)] mt-2 leading-snug">{opp.notes}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function MarginBar({ value }: { value: number }) {
  const pct = Math.min(100, (value / 30) * 100);
  const color = value >= 15 ? "bg-emerald-500" : value >= 8 ? "bg-amber-500" : "bg-stone-400";
  return (
    <div className="inline-flex items-center gap-2 min-w-0 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-mute)] overflow-hidden">
        <motion.div
          className={clsx("h-full rounded-full", color)}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-xs font-semibold tnum w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  );
}
