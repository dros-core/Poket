import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { repository } from "@/lib/data/repository";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "가격 예측 | Poket" };

export default function PredictionsPage() {
  const sets = repository.listSets();
  const rows = sets
    .map((s) => {
      const pred = repository.predictBoxPrice(s.id, 90);
      const history = repository.getBoxPriceHistory(s.id, 30);
      const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
      if (!pred || pred.forecast.length === 0) return null;
      const last = pred.forecast[pred.forecast.length - 1];
      const expectedChange = ((last.predicted - latest) / latest) * 100;
      return { set: s, latest, prediction: pred, last, expectedChange };
    })
    .filter(Boolean) as any[];

  rows.sort((a, b) => b.expectedChange - a.expectedChange);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">가격 예측</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Holt&apos;s Linear Exponential Smoothing 기반 90일 예측. 95% 신뢰구간과 모델 시그널을 함께 제시합니다.
          예측은 참고용이며 실제 거래 결정은 추가 시장 정보와 함께 판단하세요.
        </p>
      </header>

      <section className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs uppercase text-ink-muted">
              <tr>
                <th className="text-left px-4 py-2">세트</th>
                <th className="text-right px-4 py-2">현재가</th>
                <th className="text-right px-4 py-2">90일 예측</th>
                <th className="text-right px-4 py-2">기대 변동</th>
                <th className="text-right px-4 py-2">하한 (95%)</th>
                <th className="text-right px-4 py-2">상한 (95%)</th>
                <th className="text-right px-4 py-2">신뢰도</th>
                <th className="text-left px-4 py-2">시그널</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.set.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2">
                    <Link href={`/cards/${r.set.id}`} className="font-medium hover:underline">
                      {r.set.nameKo}
                    </Link>
                    <div className="text-xs text-ink-muted">{r.set.code}</div>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatPrice(r.latest)}</td>
                  <td className="px-4 py-2 text-right font-bold tabular-nums">
                    {formatPrice(r.last.predicted)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={r.expectedChange > 0 ? "text-rose-600" : "text-emerald-600"}>
                      {r.expectedChange >= 0 ? "+" : ""}
                      {r.expectedChange.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-ink-muted tabular-nums">
                    {formatPrice(r.last.lowerBound)}
                  </td>
                  <td className="px-4 py-2 text-right text-ink-muted tabular-nums">
                    {formatPrice(r.last.upperBound)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Badge
                      variant={
                        r.prediction.confidence > 0.7
                          ? "success"
                          : r.prediction.confidence > 0.5
                            ? "info"
                            : "warning"
                      }
                    >
                      {(r.prediction.confidence * 100).toFixed(0)}%
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-xs text-ink-muted">
                    {r.prediction.signals.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card text-sm leading-relaxed text-ink-muted">
        <h2 className="font-bold text-base text-[var(--fg)] mb-2">예측 모델 설명</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Holt&apos;s Linear ES</strong>: 레벨(level) + 추세(trend) 두 평활 인자(α, β)를 SSE 최소화로 자동 선택합니다.
            외부 라이브러리 없이 경량 구현 — 메모리 부담 없음.
          </li>
          <li>신뢰구간 = ±1.96 × 잔차 표준편차 × √(예측 단계). 시간이 멀어질수록 구간이 넓어집니다.</li>
          <li>신뢰도 = 데이터 길이(50%) + 잔차 안정성(50%) 기반 0.2 ~ 0.95 사이.</li>
          <li>
            한계: 신상 발매·메타 변화·환율 급변 등 <em>외부 충격</em>은 모델이 즉각 반영하지 않습니다.
            보조 시그널과 함께 해석하세요.
          </li>
        </ul>
      </section>
    </div>
  );
}
