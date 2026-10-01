"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools";
import { useRefreshRate } from "./useRefreshRate";

interface Info {
  screen: string;
  physical: string;
  aspect: string;
  scaling: string;
  viewport: string;
  available: string;
  colorDepth: string;
  gamut: string;
  hdr: string;
  orientation: string;
  input: string;
  touchPoints: string;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Common marketing names for ratios that don't reduce neatly (e.g. 2560×1080). */
function aspectName(w: number, h: number) {
  const g = gcd(w, h);
  const exact = `${w / g}:${h / g}`;
  const r = Math.max(w, h) / Math.min(w, h);
  const named: [number, string][] = [
    [16 / 9, "16:9"],
    [16 / 10, "16:10"],
    [4 / 3, "4:3"],
    [3 / 2, "3:2"],
    [21 / 9, "21:9"],
    [32 / 9, "32:9"],
    [19.5 / 9, "19.5:9"],
    [20 / 9, "20:9"],
  ];
  const near = named.find(([v]) => Math.abs(v - r) < 0.02);
  // Odd panel sizes reduce to unreadable ratios (3456×2234 → 1728:1117); give a decimal.
  if (!near) return w / g <= 64 ? exact : `${r.toFixed(2)}:1`;
  return exact === near[1] || exact === near[1].split(":").reverse().join(":") ? exact : `${exact} (≈ ${near[1]})`;
}

function readInfo(): Info {
  const s = window.screen;
  const dpr = window.devicePixelRatio || 1;
  const mq = (q: string) => window.matchMedia(q).matches;
  const pw = Math.round(s.width * dpr);
  const ph = Math.round(s.height * dpr);
  return {
    screen: `${s.width} × ${s.height}`,
    physical: `${pw} × ${ph}`,
    aspect: aspectName(pw, ph),
    scaling: `${Math.round(dpr * 100)}% (device pixel ratio ${+dpr.toFixed(3)})`,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    available: `${s.availWidth} × ${s.availHeight}`,
    colorDepth: `${s.colorDepth}-bit`,
    gamut: mq("(color-gamut: rec2020)")
      ? "Rec. 2020 (wide)"
      : mq("(color-gamut: p3)")
        ? "Display P3 (wide)"
        : mq("(color-gamut: srgb)")
          ? "sRGB (standard)"
          : "Not reported",
    hdr: mq("(dynamic-range: high)") ? "Yes — HDR is available" : "No (or HDR is switched off)",
    orientation:
      s.orientation?.type?.replace("-primary", "").replace("-secondary", " (flipped)") ??
      (window.innerWidth >= window.innerHeight ? "landscape" : "portrait"),
    input: mq("(pointer: coarse)") ? "Touch" : mq("(pointer: fine)") ? "Mouse or trackpad" : "None detected",
    touchPoints: navigator.maxTouchPoints ? `${navigator.maxTouchPoints}` : "None",
  };
}

const ROWS: { key: keyof Info; label: string; hint: string }[] = [
  { key: "physical", label: "Screen resolution (pixels)", hint: "Estimated from the browser: screen size × scaling." },
  { key: "screen", label: "Screen size in CSS pixels", hint: "What websites lay out against, after display scaling." },
  { key: "scaling", label: "Display scaling", hint: "Your OS or browser zoom. Changes the CSS size, not the panel." },
  { key: "aspect", label: "Aspect ratio", hint: "From the estimated pixel resolution." },
  { key: "viewport", label: "Browser window", hint: "The visible page area right now." },
  { key: "available", label: "Usable screen area", hint: "Screen minus taskbar, Dock or menu bar." },
  { key: "colorDepth", label: "Color depth", hint: "Bits per pixel the browser reports: 24 for 8-bit color, 30 for 10-bit." },
  { key: "gamut", label: "Color gamut", hint: "The widest color space the browser says the screen covers." },
  { key: "hdr", label: "HDR", hint: "Whether the browser can show HDR on this screen right now." },
  { key: "orientation", label: "Orientation", hint: "" },
  { key: "input", label: "Primary input", hint: "" },
  { key: "touchPoints", label: "Touch points", hint: "Maximum simultaneous touches the device reports." },
];

export default function ScreenInfoTool({ tool }: { tool: ToolDef }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [copied, setCopied] = useState(false);
  const hz = useRefreshRate();

  useEffect(() => {
    const update = () => setInfo(readInfo());
    // One-shot client-only read: screen and media-query values don't exist during the static render.
    update();
    const queries = [
      "(color-gamut: p3)",
      "(color-gamut: rec2020)",
      "(dynamic-range: high)",
      "(pointer: coarse)",
      "(resolution: 1dppx)",
    ].map((q) => window.matchMedia(q));
    window.addEventListener("resize", update);
    queries.forEach((m) => m.addEventListener("change", update));
    return () => {
      window.removeEventListener("resize", update);
      queries.forEach((m) => m.removeEventListener("change", update));
    };
  }, []);

  const rows = [
    ...ROWS.slice(0, 4).map((r) => ({ label: r.label, value: info?.[r.key], hint: r.hint })),
    {
      label: "Refresh rate",
      value: hz ? `≈ ${hz} Hz` : "Measuring…",
      hint: "Measured from animation frames. Check it with the Refresh Rate Test.",
    },
    ...ROWS.slice(4).map((r) => ({ label: r.label, value: info?.[r.key], hint: r.hint })),
  ];

  const copy = async () => {
    const text = rows.map((r) => `${r.label}: ${r.value ?? "—"}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing useful to do.
    }
  };

  return (
    <section aria-label={tool.name} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-foreground/60">Read live from this browser — nothing is sent anywhere.</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-white/5"
        >
          {copied ? "Copied ✓" : "Copy all"}
        </button>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-lg border border-border bg-background/40 p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground/50">{r.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">{r.value ?? "—"}</dd>
            {r.hint && <dd className="mt-0.5 text-xs text-foreground/50">{r.hint}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-foreground/50">
        Browsers report sizes after display scaling, so the pixel resolution is an estimate. If it doesn&apos;t
        match your screen&apos;s native resolution, check your scaling settings — and use the{" "}
        <Link href="/sharpness-test" className="text-accent hover:underline">
          Sharpness &amp; Text Clarity Test
        </Link>{" "}
        to see whether the picture is being scaled.
      </p>
    </section>
  );
}
