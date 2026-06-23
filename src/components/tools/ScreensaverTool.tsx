"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenStage from "./FullscreenStage";
import PatternCanvas, { type DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

interface BounceOpts {
  speed: number;
  size: number;
}

const LABELS = ["Matrix", "Starfield", "Snow", "Pipes", "Clock", "DVD Logo"];

type MatrixCharset = "jp" | "en";
const EN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?";

function randMatrixChar(charset: MatrixCharset) {
  if (charset === "en") return EN_CHARS[Math.floor(Math.random() * EN_CHARS.length)];
  return String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
}

// --- Matrix rain tuning ---
// Trails are drawn explicitly (not built up from a translucent wash), so the
// number of lit glyphs per column is a fixed constant — independent of fall
// speed and frame rate. Dragging the speed slider changes only how fast the
// head falls, never how many letters you can see.
const MATRIX_FONT = 18; // px per cell / glyph size
const MATRIX_TRAIL = 20; // glyphs lit per column, from the bright head fading up
const MATRIX_ROWS_PER_SEC = 6; // head falls this many cells/sec at speed = 1 (slow enough to read)

interface MatrixOpts {
  charset: MatrixCharset;
  speed: number;
}

interface MatrixColumn {
  head: number; // head row (float); negative means still above the top edge
  vary: number; // per-column speed multiplier for an organic, uneven fall
  chars: string[]; // glyph shown at each row — stable, so trails don't smear
}

function useMatrix(optsRef: React.RefObject<MatrixOpts>) {
  const cols = useRef<MatrixColumn[]>([]);
  const last = useRef(0);
  return ({ ctx, width, height, t }: DrawArgs) => {
    const { charset, speed } = optsRef.current;
    const fontSize = MATRIX_FONT;
    const colCount = Math.floor(width / fontSize);
    const rowCount = Math.ceil(height / fontSize) + 1;

    // Rebuild only when the canvas is resized (width OR height changes), never
    // on a speed change — that decoupling is what keeps the letter count steady
    // while the speed slider moves.
    if (cols.current.length !== colCount || cols.current[0]?.chars.length !== rowCount) {
      cols.current = Array.from({ length: colCount }, () => ({
        head: -Math.random() * rowCount, // staggered entry from above the top
        vary: 0.6 + Math.random() * 0.8,
        chars: Array.from({ length: rowCount }, () => randMatrixChar(charset)),
      }));
    }

    // Advance by elapsed time, not per-frame, so 60Hz and 120Hz displays scroll
    // at the same readable speed.
    const dt = last.current ? Math.min(0.05, t - last.current) : 0;
    last.current = t;

    // Solid clear — every lit glyph is repainted each frame at its own opacity,
    // so nothing accumulates into a blur.
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    for (let i = 0; i < colCount; i++) {
      const c = cols.current[i];
      const prevHead = Math.floor(c.head);
      c.head += MATRIX_ROWS_PER_SEC * speed * c.vary * dt;
      const head = Math.floor(c.head);

      // Give each newly-entered cell a fresh glyph so the trail reads as
      // distinct characters instead of one repeated, smeared letter.
      for (let r = prevHead + 1; r <= head; r++) {
        if (r >= 0 && r < rowCount) c.chars[r] = randMatrixChar(charset);
      }

      // Paint the trail from the bright head upward, fading to transparent.
      const x = i * fontSize;
      for (let k = 0; k < MATRIX_TRAIL; k++) {
        const r = head - k;
        if (r < 0 || r >= rowCount) continue;
        ctx.fillStyle = k === 0 ? "#caffd6" : `rgba(34,255,102,${1 - k / MATRIX_TRAIL})`;
        ctx.fillText(c.chars[r], x, r * fontSize);
      }

      // Respawn once the head and its whole trail have cleared the bottom.
      if (head - MATRIX_TRAIL > rowCount) {
        c.head = -Math.random() * rowCount * 0.5;
        c.vary = 0.6 + Math.random() * 0.8;
      }
    }
  };
}

// --- Starfield tuning ---
const STAR_COUNT = 700;
const STAR_WARP_BASE = 0.5; // depth consumed per second at speed = 1
// Mostly white, with a few cool/warm tints for a sense of depth.
const STAR_COLORS = ["255,255,255", "255,255,255", "205,218,255", "180,200,255", "255,240,214"];

interface Star {
  x: number; // normalized -1..1
  y: number;
  z: number; // 0 (at camera) .. 1 (far)
  px: number | null; // previous screen x — null means "no streak yet"
  py: number | null;
  col: string; // "r,g,b"
}

function makeStar(far = false): Star {
  return {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: far ? 1 : Math.random() * 0.9 + 0.1,
    px: null,
    py: null,
    col: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  };
}

function useStarfield(optsRef: React.RefObject<{ speed: number }>) {
  const stars = useRef<Star[]>([]);
  const last = useRef(0);
  return ({ ctx, width, height, t }: DrawArgs) => {
    const { speed } = optsRef.current;
    const dt = last.current ? Math.max(0, Math.min(0.05, t - last.current)) : 0;
    last.current = t;
    if (stars.current.length === 0) {
      stars.current = Array.from({ length: STAR_COUNT }, () => makeStar());
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";

    const cx = width / 2;
    const cy = height / 2;
    const focal = Math.min(width, height) * 0.5;
    const warp = STAR_WARP_BASE * speed;

    for (const s of stars.current) {
      s.z -= warp * dt;
      if (s.z <= 0.02) {
        Object.assign(s, makeStar(true)); // recycle far away, no streak across screen
        continue;
      }
      const sx = cx + (s.x / s.z) * focal;
      const sy = cy + (s.y / s.z) * focal;
      const depth = 1 - s.z; // 0 far .. ~1 near
      // Streak from the star's previous position to its current one — the closer
      // (and faster) it is, the longer and brighter the trail.
      if (s.px !== null && s.py !== null) {
        ctx.strokeStyle = `rgba(${s.col},${Math.min(1, 0.25 + depth)})`;
        ctx.lineWidth = Math.max(0.6, depth * 2.6);
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      s.px = sx;
      s.py = sy;
    }
  };
}

// --- Snow tuning ---
const SNOW_COUNT = 260;

interface Flake {
  x: number;
  y: number;
  r: number; // radius; bigger = nearer = faster + brighter (parallax)
  vy: number; // fall speed, px/sec
  swayA: number; // sway velocity amplitude
  swayF: number; // sway frequency
  phase: number;
  alpha: number;
}

function makeFlake(width: number, height: number, top = false): Flake {
  const r = 1 + Math.random() * Math.random() * 3; // biased toward small flakes
  return {
    x: Math.random() * width,
    y: top ? -r : Math.random() * height,
    r,
    vy: 22 + r * 22,
    swayA: 6 + r * 6,
    swayF: 0.6 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.min(1, 0.45 + r * 0.18),
  };
}

function useSnow(optsRef: React.RefObject<{ wind: number }>) {
  const flakes = useRef<Flake[]>([]);
  const last = useRef(0);
  return ({ ctx, width, height, t }: DrawArgs) => {
    const { wind } = optsRef.current;
    const dt = last.current ? Math.max(0, Math.min(0.05, t - last.current)) : 0;
    last.current = t;
    if (flakes.current.length === 0 && width > 0) {
      flakes.current = Array.from({ length: SNOW_COUNT }, () => makeFlake(width, height));
    }

    ctx.fillStyle = "#060912"; // wintry near-black
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";

    for (const f of flakes.current) {
      f.y += f.vy * dt;
      f.x += (wind * 36 * (f.r / 2) + Math.sin(t * f.swayF + f.phase) * f.swayA) * dt;
      if (f.y - f.r > height) {
        Object.assign(f, makeFlake(width, height, true)); // recycle to the top
      } else if (f.x < -f.r) {
        f.x = width + f.r;
      } else if (f.x > width + f.r) {
        f.x = -f.r;
      }
      ctx.globalAlpha = f.alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

// --- Pipes: a faux-3D take on the classic Windows "3D Pipes" screensaver ---
// Pipes grow through a 3D lattice that's projected with a fixed tilted camera;
// each tube is drawn with a cylindrical gradient and every turn gets a shiny
// ball joint, so the network reads as rounded 3D plumbing receding into depth.
const PIPE_GRID = 14; // lattice cells per axis
const PIPE_RADIUS = 0.37; // tube radius in cell units
const PIPE_CAM_DIST = PIPE_GRID * 1.7; // camera distance along the view axis
const PIPE_STEPS_PER_SEC = 7; // grid cells advanced per pipe per second at speed = 1
const PIPE_MAX_SEGS = 300; // wipe and restart once this many tubes are on screen
const PIPE_COUNT = 3; // pipes growing at once
const PIPE_TEAPOT_CHANCE = 0.025; // odds a joint renders as the Utah teapot easter egg
const PIPE_COLORS = ["#e6443b", "#f2a93b", "#3bd17a", "#37b6e6", "#8a6cff", "#ff5fa2", "#5ad1c4"];
// Six axis-aligned directions; reverse of dir d is d ^ 1.
const PIPE_DIRS3 = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
// Fixed camera orientation (yaw then pitch) — gives the lattice its 3D angle.
const PIPE_COS_Y = Math.cos(-0.62);
const PIPE_SIN_Y = Math.sin(-0.62);
const PIPE_COS_P = Math.cos(0.5);
const PIPE_SIN_P = Math.sin(0.5);

type RGB = [number, number, number];

interface Pipe3D {
  x: number;
  y: number;
  z: number;
  dir: number;
  rgb: RGB;
  fresh: boolean; // true until the first segment, so the pipe starts with a ball cap
}

interface PipeSeg {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  joint: number; // joint at end A: 0 none, 1 ball, 2 teapot (set on turns and pipe starts)
  rgb: RGB;
  depth: number; // camera depth of the segment midpoint, for back-to-front sorting
}

interface PipeState {
  pipes: Pipe3D[];
  segs: PipeSeg[];
  occ: Set<string>; // occupied cells, so pipes weave instead of overlapping
  acc: number; // fractional grid-steps owed
  last: number;
  w: number;
  h: number;
  dirty: boolean; // only repaint when something actually changed
}

const pipeKey = (x: number, y: number, z: number) => x + "," + y + "," + z;

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Lighten (amt > 0) toward white or darken (amt < 0) toward black.
function pipeShade([r, g, b]: RGB, amt: number): string {
  const f = (c: number) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

// Camera depth of a lattice point (smaller = nearer). Independent of canvas
// size, so it can be cached on each segment and stays valid across resizes.
function pipeDepth(x: number, y: number, z: number): number {
  const half = (PIPE_GRID - 1) / 2;
  const wx = x - half;
  const wy = y - half;
  const wz = z - half;
  const z1 = -wx * PIPE_SIN_Y + wz * PIPE_COS_Y;
  const z2 = wy * PIPE_SIN_P + z1 * PIPE_COS_P;
  return PIPE_CAM_DIST - z2;
}

// Perspective-project a lattice point to screen space (+ the local scale factor).
function pipeProject(x: number, y: number, z: number, cx: number, cy: number, focal: number) {
  const half = (PIPE_GRID - 1) / 2;
  const wx = x - half;
  const wy = y - half;
  const wz = z - half;
  const x1 = wx * PIPE_COS_Y + wz * PIPE_SIN_Y;
  const z1 = -wx * PIPE_SIN_Y + wz * PIPE_COS_Y;
  const y2 = wy * PIPE_COS_P - z1 * PIPE_SIN_P;
  const z2 = wy * PIPE_SIN_P + z1 * PIPE_COS_P;
  const f = focal / (PIPE_CAM_DIST - z2);
  return { sx: cx + x1 * f, sy: cy - y2 * f, scale: f };
}

function pipeSpawn(st: PipeState): Pipe3D | null {
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * PIPE_GRID);
    const y = Math.floor(Math.random() * PIPE_GRID);
    const z = Math.floor(Math.random() * PIPE_GRID);
    const k = pipeKey(x, y, z);
    if (!st.occ.has(k)) {
      st.occ.add(k);
      return {
        x,
        y,
        z,
        dir: Math.floor(Math.random() * 6),
        rgb: hexToRgb(PIPE_COLORS[Math.floor(Math.random() * PIPE_COLORS.length)]),
        fresh: true,
      };
    }
  }
  return null; // lattice essentially full
}

function pipeReset(st: PipeState) {
  st.segs.length = 0;
  st.occ.clear();
  st.pipes.length = 0;
  for (let i = 0; i < PIPE_COUNT; i++) {
    const p = pipeSpawn(st);
    if (p) st.pipes.push(p);
  }
  st.dirty = true;
}

function pipeAddSeg(st: PipeState, seg: PipeSeg) {
  // Keep segs sorted by depth descending (far first) via binary insertion, so a
  // dirty redraw can just paint front-to-back for correct occlusion.
  const segs = st.segs;
  let lo = 0;
  let hi = segs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (segs[mid].depth > seg.depth) lo = mid + 1;
    else hi = mid;
  }
  segs.splice(lo, 0, seg);
  st.dirty = true;
}

// Advance one pipe by a cell. Returns false when it gets stuck or randomly ends.
function pipeStep(st: PipeState, p: Pipe3D): boolean {
  const rev = p.dir ^ 1;
  const cand: number[] = [];
  let straightOk = false;
  for (let d = 0; d < 6; d++) {
    if (d === rev) continue;
    const nx = p.x + PIPE_DIRS3[d][0];
    const ny = p.y + PIPE_DIRS3[d][1];
    const nz = p.z + PIPE_DIRS3[d][2];
    if (nx < 0 || nx >= PIPE_GRID || ny < 0 || ny >= PIPE_GRID || nz < 0 || nz >= PIPE_GRID) continue;
    if (st.occ.has(pipeKey(nx, ny, nz))) continue;
    cand.push(d);
    if (d === p.dir) straightOk = true;
  }
  if (cand.length === 0) return false;

  // Favour going straight for longer runs; otherwise take a random right-angle turn.
  const nd = straightOk && Math.random() < 0.62 ? p.dir : cand[Math.floor(Math.random() * cand.length)];
  const turned = nd !== p.dir;
  // A joint goes on a turn or at the pipe's very start; rarely it's a teapot.
  const joint = turned || p.fresh ? (Math.random() < PIPE_TEAPOT_CHANCE ? 2 : 1) : 0;
  p.fresh = false;
  const ax = p.x;
  const ay = p.y;
  const az = p.z;
  p.dir = nd;
  p.x += PIPE_DIRS3[nd][0];
  p.y += PIPE_DIRS3[nd][1];
  p.z += PIPE_DIRS3[nd][2];
  st.occ.add(pipeKey(p.x, p.y, p.z));
  pipeAddSeg(st, {
    ax,
    ay,
    az,
    bx: p.x,
    by: p.y,
    bz: p.z,
    joint,
    rgb: p.rgb,
    depth: pipeDepth((ax + p.x) / 2, (ay + p.y) / 2, (az + p.z) / 2),
  });
  return Math.random() > 0.012; // small chance the pipe ends and respawns elsewhere
}

// A glossy metallic sphere with a tight off-centre hotspot.
function pipeDrawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: RGB) {
  const g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.04, x, y, r);
  g.addColorStop(0, pipeShade(rgb, 0.92));
  g.addColorStop(0.18, pipeShade(rgb, 0.45));
  g.addColorStop(0.5, pipeShade(rgb, -0.02));
  g.addColorStop(1, pipeShade(rgb, -0.62));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// The Utah teapot easter egg: a simplified shaded teapot (body, spout, handle,
// lid + knob) — the joint everyone remembers from the Windows screensaver.
function pipeDrawTeapot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: RGB) {
  const body = r * 1.15;
  // Spout (right) — drawn first so the body overlaps its base.
  ctx.fillStyle = pipeShade(rgb, -0.08);
  ctx.beginPath();
  ctx.moveTo(x + body * 0.45, y - body * 0.15);
  ctx.quadraticCurveTo(x + body * 1.5, y - body * 0.55, x + body * 1.62, y - body * 0.12);
  ctx.quadraticCurveTo(x + body * 1.3, y - body * 0.02, x + body * 0.55, y + body * 0.35);
  ctx.closePath();
  ctx.fill();
  // Handle (left) — an arc behind the body.
  ctx.strokeStyle = pipeShade(rgb, -0.12);
  ctx.lineWidth = r * 0.32;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x - body * 0.98, y - body * 0.05, body * 0.6, -Math.PI * 0.62, Math.PI * 0.62);
  ctx.stroke();
  // Body (a squashed shaded sphere).
  const g = ctx.createRadialGradient(x - body * 0.4, y - body * 0.45, body * 0.06, x, y, body * 1.05);
  g.addColorStop(0, pipeShade(rgb, 0.9));
  g.addColorStop(0.22, pipeShade(rgb, 0.4));
  g.addColorStop(0.55, pipeShade(rgb, -0.02));
  g.addColorStop(1, pipeShade(rgb, -0.58));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, body, body * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  // Lid rim + knob on top.
  ctx.fillStyle = pipeShade(rgb, 0.12);
  ctx.beginPath();
  ctx.ellipse(x, y - body * 0.74, body * 0.5, body * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = pipeShade(rgb, 0.4);
  ctx.beginPath();
  ctx.arc(x, y - body * 0.96, body * 0.17, 0, Math.PI * 2);
  ctx.fill();
}

function pipeDrawSeg(
  ctx: CanvasRenderingContext2D,
  s: PipeSeg,
  cx: number,
  cy: number,
  focal: number,
) {
  const a = pipeProject(s.ax, s.ay, s.az, cx, cy, focal);
  const b = pipeProject(s.bx, s.by, s.bz, cx, cy, focal);
  const r = Math.max(1, PIPE_RADIUS * ((a.scale + b.scale) / 2));

  // Dim with distance for atmosphere (near ~1.0, far ~0.5).
  const dim = 1 - Math.min(1, Math.max(0, (s.depth - (PIPE_CAM_DIST - 7)) / 14)) * 0.5;
  const rgb: RGB = [s.rgb[0] * dim, s.rgb[1] * dim, s.rgb[2] * dim];

  // Cylindrical shading: a gradient across the tube (dark rim → bright core).
  const dx = b.sx - a.sx;
  const dy = b.sy - a.sy;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const mx = (a.sx + b.sx) / 2;
  const my = (a.sy + b.sy) / 2;
  const grad = ctx.createLinearGradient(mx - px * r, my - py * r, mx + px * r, my + py * r);
  grad.addColorStop(0, pipeShade(rgb, -0.62));
  grad.addColorStop(0.28, pipeShade(rgb, -0.12));
  grad.addColorStop(0.46, pipeShade(rgb, 0.35));
  grad.addColorStop(0.5, pipeShade(rgb, 0.95)); // tight metallic specular streak
  grad.addColorStop(0.54, pipeShade(rgb, 0.35));
  grad.addColorStop(0.72, pipeShade(rgb, -0.12));
  grad.addColorStop(1, pipeShade(rgb, -0.66));
  ctx.strokeStyle = grad;
  ctx.lineWidth = r * 2;
  ctx.beginPath();
  ctx.moveTo(a.sx, a.sy);
  ctx.lineTo(b.sx, b.sy);
  ctx.stroke();

  // Joint at the corner: a shiny ball, or — rarely — the Utah teapot easter egg.
  if (s.joint === 1) pipeDrawBall(ctx, a.sx, a.sy, r * 1.45, rgb);
  else if (s.joint === 2) pipeDrawTeapot(ctx, a.sx, a.sy, r * 1.4, rgb);
}

function usePipes(optsRef: React.RefObject<{ speed: number }>) {
  const ref = useRef<PipeState | null>(null);
  return ({ ctx, width, height, t }: DrawArgs) => {
    const { speed } = optsRef.current;
    let st = ref.current;

    if (!st || st.w !== width || st.h !== height) {
      st = ref.current = {
        pipes: [],
        segs: [],
        occ: new Set(),
        acc: 0,
        last: t,
        w: width,
        h: height,
        dirty: true,
      };
      pipeReset(st);
    }

    let dt = t - st.last;
    st.last = t;
    // Negative/large gap = remounted or hidden (canvas was cleared) → force a repaint.
    if (dt < 0 || dt > 0.25) {
      dt = 0;
      st.dirty = true;
    }
    st.acc += Math.min(0.05, Math.max(0, dt)) * PIPE_STEPS_PER_SEC * speed;

    while (st.acc >= 1) {
      st.acc -= 1;
      let needReset = false;
      for (const p of st.pipes) {
        if (!pipeStep(st, p)) {
          const np = pipeSpawn(st);
          if (np) Object.assign(p, np);
          else needReset = true;
        }
      }
      if (needReset || st.segs.length > PIPE_MAX_SEGS) pipeReset(st);
    }

    // Static camera: only repaint when the network actually changed.
    if (!st.dirty) return;
    st.dirty = false;

    const cx = width / 2;
    const cy = height / 2;
    const focal = Math.min(width, height) * 0.95;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";
    for (const s of st.segs) pipeDrawSeg(ctx, s, cx, cy, focal);
  };
}

function useClock(fmtRef: React.RefObject<{ military: boolean }>) {
  return ({ ctx, width, height }: DrawArgs) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const now = new Date();
    const military = fmtRef.current.military;
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !military,
    });
    const date = now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    ctx.fillStyle = "#e8eaed";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const big = Math.min(width / 6, height / 3);
    ctx.font = `300 ${big}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(time, width / 2, height / 2 - big * 0.12);
    ctx.fillStyle = "rgba(232,234,237,0.55)";
    ctx.font = `400 ${big * 0.16}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(date, width / 2, height / 2 + big * 0.42);
  };
}

