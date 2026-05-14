import clsx from "clsx";

type Variant = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const variants: Record<Variant, string> = {
  neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  primary: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200"
};

export function Badge({
  children,
  variant = "neutral"
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
