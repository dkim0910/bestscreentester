import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, CONTACT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `What ${SITE_NAME} is, how the browser-based screen tests work, and why they're free.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
      <h1 className="text-3xl font-bold sm:text-4xl">About {SITE_NAME}</h1>
      <div className="prose-content mt-6">
        <p>
          {SITE_NAME} is a free collection of browser-based tools for testing displays — monitors,
          laptops, phones, tablets, and TVs. Check for dead pixels, color and backlight problems,
          refresh rate, ghosting, and more, with nothing to install.
        </p>

        <h2>How it works</h2>
        <p>
          Every test runs entirely in your browser using standard web APIs — full-screen, screen
          wake lock, and canvas rendering. We display precise solid colors, gradients, and motion
          patterns so panel defects become easy to see. Because the tests are local,{" "}
          <strong>nothing about your screen or device is uploaded to a server.</strong>
        </p>

        <h2>Why it&apos;s free</h2>
        <p>
          The tools are free to use, with no sign-up and no account required. We believe a quick
          screen check shouldn&apos;t cost anything or require handing over your data.
        </p>

        <h2>Our guides</h2>
        <p>
          Alongside the tools we publish{" "}
          <Link href="/blog">practical guides</Link> on fixing stuck pixels, understanding backlight
          bleed, calibrating color, choosing a panel, and more — so you can act on what a test shows
          you.
        </p>

        <h2>A note on accuracy</h2>
        <p>
          These tools are great for spotting visible defects and getting a feel for your display,
          but they are not a substitute for professional, hardware-calibrated measurement. Results
          depend on your screen, browser, and lighting. See our{" "}
          <Link href="/terms">Terms</Link> for details.
        </p>

        <h2>Get in touch</h2>
        <p>
          Questions, bug reports, or a tool you&apos;d like to see? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the{" "}
          <Link href="/feedback">contact page</Link>.
        </p>
      </div>
      </div>
    </div>
  );
}
