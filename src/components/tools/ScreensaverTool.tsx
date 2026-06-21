"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

interface BounceOpts {
  speed: number;
  size: number;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const LABELS = ["Matrix", "Starfield", "Clock", "DVD Logo"];

type MatrixCharset = "jp" | "en";
const EN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?";

function randMatrixChar(charset: MatrixCharset) {
  if (charset === "en") return EN_CHARS[Math.floor(Math.random() * EN_CHARS.length)];
  return String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
}

// --- Matrix rain tuning ---
// FALL_BASE = pixels the head drops per frame at speed = 1 (lower = slower/easier to read).
// FADE      = trail fade per frame (lower = longer / fuller trails).
const MATRIX_FALL_BASE = 2.2;
const MATRIX_FADE = 0.06;

interface MatrixOpts {
  charset: MatrixCharset;
  speed: number;
}

function useMatrix(optsRef: React.RefObject<MatrixOpts>) {
  const cols = useRef<{ y: number; ch: string }[]>([]);
  return ({ ctx, width, height }: DrawArgs) => {
    const { charset, speed } = optsRef.current;
    const fontSize = 18;
    // Column count depends only on width, never on speed — so changing speed
    // can't drop columns (that was the "fewer letters" bug).
    const colCount = Math.floor(width / fontSize);
    if (cols.current.length !== colCount) {
      cols.current = Array.from({ length: colCount }, () => ({
        y: Math.random() * height,
        ch: randMatrixChar(charset),
      }));
    }
    ctx.fillStyle = `rgba(0,0,0,${MATRIX_FADE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const fall = MATRIX_FALL_BASE * speed;
    for (let i = 0; i < colCount; i++) {
      const c = cols.current[i];
      const prevRow = Math.floor(c.y / fontSize);
      // Smooth slow fall; the head drops only a few pixels each frame.
      c.y = c.y > height && Math.random() > 0.975 ? 0 : c.y + fall;
      const row = Math.floor(c.y / fontSize);
      // Pick a fresh glyph only when the head enters a new cell, so the head
      // doesn't flicker in place — the previous cell freezes and fades to a trail.
      if (row !== prevRow) c.ch = randMatrixChar(charset);
      // Bright white head, green body, snapped to the grid so glyphs stay crisp.
      ctx.fillStyle = "#caffd6";
      ctx.fillText(c.ch, i * fontSize, row * fontSize);
      ctx.fillStyle = "#22ff66";
      ctx.fillText(c.ch, i * fontSize, (row - 1) * fontSize);
    }
  };
}

function useStarfield() {
  const stars = useRef<{ x: number; y: number; z: number }[]>([]);
  return ({ ctx, width, height }: DrawArgs) => {
    if (stars.current.length === 0) {
      stars.current = Array.from({ length: 400 }, () => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
      }));
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    const cx = width / 2;
    const cy = height / 2;
    for (const s of stars.current) {
      s.z -= 0.005;
      if (s.z <= 0) {
        s.x = Math.random() * 2 - 1;
        s.y = Math.random() * 2 - 1;
        s.z = 1;
      }
      const k = 128 / s.z;
      const px = cx + s.x * k;
      const py = cy + s.y * k;
      if (px < 0 || px >= width || py < 0 || py >= height) continue;
      const size = (1 - s.z) * 3;
      ctx.fillRect(px, py, size, size);
    }
  };
}

function useClock(fmtRef: React.RefObject<{ military: boolean }>) {
  return ({ ctx, width, height }: DrawArgs) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const now = new Date();
    const military = fmtRef.current.military;
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !military,
    });
    const date = now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    ctx.fillStyle = "#e8eaed";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const big = Math.min(width / 6, height / 3);
    ctx.font = `300 ${big}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(time, width / 2, height / 2 - big * 0.12);
    ctx.fillStyle = "rgba(232,234,237,0.55)";
    ctx.font = `400 ${big * 0.16}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(date, width / 2, height / 2 + big * 0.42);
  };
}

function useBouncing(optsRef: React.RefObject<BounceOpts>) {
  const state = useRef({ x: 80, y: 80, vx: 150, vy: 120, hue: 0, last: 0 });
  return ({ ctx, width, height, t }: DrawArgs) => {
    const { speed, size } = optsRef.current;
    const s = state.current;
    const dt = s.last ? Math.min(0.05, t - s.last) : 0;
    s.last = t;

    // --- Measure the logo's tight bounds so the collision box equals the art.
    // This is what makes it touch the walls exactly instead of bouncing early.
    const fontPx = Math.round(56 * size);
    ctx.font = `italic 900 ${fontPx}px "Arial Black", Arial, sans-serif`;
    ctx.letterSpacing = `${-fontPx * 0.07}px`;
    const dvdW = ctx.measureText("DVD").width;
    const pillH = Math.round(fontPx * 0.36);
    const gap = Math.round(fontPx * 0.1);
    const w = dvdW;
    const h = fontPx + gap + pillH;

    // --- Move and bounce on the exact box edges.
    s.x += s.vx * dt * speed;
    s.y += s.vy * dt * speed;
    let hit = false;
    if (s.x <= 0) {
      s.x = 0;
      s.vx = Math.abs(s.vx);
      hit = true;
    } else if (s.x + w >= width) {
      s.x = width - w;
      s.vx = -Math.abs(s.vx);
      hit = true;
    }
    if (s.y <= 0) {
      s.y = 0;
      s.vy = Math.abs(s.vy);
      hit = true;
    } else if (s.y + h >= height) {
      s.y = height - h;
      s.vy = -Math.abs(s.vy);
      hit = true;
    }
    if (hit) s.hue = (s.hue + 47) % 360;

    const col = `hsl(${s.hue} 85% 56%)`;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    const cx = s.x + w / 2;

    // Signature ellipse behind the wordmark.
    ctx.save();
    ctx.translate(cx, s.y + fontPx * 0.52);
    ctx.rotate(-0.12);
    ctx.lineWidth = fontPx * 0.07;
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, 0, dvdW * 0.46, fontPx * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // "DVD" wordmark, anchored to the box top-left so collision matches art.
    ctx.fillStyle = col;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `italic 900 ${fontPx}px "Arial Black", Arial, sans-serif`;
    ctx.letterSpacing = `${-fontPx * 0.07}px`;
    ctx.fillText("DVD", cx, s.y);

    // "VIDEO" knocked out of a rounded pill below the wordmark.
    const pillW = dvdW * 0.66;
    const py = s.y + fontPx + gap;
    ctx.fillStyle = col;
    roundRectPath(ctx, cx - pillW / 2, py, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(pillH * 0.62)}px Arial, sans-serif`;
    ctx.letterSpacing = `${pillH * 0.16}px`;
    ctx.fillText("VIDEO", cx + pillH * 0.08, py + pillH / 2);
    ctx.letterSpacing = "0px"; // reset so other effects aren't affected
  };
}

export default function ScreensaverTool({ tool }: { tool: ToolDef }) {
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1.4);
  const [charset, setCharset] = useState<MatrixCharset>("jp");
  const [matrixSpeed, setMatrixSpeed] = useState(1);
  const [military, setMilitary] = useState(false);
  const optsRef = useRef<BounceOpts>({ speed: 1, size: 1.4 });
  const matrixRef = useRef<MatrixOpts>({ charset: "jp", speed: 1 });
  const clockRef = useRef<{ military: boolean }>({ military: false });
  // Keep the draw loop's options in sync without reading state during render.
  useEffect(() => {
    optsRef.current = { speed, size };
  }, [speed, size]);
  useEffect(() => {
    matrixRef.current = { charset, speed: matrixSpeed };
  }, [charset, matrixSpeed]);
  useEffect(() => {
    clockRef.current = { military };
  }, [military]);

