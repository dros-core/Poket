import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "up" | "down" | "warning" | "positive" | "negative";
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<NonNullable<StatProps["tone"]>, string> = {
  neutral: "text-[var(--fg-muted)] bg-[var(--bg-mute)] border-[var(--border)]",
  up: "text-up bg-up border-up/20",
  down: "text-down bg-down border-down/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  negative: "text-rose-400 bg-rose-500/10 border-rose-500/20"
};

export function Stat({ label, value, delta, tone = "neutral", hint, icon, className }: StatProps) {
  const isUp = tone === "up" || tone === "negative" || tone === "warning";
  const isDown = tone === "down" || tone === "positive";

  return (
    <div className={clsx("card card-hover relative overflow-hidden group", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] uppercase tracking-widest text-[var(--fg-faint)] font-pixel">
          {label}
        </div>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-mute)] grid place-items-center text-[var(--fg-faint)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-bg)] transition-colors">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <div className="font-mono text-2xl sm:text-3xl font-medium tnum tracking-tight text-[var(--fg)]">
          {value}
        </div>
        {delta && (
          <div
            className={clsx(
              "inline-flex items-center gap-0.5 text-xs sm:text-sm font-mono font-medium tnum px-1.5 py-0.5 rounded border",
              toneClasses[tone]
            )}
          >
            {isUp && <ArrowUpRight size={11} strokeWidth={2.2} />}
            {isDown && <ArrowDownRight size={11} strokeWidth={2.2} />}
            {tone === "neutral" && <Minus size={11} strokeWidth={2.2} />}
            {delta}
          </div>
        )}
      </div>
      {hint && <div className="mt-2 text-xs text-[var(--fg-muted)] leading-snug">{hint}</div>}
    </div>
  );
}
