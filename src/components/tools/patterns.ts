// Reusable canvas draw helpers for pattern-based tools.
import type { DrawArgs } from "./PatternCanvas";

export function smoothGreyscale({ ctx, width, height }: DrawArgs) {
  const g = ctx.createLinearGradient(0, 0, width, 0);
  g.addColorStop(0, "#000000");
  g.addColorStop(1, "#ffffff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

export function steppedGreyscale({ ctx, width, height }: DrawArgs, steps = 32) {
  const stepW = width / steps;
  for (let i = 0; i < steps; i++) {
    const v = Math.round((i / (steps - 1)) * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(i * stepW, 0, stepW + 1, height);
  }
}

const HUE_STOPS = ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ff0000"];

export function colorGradient({ ctx, width, height, frame }: DrawArgs) {
  const g = ctx.createLinearGradient(0, 0, width, 0);
  if (frame === 0) {
    HUE_STOPS.forEach((c, i) => g.addColorStop(i / (HUE_STOPS.length - 1), c));
  } else if (frame <= 3) {
    const channel = ["#ff0000", "#00ff00", "#0000ff"][frame - 1];
    g.addColorStop(0, "#000000");
    g.addColorStop(1, channel);
  } else if (frame === 4) {
    // White: black → white luminance ramp.
    g.addColorStop(0, "#000000");
    g.addColorStop(1, "#ffffff");
  } else if (frame === 5) {
    // Gray: narrow mid-gray band to expose banding in the shadows-to-midtones.
    g.addColorStop(0, "#202020");
    g.addColorStop(1, "#d0d0d0");
  } else {
    // Black: white → black ramp, ending in pure black.
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#000000");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

export const COLOR_GRADIENT_LABELS = ["Spectrum", "Red", "Green", "Blue", "White", "Gray", "Black"];

export const UNIFORMITY_LABELS = ["Gray field", "9-zone grid", "Panning gray (DSE)"];

export function grayField({ ctx, width, height, frame, t }: DrawArgs) {
  if (frame === 2) {
    // Dirty screen effect: blotches and vertical bands are stuck to the panel, so they
    // only become obvious when the eye follows something moving across them — as when a
    // camera pans across a pitch or an ice rink. Faint bands drift right; the panel's
    // own blotches stay still against them.
    for (let x = 0; x < width; x += 4) {
      const v = Math.round(96 + 3 * Math.sin(((x - t * 90) / Math.max(1, width)) * Math.PI * 6));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, 0, 4, height);
    }
    return;
  }
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, width, height);
  if (frame === 1) {
    // 9-zone grid overlay
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((width / 3) * i, 0);
      ctx.lineTo((width / 3) * i, height);
      ctx.moveTo(0, (height / 3) * i);
      ctx.lineTo(width, (height / 3) * i);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    let n = 1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillText(
          String(n++),
          (width / 3) * c + width / 6,
          (height / 3) * r + height / 6,
        );
      }
    }
  }
}

// ----- Burn-in (OLED retention) -----
export const BURNIN_LABELS = ["White", "Grey 50%", "Red", "Green", "Blue", "Checkerboard"];
export function burnIn({ ctx, width, height, frame }: DrawArgs) {
  const solids = ["#ffffff", "#808080", "#ff0000", "#00ff00", "#0000ff"];
  if (frame < solids.length) {
    ctx.fillStyle = solids[frame];
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const cell = 40;
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      ctx.fillStyle = ((x / cell + y / cell) & 1) === 0 ? "#ffffff" : "#000000";
      ctx.fillRect(x, y, cell, cell);
    }
  }
}

// ----- Contrast (checkerboard at increasing density) -----
export const CONTRAST_LABELS = ["4 × 4", "8 × 8", "16 × 16", "32 × 32"];
export function contrast({ ctx, width, height, frame }: DrawArgs) {
  const cols = [4, 8, 16, 32][frame] ?? 8;
  const size = width / cols;
  const rows = Math.ceil(height / size);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = ((r + c) & 1) === 0 ? "#ffffff" : "#000000";
      ctx.fillRect(c * size, r * size, size + 1, size + 1);
    }
  }
}

