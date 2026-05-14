import { Package } from "lucide-react";
import { ChannelCard } from "@/components/cards/ChannelCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { repository } from "@/lib/data/repository";

export const metadata = { title: "소매·P2P·해외 구매처 | Poket" };

export default function RetailPage() {
  const all = repository.listChannels();
  const retailOnline = all.filter((c) => c.type === "RETAIL_ONLINE");
  const retailOffline = all.filter((c) => c.type === "RETAIL_OFFLINE");
  const p2p = all.filter((c) => c.type === "P2P");
  const overseas = all.filter((c) => c.type === "OVERSEAS");

  return (
    <div className="space-y-12">
      <Reveal>
        <header>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Package size={12} strokeWidth={2.5} />
            소매 / P2P / 해외
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">소매 · P2P · 해외 구매처</h1>
          <p className="mt-3 text-sm sm:text-base text-[var(--fg-muted)] max-w-3xl leading-relaxed">
            박스 1개부터 정가 매수 가능한 채널 모음. 적립/할인 활용 시 정가 -10% 효과.
          </p>
        </header>
      </Reveal>

      <Section title="온라인 소매" desc="공식 직영 + 종합몰. 정가 ±5% 거래의 표준." items={retailOnline} />
      <Section title="오프라인 소매" desc="마트·문구·서점·공인 카드샵." items={retailOffline} />
      <Section title="P2P · 리셀" desc="KREAM·번개장터·중고나라·당근. 시세 형성에 가장 큰 영향." items={p2p} />
      <Section title="해외 직구" desc="Amazon JP / Rakuten / Mercari / eBay. 면세 한도 USD 150 주의." items={overseas} />
    </div>
  );
}

function Section({ title, desc, items }: { title: string; desc: string; items: any[] }) {
  return (
    <section>
      <Reveal>
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{desc}</p>
        </div>
      </Reveal>
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((c) => (
          <StaggerItem key={c.id}>
            <ChannelCard channel={c} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
