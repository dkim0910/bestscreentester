"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/ui";

// "Install app", shown only where the browser offers installation and fires
// beforeinstallprompt (Chrome, Edge, Samsung Internet; on Android and desktop). Safari
// has no such event: there it is Share → Add to Home Screen, and nothing shows here.
interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const t = useT();
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the browser's own mini-infobar out of the way
      setPrompt(e as InstallPrompt);
    };
    const onInstalled = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!prompt) return null;
  return (
    <button
      type="button"
      onClick={async () => {
        await prompt.prompt();
        await prompt.userChoice;
        setPrompt(null); // a prompt can only be used once
      }}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground/80 hover:bg-white/5"
    >
      <span aria-hidden>⤓</span> {t("Install app: works offline")}
    </button>
  );
}
