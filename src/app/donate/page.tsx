import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description: "Support BestScreenTester with a Buy Me a Coffee or PayPal donation.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-4xl">
            ☕
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Support {SITE_NAME}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            If you enjoy the free screen tests, a small donation helps keep the site running and
            supports future improvements.
          </p>
        </div>

        <div className="mt-10 space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
          <a
            href="https://www.buymeacoffee.com/yourname"
            target="_blank"
            rel="noreferrer"
            className="block rounded-full border border-border bg-white px-6 py-4 text-center text-sm font-semibold text-foreground shadow-sm transition hover:bg-white/90 sm:flex-1"
          >
            Buy Me a Coffee
          </a>
          <a
            href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID"
            target="_blank"
            rel="noreferrer"
            className="block rounded-full bg-accent px-6 py-4 text-center text-sm font-semibold text-black transition hover:opacity-90 sm:flex-1"
          >
            Donate with PayPal
          </a>
        </div>

        <div className="mt-8 rounded-2xl bg-muted p-5 text-sm text-foreground/70">
          <p className="font-semibold text-foreground">Note</p>
          <p className="mt-2">
            These links open external donation pages. Replace them with your own Buy Me a Coffee or
            PayPal URLs once your accounts are set up.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-foreground/60">
          <Link href="/feedback" className="hover:text-foreground">
            Need help or have a question? Contact us.
          </Link>
        </div>
      </div>
    </div>
  );
}
