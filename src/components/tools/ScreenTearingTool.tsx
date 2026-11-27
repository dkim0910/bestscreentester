"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshRate } from "./useRefreshRate";
import { useT } from "@/i18n/ui";

// frame 0: vertical bars scrolling horizontally -> reveals horizontal tears.
// frame 1: horizontal bars scrolling vertically -> reveals vertical tears.
// frames 2–3: VRR flicker, dark grays shown at a frame rate that keeps changing.
const LABELS = ["Vertical bars (→)", "Horizontal bars (↓)", "VRR flicker: swings", "VRR flicker: random"];
const BAR_FRAMES = 2;

function useTearing(speedRef: React.RefObject<number>) {
  // Distance is accumulated frame by frame. Computing it as t × speed made every slider
  // move jump the bars to an unrelated offset (a large t times a small speed change).
  const travelRef = useRef(0);
  const lastRef = useRef(0);
  return ({ ctx, width, height, t, frame }: DrawArgs) => {
    const bar = 80;
    const dt = lastRef.current ? Math.max(0, Math.min(0.05, t - lastRef.current)) : 0;
    lastRef.current = t;
    travelRef.current = (travelRef.current + dt * 1400 * speedRef.current) % (bar * 2);
    const travel = travelRef.current;
    if (frame === 1) {
      const offset = (travel % (bar * 2)) - bar * 2;
      for (let y = offset; y < height + bar * 2; y += bar * 2) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, y, width, bar);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, y + bar, width, bar);
      }
      return;
    }
    const offset = (travel % (bar * 2)) - bar * 2;
    for (let x = offset; x < width + bar * 2; x += bar * 2) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, 0, bar, height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(x + bar, 0, bar, height);
    }
  };
}

// 5%, 10%, 15% and 20% gray: VRR flicker shows as a brightness shimmer in dark grays,
// most of all on OLED and VA panels, whose brightness at a given gray shifts slightly
// with the refresh rate.
const VRR_GRAYS = [13, 26, 38, 51];

/**
 * VRR flicker. With variable refresh rate the screen refreshes when a new frame
 * arrives, so a frame rate that keeps changing makes the refresh rate change with it.
 * The pattern holds each frame for a varying number of refreshes by simply not drawing
 * in between: with nothing new to show, the browser sends no new frame.
 *  - swings: half a second at full rate, half a second at a third of it, and so on;
 *  - random: every frame held for 1 to 4 refreshes.
 */
function useVrr(hzRef: React.RefObject<number>) {
  const s = useRef({ count: 0, next: 0, w: 0, h: 0, frame: -1, pos: 0 });
  return ({ ctx, width, height, t, frame, tr }: DrawArgs) => {
    const st = s.current;
    st.count++;
    // A resize or a new frame clears the canvas, so it must be drawn again whatever the
    // schedule says.
    const fresh = width !== st.w || height !== st.h || frame !== st.frame;
    if (!fresh && st.count < st.next) return;
    const hold = frame === 2 ? (Math.floor(t / 0.5) % 2 === 0 ? 1 : 3) : 1 + Math.floor(Math.random() * 4);
    st.next = st.count + hold;
    st.w = width;
    st.h = height;
    st.frame = frame;

    const bandH = height / VRR_GRAYS.length;
    VRR_GRAYS.forEach((v, i) => {
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, i * bandH, width, bandH + 1);
    });
    // A small marker, moved by the refreshes it was held for so its speed stays even
    // and only its smoothness changes.
    const size = Math.max(12, Math.min(width, height) * 0.03);
    st.pos = (st.pos + hold * Math.max(2, width / 240)) % (width + size);
    ctx.fillStyle = "#6b6b6b";
    ctx.fillRect(st.pos - size, height / 2 - size / 2, size, size);
    const hz = hzRef.current || 60;
    ctx.font = `600 ${Math.max(12, size * 0.6)}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#8a8a8a";
    ctx.fillText(tr("{n} fps", { n: Math.round(hz / hold) }), 16, 14);
  };
}

export default function ScreenTearingTool({ tool }: { tool: ToolDef }) {
  const t = useT();
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  const hz = useRefreshRate();
  const hzRef = useRef(60);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    if (hz) hzRef.current = hz;
  }, [hz]);

  const tearing = useTearing(speedRef);
  const vrr = useVrr(hzRef);

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      frameLabel={(i) => t(LABELS[i])}
      controls={(api) =>
        api.index < BAR_FRAMES ? (
          <label className="flex items-center gap-1.5">
            {t("Speed")}
            <input
              type="range"
              min={0}
              max={3}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ accentColor: "var(--accent)" }}
              className="w-24"
              aria-label={t("Scroll speed")}
            />
          </label>
        ) : null
      }
      renderFrame={(i) => <PatternCanvas frame={i} draw={i < BAR_FRAMES ? tearing : vrr} animate />}
    />
  );
}
