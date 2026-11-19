import type { Metadata } from "next";
import Link from "next/link";
import { guidesByTopic } from "@/lib/guides";
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

const topicId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function BlogIndex() {
  // Grouped by the problem the reader has. Within a group the order is editorial:
  // the guide to read first comes first.
  const groups = guidesByTopic();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Guides &amp; articles</h1>
      <p className="mt-2 text-foreground/70">
        Practical help for testing, troubleshooting, and buying displays, grouped by problem.
      </p>

      <nav aria-label="Guide topics" className="mt-6 flex flex-wrap gap-2 text-sm">
        {groups.map((g) => (
          <a
            key={g.title}
            href={`#${topicId(g.title)}`}
            className="rounded-full border border-border px-3 py-1.5 text-foreground/70 hover:border-accent/50 hover:text-foreground"
          >
            {g.title}
          </a>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.title} id={topicId(g.title)} className="mt-12 scroll-mt-20">
          <h2 className="text-2xl font-bold">{g.title}</h2>
          {g.blurb && <p className="mt-1 text-foreground/60">{g.blurb}</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {g.guides.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-accent/50"
              >
                <h3 className="text-lg font-semibold">{p.title}</h3>
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
        </section>
      ))}
    </div>
  );
}
