"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

// A browser can't see the backlight flicker, so this provides the right screens for
// the two reliable manual checks:
//  - bright fields for the pencil / finger wave test (multiple crisp copies = PWM) and
//    the phone-camera test (rolling bands = PWM);
//  - a thin line sweeping fast across black: on a PWM screen your eye catches it as a
//    row of separate copies (the "phantom array") instead of one smooth streak.
const FRAMES = [
  { label: "White", css: "#ffffff" },
  { label: "Light grey", css: "#b4b4b4" },
  { label: "Fast moving line", speed: 2.2 }, // screen widths per second
  { label: "Slow moving line", speed: 0.6 },
];

function sweep(speed: number) {
  return ({ ctx, width, height, t }: DrawArgs) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const x = ((t * speed) % 1) * width;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, 0, Math.max(2, width * 0.004), height);
  };
}
const SWEEPS = FRAMES.map((f) => ("speed" in f && f.speed ? sweep(f.speed) : null));

export default function PwmTool({ tool }: { tool: ToolDef }) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={FRAMES.length}
      frameLabel={(i) => FRAMES[i].label}
      renderFrame={(i) => {
        const f = FRAMES[i];
        const draw = SWEEPS[i];
        return draw ? (
          <PatternCanvas frame={i} draw={draw} animate />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: "css" in f ? f.css : "#fff" }} />
        );
      }}
    />
  );
}
