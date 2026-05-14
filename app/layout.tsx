import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Poket — 한국 포켓몬 카드 시세 · 예측 · 도소매 가이드",
  description:
    "한국 포켓몬 카드(박스/카툰/싱글) 실시간 시세 추적, 통계 기반 가격 예측, KREAM·너정다·번개장터·해외 직구 가격 비교, 도매·소매 구매처 안내까지 한 곳에서.",
  metadataBase: new URL("https://poket.local"),
  openGraph: {
    title: "Poket — 한국 포켓몬 카드 시세 · 예측 · 도소매 가이드",
    description: "한국 포켓몬 카드 시세 분석, 가격 예측, 시세차익 기회까지 한 번에.",
    type: "website",
    locale: "ko_KR"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="light">
      <body>
        <Header />
        <main className="mx-auto max-w-7xl px-4 lg:px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
