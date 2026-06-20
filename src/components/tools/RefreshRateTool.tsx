"use client";

import { useEffect, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

function RefreshReadout() {
  const [hz, setHz] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const deltas: number[] = [];
    let last = performance.now();

    function tick(now: number) {
      const d = now - last;
      last = now;
      if (d > 0 && d < 100) deltas.push(d);
      if (deltas.length >= 60) {
        const sorted = [...deltas].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const measured = Math.round(1000 / median);
        setHz(measured);
        deltas.length = 0;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const draw = ({ ctx, width, height, t }: DrawArgs) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);
    const span = width + 80;
    const x = ((t * width * 0.7) % span) - 80;
    ctx.fillStyle = "#5b9dff";
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
