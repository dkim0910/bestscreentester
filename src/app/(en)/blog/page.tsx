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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <p className="eyebrow">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Guides &amp; articles</h1>
      <p className="mt-2 text-foreground/65">
        Practical help for testing, troubleshooting, and buying displays, grouped by problem.
      </p>

      <nav aria-label="Guide topics" className="mt-6 flex flex-wrap gap-2 text-sm">
        {groups.map((g) => (
          <a
            key={g.title}
            href={`#${topicId(g.title)}`}
            className="rounded-md border border-border px-3 py-1.5 text-foreground/70 transition-colors hover:border-border-strong hover:text-foreground"
          >
            {g.title}
          </a>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.title} id={topicId(g.title)} className="mt-12 scroll-mt-20">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{g.title}</h2>
            {g.blurb && <p className="mt-1 text-foreground/60">{g.blurb}</p>}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.guides.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="panel group flex flex-col p-5 transition-colors hover:border-border-strong"
              >
                <h3 className="font-semibold leading-snug group-hover:text-accent-soft">{p.title}</h3>
                <time
                  dateTime={p.updatedAt ?? p.publishedAt}
                  className="eyebrow mt-2"
                >
                  {formatDate(p.updatedAt ?? p.publishedAt)}
                </time>
                {p.excerpt && <p className="mt-2 text-sm leading-relaxed text-foreground/60">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
