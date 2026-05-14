"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, TrendingUp, LineChart, Coins, Building2, Package, BookOpen, LayoutDashboard, Sparkles } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/cards", label: "카드/박스", icon: Sparkles },
  { href: "/trends", label: "시세 추이", icon: TrendingUp },
  { href: "/predictions", label: "예측", icon: LineChart },
  { href: "/arbitrage", label: "차익", icon: Coins },
  { href: "/wholesale", label: "도매", icon: Building2 },
  { href: "/retail", label: "소매", icon: Package },
  { href: "/guide", label: "가이드", icon: BookOpen }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // body 스크롤 잠금
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "backdrop-blur-lg bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Poket 홈">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 grid place-items-center text-white font-extrabold shadow-card group-hover:shadow-glow transition-shadow">
              <span className="relative z-10">P</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-base sm:text-lg">Poket</div>
              <div className="text-[10px] text-[var(--fg-muted)] -mt-0.5 hidden sm:block">
                한국 포켓몬카드 시세
              </div>
            </div>
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    "relative px-3 py-1.5 text-sm rounded-lg transition-colors font-medium",
                    active
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-mute)]"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 bg-[var(--bg-mute)] rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-mute)] transition-colors"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-sm bg-[var(--bg-elev)] border-l border-[var(--border)] lg:hidden flex flex-col pt-safe"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border)]">
                <span className="font-bold">메뉴</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-mute)]"
                  aria-label="메뉴 닫기"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3">
                {navLinks.map((l, i) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={l.href}
                        className={clsx(
                          "flex items-center gap-3 px-5 py-3.5 text-base font-medium transition-colors",
                          active
                            ? "text-brand-600 bg-brand-50 dark:bg-brand-950/30 border-r-2 border-brand-500"
                            : "text-[var(--fg)] hover:bg-[var(--bg-mute)]"
                        )}
                      >
                        <l.icon size={18} strokeWidth={active ? 2.5 : 2} />
                        {l.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="px-5 py-4 border-t border-[var(--border)] text-xs text-[var(--fg-muted)]">
                <p>한국 포켓몬 카드 시세 추적 · 예측 · 구매처 분석</p>
                <p className="mt-1 opacity-75">© {new Date().getFullYear()} Poket</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
