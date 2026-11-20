"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRefreshRate } from "./tools/useRefreshRate";
import { useLocalHref, useT } from "@/i18n/ui";

// SMPTE-style 75% bars over a grey ramp: decoration, but a real test pattern.
const BARS = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
const RAMP = ["#000000", "#242424", "#494949", "#6d6d6d", "#929292", "#b6b6b6", "#dbdbdb", "#ffffff"];

interface Reading {
  resolution: string;
  gamut: string;
}

function read(): Reading {
  const s = window.screen;
  const dpr = window.devicePixelRatio || 1;
  const mq = (q: string) => window.matchMedia(q).matches;
  return {
    // Same estimate the Screen Info tool shows: CSS size × scaling.
    resolution: `${Math.round(s.width * dpr)} × ${Math.round(s.height * dpr)}`,
    gamut: mq("(color-gamut: rec2020)")
      ? "Rec. 2020"
      : mq("(color-gamut: p3)")
        ? "Display P3"
        : mq("(color-gamut: srgb)")
          ? "sRGB"
          : "Not reported",
  };
}

/** Homepage hero panel: three values read live from the visitor's own screen. */
export default function ScreenReadout() {
  const [reading, setReading] = useState<Reading | null>(null);
  const hz = useRefreshRate();
  const t = useT();
  const localHref = useLocalHref();

  useEffect(() => {
    const update = () => setReading(read());
    // One-shot client-only read: screen and media-query values don't exist during the static render.
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cells = [
    { label: t("Resolution"), value: reading?.resolution ?? "—" },
    { label: t("Refresh rate"), value: hz ? `≈ ${hz} Hz` : t("Measuring…") },
    { label: t("Color gamut"), value: reading ? t(reading.gamut) : "—" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-card">
      <div className="eyebrow flex justify-between border-b border-border px-4 py-3">
        <span>{t("Your screen")}</span>
        <span>{t("Read live")}</span>
      </div>
      <div aria-hidden className="flex h-28 sm:h-32">
        {BARS.map((c) => (
          <span key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div aria-hidden className="flex h-6">
        {RAMP.map((c) => (
          <span key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <dl className="grid grid-cols-3 divide-x divide-border">
        {cells.map((c) => (
          <div key={c.label} className="min-w-0 px-3 py-4 sm:px-4">
            <dt className="eyebrow truncate">{c.label}</dt>
            <dd className="mt-1.5 truncate font-mono text-sm tabular-nums sm:text-[17px]">{c.value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href={localHref("/screen-info")}
        className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-foreground/65 transition-colors hover:text-foreground"
      >
        {t("Full Screen Info report")} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
