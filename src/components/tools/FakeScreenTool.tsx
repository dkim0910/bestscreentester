"use client";

import { useEffect, useMemo, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

const LABELS = [
  "Cracked",
  "Glitch",
  "TV Static",
  "No Signal",
  "Dead Pixels",
  "Windows BSOD",
  "Windows XP",
  "Mac Crash",
  "Linux Panic",
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

// A spreading dead-LCD blot: an irregular near-black puddle a touch darker than
// the panel with only a faint cool bleed at its edge — kept subtle so it reads
// as real damage rather than a glowing orb.
function darkBleed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rand: () => number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, "rgba(0,0,0,0.9)");
  g.addColorStop(0.55, "rgba(2,4,10,0.6)");
  g.addColorStop(0.85, "rgba(26,34,66,0.22)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  const pts = 18;
  for (let i = 0; i <= pts; i++) {
    const a = ((i % pts) / pts) * Math.PI * 2;
    const rr = r * (0.5 + rand() * 0.65);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr * 0.84;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// Draw a crack as a dark gap with a thin bright glint on top — how a real glass
// fracture catches light on a dark panel (instead of a flat bright line).
function strokeCrack(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  scale: number,
  bright: number,
) {
  if (pts.length < 2) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(pts[0][0] + 0.9 * scale, pts[0][1] + 0.9 * scale);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] + 0.9 * scale, pts[i][1] + 0.9 * scale);
  ctx.stroke();
  ctx.strokeStyle = `rgba(216,224,238,${bright})`;
  ctx.lineWidth = 0.7 * scale;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

// Stuck TFT defect lines: a few solid-colour columns (and maybe a row).
function deadLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  rand: () => number,
) {
  const colors = ["#ff2d2d", "#2dff5a", "#2d6bff", "#ffffff", "#ff2df2", "#26e0e0"];
  const count = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.globalAlpha = 0.4 + rand() * 0.55;
    ctx.fillRect(rand() * width, 0, (0.5 + rand() * 2) * scale, height);
  }
  if (rand() > 0.5) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, rand() * height, width, (0.6 + rand() * 1.5) * scale);
  }
  ctx.globalAlpha = 1;
}

