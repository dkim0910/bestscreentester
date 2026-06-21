import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, getTips, TOOLS, CATEGORY_LABELS } from "@/lib/tools";
import { pageMetadata, faqJsonLd, howToJsonLd } from "@/lib/seo";
import { getGuidesForTool } from "@/lib/guides";
import ToolRunner from "@/components/tools/ToolRunner";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return pageMetadata({
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(
    0,
    4,
  );

  const guides = getGuidesForTool(tool.slug);
  const tips = getTips(tool.slug);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd(tool.title, tool.howTo)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(tool.faq)) }}
      />

      <nav className="mb-4 text-sm text-foreground/50">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/tools" className="hover:text-foreground">
          Tools
        </Link>{" "}
        / <span className="text-foreground/80">{tool.name}</span>
      </nav>

      <header className="mb-6">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">
          {CATEGORY_LABELS[tool.category]}
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{tool.title}</h1>
        <p className="mt-2 text-lg text-foreground/70">{tool.tagline}</p>
      </header>

      <ToolRunner tool={tool} />

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-semibold">How to use</h2>
          <ol className="space-y-2 text-foreground/80">
            {tool.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-semibold">FAQ</h2>
          <div className="space-y-4">
            {tool.faq.map((f, i) => (
              <details key={i} className="rounded-lg border border-border bg-card p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {tips.length > 0 && (
        <section className="mt-10">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <span aria-hidden>💡</span> Tips
            </h2>
            <ul className="space-y-2 text-foreground/80">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Related tests</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="block rounded-lg border border-border bg-card p-4 transition hover:border-accent/50"
              >
                <span className="block font-medium">{t.name}</span>
                <span className="block text-sm text-foreground/60">{t.tagline}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Related guides</h2>
          <p className="mb-4 text-sm text-foreground/60">
            Learn more about what this test reveals and how to act on the results.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="flex flex-col rounded-lg border border-border bg-card p-4 transition hover:border-accent/50"
              >
                <span className="font-medium">{g.title}</span>
                {g.excerpt && (
                  <span className="mt-1 text-sm text-foreground/60">{g.excerpt}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
