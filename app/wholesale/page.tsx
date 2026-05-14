import { ChannelCard } from "@/components/cards/ChannelCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { PageHero } from "@/components/layout/PageHero";
import { repository } from "@/lib/data/repository";
import { Building2 } from "lucide-react";

export const metadata = { title: "도매 구매처 가이드 | Poket" };

export default function WholesalePage() {
  const channels = repository.listChannels().filter((c) => c.type === "WHOLESALE");
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Wholesale"
        eyebrowIcon={<Building2 size={11} strokeWidth={2.4} />}
        title="도매 구매처"
        description="한국에서 박스·카툰 단위로 매입 가능한 도매 채널. 공인 카드샵 등록은 사업자등록 + 매장 운영 이력 필수. 일반 셀러는 아카토이·완구 도매상에서 시작 권장."
        mascot="koraidon"
        mascotSize={130}
        accent="red"
      />
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {channels.map((c) => (
          <StaggerItem key={c.id}>
            <ChannelCard channel={c} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal>
        <section className="card text-sm text-[var(--fg-muted)] leading-relaxed">
          <h2 className="font-bold text-base text-[var(--fg)] mb-3">📋 도매 진입 체크리스트</h2>
          <ol className="space-y-1.5 list-decimal pl-5">
            <li>사업자등록 (간이/일반) — 홈택스 또는 세무서 (소요 1~3일)</li>
            <li>통신판매업 신고 — 정부24 (gov.kr), 50회 미만 또는 간이과세자는 면제</li>
            <li>공인 카드샵 신청 (포켓몬코리아) — 매장 임차 이력 필요. 신청 후 심사 4~8주</li>
            <li>아카토이·남대문 도매시장에서 소량 시작 → 거래 이력 누적</li>
            <li>최소 발주량(MOQ) 협상: 1카툰 = 6박스부터 시작 권장</li>
          </ol>
        </section>
      </Reveal>
    </div>
  );
}
