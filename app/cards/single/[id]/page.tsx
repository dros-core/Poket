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

  return (
    <div className="space-y-8">
      <Link href={`/cards/${card.setId}`} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:underline">
        <ArrowLeft size={14} /> {set?.nameKo ?? "세트"}로 돌아가기
      </Link>
      <header className="flex flex-wrap items-start gap-6">
        <CardImage image={resolveCardImage(card, set)} variant="card" width={220} height={308} priority />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-ink-muted">
            <Link href={`/cards/${card.setId}`} className="hover:underline">{set?.nameKo}</Link>
            {" · "}
            {card.number}
          </div>
          <h1 className="text-3xl font-extrabold mt-1">{card.nameKo}</h1>
          <div className="text-sm text-ink-muted mt-1">{card.nameEn}{card.illustrator ? ` · 일러스트 ${card.illustrator}` : ""}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="primary">{card.rarity}</Badge>
            {card.pokemonType && <Badge variant="info">{card.pokemonType}</Badge>}
            {card.tags.map((t) => (
              <Badge key={t} variant="neutral">{t}</Badge>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-3 max-w-md">
            ※ 이미지는 <strong>{set?.nameKo}</strong> 세트의 #{card.number.split("/")[0]} 카드와 매칭되며,
            동명의 다른 세트 카드(예: 흑염의 지배자 vs 151의 리자몽 ex)와 혼동되지 않습니다.
          </p>
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
