import type { Metadata } from "next";
import { pageMetadata, CONTACT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Feedback",
  description: "Report a bug, request a new screen test, or tell us about a dead pixel you found.",
  path: "/feedback",
});

export default function FeedbackPage() {
  const subject = encodeURIComponent("BestScreenTester feedback");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="text-5xl" aria-hidden>
        ✉️
      </div>
      <h1 className="mt-4 text-3xl font-bold">Contact &amp; feedback</h1>
      <p className="mt-3 text-foreground/70">
        Found a bug, want a new test, or spotted a dead pixel worth reporting? We&apos;d love to
        hear from you.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}
        className="mt-8 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-black hover:opacity-90"
      >
        Email us
      </a>
    </div>
  );
}
