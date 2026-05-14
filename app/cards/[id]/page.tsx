import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { repository } from "@/lib/data/repository";
import { formatDate, formatPct, formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return repository.listSets().map((s) => ({ id: s.id }));
}

export default function SetDetailPage({ params }: { params: { id: string } }) {
  const set = repository.getSet(params.id);
  if (!set) notFound();

  const history = repository.getBoxPriceHistory(set.id, 365);
  const prediction = repository.predictBoxPrice(set.id, 90);
  const observations = repository.getBoxObservations(set.id);
  const ev = repository.calculateBoxEV(set.id);
  const cards = repository.getCardsBySetId(set.id);

  const latest = history[history.length - 1]?.avg ?? set.msrpKRW;
  const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
  const change30d = ((latest - prev) / prev) * 100;
  const vsMsrp = ((latest - set.msrpKRW) / set.msrpKRW) * 100;

  return (
    <div className="space-y-8">
      <Link href="/cards" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:underline">
        <ArrowLeft size={14} /> 목록으로
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-ink-muted">{set.series} · {set.code}</div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">{set.nameKo}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {set.isActive ? <Badge variant="success">유통중</Badge> : <Badge variant="warning">절판</Badge>}
            <Badge variant="neutral">발매 {formatDate(set.releaseDate)}</Badge>
            <Badge variant="neutral">{set.packsPerBox}팩 / 박스</Badge>
            <Badge variant="neutral">총 {set.totalCards}종</Badge>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="박스 시세 (현재)" value={formatPrice(latest)} hint={`정가 ${formatPrice(set.msrpKRW)}`} />
        <Stat
          label="정가 대비"
          value={formatPct(vsMsrp)}
          tone={vsMsrp > 0 ? "negative" : "positive"}
          hint="박스 매수 시 손익선"
        />
        <Stat
          label="30일 변화"
          value={formatPct(change30d)}
          tone={change30d > 0 ? "negative" : change30d < 0 ? "positive" : "neutral"}
        />
        <Stat
          label="예측 모델"
          value={prediction ? `${(prediction.confidence * 100).toFixed(0)}%` : "—"}
          hint={prediction ? prediction.modelUsed : ""}
        />
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">박스 시세 추이 + 90일 예측</h2>
          {prediction && (
            <div className="text-xs text-ink-muted">
              {prediction.signals.join(" · ")}
            </div>
          )}
        </div>
        <PriceTrendChart history={history} prediction={prediction} />
      </section>

      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="card">
          <h2 className="font-bold text-lg mb-3">채널별 시세 스냅샷</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-ink-muted">
                <tr>
                  <th className="text-left py-2">채널</th>
                  <th className="text-left py-2">유형</th>
                  <th className="text-left py-2">단위</th>
                  <th className="text-right py-2">가격</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((o) => (
                  <tr key={o.id} className="border-t border-[var(--border)]">
                    <td className="py-2 font-medium">{o.marketplace}</td>
                    <td className="py-2 text-ink-muted">{o.channel}</td>
                    <td className="py-2 text-ink-muted">{o.unitDescription}</td>
                    <td className="py-2 text-right font-semibold tabular-nums">
                      {formatPrice(o.pricePerUnit, o.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg mb-1">박스 EV (기대값)</h2>
          <p className="text-xs text-ink-muted mb-3">
            박스에서 나올 수 있는 카드들의 시세 합. EV &gt; 박스가 → 리핑 매력 ↑
          </p>
          {ev ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Stat label="박스 시세" value={formatPrice(ev.boxPrice)} />
                <Stat
                  label="EV"
                  value={formatPrice(ev.expectedValue)}
                  tone={ev.evRatio >= 1 ? "positive" : "negative"}
                />
                <Stat
                  label="EV - 박스가"
                  value={formatPrice(ev.evMinusPrice)}
                  tone={ev.evMinusPrice >= 0 ? "positive" : "negative"}
                />
                <Stat
                  label="EV / 박스가"
                  value={`${ev.evRatio.toFixed(2)}x`}
                  tone={
                    ev.recommendation === "RIP"
                      ? "positive"
                      : ev.recommendation === "FLIP_BOX"
                        ? "warning"
                        : "neutral"
                  }
                  hint={
                    ev.recommendation === "RIP"
                      ? "리핑(박스 깐 후 싱글 판매) 매력"
                      : ev.recommendation === "FLIP_BOX"
                        ? "박스째 보유/판매 권장"
                        : "보합 — 시장 상황 추가 확인"
                  }
                />
              </div>
              {ev.contributors.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
                    EV 기여 Top
                  </div>
                  <ul className="text-sm divide-y divide-[var(--border)]">
                    {ev.contributors.slice(0, 5).map((c) => (
                      <li key={c.cardId} className="py-1.5 flex justify-between gap-2">
                        <span className="truncate">{c.nameKo}</span>
                        <span className="tabular-nums text-ink-muted text-xs whitespace-nowrap">
                          {(c.pullRate * 100).toFixed(2)}% × {formatPrice(c.estPrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">EV 계산을 위한 카드 데이터 부족.</p>
          )}
        </div>
      </section>

      {cards.length > 0 && (
        <section>
          <h2 className="font-bold text-lg mb-3">이 세트의 인기 싱글</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((c) => (
              <Link
                key={c.id}
                href={`/cards/single/${c.id}`}
                className="card hover:-translate-y-0.5 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs text-ink-muted">{c.number}</div>
                    <div className="font-bold truncate">{c.nameKo}</div>
                  </div>
                  <Badge variant="primary">{c.rarity}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="neutral">{t}</Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
