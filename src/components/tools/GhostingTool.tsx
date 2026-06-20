"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const SPEEDS = [
  { label: "Slow", px: 240 },
  { label: "Medium", px: 480 },
  { label: "Fast", px: 960 },
];

const ROWS = [
  { bg: "#7a7a7a", box: "#ffffff" },
  { bg: "#202020", box: "#00e0ff" },
  { bg: "#101030", box: "#ff3030" },
];

export default function GhostingTool({ tool }: { tool: ToolDef }) {
  // Speed is selected by the stage's frame index, so the ← / → arrows
  // (keyboard, tap zones, and overlay buttons) all change speed.
  const draw = ({ ctx, width, height, t, frame }: DrawArgs) => {
    const speed = SPEEDS[frame]?.px ?? SPEEDS[0].px; // px per second
    const rowH = height / ROWS.length;
    const size = Math.max(40, rowH * 0.45);
    ROWS.forEach((row, r) => {
      const y = r * rowH;
      ctx.fillStyle = row.bg;
      ctx.fillRect(0, y, width, rowH);
      const span = width + size;
      const x = ((t * speed) % span) - size;
      ctx.fillStyle = row.box;
      ctx.fillRect(x, y + rowH / 2 - size / 2, size, size);
    });
  };

  return (
    <FullscreenStage
      tool={tool}
      frameCount={SPEEDS.length}
      frameLabel={(i) => `${SPEEDS[i]?.label ?? ""} speed`}
      renderFrame={(i) => <PatternCanvas frame={i} draw={draw} animate />}
      controls={(api) => (
        <span className="flex items-center gap-1">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => api.setIndex(i)}
              className={`rounded-full px-3 py-1 ${
                i === api.index ? "bg-white text-black" : "hover:bg-white/15"
              }`}
            >
              {s.label}
            </button>
          ))}
        </span>
      )}
    />
  );
}
