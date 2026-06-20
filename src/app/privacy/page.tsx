import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data. Short version: the screen tests run locally and we don't track you.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {LEGAL_UPDATED}</p>

      <div className="prose-content mt-6">
        <p>
          <strong>The short version:</strong> {SITE_NAME} runs its screen tests entirely in your
          browser. We don&apos;t require an account, we don&apos;t sell data, and we don&apos;t use
          third-party advertising or tracking cookies.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Screen tests:</strong> all tests run locally on your device. Information about
            your display (colors shown, resolution, refresh rate, etc.) stays in your browser and is
            never sent to us.
          </li>
          <li>
            <strong>No accounts:</strong> there is no sign-up or login, so we don&apos;t hold names,
            emails, or passwords.
          </li>
          <li>
            <strong>Email you send us:</strong> if you contact us via the{" "}
            <Link href="/feedback">feedback page</Link>, your message arrives by email and we keep it
            only to respond.
          </li>
        </ul>

        <h2>Cookies and local storage</h2>
        <p>
          We use a small amount of <strong>local storage</strong> on your device for essential,
          non-tracking purposes only — for example, remembering that you accepted the cookie notice.
          We do not set advertising or cross-site tracking cookies.
        </p>

        <h2>Hosting and server logs</h2>
        <p>
          Like most websites, our hosting provider may automatically record standard technical
          information (such as IP address, browser type, and the pages requested) for security and
          to keep the site running. This is standard server logging and isn&apos;t used to profile
          you.
        </p>

        <h2>Third parties</h2>
        <p>
          We don&apos;t share your information with advertisers or data brokers. Outbound links to
          other sites are governed by their own privacy policies.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          {SITE_NAME} is a general-audience tool and isn&apos;t directed at children, and we
          don&apos;t knowingly collect personal information from them.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. The &quot;last updated&quot; date above
          reflects the latest revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}
