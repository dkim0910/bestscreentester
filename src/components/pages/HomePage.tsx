import type { Metadata } from "next";
import Link from "next/link";
import ToolCard, { TOOL_GRID } from "@/components/ToolCard";
import ScreenReadout from "@/components/ScreenReadout";
import QuickColors from "@/components/tools/QuickColors";
import HomeSections, { HomeAnswers, HomeAnswersInFull, SectionHeading } from "@/components/HomeSections";
import { INDEXED_TOOLS, toolsByCategory, type ToolCategory } from "@/lib/tools";
import { SITE_NAME, pageMetadata } from "@/lib/seo";
import { fmt, type Lang } from "@/i18n/config";
import { getSite, getTools, href } from "@/i18n";

// The homepage in any language. Routes: src/app/(en)/page.tsx and (intl)/<lang>/page.tsx.

// Without this the homepage inherits only the layout defaults: no canonical, no OG,
// no Twitter card, and a 90-char title Bing flags as too long.
//
// The title is set explicitly because `title.template` in the root layout applies only
// to *child* segments — the homepage sits in the same segment as its layout, so a bare
// string here would ship without the brand suffix every other page gets.
export function homeMetadata(lang: Lang): Metadata {
  const meta = getSite(lang).meta;
  return {
    ...pageMetadata({
      title: meta.homeTitle,
      description: fmt(meta.homeDescription, { n: INDEXED_TOOLS.length }),
      path: "/",
      keywords: meta.homeKeywords,
      lang,
    }),
    title: { absolute: `${meta.homeTitle} · ${SITE_NAME}` },
  };
}

export default function HomePage({ lang }: { lang: Lang }) {
  const site = getSite(lang);
  const t = site.home;
  // The novelty pages (pranks, screensaver) are noindexed and live on /tools only.
  const tools = getTools(lang);
  const byCat = toolsByCategory(tools);
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];
  const n = tools.length;
  const colorTest = tools.find((tool) => tool.slug === "color-test")!;

  return (
    <div>
      {/* Hero: the pitch on the left, the visitor's own screen read live on the right. */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:py-18">
          <div>
            <p className="eyebrow">{fmt(t.hero.eyebrow, { n })}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.25rem]">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/65">{fmt(t.hero.intro, { n })}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={href(lang, "/dead-pixel-test")} className="btn-primary">
                {t.hero.primary}
              </Link>
              <Link href={href(lang, "/tools")} className="btn-ghost">
                {fmt(t.hero.secondary, { n })}
              </Link>
            </div>
          </div>
          <ScreenReadout />
        </div>
      </section>

      {/* Quick colors: a test starts without leaving the page. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <QuickColors tool={colorTest} />
        </div>
      </section>

      {/* What people are actually asking when they arrive, as four cards. */}
      <HomeAnswers lang={lang} />

      {/* Tool categories */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading
            eyebrow={t.allTests.eyebrow}
            title={fmt(t.allTests.title, { n })}
            aside={
              <Link href={href(lang, "/tools")} className="text-sm font-medium text-accent-soft hover:underline">
                {t.allTests.link} →
              </Link>
            }
          />
          <div className="space-y-12">
            {order.map((cat) => (
              <section key={cat}>
                <div className="flex items-baseline gap-3 border-b border-border pb-3">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{site.categories[cat]}</h3>
                  <span className="eyebrow">
                    {fmt(byCat[cat].length === 1 ? site.common.testCountOne : site.common.testCountMany, {
                      n: byCat[cat].length,
                    })}
                  </span>
                </div>
                <div className={TOOL_GRID}>
                  {byCat[cat].map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} lang={lang} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* The four answers written out in full. */}
      <HomeAnswersInFull lang={lang} />

      {/* Long-form landing content (verdicts, guides, FAQ, tips) */}
      <HomeSections lang={lang} />
    </div>
  );
}
