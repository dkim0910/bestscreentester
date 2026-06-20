import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guides & Articles",
  description:
    "Guides on fixing dead pixels, understanding backlight bleed, choosing a monitor, and getting the most from your display.",
  path: "/blog",
});

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Guides &amp; articles</h1>
      <p className="mt-2 text-foreground/70">
        Practical help for testing, troubleshooting, and buying displays.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {GUIDES.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-accent/50"
          >
            <h2 className="text-lg font-semibold">{p.title}</h2>
            {p.excerpt && <p className="mt-2 text-sm text-foreground/60">{p.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
