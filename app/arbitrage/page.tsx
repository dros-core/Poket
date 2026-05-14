import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { repository } from "@/lib/data/repository";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "차익(아비트라지) 기회 | Poket" };

export default function ArbitragePage() {
  const opps = repository.findArbitrageOpportunities();
  const total = opps.length;
  const totalProfit = opps.reduce((acc, o) => acc + o.estimatedNetProfit, 0);
  const lowRisk = opps.filter((o) => o.riskLevel === "LOW").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">시세차익 기회</h1>
        <p className="mt-1 text-sm text-ink-muted">
          각 박스 SKU에 대해 채널간 매수/매도 갭을 자동 탐지합니다. 수수료(플랫폼별)와 배송비 차감 후
          NET 수익이 +5% 이상인 케이스만 노출. 마진이 높을수록 리스크도 함께 검증하세요.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="발견 기회" value={`${total}건`} />
        <Stat label="저위험" value={`${lowRisk}건`} tone="positive" />
        <Stat label="총 잠재 수익" value={formatPrice(totalProfit)} tone="positive" />
        <Stat label="평균 마진" value={total > 0 ? `${(opps.reduce((a, o) => a + o.marginPct, 0) / total).toFixed(1)}%` : "—"} />
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs uppercase text-ink-muted">
              <tr>
                <th className="text-left px-4 py-2">세트</th>
                <th className="text-left px-4 py-2">매수처</th>
                <th className="text-right px-4 py-2">매수가</th>
                <th className="text-left px-4 py-2">매도처</th>
                <th className="text-right px-4 py-2">매도가</th>
                <th className="text-right px-4 py-2">수수료</th>
                <th className="text-right px-4 py-2">배송</th>
                <th className="text-right px-4 py-2">NET 수익</th>
                <th className="text-right px-4 py-2">마진</th>
                <th className="px-4 py-2">리스크</th>
                <th className="px-4 py-2">메모</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((o) => {
                const set = repository.getSet(o.productId);
                return (
                  <tr key={o.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2">
                      <Link href={`/cards/${o.productId}`} className="font-medium hover:underline">
                        {set?.nameKo ?? o.productId}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{o.buyChannel}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{formatPrice(o.buyPrice)}</td>
                    <td className="px-4 py-2">{o.sellChannel}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{formatPrice(o.sellPrice)}</td>
                    <td className="px-4 py-2 text-right text-ink-muted">{o.feesPct}%</td>
                    <td className="px-4 py-2 text-right text-ink-muted tabular-nums">
                      {formatPrice(o.shippingKRW)}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600 tabular-nums">
                      {formatPrice(o.estimatedNetProfit)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{o.marginPct.toFixed(1)}%</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={
                          o.riskLevel === "LOW" ? "success" : o.riskLevel === "MEDIUM" ? "warning" : "danger"
                        }
                      >
                        {o.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-xs text-ink-muted">{o.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card text-sm text-ink-muted leading-relaxed">
        <h2 className="font-bold text-base text-[var(--fg)] mb-2">사용 시 주의</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>매도 채널의 실제 체결까지의 소요 시간(KREAM 검수 7~14일 등)을 고려하세요.</li>
          <li>P2P/해외 거래는 사기·반품·관세 등 리스크가 있어 마진의 1/3 이상은 비상 버퍼로 두세요.</li>
          <li>월 50회 이상 매도 시 통신판매업 신고 의무 발생 가능 → /guide/legal-tax 확인.</li>
          <li>대량 거래로 발전 시 사업자등록·간이과세 검토 필수.</li>
        </ul>
      </section>
    </div>
  );
}
