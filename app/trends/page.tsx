import Link from "next/link";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { PageHero } from "@/components/layout/PageHero";
import { TrendsTable, type TrendRow } from "@/components/tables/TrendsTable";
import { repository } from "@/lib/data/repository";
import { formatPct } from "@/lib/format";

export const metadata = { title: "시세 추이 분석 | Poket" };

export default function TrendsPage() {
  const sets = repository.listSets();
  const rows: TrendRow[] = sets
    .map((s) => {
      const history = repository.getBoxPriceHistory(s.id, 365);
      if (history.length < 4) return null;
      const latest = history[history.length - 1].avg;
      const m1 = history[Math.max(0, history.length - 5)].avg;
      const m3 = history[Math.max(0, history.length - 13)].avg;
      const launch = history[0].avg;
      return {
        set: s,
        latest,
        msrp: s.msrpKRW,
        change30d: ((latest - m1) / m1) * 100,
        change90d: ((latest - m3) / m3) * 100,
        sinceLaunch: ((latest - launch) / launch) * 100,
        spark: history.slice(-12).map((h) => h.avg)
      };
    })
    .filter(Boolean) as TrendRow[];

  rows.sort((a, b) => b.change30d - a.change30d);
  const topGainers = rows.slice(0, 3);
  const topLosers = [...rows].reverse().slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Market Trends"
        eyebrowIcon={<BarChart3 size={11} strokeWidth={2.4} />}
        title="시세 추이 분석"
        description="한국 정식 발매 박스의 30일·90일·누적 변동률. 정가 대비 프리미엄과 절판 효과를 한눈에."
        mascot="mewtwo"
        mascotSize={120}
        accent="purple"
      />

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StaggerItem>
          <Movers title="30일 상승 Top" tone="up" rows={topGainers} icon={<TrendingUp size={16} strokeWidth={2.5} />} />
        </StaggerItem>
        <StaggerItem>
          <Movers title="30일 하락 Top" tone="down" rows={topLosers} icon={<TrendingDown size={16} strokeWidth={2.5} />} />
        </StaggerItem>
      </StaggerGroup>

      <Reveal>
        <TrendsTable rows={rows} />
      </Reveal>

      <Reveal>
        <section className="card text-sm text-[var(--fg-muted)] leading-relaxed">
          <h2 className="font-bold text-base text-[var(--fg)] mb-3">📖 해석 가이드</h2>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <li>• 정가 대비 +20%↑ → 절판 임박 또는 메타 영향. 매수 신중</li>
            <li>• 30일 +8%↑ → 단기 모멘텀. 추세 추종 가능 (익절선 필수)</li>
            <li>• 30일 -8%↓ → 신상 안정화 진행 중. 추가 하락 가능</li>
            <li>• 누적 +50%↑ → 절판 후 재상승. PSA 그레이딩 검토</li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}

function Movers({ title, tone, rows, icon }: { title: string; tone: "up" | "down"; rows: TrendRow[]; icon: React.ReactNode }) {
  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg grid place-items-center ${tone === "up" ? "bg-up text-up" : "bg-down text-down"}`}
        >
          {icon}
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.set.id} className="flex items-center justify-between gap-2 text-sm">
            <Link
              href={`/cards/${r.set.id}`}
              className="font-medium hover:text-brand-600 transition-colors truncate"
            >
              {r.set.nameKo}
            </Link>
            <span className={`font-bold tnum text-sm shrink-0 ${tone === "up" ? "text-up" : "text-down"}`}>
              {formatPct(r.change30d)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
