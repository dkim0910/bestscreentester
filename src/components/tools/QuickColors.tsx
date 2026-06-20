"use client";

import { useRef } from "react";
import Link from "next/link";
import FullscreenStage, { type StageHandle } from "./FullscreenStage";
import { SOLID_COLORS } from "./ColorCycler";
import { TOOL_MAP } from "@/lib/tools";

export default function QuickColors() {
  const ref = useRef<StageHandle>(null);
  const tool = TOOL_MAP["color-test"];

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Quick full-screen colors</h2>
          <p className="text-sm text-foreground/60">
            Tap a color to fill your screen instantly. Use ← / → to switch, Esc to exit.
          </p>
        </div>
        <Link href="/color-test" className="text-sm text-accent hover:underline">
          Open color test →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {SOLID_COLORS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => ref.current?.start(i)}
            aria-label={`Show ${c.name} full screen`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/15 transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ backgroundColor: c.css }}
          >
            <span className="absolute inset-x-0 bottom-0 bg-black/45 px-1 py-0.5 text-center text-[11px] font-medium text-white">
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Hidden stage launched by the swatches above. */}
      <FullscreenStage
        ref={ref}
        hideLauncher
        tool={tool}
        frameCount={SOLID_COLORS.length}
        frameLabel={(i) => SOLID_COLORS[i]?.name ?? ""}
        renderFrame={(i) => (
          <div className="h-full w-full" style={{ backgroundColor: SOLID_COLORS[i]?.css ?? "#000" }} />
        )}
      />
    </section>
  );
}
