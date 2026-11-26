import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, TOOLS, INDEXED_TOOLS } from "@/lib/tools";
import { pageMetadata, faqJsonLd, howToJsonLd, breadcrumbJsonLd, webAppJsonLd } from "@/lib/seo";
import { getGuidesForTool, getGuide } from "@/lib/guides";
import ToolRunner from "@/components/tools/ToolRunner";
import PixelVerdict from "@/components/tools/PixelVerdict";
import ToolCard from "@/components/ToolCard";
import { fmt, type Lang } from "@/i18n/config";
import { getSite, getResultsFor, getTipsFor, getTools, href, localizeTool } from "@/i18n";

// A test page in any language. Routes: src/app/(en)/[tool]/page.tsx (all 28 tools) and
// src/app/(intl)/<lang>/[tool]/page.tsx (the indexed tests only: the novelty pages are
// not translated). `toolRoute(lang)` returns what such a route file re-exports.

type Params = { params: Promise<{ tool: string }> };

export function toolRoute(lang: Lang) {
  const slugs = (lang === "en" ? TOOLS : INDEXED_TOOLS).map((t) => t.slug);

  function find(slug: string) {
    const tool = slugs.includes(slug) ? getTool(slug) : undefined;
    return tool ? localizeTool(tool, lang) : undefined;
  }

  return {
    generateStaticParams: () => slugs.map((tool) => ({ tool })),

    async generateMetadata({ params }: Params): Promise<Metadata> {
      const { tool: slug } = await params;
      const tool = find(slug);
      if (!tool) return {};
      return pageMetadata({
        title: tool.title,
        description: tool.description,
        path: `/${tool.slug}`,
        keywords: tool.keywords,
        images: [`/og/tools/${tool.slug}.png`],
        noindex: tool.noindex,
        lang,
      });
    },

    async Page({ params }: Params) {
      const { tool: slug } = await params;
      if (!find(slug)) notFound();
      return <ToolPage lang={lang} slug={slug} />;
    },
  };
}

