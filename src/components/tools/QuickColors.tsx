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
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:gap-7">
      <div className="flex-none md:w-60">
        <h2 className="text-[15px] font-semibold">Quick full-screen colors</h2>
        <p className="text-[13px] text-foreground/55">
          Tap a color to fill your screen. ← / → to switch, Esc to exit.
        </p>
        <Link href="/color-test" className="mt-1 inline-block text-[13px] text-accent-soft hover:underline">
          Open color test →
        </Link>
      </div>

      <div className="grid flex-1 grid-cols-9 gap-1.5 sm:gap-2">
        {SOLID_COLORS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => ref.current?.start(i)}
            aria-label={`Show ${c.name} full screen`}
            title={c.name}
            className="h-11 rounded-md border border-border-strong transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-soft"
            style={{ backgroundColor: c.css }}
          />
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
