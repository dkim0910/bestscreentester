"use client";

import { useEffect, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

// Each frame: the most saturated sRGB color as the background, and the same hue at its
// Display P3 maximum inside the logo. On a P3-capable screen and browser the logo stands
// out as a deeper, more vivid shape; on an sRGB screen both are clipped to the same
// color and the logo vanishes.
const FRAMES = [
  { name: "Red", srgb: "rgb(255 0 0)", p3: "color(display-p3 1 0 0)" },
  { name: "Green", srgb: "rgb(0 255 0)", p3: "color(display-p3 0 1 0)" },
  { name: "Blue", srgb: "rgb(0 0 255)", p3: "color(display-p3 0 0 1)" },
  { name: "Orange", srgb: "rgb(255 128 0)", p3: "color(display-p3 1 0.5 0)" },
  { name: "Cyan", srgb: "rgb(0 255 255)", p3: "color(display-p3 0 1 1)" },
  { name: "Magenta", srgb: "rgb(255 0 255)", p3: "color(display-p3 1 0 1)" },
];

interface Support {
  css: boolean; // the browser understands color(display-p3 …)
  gamut: "rec2020" | "p3" | "srgb" | "unknown";
}

function Chip({ ok, children }: { ok: boolean | null; children: React.ReactNode }) {
  const tone = ok === null ? "border-border text-foreground/60" : ok ? "border-green-500/40 text-green-300" : "border-amber-500/40 text-amber-300";
  return <span className={`rounded-full border px-3 py-1 text-sm ${tone}`}>{children}</span>;
}

export default function WideGamutTool({ tool }: { tool: ToolDef }) {
  const [support, setSupport] = useState<Support | null>(null);

  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only read of browser capabilities
    setSupport({
      css: typeof CSS !== "undefined" && CSS.supports("color", "color(display-p3 1 0 0)"),
      gamut: mq("(color-gamut: rec2020)") ? "rec2020" : mq("(color-gamut: p3)") ? "p3" : mq("(color-gamut: srgb)") ? "srgb" : "unknown",
    });
  }, []);

  const wide = support ? support.gamut === "p3" || support.gamut === "rec2020" : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip ok={support ? support.css : null}>
          {support ? (support.css ? "Browser supports P3 colors" : "Browser can't draw P3 colors") : "Checking browser…"}
        </Chip>
        <Chip ok={wide}>
          {!support
            ? "Checking screen…"
            : support.gamut === "rec2020"
              ? "Screen reports Rec. 2020 (wide)"
              : support.gamut === "p3"
                ? "Screen reports Display P3 (wide)"
                : support.gamut === "srgb"
                  ? "Screen reports sRGB only"
                  : "Screen gamut not reported"}
        </Chip>
      </div>
      <FullscreenStage
        tool={tool}
        frameCount={FRAMES.length}
        frameLabel={(i) => `${FRAMES[i].name} — can you see the logo?`}
        renderFrame={(i) => {
          const f = FRAMES[i];
          return (
            <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: f.srgb }}>
              <svg viewBox="0 0 100 100" className="h-[45%] max-h-[60vmin] w-auto" aria-hidden>
                <circle cx="50" cy="50" r="46" style={{ fill: f.p3 }} />
                <rect x="30" y="30" width="40" height="40" rx="6" style={{ fill: f.srgb }} />
              </svg>
            </div>
          );
        }}
      />
    </div>
  );
}
