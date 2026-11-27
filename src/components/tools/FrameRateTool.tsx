"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshRate } from "./useRefreshRate";
import { useT } from "@/i18n/ui";

// Frame Rate Comparison: the same pixel-art car crossing three lanes at the same speed,
// redrawn every refresh, every second refresh and every fourth. Side by side, the lanes
// show what a higher frame rate buys: smoother steps and less blur when you follow the
// car with your eyes. On a light background it doubles as a ghosting check with detail
// (windows, door seam, wheels) that a plain box doesn't have.

const SPEEDS = [480, 960, 1920]; // CSS px per second
const LANES = [1, 2, 4]; // redraw every Nth refresh
const BACKGROUNDS = [
  { label: "Dark", css: "#15171c", line: "#2a2e38", text: "rgba(255,255,255,0.7)" },
  { label: "Gray", css: "#5f6470", line: "#737885", text: "rgba(255,255,255,0.85)" },
  { label: "Light", css: "#c9cdd5", line: "#b2b7c1", text: "rgba(0,0,0,0.7)" },
];

const PALETTE: Record<string, string> = {
  K: "#14161c", // outline, tyres
  R: "#e63946", // body
  r: "#a4161a", // body shadow, door handles
  W: "#ffffff", // stripe, glint
  B: "#9bd4ff", // glass
  b: "#4a90c2", // glass shadow
  Y: "#ffd23d", // headlight
  O: "#ff8c42", // tail light
  G: "#c3c9d2", // rim
  g: "#5b6270", // hub
};
const BODY = [
  "...........KKKKKKKKKKKK.........",
  "..........KBBBBBBKBBBBBK........",
  ".........KBWBBBBBKBBBBBBK.......",
  "........KBWBBBBBBKBBBBBBBK......",
  ".......KbbbbbbbbbKbbbbbbbbK.....",
  "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
  ".KRRRRRRRRRRRRRRRKRRRRRRRRRRRRK.",
  "KORRRRRRRRRRrrRRKRRRRRRrrRRRRYYK",
  "KRWWWWWWWWWWWWWWWWWWWWWWWWWWWWRK",
  "KRRRRRRRRRRRRRRRKRRRRRRRRRRRRRRK",
  "KrrrrrrrrrrrrrrrKrrrrrrrrrrrrrrK",
  ".KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.",
];
const WHEEL = [".KKKK.", "KKGGKK", "KGggGK", "KGggGK", "KKGGKK", ".KKKK."];
const SPRITE_W = 32;
const SPRITE_H = 15;
const SPRITE: string[] = (() => {
  const grid = Array.from({ length: SPRITE_H }, (_, y) =>
    Array.from({ length: SPRITE_W }, (_, x) => BODY[y]?.[x] ?? "."),
  );
  for (const left of [5, 21]) {
    WHEEL.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (c !== ".") grid[9 + y][left + x] = c;
      }),
    );
  }
  return grid.map((row) => row.join(""));
})();

/** The sprite at `scale` device pixels per art pixel, drawn once and then blitted. */
function spriteCanvas(scale: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = SPRITE_W * scale;
  c.height = SPRITE_H * scale;
  const ctx = c.getContext("2d")!;
  SPRITE.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = PALETTE[ch];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }),
  );
  return c;
}

function useLanes(hzRef: React.RefObject<number | null>, bgRef: React.RefObject<number>) {
  const state = useRef({
    travel: 0, // device px moved so far at the full frame rate
    count: 0, // refreshes drawn
    shown: LANES.map(() => 0), // what each lane last drew
    sprite: null as HTMLCanvasElement | null,
    scale: 0,
  });

  // Drawn in device pixels, at whole-pixel positions with no smoothing: any blur you
  // see is the display's (and your eyes'), not the canvas's.
  return ({ ctx, frame, tr }: DrawArgs) => {
    const s = state.current;
    const k = ctx.getTransform().a || 1; // device px per CSS px
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const hz = hzRef.current;
    const bg = BACKGROUNDS[bgRef.current] ?? BACKGROUNDS[0];

    // Advance by one refresh's worth of travel. Counting refreshes rather than reading
    // the clock keeps every step the same size, as a game at a locked frame rate would.
    s.travel += ((SPEEDS[frame] ?? SPEEDS[1]) * k) / (hz || 60);
    s.count++;
    LANES.forEach((every, i) => {
      if (s.count % every === 0) s.shown[i] = s.travel;
    });

    const laneH = H / LANES.length;
    const scale = Math.max(2, Math.min(Math.round(8 * k), Math.floor((laneH * 0.5) / SPRITE_H)));
    if (scale !== s.scale || !s.sprite) {
      s.sprite = spriteCanvas(scale);
      s.scale = scale;
    }
    const sw = SPRITE_W * scale;
    const sh = SPRITE_H * scale;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = bg.css;
    ctx.fillRect(0, 0, W, H);
    const fs = Math.round(Math.max(13, Math.min(22, laneH / k / 9)) * k);
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    LANES.forEach((every, i) => {
      const y0 = Math.round(i * laneH);
      if (i > 0) {
        ctx.fillStyle = bg.line;
        ctx.fillRect(0, y0, W, Math.max(1, Math.round(k)));
      }
      const x = Math.round(s.shown[i] % (W + sw)) - sw;
      ctx.drawImage(s.sprite!, x, Math.round(y0 + (laneH - sh) / 2));
      ctx.fillStyle = bg.text;
      ctx.fillText(hz ? tr("{n} fps", { n: Math.round(hz / every) }) : tr("Measuring…"), Math.round(16 * k), y0 + Math.round(12 * k));
    });
    ctx.restore();
  };
}

export default function FrameRateTool({ tool }: { tool: ToolDef }) {
  const t = useT();
  const hz = useRefreshRate();
  const hzRef = useRef<number | null>(null);
  const [bg, setBg] = useState(0);
  const bgRef = useRef(0);
  useEffect(() => {
    hzRef.current = hz;
  }, [hz]);
  useEffect(() => {
    bgRef.current = bg;
  }, [bg]);

  const draw = useLanes(hzRef, bgRef);

  return (
    <FullscreenStage
      tool={tool}
      frameCount={SPEEDS.length}
      frameLabel={(i) => t("{n} px/s", { n: SPEEDS[i] })}
      controls={() => (
        <span className="flex items-center gap-1">
          {BACKGROUNDS.map((b, i) => (
            <button
              key={b.label}
              onClick={() => setBg(i)}
              aria-pressed={i === bg}
              className={`rounded-full px-3 py-1 ${i === bg ? "bg-white text-black" : "hover:bg-white/15"}`}
            >
              {t(b.label)}
            </button>
          ))}
        </span>
      )}
      renderFrame={(i) => <PatternCanvas frame={i} draw={draw} animate nativeResolution />}
    />
  );
}
