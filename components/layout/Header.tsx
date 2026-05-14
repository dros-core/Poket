import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "대시보드" },
  { href: "/cards", label: "카드/박스" },
  { href: "/trends", label: "시세 추이" },
  { href: "/predictions", label: "가격 예측" },
  { href: "/arbitrage", label: "차익 기회" },
  { href: "/wholesale", label: "도매" },
  { href: "/retail", label: "소매" },
  { href: "/guide", label: "가이드" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Poket 홈">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-bold shadow-card group-hover:scale-105 transition">
            P
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">Poket</div>
            <div className="text-[10px] text-ink-muted">한국 포켓몬카드 시세</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-[var(--surface-muted)] transition text-[var(--fg)]/85"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <nav className="lg:hidden border-t border-[var(--border)] overflow-x-auto">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-xs rounded-md hover:bg-[var(--surface-muted)] whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
