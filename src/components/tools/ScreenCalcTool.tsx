"use client";

import { useEffect, useState } from "react";
import type { ToolDef } from "@/lib/tools";
import { useT } from "@/i18n/ui";

// The Screen Size & PPI Calculator: diagonal + resolution in, density and physical
// dimensions out. No stage; a form and a results grid. The maths assumes square pixels.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// Marketing names for ratios that don't reduce neatly (3440×1440 is 43:18, sold as 21:9).
const NAMED: [number, string][] = [
  [16 / 9, "16:9"],
  [16 / 10, "16:10"],
  [4 / 3, "4:3"],
  [3 / 2, "3:2"],
  [5 / 4, "5:4"],
  [21 / 9, "21:9"],
  [32 / 9, "32:9"],
  [19.5 / 9, "19.5:9"],
  [20 / 9, "20:9"],
];

function aspect(w: number, h: number): string {
  const long = Math.max(w, h);
  const short = Math.min(w, h);
  const r = long / short;
  const near = NAMED.find(([v]) => Math.abs(v - r) < 0.03);
  if (near) return near[1];
  const g = gcd(long, short);
  return long / g <= 64 ? `${long / g}:${short / g}` : `${r.toFixed(2)}:1`;
}

const PRESETS: [label: string, w: number, h: number][] = [
  ["1080p", 1920, 1080],
  ["1440p", 2560, 1440],
  ["4K", 3840, 2160],
  ["3440 × 1440", 3440, 1440],
];

const INPUT = "h-11 w-full rounded-md border border-border-strong bg-background px-3 text-lg tabular-nums";

export default function ScreenCalcTool({ tool }: { tool: ToolDef }) {
  const t = useT();
  const [diagonal, setDiagonal] = useState("27");
  const [width, setWidth] = useState("2560");
  const [height, setHeight] = useState("1440");

  useEffect(() => {
    // One-shot client-only read: start from this screen's own resolution.
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(window.screen.width * dpr);
    const h = Math.round(window.screen.height * dpr);
    if (w > 0 && h > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWidth(String(Math.max(w, h)));
      setHeight(String(Math.min(w, h)));
    }
    // The diagonal can't be read, but a touch-first device is not a 27-inch monitor:
    // start from a typical phone or tablet size so the first result is in the right range.
    const short = Math.min(window.screen.width, window.screen.height);
    if (short > 0 && window.matchMedia("(pointer: coarse)").matches) {
      if (short < 500) setDiagonal("6.1");
      else if (short < 1100) setDiagonal("11");
    }
  }, []);

  const d = Number(diagonal);
  const w = Math.floor(Number(width));
  const h = Math.floor(Number(height));
  const valid = d > 0 && d < 1000 && w > 0 && h > 0 && w < 100000 && h < 100000;

  const diagonalPx = Math.hypot(w, h);
  const ppi = valid ? diagonalPx / d : 0;
  const widthIn = valid ? w / ppi : 0;
  const heightIn = valid ? h / ppi : 0;
  const fix = (n: number, digits: number) => n.toFixed(digits);

  const rows = valid
    ? [
        { label: t("Pixel density"), value: `${fix(ppi, 1)} PPI` },
        { label: t("Aspect ratio"), value: aspect(w, h) },
        {
          label: t("Width"),
          value: `${fix(widthIn, 1)} in · ${fix(widthIn * 2.54, 1)} cm`,
        },
        {
          label: t("Height"),
          value: `${fix(heightIn, 1)} in · ${fix(heightIn * 2.54, 1)} cm`,
        },
        { label: t("Pixel pitch"), value: `${fix(25.4 / ppi, 3)} mm` },
        { label: t("Total pixels"), value: `${fix((w * h) / 1e6, 2)} MP` },
      ]
    : [];

  return (
    <section aria-label={tool.name} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm text-foreground/70">
          {t("Diagonal (inches)")}
          <input
            id="calc-diagonal"
            type="number"
            inputMode="decimal"
            min={1}
            step={0.1}
            value={diagonal}
            onChange={(e) => setDiagonal(e.target.value)}
            className={`mt-1.5 ${INPUT}`}
          />
        </label>
        <label className="block text-sm text-foreground/70">
          {t("Width (pixels)")}
          <input
            id="calc-width"
            type="number"
            inputMode="numeric"
            min={1}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={`mt-1.5 ${INPUT}`}
          />
        </label>
        <label className="block text-sm text-foreground/70">
          {t("Height (pixels)")}
          <input
            id="calc-height"
            type="number"
            inputMode="numeric"
            min={1}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`mt-1.5 ${INPUT}`}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map(([label, pw, ph]) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setWidth(String(pw));
              setHeight(String(ph));
            }}
            className="rounded-full border border-border px-3.5 py-1 text-sm text-foreground/70 hover:bg-white/5 hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>

      {valid ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {rows.map((r) => (
            <div key={r.label} className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-foreground/50">{r.label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-5 text-sm text-foreground/60" aria-live="polite">
          {t("Enter a diagonal and a resolution above zero.")}
        </p>
      )}
      <p className="mt-4 text-xs text-foreground/50">
        {t("The resolution starts as the one your browser reports for this screen. The diagonal has to come from you: a browser can't measure it.")}
      </p>
    </section>
  );
}
