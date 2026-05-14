/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF primary (글로벌 93% 지원, -20% 크기) + WebP fallback
    formats: ["image/avif", "image/webp"],
    // 31일 캐시 (Vercel image transformation 비용 -50~70%)
    minimumCacheTTL: 2_678_400,
    // Galaxy S24 QHD+ 대응 (deviceSizes 명시)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // NOTE: Next.js 15 의 `qualities` 화이트리스트 옵션은 14 에서 인식 안 됨.
    //       대신 컴포넌트에서 `quality={75}` 명시로 cache pollution 방지 (BoxMockup 적용 완료).
    //       Next.js 15 마이그레이션 시 `qualities: [50, 75]` 추가 권장.
    remotePatterns: [
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "images.scrydex.com" },
      { protocol: "https", hostname: "assets.tcgdex.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.pokemon.com" },
      { protocol: "https", hostname: "img.pokemoncard.io" },
      { protocol: "https", hostname: "product-images.tcgplayer.com" },
      { protocol: "https", hostname: "tcgplayer-cdn.tcgplayer.com" }
    ]
  },
  async headers() {
    return [
      {
        // 자체 호스팅 박스 사진 — immutable 1년 캐시 (Vercel CDN 효율 ↑)
        source: "/box-photos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        // placeholder SVG / static images — 1년 immutable
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

export default nextConfig;
