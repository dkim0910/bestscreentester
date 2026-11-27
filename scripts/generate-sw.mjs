#!/usr/bin/env node
// Writes out/sw.js, the offline service worker, from scripts/sw-template.js. Runs after
// every `npm run build` (the postbuild script), because it lists that build's files.
//
// Precached, so the tests work offline after one visit:
//   - every file under /_next/static/ (scripts, styles, fonts: all content-hashed);
//   - the files the pages load from public/: icons, thumbnails, the HDR test image;
//   - the homepage, the tool list and every test page, in the visitor's language only.
//     The page registers /sw.js?lang=<code>; a visit in another language registers it
//     again with that code, which adds that language's pages to the same cache. (All
//     seven languages at once would be ~22 MB of HTML on disk.)
// Guides are not precached (there are many, and they are reading, not testing): a guide
// opened online is kept for offline use until the next deploy.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
if (!existsSync(join(OUT, "index.html"))) throw new Error("generate-sw: run `next build` first (no out/index.html)");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const url = (file) => "/" + relative(OUT, file).split(sep).join("/");
const page = (dir) => (existsSync(join(OUT, dir, "index.html")) ? [`/${dir ? `${dir}/` : ""}`] : []);

// Test pages: every top-level folder whose index.html carries the test runner. Read
// from the build rather than the registry so this can't drift from what was exported.
const LANG_DIRS = ["es", "de", "fr", "pt", "ja", "ko"];
const NOT_TESTS = new Set(["_next", "blog", "tools", "about", "privacy", "terms", "donate", "feedback", "og", "previews", "hdr", "icons", ...LANG_DIRS]);
const testDirs = (base) =>
  readdirSync(join(OUT, base), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !NOT_TESTS.has(e.name) && existsSync(join(OUT, base, e.name, "index.html")))
    .map((e) => (base ? `${base}/${e.name}` : e.name));

const pages = Object.fromEntries(
  ["", ...LANG_DIRS].map((base) => [
    base || "en",
    [...page(base), ...page(base ? `${base}/tools` : "tools"), ...testDirs(base).flatMap(page)],
  ]),
);
const allPages = Object.values(pages).flat();

const statics = walk(join(OUT, "_next", "static")).filter((f) => !f.endsWith(".map")).map(url);
const pub = [
  "/offline.html",
  "/manifest.webmanifest",
  "/icon.png",
  "/apple-icon.png",
  "/logo-mark.png",
  "/dvd_logo.png",
  ...["icons", "previews", "hdr"].flatMap((d) => (existsSync(join(OUT, d)) ? walk(join(OUT, d)).map(url) : [])),
].filter((u) => existsSync(join(OUT, u)));

const core = [...statics, ...pub];
const size = (list) =>
  list.reduce((sum, u) => sum + statSync(u.endsWith("/") ? join(OUT, u, "index.html") : join(OUT, u)).size, 0);
// Changes whenever any precached file, or the worker's own code, does: a new version
// gets a fresh cache and the old one is deleted.
const template = readFileSync("scripts/sw-template.js", "utf8");
const version = createHash("sha256")
  .update([template, ...core, ...allPages.map((u) => readFileSync(join(OUT, u, "index.html")))].join("\n"))
  .digest("hex")
  .slice(0, 12);

const sw = template
  .replace("__VERSION__", version)
  .replace("__CORE__", JSON.stringify(core))
  .replace("__PAGES__", JSON.stringify(pages));
writeFileSync(join(OUT, "sw.js"), sw);
const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;
console.log(
  `generate-sw: out/sw.js v${version}: ${core.length} shared files (${mb(size(core))}) + per language ` +
    `${pages.en.length} English pages (${mb(size(pages.en))}), ${allPages.length} pages in all`,
);
