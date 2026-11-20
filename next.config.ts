import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site exported to `out/` for GitHub Pages.
  output: "export",
  // GitHub Pages serves `/path/` -> `/path/index.html`, so emit directory-style URLs.
  trailingSlash: true,
  // next/image optimization isn't available on a static host.
  images: { unoptimized: true },
  // src/app/global-not-found.tsx: the site has one root layout per language, so the 404
  // for unmatched URLs can't be composed from a layout and a not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
