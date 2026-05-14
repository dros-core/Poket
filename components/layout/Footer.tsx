import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-bold text-base mb-2">Poket</div>
          <p className="text-ink-muted leading-relaxed">
            한국 포켓몬 카드 시세 추적·예측·구매처 분석 플랫폼. 박스/카툰 도매·소매·해외
            직구 의사결정을 한곳에서 지원합니다.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">탐색</div>
          <ul className="space-y-1.5 text-ink-muted">
            <li><Link href="/cards" className="hover:underline">카드/박스 시세</Link></li>
            <li><Link href="/trends" className="hover:underline">시세 추이</Link></li>
            <li><Link href="/predictions" className="hover:underline">가격 예측</Link></li>
            <li><Link href="/arbitrage" className="hover:underline">차익 기회</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">데이터·법적 고지</div>
          <ul className="space-y-1.5 text-ink-muted">
            <li><Link href="/guide/data-sources" className="hover:underline">데이터 출처</Link></li>
            <li><Link href="/guide/legal-tax" className="hover:underline">법적·세무 가이드</Link></li>
            <li className="text-xs leading-relaxed pt-2">
              본 사이트는 정보 제공 목적이며 거래 자체를 중개하지 않습니다. 시세는 KREAM·너정다·TCGBOX 등 공개 데이터 기반 추정치이며 실제와 다를 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-ink-muted">© {new Date().getFullYear()} Poket — Open project</div>
    </footer>
  );
}
