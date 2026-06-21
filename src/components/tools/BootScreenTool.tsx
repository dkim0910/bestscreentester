"use client";

import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

const LABELS = ["Windows 10", "Windows XP", "macOS"];

// Windows 10 boot: manufacturer/Windows logo + ring-of-dots spinner.
function Windows10Boot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-black">
      <svg width="90" height="90" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4cc2f1" d="M3 4.5l8-1.1v8.1H3zM12 3.3L21 2v9.5h-9zM3 12.5h8v8.1l-8-1.1zM12 12.5h9V22l-9-1.3z" />
      </svg>
      <div className="relative h-12 w-12" style={{ animation: "boot-spin 1.4s linear infinite" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-22px)`,
              opacity: 0.15 + (i / 8) * 0.85,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Windows XP boot: wordmark + the classic 3-block blue marquee.
function WindowsXpBoot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-14 bg-black text-white">
      <div className="text-center leading-tight">
        <div className="text-[2vmin] tracking-wide text-white/70">Microsoft</div>
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
      <div className="text-[1.6vmin] text-white/50">Microsoft Corporation</div>
    </div>
  );
}

// macOS boot: Apple logo + determinate progress bar.
function MacBoot() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-black">
      <svg width="78" height="94" viewBox="0 0 24 24" fill="#f5f5f7" aria-hidden>
        <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.15-2.53.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.75-4.13z" />
        <path d="M14.69 4.81c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" />
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
      startLabel="Start boot screen (full-screen)"
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => frames[i]}
    />
  );
}