// ----- Black level (near-black steps) -----
export function blackLevel({ ctx, width, height }: DrawArgs) {
  const vals = [0, 2, 4, 6, 8, 12, 16, 24, 32, 48];
  const w = width / vals.length;
  ctx.textAlign = "center";
  ctx.font = "12px sans-serif";
  vals.forEach((v, i) => {
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(i * w, 0, w + 1, height);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(String(v), i * w + w / 2, height - 16);
  });
}

// ----- Viewing angle (gray steps + color bars) -----
export function viewingAngle({ ctx, width, height }: DrawArgs) {
  const steps = 8;
  const sw = width / steps;
  for (let i = 0; i < steps; i++) {
    const v = Math.round((i / (steps - 1)) * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(i * sw, 0, sw + 1, height / 2);
  }
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#404040"];
  const cw = width / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * cw, height / 2, cw + 1, height / 2);
  });
}

// ----- Gamma (1px stripes ≈ 50% vs reference grey patches) -----
export function gamma({ ctx, width, height }: DrawArgs) {
  // The stripes must alternate on *physical* pixels to average exactly 50% light. Drawn
  // in CSS pixels they land on half-pixels at 125%/150% scaling and blend into grey
  // rows, which shifts the average and makes the wrong patch match. So draw them in
  // backing-store pixels (pair with nativeResolution so that is the device grid).
  const { canvas } = ctx;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let y = 0; y < canvas.height; y++) {
    ctx.fillStyle = (y & 1) === 0 ? "#ffffff" : "#000000";
    ctx.fillRect(0, y, canvas.width, 1);
  }
  ctx.restore();
  // 255 * 0.5^(1/gamma) for γ = 1.8 / 2.0 / 2.2 / 2.4
  const patches = [
    { g: "1.8", v: 174 },
    { g: "2.0", v: 180 },
    { g: "2.2", v: 186 },
    { g: "2.4", v: 191 },
  ];
  const pw = width / patches.length;
  const y = height * 0.33;
  const h = height * 0.34;
  ctx.textAlign = "center";
  ctx.font = "bold 16px sans-serif";
  patches.forEach((p, i) => {
    const x = i * pw + pw * 0.2;
    const w = pw * 0.6;
    ctx.fillStyle = `rgb(${p.v},${p.v},${p.v})`;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ff2d6f";
    ctx.fillText(`γ ${p.g}`, i * pw + pw / 2, y + h + 28);
  });
}

// Screen tearing lives in its own component (ScreenTearingTool) so it can carry
// a speed slider — see src/components/tools/ScreenTearingTool.tsx.

/** Run a callback with the transform reset to backing-store (physical) pixels. */
function inDevicePixels(ctx: CanvasRenderingContext2D, fn: (W: number, H: number, k: number) => void) {
  const k = ctx.getTransform().a || 1; // device pixels per CSS pixel
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  fn(ctx.canvas.width, ctx.canvas.height, k);
  ctx.restore();
}

// ----- Overscan, aspect ratio and geometry (TVs, projectors) -----
export const OVERSCAN_LABELS = ["Overscan border", "Aspect ratio", "Geometry grid"];

