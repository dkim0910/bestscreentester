import type { Metadata } from "next";

export const SITE_NAME = "BestScreenTester";
export const SITE_TAGLINE =
  "Free online screen tests for dead pixels, color, backlight, and motion.";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bestscreentester.com";

// Last review date for the legal pages (About / Privacy / Terms).
export const LEGAL_UPDATED = "June 21, 2026";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function absoluteUrl(path = ""): string {
  if (!path) return siteUrl();
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaArgs {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: string[];
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  images,
}: PageMetaArgs): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images?.length ? images : [absoluteUrl("/og.png")];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
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

export function siteJsonLd() {
  const url = siteUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url,
      logo: absoluteUrl("/icon.png"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url,
      description: SITE_TAGLINE,
    },
  ];
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorName?: string | null;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: args.publishedAt?.toISOString(),
    dateModified: (args.updatedAt ?? args.publishedAt)?.toISOString(),
    author: { "@type": "Person", name: args.authorName ?? SITE_NAME },
    image: args.image ?? undefined,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}
