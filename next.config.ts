import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site exported to `out/` for GitHub Pages.
  output: "export",
  // GitHub Pages serves `/path/` -> `/path/index.html`, so emit directory-style URLs.
  trailingSlash: true,
  // next/image optimization isn't available on a static host.
  images: { unoptimized: true },
};

export default nextConfig;
