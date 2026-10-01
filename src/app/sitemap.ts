import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, PAGE_UPDATED, SITE_UPDATED } from "@/lib/seo";

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

  // Each tool carries its own date, like the guides below.
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/${t.slug}`),
    lastModified: t.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Guides carry their own dates, so lastmod reflects real content changes instead of
  // resetting to the build timestamp on every deploy.
  const postRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: absoluteUrl(`/blog/${g.slug}`),
    lastModified: g.updatedAt ?? g.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}
