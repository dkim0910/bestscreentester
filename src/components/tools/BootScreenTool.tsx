"use client";

import { useEffect, useRef } from "react";
import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Windows 10", "Windows XP", "macOS"];

// --- Windows boot spinner tuning ---
const WIN_DOTS = 5;
const WIN_RADIUS = 26; // px from centre
const WIN_DOT = 5; // dot diameter, px
const WIN_PERIOD = 4000; // ms for one full cycle, including the empty pause
const WIN_DELAY = 0.042; // gap between consecutive dots, as a fraction of the cycle

// One dot's path through a cycle, as [time fraction, degrees clockwise from the bottom].
// Each dot rises out of the bottom, goes round twice — quick up the sides, slow over
// the top, where the dots bunch together — then drops back to the bottom and vanishes.
// The ring is empty for the rest of the cycle before the dots re-emerge one by one.
const WIN_PATH: [number, number][] = [
  [0, 0],
  [0.07, 120],
  [0.3, 230],
  [0.39, 465],
  [0.7, 590],
  [0.75, 720],
];
const WIN_VISIBLE_UNTIL = 0.75;
const WIN_FADE = 0.02; // fade in and out over this fraction of the cycle

const easeOut = (x: number) => 1 - (1 - x) * (1 - x);
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x));
// Per-segment easing, matching WIN_PATH: launch, crawl, sprint, crawl, exit.
const WIN_EASE = [easeOut, (x: number) => x, easeInOut, (x: number) => x, easeOut];

/** Angle (degrees clockwise from the bottom) and opacity of a dot at cycle fraction p. */
function winDot(p: number): { angle: number; opacity: number } {
  if (p >= WIN_VISIBLE_UNTIL) return { angle: 0, opacity: 0 };
  let i = 0;
  while (i < WIN_PATH.length - 2 && p >= WIN_PATH[i + 1][0]) i++;
  const [t0, a0] = WIN_PATH[i];
  const [t1, a1] = WIN_PATH[i + 1];
  const angle = a0 + (a1 - a0) * WIN_EASE[i]((p - t0) / (t1 - t0));
  const opacity = Math.min(1, p / WIN_FADE, (WIN_VISIBLE_UNTIL - p) / WIN_FADE);
  return { angle, opacity };
}

// The Windows 10 boot ring: five dots chase each other out of the bottom, bunch at the
// top, disappear at the bottom and re-form. Driven on one rAF loop so it stays smooth.
function WindowsSpinner() {
  const dots = useRef<Array<HTMLSpanElement | null>>([]);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const base = (now - start) / WIN_PERIOD;
      for (let i = 0; i < WIN_DOTS; i++) {
        const el = dots.current[i];
        if (!el) continue;
        const t = base - i * WIN_DELAY;
        // Before a dot's first turn it simply hasn't appeared yet.
        const { angle, opacity } = t < 0 ? { angle: 0, opacity: 0 } : winDot(t % 1);
        // 0° is the bottom of the ring; angles increase clockwise.
        const rad = (angle * Math.PI) / 180;
        el.style.transform = `translate(${-Math.sin(rad) * WIN_RADIUS}px, ${Math.cos(rad) * WIN_RADIUS}px)`;
        el.style.opacity = `${opacity}`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const box = WIN_RADIUS * 2 + WIN_DOT;
  return (
    <div className="relative" style={{ width: box, height: box }} aria-hidden>
      {Array.from({ length: WIN_DOTS }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            dots.current[i] = el;
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: WIN_DOT,
            height: WIN_DOT,
            left: "50%",
            top: "50%",
            marginLeft: -WIN_DOT / 2,
            marginTop: -WIN_DOT / 2,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

// Windows 10-style boot: the chasing-dots spinner under a generic four-tile mark.
// The marks on these screens are deliberately generic shapes, not the vendors' logos.
function Windows10Boot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-black">
      <svg width="90" height="90" viewBox="0 0 24 24" aria-hidden>
        <g fill="#4cc2f1">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
        </g>
      </svg>
      <WindowsSpinner />
    </div>
  );
}

// Windows XP boot: wordmark + the classic 3-block blue marquee.
function WindowsXpBoot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-14 bg-black text-white">
      <div className="text-center leading-tight">
        <div className="text-[7vmin] font-bold">
          Windows<span className="align-top text-[3.5vmin] text-[#f08000]">xp</span>
        </div>
      </div>
      <div className="relative h-4 w-56 overflow-hidden rounded-[3px] border border-white/40 bg-black">
        <div
          className="absolute top-0 h-full"
          style={{ width: "34%", animation: "xp-marquee 2s linear infinite" }}
        >
          <div className="flex h-full gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-full w-3 rounded-[2px]"
                style={{
                  background: "linear-gradient(180deg,#9fe0ff,#2a7bd6 60%,#0b3f86)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="text-[1.6vmin] text-white/50">Starting up…</div>
    </div>
  );
}

// macOS-style boot: a generic power mark + determinate progress bar.
function MacBoot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-black">
      <svg width="84" height="84" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7.5 5.6a8 8 0 1 0 9 0"
          stroke="#f5f5f7"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line x1="12" y1="3" x2="12" y2="11" stroke="#f5f5f7" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white"
          style={{ animation: "mac-progress 6s ease-out infinite" }}
        />
      </div>
    </div>
  );
}

export default function BootScreenTool({ tool }: { tool: ToolDef }) {
  const frames = [<Windows10Boot key="w10" />, <WindowsXpBoot key="xp" />, <MacBoot key="mac" />];
  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      keepAwake
      tapToExit
      startLabel="Start boot screen (full-screen)"
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => frames[i]}
    />
  );
}
