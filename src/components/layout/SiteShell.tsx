import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/app/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import AdSenseScript from "@/components/AdSenseScript";
import ServiceWorker from "@/components/ServiceWorker";
import { NOVELTY_TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { SITE_NAME, siteUrl, siteJsonLd } from "@/lib/seo";
import type { Lang } from "@/i18n/config";
import { UiProvider } from "@/i18n/ui";
import { getClientDict, getSite, TRANSLATED_SLUGS } from "@/i18n";

// The document shell every root layout renders. There is one root layout per language
// (src/app/(en)/layout.tsx and src/app/(intl)/<lang>/layout.tsx) because <html lang> has
// to be right in the static HTML, and a single root layout can't see which language a
// page is in.

const ADSENSE_CLIENT = "ca-pub-7400069037778721";

// What <html lang> says. Portuguese is written for Brazil.
const HTML_LANG: Record<Lang, string> = {
  en: "en",
  es: "es",
  de: "de",
  fr: "fr",
  pt: "pt-BR",
  ja: "ja",
  ko: "ko",
};

export function siteMetadata(lang: Lang): Metadata {
  const text = getSite(lang).meta;
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      // Kept short: the old default ran to 90 chars, which Bing flags as "Title too long".
      default: `${SITE_NAME} — ${text.defaultTitle}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: text.siteTagline,
    applicationName: SITE_NAME,
    // Installed to an iPhone's home screen, open like an app (the manifest covers the rest).
    appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black" },
    // Favicons come from the file convention: src/app/icon.png (96px — it loads on every
    // page, so keep it small) + src/app/apple-icon.png.
    robots: { index: true, follow: true },
    // Google AdSense site verification (rendered into every page's <head>).
    other: { "google-adsense-account": ADSENSE_CLIENT },
    // Both properties are currently verified out-of-band (Google via a DNS TXT record on
    // the sc-domain property, Bing via its own verification), so neither tag is required.
    // These stay as an optional fallback if a verification ever needs re-establishing;
    // set the token in CI to make one ship. See .env.example.
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {},
    },
  };
}

// Noindexed pages get no ad script. Paths carry the trailing slash the site uses.
const NO_AD_PATHS = [
  ...NOVELTY_TOOLS.map((t) => `/${t.slug}/`),
  ...GUIDES.filter((g) => g.noindex).map((g) => `/blog/${g.slug}/`),
];

export default function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html
      lang={HTML_LANG[lang]}
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <UiProvider lang={lang} dict={getClientDict(lang)} slugs={TRANSLATED_SLUGS}>
          <Header lang={lang} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
          <ServiceWorker />
        </UiProvider>
        <Analytics />
        {/* English only for now: the translations are machine-made and unreviewed, so no
            ads beside them until a native speaker has checked each language. */}
        {lang === "en" && <AdSenseScript client={ADSENSE_CLIENT} skip={NO_AD_PATHS} />}
      </body>
    </html>
  );
}