// A realistic spider-web glass fracture: dense radial cracks, long cracks that
// shoot across the panel, angular concentric cracks that carve the glass into
// irregular shards, faint facet reflections, and a pulverised frosted impact.
function fracture(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  baseR: number,
  scale: number,
  seed: number,
) {
  const rand = mulberry32(seed);
  const spokes = 14 + Math.floor(rand() * 8);
  const rings = 8;

  const ang: number[] = [];
  for (let i = 0; i < spokes; i++) ang.push((i / spokes) * Math.PI * 2 + (rand() - 0.5) * 0.4);

  // Grid of fracture nodes P[ring][spoke]; rings denser near the impact and
  // jittered per node so the shards come out irregular.
  const P: [number, number][][] = [];
  for (let r = 0; r < rings; r++) {
    const frac = Math.pow((r + 1) / rings, 1.4);
    const row: [number, number][] = [];
    for (let i = 0; i < spokes; i++) {
      const rr = baseR * frac * (0.82 + rand() * 0.36);
      row.push([ix + Math.cos(ang[i]) * rr, iy + Math.sin(ang[i]) * rr]);
    }
    P.push(row);
  }
  const reach: number[] = [];
  for (let i = 0; i < spokes; i++) reach.push(3 + Math.floor(rand() * (rings - 2)));

  // (a) Faint facet reflections on a few shards, so glass pieces catch light.
  for (let r = 0; r < rings - 1; r++) {
    for (let i = 0; i < spokes; i++) {
      if (rand() > 0.2) continue;
      const a = P[r][i];
      const b = P[r][(i + 1) % spokes];
      const c = P[r + 1][(i + 1) % spokes];
      const d = P[r + 1][i];
      const g = ctx.createLinearGradient(a[0], a[1], c[0], c[1]);
      const al = 0.03 + rand() * 0.06;
      g.addColorStop(0, `rgba(205,218,238,${al})`);
      g.addColorStop(1, "rgba(205,218,238,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.closePath();
      ctx.fill();
    }
  }

  // (b) Radial cracks, jagged from the impact outward.
  for (let i = 0; i < spokes; i++) {
    const pts: [number, number][] = [[ix, iy]];
    for (let r = 0; r < reach[i]; r++) pts.push(P[r][i]);
    strokeCrack(ctx, pts, scale, 0.26 + rand() * 0.4);
  }

  // (b2) A few long cracks that shoot well past the web, as real impacts do.
  const longCount = 3 + Math.floor(rand() * 3);
  for (let k = 0; k < longCount; k++) {
    const a = rand() * Math.PI * 2;
    const len = baseR * (1.3 + rand() * 1.1);
    const pts: [number, number][] = [[ix, iy]];
    for (let s = 1; s <= 6; s++) {
      const f = s / 6;
      pts.push([
        ix + Math.cos(a) * len * f + (rand() - 0.5) * 30 * scale,
        iy + Math.sin(a) * len * f + (rand() - 0.5) * 30 * scale,
      ]);
    }
    strokeCrack(ctx, pts, scale, 0.3 + rand() * 0.35);
  }

  // (c) Concentric cracks: straight segments between spokes with random gaps
  // (more gaps further out) so it never looks like a perfect web.
  for (let r = 1; r < rings; r++) {
    const skip = 0.08 + (r / rings) * 0.4;
    const runs: [number, number][][] = [];
    let run: [number, number][] = [];
    for (let i = 0; i <= spokes; i++) {
      if (i > 0 && rand() < skip) {
        if (run.length > 1) runs.push(run);
        run = [];
      }
      run.push(P[r][i % spokes]);
    }
    if (run.length > 1) runs.push(run);
    for (const rn of runs) strokeCrack(ctx, rn, scale, 0.2 + rand() * 0.22);
  }

  // (d) Pulverised frosted impact point + tiny micro-cracks.
  const fc = ctx.createRadialGradient(ix, iy, 0, ix, iy, baseR * 0.13);
  fc.addColorStop(0, "rgba(236,241,250,0.5)");
  fc.addColorStop(0.5, "rgba(208,218,235,0.16)");
  fc.addColorStop(1, "rgba(208,218,235,0)");
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.arc(ix, iy, baseR * 0.13, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2;
    const l = baseR * (0.03 + rand() * 0.12);
    strokeCrack(ctx, [[ix, iy], [ix + Math.cos(a) * l, iy + Math.sin(a) * l]], scale, 0.3 + rand() * 0.4);
  }
}

function drawCracks({ ctx, width, height }: DrawArgs) {
  const rand = mulberry32(20240611);
  const md = Math.min(width, height);
  const scale = md / 800;

  // Near-black panel with faint, uneven backlight so it isn't a flat black.
  ctx.fillStyle = "#04050a";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 3; i++) {
    const gx = rand() * width;
    const gy = rand() * height;
    const gr = Math.max(width, height) * (0.3 + rand() * 0.3);
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    g.addColorStop(0, "rgba(20,26,40,0.5)");
    g.addColorStop(1, "rgba(20,26,40,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  const ix = width * 0.43;
  const iy = height * 0.4;

  // Subtle dead-LCD bleed around the impacts (no glowing orbs).
  darkBleed(ctx, ix, iy, md * 0.32, rand);
  darkBleed(ctx, width * 0.78, height * 0.7, md * 0.16, rand);

  // Glass fractures: one big impact plus a smaller secondary hit.
  fracture(ctx, ix, iy, md * 0.6, scale, 1337);
  fracture(ctx, width * 0.8, height * 0.72, md * 0.26, scale, 99);

  // Edge vignette so it feels like a real darkened, dying panel.
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    md * 0.3,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}

// ---------- Glitch (digital signal corruption) ----------
function drawGlitch({ ctx, width, height, t }: DrawArgs) {
  const rand = mulberry32(Math.floor(t * 10));
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, width, height);

  // Horizontally-displaced "datamosh" blocks.
  for (let i = 0; i < 44; i++) {
    const y = rand() * height;
    const h = 6 + rand() * 64;
    const dx = (rand() - 0.5) * width * 0.6;
    ctx.fillStyle = `hsl(${Math.floor(rand() * 360)} ${55 + rand() * 45}% ${18 + rand() * 45}%)`;
    ctx.globalAlpha = 0.55 + rand() * 0.45;
    ctx.fillRect(dx, y, width, h);
  }
  ctx.globalAlpha = 1;

  // RGB channel-split bars (additive, so overlaps brighten like a real signal).
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 12; i++) {
    const y = rand() * height;
    const h = 2 + rand() * 12;
    const off = (rand() - 0.5) * 48;
    ctx.fillStyle = "rgba(255,0,64,0.65)";
    ctx.fillRect(-off, y, width, h);
    ctx.fillStyle = "rgba(0,255,128,0.65)";
    ctx.fillRect(off, y + 2, width, h);
    ctx.fillStyle = "rgba(48,80,255,0.65)";
    ctx.fillRect(off * 0.5, y - 2, width, h);
  }
  ctx.globalCompositeOperation = "source-over";

  // Bright horizontal tear and dark dropout lines.
  if (rand() > 0.6) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(0, rand() * height, width, 1 + rand() * 3);
  }
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, rand() * height, width, 2 + rand() * 8);

  // Subtle CRT scanlines over the whole thing.
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#000";
  for (let y = 0; y < height; y += 3) ctx.fillRect(0, y, width, 1);
  ctx.globalAlpha = 1;
}

