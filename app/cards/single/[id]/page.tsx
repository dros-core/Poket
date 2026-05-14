import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { CardImage } from "@/components/cards/CardImage";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { repository } from "@/lib/data/repository";
import { formatPct, formatPrice } from "@/lib/format";
import { resolveCardImage } from "@/lib/data/imageResolver";

export function generateStaticParams() {
  return repository.listCards().map((c) => ({ id: c.id }));
}

export default function SingleCardPage({ params }: { params: { id: string } }) {
  const card = repository.getCard(params.id);
  if (!card) notFound();
  const set = repository.getSet(card.setId);
  const history = repository.getCardPriceHistory(card.id, 365);
  const prediction = repository.predictCardPrice(card.id, 90);
  const latest = history[history.length - 1]?.avg ?? 0;
  const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
  const change = prev ? ((latest - prev) / prev) * 100 : 0;

  const cardImage = resolveCardImage(card, set);

  return (
    <div className="space-y-8">
      <Link href={`/cards/${card.setId}`} className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
        <ArrowLeft size={14} /> {set?.nameKo ?? "세트"}로 돌아가기
      </Link>

      {/* Hero — 큰 카드 + 정보 */}
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] bg-card-hero">
        {/* 백드롭: 큰 카드 이미지 블러 */}
        <div className="absolute inset-0 opacity-30">
          <CardImage image={cardImage} variant="card" width={1200} height={1200} className="!w-full !h-full" />
        </div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/70" />

        <div className="relative grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 p-6 sm:p-10">
          {/* 메인 카드 + 글로우 */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div
                className="absolute -inset-8 rounded-full opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,203,5,0.30) 0%, rgba(238,21,21,0.12) 40%, transparent 70%)",
                  filter: "blur(28px)"
                }}
                aria-hidden
              />
              <div className="relative rounded-2xl overflow-hidden ring-2 ring-yellow-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(255,203,5,0.20)]">
                <CardImage image={cardImage} variant="card" width={280} height={392} priority />
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(255,80,130,0.3), rgba(255,180,50,0.3), rgba(255,230,100,0.3), rgba(100,230,200,0.3), rgba(100,200,255,0.3), rgba(180,100,255,0.3), rgba(255,80,130,0.3))"
                  }}
                />
              </div>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="text-[10px] font-pixel tracking-widest uppercase text-[var(--fg-faint)]">
              <Link href={`/cards/${card.setId}`} className="hover:text-[var(--accent)] transition-colors">
                {set?.nameKo}
              </Link>
              <span className="mx-2 text-[var(--border-strong)]">·</span>
              #{card.number}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--fg)] mt-3 leading-tight">
              {card.nameKo}
            </h1>
            <div className="text-sm text-[var(--fg-muted)] mt-2 font-mono">
              {card.nameEn}{card.illustrator ? ` · illust. ${card.illustrator}` : ""}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="primary">{card.rarity}</Badge>
              {card.pokemonType && <Badge variant="info">{card.pokemonType}</Badge>}
              {card.tags.map((t) => (
                <Badge key={t} variant="neutral">{t}</Badge>
              ))}
            </div>
            <p className="text-xs text-[var(--fg-faint)] mt-5 max-w-md leading-relaxed">
              ※ 이미지는 <strong className="text-[var(--fg-muted)]">{set?.nameKo}</strong> 세트의 #{card.number.split("/")[0]} 카드 — 세트별 정확히 매칭되어 동명 카드와 혼동되지 않습니다.
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="현재 시세 (raw)" value={formatPrice(latest)} />
        <Stat
          label="30일 변화"
          value={formatPct(change)}
          tone={change > 0 ? "negative" : "positive"}
        />
        <Stat
          label="박스당 봉입률"
          value={card.pullRate ? `${(card.pullRate * 100).toFixed(2)}%` : "—"}
          hint={card.isPullable ? "박스에서 직접 출현" : "프로모/한정"}
        />
        <Stat
          label="예측 신뢰도"
          value={prediction ? `${(prediction.confidence * 100).toFixed(0)}%` : "—"}
          hint={prediction?.modelUsed}
        />
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">시세 추이 + 90일 예측</h2>
          {prediction && (
            <div className="text-xs text-ink-muted">{prediction.signals.join(" · ")}</div>
          )}
        </div>
        <PriceTrendChart history={history} prediction={prediction} />
      </section>

      <section className="card">
        <h2 className="font-bold text-lg mb-2">그레이딩 시 예상 가치</h2>
        <p className="text-sm text-ink-muted mb-3">
          한국은 BRG, 글로벌은 PSA가 표준. 등급별 시세는 raw 대비 배수로 환산.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="raw" value={formatPrice(latest)} hint="등급화 전" />
          <Stat
            label="BRG 10"
            value={formatPrice(Math.round(latest * 2))}
            tone="positive"
            hint="국내 인지도 상승 중"
          />
          <Stat
            label="PSA 10"
            value={formatPrice(Math.round(latest * 5))}
            tone="positive"
            hint="raw 대비 3~10배"
          />
          <Stat
            label="PSA 9"
            value={formatPrice(Math.round(latest * 1.7))}
            hint="흠집/엣지 타협"
          />
        </div>
        <p className="text-xs text-ink-muted mt-3">
          * 예시 배수입니다. 실 그레이딩 결과·발매 시기·인기에 따라 편차가 큽니다. 실제 시세는 PSA Pop Report와 너정다·KREAM 거래 데이터로 검증하세요.
        </p>
      </section>
    </div>
  );
}
