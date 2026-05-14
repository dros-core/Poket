import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CardImage } from "@/components/cards/CardImage";
import type { CardSet } from "@/lib/types";
import { formatPrice, formatDate, formatPct } from "@/lib/format";
import { resolveSetImage } from "@/lib/data/imageResolver";

interface Props {
  set: CardSet;
  latestPrice: number;
  prevPrice: number;
}

export function SetCard({ set, latestPrice, prevPrice }: Props) {
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;
  const tone = change > 1 ? "danger" : change < -1 ? "info" : "neutral";
  const status = set.isActive ? <Badge variant="success">유통중</Badge> : <Badge variant="warning">절판</Badge>;
  const image = resolveSetImage(set);

  return (
    <Link
      href={`/cards/${set.id}`}
      className="card group flex flex-col gap-3 hover:-translate-y-0.5 transition"
    >
      <div className="flex gap-3">
        <CardImage image={image} variant="card" width={88} height={123} className="shrink-0" />
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs text-ink-muted truncate">{set.series}</div>
              <h3 className="font-bold text-base truncate">{set.nameKo}</h3>
            </div>
            {status}
          </div>
          <div className="mt-1 text-xs text-ink-muted flex flex-wrap gap-x-3 gap-y-0.5">
            <span>{formatDate(set.releaseDate)}</span>
            <span>{set.packsPerBox}팩 / 박스</span>
            <span>총 {set.totalCards}종</span>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-ink-muted">박스 시세</div>
          <div className="font-bold text-lg tabular-nums">{formatPrice(latestPrice)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-ink-muted">정가 대비</div>
          <Badge variant={tone === "danger" ? "danger" : tone === "info" ? "info" : "neutral"}>
            {formatPct(((latestPrice - set.msrpKRW) / set.msrpKRW) * 100)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
