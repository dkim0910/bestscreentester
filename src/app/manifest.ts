import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

// Makes the site installable as an app. The offline half is the service worker that
// scripts/generate-sw.mjs writes to out/sw.js after every build (npm's postbuild), so it
// can list that build's exact files. Icons come from scripts/generate-pwa-icons.mjs.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: "ScreenTester",
    description: "Free screen tests that work offline: dead pixels, backlight bleed, uniformity, refresh rate, ghosting and more.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0b0f",
    theme_color: "#0a0b0f",
    categories: ["utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