// ---------- TV static (analog snow) ----------
// A small noise buffer is regenerated each frame and scaled up to full screen.
let noiseCanvas: HTMLCanvasElement | null = null;
let noiseImage: ImageData | null = null;

function drawStatic({ ctx, width, height, t }: DrawArgs) {
  const nw = 320;
  const nh = Math.max(1, Math.round((nw * height) / Math.max(1, width)));
  if (!noiseCanvas) noiseCanvas = document.createElement("canvas");
  const nctx = noiseCanvas.getContext("2d");
  if (!nctx) return;
  if (noiseCanvas.width !== nw || noiseCanvas.height !== nh) {
    noiseCanvas.width = nw;
    noiseCanvas.height = nh;
    noiseImage = nctx.createImageData(nw, nh);
  }
  const img = noiseImage!;
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  nctx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(noiseCanvas, 0, 0, width, height);

  // A faint roll bar drifting down the screen, like a vertical-hold fault.
  const roll = ((t * 140) % (height + 200)) - 100;
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(0, roll, width, 70);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(0, roll + 70, width, 10);
}

// ---------- No signal (SMPTE colour bars) ----------
function drawNoSignal({ ctx, width, height, t }: DrawArgs) {
  const bars = ["#bfbfbf", "#bfbf00", "#00bfbf", "#00bf00", "#bf00bf", "#bf0000", "#0000bf"];
  const bw = width / bars.length;
  const topH = height * 0.72;
  bars.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, 0, bw + 1, topH);
  });

  // Castellation strip beneath the main bars.
  const stripH = height * 0.08;
  const strip = ["#0000bf", "#0a0a0a", "#bf00bf", "#0a0a0a", "#00bfbf", "#0a0a0a", "#bfbfbf"];
  strip.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, topH, bw + 1, stripH);
  });

  // Dark PLUGE band along the bottom.
  ctx.fillStyle = "#0b0b12";
  ctx.fillRect(0, topH + stripH, width, height - topH - stripH);
  const pluge = ["#13131c", "#000000", "#1c1c28"];
  pluge.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(width * 0.62 + i * (width * 0.05), topH + stripH, width * 0.05, height);
  });

  // Blinking "NO SIGNAL" OSD box.
  if (Math.floor(t * 1.2) % 2 === 0) {
    const bxw = Math.min(width * 0.42, 520);
    const bxh = bxw * 0.28;
    const bx = (width - bxw) / 2;
    const by = (height - bxh) / 2;
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(bx, by, bxw, bxh);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2, bxw * 0.012);
    ctx.strokeRect(bx, by, bxw, bxh);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(bxh * 0.42)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("NO SIGNAL", width / 2, height / 2);
  }
}

