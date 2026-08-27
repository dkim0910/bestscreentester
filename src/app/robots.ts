import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Next's static export writes an RSC flight payload beside every route
      // (`__next.*.txt`) plus an `index.txt` per directory — 493 files that duplicate
      // each page's visible text and are served with HTTP 200. Nothing links to them,
      // but keep crawlers out anyway.
      //
      // Matched narrowly on purpose: a blanket `/*.txt$` would also block /ads.txt
      // (AdSense) and the IndexNow key file, and `/_next/` must stay crawlable or
      // Googlebot and Bingbot cannot fetch the JS/CSS they need to render the page.
      disallow: ["/*__next", "/*index.txt$"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
