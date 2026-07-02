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
  "Pixel Glitch",
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

// Draw a crack as a dark gap with a thin bright glint on top, tapering in
// width and brightness from start to tip — a real fracture is widest and
// catches the most light at the impact and dies out to a hairline.
function strokeCrack(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  scale: number,
  bright: number,
  w0: number,
  w1: number,
) {
  if (pts.length < 2) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const chunks = Math.min(4, pts.length - 1);
  const per = (pts.length - 1) / chunks;
  for (let pass = 0; pass < 2; pass++) {
    for (let c = 0; c < chunks; c++) {
      const s = Math.round(c * per);
      const e = Math.min(pts.length - 1, Math.round((c + 1) * per));
      if (e <= s) continue;
      const f = (c + 0.5) / chunks;
      const w = w0 + (w1 - w0) * f;
      const off = pass === 0 ? 0.9 * scale : 0;
      if (pass === 0) {
        ctx.strokeStyle = `rgba(0,0,0,${0.55 * (1 - f * 0.5)})`;
        ctx.lineWidth = w * 1.8;
      } else {
        ctx.strokeStyle = `rgba(220,228,242,${bright * (1 - f * 0.65)})`;
        ctx.lineWidth = w;
      }
      ctx.beginPath();
      ctx.moveTo(pts[s][0] + off, pts[s][1] + off);
      for (let i = s + 1; i <= e; i++) ctx.lineTo(pts[i][0] + off, pts[i][1] + off);
      ctx.stroke();
    }
  }
}

// Walk a crack outward from (x, y): the heading drifts a little each step and
// the step length varies, so the path curves and kinks like propagating glass
// fracture instead of running straight.
function crackWalk(
  x: number,
  y: number,
  angle: number,
  len: number,
  rand: () => number,
): [number, number][] {
  const pts: [number, number][] = [[x, y]];
  const steps = 8 + Math.floor(rand() * 6);
  let a = angle;
  let px = x;
  let py = y;
  for (let i = 0; i < steps; i++) {
    a += (rand() - 0.5) * 0.32;
    const d = (len / steps) * (0.6 + rand() * 0.8);
    px += Math.cos(a) * d;
    py += Math.sin(a) * d;
    pts.push([px, py]);
  }
  return pts;
}

// One midpoint-displacement pass: split every segment and shove the midpoint
// sideways. Applied a couple of times it adds the fine jaggedness real cracks
// have at every zoom level.
function roughen(
  pts: [number, number][],
  rand: () => number,
  amount: number,
): [number, number][] {
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const l = Math.hypot(dx, dy) || 1;
    const off = (rand() - 0.5) * amount * l;
    out.push([(ax + bx) / 2 - (dy / l) * off, (ay + by) / 2 + (dx / l) * off], [bx, by]);
  }
  return out;
}

// Stuck TFT defect lines: a few solid-colour columns (and maybe a row).
// `on` gates each line's visibility (for flicker); the PRNG stream is always
// consumed in full so line positions stay fixed across frames.
function deadLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  rand: () => number,
  on: (i: number) => boolean = () => true,
) {
  const colors = ["#ff2d2d", "#2dff5a", "#2d6bff", "#ffffff", "#ff2df2", "#26e0e0"];
  const count = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(rand() * colors.length)];
    const alpha = 0.4 + rand() * 0.55;
    const x = rand() * width;
    const w = (0.5 + rand() * 2) * scale;
    if (!on(i)) continue;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, 0, w, height);
  }
  if (rand() > 0.5) {
    const color = colors[Math.floor(rand() * colors.length)];
    const y = rand() * height;
    const h = (0.6 + rand() * 1.5) * scale;
    if (on(count)) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, y, width, h);
    }
  }
  ctx.globalAlpha = 1;
}

