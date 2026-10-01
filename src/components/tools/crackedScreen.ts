// The "Cracked" prank: shattered cover glass over a display that is still on.
//
// What sells a real cracked screen, in order of importance:
//  1. The picture *underneath* is broken up. Every shard of glass sits at its own angle,
//     so each one refracts the image a few pixels sideways and catches the light a
//     little differently. Lines drawn over an untouched image always read as a sticker.
//  2. Fracture topology. Cracks run out of one impact and *stop* where they meet another
//     crack (T-junctions); concentric cracks link the spokes into a web. Independent
//     strokes that cross each other in X's are the classic fake giveaway.
//  3. Cracks are lit, not drawn: hairlines that flare where they face the light and
//     nearly vanish where they don't, thinning out toward their tips.
//  4. Panel damage clustered at the impact — a liquid-crystal ink blot, bleed streaks,
//     a few stuck pixel lines — rather than spread evenly over the screen.
//
// Pipeline: grow the crack network → rasterize it and flood-fill the shards → shift and
// re-light each shard's pixels → overlay ink, lines, cracks and crushed glass. All of it
// is seeded, so the same screen size always produces the same break.

import type { DrawArgs } from "./PatternCanvas";
import { mulberry32 } from "./prng";

type Pt = [number, number];

// Concentric ring radii, in crater radii. Dense near the impact, sparser outward.
const RING_STEPS = [1.5, 2.2, 3.1, 4.3, 5.8, 7.7, 10];

// spoke: primary crack radiating from the impact · branch: fork off another crack ·
// ring: concentric crack linking two spokes · micro: pulverized glass in the crater.
type Kind = "spoke" | "branch" | "ring" | "micro";

interface Crack {
  pts: Pt[];
  kind: Kind;
}

// ---------- crack growth ----------

/** Spatial hash of every crack segment laid so far, for "stop at the first crack hit". */
class SegmentGrid {
  private cells = new Map<number, number[]>();
  private segs: number[] = []; // [ax, ay, bx, by, crackId] per segment
  private stamp: number[] = [];
  private query = 0;

  constructor(private size: number) {}

  private cellRange(ax: number, ay: number, bx: number, by: number) {
    const s = this.size;
    return [
      Math.floor(Math.min(ax, bx) / s),
      Math.floor(Math.min(ay, by) / s),
      Math.floor(Math.max(ax, bx) / s),
      Math.floor(Math.max(ay, by) / s),
    ];
  }

  add(ax: number, ay: number, bx: number, by: number, id: number) {
    const i = this.segs.length / 5;
    this.segs.push(ax, ay, bx, by, id);
    this.stamp.push(0);
    const [x0, y0, x1, y1] = this.cellRange(ax, ay, bx, by);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const k = cy * 65536 + cx;
        const list = this.cells.get(k);
        if (list) list.push(i);
        else this.cells.set(k, [i]);
      }
    }
  }

  /** Earliest crossing of a→b with a segment not belonging to `selfId` / `ignoreId`. */
  hit(ax: number, ay: number, bx: number, by: number, selfId: number, ignoreId: number) {
    this.query++;
    const rx = bx - ax;
    const ry = by - ay;
    let best = Infinity;
    const [x0, y0, x1, y1] = this.cellRange(ax, ay, bx, by);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const list = this.cells.get(cy * 65536 + cx);
        if (!list) continue;
        for (const i of list) {
          if (this.stamp[i] === this.query) continue;
          this.stamp[i] = this.query;
          const o = i * 5;
          const id = this.segs[o + 4];
          if (id === selfId || id === ignoreId) continue;
          const qx = this.segs[o];
          const qy = this.segs[o + 1];
          const sx = this.segs[o + 2] - qx;
          const sy = this.segs[o + 3] - qy;
          const den = rx * sy - ry * sx;
          if (Math.abs(den) < 1e-9) continue;
          const t = ((qx - ax) * sy - (qy - ay) * sx) / den;
          const u = ((qx - ax) * ry - (qy - ay) * rx) / den;
          if (t > 1e-6 && t <= 1 && u >= 0 && u <= 1 && t < best) best = t;
        }
      }
    }
    return best === Infinity ? null : ([ax + rx * best, ay + ry * best] as Pt);
  }
}

interface Grower {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  angle: number; // heading (for rings: current direction)
  curl: number; // slow drift of the heading, so long cracks sweep gently
  wobble: number; // size of the local kinks around the heading
  kink: number; // current kink offset; decays back toward the heading
  step: number;
  budget: number;
  branchP: number;
  depth: number;
  ignore: number; // parent crack, ignored for the first `grace` steps after forking
  grace: number;
  target: Pt | null; // rings steer toward the neighbouring spoke
  pts: Pt[];
}

interface Network {
  cracks: Crack[];
  spokeAngles: number[];
}

