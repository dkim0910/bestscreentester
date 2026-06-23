"use client";

import Script from "next/script";

// GA4 Measurement ID. Defaults to the site's ID; override via env if needed.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FC5ELM4BX8";

/**
 * Google Analytics (GA4), loaded for every visitor. There is no cookie/consent
 * gate — if you reintroduce one, gate the scripts below on the stored choice.
 */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
