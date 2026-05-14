import Link from "next/link";
import { Github } from "lucide-react";

const groups = [
  {
    title: "탐색",
    links: [
      { label: "대시보드", href: "/" },
      { label: "카드/박스 시세", href: "/cards" },
      { label: "시세 추이", href: "/trends" },
      { label: "가격 예측", href: "/predictions" },
      { label: "차익 기회", href: "/arbitrage" }
    ]
  },
  {
    title: "구매처",
    links: [
      { label: "도매 채널", href: "/wholesale" },
      { label: "소매 / P2P / 해외", href: "/retail" },
      { label: "차익 플레이북", href: "/guide/arbitrage-playbook" },
      { label: "구매처 가이드", href: "/guide/purchase-guide" }
    ]
  },
  {
    title: "가이드",
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
  { label: "너정다 (ICU)", url: "https://icu.gg/" },
  { label: "TCGBOX", url: "https://tcgbox.co.kr/" },
  { label: "번개장터", url: "https://m.bunjang.co.kr/" },
  { label: "TCGdex", url: "https://tcgdex.dev/" },
  { label: "포켓몬코리아", url: "https://pokemonkorea.co.kr/" }
];

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10 sm:py-14">
        {/* 상단: 브랜드 + 네비 */}
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 grid place-items-center text-white font-extrabold shadow-card">
                P
              </div>
              <div className="leading-tight">
                <div className="font-extrabold tracking-tight text-lg">Poket</div>
                <div className="text-2xs text-[var(--fg-muted)]">한국 포켓몬카드 시세</div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm">
              한국 포켓몬 카드 시세 추적·예측·구매처 분석 플랫폼. 박스/카툰 도매·소매·해외 직구
              의사결정을 한곳에서 지원합니다.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[var(--bg-mute)] hover:bg-[var(--bg-card)] border border-[var(--border)] grid place-items-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-2xs uppercase tracking-wider font-bold text-[var(--fg-muted)]">{g.title}</div>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--fg-soft)] hover:text-brand-600 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 데이터 소스 */}
        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <div className="text-2xs uppercase tracking-wider font-bold text-[var(--fg-muted)] mb-3">
            데이터 소스
          </div>
          <div className="flex flex-wrap gap-2">
            {dataSources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 rounded-md bg-[var(--bg-mute)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--fg-soft)] hover:text-brand-600 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* 하단: 면책 + 카피라이트 */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-2xs text-[var(--fg-faint)]">
          <p className="max-w-3xl leading-relaxed">
            본 사이트는 정보 제공 목적이며 거래를 중개하지 않습니다. 시세는 공개 데이터 기반 추정치로
            실거래와 차이가 있을 수 있습니다. 카드 이미지 © The Pokémon Company / 포켓몬코리아.
          </p>
          <p className="font-medium">© {new Date().getFullYear()} Poket</p>
        </div>
      </div>
    </footer>
  );
}
