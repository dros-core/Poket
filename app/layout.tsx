import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "Poket — 한국 포켓몬 카드 시세 · 예측 · 도소매 가이드",
  description:
    "한국 포켓몬 카드(박스/카툰/싱글) 실시간 시세 추적, 통계 기반 가격 예측, KREAM·너정다·번개장터·해외 직구 가격 비교, 도매·소매 구매처 안내까지 한 곳에서.",
  metadataBase: new URL("https://poket.local"),
  applicationName: "Poket",
  openGraph: {
    title: "Poket — 한국 포켓몬 카드 시세 · 예측 · 도소매 가이드",
    description: "한국 포켓몬 카드 시세 분석, 가격 예측, 시세차익 기회까지 한 번에.",
    type: "website",
    locale: "ko_KR"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0d" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0d" }
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-ui">
        <div className="relative z-10 flex-1 flex flex-col">
          <Header />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 lg:px-6 py-6 sm:py-10 pb-24 lg:pb-16">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
