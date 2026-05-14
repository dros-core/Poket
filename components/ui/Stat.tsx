import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  /** "up"/"down"이 한국 시세 컨벤션 (상승=빨강, 하락=파랑) */
  tone?: "neutral" | "up" | "down" | "warning" | "positive" | "negative";
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<NonNullable<StatProps["tone"]>, string> = {
  neutral: "text-[var(--fg-muted)]",
  up: "text-up bg-up",
  down: "text-down bg-down",
  warning: "text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300",
  positive: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300",
  negative: "text-rose-600 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
};

export function Stat({ label, value, delta, tone = "neutral", hint, icon, className }: StatProps) {
  const isUp = tone === "up" || tone === "negative" || tone === "warning";
  const isDown = tone === "down" || tone === "positive";

  return (
    <div className={clsx("card card-hover relative overflow-hidden group", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-2xs uppercase tracking-wider text-[var(--fg-faint)] font-semibold">
          {label}
        </div>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-mute)] grid place-items-center text-[var(--fg-muted)] group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
        <div className="text-2xl sm:text-3xl font-bold tnum tracking-tight">{value}</div>
        {delta && (
          <div
            className={clsx(
              "inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold tnum px-1.5 py-0.5 rounded-md",
              toneClasses[tone]
            )}
          >
            {isUp && <ArrowUpRight size={12} strokeWidth={2.5} />}
            {isDown && <ArrowDownRight size={12} strokeWidth={2.5} />}
            {tone === "neutral" && <Minus size={12} strokeWidth={2.5} />}
            {delta}
          </div>
        )}
      </div>
      {hint && <div className="mt-1.5 text-xs text-[var(--fg-muted)] leading-snug">{hint}</div>}
    </div>
  );
}
