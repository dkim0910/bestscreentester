"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Moving dot", "Zone sweep ↔", "Zone sweep ↕"];
const SWEEP_SECONDS = 24; // one slow pass across the screen

export default function BloomingTool({ tool }: { tool: ToolDef }) {
  const draw = ({ ctx, width, height, t, pointer, frame }: DrawArgs) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";

    if (frame === 1 || frame === 2) {
      // Zone counter: a small square creeps across the screen. Each time its halo jumps
      // to a new block, it has crossed into the next local-dimming zone — count the
      // jumps across and down to estimate the zone grid.
      const s = Math.max(10, Math.min(width, height) * 0.025);
      const f = ((t / SWEEP_SECONDS) % 1) * 2;
      const p = f < 1 ? f : 2 - f; // back and forth
      const x = frame === 1 ? p * (width - s) : (width - s) / 2;
      const y = frame === 2 ? p * (height - s) : (height - s) / 2;
      ctx.fillRect(x, y, s, s);
      return;
    }

    // Default to a slow auto-orbit until the user moves the pointer.
    const cx = pointer?.x ?? width / 2 + Math.cos(t) * width * 0.25;
    const cy = pointer?.y ?? height / 2 + Math.sin(t * 0.8) * height * 0.25;
    const r = Math.max(18, Math.min(width, height) * 0.03);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => <PatternCanvas frame={i} draw={draw} animate trackPointer={i === 0} />}
    />
  );
}
