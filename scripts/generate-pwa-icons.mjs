#!/usr/bin/env node
// Writes the installable-app icons the web manifest (src/app/manifest.ts) points at:
//   public/icons/icon-192.png, icon-512.png   (purpose "any")
//   public/icons/maskable-512.png             (purpose "maskable": padded so Android's
//                                              circle or squircle mask can't clip it)
// Source: public/logo.png (512², light grey background). Its bottom-right corner has a
// small sparkle mark, painted over here with the background grey. Re-run after
// changing the logo.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const BG = { r: 236, g: 236, b: 236 };
mkdirSync("public/icons", { recursive: true });

const patch = await sharp({ create: { width: 40, height: 40, channels: 3, background: BG } }).png().toBuffer();
const clean = await sharp("public/logo.png").composite([{ input: patch, left: 464, top: 464 }]).png().toBuffer();

await sharp(clean).resize(512, 512).png({ palette: true }).toFile("public/icons/icon-512.png");
await sharp(clean).resize(192, 192).png({ palette: true }).toFile("public/icons/icon-192.png");
// Maskable: the artwork at 80% inside the same grey, well within the 80% safe circle.
const inner = await sharp(clean).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 3, background: BG } })
  .composite([{ input: inner, left: 51, top: 51 }])
  .png({ palette: true })
  .toFile("public/icons/maskable-512.png");
console.log("wrote public/icons/{icon-192,icon-512,maskable-512}.png");
