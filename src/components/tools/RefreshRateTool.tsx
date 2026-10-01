"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshReading } from "./useRefreshRate";

/** `detailed` adds frame time and the closest standard rate (full-screen only — the
 *  inline preview is too small for the extra line under the Start button). */
function RefreshReadout({ detailed }: { detailed: boolean }) {
  const reading = useRefreshReading();

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
          {reading ? reading.hz.toFixed(1) : "…"}
          <span className="ml-2 text-3xl font-normal text-white/60">Hz</span>
        </div>
        {detailed && reading && (
          <p className="mt-3 px-4 text-center text-base tabular-nums text-white/80">
            {reading.frameMs.toFixed(2)} ms per frame
            {reading.nearest !== null && ` · closest standard rate ${reading.nearest} Hz`}
          </p>
        )}
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
      renderFrame={(_, active) => <RefreshReadout detailed={active} />}
    />
  );
}
