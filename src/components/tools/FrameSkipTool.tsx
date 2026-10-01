"use client";

import { useRef } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshRate } from "./useRefreshRate";

// Two grid sizes: one cycle every 60 frames suits 60–144Hz; 120 cells suits faster
// panels, so a 1/15 s exposure doesn't wrap around the grid.
const GRIDS = [
  { label: "60 cells", cols: 10, rows: 6 },
  { label: "120 cells", cols: 15, rows: 8 },
];

/**
 * One cell lights per rendered frame, in order. Photographed with an exposure covering
 * several frames, a healthy screen shows an unbroken run of lit cells; a skipped frame
 * leaves an unlit gap in the run.
 */
function useFrameSkip() {
  const count = useRef(0);
  return ({ ctx, width, height, frame }: DrawArgs) => {
    const g = GRIDS[frame] ?? GRIDS[0];
    const n = g.cols * g.rows;
    const lit = count.current++ % n;
    const cw = width / g.cols;
    const ch = height / g.rows;
    const pad = Math.max(2, Math.min(cw, ch) * 0.06);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `600 ${Math.max(10, Math.min(cw, ch) * 0.22)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const x = (i % g.cols) * cw;
      const y = Math.floor(i / g.cols) * ch;
      ctx.fillStyle = i === lit ? "#ffffff" : "#1a1d24";
      ctx.fillRect(x + pad, y + pad, cw - pad * 2, ch - pad * 2);
      ctx.fillStyle = i === lit ? "#000" : "#4b5161";
      ctx.fillText(String(i + 1), x + cw / 2, y + ch / 2);
    }
  };
}

function Readout() {
  const hz = useRefreshRate();
  return (
    <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/70 px-3 py-1.5 text-sm font-medium tabular-nums text-white">
      {hz ? `≈ ${hz} Hz` : "Measuring…"}
    </div>
  );
}

export default function FrameSkipTool({ tool }: { tool: ToolDef }) {
  const draw = useFrameSkip();
  return (
    <FullscreenStage
      tool={tool}
      frameCount={GRIDS.length}
      frameLabel={(i) => GRIDS[i].label}
      renderFrame={(i) => (
        <div className="relative h-full w-full">
          <PatternCanvas frame={i} draw={draw} animate />
          <Readout />
        </div>
      )}
    />
  );
}
