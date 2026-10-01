"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Touch grid", "Free draw"];
const CELL = 44; // CSS px — roughly a fingertip, the standard minimum touch target
const TRAIL_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7", "#14b8a6", "#ef4444", "#eab308", "#06b6d4", "#f97316"];

/** Tracks live pointers on an element: count now, most seen at once. */
function usePointerCount() {
  const live = useRef(new Set<number>());
  const [now, setNow] = useState(0);
  const [max, setMax] = useState(0);
  const down = (id: number) => {
    live.current.add(id);
    setNow(live.current.size);
    setMax((m) => Math.max(m, live.current.size));
  };
  const up = (id: number) => {
    live.current.delete(id);
    setNow(live.current.size);
  };
  return { now, max, down, up };
}

/** Size a canvas to its box at device resolution; returns CSS size via callback. */
function useCanvasSize(onSize: (c: HTMLCanvasElement, w: number, h: number) => void) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onSize);
  useEffect(() => {
    cb.current = onSize;
  });
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      cb.current(c, r.width, r.height);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    fit();
    return () => ro.disconnect();
  }, []);
  return ref;
}

function Status({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/70 px-3 py-1.5 text-sm font-medium text-white">
      {text}
    </div>
  );
}

// ---------- Frame 0: every cell must light up under a finger ----------

function TouchGrid() {
  const grid = useRef({ cols: 0, rows: 0, cellW: 0, cellH: 0, hit: new Uint8Array(0) });
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const pointers = usePointerCount();

  const paint = (c: HTMLCanvasElement, i: number) => {
    const ctx = c.getContext("2d");
    const g = grid.current;
    if (!ctx) return;
    const x = (i % g.cols) * g.cellW;
    const y = Math.floor(i / g.cols) * g.cellH;
    ctx.fillStyle = g.hit[i] ? "#16a34a" : "#0d0f14";
    ctx.fillRect(x + 1, y + 1, g.cellW - 2, g.cellH - 2);
  };

  const canvasRef = useCanvasSize((c, w, h) => {
    const cols = Math.max(4, Math.round(w / CELL));
    const rows = Math.max(4, Math.round(h / CELL));
    grid.current = { cols, rows, cellW: w / cols, cellH: h / rows, hit: new Uint8Array(cols * rows) };
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#2a2e38"; // grid lines show through the 1px gaps
      ctx.fillRect(0, 0, w, h);
    }
    for (let i = 0; i < cols * rows; i++) paint(c, i);
    setDone(0);
    setTotal(cols * rows);
  });

  const mark = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const g = grid.current;
    const col = Math.floor(((e.clientX - r.left) / r.width) * g.cols);
    const row = Math.floor(((e.clientY - r.top) / r.height) * g.rows);
    if (col < 0 || row < 0 || col >= g.cols || row >= g.rows) return;
    const i = row * g.cols + col;
    if (g.hit[i]) return;
    g.hit[i] = 1;
    paint(c, i);
    setDone((d) => d + 1);
  };

  const complete = total > 0 && done === total;
  return (
    <div className="relative h-full w-full bg-black">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        onPointerDown={(e) => {
          pointers.down(e.pointerId);
          mark(e);
        }}
        onPointerMove={(e) => {
          // A mouse only counts while its button is held, like a finger on glass.
          if (e.pointerType === "mouse" && !(e.buttons & 1)) return;
          mark(e);
        }}
        onPointerUp={(e) => pointers.up(e.pointerId)}
        onPointerCancel={(e) => pointers.up(e.pointerId)}
      />
      <Status
        text={
          complete
            ? `All ${total} cells responded ✓`
            : `${done} / ${total} cells · ${pointers.now} touching (max ${pointers.max})`
        }
      />
    </div>
  );
}

// ---------- Frame 1: free drawing, one colour per finger ----------

function FreeDraw() {
  const last = useRef(new Map<number, { x: number; y: number; color: string }>());
  const nextColor = useRef(0);
  const pointers = usePointerCount();
  const canvasRef = useCanvasSize((c, w, h) => {
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  });

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const line = (c: HTMLCanvasElement, a: { x: number; y: number }, b: { x: number; y: number }, color: string) => {
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  return (
    <div className="relative h-full w-full bg-black">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        onPointerDown={(e) => {
          pointers.down(e.pointerId);
          const p = pos(e);
          const color = TRAIL_COLORS[nextColor.current++ % TRAIL_COLORS.length];
          last.current.set(e.pointerId, { ...p, color });
          line(e.currentTarget, p, p, color);
        }}
        onPointerMove={(e) => {
          const prev = last.current.get(e.pointerId);
          if (!prev) return;
          const p = pos(e);
          line(e.currentTarget, prev, p, prev.color);
          last.current.set(e.pointerId, { ...p, color: prev.color });
        }}
        onPointerUp={(e) => {
          last.current.delete(e.pointerId);
          pointers.up(e.pointerId);
        }}
        onPointerCancel={(e) => {
          last.current.delete(e.pointerId);
          pointers.up(e.pointerId);
        }}
      />
      <Status text={`${pointers.now} touching (max ${pointers.max})`} />
    </div>
  );
}

export default function TouchTool({ tool }: { tool: ToolDef }) {
  // Bumping the key remounts the frames, which clears them.
  const [round, setRound] = useState(0);
  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      frameLabel={(i) => LABELS[i]}
      tapNavigation={false}
      startLabel="Start touch test"
      controls={() => (
        <button onClick={() => setRound((r) => r + 1)} className="rounded-full px-3 py-1 hover:bg-white/15">
          Reset
        </button>
      )}
      renderFrame={(i) => (i === 0 ? <TouchGrid key={`g${round}`} /> : <FreeDraw key={`d${round}`} />)}
    />
  );
}
