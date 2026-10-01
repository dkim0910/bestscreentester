"use client";

import { useEffect, useState } from "react";

/** Common panel refresh rates, for naming the one a measurement lands on. */
const STANDARD_RATES = [
  30, 48, 50, 60, 72, 75, 85, 90, 100, 120, 144, 160, 165, 170, 175, 180, 200, 240, 280, 300,
  360, 390, 480, 500, 540,
];

export interface RefreshReading {
  /** Refresh rate in Hz, unrounded. */
  hz: number;
  /** Average time per refresh in ms. */
  frameMs: number;
  /** The common panel rate within 3% of the reading, or null if none is that close. */
  nearest: number | null;
}

/**
 * Live refresh-rate reading from animation-frame timing, updated every 60 frames.
 * The median gap identifies the refresh interval, then the gaps near it are averaged:
 * browsers coarsen frame timestamps (~0.1 ms), which a median alone rounds straight
 * into the result, while the average cancels it out. Late or dropped frames fall
 * outside the band and are left out; gaps over 100 ms (tab hidden, a stall) are ignored.
 */
export function useRefreshReading(): RefreshReading | null {
  const [reading, setReading] = useState<RefreshReading | null>(null);

  useEffect(() => {
    let raf = 0;
    const deltas: number[] = [];
    let last = performance.now();

    function tick(now: number) {
      const d = now - last;
      last = now;
      if (d > 0 && d < 100) deltas.push(d);
      if (deltas.length >= 60) {
        const sorted = [...deltas].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const steady = deltas.filter((x) => x > median * 0.75 && x < median * 1.25);
        const frameMs = steady.reduce((sum, x) => sum + x, 0) / steady.length;
        const hz = 1000 / frameMs;
        const closest = STANDARD_RATES.reduce((a, b) => (Math.abs(b - hz) < Math.abs(a - hz) ? b : a));
        setReading({ hz, frameMs, nearest: Math.abs(closest - hz) <= closest * 0.03 ? closest : null });
        deltas.length = 0;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return reading;
}

/** Measured display refresh rate in whole Hz (null until the first reading). */
export function useRefreshRate(): number | null {
  const reading = useRefreshReading();
  return reading ? Math.round(reading.hz) : null;
}
