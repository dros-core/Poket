import Image from "next/image";
import clsx from "clsx";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  image: ResolvedImage;
  /** 박스(가로형 hero) vs 단일카드(세로형) */
  variant?: "card" | "hero";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function CardImage({ image, variant = "card", width, height, className, priority }: Props) {
  const isCard = variant === "card";
  const w = width ?? (isCard ? 220 : 360);
  const h = height ?? (isCard ? 308 : 252);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg bg-[var(--surface-muted)]",
        image.isPlaceholder && "border border-dashed border-[var(--border)]",
        className
      )}
      style={{ width: w, height: h }}
    >
      <Image
        src={image.url}
        alt={image.alt}
        width={w}
        height={h}
        priority={priority}
        unoptimized={image.isPlaceholder}
        sizes={`${w}px`}
        className="object-contain w-full h-full"
      />
      {!image.isPlaceholder && (
        <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/55 text-white opacity-0 group-hover:opacity-100 transition">
          {image.source.replace("TCGDEX_", "TCGdex/").toLowerCase()}
        </span>
      )}
    </div>
  );
}
