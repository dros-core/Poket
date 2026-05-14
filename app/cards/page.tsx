import { SetCard } from "@/components/cards/SetCard";
import { repository } from "@/lib/data/repository";

export const metadata = { title: "한국 포켓몬 카드 박스 시세 | Poket" };

export default function CardsPage() {
  const sets = [...repository.listSets()].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">한국 포켓몬 카드 박스</h1>
        <p className="mt-1 text-sm text-ink-muted">
          한국 정식 발매 박스 전체. 카드 카드를 클릭하면 시세 추이/예측/싱글 EV/매입처 비교를 확인할 수 있습니다.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sets.map((s) => {
          const history = repository.getBoxPriceHistory(s.id, 30);
          const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
          const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
          return <SetCard key={s.id} set={s} latestPrice={latest} prevPrice={prev} />;
        })}
      </div>
    </div>
  );
}
