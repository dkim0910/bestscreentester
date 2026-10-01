// The classic Windows "3D Pipes" screensaver (95 / 98 / NT / 2000 / XP), rebuilt in
// WebGL so the tubes are real lit 3D geometry rather than shaded 2D strokes.
//
// What made the original recognisable, and what this reproduces:
//  - A straight-on perspective camera into a 3D lattice. Pipes run flat across the
//    screen horizontally and vertically, and shrink toward the middle as they head
//    into the distance.
//  - Shiny solid-colour tubes under a single light with a hard white specular
//    highlight — the fixed-function OpenGL look.
//  - Pipes grow smoothly a segment at a time, turn at right angles, and never enter an
//    occupied cell. Joints are balls or bent elbows ("Mixed" uses both), and very
//    rarely a ball joint is a Utah teapot.
//  - When the lattice fills up, the screen dissolves to black in random blocks and
//    starts over.

type V3 = [number, number, number];

export type JointStyle = "mixed" | "elbow" | "ball";

export interface PipesOptions {
  speed: number; // multiplier on BASE_SPEED
  joints: JointStyle;
}

const DIRS: V3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const PIPE_R = 0.18; // tube radius, in lattice cells
const BALL_R = 0.3; // ball joints are noticeably fatter than the tube
const BEND_R = 0.3; // elbow centreline radius
const SIDES = 18; // facets around a tube
const ELBOW_STEPS = 10; // facets along an elbow's quarter turn
const GRID_Y = 10; // lattice nodes vertically; the horizontal count follows the aspect
const GRID_Z = 10;
const FOV_Y = (50 * Math.PI) / 180;
const BASE_SPEED = 7; // segments per second, per pipe
const MAX_PIPES = 3; // growing at once
const MAX_VERTS = 640_000; // static geometry capacity (~23 MB) before a forced restart
const FILL_LIMIT = 0.4; // fraction of lattice nodes taken before the dissolve
const DISSOLVE_TIME = 1.6; // seconds
const TEAPOT_ODDS = 1 / 350; // per ball joint
const STRAIGHT_BIAS = 0.55; // chance to keep going straight when possible
const FLOATS = 9; // per vertex: position, normal, colour

// Saturated colours, like the original's random material picks.
const COLORS: V3[] = [
  [0.92, 0.12, 0.1],
  [0.1, 0.78, 0.22],
  [0.16, 0.32, 0.95],
  [0.95, 0.83, 0.12],
  [0.1, 0.82, 0.9],
  [0.88, 0.16, 0.84],
  [0.86, 0.86, 0.86],
  [1.0, 0.5, 0.08],
];

// ---------- small vector helpers ----------

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** Two unit vectors perpendicular to d and to each other. */
function basis(d: V3): [V3, V3] {
  const up: V3 = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = norm(cross(d, up));
  return [u, cross(d, u)];
}

const LIGHT = norm([-0.45, 0.62, 0.85]);

// ---------- geometry ----------

class VertexList {
  data = new Float32Array(4096 * FLOATS);
  n = 0;

  push(p: V3, nr: V3, c: V3) {
    if ((this.n + 1) * FLOATS > this.data.length) {
      const next = new Float32Array(this.data.length * 2);
      next.set(this.data);
      this.data = next;
    }
    const o = this.n * FLOATS;
    const d = this.data;
    d[o] = p[0];
    d[o + 1] = p[1];
    d[o + 2] = p[2];
    d[o + 3] = nr[0];
    d[o + 4] = nr[1];
    d[o + 5] = nr[2];
    d[o + 6] = c[0];
    d[o + 7] = c[1];
    d[o + 8] = c[2];
    this.n++;
  }

  /** Quad as two triangles: corners in order around the edge. */
  quad(p: V3[], n: V3[], c: V3) {
    this.push(p[0], n[0], c);
    this.push(p[1], n[1], c);
    this.push(p[2], n[2], c);
    this.push(p[0], n[0], c);
    this.push(p[2], n[2], c);
    this.push(p[3], n[3], c);
  }
}

