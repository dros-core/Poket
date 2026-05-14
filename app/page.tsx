import Link from "next/link";
import { ArrowRight, TrendingUp, LineChart, Globe2, Coins, Building2, Package } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { SetCard } from "@/components/cards/SetCard";
import { repository } from "@/lib/data/repository";
import { formatPrice, formatPct } from "@/lib/format";

export default function HomePage() {
  const sets = repository.listSets();
  const featuredSets = [...sets].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 6);

  // 시장 전체 KPI
  const allHistories = sets.map((s) => ({
    set: s,
    history: repository.getBoxPriceHistory(s.id, 60)
  }));
  const validHistories = allHistories.filter((h) => h.history.length >= 4);
  const totalSets = sets.length;
  const activeSets = sets.filter((s) => s.isActive).length;

  const avgPremium =
    validHistories.reduce((acc, h) => {
      const latest = h.history[h.history.length - 1].avg;
      return acc + ((latest - h.set.msrpKRW) / h.set.msrpKRW) * 100;
    }, 0) / Math.max(1, validHistories.length);

  const arbitrage = repository.findArbitrageOpportunities().slice(0, 5);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-stretch">
        <div className="card relative overflow-hidden bg-gradient-to-br from-brand-50 to-orange-100 dark:from-brand-900/30 dark:to-amber-900/20">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="primary">한국 시세 통합</Badge>
            <Badge variant="info">예측 · 차익 기회</Badge>
            <Badge variant="success">데이터 출처 명시</Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
            한국 포켓몬 카드,
            <br />
            <span className="text-brand-600">시세부터 매입처까지 한 번에</span>
          </h1>
          <p className="mt-3 text-ink-muted text-sm md:text-base max-w-xl">
            KREAM·너정다(ICU)·TCGBOX·번개장터·해외 직구 데이터를 단일 대시보드에서 비교합니다.
            박스/카툰 도매가, 싱글 EV, 시세 추세선, 90일 가격 예측, 실시간 차익 기회까지 — 매수/매도 의사결정의 모든 근거.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/cards"
              className="inline-flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              카드/박스 시세 둘러보기 <ArrowRight size={16} />
            </Link>
            <Link
              href="/guide/arbitrage-playbook"
              className="inline-flex items-center gap-1 surface px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--surface-muted)] transition"
            >
              차익 플레이북 읽기
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="추적 세트" value={`${totalSets}종`} hint={`현재 유통 ${activeSets}종`} />
          <Stat
            label="박스 평균 프리미엄"
            value={formatPct(avgPremium)}
            tone={avgPremium > 0 ? "negative" : "positive"}
            hint="정가 대비 박스 시세 평균"
          />
          <Stat
            label="차익 기회"
            value={`${arbitrage.length}건`}
            tone={arbitrage.length > 0 ? "warning" : "neutral"}
            hint="채널 간 박스 단위 net 마진 5%↑"
          />
          <Stat label="데이터 소스" value="9+" hint="KREAM·너정다·TCGBOX·번개·일본 등" />
        </div>
      </section>

      {/* 핵심 기능 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <FeatureCard
          icon={<TrendingUp size={18} />}
          title="시세 추이"
          desc="모든 세트의 박스/싱글 1년치 추세선과 변동폭을 한눈에."
          href="/trends"
        />
        <FeatureCard
          icon={<LineChart size={18} />}
          title="가격 예측"
          desc="Holt's Linear ES 기반 90일 예측 + 95% 신뢰구간."
          href="/predictions"
        />
        <FeatureCard
          icon={<Coins size={18} />}
          title="차익 기회"
          desc="채널간 가격 갭 자동 탐지. 수수료/배송비 차감 후 net 수익."
          href="/arbitrage"
        />
        <FeatureCard
          icon={<Building2 size={18} />}
          title="도매 진입"
          desc="포켓몬코리아 공인, 아카토이, 남대문 도매상 가이드."
          href="/wholesale"
        />
        <FeatureCard
          icon={<Package size={18} />}
          title="소매 비교"
          desc="쿠팡·11번가·G마켓·이마트·교보·KREAM 가격 비교."
          href="/retail"
        />
        <FeatureCard
          icon={<Globe2 size={18} />}
          title="해외 직구 가이드"
          desc="Amazon JP·Mercari·eBay + 면세·관세·배대지 자동 계산."
          href="/guide/purchase-guide"
        />
      </section>

      {/* 최신 세트 */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-bold">최신 한국판 세트</h2>
          <Link href="/cards" className="text-sm text-brand-600 hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredSets.map((s) => {
            const history = repository.getBoxPriceHistory(s.id, 30);
            const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
            const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
            return <SetCard key={s.id} set={s} latestPrice={latest} prevPrice={prev} />;
          })}
        </div>
      </section>

      {/* 차익 기회 미리보기 */}
      {arbitrage.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-xl font-bold">발견된 차익 기회 (Top 5)</h2>
            <Link href="/arbitrage" className="text-sm text-brand-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="text-left px-4 py-2">세트</th>
                    <th className="text-left px-4 py-2">매수처</th>
                    <th className="text-right px-4 py-2">매수가</th>
                    <th className="text-left px-4 py-2">매도처</th>
                    <th className="text-right px-4 py-2">매도가</th>
                    <th className="text-right px-4 py-2">Net 수익</th>
                    <th className="text-right px-4 py-2">마진</th>
                    <th className="px-4 py-2">리스크</th>
                  </tr>
                </thead>
                <tbody>
                  {arbitrage.map((opp) => {
                    const set = repository.getSet(opp.productId);
                    return (
                      <tr key={opp.id} className="border-t border-[var(--border)]">
                        <td className="px-4 py-2 font-medium">{set?.nameKo ?? opp.productId}</td>
                        <td className="px-4 py-2">{opp.buyChannel}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {formatPrice(opp.buyPrice)}
                        </td>
                        <td className="px-4 py-2">{opp.sellChannel}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {formatPrice(opp.sellPrice)}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-emerald-600 tabular-nums">
                          {formatPrice(opp.estimatedNetProfit)}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {opp.marginPct.toFixed(1)}%
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              opp.riskLevel === "LOW"
                                ? "success"
                                : opp.riskLevel === "MEDIUM"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {opp.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  href
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="card group hover:-translate-y-0.5 transition">
      <div className="flex items-center gap-2 text-brand-600 mb-2">
        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 grid place-items-center">
          {icon}
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
      <div className="mt-3 text-xs text-brand-600 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        자세히 <ArrowRight size={14} />
      </div>
    </Link>
  );
}
