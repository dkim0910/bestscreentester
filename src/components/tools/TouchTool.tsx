"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";
import { useT } from "@/i18n/ui";

const LABELS = ["Touch grid", "Free draw", "Multi-touch"];
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
  const t = useT();
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
            ? t("All {total} cells responded ✓", { total })
            : t("{done} / {total} cells · {now} touching (max {max})", {
                done,
                total,
                now: pointers.now,
                max: pointers.max,
              })
        }
      />
    </div>
  );
}

// ---------- Frame 1: free drawing, one colour per finger ----------

function FreeDraw() {
  const t = useT();
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
      <Status text={t("{now} touching (max {max})", { now: pointers.now, max: pointers.max })} />
    </div>
  );
}

// ---------- Frame 2: every finger as a numbered marker with its coordinates ----------

interface Touch {
  n: number; // order it landed in, 1-based, reused once a finger lifts
  x: number;
  y: number;
}

function MultiTouch() {
  const t = useT();
  const [touches, setTouches] = useState<Map<number, Touch>>(() => new Map());
  const pointers = usePointerCount();

  const pos = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) };
  };

  return (
    <div
      className="relative h-full w-full touch-none overflow-hidden bg-black"
      onPointerDown={(e) => {
        pointers.down(e.pointerId);
        const p = pos(e);
        setTouches((prev) => {
          const used = new Set([...prev.values()].map((v) => v.n));
          let n = 1;
          while (used.has(n)) n++;
          return new Map(prev).set(e.pointerId, { n, ...p });
        });
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !(e.buttons & 1)) return;
        const p = pos(e);
        setTouches((prev) => {
          const cur = prev.get(e.pointerId);
          return cur ? new Map(prev).set(e.pointerId, { ...cur, ...p }) : prev;
        });
      }}
      onPointerUp={(e) => {
        pointers.up(e.pointerId);
        setTouches((prev) => {
          const next = new Map(prev);
          next.delete(e.pointerId);
          return next;
        });
      }}
      onPointerCancel={(e) => {
        pointers.up(e.pointerId);
        setTouches((prev) => {
          const next = new Map(prev);
          next.delete(e.pointerId);
          return next;
        });
      }}
    >
      {touches.size === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-lg text-white/50">
          {t("Put up to ten fingers on the screen")}
        </p>
      )}
      {[...touches.values()].map((p) => {
        const color = TRAIL_COLORS[(p.n - 1) % TRAIL_COLORS.length];
        return (
          <div key={p.n} className="pointer-events-none">
            {/* Crosshair lines show how far each touch is from the edges. */}
            <div className="absolute inset-x-0 h-px opacity-50" style={{ top: p.y, backgroundColor: color }} />
            <div className="absolute inset-y-0 w-px opacity-50" style={{ left: p.x, backgroundColor: color }} />
            <div
              className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 text-xl font-bold text-white"
              style={{ left: p.x, top: p.y, borderColor: color, backgroundColor: `${color}33` }}
            >
              {p.n}
            </div>
            <div
              className="absolute -translate-x-1/2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white"
              style={{ left: p.x, top: Math.max(0, p.y - 64) }}
            >
              {p.x}, {p.y}
            </div>
          </div>
        );
      })}
      <Status text={t("{now} touching (max {max})", { now: pointers.now, max: pointers.max })} />
    </div>
  );
}

export default function TouchTool({ tool }: { tool: ToolDef }) {
  // Bumping the key remounts the frames, which clears them.
  const [round, setRound] = useState(0);
  const t = useT();
  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      frameLabel={(i) => t(LABELS[i])}
      tapNavigation={false}
      startLabel={t("Start touch test")}
      controls={() => (
        <button onClick={() => setRound((r) => r + 1)} className="rounded-full px-3 py-1 hover:bg-white/15">
          {t("Reset")}
        </button>
      )}
      renderFrame={(i) =>
        i === 0 ? (
          <TouchGrid key={`g${round}`} />
        ) : i === 1 ? (
          <FreeDraw key={`d${round}`} />
        ) : (
          <MultiTouch key={`m${round}`} />
        )
      }
    />
  );
}
