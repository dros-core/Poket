interface Props {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * 포켓볼 SVG 로고 — 자체 작성 (저작권 안전).
 * 그라데이션 빨강/하양 + 중앙 버튼 + 하이라이트.
 */
export function PokeballLogo({ size = 36, className, animated = true }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Poket 로고"
    >
      <defs>
        <radialGradient id="pbTop" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="55%" stopColor="#EE1515" />
          <stop offset="100%" stopColor="#B7090E" />
        </radialGradient>
        <radialGradient id="pbBot" cx="35%" cy="70%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D6D6D6" />
        </radialGradient>
      </defs>
      <path d="M32 4 a28 28 0 0 1 28 28 H4 A28 28 0 0 1 32 4z" fill="url(#pbTop)" />
      <path d="M4 32 a28 28 0 0 0 56 0z" fill="url(#pbBot)" />
      <rect x="2" y="29" width="60" height="6" fill="#222224" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="#222224" strokeWidth="3" />
      <circle cx="32" cy="32" r="8.5" fill="#FFFFFF" stroke="#222224" strokeWidth="3" />
      <circle cx="32" cy="32" r="3.5" fill="#F0F0F0" stroke="#222224" strokeWidth="1.5" />
      <ellipse cx="22" cy="18" rx="6" ry="3" fill="#FFFFFF" opacity="0.55" />
    </svg>
  );
}

export function PokeballOutline({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
