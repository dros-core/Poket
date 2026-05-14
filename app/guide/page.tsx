import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
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
      <header>
        <h1 className="text-2xl font-bold">가이드</h1>
        <p className="mt-1 text-sm text-ink-muted">
          한국 포켓몬 카드 시장에서 매수/매도 결정을 내리기 위한 전 영역(시장·전략·법무·그레이딩·데이터) 핵심 자료.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guide/${g.slug}`} className="card hover:-translate-y-0.5 transition">
            <Badge variant="primary">{categoryLabel[g.category]}</Badge>
            <h2 className="font-bold text-lg mt-2">{g.title}</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">{g.intro}</p>
            <div className="mt-3 text-xs text-ink-muted">{g.sections.length}개 섹션</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
