"use client";

import { TrendingDown, TrendingUp, Wallet, Package } from "lucide-react";
import clsx from "clsx";
import { formatPrice, formatPct, formatNumber } from "@/lib/format";
import type { PortfolioSummary as Summary } from "@/lib/portfolio/types";

interface Props {
  summary: Summary;
  setNameMap: Record<string, string>;
}

export function PortfolioSummary({ summary, setNameMap }: Props) {
  const positive = summary.totalPnl >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="평가액"
        value={formatPrice(summary.totalValue)}
        sub={`매입 ${formatPrice(summary.totalCost)}`}
        icon={<Wallet size={16} strokeWidth={2.2} className="text-[var(--accent)]" />}
      />
      <StatCard
        label="총 손익"
        value={formatPrice(summary.totalPnl)}
        sub={formatPct(summary.totalPnlPct)}
        tone={positive ? "up" : "down"}
        icon={
          positive ? (
            <TrendingUp size={16} strokeWidth={2.2} className="text-[var(--up)]" />
          ) : (
            <TrendingDown size={16} strokeWidth={2.2} className="text-[var(--down)]" />
          )
        }
      />
      <StatCard
        label="보유 박스"
        value={`${formatNumber(summary.totalQuantity)}개`}
        sub={`${summary.totalHoldings}건의 매입`}
        icon={<Package size={16} strokeWidth={2.2} className="text-[var(--fg-muted)]" />}
      />
      <StatCard
        label={summary.bestPerformer ? "베스트 / 워스트" : "성과"}
        value={
          summary.bestPerformer
            ? `${setNameMap[summary.bestPerformer.setId] ?? summary.bestPerformer.setId} ${formatPct(summary.bestPerformer.pnlPct)}`
            : "—"
        }
        sub={
          summary.worstPerformer && summary.worstPerformer.setId !== summary.bestPerformer?.setId
            ? `${setNameMap[summary.worstPerformer.setId] ?? summary.worstPerformer.setId} ${formatPct(summary.worstPerformer.pnlPct)}`
            : "보유 박스를 추가하면 표시됩니다"
        }
        small
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  small?: boolean;
}

function StatCard({ label, value, sub, tone = "neutral", icon, small }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2 min-h-[110px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)]">
          {label}
        </span>
        {icon}
      </div>
      <div
        className={clsx(
          "font-display font-medium leading-tight",
          small ? "text-sm sm:text-base" : "text-lg sm:text-2xl",
          tone === "up" && "text-[var(--up)]",
          tone === "down" && "text-[var(--down)]"
        )}
      >
        {value}
      </div>
      {sub && (
        <div className={clsx(
          "text-[11px] font-mono",
          tone === "up" && "text-[var(--up)]",
          tone === "down" && "text-[var(--down)]",
          tone === "neutral" && "text-[var(--fg-muted)]"
        )}>
          {sub}
        </div>
      )}
    </div>
  );
}
