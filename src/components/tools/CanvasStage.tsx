"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

interface CanvasStageProps {
  tool: ToolDef;
  labels: string[];
  draw: (args: DrawArgs) => void;
  animate?: boolean;
  trackPointer?: boolean;
  keepAwake?: boolean;
}

/** Wraps a PatternCanvas in the FullscreenStage for static multi-frame patterns. */
export default function CanvasStage({
  tool,
  labels,
  draw,
  animate = false,
  trackPointer = false,
  keepAwake = true,
}: CanvasStageProps) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={labels.length}
      frameLabel={(i) => labels[i] ?? ""}
      keepAwake={keepAwake}
      renderFrame={(i) => (
        <PatternCanvas frame={i} draw={draw} animate={animate} trackPointer={trackPointer} />
      )}
    />
  );
}
