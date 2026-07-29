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

// ---------- Cracked screen (shattered, still-backlit LCD) ----------

// The panel behind the damage is still LIT. That contrast is the whole illusion:
// bright glass facets and white impact blowout against black liquid-crystal
// blots. Drawn on a flat black field it just reads as grey scribble.
function litPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number,
) {
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, "#1b2233");
  g.addColorStop(0.5, "#111726");
  g.addColorStop(1, "#1d2436");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  // Uneven backlight pools, as on a panel whose diffuser has been crushed.
  for (let i = 0; i < 5; i++) {
    const gx = rand() * width;
    const gy = rand() * height;
    const gr = Math.max(width, height) * (0.25 + rand() * 0.35);
    const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    rg.addColorStop(
      0,
      `rgba(${(70 + rand() * 70) | 0},${(95 + rand() * 65) | 0},${(150 + rand() * 70) | 0},0.34)`,
    );
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, width, height);
  }
}

// Trace an organic blob outline. The radius is a sum of a few low-frequency
// sinusoids plus a couple of broad Gaussian lobes, so the edge *undulates* and
// bulges. Per-vertex random radii — even smoothed ones — spike into a star, and
// a star is exactly what liquid crystal does not look like.
function blobPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rand: () => number,
) {
  // Five octaves: the low ones shape the puddle, the high ones keep the edge
  // ragged instead of a smooth cartoon cloud.
  const h = Array.from({ length: 5 }, () => rand() * 6.28);
  const amp = [
    0.14 + rand() * 0.08,
    0.08 + rand() * 0.05,
    0.04 + rand() * 0.03,
    0.022 + rand() * 0.02,
    0.012 + rand() * 0.014,
  ];
  const freq = [
    2 + Math.floor(rand() * 2),
    3 + Math.floor(rand() * 3),
    6 + Math.floor(rand() * 4),
    11 + Math.floor(rand() * 6),
    19 + Math.floor(rand() * 9),
  ];
  const lobes = Array.from({ length: 2 + Math.floor(rand() * 3) }, () => ({
    c: rand() * Math.PI * 2,
    w: 0.3 + rand() * 0.35,
    a: 0.18 + rand() * 0.3,
  }));
  const radiusAt = (a: number) => {
    let v = 1;
    for (let i = 0; i < amp.length; i++) v += amp[i] * Math.sin(freq[i] * a + h[i]);
    for (const L of lobes) {
      const d = Math.abs(((a - L.c + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      v += L.a * Math.exp(-(d * d) / (2 * L.w * L.w));
    }
    return v;
  };
  const n = 72;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = ((i % n) / n) * Math.PI * 2;
    const rr = r * radiusAt(a);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr * 0.87;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// A dead-LCD ink blot: opaque black puddle where the crystal has bled out,
// ringed by the oil-slick fringe you get where it is still half-alive, and
// smearing downward in columns as gravity pulls it along the pixel grid.
function inkBlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  height: number,
  rand: () => number,
) {
  // Oil-slick fringe first, so the black puddle covers its middle. Kept to a
  // thin, desaturated band over partial arcs — a full saturated ring reads as
  // a lens flare rather than crystal that is still half-alive.
  ctx.save();
  blobPath(ctx, x, y, r * 1.16, rand);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";
  const hue = rand() * 360;
  for (let i = 0; i < 4; i++) {
    const a0 = rand() * Math.PI * 2;
    const a1 = a0 + 0.6 + rand() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r * 1.3, a0, a1);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    const rg = ctx.createRadialGradient(x, y, r * 0.82, x, y, r * 1.12);
    rg.addColorStop(0, "rgba(0,0,0,0)");
    rg.addColorStop(0.45, `hsla(${(hue + i * 58) % 360},70%,55%,0.30)`);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(x - r * 1.4, y - r * 1.4, r * 2.8, r * 2.8);
    ctx.restore();
  }
  ctx.restore();

  // Vertical bleed columns running down from the blot.
  for (let i = 0; i < 14; i++) {
    const cx = x + (rand() - 0.5) * r * 1.5;
    const w = r * (0.02 + rand() * 0.07);
    const h = r * (0.4 + rand() * 2.2);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "rgba(0,0,0,0.92)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx, y, w, Math.min(h, height - y));
  }

  // The puddle itself: several independently-shaped layers, growing darker as
  // they shrink. The mismatched outlines give the ragged, graded edge that a
  // single hard-edged fill can't — crystal soaks outward, it doesn't stamp.
  const layers: [number, number][] = [
    [1.12, 0.3],
    [1, 0.45],
    [0.87, 0.7],
    [0.7, 1],
  ];
  for (const [k, a] of layers) {
    blobPath(ctx, x, y, r * k, rand);
    ctx.fillStyle = `rgba(0,0,0,${a})`;
    ctx.fill();
  }
}

function tracePath(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
}

// On a panel that is still lit, a fracture reads BRIGHT: the broken surfaces
// scatter backlight out toward the viewer, which is why cracks photograph as
// silver hairlines rather than dark ones. Each gets a soft dark shadow along
// one side for depth, and a minority pick up a prism fringe.
function crackLine(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  scale: number,
  rand: () => number,
  weight = 1,
  bright = 0.6,
) {
  if (pts.length < 2) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const l = Math.hypot(bx - ax, by - ay) || 1;
  const nx = -(by - ay) / l;
  const ny = (bx - ax) / l;

  // Shadow on the far lip, so the crack has depth instead of floating.
  ctx.save();
  ctx.translate(nx * 0.9 * scale, ny * 0.9 * scale);
  ctx.strokeStyle = `rgba(0,0,0,${0.3 + rand() * 0.28})`;
  ctx.lineWidth = (1 + rand() * 0.9) * weight * scale;
  tracePath(ctx, pts);
  ctx.stroke();
  ctx.restore();

  // The lit fracture itself.
  ctx.strokeStyle = `rgba(226,238,255,${bright * (0.45 + rand() * 0.55)})`;
  ctx.lineWidth = (0.45 + rand() * 0.6) * weight * scale;
  tracePath(ctx, pts);
  ctx.stroke();

  // Prism fringe on a few.
  if (rand() < 0.14) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = 0.5 * weight * scale;
    ctx.translate(0.9 * scale, 0);
    ctx.strokeStyle = "rgba(70,180,255,0.3)";
    tracePath(ctx, pts);
    ctx.stroke();
    ctx.translate(-1.8 * scale, 0);
    ctx.strokeStyle = "rgba(255,80,160,0.26)";
    tracePath(ctx, pts);
    ctx.stroke();
    ctx.restore();
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

type Pt = [number, number];

// Clip a convex polygon to the half-plane of points nearer `s` than `o` — one
// step of building a Voronoi cell by successive bisector cuts.
function clipHalfPlane(poly: Pt[], s: Pt, o: Pt): Pt[] {
  const nx = o[0] - s[0];
  const ny = o[1] - s[1];
  const c = (o[0] * o[0] + o[1] * o[1] - s[0] * s[0] - s[1] * s[1]) / 2;
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = a[0] * nx + a[1] * ny - c;
    const db = b[0] * nx + b[1] * ny - c;
    if (da <= 0) out.push(a);
    if (da <= 0 !== db <= 0) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

// Shattered safety glass is, structurally, a Voronoi diagram: irregular convex
// shards, tiny where the impact pulverised the panel and widening outward. The
// previous version used an even polar grid, which always reads as a drawn
// spider web — every cell the same shape, every ring concentric. Seeding the
// diagram densely around each impact and sparsely elsewhere gives the uneven
// cell sizes and off-radial edges that real fracture has.
function shardField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  impacts: { x: number; y: number; r: number; n: number }[],
  rand: () => number,
) {
  const seeds: Pt[] = [];
  for (const im of impacts) {
    for (let i = 0; i < im.n; i++) {
      // Squared distribution crowds shards hard into the crater and lets them
      // grow large toward the rim — a flat distribution gives the even
      // "cracked mud" texture that reads as a surface, not an impact.
      const rr = im.r * Math.pow(rand(), 2.2);
      const a = rand() * Math.PI * 2;
      seeds.push([im.x + Math.cos(a) * rr, im.y + Math.sin(a) * rr * (0.9 + rand() * 0.2)]);
    }
  }
  // A few far-flung seeds exist only to bound the outer cells; they are never
  // drawn, so the undamaged panel stays clean.
  for (let i = 0; i < 14; i++) seeds.push([rand() * width, rand() * height]);

  const bounds: Pt[] = [
    [-width * 0.15, -height * 0.15],
    [width * 1.15, -height * 0.15],
    [width * 1.15, height * 1.15],
    [-width * 0.15, height * 1.15],
  ];
  // Clipping every cell against every other seed is O(n²) and would put ~100ms
  // of blocking work on the main thread at this shard count — far worse on a
  // phone, which is where this prank actually gets used. Instead, bucket the
  // seeds into a uniform grid and clip against one ring of neighbours at a
  // time: a seed beyond ring k is at least (k-1)·cellSize away, so its bisector
  // cannot reach nearer than half of that, and once the cell fits inside that
  // radius no farther seed can cut it. Exact — same cells, ~4x faster.
  const cellSize = Math.max(4, Math.sqrt((width * height) / seeds.length) * 1.1);
  const cols = Math.ceil(width / cellSize) + 4;
  const rows = Math.ceil(height / cellSize) + 4;
  const gx = (x: number) => Math.min(cols - 1, Math.max(0, Math.floor(x / cellSize) + 2));
  const gy = (y: number) => Math.min(rows - 1, Math.max(0, Math.floor(y / cellSize) + 2));
  const grid: number[][] = Array.from({ length: cols * rows }, () => []);
  seeds.forEach((s, i) => grid[gy(s[1]) * cols + gx(s[0])].push(i));
  const d2 = (a: Pt, b: Pt) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  const maxRing = Math.max(cols, rows);

  const cells: Pt[][] = seeds.map((s, i) => {
    const cx = gx(s[0]);
    const cy = gy(s[1]);
    let poly = bounds;
    for (let ring = 1; ring <= maxRing; ring++) {
      const shell: number[] = [];
      for (let y = cy - ring; y <= cy + ring; y++) {
        if (y < 0 || y >= rows) continue;
        for (let x = cx - ring; x <= cx + ring; x++) {
          if (x < 0 || x >= cols) continue;
          const onShell =
            ring === 1 || x === cx - ring || x === cx + ring || y === cy - ring || y === cy + ring;
          if (!onShell) continue;
          for (const j of grid[y * cols + x]) if (j !== i) shell.push(j);
        }
      }
      shell.sort((a, b) => d2(seeds[a], s) - d2(seeds[b], s));
      for (const j of shell) {
        poly = clipHalfPlane(poly, s, seeds[j]);
        if (poly.length < 3) break;
      }
      if (poly.length < 3) break;
      let rad = 0;
      for (const p of poly) rad = Math.max(rad, Math.hypot(p[0] - s[0], p[1] - s[1]));
      if (((ring - 1) * cellSize) / 2 > rad) break;
    }
    return poly;
  });

  // How deep inside a shattered zone each cell sits: 0 at a crater, 1 at the
  // rim, >1 for panel that never broke. A real screen is mostly *intact* with
  // concentrated damage — shattering everything uniformly reads as texture.
  const depth = cells.map((poly) => {
    if (poly.length < 3) return 9;
    let cx = 0;
    let cy = 0;
    for (const p of poly) {
      cx += p[0];
      cy += p[1];
    }
    cx /= poly.length;
    cy /= poly.length;
    let best = 9;
    for (const im of impacts) {
      best = Math.min(best, Math.hypot(cx - im.x, cy - im.y) / im.r);
    }
    return best;
  });

  // (a) Shard faces. Each shard sits at its own slight angle, so it catches or
  // loses the light independently — that patchwork is the read of broken glass.
  for (let i = 0; i < cells.length; i++) {
    const poly = cells[i];
    if (poly.length < 3 || depth[i] > 1) continue;
    const near = depth[i];
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let k = 1; k < poly.length; k++) ctx.lineTo(poly[k][0], poly[k][1]);
    ctx.closePath();
    const roll = rand();
    // Shards near the impact are tilted hardest, so they swing furthest from
    // the panel's own brightness in both directions.
    const swing = 0.16 + (1 - near) * 0.5;
    const g = ctx.createLinearGradient(
      poly[0][0],
      poly[0][1],
      poly[Math.floor(poly.length / 2)][0],
      poly[Math.floor(poly.length / 2)][1],
    );
    if (roll > 0.62) {
      g.addColorStop(0, `rgba(214,230,255,${swing * (0.25 + rand() * 0.5)})`);
      g.addColorStop(1, `rgba(160,190,235,${swing * 0.06})`);
    } else if (roll > 0.24) {
      g.addColorStop(0, `rgba(0,0,0,${swing * (0.3 + rand() * 0.55)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      g.addColorStop(0, `rgba(120,150,200,${swing * 0.16})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
    }
    ctx.fillStyle = g;
    ctx.fill();
    // A few shards right at an impact have been knocked clean out.
    if (near < 0.3 && rand() > 0.9) {
      ctx.fillStyle = `rgba(0,0,0,${0.72 + rand() * 0.25})`;
      ctx.fill();
    }
  }

  // (b) Crack edges. Shared edges are de-duplicated so a boundary between two
  // shards is stroked once — stroking per-cell doubles every interior line and
  // makes the whole web look inked in.
  const seen = new Set<string>();
  const key = (a: Pt, b: Pt) => {
    const ka = `${a[0].toFixed(1)},${a[1].toFixed(1)}`;
    const kb = `${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  };
  for (let i = 0; i < cells.length; i++) {
    const poly = cells[i];
    if (poly.length < 3 || depth[i] > 1.05) continue;
    const near = Math.min(1, depth[i]);
    // Cracks thin out and peter away toward the rim rather than stopping dead
    // on a circle.
    if (rand() < near * near * 0.55) continue;
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k];
      const b = poly[(k + 1) % poly.length];
      const kk = key(a, b);
      if (seen.has(kk)) continue;
      seen.add(kk);
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1.5 * scale) continue;
      crackLine(
        ctx,
        roughen([a, b], rand, 0.16),
        scale,
        rand,
        1.35 - near * 0.5,
        0.95 - near * 0.6,
      );
    }
  }

  // (c) Radial cracks running out of each crater. Voronoi alone gives realistic
  // shard shapes but loses the one structure everyone recognises in a smashed
  // screen: long spokes shooting out from the point of impact.
  for (const im of impacts) {
    const spokes = 7 + Math.floor(rand() * 6);
    for (let i = 0; i < spokes; i++) {
      const a = rand() * Math.PI * 2;
      const len = im.r * (0.7 + rand() * 1.1);
      const pts = roughen(
        roughen(crackWalk(im.x + Math.cos(a) * im.r * 0.05, im.y + Math.sin(a) * im.r * 0.05, a, len, rand), rand, 0.28),
        rand,
        0.18,
      );
      crackLine(ctx, pts, scale, rand, 1.6, 1);
    }
  }
}

// The impact point itself: glass crushed to powder. Built from many small
// overlapping translucent dabs so the patch is irregular — a radial gradient
// there always reads as a lens flare, which was the old giveaway.
function frostImpact(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  scale: number,
  rand: () => number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 120; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.pow(rand(), 1.6) * r;
    const rr = (1 + rand() * 4.5) * scale;
    ctx.fillStyle = `rgba(236,244,255,${0.04 + rand() * 0.16})`;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  // Loose dust thrown clear of the crater.
  for (let i = 0; i < 60; i++) {
    const a = rand() * Math.PI * 2;
    const d = r * (0.8 + rand() * 2.4);
    ctx.fillStyle = `rgba(230,240,255,${0.1 + rand() * 0.35})`;
    const s = (0.4 + rand() * 1.1) * scale;
    ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, s, s);
  }
  ctx.restore();
}

function drawCracks({ ctx, width, height }: DrawArgs) {
  const rand = mulberry32(20240611);
  const md = Math.min(width, height);
  const scale = md / 800;

  litPanel(ctx, width, height, rand);

  const ix = width * 0.36;
  const iy = height * 0.44;
  const impacts = [
    { x: ix, y: iy, r: md * 0.66, n: 420 },
    { x: width * 0.83, y: height * 0.74, r: md * 0.34, n: 170 },
    { x: width * 0.04, y: height * 0.08, r: md * 0.3, n: 120 },
  ];

  // Rows of garbled output from a driver IC that took the hit — the tell that
  // this is a broken *screen* and not merely broken glass. Kept faint and
  // short: crisp full-width stripes read as bars drawn over the top.
  for (let i = 0; i < 6; i++) {
    const by = iy + (rand() - 0.5) * md * 0.55;
    const bh = md * (0.002 + rand() * 0.008);
    const bx = rand() * width * 0.55;
    const bw = width * (0.15 + rand() * 0.4);
    const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    const hue = Math.floor(rand() * 360);
    g.addColorStop(0, `hsla(${hue},60%,55%,0)`);
    g.addColorStop(0.5, `hsla(${hue},60%,55%,${0.1 + rand() * 0.14})`);
    g.addColorStop(1, `hsla(${hue},60%,55%,0)`);
    ctx.fillStyle = g;
    ctx.fillRect(bx, by, bw, bh);
  }

  // Liquid crystal bled out of the worst-hit areas and ran downhill.
  inkBlot(ctx, ix + md * 0.16, iy + md * 0.16, md * 0.19, height, rand);
  inkBlot(ctx, width * 0.85, height * 0.78, md * 0.09, height, rand);

  // Long cracks travelling clear across the panel to the edges.
  for (let k = 0; k < 4; k++) {
    const vert = rand() > 0.55;
    const sx = vert ? width * (0.1 + rand() * 0.8) : -10;
    const sy = vert ? -10 : height * (0.1 + rand() * 0.8);
    const a = (vert ? Math.PI / 2 : 0) + (rand() - 0.5) * 0.6;
    const len = (vert ? height : width) * 1.3;
    const pts = roughen(roughen(crackWalk(sx, sy, a, len, rand), rand, 0.3), rand, 0.2);
    crackLine(ctx, pts, scale, rand, 1.7, 0.85);
    const j = Math.max(1, Math.round((0.35 + rand() * 0.4) * (pts.length - 1)));
    const fa =
      Math.atan2(pts[j][1] - pts[j - 1][1], pts[j][0] - pts[j - 1][0]) +
      (rand() > 0.5 ? 1 : -1) * (0.4 + rand() * 0.5);
    const fp = roughen(crackWalk(pts[j][0], pts[j][1], fa, len * 0.18, rand), rand, 0.35);
    crackLine(ctx, fp, scale, rand, 1.2, 0.7);
  }

  // The shard network over the whole panel, then the craters on top.
  shardField(ctx, width, height, scale, impacts, rand);
  for (const im of impacts) frostImpact(ctx, im.x, im.y, im.r * 0.075, scale, rand);

  // Stuck TFT columns thrown by the damaged drivers.
  deadLines(ctx, width, height, scale, mulberry32(5150));

  // Light vignette — enough to sit the panel in its bezel, not enough to
  // swallow the damage.
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    md * 0.42,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.78,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
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