  const matrix = useMatrix(matrixRef);
  const starfield = useStarfield();
  const clock = useClock(clockRef);
  const bouncing = useBouncing(optsRef);

  const drawers = [matrix, starfield, clock, bouncing];

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      keepAwake={false}
      startLabel="Start screensaver"
      frameLabel={(i) => LABELS[i]}
      controls={(api) => {
        if (api.index === 0) {
          return (
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                {(["jp", "en"] as const).map((cs) => (
                  <button
                    key={cs}
                    onClick={() => setCharset(cs)}
                    className={`rounded-full px-3 py-1 ${
                      charset === cs ? "bg-white text-black" : "hover:bg-white/15"
                    }`}
                  >
                    {cs === "jp" ? "Japanese" : "English"}
                  </button>
                ))}
              </span>
              <label className="flex items-center gap-1.5">
                Speed
                <input
                  type="range"
                  min={0.25}
                  max={2.5}
                  step={0.25}
                  value={matrixSpeed}
                  onChange={(e) => setMatrixSpeed(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="Matrix fall speed"
                />
              </label>
            </span>
          );
        }
        if (api.index === 2) {
          return (
            <span className="flex items-center gap-1">
              {([false, true] as const).map((mil) => (
                <button
                  key={String(mil)}
                  onClick={() => setMilitary(mil)}
                  className={`rounded-full px-3 py-1 ${
                    military === mil ? "bg-white text-black" : "hover:bg-white/15"
                  }`}
                >
                  {mil ? "24-hour" : "12-hour"}
                </button>
              ))}
            </span>
          );
        }
        if (api.index === 3) {
          return (
            <span className="flex items-center gap-3">
              <label className="flex items-center gap-1.5">
                Speed
                <input
                  type="range"
                  min={0.25}
                  max={3}
                  step={0.25}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="DVD logo speed"
                />
              </label>
              <label className="flex items-center gap-1.5">
                Size
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="DVD logo size"
                />
              </label>
            </span>
          );
        }
        return null;
      }}
      renderFrame={(i) => <PatternCanvas frame={i} draw={drawers[i]} animate />}
    />
  );
}
