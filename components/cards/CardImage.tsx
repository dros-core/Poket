"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import type { ResolvedImage } from "@/lib/data/imageResolver";

interface Props {
  image: ResolvedImage;
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
  const [errored, setErrored] = useState(false);
  const showPlaceholder = image.isPlaceholder || errored;

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg bg-[var(--bg-mute)]",
        showPlaceholder && "border border-dashed border-[var(--border)] grid place-items-center",
        className
      )}
      style={{ width: w, height: h }}
    >
      {showPlaceholder ? (
        <div className="flex flex-col items-center justify-center gap-1 text-[var(--fg-faint)] text-center p-2">
          <svg viewBox="0 0 32 32" width={Math.min(w, h) / 3} height={Math.min(w, h) / 3} fill="currentColor" opacity="0.5">
            <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase font-mono">No Image</span>
        </div>
      ) : (
        <Image
          src={image.url}
          alt={image.alt}
          width={w}
          height={h}
          priority={priority}
          unoptimized={image.isPlaceholder}
          sizes={`${w}px`}
          className="object-contain w-full h-full"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