function ToolPage({ lang, slug }: { lang: Lang; slug: string }) {
  const tool = localizeTool(getTool(slug)!, lang);
  const site = getSite(lang);
  const t = site.toolPage;
  const path = href(lang, `/${tool.slug}`);
  // Guides exist in English only; a translated page says so next to each guide link.
  const english = lang === "en" ? "" : ` (${site.common.inEnglish})`;

  // Novelty pages only cross-link each other; indexed pages don't point at them.
  const related = TOOLS.filter(
    (other) =>
      other.category === tool.category &&
      other.slug !== tool.slug &&
      Boolean(other.noindex) === Boolean(tool.noindex),
  )
    .slice(0, 4)
    .map((other) => localizeTool(other, lang));

  const results = getResultsFor(lang, tool.slug);
  const deepGuide = results?.guide ? getGuide(results.guide.slug) : undefined;
  // A test with its own deep guide links that one guide from the results section
  // instead of the generic four-card grid.
  const guides = deepGuide ? [] : getGuidesForTool(tool.slug);
  const tips = getTipsFor(lang, tool.slug);

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
              { name: site.common.home, path: href(lang, "/") },
              { name: site.common.tools, path: href(lang, "/tools") },
              { name: tool.name, path },
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
              path,
              category: "UtilitiesApplication",
              image: `/og/tools/${tool.slug}.png`,
              lang,
            }),
          ),
        }}
      />

      <nav className="mb-5 text-[13px] text-foreground/50">
        <Link href={href(lang, "/")} className="hover:text-foreground">
          {site.common.home}
        </Link>{" "}
        /{" "}
        <Link href={href(lang, "/tools")} className="hover:text-foreground">
          {site.common.tools}
        </Link>{" "}
        / <span className="text-foreground/75">{tool.name}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{tool.noindex ? site.toolsPage.funTitle : site.categories[tool.category]}</div>
          <h1 className="mt-2 text-[clamp(1.625rem,8.5vw,1.875rem)] leading-[1.2] font-bold tracking-tight wrap-break-word sm:text-[2.5rem] sm:leading-tight">{tool.title}</h1>
          <p className="mt-2 text-lg text-foreground/65">{tool.tagline}</p>
        </div>
        {deepGuide && results?.guide && (
          <Link href={`/blog/${deepGuide.slug}`} className="btn-ghost min-h-9! px-3.5! text-sm!">
            {t.readGuide}
            {english} →
          </Link>
        )}
      </header>

      {/* Only the checklist lists other tests; it gets their names in this page's language. */}
      <ToolRunner
        tool={tool}
        tools={
          tool.slug === "screen-test-checklist"
            ? getTools(lang).map((x) => ({ slug: x.slug, name: x.name, tagline: x.tagline }))
            : undefined
        }
      />

      <div className="mt-12 grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-[1.375rem] font-semibold tracking-tight">
              {results?.howToHeading ?? t.howTo}
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
                        {t.normal}
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
                        <span aria-hidden className="h-2 w-2 rounded-full bg-amber-400" />
                        {t.fault}
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
                  <strong className="text-foreground">{t.threshold}</strong>{" "}
                  {results.threshold}
                </p>
              )}
              {results.note && <p className="mt-4 leading-relaxed text-foreground/80">{results.note}</p>}
              {results.tables?.map((table) => (
                <figure key={table.title} className="mt-8">
                  <figcaption className="mb-2 text-lg font-semibold tracking-tight">{table.title}</figcaption>
                  {/* Wide tables scroll inside their own box, never the page. */}
                  <div className="panel overflow-x-auto">
                    <table className="w-full min-w-[30rem] border-collapse text-left text-[15px]">
                      <thead>
                        <tr className="bg-card-2">
                          {table.head.map((h, i) => (
                            <th key={i} scope="col" className="eyebrow px-4 py-2.5 font-medium">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, r) => (
                          <tr key={r} className="border-t border-border">
                            {row.map((cell, c) =>
                              c === 0 ? (
                                <th key={c} scope="row" className="px-4 py-2.5 align-top font-medium">
                                  {cell}
                                </th>
                              ) : (
                                <td key={c} className="px-4 py-2.5 align-top text-foreground/75">
                                  {cell}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {table.note && <p className="mt-2 text-sm text-foreground/60">{table.note}</p>}
                </figure>
              ))}
              {results.next && (
                <>
                  <h3 className="mb-1 mt-8 text-lg font-semibold tracking-tight">{t.next}</h3>
                  <ol className="border-b border-border">
                    {results.next.map((step, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[2rem_1fr] gap-2 border-t border-border py-3 text-[15px] text-foreground/80"
                      >
                        <span aria-hidden className="eyebrow leading-6!">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {deepGuide && results.guide && (
                <p className="mt-5">
                  <Link href={`/blog/${deepGuide.slug}`} className="font-medium text-accent-soft hover:underline">
                    {fmt(t.guide, { label: results.guide.label })}
                    {english} →
                  </Link>
                </p>
              )}
            </section>
          )}

          {tool.slug === "dead-pixel-test" && <PixelVerdict />}

          {guides.length > 0 && (
            <section>
              <h2 className="mb-2 text-[1.375rem] font-semibold tracking-tight">
                {t.relatedGuides}
                {english}
              </h2>
              <p className="mb-4 text-sm text-foreground/60">{t.relatedGuidesIntro}</p>
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
            <h2 className="eyebrow pb-1">{results?.faqHeading ?? t.faq}</h2>
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
              <h2 className="eyebrow pb-2">{t.tips}</h2>
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
              <h2 className="eyebrow pb-1">{t.relatedTests}</h2>
              {/* Same rows as the listings; the last one drops its divider inside the panel. */}
              <div className="[&>a:last-child]:border-b-0">
                {related.map((other) => (
                  <ToolCard key={other.slug} tool={other} compact lang={lang} />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