/** Straight tube from a to b, optionally with a flat cap at b (the growing tip). */
function cylinder(out: VertexList, a: V3, b: V3, r: number, c: V3, capEnd = false) {
  const d = norm(sub(b, a));
  const [u, v] = basis(d);
  for (let i = 0; i < SIDES; i++) {
    const a0 = (i / SIDES) * Math.PI * 2;
    const a1 = ((i + 1) / SIDES) * Math.PI * 2;
    const n0 = add(mul(u, Math.cos(a0)), mul(v, Math.sin(a0)));
    const n1 = add(mul(u, Math.cos(a1)), mul(v, Math.sin(a1)));
    out.quad(
      [add(a, mul(n0, r)), add(b, mul(n0, r)), add(b, mul(n1, r)), add(a, mul(n1, r))],
      [n0, n0, n1, n1],
      c,
    );
    if (capEnd) {
      out.push(b, d, c);
      out.push(add(b, mul(n0, r)), d, c);
      out.push(add(b, mul(n1, r)), d, c);
    }
  }
}

function sphere(out: VertexList, center: V3, r: number, c: V3) {
  const LAT = 12;
  const LON = SIDES;
  const at = (i: number, j: number): V3 => {
    const th = (i / LAT) * Math.PI;
    const ph = (j / LON) * Math.PI * 2;
    return [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)];
  };
  for (let i = 0; i < LAT; i++) {
    for (let j = 0; j < LON; j++) {
      const n = [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)];
      out.quad(
        n.map((k) => add(center, mul(k, r))),
        n,
        c,
      );
    }
  }
}

/**
 * Quarter-torus elbow at node B, turning from travel direction d1 into d2. It joins
 * the incoming tube ending at B - d1·BEND_R to the outgoing one starting at
 * B + d2·BEND_R.
 */
function elbow(out: VertexList, B: V3, d1: V3, d2: V3, c: V3) {
  const O = add(sub(B, mul(d1, BEND_R)), mul(d2, BEND_R)); // bend centre
  const bn = cross(d1, d2);
  const ring = (k: number, i: number): [V3, V3] => {
    const th = (k / ELBOW_STEPS) * (Math.PI / 2);
    const ph = (i / SIDES) * Math.PI * 2;
    const radial = add(mul(d2, -Math.cos(th)), mul(d1, Math.sin(th)));
    const centre = add(O, mul(radial, BEND_R));
    const n = add(mul(radial, Math.cos(ph)), mul(bn, Math.sin(ph)));
    return [add(centre, mul(n, PIPE_R)), n];
  };
  for (let k = 0; k < ELBOW_STEPS; k++) {
    for (let i = 0; i < SIDES; i++) {
      const q = [ring(k, i), ring(k + 1, i), ring(k + 1, i + 1), ring(k, i + 1)];
      out.quad(
        q.map((x) => x[0]),
        q.map((x) => x[1]),
        c,
      );
    }
  }
}

/** A tube along a polyline with per-point radius (teapot spout and handle). */
function tube(out: VertexList, path: V3[], radii: number[], c: V3, place: (p: V3) => V3, turn: (n: V3) => V3) {
  const frames: [V3, V3, V3][] = [];
  let u: V3 | null = null;
  for (let i = 0; i < path.length; i++) {
    const t = norm(sub(path[Math.min(path.length - 1, i + 1)], path[Math.max(0, i - 1)]));
    u = u ? norm(sub(u, mul(t, dot(u, t)))) : basis(t)[0];
    frames.push([t, u, cross(t, u)]);
  }
  const at = (i: number, j: number): [V3, V3] => {
    const [, fu, fv] = frames[i];
    const ph = (j / SIDES) * Math.PI * 2;
    const n = add(mul(fu, Math.cos(ph)), mul(fv, Math.sin(ph)));
    return [place(add(path[i], mul(n, radii[i]))), turn(n)];
  };
  for (let i = 0; i < path.length - 1; i++) {
    for (let j = 0; j < SIDES; j++) {
      const q = [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)];
      out.quad(
        q.map((x) => x[0]),
        q.map((x) => x[1]),
        c,
      );
    }
  }
}

/**
 * The Utah teapot easter egg, built from simple pieces: a lathed body and lid, a knob,
 * a tapering spout and a looped handle. Drawn oversized, as in the original — at ball
 * size it just reads as a lumpy ball.
 */
