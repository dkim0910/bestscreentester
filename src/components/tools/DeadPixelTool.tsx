"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import { SOLID_COLORS } from "./ColorCycler";
import type { ToolDef } from "@/lib/tools";

const FIXER_LABEL = "Stuck-pixel fixer";
const FIXER_COLORS = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"];
// Kept small on purpose: a flashing area under ~25% of a 10° visual field (≈ 21,800
// CSS px², WCAG 2.3.1) stays below the general photosensitive-seizure threshold. A
// full-screen flash would not, and only the stuck pixel needs exercising anyway.
const BOX = 120;
const DRAG_SLOP = 4; // px of travel before a press counts as a drag, not a tap

/**
 * A box that cycles R/G/B/white/black every frame, dragged over a stuck pixel to try
 * to "exercise" it back to life. Starts paused: flashing begins only on an explicit
 * tap, after the photosensitivity warning has been on screen.
 */
function PixelFixer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; from: { x: number; y: number } } | null>(
    null,
  );
  const dragged = useRef(false);
  // Box centre as a fraction of the stage, so it stays put across resizes.
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [flashing, setFlashing] = useState(false);

  // Repaint the box imperatively on every animation frame — far cheaper than a React
  // render per frame, and it locks the cycle to the display's refresh rate.
  useEffect(() => {
    const el = boxRef.current;
    if (!flashing || !el) return;
    let raf = 0;
    let i = 0;
    const tick = () => {
      el.style.backgroundColor = FIXER_COLORS[i++ % FIXER_COLORS.length];
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.backgroundColor = "";
    };
  }, [flashing]);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, from: pos };
    dragged.current = false;
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!d || d.id !== e.pointerId || !rect || !rect.width || !rect.height) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!dragged.current && Math.hypot(dx, dy) < DRAG_SLOP) return;
    dragged.current = true;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    setPos({ x: clamp(d.from.x + dx / rect.width), y: clamp(d.from.y + dy / rect.height) });
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <div ref={rootRef} className="relative h-full w-full bg-black">
      <p className="pointer-events-none absolute inset-x-0 top-[6%] mx-auto max-w-md px-4 text-center text-sm text-white/70">
        {flashing ? (
          "Leave it over the pixel for 10–30 minutes. Tap the box to stop."
        ) : (
          <>
            <span className="font-semibold text-[#ffd23d]">⚠ Flashes rapidly</span> — not for
            anyone sensitive to flashing light. Drag the box over the stuck pixel, then tap it
            to start.
          </>
        )}
      </p>
      <button
        ref={boxRef}
        type="button"
        aria-label={flashing ? "Stop flashing" : "Start flashing"}
        aria-pressed={flashing}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => {
          // Never let a press on the box reach the stage's tap zones.
          e.stopPropagation();
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          setFlashing((f) => !f);
        }}
        className="absolute cursor-grab touch-none border border-white/40 bg-[#808080] active:cursor-grabbing"
        style={{
          width: BOX,
          height: BOX,
          left: `calc(${pos.x * 100}% - ${BOX / 2}px)`,
          top: `calc(${pos.y * 100}% - ${BOX / 2}px)`,
        }}
      />
    </div>
  );
}

export default function DeadPixelTool({ tool }: { tool: ToolDef }) {
  const frameCount = SOLID_COLORS.length + 1;
  return (
    <FullscreenStage
      tool={tool}
      frameCount={frameCount}
      frameLabel={(i) => SOLID_COLORS[i]?.name ?? FIXER_LABEL}
      renderFrame={(i, active) =>
        i < SOLID_COLORS.length ? (
          <div className="h-full w-full" style={{ backgroundColor: SOLID_COLORS[i].css }} />
        ) : (
          // Remount on enter/exit so the fixer is always paused when it first appears —
          // flashing never resumes on its own, and never runs in the inline preview.
          <PixelFixer key={active ? "active" : "preview"} />
        )
      }
    />
  );
}
