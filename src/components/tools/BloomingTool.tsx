"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

export default function BloomingTool({ tool }: { tool: ToolDef }) {
  const draw = ({ ctx, width, height, t, pointer }: DrawArgs) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    // Default to a slow auto-orbit until the user moves the pointer.
    const cx = pointer?.x ?? width / 2 + Math.cos(t) * width * 0.25;
    const cy = pointer?.y ?? height / 2 + Math.sin(t * 0.8) * height * 0.25;
    const r = Math.max(18, Math.min(width, height) * 0.03);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <FullscreenStage
      tool={tool}
      frameCount={1}
      renderFrame={() => <PatternCanvas draw={draw} animate trackPointer />}
    />
  );
}
