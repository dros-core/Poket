"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { formatPrice, formatPct, formatDate } from "@/lib/format";
import type { HoldingValuation } from "@/lib/portfolio/types";

interface Props {
  valuations: HoldingValuation[];
  setNameMap: Record<string, string>;
  onRemove: (id: string) => void;
}

export function HoldingsTable({ valuations, setNameMap, onRemove }: Props) {
  if (valuations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
        <p className="text-[var(--fg-muted)] text-sm">
          아직 보유 박스가 등록되지 않았습니다. 우측 상단의 <span className="text-[var(--accent)] font-medium">+ 보유 박스 추가</span> 버튼으로 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 데스크 테이블 */}
      <div className="hidden md:block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-mute)]/50 border-b border-[var(--border)]">
            <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)]">
              <th className="px-4 py-3">세트</th>
              <th className="px-4 py-3 text-right">수량</th>
              <th className="px-4 py-3 text-right">매입가</th>
              <th className="px-4 py-3 text-right">현재가</th>
              <th className="px-4 py-3 text-right">평가액</th>
              <th className="px-4 py-3 text-right">손익</th>
              <th className="px-4 py-3 text-right">매입일</th>
              <th className="px-4 py-3 text-right" aria-label="작업"></th>
            </tr>
          </thead>
          <tbody>
            {valuations.map((v) => (
              <tr
                key={v.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-mute)]/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link href={`/cards/${v.setId}`} className="text-[var(--fg)] font-medium hover:text-[var(--accent)] transition-colors">
                    {setNameMap[v.setId] ?? v.setId}
                  </Link>
                  {v.note && (
                    <div className="text-[11px] text-[var(--fg-faint)] mt-0.5 truncate max-w-[200px]">
                      {v.note}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[var(--fg)]">{v.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-[var(--fg-muted)]">{formatPrice(v.buyPrice)}</td>
                <td className="px-4 py-3 text-right font-mono text-[var(--fg)]">{formatPrice(v.currentPrice)}</td>
                <td className="px-4 py-3 text-right font-mono text-[var(--fg)]">{formatPrice(v.marketValue)}</td>
                <td
                  className={clsx(
                    "px-4 py-3 text-right font-mono",
                    v.pnl >= 0 ? "text-[var(--up)]" : "text-[var(--down)]"
                  )}
                >
                  <div>{formatPrice(v.pnl)}</div>
                  <div className="text-[10px]">{formatPct(v.pnlPct)}</div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[var(--fg-muted)] text-[11px]">
                  <div>{formatDate(v.buyDate)}</div>
                  <div className="text-[10px] text-[var(--fg-faint)]">{v.daysHeld}일 보유</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("이 보유 항목을 삭제할까요?")) onRemove(v.id);
                    }}
                    className="p-1.5 rounded-md text-[var(--fg-muted)] hover:text-[var(--down)] hover:bg-[var(--down)]/10 transition-colors"
                    aria-label={`${setNameMap[v.setId] ?? v.setId} 삭제`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="md:hidden space-y-3">
        {valuations.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={`/cards/${v.setId}`} className="font-display font-medium text-[var(--fg)] hover:text-[var(--accent)]">
                {setNameMap[v.setId] ?? v.setId}
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm("삭제할까요?")) onRemove(v.id);
                }}
                className="p-1.5 rounded-md text-[var(--fg-muted)] hover:text-[var(--down)]"
                aria-label="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <Cell label="수량" value={`${v.quantity}개`} />
              <Cell label="매입일" value={formatDate(v.buyDate)} />
              <Cell label="매입가" value={formatPrice(v.buyPrice)} />
              <Cell label="현재가" value={formatPrice(v.currentPrice)} />
              <Cell label="평가액" value={formatPrice(v.marketValue)} strong />
              <Cell
                label="손익"
                value={`${formatPrice(v.pnl)} (${formatPct(v.pnlPct)})`}
                tone={v.pnl >= 0 ? "up" : "down"}
                strong
              />
            </div>
            {v.note && (
              <div className="text-[11px] text-[var(--fg-faint)] border-t border-[var(--border)] pt-2">
                {v.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Cell({
  label,
  value,
  tone = "neutral",
  strong = false
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
  strong?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">{label}</div>
      <div
        className={clsx(
          strong ? "text-sm font-medium" : "text-[12px]",
          tone === "up" && "text-[var(--up)]",
          tone === "down" && "text-[var(--down)]",
          tone === "neutral" && "text-[var(--fg)]"
        )}
      >
        {value}
      </div>
    </div>
  );
}