// Aspect ratio of the real logo artwork (public/dvd_logo.png, 602×273), a
// transparent white silhouette of the DVD Video logo we tint at runtime.
const DVD_ASPECT = 602 / 273;

function useBouncing(optsRef: React.RefObject<BounceOpts>) {
  const state = useRef({ x: 80, y: 80, vx: 150, vy: 120, hue: 0, last: 0 });
  const logoRef = useRef<HTMLImageElement | null>(null);
  const tintRef = useRef<HTMLCanvasElement | null>(null);

  // Load the real DVD Video artwork once; it gets recolored per bounce at draw time.
  useEffect(() => {
    const img = new Image();
    img.src = "/dvd_logo.png";
    img.onload = () => {
      logoRef.current = img;
    };
    tintRef.current = document.createElement("canvas");
  }, []);

  return ({ ctx, width, height, t }: DrawArgs) => {
    const { speed, size } = optsRef.current;
    const s = state.current;
    const dt = s.last ? Math.min(0.05, t - s.last) : 0;
    s.last = t;

    // Collision box equals the rendered art, so it touches the walls exactly.
    const h = Math.round(92 * size);
    const w = Math.round(h * DVD_ASPECT);

    // --- Move and bounce on the exact box edges.
    s.x += s.vx * dt * speed;
    s.y += s.vy * dt * speed;
    let hit = false;
    if (s.x <= 0) {
      s.x = 0;
      s.vx = Math.abs(s.vx);
      hit = true;
    } else if (s.x + w >= width) {
      s.x = width - w;
      s.vx = -Math.abs(s.vx);
      hit = true;
    }
    if (s.y <= 0) {
      s.y = 0;
      s.vy = Math.abs(s.vy);
      hit = true;
    } else if (s.y + h >= height) {
      s.y = height - h;
      s.vy = -Math.abs(s.vy);
      hit = true;
    }
    if (hit) s.hue = (s.hue + 47) % 360;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    const img = logoRef.current;
    const tint = tintRef.current;
    if (!img || !tint) return; // artwork still loading

    // Recolor the white silhouette to the current hue on an offscreen canvas
    // (fill clipped to the logo via "source-in"), then blit it — the logo keeps
    // its exact real-world shape while still cycling colors on every wall hit.
    if (tint.width !== w || tint.height !== h) {
      tint.width = w;
      tint.height = h;
    }
    const tc = tint.getContext("2d");
    if (!tc) return;
    tc.clearRect(0, 0, w, h);
    tc.drawImage(img, 0, 0, w, h);
    tc.globalCompositeOperation = "source-in";
    tc.fillStyle = `hsl(${s.hue} 85% 56%)`;
    tc.fillRect(0, 0, w, h);
    tc.globalCompositeOperation = "source-over";

    ctx.drawImage(tint, s.x, s.y);
  };
}

