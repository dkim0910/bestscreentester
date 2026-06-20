"use client";

import { useEffect, useRef } from "react";

export interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  width: number; // CSS pixels
  height: number; // CSS pixels
  t: number; // seconds since mount
  frame: number; // frame index from the stage
  pointer: { x: number; y: number } | null; // CSS pixels, null until moved
}

interface PatternCanvasProps {
  draw: (args: DrawArgs) => void;
  frame?: number;
  animate?: boolean;
  trackPointer?: boolean;
}

export default function PatternCanvas({
  draw,
  frame = 0,
  animate = true,
  trackPointer = false,
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const startRef = useRef<number>(0);
  const drawRef = useRef(draw);

  // Keep the latest draw callback without reading/writing refs during render.
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!startRef.current) startRef.current = performance.now();

    let raf = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const c = canvas;
      const context = ctx;
      if (!c || !context) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = c.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      c.width = Math.max(1, Math.round(width * dpr));
      c.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!animate) render();
    }

    function render() {
      if (!ctx) return;
      const t = (performance.now() - startRef.current) / 1000;
      drawRef.current({ ctx, width, height, t, frame, pointer: pointerRef.current });
    }

    function loop() {
      render();
      raf = requestAnimationFrame(loop);
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (trackPointer) window.addEventListener("pointermove", onPointer);
    if (animate) loop();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (trackPointer) window.removeEventListener("pointermove", onPointer);
    };
  }, [animate, frame, trackPointer]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
