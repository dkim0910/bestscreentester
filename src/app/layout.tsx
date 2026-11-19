import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import AdSenseScript from "@/components/AdSenseScript";
import { NOVELTY_TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { SITE_NAME, SITE_TAGLINE, siteUrl, siteJsonLd } from "@/lib/seo";

const ADSENSE_CLIENT = "ca-pub-7400069037778721";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    // Kept short: the old default ran to 90 chars, which Bing flags as "Title too long".
    default: `${SITE_NAME} — Free Online Screen Tests`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
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

// Noindexed pages get no ad script. Paths carry the trailing slash the site uses.
const NO_AD_PATHS = [
  ...NOVELTY_TOOLS.map((t) => `/${t.slug}/`),
  ...GUIDES.filter((g) => g.noindex).map((g) => `/blog/${g.slug}/`),
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <AdSenseScript client={ADSENSE_CLIENT} skip={NO_AD_PATHS} />
      </body>
    </html>
  );
}
