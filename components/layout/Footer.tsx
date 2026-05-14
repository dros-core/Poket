import Link from "next/link";
import { Github } from "lucide-react";
import { PokeballLogo } from "@/components/brand/PokeballLogo";

const groups = [
  {
    title: "Explore",
    links: [
      { label: "대시보드", href: "/" },
      { label: "카드/박스 시세", href: "/cards" },
      { label: "시세 추이", href: "/trends" },
      { label: "가격 예측", href: "/predictions" },
      { label: "차익 기회", href: "/arbitrage" }
    ]
  },
  {
    title: "Channels",
    links: [
      { label: "도매", href: "/wholesale" },
      { label: "소매 · P2P · 해외", href: "/retail" },
      { label: "차익 플레이북", href: "/guide/arbitrage-playbook" },
      { label: "구매처 가이드", href: "/guide/purchase-guide" }
    ]
  },
  {
    title: "Guides",
    links: [
      { label: "전체 가이드", href: "/guide" },
      { label: "시장 개요", href: "/guide/market-overview" },
      { label: "그레이딩", href: "/guide/grading-guide" },
      { label: "법무·세무", href: "/guide/legal-tax" },
      { label: "데이터 소스", href: "/guide/data-sources" }
    ]
  }
];

const dataSources = [
  { label: "KREAM", url: "https://kream.co.kr/" },
  { label: "ICU.gg", url: "https://icu.gg/" },
  { label: "TCGBOX", url: "https://tcgbox.co.kr/" },
  { label: "번개장터", url: "https://m.bunjang.co.kr/" },
  { label: "TCGdex", url: "https://tcgdex.dev/" },
  { label: "Pokemon Korea", url: "https://pokemonkorea.co.kr/" }
];

export function Footer() {
  return (
    <footer className="relative mt-20 sm:mt-32 border-t border-[var(--border)]">
      {/* 미세 그라데이션 백드롭 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6 py-12 sm:py-16">
        {/* 큰 워드마크 (Goldin 스타일) */}
        <div className="mb-12 pb-8 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <PokeballLogo size={32} />
            <span className="font-display text-3xl sm:text-5xl tracking-tight text-[var(--fg)] leading-none">
              Poket<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>
          <p className="text-sm text-[var(--fg-muted)] max-w-sm leading-relaxed">
            한국 포켓몬 카드 시세 추적 · 예측 · 구매처 분석 플랫폼.
            <br className="hidden sm:block" />
            <span className="text-[var(--fg-faint)] text-xs">매수·매도 의사결정의 데이터 레이어.</span>
          </p>
        </div>

        {/* 4-column nav */}
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--fg-faint)] mb-4">
              Data Sources
            </div>
            <ul className="space-y-2">
              {dataSources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--fg-soft)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1"
                  >
                    {s.label}
                    <span className="text-[var(--fg-faint)] text-[10px]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--fg-faint)] mb-4">
                {g.title}
              </div>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--fg-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-[11px] text-[var(--fg-faint)] leading-relaxed max-w-3xl font-mono tracking-wide">
            Pokémon and All Respective Names are Trademark & © of Nintendo · Creatures · GAME FREAK · TPCi.
            <br />
            Poket is a fan-made price tracker and is not affiliated with or endorsed by The Pokémon Company.
            Card images courtesy of TCGdex.
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] grid place-items-center transition-colors text-[var(--fg-muted)]"
              aria-label="GitHub"
            >
              <Github size={15} strokeWidth={1.8} />
            </a>
            <span className="text-xs text-[var(--fg-faint)] font-mono">
              © {new Date().getFullYear()} Poket
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
