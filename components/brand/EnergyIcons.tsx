/**
 * 포켓몬 TCG 에너지 심볼 — 자체 제작 SVG (라이선스 안전).
 * 게임/카드의 공식 에너지 디자인을 모티프로만 차용한 단순 기하학적 형태.
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export function FireEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M16 3C16 3 9 11 9 18C9 23.5 12 28 16 28C20 28 23 23.5 23 18C23 16 21 13.5 19.5 13.5C19.5 10 18 5.5 16 3Z" opacity="0.9" />
      <path d="M16 13C16 13 13 17 13 20.5C13 23.5 14.5 25.5 16 25.5C17.5 25.5 19 23.5 19 20.5C19 19 18 17 16 13Z" fill="#fff" opacity="0.4" />
    </svg>
  );
}

export function WaterEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M16 3C16 3 7 14 7 21C7 25.5 11 29 16 29C21 29 25 25.5 25 21C25 14 16 3 16 3Z" opacity="0.9" />
      <path d="M11 19C12 22 14 24 16 24" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function ElectricEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M18 3L8 17H14L12 29L24 13H17L18 3Z" opacity="0.9" />
    </svg>
  );
}

export function GrassEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M16 4C12 8 8 11 8 17C8 23 11 28 16 28C21 28 24 23 24 17C24 11 20 8 16 4Z" opacity="0.9" />
      <path d="M16 6C16 12 16 22 16 28" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.4" />
    </svg>
  );
}

export function PsychicEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <circle cx="16" cy="16" r="12" opacity="0.9" />
      <circle cx="16" cy="16" r="6" fill="#fff" opacity="0.3" />
      <circle cx="16" cy="16" r="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function FightingEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M16 4L26 16L16 28L6 16L16 4Z" opacity="0.9" />
      <path d="M16 10L20 16L16 22L12 16L16 10Z" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function DarknessEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <circle cx="16" cy="16" r="12" opacity="0.9" />
      <path d="M11 12C11 15 13 17 16 17C19 17 21 15 21 12" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function MetalEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <circle cx="16" cy="16" r="12" opacity="0.9" />
      <circle cx="16" cy="16" r="4" fill="#fff" opacity="0.3" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="#fff" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="#fff" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function DragonEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M6 6L26 26M6 26L26 6" stroke={color} strokeWidth="3" opacity="0.9" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" opacity="0.9" />
    </svg>
  );
}

export function FairyEnergy({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill={color} aria-hidden>
      <path d="M16 4L20 12L28 12L22 18L24 26L16 22L8 26L10 18L4 12L12 12Z" opacity="0.9" />
    </svg>
  );
}

/** 모든 에너지 + 색상 매핑 */
export const ENERGY_TYPES = [
  { Icon: FireEnergy, color: "#ff8a4c", label: "fire" },
  { Icon: WaterEnergy, color: "#5b9eff", label: "water" },
  { Icon: ElectricEnergy, color: "#ffd02c", label: "electric" },
  { Icon: GrassEnergy, color: "#7acf4c", label: "grass" },
  { Icon: PsychicEnergy, color: "#ff70a0", label: "psychic" },
  { Icon: FightingEnergy, color: "#d63f3a", label: "fighting" },
  { Icon: DarknessEnergy, color: "#8b7a66", label: "darkness" },
  { Icon: MetalEnergy, color: "#c8c8d8", label: "metal" },
  { Icon: DragonEnergy, color: "#7e4dff", label: "dragon" },
  { Icon: FairyEnergy, color: "#e5a0c4", label: "fairy" }
] as const;
