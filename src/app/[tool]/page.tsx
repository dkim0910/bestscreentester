import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, getTips, TOOLS, LISTING_LABELS } from "@/lib/tools";
import { pageMetadata, faqJsonLd, howToJsonLd, breadcrumbJsonLd, webAppJsonLd } from "@/lib/seo";
import { getGuidesForTool, getGuide } from "@/lib/guides";
import { getResults } from "@/lib/toolResults";
import ToolRunner from "@/components/tools/ToolRunner";
import ToolCard from "@/components/ToolCard";

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
    images: [`/og/tools/${tool.slug}.png`],
    noindex: tool.noindex,
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

  // Novelty pages only cross-link each other; indexed pages don't point at them.
  const related = TOOLS.filter(
    (t) =>
      t.category === tool.category &&
      t.slug !== tool.slug &&
      Boolean(t.noindex) === Boolean(tool.noindex),
  ).slice(0, 4);

  const results = getResults(tool.slug);
  const deepGuide = results?.guide ? getGuide(results.guide.slug) : undefined;
  // A test with its own deep guide links that one guide from the results section
  // instead of the generic four-card grid.
  const guides = deepGuide ? [] : getGuidesForTool(tool.slug);
  const tips = getTips(tool.slug);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd(tool.title, tool.howTo)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(tool.faq)) }}
      />
      {/* The breadcrumb below is visible to users but was invisible to crawlers. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
              { name: tool.name, path: `/${tool.slug}` },
            ]),
          ),
        }}
      />
      {/* Each tool is a free browser app; no aggregateRating, since there are no real reviews. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webAppJsonLd({
              name: tool.title,
              description: tool.description,
              path: `/${tool.slug}`,
              category: "UtilitiesApplication",
              image: `/og/tools/${tool.slug}.png`,
            }),
          ),
        }}
      />

      <nav className="mb-5 text-[13px] text-foreground/50">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/tools" className="hover:text-foreground">
          Tools
        </Link>{" "}
        / <span className="text-foreground/75">{tool.name}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{tool.noindex ? "Just for fun" : LISTING_LABELS[tool.category]}</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-[2.5rem] sm:leading-tight">{tool.title}</h1>
          <p className="mt-2 text-lg text-foreground/65">{tool.tagline}</p>
        </div>
        {deepGuide && results?.guide && (
          <Link href={`/blog/${deepGuide.slug}`} className="btn-ghost min-h-9! px-3.5! text-sm!">
            Read the guide →
          </Link>
        )}
      </header>

      <ToolRunner tool={tool} />

      <div className="mt-12 grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-[1.375rem] font-semibold tracking-tight">
              {results?.howToHeading ?? "How to use"}
            </h2>
            <ol className="border-b border-border">
              {tool.howTo.map((step, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-border py-3.5 text-foreground/85">
                  <span aria-hidden className="eyebrow leading-6!">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {results && (
            <section>
              <h2 className="mb-4 text-[1.375rem] font-semibold tracking-tight">{results.heading}</h2>
              {results.terms && (
                <dl className="panel mb-5 divide-y divide-border">
                  {results.terms.map((t) => (
                    <div key={t.name} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                      <dt className="font-medium">{t.name}</dt>
                      <dd className="text-foreground/70">{t.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {(results.pass || results.fail) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.pass && (
                    <div className="panel px-5 py-4">
                      <h3 className="flex items-center gap-2 pb-3 font-semibold">
                        <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />
                        Normal
                      </h3>
                      <ul className="text-[15px] leading-relaxed text-foreground/75">
                        {results.pass.map((p, i) => (
                          <li key={i} className="border-t border-border py-2.5">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.fail && (
                    <div className="panel px-5 py-4">
                      <h3 className="flex items-center gap-2 pb-3 font-semibold">
                        <span aria-hidden className="h-2 w-2 rounded-full bg-amber-400" />A fault
                      </h3>
                      <ul className="text-[15px] leading-relaxed text-foreground/75">
                        {results.fail.map((f, i) => (
                          <li key={i} className="border-t border-border py-2.5">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {results.threshold && (
                <p className="mt-5 leading-relaxed text-foreground/80">
                  <strong className="text-foreground">Where the line is drawn.</strong>{" "}
                  {results.threshold}
                </p>
              )}
              {results.note && <p className="mt-4 leading-relaxed text-foreground/80">{results.note}</p>}
              {deepGuide && results.guide && (
                <p className="mt-5">
                  <Link href={`/blog/${deepGuide.slug}`} className="font-medium text-accent-soft hover:underline">
                    Guide: {results.guide.label} →
                  </Link>
                </p>
              )}
            </section>
          )}

          {guides.length > 0 && (
            <section>
              <h2 className="mb-2 text-[1.375rem] font-semibold tracking-tight">Related guides</h2>
              <p className="mb-4 text-sm text-foreground/60">
                Learn more about what this test reveals and how to act on the results.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/blog/${g.slug}`}
                    className="panel flex flex-col p-4 transition-colors hover:border-border-strong"
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
        </div>

        <aside className="space-y-4">
          <section className="panel px-5 pb-2 pt-4">
            <h2 className="eyebrow pb-1">{results?.faqHeading ?? "FAQ"}</h2>
            <div className="divide-y divide-border">
              {tool.faq.map((f, i) => (
                <details key={i} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-foreground/40 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {tips.length > 0 && (
            <section className="panel px-5 py-4">
              <h2 className="eyebrow pb-2">Tips</h2>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/75">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section className="panel px-5 pt-4">
              <h2 className="eyebrow pb-1">Related tests</h2>
              {/* Same rows as the listings; the last one drops its divider inside the panel. */}
              <div className="[&>a:last-child]:border-b-0">
                {related.map((t) => (
                  <ToolCard key={t.slug} tool={t} compact />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
