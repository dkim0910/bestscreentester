import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms for using ${SITE_NAME}'s free screen-testing tools and guides.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {LEGAL_UPDATED}</p>

      <div className="prose-content mt-6">
        <p>
          By using {SITE_NAME} (the &quot;Service&quot;), you agree to these terms. If you
          don&apos;t agree, please don&apos;t use the Service.
        </p>

        <h2>Use of the Service</h2>
        <p>
          {SITE_NAME} provides free, browser-based screen-testing tools and informational guides.
          You may use them for personal and commercial purposes. Don&apos;t misuse the Service —
          for example by attempting to disrupt it, scrape it abusively, or use it unlawfully.
        </p>

        <h2>No warranty</h2>
        <p>
          The Service is provided <strong>&quot;as is&quot; and &quot;as available,&quot;</strong>{" "}
          without warranties of any kind. The tools are aids for spotting visible display issues;
          they are <strong>not a substitute for professional, hardware-calibrated measurement</strong>
          , and we don&apos;t guarantee they will detect every defect or produce accurate readings
          on every device, browser, or lighting condition.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE_NAME} and its operators are not liable for
          any indirect, incidental, or consequential damages arising from your use of (or inability
          to use) the Service, including any decisions you make about a device based on a test
          result.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The Service&apos;s content, design, and code are owned by {SITE_NAME} or its licensors and
          are protected by applicable laws. The guides are for personal reference; please
          don&apos;t republish them wholesale without permission.
        </p>

        <h2>External links</h2>
        <p>
          The Service may link to third-party websites we don&apos;t control and aren&apos;t
          responsible for. Your use of those sites is at your own risk.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms or the Service at any time. Continued use after changes means
          you accept the updated terms. See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}
