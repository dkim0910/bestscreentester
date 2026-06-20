"use client";

import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Cracked", "Glitch", "Blue Screen"];

// Tiny deterministic PRNG so the cracks look identical each render.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawCracks({ ctx, width, height }: DrawArgs) {
  // Desktop-ish background so it reads as a real broken screen.
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#1b2330");
  bg.addColorStop(1, "#0a0d12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const rand = mulberry32(1337);
  const ix = width * (0.4 + rand() * 0.2);
  const iy = height * (0.35 + rand() * 0.2);

  // Impact shatter
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1;
  const spokes = 16;
  const ends: [number, number][] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2 + rand() * 0.3;
    const len = Math.min(width, height) * (0.3 + rand() * 0.6);
    const ex = ix + Math.cos(a) * len;
    const ey = iy + Math.sin(a) * len;
    ends.push([ex, ey]);
    ctx.lineWidth = 0.6 + rand() * 1.8;
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    let px = ix;
    let py = iy;
    const segs = 6;
    for (let s = 1; s <= segs; s++) {
      const nx = ix + (ex - ix) * (s / segs) + (rand() - 0.5) * 18;
      const ny = iy + (ey - iy) * (s / segs) + (rand() - 0.5) * 18;
      ctx.lineTo(nx, ny);
      px = nx;
      py = ny;
    }
    void px;
    void py;
    ctx.stroke();
  }

  // Concentric web rings
  for (let ring = 1; ring <= 4; ring++) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const [ex, ey] = ends[i % spokes];
      const x = ix + (ex - ix) * (ring / 5);
      const y = iy + (ey - iy) * (ring / 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Bright impact core
  const core = ctx.createRadialGradient(ix, iy, 0, ix, iy, 60);
  core.addColorStop(0, "rgba(255,255,255,0.9)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(ix, iy, 60, 0, Math.PI * 2);
  ctx.fill();
}

function drawGlitch({ ctx, width, height, t }: DrawArgs) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const rand = mulberry32(Math.floor(t * 12));
  for (let i = 0; i < 60; i++) {
    const y = rand() * height;
    const h = 4 + rand() * 40;
    const hue = Math.floor(rand() * 360);
    ctx.fillStyle = `hsl(${hue} 100% ${30 + rand() * 50}%)`;
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    ctx.fillRect(0, y, width, h);
  }
  ctx.globalAlpha = 1;
  // RGB split bars
  for (let i = 0; i < 8; i++) {
    const y = rand() * height;
    ctx.fillStyle = ["#ff0040", "#00ff80", "#3040ff"][i % 3];
    ctx.globalAlpha = 0.4;
    ctx.fillRect(rand() * width * 0.3, y, width, 2 + rand() * 6);
  }
  ctx.globalAlpha = 1;
}

function BlueScreen() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 bg-[#0078d7] px-[8%] text-white">
      <div className="text-8xl">:(</div>
      <p className="max-w-2xl text-2xl leading-relaxed">
        Your PC ran into a problem and needs to restart. We&apos;re just collecting some error
        info, and then we&apos;ll restart for you.
      </p>
      <p className="text-2xl">100% complete</p>
      <p className="mt-4 max-w-2xl text-sm text-white/80">
        For more information about this issue and possible fixes, visit a search engine.
        <br />
        Stop code: FAKE_SCREEN_PRANK
      </p>
    </div>
  );
}

export default function FakeScreenTool({ tool }: { tool: ToolDef }) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={3}
      keepAwake
      startLabel="Start prank (full-screen)"
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => {
        if (i === 2) return <BlueScreen />;
        return <PatternCanvas frame={i} draw={i === 1 ? drawGlitch : drawCracks} animate={i === 1} />;
      }}
    />
  );
}