// A realistic spider-web glass fracture: wandering tapered radial cracks that
// fork as they travel, partial "lacing" cracks between neighbours (never full
// concentric rings), faint facet sheens, glass dust, and a small pulverised
// frosted core at the impact point.
function fracture(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  baseR: number,
  scale: number,
  seed: number,
) {
  const rand = mulberry32(seed);
  const spokes = 14 + Math.floor(rand() * 6);
  const at = (p: [number, number][], f: number) =>
    p[Math.max(0, Math.min(p.length - 1, Math.round(f * (p.length - 1))))];

  // Generate the main radial cracks first (drawing comes after the sheens).
  // Lengths vary: most stop short, a few run far past the web.
  const mains: [number, number][][] = [];
  const lens: number[] = [];
  const base = rand() * Math.PI * 2;
  for (let i = 0; i < spokes; i++) {
    const a = base + (i / spokes) * Math.PI * 2 + ((rand() - 0.5) * Math.PI * 1.4) / spokes;
    const len = baseR * (rand() > 0.8 ? 1.2 + rand() : 0.45 + rand() * 0.5);
    lens.push(len);
    // Start just off the impact point — the pulverised core hides the joint
    // and the web doesn't collapse into a single bright pin-point.
    const r0 = baseR * (0.015 + rand() * 0.035);
    const sx = ix + Math.cos(a) * r0;
    const sy = iy + Math.sin(a) * r0;
    mains.push(roughen(roughen(crackWalk(sx, sy, a, len, rand), rand, 0.4), rand, 0.25));
  }
  // Point on spoke i at distance ~R from the impact (spokes differ in length,
  // so lacing and sheens must match by radius, not by fraction).
  const atR = (i: number, R: number) => at(mains[i], Math.min(1, R / lens[i]));

  // (a) Faint facet sheens between neighbouring cracks near the centre, so a
  // few glass shards catch the light.
  for (let i = 0; i < spokes; i++) {
    if (rand() > 0.3) continue;
    const R = baseR * (0.12 + rand() * 0.3);
    const R2 = R + baseR * 0.18;
    const a = atR(i, R);
    const b = atR((i + 1) % spokes, R);
    const a2 = atR(i, R2);
    const b2 = atR((i + 1) % spokes, R2);
    const g = ctx.createLinearGradient(a[0], a[1], b2[0], b2[1]);
    g.addColorStop(0, `rgba(205,218,238,${0.02 + rand() * 0.035})`);
    g.addColorStop(1, "rgba(205,218,238,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(b2[0], b2[1]);
    ctx.lineTo(a2[0], a2[1]);
    ctx.closePath();
    ctx.fill();
  }

  // (b) Stroke the radials, with occasional shallow-angle forks part-way out.
  for (let i = 0; i < spokes; i++) {
    const pts = mains[i];
    strokeCrack(ctx, pts, scale, 0.3 + rand() * 0.35, (1.3 + rand() * 0.9) * scale, 0.3 * scale);
    const forks = rand() < 0.65 ? 1 + Math.floor(rand() * 2) : 0;
    for (let b = 0; b < forks; b++) {
      const j = Math.max(1, Math.round((0.3 + rand() * 0.5) * (pts.length - 1)));
      const [bx, by] = pts[j];
      const [px, py] = pts[j - 1];
      const ba = Math.atan2(by - py, bx - px) + (rand() > 0.5 ? 1 : -1) * (0.35 + rand() * 0.55);
      const bp = roughen(crackWalk(bx, by, ba, lens[i] * (0.2 + rand() * 0.35), rand), rand, 0.4);
      strokeCrack(ctx, bp, scale, 0.16 + rand() * 0.22, 0.9 * scale, 0.25 * scale);
    }
  }

  // (c) Lacing: short connective cracks between neighbouring radials at
  // matching radii, denser near the impact, slightly bowed and jagged — this
  // is what turns loose radials into a shattered spider web.
  const bands = 8;
  for (let r = 1; r <= bands; r++) {
    const R = Math.pow(r / bands, 1.3) * baseR * 0.95;
    for (let i = 0; i < spokes; i++) {
      if (rand() > 0.95 - (r / bands) * 0.55) continue;
      const j = (i + 1) % spokes;
      // Skip pairs where either spoke has already ended.
      if (R > lens[i] * 0.98 || R > lens[j] * 0.98) continue;
      const a = atR(i, R * (0.92 + rand() * 0.16));
      const b = atR(j, R * (0.92 + rand() * 0.16));
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d < 4 * scale || d > baseR * 0.7) continue;
      const mid: [number, number] = [
        (a[0] + b[0]) / 2 + (rand() - 0.5) * d * 0.25,
        (a[1] + b[1]) / 2 + (rand() - 0.5) * d * 0.25,
      ];
      const pts = roughen(roughen([a, mid, b], rand, 0.35), rand, 0.25);
      strokeCrack(
        ctx,
        pts,
        scale,
        0.24 + (1 - r / bands) * 0.2 + rand() * 0.12,
        1.05 * scale,
        0.75 * scale,
      );
    }
  }

  // (d) Pulverised frosted impact core: dense micro-cracks and glass dust.
  const cr = baseR * 0.07;
  const fc = ctx.createRadialGradient(ix, iy, 0, ix, iy, cr);
  fc.addColorStop(0, "rgba(240,245,252,0.6)");
  fc.addColorStop(0.4, "rgba(222,230,245,0.22)");
  fc.addColorStop(1, "rgba(210,220,238,0)");
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.arc(ix, iy, cr, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 30; i++) {
    const a = rand() * Math.PI * 2;
    const l = baseR * (0.03 + rand() * 0.1);
    strokeCrack(
      ctx,
      [[ix, iy], [ix + Math.cos(a) * l, iy + Math.sin(a) * l]],
      scale,
      0.3 + rand() * 0.35,
      0.8 * scale,
      0.3 * scale,
    );
  }
  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * rand() * baseR * 0.14;
    ctx.fillStyle = `rgba(232,240,252,${0.12 + rand() * 0.35})`;
    const s = (0.5 + rand() * 1.2) * scale;
    ctx.fillRect(ix + Math.cos(a) * d, iy + Math.sin(a) * d, s, s);
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

  // Long cracks running right across the panel (glass cracks travel to the
  // edges), drawn first so the impact webs sit on top of them.
  for (let k = 0; k < 4; k++) {
    const vert = rand() > 0.55;
    const sx = vert ? width * (0.1 + rand() * 0.8) : -10;
    const sy = vert ? -10 : height * (0.1 + rand() * 0.8);
    const a = (vert ? Math.PI / 2 : 0) + (rand() - 0.5) * 0.6;
    const len = (vert ? height : width) * 1.3;
    const pts = roughen(roughen(crackWalk(sx, sy, a, len, rand), rand, 0.3), rand, 0.2);
    strokeCrack(ctx, pts, scale, 0.28 + rand() * 0.18, 1.2 * scale, 0.8 * scale);
    // A stray fork half-way along, so the long cracks aren't lone lines.
    const j = Math.max(1, Math.round((0.35 + rand() * 0.4) * (pts.length - 1)));
    const fa =
      Math.atan2(pts[j][1] - pts[j - 1][1], pts[j][0] - pts[j - 1][0]) +
      (rand() > 0.5 ? 1 : -1) * (0.4 + rand() * 0.5);
    const fp = roughen(crackWalk(pts[j][0], pts[j][1], fa, len * 0.18, rand), rand, 0.35);
    strokeCrack(ctx, fp, scale, 0.18 + rand() * 0.15, 0.9 * scale, 0.4 * scale);
  }

  // Glass fractures: one big impact, a smaller secondary hit, and a chip near
  // the corner (screens usually crack from a dropped corner too).
  fracture(ctx, ix, iy, md * 0.55, scale, 1337);
  fracture(ctx, width * 0.8, height * 0.72, md * 0.24, scale, 99);
  fracture(ctx, width * 0.035, height * 0.06, md * 0.3, scale, 777);

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

// ---------- Pixel glitch (dead pixels, some of them flickering) ----------
function drawPixelGlitch({ ctx, width, height, t }: DrawArgs) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const scale = Math.min(width, height) / 800;
  const cols = ["#ff2d2d", "#2dff5a", "#2d6bff", "#ffffff", "#ff2df2", "#26e0e0", "#ffd23d"];

  // A fixed set of stuck pixels — truly dead pixels stay put.
  const stable = mulberry32(31337);
  const scattered = Math.floor((width * height) / 16000);
  for (let i = 0; i < scattered; i++) {
    const x = stable() * width;
    const y = stable() * height;
    ctx.fillStyle = cols[Math.floor(stable() * cols.length)];
    ctx.globalAlpha = 0.6 + stable() * 0.4;
    const s = (1 + stable() * 2) * scale;
    ctx.fillRect(x, y, s, s);
  }

  // Flickering pixels: reseeded several times a second, so a second set
  // blinks and appears to jump around the panel like failing subpixels.
  const flick = mulberry32(1 + Math.floor(t * 9));
  const nFlick = Math.floor((width * height) / 22000);
  for (let i = 0; i < nFlick; i++) {
    ctx.fillStyle = cols[Math.floor(flick() * cols.length)];
    ctx.globalAlpha = 0.35 + flick() * 0.65;
    const s = (1 + flick() * 2.5) * scale;
    ctx.fillRect(flick() * width, flick() * height, s, s);
  }
  ctx.globalAlpha = 1;

  // Static damage clusters: dense patches of dead pixels that stay put.
  for (let c = 0; c < 3; c++) {
    const cr = mulberry32(500 + c);
    const cx = cr() * width;
    const cy = cr() * height;
    const cw = (60 + cr() * 120) * scale;
    const ch = (50 + cr() * 90) * scale;
    for (let j = 0; j < 170; j++) {
      ctx.fillStyle = cols[Math.floor(cr() * cols.length)];
      ctx.globalAlpha = 0.45 + cr() * 0.55;
      const s = (1.5 + cr() * 3) * scale;
      ctx.fillRect(cx + (cr() - 0.5) * cw, cy + (cr() - 0.5) * ch, s, s);
    }
  }
  ctx.globalAlpha = 1;

  // Stuck TFT lines, fixed in place but glitching on and off — each line
  // blinks at its own rate and stays lit most of the time.
  deadLines(ctx, width, height, scale, mulberry32(42), (i) => {
    const blink = mulberry32(i * 101 + Math.floor(t * (3 + (i % 4))));
    return blink() > 0.3;
  });
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
            return <PatternCanvas frame={i} draw={drawPixelGlitch} animate />;
          case 6:
            return <WindowsBsod />;
          case 7:
            return <WindowsXpBsod />;
          case 8:
            return <MacPanic />;
          case 9:
            return <LinuxPanic />;
          case 10:
            return <IosRecovery />;
          case 11:
            return <AndroidCrash />;
          default:
            return null;
        }
      }}
    />
  );
}
