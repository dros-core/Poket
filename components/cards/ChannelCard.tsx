"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Star, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { PurchaseChannel } from "@/lib/types";

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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="card card-hover flex flex-col gap-3 h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold leading-tight">{channel.name}</h3>
            <Badge variant={t.variant}>{t.label}</Badge>
          </div>
          {channel.region && <div className="text-2xs text-[var(--fg-muted)] mt-0.5">{channel.region}</div>}
        </div>
        <div className="flex items-center gap-0.5 text-amber-500 shrink-0" aria-label={`신뢰도 ${channel.trustScore} / 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < channel.trustScore ? "fill-amber-500" : "opacity-25"}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-3">{channel.description}</p>

      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5">
          <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1 inline-flex items-center gap-1 text-2xs uppercase tracking-wider">
            <CheckCircle2 size={11} strokeWidth={2.5} /> 장점
          </div>
          <ul className="space-y-0.5 text-emerald-900/80 dark:text-emerald-100/70">
            {channel.pros.slice(0, 3).map((p) => (
              <li key={p} className="line-clamp-1">· {p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-2.5">
          <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1 inline-flex items-center gap-1 text-2xs uppercase tracking-wider">
            <XCircle size={11} strokeWidth={2.5} /> 단점
          </div>
          <ul className="space-y-0.5 text-rose-900/80 dark:text-rose-100/70">
            {channel.cons.slice(0, 3).map((c) => (
              <li key={c} className="line-clamp-1">· {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs">
        <div className="text-[var(--fg-muted)]">
          {channel.averageMarginPct
            ? `예상 마진 ${channel.averageMarginPct >= 0 ? "+" : ""}${channel.averageMarginPct}%`
            : "정가 판매"}
          {channel.minOrderQty ? ` · 최소 ${channel.minOrderQty}박스` : ""}
        </div>
        {channel.url && (
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
          >
            방문 <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
