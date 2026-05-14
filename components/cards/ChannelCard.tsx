import { Badge } from "@/components/ui/Badge";
import type { PurchaseChannel } from "@/lib/types";
import { CheckCircle2, ExternalLink, Star, XCircle } from "lucide-react";
import { formatPct } from "@/lib/format";

const typeLabels: Record<PurchaseChannel["type"], { label: string; variant: any }> = {
  WHOLESALE: { label: "도매", variant: "primary" },
  RETAIL_ONLINE: { label: "온라인 소매", variant: "info" },
  RETAIL_OFFLINE: { label: "오프라인 소매", variant: "info" },
  P2P: { label: "P2P", variant: "warning" },
  OVERSEAS: { label: "해외 직구", variant: "danger" }
};

export function ChannelCard({ channel }: { channel: PurchaseChannel }) {
  const t = typeLabels[channel.type];
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{channel.name}</h3>
            <Badge variant={t.variant}>{t.label}</Badge>
          </div>
          {channel.region && (
            <div className="text-xs text-ink-muted mt-0.5">{channel.region}</div>
          )}
        </div>
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < channel.trustScore ? "fill-amber-500" : "opacity-30"}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{channel.description}</p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-semibold text-emerald-600 mb-1 inline-flex items-center gap-1">
            <CheckCircle2 size={12} /> 장점
          </div>
          <ul className="space-y-0.5 text-ink-muted">
            {channel.pros.slice(0, 3).map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-rose-600 mb-1 inline-flex items-center gap-1">
            <XCircle size={12} /> 단점
          </div>
          <ul className="space-y-0.5 text-ink-muted">
            {channel.cons.slice(0, 3).map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
        <div className="text-ink-muted">
          {channel.averageMarginPct ? `예상 마진 ${formatPct(channel.averageMarginPct)}` : "정가 판매"}
          {channel.minOrderQty ? ` · 최소 ${channel.minOrderQty}박스` : ""}
        </div>
        {channel.url && (
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-600 hover:underline"
          >
            방문 <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