function teapot(out: VertexList, center: V3, scale: number, yaw: number, c: V3) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const turn = (p: V3): V3 => [p[0] * cy - p[2] * sy, p[1], p[0] * sy + p[2] * cy];
  const place = (p: V3): V3 => add(center, mul(turn(p), scale));

  // Body + lid, lathed around Y from a (radius, height) profile.
  const prof: [number, number][] = [
    [0, -0.5],
    [0.5, -0.5],
    [0.72, -0.36],
    [0.8, -0.1],
    [0.75, 0.15],
    [0.6, 0.32],
    [0.46, 0.38],
    [0.3, 0.44],
    [0, 0.47],
  ];
  const segN = prof.slice(0, -1).map(([r0, y0], i) => {
    const [r1, y1] = prof[i + 1];
    const l = Math.hypot(r1 - r0, y1 - y0) || 1;
    return [(y1 - y0) / l, -(r1 - r0) / l] as [number, number];
  });
  const vn = prof.map((_, i) => {
    const a = segN[Math.max(0, i - 1)];
    const b = segN[Math.min(segN.length - 1, i)];
    const l = Math.hypot(a[0] + b[0], a[1] + b[1]) || 1;
    return [(a[0] + b[0]) / l, (a[1] + b[1]) / l] as [number, number];
  });
  for (let i = 0; i < prof.length - 1; i++) {
    for (let j = 0; j < SIDES; j++) {
      const ph0 = (j / SIDES) * Math.PI * 2;
      const ph1 = ((j + 1) / SIDES) * Math.PI * 2;
      const pt = (k: number, ph: number): V3 => [prof[k][0] * Math.cos(ph), prof[k][1], prof[k][0] * Math.sin(ph)];
      const nm = (k: number, ph: number): V3 => turn([vn[k][0] * Math.cos(ph), vn[k][1], vn[k][0] * Math.sin(ph)]);
      out.quad(
        [place(pt(i, ph0)), place(pt(i + 1, ph0)), place(pt(i + 1, ph1)), place(pt(i, ph1))],
        [nm(i, ph0), nm(i + 1, ph0), nm(i + 1, ph1), nm(i, ph1)],
        c,
      );
    }
  }
  sphere(out, place([0, 0.56, 0]), 0.11 * scale, c); // knob
  tube(
    out,
    [
      [0.62, -0.18, 0],
      [0.92, -0.02, 0],
      [1.08, 0.22, 0],
      [1.2, 0.38, 0],
    ],
    [0.2, 0.15, 0.12, 0.11],
    c,
    place,
    turn,
  );
  const handle: V3[] = [];
  for (let k = 0; k <= 10; k++) {
    const a = -1.3 + (k / 10) * 2.6;
    handle.push([-0.68 - 0.32 * Math.cos(a), 0.3 * Math.sin(a), 0]);
  }
  tube(out, handle, handle.map(() => 0.09), c, place, turn);
}

