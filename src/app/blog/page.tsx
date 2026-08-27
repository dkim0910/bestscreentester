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

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  // Newest first, so the index carries a recency signal instead of raw array order.
  const sorted = [...GUIDES].sort((a, b) =>
    (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Guides &amp; articles</h1>
      <p className="mt-2 text-foreground/70">
        Practical help for testing, troubleshooting, and buying displays.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-accent/50"
          >
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <time
              dateTime={p.updatedAt ?? p.publishedAt}
              className="mt-1 text-xs text-foreground/40"
            >
              {formatDate(p.updatedAt ?? p.publishedAt)}
            </time>
            {p.excerpt && <p className="mt-2 text-sm text-foreground/60">{p.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
