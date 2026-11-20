// Writes the English text of the translated pages as JSON, in the exact shape the
// per-language files under src/i18n/<lang>/ must have. Translators (human or machine)
// work from this output; scripts/i18n-check.mjs compares every language against it.
//
//   node scripts/i18n-source.mjs <out-dir>
//
// tools-N.json    per test: name, title, tagline, description, keywords, howTo, faq, tips
// results-N.json  per test: the "reading your results" section and the next steps
//
// site.json and client.json are not generated: src/i18n/en/ holds their source.
// Needs Node 22.18+ (it imports the .ts registries directly).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INDEXED_TOOLS, getTips } from "../src/lib/tools.ts";
import { getResults } from "../src/lib/toolResults.ts";

// How many tests go in each chunk file. Chunks keep each file small enough to review.
export const TOOL_CHUNKS = 3;
export const RESULT_CHUNKS = 2;

function chunk(entries, parts) {
  const size = Math.ceil(entries.length / parts);
  return Array.from({ length: parts }, (_, i) => Object.fromEntries(entries.slice(i * size, (i + 1) * size)));
}

export function englishSource() {
  const tools = INDEXED_TOOLS.map((t) => [
    t.slug,
    {
      name: t.name,
      title: t.title,
      tagline: t.tagline,
      description: t.description,
      keywords: t.keywords,
      howTo: t.howTo,
      faq: t.faq,
      tips: getTips(t.slug),
    },
  ]);
  const results = INDEXED_TOOLS.map((t) => {
    const r = getResults(t.slug);
    if (!r) throw new Error(`No results section for ${t.slug}`);
    const { guide, ...text } = r;
    return [t.slug, guide ? { ...text, guideLabel: guide.label } : text];
  });
  return { tools: chunk(tools, TOOL_CHUNKS), results: chunk(results, RESULT_CHUNKS) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = process.argv[2];
  if (!out) {
    console.error("usage: node scripts/i18n-source.mjs <out-dir>");
    process.exit(1);
  }
  mkdirSync(out, { recursive: true });
  const { tools, results } = englishSource();
  tools.forEach((c, i) => writeFileSync(join(out, `tools-${i + 1}.json`), JSON.stringify(c, null, 2) + "\n"));
  results.forEach((c, i) => writeFileSync(join(out, `results-${i + 1}.json`), JSON.stringify(c, null, 2) + "\n"));
  console.log(`Wrote ${tools.length} tools and ${results.length} results chunks to ${out}`);
}
