"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshRate } from "./useRefreshRate";

function RefreshReadout() {
  const hz = useRefreshRate();

  const draw = ({ ctx, width, height, t }: DrawArgs) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);
    const span = width + 80;
    const x = ((t * width * 0.7) % span) - 80;
    ctx.fillStyle = "#d6336c";
    ctx.fillRect(x, height * 0.7, 80, 80);
  };

  return (
    <div className="relative h-full w-full">
      <PatternCanvas draw={draw} animate />
      <div className="pointer-events-none absolute inset-x-0 top-[20%] flex flex-col items-center text-white">
        <div className="text-7xl font-bold tabular-nums sm:text-8xl">
          {hz ?? "…"}
          <span className="ml-2 text-3xl font-normal text-white/60">Hz</span>
        </div>
        <p className="mt-2 text-sm text-white/60">Measured from animation frames</p>
      </div>
    </div>
  );
}

export default function RefreshRateTool({ tool }: { tool: ToolDef }) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={1}
      keepAwake
      renderFrame={() => <RefreshReadout />}
    />
  );
}