function growNetwork(
  width: number,
  height: number,
  impact: Pt,
  u: number,
  crushR: number,
  rand: () => number,
): Network {
  const grid = new SegmentGrid(Math.max(8, 22 * u));
  const cracks: Crack[] = [];
  const diag = Math.hypot(width, height);
  let nextId = 0;

  const make = (g: Omit<Grower, "id" | "pts" | "kink">): Grower => ({
    ...g,
    id: nextId++,
    kink: 0,
    pts: [[g.x, g.y]],
  });

  // Advance one crack by one step; returns false once it has stopped.
  function step(g: Grower, active: Grower[]): boolean {
    let a: number;
    if (g.target) {
      a = g.angle + (rand() - 0.5) * g.wobble;
      const want = Math.atan2(g.target[1] - g.y, g.target[0] - g.x);
      let d = want - a;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      a += Math.max(-0.32, Math.min(0.32, d));
      g.angle = a;
    } else {
      // Fracture holds its heading: kinks are local and decay back (a random walk on
      // the angle itself curls long cracks into tentacles and petals).
      g.angle += g.curl;
      g.kink = g.kink * 0.7 + (rand() - 0.5) * g.wobble;
      a = g.angle + g.kink;
    }
    const len = g.step * (0.6 + rand() * 0.8);
    let nx = g.x + Math.cos(a) * len;
    let ny = g.y + Math.sin(a) * len;
    let done = false;

    // Stop at the bezel.
    if (nx < 0 || ny < 0 || nx > width || ny > height) {
      const tx = nx < 0 ? -g.x / (nx - g.x) : nx > width ? (width - g.x) / (nx - g.x) : 1;
      const ty = ny < 0 ? -g.y / (ny - g.y) : ny > height ? (height - g.y) / (ny - g.y) : 1;
      const t = Math.max(0, Math.min(tx, ty));
      nx = g.x + (nx - g.x) * t;
      ny = g.y + (ny - g.y) * t;
      done = true;
    }

    // Stop dead on the first crack crossed — the T-junction. Inside the crater
    // everything radiates from one point, so collisions there are ignored.
    if (Math.hypot(g.x - impact[0], g.y - impact[1]) > crushR) {
      const hit = grid.hit(g.x, g.y, nx, ny, g.id, g.grace > 0 ? g.ignore : -1);
      if (hit) {
        [nx, ny] = hit;
        done = true;
      }
    }

    grid.add(g.x, g.y, nx, ny, g.id);
    g.pts.push([nx, ny]);
    g.x = nx;
    g.y = ny;
    g.budget -= len;
    g.grace--;
    if (g.target) {
      if (Math.hypot(g.target[0] - nx, g.target[1] - ny) < len) done = true;
      // A ring that wanders far off its radius has missed its spoke: stop it.
      const rt = Math.hypot(g.target[0] - impact[0], g.target[1] - impact[1]);
      const rr = Math.hypot(nx - impact[0], ny - impact[1]);
      if (rr > rt * 1.4 || rr < rt * 0.65) done = true;
    }
    if (g.budget <= 0) done = true;

    const stress = Math.max(0, 1 - Math.hypot(nx - impact[0], ny - impact[1]) / (crushR * 14));
    if (!done && g.depth < 2 && rand() < g.branchP * (1 + 3 * stress)) {
      const side = rand() < 0.5 ? -1 : 1;
      active.push(
        make({
          kind: "branch",
          x: nx,
          y: ny,
          angle: a + side * (0.3 + rand() * 0.55),
          curl: (rand() - 0.5) * 0.01,
          wobble: g.wobble,
          step: g.step * 0.85,
          budget: Math.min(g.budget, diag * 0.6) * (0.15 + rand() * 0.45),
          branchP: g.branchP * 0.45,
          depth: g.depth + 1,
          ignore: g.id,
          grace: 2,
          target: null,
        }),
      );
    }
    return !done;
  }

  // Grow every live crack one step per round, so the fracture front spreads evenly
  // and whichever crack arrives first is the one others terminate against.
  function run(active: Grower[]) {
    let guard = 60000;
    while (active.length && guard-- > 0) {
      const round = active.slice();
      for (const g of round) {
        if (!step(g, active)) {
          active.splice(active.indexOf(g), 1);
          cracks.push({ pts: g.pts, kind: g.kind });
        }
      }
    }
  }

  // 1. Spokes.
  const n = 14 + Math.floor(rand() * 6);
  const base = rand() * Math.PI * 2;
  const spokes: Grower[] = [];
  for (let i = 0; i < n; i++) {
    const angle = base + (i / n) * Math.PI * 2 + (rand() - 0.5) * ((Math.PI * 2) / n) * 0.7;
    spokes.push(
      make({
        kind: "spoke",
        x: impact[0] + Math.cos(angle) * crushR * 0.2,
        y: impact[1] + Math.sin(angle) * crushR * 0.2,
        angle,
        curl: (rand() - 0.5) * 0.007,
        wobble: 0.24,
        step: 7 * u,
        // Most spokes run clear to the bezel; the rest arrest part-way.
        budget: rand() < 0.6 ? diag * 2 : diag * (0.12 + rand() * 0.4),
        branchP: 0.03,
        depth: 0,
        ignore: -1,
        grace: 0,
        target: null,
      }),
    );
  }
  const spokeRefs = spokes.map((s) => ({ id: s.id, angle: s.angle, pts: s.pts }));
  run(spokes.slice());

  // 2. Rings: link neighbouring spokes at roughly constant radius, densest near the
  // impact. Each one is grown (not drawn straight), so it bows and stops on contact.
  const sorted = spokeRefs.slice().sort((p, q) => p.angle - q.angle);
  const radii = RING_STEPS.map((k) => k * crushR);
  const odds = [1, 0.97, 0.92, 0.85, 0.72, 0.55, 0.38];
  const rings: Grower[] = [];
  const at = (pts: Pt[], r: number): Pt | null => {
    for (const p of pts) if (Math.hypot(p[0] - impact[0], p[1] - impact[1]) >= r) return p;
    return null;
  };
  radii.forEach((r, k) => {
    for (let i = 0; i < sorted.length; i++) {
      if (rand() > odds[k]) continue;
      const a = sorted[i];
      const b = sorted[(i + 1) % sorted.length];
      const qa = at(a.pts, r * (0.88 + rand() * 0.24));
      const qb = at(b.pts, r * (0.88 + rand() * 0.24));
      if (!qa || !qb) continue;
      const chord = Math.hypot(qb[0] - qa[0], qb[1] - qa[1]);
      if (chord < 3 * u || chord > r * 1.6) continue;
      let spread = Math.abs(
        Math.atan2(qb[1] - impact[1], qb[0] - impact[0]) - Math.atan2(qa[1] - impact[1], qa[0] - impact[0]),
      );
      if (spread > Math.PI) spread = Math.PI * 2 - spread;
      if (spread < 0.16 || rand() > spread / 0.45) continue;
      const bow = (rand() < 0.5 ? -1 : 1) * (0.2 + rand() * 0.35);
      rings.push(
        make({
          kind: "ring",
          x: qa[0],
          y: qa[1],
          angle: Math.atan2(qb[1] - qa[1], qb[0] - qa[0]) + bow,
          curl: 0,
          wobble: 0.35,
          step: 5 * u,
          budget: chord * 1.7,
          branchP: 0.02,
          depth: 1,
          ignore: a.id,
          grace: 2,
          target: qb,
        }),
      );
    }
  });
  run(rings);

  // 3. Pulverized glass in the crater itself.
  const micro: Grower[] = [];
  for (let i = 0; i < 45; i++) {
    const d = Math.pow(rand(), 0.7) * crushR * 1.3;
    const t = rand() * Math.PI * 2;
    micro.push(
      make({
        kind: "micro",
        x: impact[0] + Math.cos(t) * d,
        y: impact[1] + Math.sin(t) * d,
        angle: rand() * Math.PI * 2,
        curl: 0,
        wobble: 0.5,
        step: 3 * u,
        budget: (3 + rand() * 10) * u,
        branchP: 0,
        depth: 2,
        ignore: -1,
        grace: 0,
        target: null,
      }),
    );
  }
  run(micro);

  return { cracks, spokeAngles: sorted.map((s) => s.angle) };
}

