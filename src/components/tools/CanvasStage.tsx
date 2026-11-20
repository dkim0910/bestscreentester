"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useT } from "@/i18n/ui";

interface CanvasStageProps {
  tool: ToolDef;
  /** English frame labels; translated where they are shown. */
  labels: string[];
  draw: (args: DrawArgs) => void;
  animate?: boolean;
  trackPointer?: boolean;
  keepAwake?: boolean;
  nativeResolution?: boolean;
}

/** Wraps a PatternCanvas in the FullscreenStage for static multi-frame patterns. */
export default function CanvasStage({
  tool,
  labels,
  draw,
  animate = false,
  trackPointer = false,
  keepAwake = true,
  nativeResolution = false,
}: CanvasStageProps) {
  const t = useT();
  return (
    <FullscreenStage
      tool={tool}
      frameCount={labels.length}
      frameLabel={(i) => t(labels[i] ?? "")}
      keepAwake={keepAwake}
      renderFrame={(i) => (
        <PatternCanvas
          frame={i}
          draw={draw}
          animate={animate}
          trackPointer={trackPointer}
          nativeResolution={nativeResolution}
        />
      )}
    />
  );
}
