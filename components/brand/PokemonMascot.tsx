"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * 포켓몬 공식 일러스트 (official artwork) 활용.
 * 출처: PokeAPI sprite 저장소 (raw.githubusercontent.com/PokeAPI/sprites)
 *   — 컬렉터 fan-use 영역에서 광범위하게 활용되는 공개 자산.
 *   — 비상업/정보 사이트로 사용. 저작권 표시 Footer.
 */

const PA_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const MASCOT = {
  pikachu:    { id: 25,  name: "피카츄",       en: "Pikachu" },
  charizard:  { id: 6,   name: "리자몽",       en: "Charizard" },
  mewtwo:     { id: 150, name: "뮤츠",         en: "Mewtwo" },
  mew:        { id: 151, name: "뮤",           en: "Mew" },
  eevee:      { id: 133, name: "이브이",       en: "Eevee" },
  umbreon:    { id: 197, name: "블래키",       en: "Umbreon" },
  sylveon:    { id: 700, name: "님피아",       en: "Sylveon" },
  lucario:    { id: 448, name: "루카리오",     en: "Lucario" },
  garchomp:   { id: 445, name: "한바리스",     en: "Garchomp" },
  greninja:   { id: 658, name: "개굴닌자",     en: "Greninja" },
  zoroark:    { id: 571, name: "조로아크",     en: "Zoroark" },
  zekrom:     { id: 644, name: "제크로무",     en: "Zekrom" },
  reshiram:   { id: 643, name: "레시라무",     en: "Reshiram" },
  terapagos:  { id: 1024, name: "테라파고스",  en: "Terapagos" },
  miraidon:   { id: 1008, name: "미라이돈",    en: "Miraidon" },
  koraidon:   { id: 1007, name: "코라이돈",    en: "Koraidon" },
  ogerpon:    { id: 1017, name: "오거폰",      en: "Ogerpon" }
} as const;

export type MascotKey = keyof typeof MASCOT;

interface Props {
  pokemon: MascotKey;
  size?: number;
  className?: string;
  priority?: boolean;
  /** 떠다니는 애니메이션 */
  floating?: boolean;
  /** 반전 (좌우 미러) */
  flip?: boolean;
}

export function PokemonMascot({ pokemon, size = 96, className, priority, floating, flip }: Props) {
  const meta = MASCOT[pokemon];
  const url = `${PA_BASE}/${meta.id}.png`;

  const img = (
    <Image
      src={url}
      alt={meta.name}
      width={size}
      height={size}
      priority={priority}
      className={clsx("object-contain", flip && "-scale-x-100")}
      style={{ width: size, height: size }}
      unoptimized
    />
  );

  if (!floating) {
    return <div className={className}>{img}</div>;
  }
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {img}
    </motion.div>
  );
}
