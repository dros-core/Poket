import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { guides, getGuide } from "@/data/seed/guides";

const categoryLabel: Record<string, string> = {
  STRATEGY: "전략",
  MARKET: "시장",
  LEGAL: "법무·세무",
  GRADING: "그레이딩",
  OVERSEAS: "해외",
  DATA: "데이터"
};

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:underline">
        <ArrowLeft size={14} /> 가이드 목록
      </Link>
      <header>
        <Badge variant="primary">{categoryLabel[guide.category]}</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight mt-3">{guide.title}</h1>
        <p className="mt-3 text-ink-muted leading-relaxed">{guide.intro}</p>
      </header>

      <div className="space-y-6">
        {guide.sections.map((s) => (
          <section key={s.id} className="card">
            <h2 className="font-bold text-lg">{s.title}</h2>
            <p className="text-sm text-ink-muted mt-1">{s.summary}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-brand-600 font-bold leading-5">·</span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {guide.references && guide.references.length > 0 && (
        <section className="card">
          <h2 className="font-bold text-lg mb-2">참고 링크</h2>
          <ul className="space-y-1 text-sm">
            {guide.references.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline inline-flex items-center gap-1"
                >
                  {r.label} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
