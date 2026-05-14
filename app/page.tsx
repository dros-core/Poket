import Link from "next/link";
import { ArrowRight, TrendingUp, LineChart, Globe2, Coins, Building2, Package, Activity, Sparkles, ArrowUpRight } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Hero } from "@/components/layout/Hero";
import { SetCard } from "@/components/cards/SetCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { ArbitrageTable } from "@/components/tables/ArbitrageTable";
import { FeaturedCardShowcase } from "@/components/cards/FeaturedCardShowcase";
import { repository } from "@/lib/data/repository";
import { resolveSetImage, resolveSetLogo, resolveBoxPhoto } from "@/lib/data/imageResolver";
import { formatPct, formatPrice } from "@/lib/format";

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
  const totalArbProfit = arbitrage.reduce((a, o) => a + o.estimatedNetProfit, 0);

  // Ticker (StockX 스타일)
  const ticker = [
    { label: "Tracked", value: `${totalSets}`, delta: `+${totalSets - activeSets}`, up: false },
    { label: "Avg Premium", value: formatPct(avgPremium), up: avgPremium > 0 },
    { label: "Arb Signals", value: `${arbitrage.length}`, up: arbitrage.length > 0 },
    { label: "Top Net", value: arbitrage.length > 0 ? formatPrice(arbitrage[0].estimatedNetProfit) : "—", up: true }
  ];

  // Featured showcase 데이터 — 최근 인기 4개 (가격 변화율 기준)
  const showcaseItems = featuredSets.slice(0, 4).map((s) => {
    const history = repository.getBoxPriceHistory(s.id, 30);
    const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
    const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
    return {
      set: s,
      image: resolveSetImage(s),
      logoUrl: resolveSetLogo(s),
      latestPrice: latest,
      changePct: prev ? ((latest - prev) / prev) * 100 : 0
    };
  });

  return (
    <div className="space-y-16 sm:space-y-24">
      <Hero featuredImages={heroImages} ticker={ticker} />

      {/* Featured Card Showcase — 큰 카드 디스플레이 */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between mb-6 gap-2 flex-wrap">
            <SectionHeader
              eyebrow="FEATURED · 최근 핫픽"
              title="이 주의 주목할 박스"
              description="발매 직후 프리미엄이 형성된 세트들"
            />
            <Link
              href="/cards"
              className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] inline-flex items-center gap-1 group transition-colors"
            >
              전체 마켓
              <ArrowUpRight size={14} strokeWidth={1.8} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <FeaturedCardShowcase items={showcaseItems} />
        </Reveal>
      </section>

      {/* Market Pulse */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="MARKET PULSE"
            title="시장 온도"
            description="전체 추적 세트 기준 핵심 지표"
          />
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <StaggerItem>
            <Stat
              label="Tracked Sets"
              value={`${totalSets}`}
              hint={`Active ${activeSets} · Closed ${totalSets - activeSets}`}
              icon={<Sparkles size={14} strokeWidth={1.8} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="Avg Premium"
              value={formatPct(avgPremium)}
              delta={`vs MSRP`}
              tone={avgPremium > 0 ? "up" : "down"}
              hint="박스 시세 ÷ 정가 평균"
              icon={<TrendingUp size={14} strokeWidth={1.8} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="Arb Signals"
              value={`${arbitrage.length}`}
              tone={arbitrage.length > 0 ? "warning" : "neutral"}
              hint="채널간 NET 마진 5%↑"
              icon={<Coins size={14} strokeWidth={1.8} />}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="Pot. Profit"
              value={formatPrice(totalArbProfit)}
              tone="up"
              hint="상위 6건 합산"
              icon={<Activity size={14} strokeWidth={1.8} />}
            />
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* Featured Sets — Bento 스타일 */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between mb-6 gap-2 flex-wrap">
            <SectionHeader
              eyebrow="LATEST RELEASES"
              title="최신 한국판 세트"
              description="발매일 기준 핫픽 6개"
            />
            <Link
              href="/cards"
              className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] inline-flex items-center gap-1 group transition-colors"
            >
              전체 보기
              <ArrowUpRight size={14} strokeWidth={1.8} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            const logoUrl = resolveSetLogo(s);
            const boxPhotoUrl = resolveBoxPhoto(s);
            return (
              <StaggerItem key={s.id}>
                <SetCard set={s} latestPrice={latest} prevPrice={prev} sparkData={sparkData} image={image} logoUrl={logoUrl} boxPhotoUrl={boxPhotoUrl} />
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      {/* Features grid */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="WHAT'S INSIDE"
            title="한곳에서 끝내는 분석"
            description="매수·매도 의사결정의 모든 근거를 단일 인터페이스에"
          />
        </Reveal>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {features.map((f) => (
            <StaggerItem key={f.href}>
              <FeatureCard {...f} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Arbitrage preview */}
      {arbitrage.length > 0 && (
        <section>
          <Reveal>
            <div className="flex items-end justify-between mb-6 gap-2">
              <SectionHeader
                eyebrow="OPPORTUNITY"
                title="발견된 차익 기회"
                description="수수료·배송 차감 후 NET 수익 기준"
              />
              <Link
                href="/arbitrage"
                className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] inline-flex items-center gap-1 group transition-colors"
              >
                전체 보기
                <ArrowUpRight size={14} strokeWidth={1.8} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <div className="font-pixel text-[10px] tracking-[0.2em] text-[var(--fg-faint)] uppercase">
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium mt-2 tracking-tight text-[var(--fg)] leading-tight">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-2 leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
}

const features = [
  { icon: <TrendingUp size={16} strokeWidth={1.8} />, title: "시세 추이", desc: "모든 세트의 박스/싱글 1년치 추세선과 변동폭을 한눈에.", href: "/trends" },
  { icon: <LineChart size={16} strokeWidth={1.8} />, title: "가격 예측", desc: "Holt's ES 기반 90일 예측 + 95% 신뢰구간.", href: "/predictions" },
  { icon: <Coins size={16} strokeWidth={1.8} />, title: "차익 기회", desc: "채널간 가격 갭 자동 탐지. 수수료·배송비 차감 후 NET 수익.", href: "/arbitrage" },
  { icon: <Building2 size={16} strokeWidth={1.8} />, title: "도매 진입", desc: "포켓몬코리아 공인, 아카토이, 남대문 도매상 가이드.", href: "/wholesale" },
  { icon: <Package size={16} strokeWidth={1.8} />, title: "소매 비교", desc: "쿠팡·11번가·G마켓·이마트·교보·KREAM 가격 비교.", href: "/retail" },
  { icon: <Globe2 size={16} strokeWidth={1.8} />, title: "해외 직구", desc: "Amazon JP·Mercari·eBay + 면세·관세·배대지 자동 계산.", href: "/guide/purchase-guide" }
];

function FeatureCard({ icon, title, desc, href }: (typeof features)[number]) {
  return (
    <Link href={href} className="card card-hover spotlight group flex flex-col h-full">
      <div className="flex items-start gap-3 relative">
        <div className="w-9 h-9 rounded-lg bg-[var(--bg-mute)] text-[var(--fg-muted)] grid place-items-center shrink-0 border border-[var(--border)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-bg)] transition-all duration-500">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight tracking-tight text-[var(--fg)]">{title}</h3>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed mt-1.5">{desc}</p>
        </div>
      </div>
      <div className="mt-auto pt-4 text-xs font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent)] inline-flex items-center gap-1 transition-colors">
        자세히 보기 <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
