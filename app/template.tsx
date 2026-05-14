"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Next.js App Router의 template.tsx는 페이지 전환 시 재마운트됩니다.
 * 가벼운 fade-up 페이지 전환을 적용합니다.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
