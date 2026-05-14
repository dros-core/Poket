"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Sparkles, TrendingUp, Coins, BookOpen } from "lucide-react";

const items = [
  { href: "/", label: "홈", icon: LayoutDashboard },
  { href: "/cards", label: "카드", icon: Sparkles },
  { href: "/trends", label: "추이", icon: TrendingUp },
  { href: "/arbitrage", label: "차익", icon: Coins },
  { href: "/guide", label: "가이드", icon: BookOpen }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-lg bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] border-t border-[var(--border)] pb-safe"
      aria-label="모바일 하단 네비게이션"
    >
      <ul className="flex items-stretch justify-around max-w-md mx-auto">
        {items.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={clsx(
                  "flex flex-col items-center justify-center py-2 px-1 gap-0.5 transition-colors",
                  active
                    ? "text-brand-600"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
                aria-current={active ? "page" : undefined}
              >
                <it.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{it.label}</span>
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 bg-brand-500 rounded-b-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
