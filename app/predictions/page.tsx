import { LineChart, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { PageHero } from "@/components/layout/PageHero";
import { PredictionsTable, type PredictionRow } from "@/components/tables/PredictionsTable";
import { repository } from "@/lib/data/repository";

export const metadata = { title: "가격 예측 | Poket" };

export default function PredictionsPage() {
  const sets = repository.listSets();
  const rows: PredictionRow[] = sets
    .map((s) => {
      const pred = repository.predictBoxPrice(s.id, 90);
      const history = repository.getBoxPriceHistory(s.id, 30);
      const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
      if (!pred || pred.forecast.length === 0) return null;
      const last = pred.forecast[pred.forecast.length - 1];
      const expectedChange = ((last.predicted - latest) / latest) * 100;
      return { set: s, latest, prediction: pred, last, expectedChange };
    })
    .filter(Boolean) as PredictionRow[];

  rows.sort((a, b) => b.expectedChange - a.expectedChange);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Price Forecast"
        eyebrowIcon={<LineChart size={11} strokeWidth={2.4} />}
        title="90일 가격 예측"
        description="Holt's Linear ES 기반 90일 예측 + 95% 신뢰구간 + 모델 시그널. 참고용이며 실제 거래 결정은 추가 시장 정보와 함께 판단."
        mascot="mew"
        mascotSize={120}
        accent="purple"
      />

      <Reveal>
        <PredictionsTable rows={rows} />
      </Reveal>

      <Reveal>
        <section className="card text-sm text-[var(--fg-muted)] leading-relaxed">
          <h2 className="font-bold text-base text-[var(--fg)] mb-3 flex items-center gap-2">
            <Sparkles size={16} strokeWidth={2.5} className="text-brand-600" />
            예측 모델 설명
          </h2>
          <ul className="space-y-1.5">
            <li>
              <strong className="text-[var(--fg)]">Holt&apos;s Linear ES</strong>: 레벨(level) + 추세(trend) 두 평활 인자(α, β)를 SSE 최소화로 자동 선택. 외부 라이브러리 없이 경량 구현.
            </li>
            <li>신뢰구간 = ±1.96 × 잔차 표준편차 × √(예측 단계). 시간이 멀어질수록 구간이 넓어집니다.</li>
            <li>신뢰도 = 데이터 길이(50%) + 잔차 안정성(50%) 기반 0.2 ~ 0.95 사이.</li>
            <li>한계: 신상 발매·메타 변화·환율 급변 등 <em>외부 충격</em>은 모델이 즉각 반영하지 않습니다.</li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
