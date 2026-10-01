"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

// public/hdr/pq-brightness-steps.avif is a real HDR image (BT.2020, PQ, 10-bit), built by
// scripts/generate-hdr-test-image.mjs: six grey patches at fixed brightness and a
// 0–2,000 nit ramp. Label positions mirror that script's layout (1800×600 image, patches
// 280px wide every 300px from x=10, labels in the gap at y≈415, ramp at y 450–560).
const PATCHES = [
  { nits: "100", note: "" },
  { nits: "203", note: "SDR white" },
  { nits: "400", note: "" },
  { nits: "600", note: "" },
  { nits: "1,000", note: "" },
  { nits: "1,600", note: "" },
];
const patchCenter = (i: number) => ((150 + i * 300) / 1800) * 100;

interface Caps {
  hdr: boolean;
  hdrVideo: boolean;
  wide: boolean;
}

function Chip({ ok, children }: { ok: boolean | null; children: React.ReactNode }) {
  const tone =
    ok === null
      ? "border-border text-foreground/60"
      : ok
        ? "border-green-500/40 text-green-300"
        : "border-amber-500/40 text-amber-300";
  return <span className={`rounded-full border px-3 py-1 text-sm ${tone}`}>{children}</span>;
}

export default function HdrTool({ tool }: { tool: ToolDef }) {
  const [caps, setCaps] = useState<Caps | null>(null);

  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q).matches;
    const read = () =>
      setCaps({
        hdr: mq("(dynamic-range: high)"),
        hdrVideo: mq("(video-dynamic-range: high)"),
        wide: mq("(color-gamut: p3)"),
      });
    // One-shot client-only read: display capabilities don't exist during the static render.
    read();
    // Re-check when HDR is switched on/off or the window moves to another screen.
    const m = window.matchMedia("(dynamic-range: high)");
    m.addEventListener("change", read);
    return () => m.removeEventListener("change", read);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip ok={caps ? caps.hdr : null}>
          {caps ? (caps.hdr ? "Browser reports an HDR display" : "Browser reports no HDR (SDR mode)") : "Checking…"}
        </Chip>
        <Chip ok={caps ? caps.hdrVideo : null}>
          {caps ? (caps.hdrVideo ? "HDR video supported" : "No HDR video") : "Checking…"}
        </Chip>
        <Chip ok={caps ? caps.wide : null}>
          {caps ? (caps.wide ? "Wide color gamut" : "Standard (sRGB) gamut") : "Checking…"}
        </Chip>
      </div>
      <FullscreenStage
        tool={tool}
        frameCount={1}
        startLabel="Start HDR test"
        renderFrame={() => (
          <div className="flex h-full w-full items-center justify-center bg-black p-[2%]">
            <div className="relative aspect-[3/1] w-full max-w-full">
              <Image
                src="/hdr/pq-brightness-steps.avif"
                alt="HDR test image: grey patches at 100, 203, 400, 600, 1,000 and 1,600 nits above a 0 to 2,000 nit ramp"
                fill
                sizes="100vw"
                loading="eager" // the test *is* this 1.8 KB image; don't wait for it to scroll into view
                className="object-contain"
              />
              {PATCHES.map((p, i) => (
                <span
                  key={p.nits}
                  className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[clamp(9px,1.4vw,15px)] font-medium text-white/80"
                  style={{ left: `${patchCenter(i)}%`, top: "69.2%" }}
                >
                  {p.nits} nits{p.note && <span className="block text-white/50">{p.note}</span>}
                </span>
              ))}
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(9px,1.3vw,14px)] text-white/60"
                style={{ top: "94.5%" }}
              >
                0 → 2,000 nit ramp
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
