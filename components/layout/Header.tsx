"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, TrendingUp, LineChart, Coins, Building2, Package, BookOpen, LayoutDashboard, Sparkles } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";
import { PokeballLogo } from "@/components/brand/PokeballLogo";

const navLinks = [
  { href: "/", label: "Overview", labelKo: "대시보드", icon: LayoutDashboard },
  { href: "/cards", label: "Sets", labelKo: "카드/박스", icon: Sparkles },
  { href: "/trends", label: "Trends", labelKo: "시세 추이", icon: TrendingUp },
  { href: "/predictions", label: "Forecast", labelKo: "예측", icon: LineChart },
  { href: "/arbitrage", label: "Arbitrage", labelKo: "차익", icon: Coins },
  { href: "/wholesale", label: "Wholesale", labelKo: "도매", icon: Building2 },
  { href: "/retail", label: "Retail", labelKo: "소매", icon: Package },
  { href: "/guide", label: "Guides", labelKo: "가이드", icon: BookOpen }
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
          "sticky top-0 z-40 transition-all duration-500",
          scrolled
            ? "backdrop-blur-xl bg-[var(--bg-glass)] border-b border-[var(--border)]"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* 로고 — 작고 우아하게 */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Poket 홈">
            <div className="transition-transform duration-700 ease-luxe group-hover:rotate-[20deg]">
              <PokeballLogo size={28} />
            </div>
            <div className="leading-none">
              <div className="font-display font-semibold tracking-tight text-lg sm:text-xl text-[var(--fg)]">Poket</div>
              <div className="text-[9px] text-[var(--fg-faint)] font-pixel tracking-widest mt-0.5 hidden sm:block">
                KR · MARKET
              </div>
            </div>
          </Link>

          {/* 데스크탑 네비 — 영어 라벨 우선 (럭셔리) */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    "relative px-3 py-1.5 text-[13px] rounded-md transition-colors font-medium tracking-wide",
                    active
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-soft)]"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 bg-[var(--bg-mute)] rounded-md -z-10 border border-[var(--border)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-mute)] transition-colors text-[var(--fg-muted)] hover:text-[var(--fg)]"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
            >
              {open ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-sm glass border-l border-[var(--border)] lg:hidden flex flex-col pt-safe"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border)]">
                <span className="font-display font-semibold text-base">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-mute)]"
                  aria-label="메뉴 닫기"
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3">
                {navLinks.map((l, i) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <Link
                        href={l.href}
                        className={clsx(
                          "flex items-center justify-between px-5 py-3.5 transition-colors group",
                          active
                            ? "text-[var(--accent)] bg-[var(--accent-bg)]"
                            : "text-[var(--fg-soft)] hover:bg-[var(--bg-mute)]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <l.icon size={17} strokeWidth={active ? 2 : 1.6} />
                          <div className="leading-none">
                            <div className="font-medium text-base">{l.labelKo}</div>
                            <div className="text-[10px] text-[var(--fg-faint)] font-pixel tracking-widest mt-1">
                              {l.label}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="px-5 py-4 border-t border-[var(--border)] text-xs text-[var(--fg-muted)]">
                <p>한국 포켓몬 카드 시세 · 예측 · 채널 분석</p>
                <p className="mt-1 text-[var(--fg-faint)]">© {new Date().getFullYear()} Poket</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