export function overscan({ ctx, width, height, frame }: DrawArgs) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const md = Math.min(width, height);

  if (frame === 0) {
    // Nested outlines at 0–5% in from each edge. Whatever percentage you can still see
    // all the way round is how much the TV is cropping (the first one fully visible).
    const steps = [0, 1, 2, 3, 4, 5];
    const colors = ["#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
    const fs = Math.max(11, md * 0.02);
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    // The frames sit only ~1% apart, so labels are staggered along each edge (left and
    // top), each one placed just inside its own frame line.
    steps.forEach((pct, i) => {
      const ix = (width * pct) / 100;
      const iy = (height * pct) / 100;
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 2;
      ctx.strokeRect(ix + 1, iy + 1, width - ix * 2 - 2, height - iy * 2 - 2);
      ctx.fillStyle = colors[i];
      ctx.textAlign = "left";
      ctx.fillText(`${pct}%`, ix + 5, height * 0.32 + i * fs * 1.6);
      ctx.textAlign = "center";
      ctx.fillText(`${pct}%`, width * 0.3 + i * fs * 3, iy + fs * 0.75);
    });
    // Corner arrows: all four tips should touch the very corners of the screen.
    ctx.fillStyle = "#fff";
    const a = md * 0.05;
    for (const [cx, cy, sx, sy] of [
      [0, 0, 1, 1],
      [width, 0, -1, 1],
      [0, height, 1, -1],
      [width, height, -1, -1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + sx * a, cy);
      ctx.lineTo(cx, cy + sy * a);
      ctx.closePath();
      ctx.fill();
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `600 ${Math.max(14, md * 0.035)}px system-ui, sans-serif`;
    ctx.fillText("The outermost frame you can see all the way round = your overscan", width / 2, height / 2);
    return;
  }

  if (frame === 1) {
    // A perfect circle and square. Stretched or squashed means the picture isn't
    // being shown at its true aspect ratio (zoom / "wide" / stretch modes).
    const cx = width / 2;
    const cy = height / 2;
    const r = md * 0.4;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(2, md * 0.004);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    const sq = (r * 2) / Math.SQRT2;
    ctx.strokeRect(cx - sq / 2, cy - sq / 2, sq, sq);
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    // Small circles in the corners catch edge-only stretching ("smart" zoom modes).
    const cr = md * 0.09;
    for (const [x, y] of [
      [cr * 1.4, cr * 1.4],
      [width - cr * 1.4, cr * 1.4],
      [cr * 1.4, height - cr * 1.4],
      [width - cr * 1.4, height - cr * 1.4],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, cr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${Math.max(13, md * 0.028)}px system-ui, sans-serif`;
    // Above the circle: the bottom of the screen belongs to the control bar.
    ctx.fillText("Circles must be perfectly round, squares square", cx, Math.max(md * 0.04, cy - r - md * 0.045));
    return;
  }

  // Geometry grid: straight, evenly spaced lines reveal keystone, bowing and pincushion
  // on projectors and curved screens. Drawn on whole physical pixels so every line has
  // the same weight (CSS-pixel lines at fractional positions alternate bright and dim).
  inDevicePixels(ctx, (W, H, k) => {
    const lw = Math.max(1, Math.round(k));
    const n = 12;
    const cell = H / n;
    const cols = Math.max(1, Math.round(W / cell));
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let y = 0; y <= n; y++) ctx.fillRect(0, Math.min(H - lw, Math.round(y * cell)), W, lw);
    for (let x = 0; x <= cols; x++) ctx.fillRect(Math.min(W - lw, Math.round((x * W) / cols)), 0, lw, H);
    ctx.fillStyle = "#d6336c";
    ctx.fillRect(Math.round(W / 2 - lw), 0, lw * 2, H);
    ctx.fillRect(0, Math.round(H / 2 - lw), W, lw * 2);
  });
}

// ----- Sharpness & text clarity -----
export const SHARPNESS_LABELS = ["1-pixel lines", "Fine checkerboard", "Text clarity", "Sharpening halos"];

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.font = `600 ${size}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = ctx.measureText(text).width + size;
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(x - w / 2, y - size * 0.8, w, size * 1.6);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
}

export function sharpness({ ctx, width, height, frame }: DrawArgs) {
  const md = Math.min(width, height);
  const fs = Math.max(12, md * 0.028);

  if (frame === 0 || frame === 1) {
    // Physical-pixel patterns. At native resolution with no scaling they look crisp
    // and evenly striped; any resampling turns them into grey mush or moiré waves.
    inDevicePixels(ctx, (W, H) => {
      const hw = Math.floor(W / 2);
      const hh = Math.floor(H / 2);
      const quads: [number, number, number, number][] = [
        [0, 0, hw, hh],
        [hw, 0, W - hw, hh],
        [0, hh, hw, H - hh],
        [hw, hh, W - hw, H - hh],
      ];
      quads.forEach(([x0, y0, w, h], q) => {
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let on: boolean;
            if (frame === 0) {
              // 1px vertical, 1px horizontal, 2px vertical, 2px horizontal lines.
              const step = q < 2 ? 1 : 2;
              on = Math.floor((q % 2 === 0 ? x : y) / step) % 2 === 0;
            } else {
              // 1px checkerboard, 2px, 3px, and a 1px diagonal hatch.
              const step = q + 1;
              on =
                q === 3
                  ? (x + y) % 4 < 2
                  : (Math.floor(x / step) + Math.floor(y / step)) % 2 === 0;
            }
            const o = (y * w + x) * 4;
            const v = on ? 255 : 0;
            d[o] = d[o + 1] = d[o + 2] = v;
            d[o + 3] = 255;
          }
        }
        ctx.putImageData(img, x0, y0);
      });
    });
    const names =
      frame === 0
        ? ["1px vertical lines", "1px horizontal lines", "2px vertical lines", "2px horizontal lines"]
        : ["1px checkerboard", "2px checkerboard", "3px checkerboard", "Diagonal hatch"];
    label(ctx, names[0], width / 4, height / 4, fs);
    label(ctx, names[1], (width * 3) / 4, height / 4, fs);
    label(ctx, names[2], width / 4, (height * 3) / 4, fs);
    label(ctx, names[3], (width * 3) / 4, (height * 3) / 4, fs);
    return;
  }

  if (frame === 2) {
    // Text at small sizes: dark on light, light on dark, and colored text that shows
    // subpixel fringing or chroma subsampling (red/blue text smears on 4:2:0 signals).
    const sample = "The quick brown fox jumps over the lazy dog 0123456789";
    const sizes = [9, 10, 11, 12, 13, 14, 16, 18];
    const panels: [string, string, string][] = [
      ["#ffffff", "#000000", "Black on white"],
      ["#000000", "#ffffff", "White on black"],
      ["#000000", "#ff2a2a", "Red on black"],
      ["#1d3ed1", "#ffd23d", "Yellow on blue"],
    ];
    const ph = height / panels.length;
    panels.forEach(([bg, fg, name], i) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, i * ph, width, ph);
      ctx.fillStyle = fg;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      let y = i * ph + 8;
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.fillText(name, 12, y);
      y += 18;
      for (const sz of sizes) {
        if (y + sz > (i + 1) * ph - 4) break;
        ctx.font = `${sz}px system-ui, sans-serif`;
        ctx.fillText(`${sz}px  ${sample}`, 12, y);
        y += sz + 4;
      }
    });
    return;
  }

  // Sharpening halos: thin lines and rings on mid-grey. Edge enhancement draws a light
  // or dark outline alongside every edge — turn Sharpness down until they disappear.
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const x = width * (0.08 + i * 0.035);
    ctx.strokeStyle = i % 2 ? "#ffffff" : "#000000";
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, height * 0.15);
    ctx.lineTo(Math.round(x) + 0.5, height * 0.85);
    ctx.stroke();
  }
  for (let i = 1; i <= 5; i++) {
    ctx.strokeStyle = i % 2 ? "#000000" : "#ffffff";
    ctx.lineWidth = i <= 2 ? 1 : 2;
    ctx.beginPath();
    ctx.arc(cx + width * 0.12, cy, md * 0.07 * i, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#000";
  ctx.font = `600 ${fs * 1.4}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Look for light or dark outlines along every edge", cx + width * 0.12, height * 0.9);
}
