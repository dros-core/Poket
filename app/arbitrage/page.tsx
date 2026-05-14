import { Stat } from "@/components/ui/Stat";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { ArbitrageTable } from "@/components/tables/ArbitrageTable";
import { repository } from "@/lib/data/repository";
import { formatPrice } from "@/lib/format";
import { Coins, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";

export const metadata = { title: "차익(아비트라지) 기회 | Poket" };

export default function ArbitragePage() {
  const opps = repository.findArbitrageOpportunities();
  const total = opps.length;
  const totalProfit = opps.reduce((acc, o) => acc + o.estimatedNetProfit, 0);
  const lowRisk = opps.filter((o) => o.riskLevel === "LOW").length;
  const avgMargin = total > 0 ? opps.reduce((a, o) => a + o.marginPct, 0) / total : 0;

  return (
    <div className="space-y-8">
      <Reveal>
        <header>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Coins size={12} strokeWidth={2.5} />
            아비트라지 자동 탐지
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">시세차익 기회</h1>
          <p className="mt-3 text-sm sm:text-base text-[var(--fg-muted)] max-w-3xl leading-relaxed">
            각 박스 SKU에 대해 채널간 매수/매도 갭을 자동 탐지합니다. 수수료(플랫폼별)와 배송비
            차감 후 NET 수익이 +5% 이상인 케이스만 노출. 마진이 높을수록 리스크 검증을 강화하세요.
          </p>
        </header>
      </Reveal>

      <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StaggerItem>
          <Stat label="발견 기회" value={`${total}건`} icon={<Coins size={14} strokeWidth={2.5} />} />
        </StaggerItem>
        <StaggerItem>
          <Stat
            label="저위험"
            value={`${lowRisk}건`}
            tone="positive"
            icon={<ShieldCheck size={14} strokeWidth={2.5} />}
          />
        </StaggerItem>
        <StaggerItem>
          <Stat
            label="총 잠재 수익"
            value={formatPrice(totalProfit)}
            tone="up"
            icon={<TrendingUp size={14} strokeWidth={2.5} />}
          />
        </StaggerItem>
        <StaggerItem>
          <Stat
            label="평균 마진"
            value={`${avgMargin.toFixed(1)}%`}
            tone="up"
            icon={<AlertCircle size={14} strokeWidth={2.5} />}
          />
        </StaggerItem>
      </StaggerGroup>

      <Reveal>
        <ArbitrageTable opportunities={opps} />
      </Reveal>

      <Reveal>
        <section className="card text-sm text-[var(--fg-muted)] leading-relaxed">
          <h2 className="font-bold text-base text-[var(--fg)] mb-3 flex items-center gap-2">
            <AlertCircle size={16} strokeWidth={2.5} className="text-amber-600" />
            거래 전 체크포인트
          </h2>
          <ul className="space-y-1.5">
            <li>• 매도 채널의 실제 체결까지의 소요 시간(KREAM 검수 7~14일 등) 고려</li>
            <li>• P2P/해외 거래는 사기·반품·관세 등 리스크가 있어 마진의 1/3 이상은 비상 버퍼</li>
            <li>• 월 50회 이상 매도 시 통신판매업 신고 의무 발생 가능</li>
            <li>• 대량 거래 발전 시 사업자등록·간이과세 검토 필수</li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
