// Loads the translated text for a language and merges it over the English registry.
// Server-side only: pages read from here and pass plain strings down. The one piece
// that reaches the browser is the client dictionary, handed to <UiProvider>.
//
// English is the source: src/lib/tools.ts, src/lib/toolResults.ts and ./en/*.json.
// Each other language has the same seven files under ./<lang>/. After changing English
// text, run `node scripts/i18n-check.mjs` to see which translations are now missing or
// out of shape. A slug or field with no translation falls back to English.
import { INDEXED_TOOLS, getTips, type ToolDef, type ToolFaq } from "@/lib/tools";
import { getResults, type ToolResults } from "@/lib/toolResults";
import { localePath, type Lang, type Locale } from "./config";
import enSite from "./en/site.json";
import esSite from "./es/site.json";
import esClient from "./es/client.json";
import esTools1 from "./es/tools-1.json";
import esTools2 from "./es/tools-2.json";
import esTools3 from "./es/tools-3.json";
import esResults1 from "./es/results-1.json";
import esResults2 from "./es/results-2.json";
import deSite from "./de/site.json";
import deClient from "./de/client.json";
import deTools1 from "./de/tools-1.json";
import deTools2 from "./de/tools-2.json";
import deTools3 from "./de/tools-3.json";
import deResults1 from "./de/results-1.json";
import deResults2 from "./de/results-2.json";
import frSite from "./fr/site.json";
import frClient from "./fr/client.json";
import frTools1 from "./fr/tools-1.json";
import frTools2 from "./fr/tools-2.json";
import frTools3 from "./fr/tools-3.json";
import frResults1 from "./fr/results-1.json";
import frResults2 from "./fr/results-2.json";
import ptSite from "./pt/site.json";
import ptClient from "./pt/client.json";
import ptTools1 from "./pt/tools-1.json";
import ptTools2 from "./pt/tools-2.json";
import ptTools3 from "./pt/tools-3.json";
import ptResults1 from "./pt/results-1.json";
import ptResults2 from "./pt/results-2.json";
import jaSite from "./ja/site.json";
import jaClient from "./ja/client.json";
import jaTools1 from "./ja/tools-1.json";
import jaTools2 from "./ja/tools-2.json";
import jaTools3 from "./ja/tools-3.json";
import jaResults1 from "./ja/results-1.json";
import jaResults2 from "./ja/results-2.json";
import koSite from "./ko/site.json";
import koClient from "./ko/client.json";
import koTools1 from "./ko/tools-1.json";
import koTools2 from "./ko/tools-2.json";
import koTools3 from "./ko/tools-3.json";
import koResults1 from "./ko/results-1.json";
import koResults2 from "./ko/results-2.json";

export type SiteText = typeof enSite;

interface ToolText {
  name: string;
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
  howTo: string[];
  faq: ToolFaq[];
  tips: string[];
}

type ResultsText = Omit<ToolResults, "guide"> & { guideLabel?: string };

interface Bundle {
  site: SiteText;
  client: Record<string, string>;
  tools: Record<string, ToolText>;
  results: Record<string, ResultsText>;
}

const BUNDLES: Record<Locale, Bundle> = {
  es: {
    site: esSite,
    client: esClient,
    tools: { ...esTools1, ...esTools2, ...esTools3 },
    results: { ...esResults1, ...esResults2 },
  },
  de: {
    site: deSite,
    client: deClient,
    tools: { ...deTools1, ...deTools2, ...deTools3 },
    results: { ...deResults1, ...deResults2 },
  },
  fr: {
    site: frSite,
    client: frClient,
    tools: { ...frTools1, ...frTools2, ...frTools3 },
    results: { ...frResults1, ...frResults2 },
  },
  pt: {
    site: ptSite,
    client: ptClient,
    tools: { ...ptTools1, ...ptTools2, ...ptTools3 },
    results: { ...ptResults1, ...ptResults2 },
  },
  ja: {
    site: jaSite,
    client: jaClient,
    tools: { ...jaTools1, ...jaTools2, ...jaTools3 },
    results: { ...jaResults1, ...jaResults2 },
  },
  ko: {
    site: koSite,
    client: koClient,
    tools: { ...koTools1, ...koTools2, ...koTools3 },
    results: { ...koResults1, ...koResults2 },
  },
};

/** Slugs that exist under a language prefix: every indexed test. */
export const TRANSLATED_SLUGS: string[] = INDEXED_TOOLS.map((t) => t.slug);

/** Link to `path` in `lang`; pages that exist in English only keep their English URL. */
export function href(lang: Lang, path: string): string {
  return localePath(lang, path, TRANSLATED_SLUGS);
}

/** Whether `href(lang, path)` leaves the visitor on an English page. */
export function isEnglishOnly(lang: Lang, path: string): boolean {
  return lang !== "en" && href(lang, path) === path;
}

export function getSite(lang: Lang): SiteText {
  return lang === "en" ? enSite : BUNDLES[lang].site;
}

/** Strings for the interactive tests, or null for English (the components hold those). */
export function getClientDict(lang: Lang): Record<string, string> | null {
  return lang === "en" ? null : BUNDLES[lang].client;
}

/** A tool with its copy in `lang`. Slug, category, icon and dates never change. */
export function localizeTool(tool: ToolDef, lang: Lang): ToolDef {
  if (lang === "en") return tool;
  const text = BUNDLES[lang].tools[tool.slug];
  if (!text) return tool;
  return {
    ...tool,
    name: text.name,
    title: text.title,
    tagline: text.tagline,
    description: text.description,
    keywords: text.keywords,
    howTo: text.howTo,
    faq: text.faq,
  };
}

/** The indexed tests in `lang`, in registry order. */
export function getTools(lang: Lang): ToolDef[] {
  return INDEXED_TOOLS.map((t) => localizeTool(t, lang));
}

export function getTipsFor(lang: Lang, slug: string): string[] {
  if (lang === "en") return getTips(slug);
  return BUNDLES[lang].tools[slug]?.tips ?? getTips(slug);
}

/** The results section in `lang`. The linked guide is the English one, with a translated label. */
export function getResultsFor(lang: Lang, slug: string): ToolResults | undefined {
  const base = getResults(slug);
  if (!base || lang === "en") return base;
  const text = BUNDLES[lang].results[slug];
  if (!text) return base;
  const { guideLabel, ...rest } = text;
  return {
    ...rest,
    guide: base.guide ? { slug: base.guide.slug, label: guideLabel ?? base.guide.label } : undefined,
  };
}
