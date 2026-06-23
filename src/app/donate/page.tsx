import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description: `Support ${SITE_NAME} and help keep every screen test free for everyone.`,
  path: "/donate",
});

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        Support Us
      </p>
      <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl">
        Help Keep {SITE_NAME} Free
      </h1>
      <p className="mb-10 leading-relaxed text-foreground/70">
        {SITE_NAME} is built and maintained by one solo developer. Your donation helps cover
        hosting and development time so all {21}+ screen tests can stay free for everyone.
      </p>

      {/* Donation options */}
      <div className="mb-10 space-y-4">
        {/* ko-fi */}
        <a
          href="https://ko-fi.com/bestscreentester"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-[#FF5E5B]/50 bg-[#FF5E5B]/20 p-6 transition-colors hover:bg-[#FF5E5B]/30"
        >
          <Image
            src="https://storage.ko-fi.com/cdn/cup-border.png"
            alt="Ko-fi"
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold">Ko-fi</h2>
            <p className="text-sm text-foreground/60">
              Support with a one-time or monthly donation
            </p>
          </div>
        </a>

        {/* buy me a coffee */}
        <a
          href="https://buymeacoffee.com/dkim2000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-[#FFDD00]/50 bg-[#FFDD00]/20 p-6 transition-colors hover:bg-[#FFDD00]/30"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
            alt="Buy Me a Coffee"
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold">Buy Me a Coffee</h2>
            <p className="text-sm text-foreground/60">
              Buy a coffee to show your support
            </p>
          </div>
        </a>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-card p-5 text-sm leading-relaxed text-foreground/60">
        <p className="mb-2 font-semibold text-foreground/90">Please note:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Donations are <strong>not tax-deductible</strong>.
          </li>
          <li>
            All donations are <strong>non-refundable</strong>.
          </li>
          <li>Donations go toward keeping {SITE_NAME} running.</li>
        </ul>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
