"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

// frame 0: vertical bars scrolling horizontally -> reveals horizontal tears.
// frame 1: horizontal bars scrolling vertically -> reveals vertical tears.
const LABELS = ["Vertical bars (→)", "Horizontal bars (↓)"];

function useTearing(speedRef: React.RefObject<number>) {
  return ({ ctx, width, height, t, frame }: DrawArgs) => {
    const bar = 80;
    const travel = t * 1400 * speedRef.current;
    if (frame === 1) {
      const offset = (travel % (bar * 2)) - bar * 2;
      for (let y = offset; y < height + bar * 2; y += bar * 2) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, y, width, bar);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, y + bar, width, bar);
      }
      return;
    }
    const offset = (travel % (bar * 2)) - bar * 2;
    for (let x = offset; x < width + bar * 2; x += bar * 2) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, 0, bar, height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(x + bar, 0, bar, height);
    }
  };
}

export default function ScreenTearingTool({ tool }: { tool: ToolDef }) {
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const draw = useTearing(speedRef);

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      frameLabel={(i) => LABELS[i]}
      controls={() => (
        <label className="flex items-center gap-1.5">
          Speed
          <input
            type="range"
            min={0}
            max={3}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ accentColor: "var(--accent)" }}
            className="w-24"
            aria-label="Scroll speed"
          />
        </label>
      )}
      renderFrame={(i) => <PatternCanvas frame={i} draw={draw} animate />}
    />
  );
}
