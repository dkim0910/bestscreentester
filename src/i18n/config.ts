// Languages the site is published in. English lives at the root (/dead-pixel-test/);
// every other language sits under a prefix (/es/dead-pixel-test/) with the same slugs.
//
// Only the test pages, the homepage and /tools are translated. Guides, the legal pages
// and the novelty pages exist in English only, so links to them from a translated page
// point at the English URL (see `localePath`).

export const LOCALES = ["es", "de", "fr", "pt", "ja", "ko"] as const;
export type Locale = (typeof LOCALES)[number];
export type Lang = "en" | Locale;

export const LANGS: Lang[] = ["en", ...LOCALES];

/** Each language's own name, for the switcher. */
export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  ja: "日本語",
  ko: "한국어",
};

export const OG_LOCALE: Record<Lang, string> = {
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
  pt: "pt_BR",
  ja: "ja_JP",
  ko: "ko_KR",
};

// First publication of the translated pages. Their sitemap lastmod is the later of this
// and the English page's own date, so it stays honest (see the SEO notes in seo.ts).
export const I18N_UPDATED = "2026-11-20";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Fill `{name}` placeholders in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/**
 * Whether a site path has translated versions. `translatedSlugs` is the list of indexed
 * tool slugs; it is passed in so this module stays free of the tool registry (client
 * components import it).
 */
export function isTranslatedPath(path: string, translatedSlugs: readonly string[]): boolean {
  const clean = path.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "/tools") return true;
  return translatedSlugs.includes(clean.slice(1));
}

/** The URL path of `path` in `lang`: unchanged for English and for untranslated pages. */
export function localePath(lang: Lang, path: string, translatedSlugs: readonly string[]): string {
  if (lang === "en" || !isTranslatedPath(path, translatedSlugs)) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
