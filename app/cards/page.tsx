import { Sparkles } from "lucide-react";
import { SetCard } from "@/components/cards/SetCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { repository } from "@/lib/data/repository";
import { resolveSetImage } from "@/lib/data/imageResolver";

export const metadata = { title: "한국 포켓몬 카드 박스 시세 | Poket" };

export default function CardsPage() {
  const sets = [...repository.listSets()].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  return (
    <div className="space-y-8">
      <Reveal>
        <header>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Sparkles size={12} strokeWidth={2.5} />
            {sets.length}개 세트 추적 중
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">한국 포켓몬 카드 박스</h1>
          <p className="mt-3 text-sm sm:text-base text-[var(--fg-muted)] max-w-3xl leading-relaxed">
            한국 정식 발매 박스 전체. 카드를 클릭하면 시세 추이/예측/싱글 EV/매입처 비교를 확인할 수 있습니다.
          </p>
        </header>
      </Reveal>
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sets.map((s) => {
          const history = repository.getBoxPriceHistory(s.id, 30);
          const latest = history[history.length - 1]?.avg ?? s.msrpKRW;
          const prev = history[Math.max(0, history.length - 5)]?.avg ?? latest;
          const sparkData = history.map((h) => h.avg);
          const image = resolveSetImage(s);
          return (
            <StaggerItem key={s.id}>
              <SetCard set={s} latestPrice={latest} prevPrice={prev} sparkData={sparkData} image={image} />
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
