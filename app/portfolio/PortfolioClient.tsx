"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio/storage";
import { valuateAll, summarize } from "@/lib/portfolio/calc";
import { HoldingForm } from "@/components/portfolio/HoldingForm";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";

interface Props {
  sets: Array<{ id: string; nameKo: string; msrpKRW: number }>;
  setNameMap: Record<string, string>;
  currentPrices: Record<string, number | undefined>;
}

export function PortfolioClient({ sets, setNameMap, currentPrices }: Props) {
  const { hydrated, holdings, addHolding, removeHolding, clearAll } = usePortfolio();

  const valuations = useMemo(
    () => valuateAll(holdings, (setId) => currentPrices[setId]),
    [holdings, currentPrices]
  );
  const summary = useMemo(() => summarize(valuations), [valuations]);

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center text-[var(--fg-muted)] text-sm">
        포트폴리오 데이터 로드 중…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary summary={summary} setNameMap={setNameMap} />

      <div className="flex items-center justify-between gap-3">
        <HoldingForm sets={sets} currentPrices={currentPrices} onAdd={addHolding} />
        {holdings.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`보유 박스 ${holdings.length}건을 모두 삭제할까요?`)) clearAll();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--down)] transition-colors"
          >
            <Trash2 size={12} />
            전체 삭제
          </button>
        )}
      </div>

      <HoldingsTable valuations={valuations} setNameMap={setNameMap} onRemove={removeHolding} />

      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-faint)] text-center pt-4">
        Data stored locally · No server sync · Clear by browser storage reset
      </p>
    </div>
  );
}
