/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "images.scrydex.com" },
      { protocol: "https", hostname: "assets.tcgdex.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.pokemon.com" },
      { protocol: "https", hostname: "img.pokemoncard.io" }
    ]
  }
};

export default nextConfig;
