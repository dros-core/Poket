"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import clsx from "clsx";
import type { CardSet } from "@/lib/types";
import type { Holding } from "@/lib/portfolio/types";

interface Props {
  sets: Array<Pick<CardSet, "id" | "nameKo" | "msrpKRW">>;
  /** 세트별 현재 시세 (KRW). 기본 매입가 자동 채우기에 사용 */
  currentPrices: Record<string, number | undefined>;
  onAdd: (input: Omit<Holding, "id" | "createdAt">) => void;
}

const todayKst = (): string => {
  const now = new Date();
  // KST 보정 (서비스가 한국 사용자 중심)
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
};

export function HoldingForm({ sets, currentPrices, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [setId, setSetId] = useState(sets[0]?.id ?? "");
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [buyDate, setBuyDate] = useState<string>(todayKst());
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const selectedSet = sets.find((s) => s.id === setId);
  const suggestedPrice = currentPrices[setId] ?? selectedSet?.msrpKRW ?? 0;

  const reset = () => {
    setSetId(sets[0]?.id ?? "");
    setBuyPrice("");
    setQuantity("1");
    setBuyDate(todayKst());
    setNote("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!setId) return setError("세트를 선택하세요");
    const priceNum = Number(buyPrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setError("매입가를 정확히 입력하세요");
    const qtyNum = Number(quantity);
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) return setError("수량은 1 이상의 정수여야 합니다");
    if (!buyDate) return setError("매입일을 선택하세요");

    onAdd({
      setId,
      buyPrice: priceNum,
      quantity: qtyNum,
      buyDate,
      note: note.trim() || undefined
    });
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          if (!buyPrice && suggestedPrice) setBuyPrice(String(suggestedPrice));
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-medium text-sm hover:bg-[var(--accent)]/90 transition-colors"
      >
        <Plus size={16} strokeWidth={2.5} />
        보유 박스 추가
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-[var(--fg)]">신규 보유 등록</h3>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="p-1.5 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-mute)]"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] mb-1">
            세트
          </span>
          <select
            value={setId}
            onChange={(e) => {
              const next = e.target.value;
              setSetId(next);
              const suggested = currentPrices[next] ?? sets.find((s) => s.id === next)?.msrpKRW;
              if (suggested) setBuyPrice(String(suggested));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-mute)] border border-[var(--border)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          >
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameKo}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] mb-1">
            매입가 (KRW / 박스)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            step={100}
            value={buyPrice}
            placeholder={String(suggestedPrice)}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-mute)] border border-[var(--border)] text-[var(--fg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </label>

        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] mb-1">
            수량
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-mute)] border border-[var(--border)] text-[var(--fg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </label>

        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] mb-1">
            매입일
          </span>
          <input
            type="date"
            value={buyDate}
            max={todayKst()}
            onChange={(e) => setBuyDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-mute)] border border-[var(--border)] text-[var(--fg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="block text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] mb-1">
            메모 (선택)
          </span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="구매처, 그레이딩 계획 등"
            maxLength={120}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-mute)] border border-[var(--border)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </label>
      </div>

      {error && (
        <div className="text-xs text-[var(--up)] bg-[var(--up)]/10 border border-[var(--up)]/30 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="px-4 py-2 rounded-lg text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          취소
        </button>
        <button
          type="submit"
          className={clsx(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-black",
            "font-medium text-sm hover:bg-[var(--accent)]/90 transition-colors"
          )}
        >
          <Plus size={16} strokeWidth={2.5} />
          등록
        </button>
      </div>
    </form>
  );
}
