"use client";

import { useEffect, useMemo, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const LABELS = [
  "Cracked",
  "Glitch",
  "Windows BSOD",
  "Mac Crash",
  "iOS Recovery",
  "Android Crash",
];

// Tiny deterministic PRNG so the cracks/QR look identical each render.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Cracked screen (realistic shattered LCD) ----------
function shatter(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  scale: number,
  seed: number,
) {
  const rand = mulberry32(seed);

  // Liquid-crystal "ink bleed" blotches around the impact.
  const bleeds = ["#1b1f3a", "#2a0f33", "#04222b", "#000000"];
  for (let i = 0; i < 5; i++) {
    const bx = ix + (rand() - 0.5) * 220 * scale;
    const by = iy + (rand() - 0.5) * 220 * scale;
    const r = (60 + rand() * 160) * scale;
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    g.addColorStop(0, bleeds[i % bleeds.length]);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radiating spider fractures.
  const spokes = 18;
  const ends: [number, number][] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2 + rand() * 0.35;
    const len = (220 + rand() * 460) * scale;
    const ex = ix + Math.cos(a) * len;
    const ey = iy + Math.sin(a) * len;
    ends.push([ex, ey]);
    ctx.strokeStyle = `rgba(255,255,255,${0.35 + rand() * 0.5})`;
    ctx.lineWidth = (0.4 + rand() * 1.6) * scale;
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    const segs = 7;
    for (let s = 1; s <= segs; s++) {
      const nx = ix + (ex - ix) * (s / segs) + (rand() - 0.5) * 26 * scale;
      const ny = iy + (ey - iy) * (s / segs) + (rand() - 0.5) * 26 * scale;
      ctx.lineTo(nx, ny);
    }
    ctx.stroke();
  }

  // Concentric web rings linking the spokes into glass fragments.
  for (let ring = 1; ring <= 5; ring++) {
    ctx.strokeStyle = `rgba(220,225,235,${0.5 - ring * 0.06})`;
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const [ex, ey] = ends[i % spokes];
      const f = (ring / 6) * (0.85 + rand() * 0.3);
      const x = ix + (ex - ix) * f + (rand() - 0.5) * 10 * scale;
      const y = iy + (ey - iy) * f + (rand() - 0.5) * 10 * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Bright impact core where the glass is pulverised.
  const core = ctx.createRadialGradient(ix, iy, 0, ix, iy, 70 * scale);
  core.addColorStop(0, "rgba(255,255,255,0.95)");
  core.addColorStop(0.4, "rgba(255,255,255,0.4)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(ix, iy, 70 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawCracks({ ctx, width, height }: DrawArgs) {
  // Dimly lit panel so the cracks and bleed read against it.
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#0c1018");
  bg.addColorStop(1, "#04060a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width, height) / 800;
  // Main impact slightly off-centre, plus two smaller secondary hits.
  shatter(ctx, width * 0.46, height * 0.42, scale, 1337);
  shatter(ctx, width * 0.8, height * 0.7, scale * 0.55, 99);
  shatter(ctx, width * 0.2, height * 0.78, scale * 0.4, 7);

  // Edge vignette so it feels like a real darkened, dying panel.
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.3,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}

// ---------- Glitch ----------
function drawGlitch({ ctx, width, height, t }: DrawArgs) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const rand = mulberry32(Math.floor(t * 12));
  for (let i = 0; i < 60; i++) {
    const y = rand() * height;
    const h = 4 + rand() * 40;
    const hue = Math.floor(rand() * 360);
    ctx.fillStyle = `hsl(${hue} 100% ${30 + rand() * 50}%)`;
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    ctx.fillRect(0, y, width, h);
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 8; i++) {
    const y = rand() * height;
    ctx.fillStyle = ["#ff0040", "#00ff80", "#3040ff"][i % 3];
    ctx.globalAlpha = 0.4;
    ctx.fillRect(rand() * width * 0.3, y, width, 2 + rand() * 6);
  }
  ctx.globalAlpha = 1;
}

// ---------- Fake QR block for the BSOD ----------
function FakeQr() {
  const cells = useMemo(() => {
    const n = 25;
    const rand = mulberry32(424242);
    const m: boolean[][] = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => rand() > 0.5),
    );
    // Stamp the three finder squares in the corners.
    const finder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++)
        for (let c = 0; c < 7; c++) {
          const edge = r === 0 || r === 6 || c === 0 || c === 6;
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          m[r0 + r][c0 + c] = edge || inner;
        }
    };
    finder(0, 0);
    finder(0, n - 7);
    finder(n - 7, 0);
    return m;
  }, []);
  return (
    <div
      className="grid bg-white p-1"
      style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)`, width: 116, height: 116 }}
      aria-hidden
    >
      {cells.flatMap((row, r) =>
        row.map((on, c) => (
          <div key={`${r}-${c}`} style={{ background: on ? "#000" : "#fff" }} />
        )),
      )}
    </div>
  );
}

// ---------- Windows BSOD (Windows 10/11 style) ----------
function WindowsBsod() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => (p >= 100 ? 0 : p + Math.ceil(Math.random() * 6)));
    }, 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-5 bg-[#0078d7] px-[8%] text-white">
      <div className="text-[10vmin] leading-none">:(</div>
      <p className="max-w-3xl text-[3.2vmin] leading-snug">
        Your PC ran into a problem and needs to restart. We&apos;re just collecting some error
        info, and then we&apos;ll restart for you.
      </p>
      <p className="text-[3.2vmin]">{Math.min(pct, 100)}% complete</p>
      <div className="mt-3 flex items-start gap-4">
        <FakeQr />
        <div className="max-w-xl text-[1.9vmin] leading-relaxed text-white/85">
          <p>
            For more information about this issue and possible fixes, visit
            https://www.windows.com/stopcode
          </p>
          <p className="mt-3">If you call a support person, give them this info:</p>
          <p>Stop code: CRITICAL_PROCESS_DIED</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Mac kernel panic ----------
function MacPanic() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-black px-6 text-center text-[#d7d7d7]">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="#d7d7d7" strokeWidth="1.5" />
        <line x1="12" y1="5" x2="12" y2="12" stroke="#d7d7d7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="max-w-xl space-y-3 text-[2.1vmin] leading-relaxed">
        <p>You need to restart your computer. Hold down the Power button until it turns off, then press the Power button again.</p>
        <p lang="fr" className="text-[#bdbdbd]">
          Veuillez redémarrer votre ordinateur. Maintenez la touche de démarrage enfoncée jusqu&apos;à
          l&apos;extinction de l&apos;appareil, puis appuyez de nouveau.
        </p>
        <p lang="de" className="text-[#bdbdbd]">
          Sie müssen Ihren Computer neu starten. Halten Sie dazu die Ein-/Austaste gedrückt, bis er
          sich ausschaltet, und drücken Sie sie dann erneut.
        </p>
        <p lang="ja" className="text-[#bdbdbd]">
          コンピュータを再起動する必要があります。電源ボタンを数秒間押し続けて電源を切ってから、再度電源ボタンを押してください。
        </p>
      </div>
    </div>
  );
}

// ---------- iOS recovery mode ----------
function IosRecovery() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-black text-white">
      <svg width="240" height="150" viewBox="0 0 240 150" fill="none" aria-hidden>
        {/* Laptop */}
        <rect x="138" y="34" width="74" height="48" rx="4" stroke="#e6e6e6" strokeWidth="3" />
        <path d="M128 90 h94 l8 12 H120 z" stroke="#e6e6e6" strokeWidth="3" strokeLinejoin="round" />
        {/* Cable */}
        <path
          d="M18 120 C 60 120, 70 70, 110 66 L 132 60"
          stroke="#e6e6e6"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* USB-C connector */}
        <rect x="6" y="112" width="20" height="16" rx="3" stroke="#e6e6e6" strokeWidth="3" />
      </svg>
      <p className="text-[2.4vmin] text-white/85">support.apple.com/iphone/restore</p>
    </div>
  );
}

// ---------- Android "System UI" crash dialog ----------
function AndroidCrash() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#0e1116]">
      {/* Faint home-screen grid behind the dialog */}
      <div className="absolute inset-0 grid grid-cols-4 content-start gap-6 p-[6%] opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-white/30" />
        ))}
      </div>
      <div className="relative z-10 w-[80%] max-w-md rounded-lg bg-[#2b2b2b] p-5 text-white shadow-2xl">
        <p className="text-[2.6vmin] font-medium">System UI isn&apos;t responding</p>
        <p className="mt-2 text-[2.1vmin] text-white/70">Do you want to close it?</p>
        <div className="mt-6 flex justify-end gap-6 text-[2.2vmin] font-medium text-[#8ab4f8]">
          <button className="uppercase">Wait</button>
          <button className="uppercase">Close app</button>
        </div>
      </div>
    </div>
  );
}

export default function FakeScreenTool({ tool }: { tool: ToolDef }) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      keepAwake
      startLabel="Start prank (full-screen)"
      frameLabel={(i) => LABELS[i]}
      renderFrame={(i) => {
        switch (i) {
          case 2:
            return <WindowsBsod />;
          case 3:
            return <MacPanic />;
          case 4:
            return <IosRecovery />;
          case 5:
            return <AndroidCrash />;
          default:
            return (
              <PatternCanvas
                frame={i}
                draw={i === 1 ? drawGlitch : drawCracks}
                animate={i === 1}
              />
            );
        }
      }}
    />
  );
}
