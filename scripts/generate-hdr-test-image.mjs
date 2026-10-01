#!/usr/bin/env node
// Builds public/hdr/pq-brightness-steps.avif for the HDR Test: a real HDR image
// (BT.2020 primaries, PQ / SMPTE ST 2084 transfer, 10-bit) with grey patches at known
// brightness levels and a 0–2,000 nit ramp underneath.
//
// On an HDR screen in an HDR-capable browser the patches above "SDR white" (203 nits,
// per ITU-R BT.2408) keep getting brighter up to the screen's peak. On an SDR screen
// they clip or tone-map to the same white — which is the whole test.
//
// The patch positions are mirrored in HdrTool.tsx (labels). Needs ffmpeg with libsvtav1.
// Usage: node scripts/generate-hdr-test-image.mjs
import { writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export const W = 1800;
export const H = 600;
export const NITS = [100, 203, 400, 600, 1000, 1600];
const PATCH_W = 280;
const GAP = 20;
const MARGIN = (W - (NITS.length * PATCH_W + (NITS.length - 1) * GAP)) / 2;
const PATCH_TOP = 40;
const PATCH_BOTTOM = 380;
const RAMP_TOP = 450;
const RAMP_BOTTOM = 560;
const RAMP_MAX = 2000;

// SMPTE ST 2084 inverse EOTF: absolute luminance (cd/m²) -> PQ signal 0..1.
function pq(nits) {
  const m1 = 2610 / 16384;
  const m2 = (2523 / 4096) * 128;
  const c1 = 3424 / 4096;
  const c2 = (2413 / 4096) * 32;
  const c3 = (2392 / 4096) * 32;
  const y = Math.pow(Math.max(0, nits) / 10000, m1);
  return Math.pow((c1 + c2 * y) / (1 + c3 * y), m2);
}
// Narrow-range 10-bit luma code for a neutral grey (chroma stays at 512).
const luma = (nits) => Math.round(64 + 876 * pq(nits));

function nitsAt(x, y) {
  if (y >= PATCH_TOP && y < PATCH_BOTTOM) {
    for (let i = 0; i < NITS.length; i++) {
      const x0 = MARGIN + i * (PATCH_W + GAP);
      if (x >= x0 && x < x0 + PATCH_W) return NITS[i];
    }
  }
  if (y >= RAMP_TOP && y < RAMP_BOTTOM && x >= MARGIN && x < W - MARGIN) {
    // Even steps in PQ signal, so the ramp spends as much width on shadows as highlights.
    const f = (x - MARGIN) / (W - 2 * MARGIN);
    const top = pq(RAMP_MAX);
    const m1 = 2610 / 16384;
    const m2 = (2523 / 4096) * 128;
    const c1 = 3424 / 4096;
    const c2 = (2413 / 4096) * 32;
    const c3 = (2392 / 4096) * 32;
    const e = Math.pow(f * top, 1 / m2);
    return 10000 * Math.pow(Math.max(e - c1, 0) / (c2 - c3 * e), 1 / m1);
  }
  return 0;
}

const yPlane = new Uint16Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) yPlane[y * W + x] = luma(nitsAt(x, y));
const cPlane = new Uint16Array((W / 2) * (H / 2)).fill(512);

const raw = join(tmpdir(), `hdr-steps-${process.pid}.yuv`);
writeFileSync(raw, Buffer.concat([Buffer.from(yPlane.buffer), Buffer.from(cPlane.buffer), Buffer.from(cPlane.buffer)]));
mkdirSync("public/hdr", { recursive: true });
const out = "public/hdr/pq-brightness-steps.avif";
const r = spawnSync(
  "ffmpeg",
  [
    "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "yuv420p10le", "-s", `${W}x${H}`, "-i", raw,
    "-frames:v", "1",
    "-c:v", "libsvtav1", "-preset", "6", "-crf", "8", "-pix_fmt", "yuv420p10le",
    // ffmpeg's colour flags alone left primaries/transfer "unspecified" in the output,
    // which browsers would treat as SDR — so also set them in the AV1 sequence header
    // (9 = BT.2020, 16 = SMPTE ST 2084 / PQ, 9 = BT.2020 non-constant luminance).
    "-svtav1-params", "color-primaries=9:transfer-characteristics=16:matrix-coefficients=9:color-range=0",
    "-color_primaries", "bt2020", "-color_trc", "smpte2084", "-colorspace", "bt2020nc", "-color_range", "tv",
    "-f", "avif", out,
  ],
  { stdio: "inherit" },
);
rmSync(raw, { force: true });
if (r.status !== 0) process.exit(r.status ?? 1);

// The AVIF muxer still writes "unspecified" primaries/transfer into the container's
// colr (nclx) box, and browsers read that box ahead of the AV1 header. It's fixed-size,
// so patch the four bytes in place: primaries=9 (BT.2020), transfer=16 (PQ).
const file = readFileSync(out);
const at = file.indexOf("colrnclx");
if (at < 0) throw new Error("no colr nclx box in output");
file.writeUInt16BE(9, at + 8);
file.writeUInt16BE(16, at + 10);
file.writeUInt16BE(9, at + 12);
file[at + 14] = 0; // narrow ("studio") range, matching the encoded data
writeFileSync(out, file);
console.log(`wrote ${out} (${W}×${H}, patches at ${NITS.join(", ")} nits; margin ${MARGIN}px)`);