// ---------- the display underneath ----------

// What the panel shows behind the glass: one plain colour.
const DISPLAY_COLOR = "#f5f6f8";

function drawDisplay(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = DISPLAY_COLOR;
  ctx.fillRect(0, 0, w, h);
}

// ---------- shards ----------

interface Shards {
  labels: Int32Array; // per CSS pixel: shard index, -1 if none
  w: number;
  h: number;
  dx: Float32Array; // refraction offset, CSS px
  dy: Float32Array;
  light: Float32Array; // brightness multiplier
  frost: Float32Array; // 0..1 mix toward mottled grey (crushed glass)
  bbox: [number, number, number, number]; // union of affected shards, CSS px
}

function findShards(
  cracks: Crack[],
  width: number,
  height: number,
  impact: Pt,
  shatterR: number,
  u: number,
  rand: () => number,
): Shards {
  const w = Math.max(1, Math.ceil(width));
  const h = Math.max(1, Math.ceil(height));
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext("2d", { willReadFrequently: true })!;
  mctx.strokeStyle = "#000";
  mctx.lineWidth = 1.6;
  mctx.lineCap = "round";
  mctx.lineJoin = "round";
  for (const c of cracks) {
    mctx.beginPath();
    mctx.moveTo(c.pts[0][0], c.pts[0][1]);
    for (let i = 1; i < c.pts.length; i++) mctx.lineTo(c.pts[i][0], c.pts[i][1]);
    mctx.stroke();
  }
  const alpha = mctx.getImageData(0, 0, w, h).data;

  // Flood-fill the glass between cracks into labelled shards.
  const labels = new Int32Array(w * h).fill(-1);
  for (let i = 0; i < w * h; i++) if (alpha[i * 4 + 3] > 60) labels[i] = -2;
  const stack = new Int32Array(w * h);
  const count: number[] = [];
  const sx: number[] = [];
  const sy: number[] = [];
  const box: number[] = [];
  for (let start = 0; start < w * h; start++) {
    if (labels[start] !== -1) continue;
    const id = count.length;
    let n = 0;
    let ax = 0;
    let ay = 0;
    let x0 = w;
    let y0 = h;
    let x1 = 0;
    let y1 = 0;
    let top = 0;
    stack[top++] = start;
    labels[start] = id;
    while (top) {
      const p = stack[--top];
      const x = p % w;
      const y = (p - x) / w;
      n++;
      ax += x;
      ay += y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      if (x > 0 && labels[p - 1] === -1) {
        labels[p - 1] = id;
        stack[top++] = p - 1;
      }
      if (x < w - 1 && labels[p + 1] === -1) {
        labels[p + 1] = id;
        stack[top++] = p + 1;
      }
      if (y > 0 && labels[p - w] === -1) {
        labels[p - w] = id;
        stack[top++] = p - w;
      }
      if (y < h - 1 && labels[p + w] === -1) {
        labels[p + w] = id;
        stack[top++] = p + w;
      }
    }
    count.push(n);
    sx.push(ax / n);
    sy.push(ay / n);
    box.push(x0, y0, x1, y1);
  }
  // Fold crack pixels into a neighbouring shard so shifted shards meet without seams.
  for (let y = 0; y < h; y++) {
    for (let x = 1; x < w; x++) {
      const p = y * w + x;
      if (labels[p] === -2 && labels[p - 1] >= 0) labels[p] = labels[p - 1];
    }
  }
  for (let y = 1; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (labels[p] === -2) labels[p] = labels[p - w] >= 0 ? labels[p - w] : -1;
    }
  }

  const k = count.length;
  const dx = new Float32Array(k);
  const dy = new Float32Array(k);
  const light = new Float32Array(k).fill(1);
  const frost = new Float32Array(k);
  const bbox: [number, number, number, number] = [w, h, 0, 0];
  const intact = w * h * 0.1;
  for (let i = 0; i < k; i++) {
    if (count[i] > intact) continue; // the unbroken bulk of the panel
    const near = Math.max(0, 1 - Math.hypot(sx[i] - impact[0], sy[i] - impact[1]) / shatterR);
    if (near <= 0) continue;
    // Shards nearest the impact are tilted hardest: bigger shift, bigger light swing.
    const mag = Math.pow(near, 1.1) * 5.5 * u * (0.35 + rand() * 0.65);
    const t = rand() * Math.PI * 2;
    dx[i] = Math.cos(t) * mag;
    dy[i] = Math.sin(t) * mag;
    // Small fragments tumble and swing the light a lot; big plates barely tilt.
    const plate = Math.min(1, Math.sqrt(count[i]) / (60 * u));
    // On a bright panel a tilted shard mostly loses light (anything brighter clips).
    light[i] = 1 - rand() * (0.05 + 0.3 * near) * (1 - 0.65 * plate);
    const tiny = count[i] < 220 * u * u;
    if (tiny && near > 0.5 && rand() < 0.3) frost[i] = 0.35 + rand() * 0.4;
    else if (tiny && near > 0.6 && rand() < 0.12) light[i] = 0.18;
    bbox[0] = Math.min(bbox[0], box[i * 4]);
    bbox[1] = Math.min(bbox[1], box[i * 4 + 1]);
    bbox[2] = Math.max(bbox[2], box[i * 4 + 2]);
    bbox[3] = Math.max(bbox[3], box[i * 4 + 3]);
  }
  return { labels, w, h, dx, dy, light, frost, bbox };
}

