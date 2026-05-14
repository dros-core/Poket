"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { SetEra, SeriesGroup, MarketStatus } from "@/lib/types";
import {
  ERA_LABEL,
  ERA_ORDER,
  SERIES_GROUP_LABEL,
  SERIES_GROUP_ORDER,
  MARKET_STATUS_LABEL,
  MARKET_STATUS_ORDER
} from "@/lib/data/classification";

interface CountMaps {
  era: Partial<Record<SetEra, number>>;
  seriesGroup: Partial<Record<SeriesGroup, number>>;
  marketStatus: Partial<Record<MarketStatus, number>>;
}

interface Props {
  counts: CountMaps;
}

/**
 * 박스 시세 마켓 필터 — URL 쿼리 기반.
 * 각 축의 칩을 클릭하면 ?era=2025&group=MEGA&status=ACTIVE 등으로 이동.
 * 같은 값 재클릭 시 해당 필터 해제.
 */
export function ClassificationFilters({ counts }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  const currentEra = params.get("era") as SetEra | null;
  const currentGroup = params.get("group") as SeriesGroup | null;
  const currentStatus = params.get("status") as MarketStatus | null;

  const buildHref = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const hasAny = currentEra || currentGroup || currentStatus;

  return (
    <div className="space-y-3">
      <FilterRow
        label="발매 시기"
        items={ERA_ORDER.filter((e) => (counts.era[e] ?? 0) > 0).map((era) => ({
          key: era,
          label: ERA_LABEL[era].replace(" 발매", ""),
          count: counts.era[era] ?? 0,
          active: currentEra === era,
          href: buildHref({ era: currentEra === era ? null : era })
        }))}
      />
      <FilterRow
        label="시리즈"
        items={SERIES_GROUP_ORDER.filter((g) => (counts.seriesGroup[g] ?? 0) > 0).map((group) => ({
          key: group,
          label: SERIES_GROUP_LABEL[group],
          count: counts.seriesGroup[group] ?? 0,
          active: currentGroup === group,
          href: buildHref({ group: currentGroup === group ? null : group })
        }))}
      />
      <FilterRow
        label="시장 상태"
        items={MARKET_STATUS_ORDER.filter((m) => (counts.marketStatus[m] ?? 0) > 0).map((status) => ({
          key: status,
          label: MARKET_STATUS_LABEL[status],
          count: counts.marketStatus[status] ?? 0,
          active: currentStatus === status,
          href: buildHref({ status: currentStatus === status ? null : status })
        }))}
      />
      {hasAny && (
        <div className="pt-1">
          <Link
            href={pathname}
            className="text-[11px] font-mono uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            ← 필터 초기화
          </Link>
        </div>
      )}
    </div>
  );
}

interface FilterRowItem {
  key: string;
  label: string;
  count: number;
  active: boolean;
  href: string;
}

function FilterRow({ label, items }: { label: string; items: FilterRowItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)] shrink-0 mr-1">
        {label}
      </span>
      {items.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          scroll={false}
          className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border",
            it.active
              ? "bg-[var(--accent)] text-black border-[var(--accent)]"
              : "bg-[var(--bg-mute)] text-[var(--fg-soft)] border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
          )}
        >
          {it.label}
          <span
            className={clsx(
              "text-[10px] font-mono tnum",
              it.active ? "text-black/60" : "text-[var(--fg-faint)]"
            )}
          >
            {it.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
