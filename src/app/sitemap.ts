import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, SITE_UPDATED } from "@/lib/seo";

export const dynamic = "force-static";

// `absoluteUrl` appends the trailing slash that `trailingSlash: true` makes canonical,
// so every <loc> here matches the page's own <link rel="canonical"> exactly. Emitting
// the slash-less form is what put 16 URLs into Search Console's "Page with redirect".
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/donate"), lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/feedback"), lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/${t.slug}`),
    lastModified: SITE_UPDATED,
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
