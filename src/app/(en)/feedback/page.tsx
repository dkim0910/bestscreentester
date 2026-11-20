import type { Metadata } from "next";
import { pageMetadata, CONTACT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Feedback",
  description:
    "Report a bug, request a new screen test, or tell us about a display problem our tools did not catch. Every message reaches the developer directly.",
  path: "/feedback",
});

export default function FeedbackPage() {
  const subject = encodeURIComponent("BestScreenTester feedback");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Contact &amp; feedback</h1>
      <p className="mt-3 text-foreground/70">
        Found a bug, want a new test, or spotted a dead pixel worth reporting? We&apos;d love to
        hear from you.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}
        className="btn-primary mt-8"
      >
        Email us
      </a>
      <p className="mt-4 text-sm text-foreground/60">
        Or write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}
