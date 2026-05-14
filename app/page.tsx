import Link from "next/link";
import { ArrowRight, TrendingUp, LineChart, Globe2, Coins, Building2, Package, Sparkles, Activity } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Hero } from "@/components/layout/Hero";
import { SetCard } from "@/components/cards/SetCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { ArbitrageTable } from "@/components/tables/ArbitrageTable";
import { repository } from "@/lib/data/repository";
import { resolveSetImage } from "@/lib/data/imageResolver";
import { formatPct } from "@/lib/format";

export default function HomePage() {
  const sets = repository.listSets();
  const featuredSets = [...sets].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 6);
  const heroImages = featuredSets.slice(0, 3).map((s) => resolveSetImage(s));

  const allHistories = sets.map((s) => ({ set: s, history: repository.getBoxPriceHistory(s.id, 60) }));
  const validHistories = allHistories.filter((h) => h.history.length >= 4);
  const totalSets = sets.length;
  const activeSets = sets.filter((s) => s.isActive).length;
  const avgPremium =
    validHistories.reduce((acc, h) => {
      const latest = h.history[h.history.length - 1].avg;
      return acc + ((latest - h.set.msrpKRW) / h.set.msrpKRW) * 100;
    }, 0) / Math.max(1, validHistories.length);
  const arbitrage = repository.findArbitrageOpportunities().slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16">
      <Hero featuredImages={heroImages} />

      {/* KPI */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between mb-4 gap-2 flex-wrap">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">시장 온도</h2>
              <p className="text-sm text-[var(--fg-muted)] mt-1">전체 추적 세트 기준 핵심 지표</p>
            </div>
          </div>
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StaggerItem>
            <Stat
              label="추적 세트"
              value={`${totalSets}종`}
              hint={`현재 유통 ${activeSets}종 · 절판 ${totalSets - activeSets}종`}
              icon={<Sparkles size={14} strokeWidth={2.5} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="평균 박스 프리미엄"
              value={formatPct(avgPremium)}
              delta={`정가 대비`}
              tone={avgPremium > 0 ? "up" : "down"}
              hint="박스 시세 ÷ MSRP 평균"
              icon={<TrendingUp size={14} strokeWidth={2.5} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="차익 기회"
              value={`${arbitrage.length}건`}
              tone={arbitrage.length > 0 ? "warning" : "neutral"}
              hint="채널간 NET 마진 5%↑"
              icon={<Coins size={14} strokeWidth={2.5} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="데이터 소스"
              value="9+"
              hint="KREAM · 너정다 · TCGBOX · 번개 · 일본 직구"
              icon={<Activity size={14} strokeWidth={2.5} />}
            />
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* 핵심 기능 */}
      <section>
        <Reveal>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">한곳에서 끝내는 분석</h2>
            <p className="text-sm text-[var(--fg-muted)] mt-1">매수/매도 의사결정의 모든 근거를 단일 인터페이스에</p>
          </div>
        </Reveal>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <StaggerItem key={f.href}>
              <FeatureCard {...f} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 최신 세트 */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between mb-4 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">최신 한국판 세트</h2>
              <p className="text-sm text-[var(--fg-muted)] mt-1">발매일 순으로 핵심 6개 표시</p>
            </div>
            <Link
              href="/cards"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5 group"
            >
              전체 보기
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </Reveal>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredSets.map((s) => {
            const history = repository.getBoxPriceHistory(s.id, 30);
            const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
            const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
            const sparkData = history.map((h) => h.avg);
            const image = resolveSetImage(s);
            return (
              <StaggerItem key={s.id}>
                <SetCard set={s} latestPrice={latest} prevPrice={prev} sparkData={sparkData} image={image} />
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      {/* 차익 기회 */}
      {arbitrage.length > 0 && (
        <section>
          <Reveal>
            <div className="flex items-end justify-between mb-4 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">발견된 차익 기회</h2>
                <p className="text-sm text-[var(--fg-muted)] mt-1">수수료·배송 차감 후 NET 수익 기준</p>
              </div>
              <Link
                href="/arbitrage"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5 group"
              >
                전체 보기
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <ArbitrageTable opportunities={arbitrage} compact />
          </Reveal>
        </section>
      )}
    </div>
  );
}

const features = [
  { icon: <TrendingUp size={18} />, title: "시세 추이", desc: "모든 세트의 박스/싱글 1년치 추세선과 변동폭을 한눈에.", href: "/trends" },
  { icon: <LineChart size={18} />, title: "가격 예측", desc: "Holt's ES 기반 90일 예측 + 95% 신뢰구간.", href: "/predictions" },
  { icon: <Coins size={18} />, title: "차익 기회", desc: "채널간 가격 갭 자동 탐지. 수수료·배송비 차감 후 NET 수익.", href: "/arbitrage" },
  { icon: <Building2 size={18} />, title: "도매 진입", desc: "포켓몬코리아 공인, 아카토이, 남대문 도매상 가이드.", href: "/wholesale" },
  { icon: <Package size={18} />, title: "소매 비교", desc: "쿠팡·11번가·G마켓·이마트·교보·KREAM 가격 비교.", href: "/retail" },
  { icon: <Globe2 size={18} />, title: "해외 직구 가이드", desc: "Amazon JP·Mercari·eBay + 면세·관세·배대지 자동 계산.", href: "/guide/purchase-guide" }
];

function FeatureCard({ icon, title, desc, href }: (typeof features)[number]) {
  return (
    <Link href={href} className="card card-hover group flex flex-col h-full">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 grid place-items-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold leading-tight">{title}</h3>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed mt-1">{desc}</p>
        </div>
      </div>
      <div className="mt-auto pt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        자세히 보기 <ArrowRight size={12} strokeWidth={3} />
      </div>
    </Link>
  );
}
