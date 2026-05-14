import { Wallet } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PortfolioClient } from "./PortfolioClient";
import { repository } from "@/lib/data/repository";

export const metadata = { title: "포트폴리오 — 박스 보유 수익률 | Poket" };

export default function PortfolioPage() {
  const sets = [...repository.listSets()].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  const setOptions = sets.map((s) => ({ id: s.id, nameKo: s.nameKo, msrpKRW: s.msrpKRW }));
  const setNameMap: Record<string, string> = Object.fromEntries(sets.map((s) => [s.id, s.nameKo]));

  // 현재 박스 단가 (history 의 가장 최근 avg)
  const currentPrices: Record<string, number | undefined> = {};
  for (const s of sets) {
    const history = repository.getBoxPriceHistory(s.id, 30);
    const latest = history[history.length - 1]?.avg;
    currentPrices[s.id] = latest ?? s.msrpKRW;
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Portfolio Tracker"
        eyebrowIcon={<Wallet size={11} strokeWidth={2.4} />}
        title="포트폴리오"
        description="보유한 부스터박스를 등록하면 현재 시세 기반 평가액과 수익률이 실시간으로 계산됩니다. 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다."
        mascot="charizard"
        mascotSize={130}
        accent="gold"
      />
      <PortfolioClient
        sets={setOptions}
        setNameMap={setNameMap}
        currentPrices={currentPrices}
      />
    </div>
  );
}