// ---------- Dead pixels & stuck-pixel damage ----------
function drawDeadPixels({ ctx, width, height }: DrawArgs) {
  const rand = mulberry32(987654);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const scale = Math.min(width, height) / 800;
  const cols = ["#ff2d2d", "#2dff5a", "#2d6bff", "#ffffff", "#ff2df2", "#26e0e0", "#ffd23d"];

  // Scattered single stuck pixels across the panel.
  const scattered = Math.floor((width * height) / 9000);
  for (let i = 0; i < scattered; i++) {
    ctx.fillStyle = cols[Math.floor(rand() * cols.length)];
    ctx.globalAlpha = 0.55 + rand() * 0.45;
    const s = (1 + rand() * 2) * scale;
    ctx.fillRect(rand() * width, rand() * height, s, s);
  }
  ctx.globalAlpha = 1;

  // A few damaged clusters of densely packed dead pixels.
  for (let c = 0; c < 3; c++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const cw = (50 + rand() * 130) * scale;
    const ch = (40 + rand() * 100) * scale;
    for (let j = 0; j < 240; j++) {
      ctx.fillStyle = cols[Math.floor(rand() * cols.length)];
      ctx.globalAlpha = 0.5 + rand() * 0.5;
      const s = (1.5 + rand() * 3) * scale;
      ctx.fillRect(cx + (rand() - 0.5) * cw, cy + (rand() - 0.5) * ch, s, s);
    }
  }
  ctx.globalAlpha = 1;

  // Stuck TFT lines and a pressure-damage rainbow blotch.
  deadLines(ctx, width, height, scale, rand);
  const bx = rand() * width;
  const by = rand() * height;
  const br = (90 + rand() * 130) * scale;
  const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
  g.addColorStop(0, `hsla(${Math.floor(rand() * 360)},90%,60%,0.5)`);
  g.addColorStop(0.6, `hsla(${Math.floor(rand() * 360)},90%,55%,0.22)`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
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

// ---------- Windows XP BSOD (classic blue text) ----------
function WindowsXpBsod() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0000aa] px-[8%] font-mono text-white">
      <div className="max-w-3xl space-y-4 text-[1.9vmin] leading-relaxed">
        <p className="bg-[#aaaaaa] px-2 text-center font-bold text-[#0000aa]">Windows</p>
        <p>
          A problem has been detected and Windows has been shut down to prevent damage to your
          computer.
        </p>
        <p>DRIVER_IRQL_NOT_LESS_OR_EQUAL</p>
        <p>
          If this is the first time you&apos;ve seen this Stop error screen, restart your computer.
          If this screen appears again, follow these steps:
        </p>
        <p>
          Check to make sure any new hardware or software is properly installed. If this is a new
          installation, ask your hardware or software manufacturer for any Windows updates you might
          need.
        </p>
        <p>Technical information:</p>
        <p>*** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)</p>
        <p>*** ntkrnlpa.exe - Address F86B5A89 base at F86B5000, DateStamp 3dd99162</p>
        <p>Beginning dump of physical memory</p>
        <p>Physical memory dump complete.</p>
      </div>
    </div>
  );
}

// ---------- Linux kernel panic ----------
function LinuxPanic() {
  const lines = [
    "[ 1234.567890] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)",
    "[ 1234.567891] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 6.5.0-42-generic #1",
    "[ 1234.567892] Hardware name: Generic x86_64/x86_64, BIOS 1.16.0 04/01/2024",
    "[ 1234.567893] Call Trace:",
    "[ 1234.567894]  <TASK>",
    "[ 1234.567895]  dump_stack_lvl+0x48/0x70",
    "[ 1234.567896]  panic+0x118/0x2e8",
    "[ 1234.567897]  mount_block_root+0x1d2/0x1e8",
    "[ 1234.567898]  prepare_namespace+0x13c/0x178",
    "[ 1234.567899]  kernel_init_freeable+0x256/0x29c",
    "[ 1234.567900]  kernel_init+0x1b/0x150",
    "[ 1234.567901]  ret_from_fork+0x1f/0x30",
    "[ 1234.567902]  </TASK>",
    "[ 1234.567903] ---[ end Kernel panic - not syncing: VFS: Unable to mount root fs ]---",
  ];
  return (
    <div className="h-full w-full overflow-hidden bg-black p-[3vmin] font-mono text-[1.6vmin] leading-snug text-[#d0d0d0]">
      {lines.map((l, i) => (
        <p key={i} className={l.includes("panic") ? "text-[#ff5555]" : undefined}>
          {l}
        </p>
      ))}
      <p className="mt-2 animate-pulse">_</p>
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
          case 0:
            return <PatternCanvas frame={i} draw={drawCracks} animate={false} />;
          case 1:
            return <PatternCanvas frame={i} draw={drawGlitch} animate />;
          case 2:
            return <PatternCanvas frame={i} draw={drawStatic} animate />;
          case 3:
            return <PatternCanvas frame={i} draw={drawNoSignal} animate />;
          case 4:
            return <PatternCanvas frame={i} draw={drawDeadPixels} animate={false} />;
          case 5:
            return <WindowsBsod />;
          case 6:
            return <WindowsXpBsod />;
          case 7:
            return <MacPanic />;
          case 8:
            return <LinuxPanic />;
          case 9:
            return <IosRecovery />;
          case 10:
            return <AndroidCrash />;
          default:
            return null;
        }
      }}
    />
  );
}
