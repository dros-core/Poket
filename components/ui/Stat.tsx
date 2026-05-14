import clsx from "clsx";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "positive" | "negative" | "warning";
  hint?: string;
}

export function Stat({ label, value, delta, tone = "neutral", hint }: StatProps) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {delta && (
          <div
            className={clsx("text-sm font-semibold tabular-nums", {
              "text-emerald-600": tone === "positive",
              "text-rose-600": tone === "negative",
              "text-amber-600": tone === "warning",
              "text-ink-muted": tone === "neutral"
            })}
          >
            {delta}
          </div>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}
