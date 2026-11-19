"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// The AdSense loader, kept off the noindexed pages (pranks, screensaver, merged
// guides): ads belong beside written content, not on novelty screens. The layout
// passes the paths in, so the tool and guide registries stay out of the client bundle.
//
// Site verification doesn't depend on this script: the `google-adsense-account` meta
// tag in the layout and public/ads.txt are on every page regardless.
export default function AdSenseScript({ client, skip }: { client: string; skip: string[] }) {
  const pathname = usePathname() ?? "/";
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (skip.includes(path)) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