export default function ScreensaverTool({ tool }: { tool: ToolDef }) {
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1.4);
  const [charset, setCharset] = useState<MatrixCharset>("jp");
  const [matrixSpeed, setMatrixSpeed] = useState(1);
  const [starSpeed, setStarSpeed] = useState(1);
  const [snowWind, setSnowWind] = useState(0.3);
  const [pipeSpeed, setPipeSpeed] = useState(1);
  const [military, setMilitary] = useState(false);
  const optsRef = useRef<BounceOpts>({ speed: 1, size: 1.4 });
  const matrixRef = useRef<MatrixOpts>({ charset: "jp", speed: 1 });
  const starRef = useRef({ speed: 1 });
  const snowRef = useRef({ wind: 0.3 });
  const pipeRef = useRef({ speed: 1 });
  const clockRef = useRef<{ military: boolean }>({ military: false });
  // Keep the draw loop's options in sync without reading state during render.
  useEffect(() => {
    optsRef.current = { speed, size };
  }, [speed, size]);
  useEffect(() => {
    matrixRef.current = { charset, speed: matrixSpeed };
  }, [charset, matrixSpeed]);
  useEffect(() => {
    starRef.current = { speed: starSpeed };
  }, [starSpeed]);
  useEffect(() => {
    snowRef.current = { wind: snowWind };
  }, [snowWind]);
  useEffect(() => {
    pipeRef.current = { speed: pipeSpeed };
  }, [pipeSpeed]);
  useEffect(() => {
    clockRef.current = { military };
  }, [military]);

  const matrix = useMatrix(matrixRef);
  const starfield = useStarfield(starRef);
  const snow = useSnow(snowRef);
  const pipes = usePipes(pipeRef);
  const clock = useClock(clockRef);
  const bouncing = useBouncing(optsRef);

  const drawers = [matrix, starfield, snow, pipes, clock, bouncing];

  return (
    <FullscreenStage
      tool={tool}
      frameCount={LABELS.length}
      keepAwake={false}
      startLabel="Start screensaver"
      frameLabel={(i) => LABELS[i]}
      controls={(api) => {
        if (api.index === 0) {
          return (
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                {(["jp", "en"] as const).map((cs) => (
                  <button
                    key={cs}
                    onClick={() => setCharset(cs)}
                    className={`rounded-full px-3 py-1 ${
                      charset === cs ? "bg-white text-black" : "hover:bg-white/15"
                    }`}
                  >
                    {cs === "jp" ? "Japanese" : "English"}
                  </button>
                ))}
              </span>
              <label className="flex items-center gap-1.5">
                Speed
                <input
                  type="range"
                  min={0.25}
                  max={2.5}
                  step={0.25}
                  value={matrixSpeed}
                  onChange={(e) => setMatrixSpeed(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="Matrix fall speed"
                />
              </label>
            </span>
          );
        }
        if (api.index === 1) {
          return (
            <label className="flex items-center gap-1.5">
              Warp
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.25}
                value={starSpeed}
                onChange={(e) => setStarSpeed(Number(e.target.value))}
                style={{ accentColor: "var(--accent)" }}
                className="w-20"
                aria-label="Starfield warp speed"
              />
            </label>
          );
        }
        if (api.index === 2) {
          return (
            <label className="flex items-center gap-1.5">
              Wind
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={snowWind}
                onChange={(e) => setSnowWind(Number(e.target.value))}
                style={{ accentColor: "var(--accent)" }}
                className="w-20"
                aria-label="Snow wind"
              />
            </label>
          );
        }
        if (api.index === 3) {
          return (
            <label className="flex items-center gap-1.5">
              Speed
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.25}
                value={pipeSpeed}
                onChange={(e) => setPipeSpeed(Number(e.target.value))}
                style={{ accentColor: "var(--accent)" }}
                className="w-20"
                aria-label="Pipes speed"
              />
            </label>
          );
        }
        if (api.index === 4) {
          return (
            <span className="flex items-center gap-1">
              {([false, true] as const).map((mil) => (
                <button
                  key={String(mil)}
                  onClick={() => setMilitary(mil)}
                  className={`rounded-full px-3 py-1 ${
                    military === mil ? "bg-white text-black" : "hover:bg-white/15"
                  }`}
                >
                  {mil ? "24-hour" : "12-hour"}
                </button>
              ))}
            </span>
          );
        }
        if (api.index === 5) {
          return (
            <span className="flex items-center gap-3">
              <label className="flex items-center gap-1.5">
                Speed
                <input
                  type="range"
                  min={0.25}
                  max={3}
                  step={0.25}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="DVD logo speed"
                />
              </label>
              <label className="flex items-center gap-1.5">
                Size
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ accentColor: "var(--accent)" }}
                  className="w-20"
                  aria-label="DVD logo size"
                />
              </label>
            </span>
          );
        }
        return null;
      }}
      renderFrame={(i) => <PatternCanvas frame={i} draw={drawers[i]} animate />}
    />
  );
}
