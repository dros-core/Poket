import clsx from "clsx";

interface Props {
  className?: string;
  rounded?: string;
}

export function Skeleton({ className, rounded = "rounded-md" }: Props) {
  return <div className={clsx("shimmer", rounded, className)} aria-hidden />;
}
