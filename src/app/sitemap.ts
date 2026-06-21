import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { getAllGuideSlugs } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/feedback"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/${t.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}