// ---------- WebGL plumbing ----------

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec3 aCol;
uniform mat4 uVP;
varying vec3 vPos;
varying vec3 vNor;
varying vec3 vCol;
void main() {
  vPos = aPos;
  vNor = aNor;
  vCol = aCol;
  gl_Position = uVP * vec4(aPos, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vPos;
varying vec3 vNor;
varying vec3 vCol;
uniform vec3 uEye;
uniform vec3 uLight;
uniform float uUnlit;
void main() {
  if (uUnlit > 0.5) { gl_FragColor = vec4(vCol, 1.0); return; }
  vec3 n = normalize(vNor);
  vec3 v = normalize(uEye - vPos);
  if (dot(n, v) < 0.0) n = -n;
  float diff = max(dot(n, uLight), 0.0);
  vec3 h = normalize(uLight + v);
  float spec = pow(max(dot(n, h), 0.0), 42.0);
  vec3 c = vCol * (0.16 + 0.84 * diff) + vec3(0.8) * spec;
  gl_FragColor = vec4(c, 1.0);
}`;

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  // Column-major.
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

const IDENTITY = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

interface Pipe {
  color: V3;
  joints: "elbow" | "ball";
  node: V3; // lattice node the current segment starts from
  dir: number; // DIRS index of the current segment
  next: number | null; // direction after the segment's end node; null = the pipe ends there
  t: number; // growth along the current segment, 0..1
  startOff: number; // tube starts this far past `node` (after an elbow)
}

export class PipesRenderer {
  private gl: WebGLRenderingContext;
  private prog!: WebGLProgram;
  private staticBuf!: WebGLBuffer;
  private dynBuf!: WebGLBuffer;
  private loc!: { pos: number; nor: number; col: number; vp: WebGLUniformLocation | null; eye: WebGLUniformLocation | null; light: WebGLUniformLocation | null; unlit: WebGLUniformLocation | null };

  private pending = new VertexList(); // committed this frame, not yet uploaded
  private dyn = new VertexList(); // growing tips, rebuilt every frame
  private staticCount = 0;

  private gx = 0;
  private gy = GRID_Y;
  private gz = GRID_Z;
  private occ = new Uint8Array(0);
  private taken = 0;
  private pipes: Pipe[] = [];
  private spawnClock = 0;
  private dissolve = -1; // seconds into the dissolve, or -1
  private order: number[] = [];

  private w = 0;
  private h = 0;
  private vp = IDENTITY;
  private eye: V3 = [0, 0, 1];
  private opts: PipesOptions = { speed: 1, joints: "mixed" };

  private constructor(
    private canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    private rand: () => number,
  ) {
    this.gl = gl;
    this.init();
  }

  /** Null when WebGL isn't available, so the caller can fall back. */
  static create(canvas: HTMLCanvasElement, rand: () => number = Math.random): PipesRenderer | null {
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null;
    return gl ? new PipesRenderer(canvas, gl, rand) : null;
  }

  private init() {
    const gl = this.gl;
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    this.prog = prog;
    this.loc = {
      pos: gl.getAttribLocation(prog, "aPos"),
      nor: gl.getAttribLocation(prog, "aNor"),
      col: gl.getAttribLocation(prog, "aCol"),
      vp: gl.getUniformLocation(prog, "uVP"),
      eye: gl.getUniformLocation(prog, "uEye"),
      light: gl.getUniformLocation(prog, "uLight"),
      unlit: gl.getUniformLocation(prog, "uUnlit"),
    };
    this.staticBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuf);
    gl.bufferData(gl.ARRAY_BUFFER, MAX_VERTS * FLOATS * 4, gl.DYNAMIC_DRAW);
    this.dynBuf = gl.createBuffer()!;
    gl.enable(gl.DEPTH_TEST);
  }

  setOptions(o: PipesOptions) {
    // A new joint style wipes the screen and starts over, so the change shows at once
    // instead of only on pipes that happen to start later.
    const restyled = o.joints !== this.opts.joints;
    this.opts = o;
    if (restyled && this.gx) this.restart();
  }

  /** Size in CSS pixels; restarts the scene when the lattice shape changes. */
  resize(cssW: number, cssH: number, dpr: number) {
    const W = Math.max(1, Math.round(cssW * dpr));
    const H = Math.max(1, Math.round(cssH * dpr));
    if (W === this.w && H === this.h) return;
    this.w = this.canvas.width = W;
    this.h = this.canvas.height = H;
    const aspect = W / H;
    this.gx = Math.max(4, Math.round(GRID_Y * aspect));
    const hx = (this.gx - 1) / 2;
    const hy = (this.gy - 1) / 2;
    // Fit a plane a little in front of the lattice's middle to the screen: the nearest
    // pipes spill off the edges and the far ones shrink toward the centre, as in the
    // original.
    const fit = Math.max(hy, hx / aspect) + 0.8;
    const camZ = fit / Math.tan(FOV_Y / 2) + ((this.gz - 1) / 2) * 0.4;
    this.eye = [0, 0, camZ];
    const P = perspective(FOV_Y, aspect, 0.1, camZ + this.gz + 4);
    // P × translate(0, 0, -camZ): only the last column changes.
    const vp = new Float32Array(P);
    for (let r = 0; r < 4; r++) vp[12 + r] = P[12 + r] - camZ * P[8 + r];
    this.vp = vp;
    this.restart();
  }

  private restart() {
    this.occ = new Uint8Array(this.gx * this.gy * this.gz);
    this.taken = 0;
    this.pipes = [];
    this.staticCount = 0;
    this.pending.n = 0;
    this.spawnClock = 0;
    this.dissolve = -1;
  }

  private idx(p: V3) {
    return p[0] + this.gx * (p[1] + this.gy * p[2]);
  }
  private free(p: V3) {
    return (
      p[0] >= 0 && p[0] < this.gx && p[1] >= 0 && p[1] < this.gy && p[2] >= 0 && p[2] < this.gz && !this.occ[this.idx(p)]
    );
  }
  private take(p: V3) {
    this.occ[this.idx(p)] = 1;
    this.taken++;
  }
  private world(p: V3): V3 {
    return [p[0] - (this.gx - 1) / 2, p[1] - (this.gy - 1) / 2, p[2] - (this.gz - 1) / 2];
  }

  /** Direction out of node `at` (arriving along `dir`), reserving the target node. */
  private pickNext(at: V3, dir: number): number | null {
    const ahead = add(at, DIRS[dir]);
    if (this.free(ahead) && this.rand() < STRAIGHT_BIAS) {
      this.take(ahead);
      return dir;
    }
    const options = DIRS.map((_, d) => d).filter((d) => d !== (dir ^ 1) && this.free(add(at, DIRS[d])));
    if (!options.length) return null;
    const d = options[Math.floor(this.rand() * options.length)];
    this.take(add(at, DIRS[d]));
    return d;
  }

  private spawn(): boolean {
    for (let tries = 0; tries < 80; tries++) {
      const node: V3 = [
        Math.floor(this.rand() * this.gx),
        Math.floor(this.rand() * this.gy),
        Math.floor(this.rand() * this.gz),
      ];
      if (!this.free(node)) continue;
      const dirs = DIRS.map((_, d) => d).filter((d) => this.free(add(node, DIRS[d])));
      if (!dirs.length) continue;
      this.take(node);
      const dir = dirs[Math.floor(this.rand() * dirs.length)];
      this.take(add(node, DIRS[dir]));
      const style = this.opts.joints;
      const joints = style === "mixed" ? (this.rand() < 0.5 ? "elbow" : "ball") : style;
      const color = COLORS[Math.floor(this.rand() * COLORS.length)];
      // A new pipe starts from a rounded cap (ball pipes: a full ball joint).
      sphere(this.pending, this.world(node), joints === "ball" ? BALL_R : PIPE_R, color);
      this.pipes.push({ color, joints, node, dir, next: this.pickNext(add(node, DIRS[dir]), dir), t: 0, startOff: 0 });
      return true;
    }
    return false;
  }

  private beginDissolve() {
    if (this.dissolve >= 0) return;
    this.dissolve = 0;
    const tile = this.tileSize();
    const n = Math.ceil(this.w / tile) * Math.ceil(this.h / tile);
    this.order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(this.rand() * (i + 1));
      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
    }
  }

  private tileSize() {
    return Math.max(6, Math.round(Math.min(this.w, this.h) / 36));
  }

  private endOffset(p: Pipe) {
    return p.next !== null && p.next !== p.dir && p.joints === "elbow" ? BEND_R : 0;
  }

  /** Advance the simulation by dt seconds. */
  step(dt: number) {
    if (!this.gx) return;
    if (this.dissolve >= 0) {
      this.dissolve += dt;
      if (this.dissolve >= DISSOLVE_TIME) this.restart();
      return;
    }
    this.spawnClock -= dt;
    if (this.pipes.length < MAX_PIPES && this.spawnClock <= 0) {
      if (!this.spawn() && !this.pipes.length) this.beginDissolve();
      this.spawnClock = 0.4 + this.rand() * 0.9;
    }
    const speed = BASE_SPEED * Math.max(0.05, this.opts.speed);
    for (const p of this.pipes.slice()) {
      p.t += dt * speed;
      while (p.t >= 1) {
        p.t -= 1;
        if (!this.completeSegment(p)) {
          this.pipes.splice(this.pipes.indexOf(p), 1);
          break;
        }
      }
    }
    if (this.taken / this.occ.length > FILL_LIMIT || this.staticCount + this.pending.n > MAX_VERTS * 0.95) {
      this.beginDissolve();
    }
  }

  /** Commit the finished segment plus whatever sits at its end. False = pipe ended. */
  private completeSegment(p: Pipe): boolean {
    const d = DIRS[p.dir];
    const A = this.world(p.node);
    const endNode = add(p.node, d);
    const B = this.world(endNode);
    const endOff = this.endOffset(p);
    cylinder(this.pending, add(A, mul(d, p.startOff)), sub(B, mul(d, endOff)), PIPE_R, p.color);
    if (p.next === null) {
      sphere(this.pending, B, p.joints === "ball" ? BALL_R : PIPE_R, p.color); // end cap
      return false;
    }
    const turned = p.next !== p.dir;
    if (turned) {
      if (p.joints === "elbow") elbow(this.pending, B, d, DIRS[p.next], p.color);
      else if (this.rand() < TEAPOT_ODDS) teapot(this.pending, B, 0.66, this.rand() * Math.PI * 2, p.color);
      else sphere(this.pending, B, BALL_R, p.color);
    }
    p.node = endNode;
    p.dir = p.next;
    p.startOff = turned && p.joints === "elbow" ? BEND_R : 0;
    p.next = this.pickNext(add(endNode, DIRS[p.dir]), p.dir);
    return true;
  }

  render() {
    const gl = this.gl;
    if (!this.w || gl.isContextLost()) return;
    const L = this.loc;
    const stride = FLOATS * 4;

    if (this.pending.n) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuf);
      const room = MAX_VERTS - this.staticCount;
      const n = Math.min(room, this.pending.n);
      if (n > 0) {
        gl.bufferSubData(gl.ARRAY_BUFFER, this.staticCount * stride, this.pending.data.subarray(0, n * FLOATS));
        this.staticCount += n;
      }
      this.pending.n = 0;
    }

    gl.viewport(0, 0, this.w, this.h);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(L.vp, false, this.vp);
    gl.uniform3fv(L.eye, this.eye);
    gl.uniform3fv(L.light, LIGHT);
    gl.uniform1f(L.unlit, 0);

    const draw = (buf: WebGLBuffer, count: number) => {
      if (!count) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(L.pos);
      gl.enableVertexAttribArray(L.nor);
      gl.enableVertexAttribArray(L.col);
      gl.vertexAttribPointer(L.pos, 3, gl.FLOAT, false, stride, 0);
      gl.vertexAttribPointer(L.nor, 3, gl.FLOAT, false, stride, 12);
      gl.vertexAttribPointer(L.col, 3, gl.FLOAT, false, stride, 24);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    };
    draw(this.staticBuf, this.staticCount);

    // The growing tips: a tube from the segment start out to the current length,
    // capped flat so the open end never shows.
    this.dyn.n = 0;
    for (const p of this.pipes) {
      if (p.t <= 0) continue;
      const d = DIRS[p.dir];
      const A = this.world(p.node);
      const len = 1 - p.startOff - this.endOffset(p);
      const a = add(A, mul(d, p.startOff));
      cylinder(this.dyn, a, add(a, mul(d, Math.max(0.001, len * p.t))), PIPE_R, p.color, true);
    }
    if (this.dyn.n) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.dyn.data.subarray(0, this.dyn.n * FLOATS), gl.STREAM_DRAW);
      draw(this.dynBuf, this.dyn.n);
    }

    // The dissolve: black blocks in random order until the screen is gone.
    if (this.dissolve >= 0) {
      const tile = this.tileSize();
      const cols = Math.ceil(this.w / tile);
      const k = Math.min(this.order.length, Math.floor((this.dissolve / DISSOLVE_TIME) * this.order.length));
      this.dyn.n = 0;
      const black: V3 = [0, 0, 0];
      const toClip = (x: number, y: number): V3 => [(x / this.w) * 2 - 1, 1 - (y / this.h) * 2, 0];
      for (let i = 0; i < k; i++) {
        const t = this.order[i];
        const x = (t % cols) * tile;
        const y = Math.floor(t / cols) * tile;
        this.dyn.quad([toClip(x, y), toClip(x + tile, y), toClip(x + tile, y + tile), toClip(x, y + tile)], [black, black, black, black], black);
      }
      if (this.dyn.n) {
        gl.disable(gl.DEPTH_TEST);
        gl.uniformMatrix4fv(L.vp, false, IDENTITY);
        gl.uniform1f(L.unlit, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.dyn.data.subarray(0, this.dyn.n * FLOATS), gl.STREAM_DRAW);
        draw(this.dynBuf, this.dyn.n);
      }
    }
  }

  dispose() {
    const gl = this.gl;
    gl.deleteBuffer(this.staticBuf);
    gl.deleteBuffer(this.dynBuf);
    gl.deleteProgram(this.prog);
  }
}
