"use client";

import { useRef } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Matrix", "Starfield", "Clock", "Bouncing Logo"];

function useMatrix() {
  const cols = useRef<number[]>([]);
  return ({ ctx, width, height }: DrawArgs) => {
    const fontSize = 16;
    const colCount = Math.floor(width / fontSize);
    if (cols.current.length !== colCount) {
      cols.current = new Array(colCount).fill(0).map(() => Math.random() * height);
    }
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#22ff66";
    ctx.font = `${fontSize}px monospace`;
    cols.current.forEach((y, i) => {
      const ch = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
      ctx.fillText(ch, i * fontSize, y);
      cols.current[i] = y > height && Math.random() > 0.975 ? 0 : y + fontSize;
    });
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

function drawClock({ ctx, width, height }: DrawArgs) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  ctx.fillStyle = "#e8eaed";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.min(width / 6, height / 3)}px sans-serif`;
  ctx.fillText(time, width / 2, height / 2);
}

function useBouncing() {
  const state = useRef({ x: 80, y: 80, vx: 140, vy: 110, hue: 0, last: 0 });
  return ({ ctx, width, height, t }: DrawArgs) => {
    const s = state.current;
    const dt = s.last ? Math.min(0.05, t - s.last) : 0;
    s.last = t;
    const w = 220;
    const h = 90;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.x <= 0 || s.x + w >= width) {
      s.vx *= -1;
      s.hue = (s.hue + 47) % 360;
      s.x = Math.max(0, Math.min(s.x, width - w));
    }
    if (s.y <= 0 || s.y + h >= height) {
      s.vy *= -1;
      s.hue = (s.hue + 47) % 360;
      s.y = Math.max(0, Math.min(s.y, height - h));
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = `hsl(${s.hue} 90% 55%)`;
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BST", s.x + w / 2, s.y + h / 2);
    ctx.strokeStyle = `hsl(${s.hue} 90% 55%)`;
    ctx.lineWidth = 3;
    ctx.strokeRect(s.x, s.y, w, h);
  };
}

export default function ScreensaverTool({ tool }: { tool: ToolDef }) {
  const matrix = useMatrix();
  const starfield = useStarfield();
  const bouncing = useBouncing();

  const drawers = [matrix, starfield, drawClock, bouncing];

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      keepAwake={false}
      startLabel="Start screensaver"
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => <PatternCanvas frame={i} draw={drawers[i]} animate />}
    />
  );
}
