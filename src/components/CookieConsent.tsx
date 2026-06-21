"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY as STORAGE_KEY, CONSENT_EVENT } from "./Analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  // Only decide visibility after mount so server and client markup match.
  useEffect(() => {
    let consented = true;
    try {
      consented = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      // localStorage blocked (e.g. private mode) — treat as consented, hide banner.
      consented = true;
    }
    if (!consented) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only reveal after reading localStorage on mount
      setVisible(true);
    }
  }, []);

  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore storage failures
    }
    // Let Analytics react immediately (load GA on accept) without a reload.
    try {
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-foreground/70">
          We use cookies, including Google Analytics, to understand how the site is used. The screen
          tests always run locally. You can decline analytics. See our{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-none gap-2">
          <button
            onClick={() => decide("declined")}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
          >
            Decline
          </button>
          <button
            onClick={() => decide("accepted")}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
