"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";
import { useRefreshReading } from "./useRefreshRate";
import { useT } from "@/i18n/ui";

const HISTORY = 240; // frame times kept for the graph
const GRAPH_H = 64; // CSS px

/**
 * Frame-time graph and dropped-frame count, from animation-frame timing. A gap of more
 * than 1.5 refresh intervals means the browser missed at least one refresh; the count
 * adds how many. That is the browser failing to keep up (a busy tab, the GPU, a
 * background task), not the monitor skipping frames: the Frame Skipping Test checks that.
 */
function FrameTimes() {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dropped, setDropped] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let last = 0;
    let interval = 0; // median refresh interval, ms
    let drops = 0;
    const times: { ms: number; late: boolean }[] = [];
    const recent: number[] = [];

    function fit() {
      const c = canvas!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const c = canvas!;
      const w = c.width / (ctx!.getTransform().a || 1);
      const h = GRAPH_H;
      ctx!.clearRect(0, 0, w, h);
      if (!interval) return;
      const max = interval * 3; // bars clip at three refreshes
      const bw = w / HISTORY;
      times.forEach((f, i) => {
        const bh = Math.min(1, f.ms / max) * h;
        ctx!.fillStyle = f.late ? "#f43f5e" : "rgba(255,255,255,0.55)";
        ctx!.fillRect(i * bw, h - bh, Math.max(1, bw - 1), bh);
      });
      // Reference line at one refresh interval.
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.fillRect(0, Math.round(h - (interval / max) * h), w, 1);
    }

    function tick(now: number) {
      const d = last ? now - last : 0;
      last = now;
      if (d > 0 && d < 1000) {
        recent.push(d);
        if (recent.length > 120) recent.shift();
        // Re-take the median every 30 frames; it moves only if the refresh rate does.
        if (recent.length >= 30 && (recent.length % 30 === 0 || !interval)) {
          const sorted = [...recent].sort((a, b) => a - b);
          interval = sorted[Math.floor(sorted.length / 2)];
        }
        const late = interval > 0 && d > interval * 1.5;
        if (late) {
          drops += Math.max(1, Math.round(d / interval) - 1);
          setDropped(drops);
        }
        times.push({ ms: d, late });
        if (times.length > HISTORY) times.shift();
        draw();
      }
      raf = requestAnimationFrame(tick);
    }

    // A hidden tab gets no animation frames at all; that pause is not a drop.
    function onVisibility() {
      last = 0;
    }

    const ro = new ResizeObserver(() => {
      fit();
      draw();
    });
    ro.observe(canvas);
    fit();
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="mt-6 w-[min(90vw,44rem)]">
      <div className="flex items-baseline justify-between gap-3 text-sm tabular-nums">
        <span className="text-white/60">{t("Frame times")}</span>
        <span className={dropped ? "font-semibold text-rose-400" : "text-white/80"}>
          {t("Dropped frames: {n}", { n: dropped })}
        </span>
      </div>
      <canvas ref={canvasRef} className="mt-1.5 block w-full rounded bg-white/5" style={{ height: GRAPH_H }} />
      <p className="mt-1.5 text-xs text-white/50">{t("Red bars are refreshes the browser missed.")}</p>
    </div>
  );
}

/** `detailed` adds frame time, the closest standard rate and the frame-drop graph
 *  (full-screen only — the inline preview is too small for them). */
function RefreshReadout({ detailed }: { detailed: boolean }) {
  const reading = useRefreshReading();
  const t = useT();

  const draw = ({ ctx, width, height, t }: DrawArgs) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);
    const span = width + 80;
    const x = ((t * width * 0.7) % span) - 80;
    ctx.fillStyle = "#d6336c";
    ctx.fillRect(x, height * 0.78, 80, 80);
  };

  return (
    <div className="relative h-full w-full">
      <PatternCanvas draw={draw} animate />
      <div className="pointer-events-none absolute inset-x-0 top-[12%] flex flex-col items-center text-white">
        <div className="text-7xl font-bold tabular-nums sm:text-8xl">
          {reading ? reading.hz.toFixed(1) : "…"}
          <span className="ml-2 text-3xl font-normal text-white/60">Hz</span>
        </div>
        {detailed && reading && (
          <p className="mt-3 px-4 text-center text-base tabular-nums text-white/80">
            {t("{ms} ms per frame", { ms: reading.frameMs.toFixed(2) })}
            {reading.nearest !== null && ` · ${t("closest standard rate {hz} Hz", { hz: reading.nearest })}`}
          </p>
        )}
        <p className="mt-2 text-sm text-white/60">{t("Measured from animation frames")}</p>
        {detailed && <FrameTimes />}
      </div>
    </div>
  );
}

export default function RefreshRateTool({ tool }: { tool: ToolDef }) {
  const t = useT();
  // Bumping the key remounts the readout: a fresh measurement and a zeroed drop count.
  const [round, setRound] = useState(0);
  return (
    <FullscreenStage
      tool={tool}
      frameCount={1}
      keepAwake
      controls={() => (
        <button onClick={() => setRound((r) => r + 1)} className="rounded-full px-3 py-1 hover:bg-white/15">
          {t("Reset")}
        </button>
      )}
      renderFrame={(_, active) => <RefreshReadout key={round} detailed={active} />}
    />
  );
}
