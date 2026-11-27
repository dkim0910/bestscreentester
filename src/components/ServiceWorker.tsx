"use client";

import { useEffect } from "react";
import { useLang } from "@/i18n/ui";

// Registers the offline service worker (out/sw.js, written by scripts/generate-sw.mjs
// after each build). Production only: `next dev` has no sw.js, and a worker caching
// dev builds would serve stale code. `?lang=` picks which language's test pages it
// saves for offline use.
export default function ServiceWorker() {
  const lang = useLang();
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register(`/sw.js?lang=${lang}`, { scope: "/" }).catch(() => {
        // Unsupported or blocked (private mode, file://): the site works as before.
      });
    };
    // After load, so precaching never competes with the page's own requests.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, [lang]);
  return null;
}