// ---------- liquid-crystal ink ----------

interface Ink {
  cx: number;
  cy: number;
  radius: number[]; // edge radius sampled around the blot
  feather: number;
  reach: number; // max radius incl. feather, for the bounding box
}

function makeInk(cx: number, cy: number, base: number, rand: () => number): Ink {
  const N = 96;
  const radius = new Array<number>(N).fill(1);
  // Sum of a few smoothed noise octaves: bulbous lobes with a ragged edge.
  for (const [cells, amp] of [
    [4, 0.36],
    [9, 0.2],
    [19, 0.12],
    [41, 0.07],
    [89, 0.035],
  ] as const) {
    const v = Array.from({ length: cells }, () => rand() * 2 - 1);
    for (let i = 0; i < N; i++) {
      const f = (i / N) * cells;
      const a = Math.floor(f);
      const t = f - a;
      const s = t * t * (3 - 2 * t);
      radius[i] += amp * (v[a % cells] * (1 - s) + v[(a + 1) % cells] * s);
    }
  }
  const feather = base * 0.1;
  const reach = base * Math.max(...radius) + feather * 2;
  return { cx, cy, radius: radius.map((r) => r * base), feather, reach };
}

// ---------- compositing ----------

interface StuckLine {
  x: number; // CSS px
  w: number;
  color: string;
  alpha: number;
}

