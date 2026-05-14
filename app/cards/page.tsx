import { Package } from "lucide-react";
import { SetCard } from "@/components/cards/SetCard";
import { ClassificationFilters } from "@/components/cards/ClassificationFilters";
import { PageHero } from "@/components/layout/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { repository } from "@/lib/data/repository";
import { resolveSetImage, resolveSetLogo, resolveBoxPhoto } from "@/lib/data/imageResolver";
import { getBoxBlurPlaceholder } from "@/data/seed/boxBlurPlaceholders";
import {
  applyFilter,
  groupBySeriesGroup,
  inferEra,
  inferSeriesGroup,
  inferMarketStatus,
  SERIES_GROUP_LABEL,
  SERIES_GROUP_DESC,
  SERIES_GROUP_ORDER,
  MARKET_STATUS_LABEL
} from "@/lib/data/classification";
import type { SetEra, SeriesGroup, MarketStatus } from "@/lib/types";

export const metadata = { title: "한국 포켓몬 카드 박스 시세 | Poket" };

interface Props {
  searchParams: {
    era?: string;
    group?: string;
    status?: string;
  };
}

export default function CardsPage({ searchParams }: Props) {
  const allSets = repository.listSets();

  // 필터 입력값 검증
  const eraFilter = (["2023", "2024", "2025", "2026"].includes(searchParams.era ?? "") ? searchParams.era : undefined) as SetEra | undefined;
  const groupFilter = (SERIES_GROUP_ORDER as string[]).includes(searchParams.group ?? "") ? (searchParams.group as SeriesGroup) : undefined;
  const statusFilter = (["PRE_RELEASE", "ACTIVE", "DISCONTINUED"].includes(searchParams.status ?? "") ? searchParams.status : undefined) as MarketStatus | undefined;

  const filtered = applyFilter(allSets, { era: eraFilter, seriesGroup: groupFilter, marketStatus: statusFilter });

  // 카운트 (필터 안 거친 전체 기반 — 칩에 표시)
  const counts = {
    era: {} as Partial<Record<SetEra, number>>,
    seriesGroup: {} as Partial<Record<SeriesGroup, number>>,
    marketStatus: {} as Partial<Record<MarketStatus, number>>
  };
  for (const s of allSets) {
    const e = inferEra(s);
    const g = inferSeriesGroup(s);
    const m = inferMarketStatus(s);
    counts.era[e] = (counts.era[e] ?? 0) + 1;
    counts.seriesGroup[g] = (counts.seriesGroup[g] ?? 0) + 1;
    counts.marketStatus[m] = (counts.marketStatus[m] ?? 0) + 1;
  }

  // 필터 적용된 결과를 시리즈 그룹으로 묶어 표시
  const byGroup = groupBySeriesGroup(filtered);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={`${filtered.length} / ${allSets.length} Booster Boxes`}
        eyebrowIcon={<Package size={11} strokeWidth={2.4} />}
        title="박스 시세 마켓"
        description="한국 정식 발매 부스터박스 전체 시세. 시리즈/시기/시장 상태로 필터링하여 시세차익 기회를 빠르게 탐색하세요."
        mascot="charizard"
        mascotSize={130}
        accent="red"
      />

      <ClassificationFilters counts={counts} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-10 text-center text-[var(--fg-muted)] text-sm">
          선택한 필터에 해당하는 박스가 없습니다. 필터를 조정하거나 초기화하세요.
        </div>
      ) : (
        <div className="space-y-10">
          {SERIES_GROUP_ORDER.filter((g) => (byGroup.get(g)?.length ?? 0) > 0).map((group) => {
            const groupSets = (byGroup.get(group) ?? []).sort((a, b) =>
              b.releaseDate.localeCompare(a.releaseDate)
            );
            return (
              <section key={group} className="space-y-4">
                <header className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--fg)] tracking-tight">
                      {SERIES_GROUP_LABEL[group]}
                    </h2>
                    <p className="text-[12px] text-[var(--fg-muted)] mt-0.5">
                      {SERIES_GROUP_DESC[group]}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-faint)]">
                    {groupSets.length}개 박스
                  </span>
                </header>
                <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupSets.map((s) => {
                    const history = repository.getBoxPriceHistory(s.id, 30);
                    const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
                    const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
                    const sparkData = history.map((h) => h.avg);
                    const image = resolveSetImage(s);
                    const logoUrl = resolveSetLogo(s);
                    const boxPhotoUrl = resolveBoxPhoto(s);
                    const boxPhotoBlurDataURL = getBoxBlurPlaceholder(s.id);
                    return (
                      <StaggerItem key={s.id}>
                        <SetCard
                          set={s}
                          latestPrice={latest}
                          prevPrice={prev}
                          sparkData={sparkData}
                          image={image}
                          logoUrl={logoUrl}
                          boxPhotoUrl={boxPhotoUrl}
                          boxPhotoBlurDataURL={boxPhotoBlurDataURL}
                        />
                      </StaggerItem>
                    );
                  })}
                </StaggerGroup>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
