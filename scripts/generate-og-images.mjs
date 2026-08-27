#!/usr/bin/env node
// Generates a branded 1200x630 illustration per tool and per guide into
// public/og/{tools,guides}/<slug>.png. Each image shows a schematic mini-screen
// displaying that page's actual test pattern, in the site's dark theme.
// Deterministic: same inputs -> same pixels. Re-run after adding a tool/guide.
import { readFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const BG = "#0a0b0f", FG = "#e8eaed", CARD = "#14161c", ACCENT = "#d6336c";
const BORDER = "rgba(255,255,255,0.14)";
const FONT = "Helvetica, Arial, sans-serif";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- source parsing ----------
const toolsSrc = readFileSync("src/lib/tools.ts", "utf-8");
const guidesSrc = readFileSync("src/lib/guides.ts", "utf-8");
const CAT = { panel: "Panel & Backlight", color: "Color & Calibration", motion: "Motion & Timing", fun: "Fun & Utilities" };
const tools = [...toolsSrc.matchAll(/\n    slug: "([^"]+)",\n    name: "([^"]+)",\n    title: "([^"]+)",[\s\S]*?category: "([^"]+)"/g)]
  .map((m) => ({ slug: m[1], title: m[3], label: CAT[m[4]] }));
const guides = [...guidesSrc.matchAll(/\n    slug: "([^"]+)",\n    title: "([^"]+)",/g)]
  .map((m) => ({ slug: m[1], title: m[2], label: "Guide" }));
if (tools.length !== 20 || guides.length !== 36) throw new Error(`parse: ${tools.length} tools, ${guides.length} guides`);

// ---------- screen motifs ----------
// Each draws inside the screen viewport x,y,w,h and returns SVG.
const M = {
  pixels: (x, y, w, h) => { // solid field + one dead pixel, magnified callout
    const px = x + w * 0.62, py = y + h * 0.38;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1a56db"/>
      <rect x="${px}" y="${py}" width="5" height="5" fill="#000"/>
      <circle cx="${px + 2.5}" cy="${py + 2.5}" r="26" fill="none" stroke="${ACCENT}" stroke-width="3"/>
      <line x1="${px + 21}" y1="${py + 21}" x2="${px + 58}" y2="${py + 58}" stroke="${ACCENT}" stroke-width="3"/>`;
  },
  rgb: (x, y, w, h) => ["#e02424", "#0e9f6e", "#1a56db"].map((c, i) =>
    `<rect x="${x + (w / 3) * i}" y="${y}" width="${w / 3}" height="${h}" fill="${c}"/>`).join(""),
  black: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>
    <ellipse cx="${x + w * 0.3}" cy="${y + h * 0.25}" rx="${w * 0.32}" ry="${h * 0.16}" fill="rgba(255,255,255,0.05)"/>`,
  white: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f5f7"/>`,
  bleed: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>
    <ellipse cx="${x}" cy="${y + h}" rx="${w * 0.42}" ry="${h * 0.42}" fill="rgba(200,215,255,0.28)"/>
    <ellipse cx="${x + w}" cy="${y}" rx="${w * 0.3}" ry="${h * 0.32}" fill="rgba(200,215,255,0.18)"/>`,
  greysteps: (x, y, w, h) => Array.from({ length: 8 }, (_, i) => {
    const v = Math.round((i / 7) * 255);
    return `<rect x="${x + (w / 8) * i}" y="${y}" width="${w / 8}" height="${h}" fill="rgb(${v},${v},${v})"/>`;
  }).join(""),
  gradient: (x, y, w, h) => `<defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e02424"/><stop offset=".2" stop-color="#ff5a1f"/><stop offset=".4" stop-color="#faca15"/>
      <stop offset=".6" stop-color="#0e9f6e"/><stop offset=".8" stop-color="#1a56db"/><stop offset="1" stop-color="#7e3af2"/>
    </linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gr)"/>`,
  uniformity: (x, y, w, h) => `<defs><radialGradient id="un" cx=".5" cy=".5" r=".75">
      <stop offset="0" stop-color="#9ca3af"/><stop offset="1" stop-color="#4b5563"/></radialGradient></defs>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#un)"/>`,
  refresh: (x, y, w, h) => { // stroboscopic bars + arrow
    const bars = Array.from({ length: 6 }, (_, i) =>
      `<rect x="${x + w * 0.08 + i * w * 0.15}" y="${y + h * 0.28}" width="${w * 0.055}" height="${h * 0.44}" fill="rgba(232,234,237,${0.15 + i * 0.17})"/>`).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>${bars}
      <line x1="${x + w * 0.12}" y1="${y + h * 0.84}" x2="${x + w * 0.88}" y2="${y + h * 0.84}" stroke="${ACCENT}" stroke-width="3"/>
      <path d="M ${x + w * 0.88} ${y + h * 0.84} l -12 -7 v 14 z" fill="${ACCENT}"/>`;
  },
  ghost: (x, y, w, h) => [0.18, 0.36, 0.54].map((f, i) =>
    `<rect x="${x + w * f}" y="${y + h * 0.3}" width="${w * 0.16}" height="${h * 0.4}" rx="6" fill="rgba(214,51,108,${0.18 + i * 0.35})"/>`)
    .join("") .replace(/^/, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>`),
  bloom: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>
    <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${h * 0.3}" fill="rgba(244,245,247,0.14)"/>
    <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${h * 0.17}" fill="rgba(244,245,247,0.3)"/>
    <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${h * 0.07}" fill="#f4f5f7"/>`,
  crack: (x, y, w, h) => { const cx = x + w * 0.42, cy = y + h * 0.4;
    const rays = [[-1,-0.5],[1,-0.7],[1.3,0.4],[-1.2,0.8],[0.2,1],[-0.6,-1],[0.9,0.1],[-1.4,-0.1]]
      .map(([dx,dy]) => `<line x1="${cx}" y1="${cy}" x2="${cx + dx * w * 0.34}" y2="${cy + dy * h * 0.5}" stroke="rgba(232,234,237,0.75)" stroke-width="2.5"/>`).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>${rays}
      <circle cx="${cx}" cy="${cy}" r="7" fill="rgba(232,234,237,0.9)"/>`;
  },
  dvd: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>
    <path d="M ${x + w * 0.1} ${y + h * 0.8} L ${x + w * 0.45} ${y + h * 0.15} L ${x + w * 0.8} ${y + h * 0.7}" fill="none" stroke="rgba(232,234,237,0.25)" stroke-width="2" stroke-dasharray="6 8"/>
    <rect x="${x + w * 0.7}" y="${y + h * 0.58}" width="86" height="44" rx="10" fill="${ACCENT}"/>
    <text x="${x + w * 0.7 + 43}" y="${y + h * 0.58 + 29}" font-family="${FONT}" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">DVD</text>`,
  boot: (x, y, w, h) => { const cx = x + w / 2, cy = y + h * 0.42;
    const dots = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${cx + Math.cos(a) * 26}" cy="${cy + Math.sin(a) * 26}" r="5" fill="rgba(232,234,237,${0.15 + (i / 8) * 0.8})"/>`; }).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#04070d"/>${dots}
      <rect x="${cx - 60}" y="${y + h * 0.72}" width="120" height="6" rx="3" fill="rgba(232,234,237,0.2)"/>
      <rect x="${cx - 60}" y="${y + h * 0.72}" width="72" height="6" rx="3" fill="${ACCENT}"/>`;
  },
  burnin: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#6b7280"/>
    <rect x="${x + w * 0.06}" y="${y + h * 0.08}" width="${w * 0.88}" height="${h * 0.14}" rx="4" fill="rgba(0,0,0,0.16)"/>
    <rect x="${x + w * 0.3}" y="${y + h * 0.78}" width="${w * 0.4}" height="${h * 0.12}" rx="4" fill="rgba(0,0,0,0.16)"/>`,
  contrast: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w / 2}" height="${h}" fill="#000"/>
    <rect x="${x + w / 2}" y="${y}" width="${w / 2}" height="${h}" fill="#f4f5f7"/>
    <circle cx="${x + w * 0.25}" cy="${y + h / 2}" r="${h * 0.16}" fill="#f4f5f7"/>
    <circle cx="${x + w * 0.75}" cy="${y + h / 2}" r="${h * 0.16}" fill="#000"/>`,
  blacklevel: (x, y, w, h) => Array.from({ length: 6 }, (_, i) => {
    const v = 2 + i * 9;
    return `<rect x="${x + (w / 6) * i}" y="${y}" width="${w / 6}" height="${h}" fill="rgb(${v},${v},${v})"/>`;
  }).join(""),
  angle: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>
    <defs><linearGradient id="va" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9ca3af"/><stop offset="1" stop-color="#374151"/></linearGradient></defs>
    <polygon points="${x + w * 0.16},${y + h * 0.22} ${x + w * 0.84},${y + h * 0.08} ${x + w * 0.84},${y + h * 0.92} ${x + w * 0.16},${y + h * 0.78}" fill="url(#va)"/>`,
  gamma: (x, y, w, h) => { const stripes = Array.from({ length: 20 }, (_, i) =>
      `<rect x="${x + (w * 0.5 / 20) * i}" y="${y}" width="${w * 0.5 / 40}" height="${h}" fill="#fff"/>`).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>${stripes}
      <rect x="${x + w * 0.5}" y="${y}" width="${w * 0.5}" height="${h}" fill="#bcbcbc"/>`;
  },
  tear: (x, y, w, h) => `<defs><linearGradient id="tr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a56db"/><stop offset="1" stop-color="#7e3af2"/></linearGradient></defs>
    <rect x="${x}" y="${y}" width="${w}" height="${h * 0.45}" fill="url(#tr)"/>
    <rect x="${x - 26}" y="${y + h * 0.45}" width="${w + 26}" height="${h * 0.55}" fill="url(#tr)" opacity="0.85"/>
    <line x1="${x}" y1="${y + h * 0.45}" x2="${x + w}" y2="${y + h * 0.45}" stroke="${ACCENT}" stroke-width="3"/>`,
  checklist: (x, y, w, h) => { const rows = [0, 1, 2].map((i) =>
      `<rect x="${x + w * 0.12}" y="${y + h * (0.18 + i * 0.24)}" width="26" height="26" rx="6" fill="none" stroke="${ACCENT}" stroke-width="3"/>
       <path d="M ${x + w * 0.12 + 5} ${y + h * (0.18 + i * 0.24) + 13} l 6 7 l 11 -14" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round"/>
       <rect x="${x + w * 0.26}" y="${y + h * (0.18 + i * 0.24) + 6}" width="${w * 0.55}" height="12" rx="6" fill="rgba(232,234,237,0.25)"/>`).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>${rows}`;
  },
  clean: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>
    <path d="M ${x + w * 0.2} ${y + h * 0.75} Q ${x + w * 0.5} ${y + h * 0.15} ${x + w * 0.82} ${y + h * 0.55}" fill="none" stroke="rgba(232,234,237,0.35)" stroke-width="26" stroke-linecap="round"/>
    <g fill="${ACCENT}"><path d="M ${x + w * 0.68} ${y + h * 0.22} l 4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
    <path d="M ${x + w * 0.3} ${y + h * 0.3} l 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/></g>`,
  twoscreens: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#111318"/>
    <rect x="${x + w * 0.08}" y="${y + h * 0.3}" width="${w * 0.34}" height="${h * 0.42}" rx="6" fill="#1a56db"/>
    <rect x="${x + w * 0.52}" y="${y + h * 0.14}" width="${w * 0.42}" height="${h * 0.6}" rx="6" fill="#0e9f6e"/>
    <line x1="${x + w * 0.42}" y1="${y + h * 0.5}" x2="${x + w * 0.52}" y2="${y + h * 0.44}" stroke="${ACCENT}" stroke-width="4" stroke-dasharray="7 6"/>`,
};

const TOOL_MOTIF = {
  "dead-pixel-test": "pixels", "color-test": "rgb", "black-screen": "black", "white-screen": "white",
  "backlight-bleed-test": "bleed", "greyscale-test": "greysteps", "color-gradient-test": "gradient",
  "brightness-uniformity-test": "uniformity", "refresh-rate-test": "refresh", "ghosting-test": "ghost",
  "blooming-test": "bloom", "fake-broken-screen": "crack", "screensaver": "dvd", "boot-screen-simulator": "boot",
  "burn-in-test": "burnin", "contrast-test": "contrast", "black-level-test": "blacklevel",
  "viewing-angle-test": "angle", "gamma-test": "gamma", "screen-tearing-test": "tear",
};
const GUIDE_RULES = [
  [/checklist|before-buying|test-a-tv|test-a-laptop|used-phone/, "checklist"],
  [/clean/, "clean"], [/external-monitor/, "twoscreens"],
  [/stuck-pixel|dead-pixel|dead-vs-stuck|causes-dead|warranty/, "pixels"],
  [/gamma/, "gamma"], [/banding|gradient/, "gradient"], [/gamut|delta-e|calibrate|photo-editing/, "greysteps"],
  [/blue-light/, "uniformity"], [/refresh/, "refresh"], [/ghosting|response-time|motion-blur/, "ghost"],
  [/tearing/, "tear"], [/backlight-bleed|ips-glow/, "bleed"], [/burn-in/, "burnin"],
  [/mini-led|hdr/, "bloom"], [/ips-vs-va|viewing/, "angle"], [/pwm|flicker/, "refresh"],
  [/ppi|screen-door/, "pixels"], [/dark-spot|discolored/, "uniformity"],
];
const guideMotif = (slug) => (GUIDE_RULES.find(([re]) => re.test(slug)) ?? [null, "greysteps"])[1];

// ---------- layout ----------
function wrap(title, budget) {
  const words = title.split(" "); const lines = [""];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + " " + w).trim().length > budget && cur) lines.push(w);
    else lines[lines.length - 1] = (cur + " " + w).trim();
  }
  return lines;
}
function svgFor({ title, label, motif }) {
  let size = 46, budget = 21, lines = wrap(title, budget);
  if (lines.length > 3) { size = 38; budget = 26; lines = wrap(title, budget); }
  lines = lines.slice(0, 4);
  const sx = 640, sy = 96, sw = 500, sh = 330, pad = 16;   // screen frame
  const vx = sx + pad, vy = sy + pad, vw = sw - pad * 2, vh = sh - pad * 2; // viewport
  const titleY = 300; // first baseline; block grows downward, clear of the label at y=235
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  ${Array.from({ length: 29 }, (_, i) => `<line x1="${(i + 1) * 40}" y1="0" x2="${(i + 1) * 40}" y2="630" stroke="rgba(255,255,255,0.025)"/>`).join("")}
  ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="1200" y2="${(i + 1) * 40}" stroke="rgba(255,255,255,0.025)"/>`).join("")}
  <circle cx="92" cy="92" r="9" fill="${ACCENT}"/>
  <text x="114" y="101" font-family="${FONT}" font-size="27" font-weight="600" fill="rgba(232,234,237,0.8)">BestScreenTester</text>
  <text x="82" y="235" font-family="${FONT}" font-size="21" font-weight="700" letter-spacing="3" fill="${ACCENT}">${esc(label.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="82" y="${titleY + i * (size + 12)}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="${FG}">${esc(l)}</text>`).join("")}
  <text x="82" y="560" font-family="${FONT}" font-size="20" fill="rgba(232,234,237,0.45)">Free · in your browser · no install</text>
  <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="18" fill="${CARD}" stroke="${BORDER}" stroke-width="2"/>
  <clipPath id="vp"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="8"/></clipPath>
  <g clip-path="url(#vp)">${M[motif](vx, vy, vw, vh)}</g>
  <path d="M ${sx + sw / 2 - 42} ${sy + sh} l 84 0 l 14 46 l -112 0 z" fill="#101218"/>
  <rect x="${sx + sw / 2 - 92}" y="${sy + sh + 46}" width="184" height="10" rx="5" fill="#181b22"/>
</svg>`;
}

// ---------- render ----------
mkdirSync("public/og/tools", { recursive: true });
mkdirSync("public/og/guides", { recursive: true });
let total = 0;
for (const { list, dir } of [
  { list: tools.map((t) => ({ ...t, motif: TOOL_MOTIF[t.slug] })), dir: "tools" },
  { list: guides.map((g) => ({ ...g, motif: guideMotif(g.slug) })), dir: "guides" },
]) {
  for (const item of list) {
    if (!M[item.motif]) throw new Error(`no motif for ${item.slug}`);
    const png = await sharp(Buffer.from(svgFor(item))).png({ compressionLevel: 9, palette: true }).toBuffer();
    await sharp(png).toFile(`public/og/${dir}/${item.slug}.png`);
    total++;
  }
}
// ---------- hover previews ----------
// Full-bleed pattern only — no text, no chrome. These are what the tool cards
// show on hover: the actual test pattern the page will display.
mkdirSync("public/previews", { recursive: true });
for (const t of tools) {
  const motif = TOOL_MOTIF[t.slug];
  const svg = `<svg width="640" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="400" fill="${BG}"/>${M[motif](0, 0, 640, 400)}</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(`public/previews/${t.slug}.png`);
  total++;
}
console.log(`generated ${total} images`);