interface Layers {
  key: string;
  display: HTMLCanvasElement; // the panel's image through the shards, plus ink
  glass: HTMLCanvasElement; // the cracked cover glass (transparent), drawn over the display
  impact: Pt;
  u: number;
  scale: number;
  lines: StuckLine[]; // drawn live each frame so they can flicker
}

let cache: Layers | null = null;

function buildLayers(width: number, height: number, BW: number, BH: number, key: string): Layers {
  const rand = mulberry32(73021);
  const md = Math.min(width, height);
  const u = md / 800;
  const scale = BW / width; // backing pixels per CSS pixel
  // Off-centre, like a corner drop: the classic place a phone lands.
  const impact: Pt = [width * 0.64, height * 0.62];
  const crushR = 20 * u;
  const shatterR = 15 * crushR; // how far out shards are displaced and re-lit

  const { cracks } = growNetwork(width, height, impact, u, crushR, rand);
  const shards = findShards(cracks, width, height, impact, shatterR, u, rand);
  const ink = makeInk(impact[0] - 2.2 * crushR, impact[1] + 1.6 * crushR, md * 0.05, rand);

  const layer = (read = false) => {
    const c = document.createElement("canvas");
    c.width = BW;
    c.height = BH;
    const x = c.getContext("2d", read ? { willReadFrequently: true } : undefined)!;
    x.setTransform(scale, 0, 0, scale, 0, 0);
    return [c, x] as const;
  };

  // ----- The display: what the panel shows, as seen through the broken glass. -----
  const [bgCanvas, bctx] = layer(true);
  drawDisplay(bctx, width, height);
  const [display, dctx] = layer();
  dctx.save();
  dctx.setTransform(1, 0, 0, 1, 0, 0);
  dctx.drawImage(bgCanvas, 0, 0);

  // Re-render only the damaged region: each shard samples the display through its own
  // offset and light level; the ink blot darkens on top.
  const ix0 = ink.cx - ink.reach;
  const iy0 = ink.cy - ink.reach;
  const ix1 = ink.cx + ink.reach;
  const iy1 = ink.cy + ink.reach;
  const [sb0, sb1, sb2, sb3] = shards.bbox;
  const X0 = Math.max(0, Math.floor(Math.min(sb0, ix0) * scale));
  const Y0 = Math.max(0, Math.floor(Math.min(sb1, iy0) * scale));
  const X1 = Math.min(BW, Math.ceil((Math.max(sb2, ix1) + 1) * scale));
  const Y1 = Math.min(BH, Math.ceil((Math.max(sb3, iy1) + 1) * scale));
  if (X1 > X0 && Y1 > Y0) {
    // Read back only the damaged region, plus a margin for the largest shard shift.
    const m = Math.ceil(6 * u * scale) + 2;
    const RX0 = Math.max(0, X0 - m);
    const RY0 = Math.max(0, Y0 - m);
    const RX1 = Math.min(BW, X1 + m);
    const RY1 = Math.min(BH, Y1 + m);
    const RW = RX1 - RX0;
    const bg = bctx.getImageData(RX0, RY0, RW, RY1 - RY0).data;
    const out = dctx.createImageData(X1 - X0, Y1 - Y0);
    const o = out.data;
    const { labels, w: LW, h: LH, dx, dy, light, frost } = shards;
    const N = ink.radius.length;
    let j = 0;
    for (let Y = Y0; Y < Y1; Y++) {
      const cy = Math.min(LH - 1, Math.floor(Y / scale));
      const py = Y / scale;
      for (let X = X0; X < X1; X++, j += 4) {
        const cx = Math.min(LW - 1, Math.floor(X / scale));
        const lab = labels[cy * LW + cx];
        let sxp = X;
        let syp = Y;
        let lit = 1;
        let fr = 0;
        if (lab >= 0) {
          sxp = Math.min(RX1 - 1, Math.max(RX0, Math.round(X + dx[lab] * scale)));
          syp = Math.min(RY1 - 1, Math.max(RY0, Math.round(Y + dy[lab] * scale)));
          lit = light[lab];
          fr = frost[lab];
        }
        const si = ((syp - RY0) * RW + (sxp - RX0)) * 4;
        let r = bg[si] * lit;
        let g = bg[si + 1] * lit;
        let b = bg[si + 2] * lit;
        if (fr) {
          // Crushed glass scatters the backlight: on a bright screen it reads as a
          // mottled silver-grey, so pull toward a per-pixel hashed grey.
          let hsh = (X * 374761393 + Y * 668265263) | 0;
          hsh = Math.imul(hsh ^ (hsh >>> 13), 1274126177);
          const n = ((hsh ^ (hsh >>> 16)) & 255) / 255;
          const v = 135 + 105 * n;
          r += (v - r) * fr;
          g += (v + 4 - g) * fr;
          b += (v + 12 - b) * fr;
        }
        // Ink: near-black, unevenly pooled core with a feathered edge.
        const px = X / scale;
        if (px > ix0 && px < ix1 && py > iy0 && py < iy1) {
          const ddx = px - ink.cx;
          const ddy = py - ink.cy;
          const d = Math.hypot(ddx, ddy);
          const fi = ((Math.atan2(ddy, ddx) / (Math.PI * 2) + 1) % 1) * N;
          const a0 = Math.floor(fi);
          const t = fi - a0;
          const edge = ink.radius[a0 % N] * (1 - t) + ink.radius[(a0 + 1) % N] * t;
          const cover = Math.max(0, Math.min(1, (edge - d) / ink.feather + 0.5));
          if (cover > 0) {
            // Cheap value noise: the leaked crystal pools unevenly, it isn't paint.
            const mottle =
              0.03 +
              0.12 *
                (0.5 +
                  0.5 * Math.sin(px * 0.21 + Math.sin(py * 0.13) * 3) * Math.sin(py * 0.17 - px * 0.05));
            const keep = 1 - cover + cover * mottle;
            r *= keep;
            g *= keep;
            b *= keep;
          }
        }
        o[j] = r;
        o[j + 1] = g;
        o[j + 2] = b;
        o[j + 3] = 255;
      }
    }
    dctx.putImageData(out, X0, Y0);
  }
  dctx.restore();

  // Liquid crystal bleeding down (and a little up) the pixel columns under the blot.
  for (let i = 0; i < 6; i++) {
    const x = ink.cx + (rand() - 0.5) * ink.reach * 1.1;
    const w = (1 + rand() * 3) * u;
    const down = rand() < 0.75;
    const len = height * (down ? 0.12 + rand() * 0.55 : 0.05 + rand() * 0.18);
    const y0 = ink.cy + (rand() - 0.5) * ink.reach * 0.6;
    const y1 = down ? y0 + len : y0 - len;
    const g = dctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, `rgba(0,0,0,${0.55 + rand() * 0.4})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    dctx.fillStyle = g;
    dctx.fillRect(x, Math.min(y0, y1), w, len);
  }

  // Stuck pixel columns from the damaged driver lines — full height, crisp, snapped to
  // device pixels. Positioned here, drawn per frame (see drawStuckLines).
  const lines: StuckLine[] = ["#16c95a", "#e01fb8"].map((color) => ({
    x: Math.round((impact[0] + (rand() - 0.5) * md * 0.35) * scale) / scale,
    w: Math.max(1 / scale, (0.6 + rand()) * u),
    color,
    alpha: 0.7 + rand() * 0.25,
  }));

  // ----- The glass: cracks and crushed glass, transparent elsewhere. -----
  // On a bright screen a crack reads DARK: its walls bend the backlight away from the
  // eye. It only sparkles white where a wall faces the room light.
  const [glass, gctx] = layer();
  const L: Pt = [-0.55, -0.83];
  gctx.lineJoin = "round";
  const widthOf = (kind: Kind) =>
    kind === "spoke" ? 1.1 : kind === "branch" ? 0.8 : kind === "ring" ? 0.85 : 0.5;
  const nearAt = (x: number, y: number) =>
    Math.max(0, 1 - Math.hypot(x - impact[0], y - impact[1]) / shatterR);
  const trace = (pts: Pt[], from: number, to: number, ox = 0, oy = 0) => {
    gctx.beginPath();
    gctx.moveTo(pts[from][0] + ox, pts[from][1] + oy);
    for (let k = from + 1; k <= to; k++) gctx.lineTo(pts[k][0] + ox, pts[k][1] + oy);
  };
  for (const c of cracks) {
    const pts = c.pts;
    if (pts.length < 2) continue;
    const w0 = widthOf(c.kind) * u;
    const total = pts.length - 1;
    const near0 = nearAt(pts[0][0], pts[0][1]);

    // Whole-crack layers in one stroke each, so nothing overlaps into beads: a soft
    // grey band where the glass around the crack is crazed (near the impact), and a
    // shadow on the far lip.
    gctx.lineCap = "round";
    if (near0 > 0.25) {
      trace(pts, 0, total);
      gctx.strokeStyle = `rgba(70,80,100,${0.07 * near0})`;
      gctx.lineWidth = w0 * 3.5;
      gctx.stroke();
    }
    trace(pts, 0, total, 0.6 * u, 0.8 * u);
    gctx.strokeStyle = `rgba(20,26,38,${0.08 + 0.2 * near0})`;
    gctx.lineWidth = w0 + 0.5 * u;
    gctx.stroke();

    // The hairline, a few segments at a time with butt caps: dark where its wall faces
    // away from the light, a white glint along the lip where it faces it, thinning
    // toward the tip.
    gctx.lineCap = "butt";
    for (let i = 0; i < total; i += 3) {
      const end = Math.min(total, i + 3);
      const [ax, ay] = pts[i];
      const [bx, by] = pts[end];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const facing = Math.abs((-(by - ay) / len) * L[0] + ((bx - ax) / len) * L[1]);
      const glint = Math.pow(facing, 3);
      const near = nearAt(ax, ay);
      const lw = Math.max(0.4, w0 * (1 - 0.6 * (i / total)) * (1 + 0.7 * near));
      trace(pts, i, end);
      gctx.strokeStyle = `rgba(34,42,58,${Math.min(0.95, 0.22 + 0.5 * near + (1 - glint) * 0.2)})`;
      gctx.lineWidth = lw;
      gctx.stroke();
      if (glint > 0.25) {
        trace(pts, i, end, -0.5 * u, -0.6 * u);
        gctx.strokeStyle = `rgba(255,255,255,${Math.min(0.9, glint * 0.85)})`;
        gctx.lineWidth = lw * 0.7;
        gctx.stroke();
      }
    }
  }

  // Crushed glass in the crater: grey grit, dark pits and a few bright flecks.
  for (let i = 0; i < 160; i++) {
    const d = Math.pow(rand(), 1.4) * crushR * 1.25;
    const t = rand() * Math.PI * 2;
    const x = impact[0] + Math.cos(t) * d;
    const y = impact[1] + Math.sin(t) * d;
    const sz = (0.6 + rand() * 2.6) * u;
    const roll = rand();
    gctx.fillStyle =
      roll < 0.25
        ? `rgba(15,18,26,${0.4 + rand() * 0.45})`
        : roll < 0.8
          ? `rgba(110,120,138,${0.25 + rand() * 0.45})`
          : `rgba(255,255,255,${0.5 + rand() * 0.5})`;
    gctx.beginPath();
    gctx.moveTo(x + (rand() - 0.5) * sz * 2, y + (rand() - 0.5) * sz * 2);
    gctx.lineTo(x + (rand() - 0.5) * sz * 2, y + (rand() - 0.5) * sz * 2);
    gctx.lineTo(x + (rand() - 0.5) * sz * 2, y + (rand() - 0.5) * sz * 2);
    gctx.closePath();
    gctx.fill();
  }

  return { key, display, glass, impact, u, scale, lines };
}

// ---------- flicker ----------
//
// A damaged panel doesn't dim smoothly; it misbehaves in fits. Long calm stretches,
// then agitated spells of short bursts in which the backlight stutters, scanline bands
// near the damage drop out or fill with garbage, and the stuck columns blink.
//
// Photosensitivity limits (WCAG 2.3.1), which this must never cross:
//  - Whole-screen brightness moves under 10% *luminance* (≈4% of pixel value, since
//    pixel values are gamma-encoded), so it never counts as a flash at any rate.
//  - Strong changes are confined to thin bands and lines whose combined height stays
//    well under the flash-area threshold (~25% of a 10° visual field).

const LINE_COLORS = ["#16c95a", "#e01fb8", "#2b6dff", "#17191e"];

interface FlickerFrame {
  dim: number; // whole-screen backlight dip, as an overlay alpha (kept ≤ ~0.04)
  burst: boolean; // inside a glitch burst
  seed: number; // re-rolls ~20×/s during a burst, so its bands jump around
}

function flickerFrame(t: number): FlickerFrame {
  // Agitated spells (≈40% of 4-second windows) burst far more often than calm ones.
  const agitated = mulberry32(Math.floor(t / 4) * 92821 + 7)() < 0.4;
  const SLOT = 0.5;
  const slot = Math.floor(t / SLOT);
  const r = mulberry32(slot * 7919 + 17);
  const happens = r() < (agitated ? 0.6 : 0.14);
  const start = slot * SLOT + r() * 0.3;
  const dur = 0.08 + r() * 0.27;
  const depth = 0.012 + r() * 0.02;
  const rate = 9 + r() * 10; // stutter frequency, Hz
  const burst = happens && t >= start && t < start + dur;
  let dim = 0.003 * Math.sin(t * 41) * Math.sin(t * 9.3);
  if (burst) {
    // Stutter: the backlight drops in and out a few times rather than one smooth dip.
    const on = Math.sin((t - start) * rate * Math.PI * 2) > 0;
    dim += depth * (on ? 1 : 0.15);
  }
  return { dim, burst, seed: Math.floor(t * 20) * 131 + slot };
}

function drawStuckLines(
  ctx: CanvasRenderingContext2D,
  L: Layers,
  width: number,
  height: number,
  f: FlickerFrame,
  t: number,
) {
  L.lines.forEach((line, i) => {
    // Mostly steady with a faint shimmer; blinks out during bursts, rarely on its own.
    const r = mulberry32(Math.floor(t * 15) * 31 + i * 977);
    let a = line.alpha * (0.88 + 0.12 * Math.sin(t * (7 + i * 3)));
    if (r() < (f.burst ? 0.45 : 0.02)) a *= r() < 0.6 ? 0 : 0.35;
    ctx.globalAlpha = a;
    ctx.fillStyle = line.color;
    ctx.fillRect(line.x, 0, line.w, height);
  });
  // Bursts also throw a cluster of extra single-pixel columns near the impact.
  if (f.burst) {
    const r = mulberry32(f.seed * 7 + 3);
    if (r() < 0.55) {
      const n = 2 + Math.floor(r() * 6);
      const cx = L.impact[0] + (r() - 0.5) * width * 0.3;
      const px = 1 / L.scale;
      for (let k = 0; k < n; k++) {
        const x = Math.round((cx + (r() - 0.5) * 60 * L.u) * L.scale) / L.scale;
        ctx.globalAlpha = 0.35 + r() * 0.55;
        ctx.fillStyle = LINE_COLORS[Math.floor(r() * LINE_COLORS.length)];
        ctx.fillRect(x, 0, px * (1 + Math.floor(r() * 2)), height);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function drawBands(
  ctx: CanvasRenderingContext2D,
  L: Layers,
  width: number,
  height: number,
  f: FlickerFrame,
  t: number,
) {
  // During a burst, 1–3 bands; otherwise a rare single-frame scanline glitch.
  const n = f.burst
    ? 1 + Math.floor(mulberry32(f.seed)() * 3)
    : mulberry32(Math.floor(t * 30) * 3571 + 11)() < 0.012
      ? 1
      : 0;
  if (!n) return;
  const r = mulberry32(f.seed * 13 + 5 + (f.burst ? 0 : Math.floor(t * 30)));
  // Total band height cap, in absolute CSS px so it doesn't grow on big screens: a
  // full-width band this short covers under ~20% of a 10° field, below WCAG's area limit.
  let budget = Math.min(48, 40 * L.u);
  for (let i = 0; i < n && budget > 1; i++) {
    const h = Math.min(budget, (1 + r() * r() * 26) * L.u);
    budget -= h;
    // Driver faults cluster around the damage.
    const y = Math.min(height - h, Math.max(0, L.impact[1] + (r() - 0.5) * height * 0.6));
    const kind = r();
    if (kind < 0.45) {
      // Dropout: the row's pixels lose drive and go dark.
      ctx.fillStyle = `rgba(14,16,22,${0.2 + r() * 0.45})`;
      ctx.fillRect(0, y, width, h);
    } else if (kind < 0.7) {
      // Wrong drive voltage: a tinted row.
      const tint = ["90,0,140", "0,120,90", "0,70,160"][Math.floor(r() * 3)];
      ctx.fillStyle = `rgba(${tint},${0.12 + r() * 0.16})`;
      ctx.fillRect(0, y, width, h);
    } else {
      // Corrupted data: a run of garbage pixels across part of the row.
      const x0 = r() * width * 0.5;
      const x1 = x0 + width * (0.25 + r() * 0.6);
      for (let x = x0; x < x1; ) {
        const w = (1 + r() * 9) * L.u;
        const v = Math.floor(r() * 200);
        ctx.fillStyle =
          r() < 0.15
            ? LINE_COLORS[Math.floor(r() * LINE_COLORS.length)]
            : `rgb(${v},${v},${Math.min(255, v + 15)})`;
        ctx.globalAlpha = 0.35 + r() * 0.5;
        ctx.fillRect(x, y, w, h);
        x += w;
      }
      ctx.globalAlpha = 1;
    }
  }
}

export function drawCracks({ ctx, width, height, t }: DrawArgs) {
  const BW = ctx.canvas.width;
  const BH = ctx.canvas.height;
  if (!width || !height || !BW || !BH) return;
  const key = `${BW}x${BH}@${width}x${height}`;
  if (cache?.key !== key) cache = buildLayers(width, height, BW, BH, key);
  const L = cache;

  // Only the panel flickers; the cracked glass in front of it is physical and steady.
  const f = flickerFrame(t);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(L.display, 0, 0);
  ctx.restore();
  drawStuckLines(ctx, L, width, height, f, t);
  drawBands(ctx, L, width, height, f, t);
  if (f.dim > 0) {
    ctx.fillStyle = `rgba(0,0,0,${f.dim})`;
    ctx.fillRect(0, 0, width, height);
  } else if (f.dim < 0) {
    ctx.fillStyle = `rgba(255,255,255,${-f.dim})`;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(L.glass, 0, 0);
  ctx.restore();
}
