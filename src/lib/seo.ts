import type { Metadata } from "next";

export const SITE_NAME = "BestScreenTester";
export const SITE_TAGLINE =
  "Free online screen tests for dead pixels, color, backlight, and motion.";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello+bestscreentester@nelera.com";

// Last review date for the legal pages (About / Privacy / Terms).
export const LEGAL_UPDATED = "July 29, 2026";

// Freshness date for the tools and the static pages. Sitemap `lastmod` is derived
// from this rather than from build time: Bing discounts sitemaps whose lastmod is
// always "now", so this must be a stable value that only moves when content does.
export const SITE_UPDATED = "2026-08-27";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

// The site is exported with `trailingSlash: true`, so every canonical, sitemap entry
// and JSON-LD url must carry the trailing slash. Emitting the slash-less form makes
// the host 301 to this one and search engines file the original as "Page with
// redirect" — which is exactly what happened to 16 URLs in Search Console.
export function absoluteUrl(path = ""): string {
  const base = siteUrl();
  if (!path || path === "/") return `${base}/`;
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  // Leave files (/og.png) and anchors/queries alone; only directory routes get a slash.
  const isFile = /\.[a-z0-9]+$/i.test(withLeading.split(/[?#]/)[0]);
  const needsSlash = !isFile && !withLeading.includes("?") && !withLeading.includes("#");
  return `${base}${needsSlash && !withLeading.endsWith("/") ? `${withLeading}/` : withLeading}`;
}

interface PageMetaArgs {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

// Titles render as "<title> · BestScreenTester" via the layout template. That suffix
// costs 19 characters, which pushes the longer guide titles past the ~70 char limit
// Bing flags and Google truncates. When the templated form would run long, emit the
// title on its own instead of shortening otherwise-good headlines.
const TITLE_BUDGET = 60;

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  images,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetaArgs): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images?.length ? images : [absoluteUrl("/og.png")];
  const templated = `${title} · ${SITE_NAME}`;
  return {
    title: templated.length > TITLE_BUDGET ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: templated,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: ogImages,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: templated,
      description,
      images: ogImages,
    },
  };
}

// ----- JSON-LD builders -----

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function howToJsonLd(name: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Each tool is a free browser app, which is what WebApplication describes. The
// zero-cost Offer is what makes the "free" claim machine-readable.
export function webAppJsonLd(args: {
  name: string;
  description: string;
  path: string;
  category: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    applicationCategory: args.category,
    operatingSystem: "Any",
    browserRequirements: "Requires a modern browser with JavaScript enabled.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    image: args.image ? absoluteUrl(args.image) : undefined,
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
  };
}

export function siteJsonLd() {
  const url = absoluteUrl("/");
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${url}#organization`,
      name: SITE_NAME,
      url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
        width: 512,
        height: 512,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}#website`,
      name: SITE_NAME,
      url,
      description: SITE_TAGLINE,
      inLanguage: "en",
      publisher: { "@id": `${url}#organization` },
    },
  ];
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  authorName?: string | null;
  image?: string | null;
}) {
  const siteRoot = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: args.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": args.url },
    datePublished: args.publishedAt ?? undefined,
    dateModified: args.updatedAt ?? args.publishedAt ?? undefined,
    author: { "@type": "Organization", name: args.authorName ?? SITE_NAME, url: siteRoot },
    image: args.image ?? absoluteUrl("/og.png"),
    inLanguage: "en",
    publisher: { "@id": `${siteRoot}#organization` },
  };
}
