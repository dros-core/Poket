import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/layout/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { guides } from "@/data/seed/guides";

export const metadata = { title: "가이드 모음 | Poket" };

const categoryLabel: Record<string, string> = {
  STRATEGY: "전략",
  MARKET: "시장",
  LEGAL: "법무·세무",
  GRADING: "그레이딩",
  OVERSEAS: "해외",
  DATA: "데이터"
};

export default function GuideIndexPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Knowledge Base"
        eyebrowIcon={<BookOpen size={11} strokeWidth={2.4} />}
        title="플레이북 · 가이드"
        description="한국 포켓몬 카드 시장에서 매수·매도 결정을 내리기 위한 전 영역 — 시장·전략·법무·그레이딩·데이터 — 핵심 자료."
        mascot="lucario"
        mascotSize={120}
        accent="blue"
      />
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {guides.map((g) => (
          <StaggerItem key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="card card-hover block h-full"
            >
              <Badge variant="primary">{categoryLabel[g.category]}</Badge>
              <h2 className="font-display text-xl mt-3 text-[var(--fg)] tracking-tight">{g.title}</h2>
              <p className="text-sm text-[var(--fg-muted)] mt-2 leading-relaxed">{g.intro}</p>
              <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[var(--fg-faint)]">
                {g.sections.length} sections
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
