"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// GA4 Measurement ID. Defaults to the site's ID; override via env if needed.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FC5ELM4BX8";
export const CONSENT_KEY = "bst_cookie_consent";
export const CONSENT_EVENT = "bst-consent-changed";

/**
 * Google Analytics (GA4), loaded only after the visitor accepts the cookie
 * notice. `CookieConsent` dispatches `CONSENT_EVENT` when the choice changes so
 * GA can start without a page reload. Declining = GA never loads.
 */
export default function Analytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    function read() {
      let ok = false;
      try {
        ok = localStorage.getItem(CONSENT_KEY) === "accepted";
      } catch {
        ok = false;
      }
      setAccepted(ok);
    }
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, []);

  if (!GA_ID || !accepted) return null;

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
