import type { PricePrediction, PriceTrendPoint } from "@/lib/types";

/**
 * 메모리 친화적 통계 예측 모델
 * - Holt-Winters 단순화: level + trend (no seasonality, 데이터량 부족 케이스 대비)
 * - Holt's Linear Exponential Smoothing
 * - 예측 구간(불확실성)은 잔차 표준편차 기반 정규분포 가정
 *
 * 의존성/메모리: 외부 라이브러리 0, O(N) 시간, O(1) 추가 메모리
 */

interface HoltState {
  level: number;
  trend: number;
}

interface FittedModel extends HoltState {
  alpha: number;
  beta: number;
  residualStd: number;
  signals: string[];
}

function fitHolt(values: number[]): FittedModel {
  const signals: string[] = [];
  if (values.length < 3) {
    return {
      level: values[values.length - 1] ?? 0,
      trend: 0,
      alpha: 0.5,
      beta: 0.1,
      residualStd: 0,
      signals: ["데이터 부족: 단순 holding 예측"]
    };
  }

  // 최근 점에 더 가중치를 주는 alpha/beta (수동 휴리스틱; SSE 스캔으로 최적화)
  const candidates = [
    { alpha: 0.3, beta: 0.05 },
    { alpha: 0.5, beta: 0.1 },
    { alpha: 0.7, beta: 0.15 },
    { alpha: 0.9, beta: 0.2 }
  ];

  let best: FittedModel | null = null;
  let bestSse = Infinity;

  for (const { alpha, beta } of candidates) {
    let level = values[0];
    let trend = values[1] - values[0];
    let sse = 0;
    const residuals: number[] = [];

    for (let i = 1; i < values.length; i++) {
      const forecast = level + trend;
      const observed = values[i];
      const r = observed - forecast;
      residuals.push(r);
      sse += r * r;
      const newLevel = alpha * observed + (1 - alpha) * (level + trend);
      const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
      level = newLevel;
      trend = newTrend;
    }

    if (sse < bestSse) {
      bestSse = sse;
      const mean = residuals.reduce((a, b) => a + b, 0) / Math.max(residuals.length, 1);
      const variance =
        residuals.reduce((acc, r) => acc + (r - mean) ** 2, 0) / Math.max(residuals.length - 1, 1);
      best = {
        level,
        trend,
        alpha,
        beta,
        residualStd: Math.sqrt(variance),
        signals: []
      };
    }
  }

  const fitted = best!;
  if (Math.abs(fitted.trend) > Math.abs(fitted.level) * 0.01) {
    fitted.signals.push(fitted.trend > 0 ? "강한 상승 추세 감지" : "강한 하락 추세 감지");
  } else {
    fitted.signals.push("보합 추세");
  }
  if (fitted.residualStd > Math.abs(fitted.level) * 0.08) {
    fitted.signals.push("높은 변동성 - 신뢰구간 넓게 설정");
  }
  return fitted;
}

/**
 * 가격 모멘텀 시그널: 직전 30일 변화율
 */
function detectMomentum(values: number[]): string | null {
  if (values.length < 4) return null;
  const recent = values[values.length - 1];
  const prior = values[Math.max(0, values.length - 5)];
  const pct = ((recent - prior) / prior) * 100;
  if (pct > 8) return `최근 30일 +${pct.toFixed(1)}% 단기 모멘텀`;
  if (pct < -8) return `최근 30일 ${pct.toFixed(1)}% 약세 모멘텀`;
  return null;
}

export function forecastPrice(
  productId: string,
  history: PriceTrendPoint[],
  horizonDays = 90
): PricePrediction {
  const values = history.map((h) => h.avg);
  const fitted = fitHolt(values);

  // 주 단위 시계열을 일 단위로 보간
  const stepDays = 7;
  const stepsAhead = Math.ceil(horizonDays / stepDays);
  const lastDate =
    history.length > 0 ? new Date(history[history.length - 1].date).getTime() : Date.now();

  const forecastPoints = [] as PricePrediction["forecast"];
  for (let i = 1; i <= stepsAhead; i++) {
    const predicted = Math.max(0, fitted.level + fitted.trend * i);
    // 95% 신뢰구간 ≈ ±1.96σ; 시간이 멀어질수록 σ 확대
    const uncertainty = fitted.residualStd * Math.sqrt(i);
    const forecastDate = new Date(lastDate + i * stepDays * 86400000)
      .toISOString()
      .slice(0, 10);
    forecastPoints.push({
      date: forecastDate,
      predicted: Math.round(predicted),
      lowerBound: Math.max(0, Math.round(predicted - 1.96 * uncertainty)),
      upperBound: Math.round(predicted + 1.96 * uncertainty)
    });
  }

  const momentum = detectMomentum(values);
  if (momentum) fitted.signals.push(momentum);

  // 신뢰도: 데이터 길이 + 잔차 비율 기반
  const length = values.length;
  const stability = 1 - Math.min(1, fitted.residualStd / Math.max(1, fitted.level) / 0.2);
  const lengthScore = Math.min(1, length / 26); // 26주 ≈ 6개월
  const confidence = Math.max(0.2, Math.min(0.95, 0.4 * lengthScore + 0.6 * stability));

  return {
    productId,
    generatedAt: new Date().toISOString(),
    horizonDays,
    forecast: forecastPoints,
    modelUsed: "Holt's Linear Exponential Smoothing (auto α,β)",
    confidence: Number(confidence.toFixed(2)),
    signals: fitted.signals
  };
}
