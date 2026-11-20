// Checks every translation under src/i18n/<lang>/ against the English source.
//
//   node scripts/i18n-check.mjs
//
// Errors (exit 1): a missing file, a missing or extra key, an array of the wrong
// length, a lost {placeholder}, an empty translation, or a UI string used by a
// component that has no entry in en/client.json.
// Warnings: a value left identical to the English (often fine: "HDR", "sRGB").
//
// Run it after changing English text in tools.ts, toolResults.ts or en/*.json.
// Needs Node 22.18+ (it imports the .ts registries through i18n-source.mjs).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { englishSource } from "./i18n-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/i18n");
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const langs = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "en")
  .map((d) => d.name);

const { tools, results } = englishSource();
// The tools-N / results-N files are compared merged: which chunk a test sits in is a
// filing detail (the loader merges them too), and it shifts when tests are added.
const source = {
  "site.json": read(join(dir, "en/site.json")),
  "client.json": read(join(dir, "en/client.json")),
  "tools-*.json": Object.assign({}, ...tools),
  "results-*.json": Object.assign({}, ...results),
};

const errors = [];
const warnings = [];
const placeholders = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

function compare(en, tr, where) {
  if (typeof en === "string") {
    if (typeof tr !== "string") return errors.push(`${where}: expected a string`);
    if (en && !tr.trim()) errors.push(`${where}: empty translation`);
    if (placeholders(en) !== placeholders(tr))
      errors.push(`${where}: placeholders differ (${placeholders(en) || "none"} vs ${placeholders(tr) || "none"})`);
    if (en.length > 24 && en === tr) warnings.push(`${where}: same as English`);
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return errors.push(`${where}: expected an array`);
    if (en.length !== tr.length) errors.push(`${where}: ${tr.length} items, English has ${en.length}`);
    en.forEach((v, i) => i < tr.length && compare(v, tr[i], `${where}[${i}]`));
    return;
  }
  if (!tr || typeof tr !== "object" || Array.isArray(tr)) return errors.push(`${where}: expected an object`);
  for (const k of Object.keys(en)) {
    if (!(k in tr)) errors.push(`${where}.${k}: missing`);
    else compare(en[k], tr[k], `${where}.${k}`);
  }
  for (const k of Object.keys(tr)) if (!(k in en)) errors.push(`${where}.${k}: not in the English source`);
}

for (const lang of langs) {
  for (const [file, en] of Object.entries(source)) {
    const prefix = file.endsWith("-*.json") ? file.slice(0, -6) : null;
    const paths = prefix
      ? readdirSync(join(dir, lang))
          .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
          .map((f) => join(dir, lang, f))
      : [join(dir, lang, file)];
    if (paths.length === 0 || !paths.every((p) => existsSync(p))) {
      errors.push(`${lang}/${file}: file missing`);
      continue;
    }
    let tr;
    try {
      tr = Object.assign({}, ...paths.map(read));
    } catch (e) {
      errors.push(`${lang}/${file}: invalid JSON (${e.message})`);
      continue;
    }
    compare(en, tr, `${lang}/${file}`);
  }
}

// Every literal passed to t("…") / tr("…") in a component must be in en/client.json.
const known = new Set(Object.keys(source["client.json"]));
function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) {
      const text = readFileSync(p, "utf8");
      if (!text.includes("@/i18n/ui") && !/\btr\(/.test(text)) continue;
      for (const m of text.matchAll(/\b(?:t|tr)\(\s*"((?:[^"\\]|\\.)*)"/g)) {
        const key = JSON.parse(`"${m[1]}"`);
        if (key && !known.has(key)) errors.push(`${p.replace(root + "/", "")}: "${key}" is not in en/client.json`);
      }
    }
  }
}
walk(join(root, "src/components"));

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${langs.length} languages, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
