import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, CONTACT_EMAIL, OPERATOR_NAME, OPERATOR_BRAND } from "@/lib/seo";
import { DEVICES } from "@/lib/devices";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Who builds ${SITE_NAME}, the monitors, laptops and phones every screen test is checked on, how the guides are written, and how to get in touch.`,
  path: "/about",
});

const TEST_DEVICES = Object.values(DEVICES);

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
          <Link href="/blog">guides</Link> that explain what a result means: how to tell a dead
          pixel from a stuck one, backlight bleed from IPS glow, and image retention from burn-in,
          and when a fault is worth a return.
        </p>

        <h2>Who makes {SITE_NAME}</h2>
        <p>
          {SITE_NAME} is built and maintained by {OPERATOR_NAME}, an independent developer who
          publishes software as {OPERATOR_BRAND}. It is a one-person operation: Daniel builds the
          tools and writes the guides on this site.
        </p>

        <h2>The screens the tests are checked on</h2>
        <p>
          These are the screens Daniel owns and checks the tests on. Between them they cover IPS,
          Mini-LED and OLED panels, from a phone up to a 32-inch monitor:
        </p>
        <ul>
          {TEST_DEVICES.map((d) => (
            <li key={d.name}>
              <strong>{d.name}</strong> — {d.panel}
            </li>
          ))}
        </ul>
        <p>
          As of November 2026 none of these six screens has a dead or stuck pixel, checked with
          the <Link href="/dead-pixel-test">Dead Pixel Test</Link> on this site.
        </p>
        <p>
          That list has limits, and they are worth knowing. There is no television on it, and no
          VA or TN panel. What the guides say about those comes from manufacturer documentation
          and published standards, not from hardware on Daniel&apos;s desk.
        </p>

        <h2>How the guides are written and corrected</h2>
        <p>
          AI tools are used to help draft and edit the guides and the text on this site. Daniel
          decides what is published and is responsible for it. Many guides link the standards and
          manufacturer documents they draw on, so you can check the source yourself.
        </p>
        <p>
          If you spot a mistake, tell us: we correct the page and update its date. A guide&apos;s
          date changes only when its content does.
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
