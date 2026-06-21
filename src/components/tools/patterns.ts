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

export function grayField({ ctx, width, height, frame }: DrawArgs) {
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
  for (let y = 0; y < height; y++) {
    ctx.fillStyle = (y & 1) === 0 ? "#ffffff" : "#000000";
    ctx.fillRect(0, y, width, 1);
  }
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
