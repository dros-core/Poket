import Link from "next/link";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { repository } from "@/lib/data/repository";
import { formatPct, formatPrice } from "@/lib/format";

export const metadata = { title: "시세 추이 분석 | Poket" };

export default function TrendsPage() {
  const sets = repository.listSets();
  const rows = sets
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
        sinceLaunch: ((latest - launch) / launch) * 100
      };
    })
    .filter(Boolean) as Array<{
    set: any;
    latest: number;
    msrp: number;
    change30d: number;
    change90d: number;
    sinceLaunch: number;
  }>;

  rows.sort((a, b) => b.change30d - a.change30d);

  const topGainers = rows.slice(0, 3);
  const topLosers = [...rows].reverse().slice(0, 3);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">시세 추이</h1>
        <p className="mt-1 text-sm text-ink-muted">
          한국 정식 발매 박스의 30일/90일/누적 변동률. 정가 대비 프리미엄과 절판 효과를 한눈에 확인합니다.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-3">
        <div className="card">
          <h2 className="font-bold mb-3">30일 상승 Top</h2>
          <ul className="space-y-2">
            {topGainers.map((r) => (
              <li key={r.set.id} className="flex items-center justify-between text-sm">
                <Link href={`/cards/${r.set.id}`} className="font-medium hover:underline truncate">
                  {r.set.nameKo}
                </Link>
                <Badge variant="danger">{formatPct(r.change30d)}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-bold mb-3">30일 하락 Top</h2>
          <ul className="space-y-2">
            {topLosers.map((r) => (
              <li key={r.set.id} className="flex items-center justify-between text-sm">
                <Link href={`/cards/${r.set.id}`} className="font-medium hover:underline truncate">
                  {r.set.nameKo}
                </Link>
                <Badge variant="info">{formatPct(r.change30d)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs uppercase text-ink-muted">
              <tr>
                <th className="text-left px-4 py-2">세트</th>
                <th className="text-right px-4 py-2">정가</th>
                <th className="text-right px-4 py-2">현재가</th>
                <th className="text-right px-4 py-2">정가대비</th>
                <th className="text-right px-4 py-2">30일</th>
                <th className="text-right px-4 py-2">90일</th>
                <th className="text-right px-4 py-2">누적</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.set.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2">
                    <Link href={`/cards/${r.set.id}`} className="font-medium hover:underline">
                      {r.set.nameKo}
                    </Link>
                    <div className="text-xs text-ink-muted">{r.set.code} · {r.set.series}</div>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatPrice(r.msrp)}</td>
                  <td className="px-4 py-2 text-right font-bold tabular-nums">
                    {formatPrice(r.latest)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span
                      className={
                        r.latest > r.msrp ? "text-rose-600" : "text-emerald-600"
                      }
                    >
                      {formatPct(((r.latest - r.msrp) / r.msrp) * 100)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={r.change30d > 0 ? "text-rose-600" : "text-emerald-600"}>
                      {formatPct(r.change30d)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={r.change90d > 0 ? "text-rose-600" : "text-emerald-600"}>
                      {formatPct(r.change90d)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={r.sinceLaunch > 0 ? "text-rose-600" : "text-emerald-600"}>
                      {formatPct(r.sinceLaunch)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card text-sm leading-relaxed text-ink-muted">
        <h2 className="font-bold text-base text-[var(--fg)] mb-2">해석 가이드</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>정가 대비 +20% 이상 → 절판 임박 또는 메타 카드 영향 가능. 매수 신중.</li>
          <li>30일 변동 +8% 이상 → 단기 모멘텀. 추세 추종 매수 가능 (단, 익절 라인 설정 필수).</li>
          <li>30일 변동 -8% 이상 → 신상 발매 후 안정화 진행 중. 추가 하락 가능성.</li>
          <li>누적 +50% 이상 → 절판 후 재상승. PSA 그레이딩 후 판매 검토.</li>
        </ul>
      </section>
    </div>
  );
}
