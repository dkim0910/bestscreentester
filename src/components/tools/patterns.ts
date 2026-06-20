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
  } else {
    const channel = ["#ff0000", "#00ff00", "#0000ff"][frame - 1] ?? "#ffffff";
    g.addColorStop(0, "#000000");
    g.addColorStop(1, channel);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

export const COLOR_GRADIENT_LABELS = ["Spectrum", "Red", "Green", "Blue"];

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
