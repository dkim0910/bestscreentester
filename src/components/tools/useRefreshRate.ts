"use client";

import { useEffect, useState } from "react";

/**
 * Measured display refresh rate in Hz (null until the first reading). Uses the median
 * gap between animation frames over 60 frames, which shrugs off the odd late frame;
 * gaps over 100 ms (tab hidden, a stall) are ignored.
 */
export function useRefreshRate(): number | null {
  const [hz, setHz] = useState<number | null>(null);

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
        setHz(Math.round(1000 / sorted[Math.floor(sorted.length / 2)]));
        deltas.length = 0;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return hz;
}
