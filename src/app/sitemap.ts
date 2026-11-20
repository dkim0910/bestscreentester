import type { MetadataRoute } from "next";
import { INDEXED_TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, languageAlternates, PAGE_UPDATED, SITE_UPDATED } from "@/lib/seo";
import { I18N_UPDATED, LOCALES } from "@/i18n/config";
import { href } from "@/i18n";

export const dynamic = "force-static";

// `absoluteUrl` appends the trailing slash that `trailingSlash: true` makes canonical,
// so every <loc> here matches the page's own <link rel="canonical"> exactly. Emitting
// the slash-less form is what put 16 URLs into Search Console's "Page with redirect".
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: PAGE_UPDATED.home, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: PAGE_UPDATED.about, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/donate"), lastModified: PAGE_UPDATED.donate, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/feedback"), lastModified: PAGE_UPDATED.feedback, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: PAGE_UPDATED.privacy, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: PAGE_UPDATED.terms, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Each tool carries its own date, like the guides below. Noindexed pages stay out:
  // a sitemap entry that says "index me" on a noindex page is a mixed signal.
  const toolRoutes: MetadataRoute.Sitemap = INDEXED_TOOLS.map((t) => ({
    url: absoluteUrl(`/${t.slug}`),
    lastModified: t.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Guides carry their own dates, so lastmod reflects real content changes instead of
  // resetting to the build timestamp on every deploy.
  const postRoutes: MetadataRoute.Sitemap = GUIDES.filter((g) => !g.noindex).map((g) => ({
    url: absoluteUrl(`/blog/${g.slug}`),
    lastModified: g.updatedAt ?? g.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // The homepage, /tools and every test also exist under each language prefix. Each of
  // those URLs gets its own entry, and every version of a page lists all the others as
  // hreflang alternates, matching the <link rel="alternate"> tags in the pages.
  // A translation's lastmod is the later of its English page's date and the day the
  // translations were published: it can't be older than the translation itself.
  const translatable = [...staticRoutes.slice(0, 2), ...toolRoutes];
  const paths = ["/", "/tools", ...INDEXED_TOOLS.map((t) => `/${t.slug}`)];
  const withAlternates = translatable.map((entry, i) => ({
    ...entry,
    alternates: { languages: languageAlternates(paths[i]) },
  }));
  const localized: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    withAlternates.map((entry, i) => ({
      ...entry,
      url: absoluteUrl(href(lang, paths[i])),
      lastModified: String(entry.lastModified) > I18N_UPDATED ? entry.lastModified : I18N_UPDATED,
      priority: Math.round(((entry.priority ?? 0.5) - 0.1) * 10) / 10,
    })),
  );

  return [...withAlternates, ...staticRoutes.slice(2), ...postRoutes, ...localized];
}
