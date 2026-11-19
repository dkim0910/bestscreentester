import type { Metadata } from "next";
import Link from "next/link";
import ToolCard, { TOOL_GRID } from "@/components/ToolCard";
import ScreenReadout from "@/components/ScreenReadout";
import QuickColors from "@/components/tools/QuickColors";
import HomeSections, { HomeAnswers, HomeAnswersInFull, SectionHeading } from "@/components/HomeSections";
import { INDEXED_TOOLS, toolsByCategory, LISTING_LABELS, type ToolCategory } from "@/lib/tools";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

// Without this the homepage inherits only the layout defaults: no canonical, no OG,
// no Twitter card, and a 90-char title Bing flags as too long.
//
// The title is set explicitly because `title.template` in the root layout applies only
// to *child* segments — app/page.tsx sits in the same segment, so a bare string here
// would ship without the brand suffix every other page gets.
export const metadata: Metadata = {
  ...pageMetadata({
  title: "Free Online Screen Test",
  description:
    `Run ${INDEXED_TOOLS.length} free screen and monitor tests in your browser: dead pixels, backlight bleed, refresh rate, color, ghosting and more. No sign-up.`,
  path: "/",
  keywords: [
    "screen test",
    "monitor test",
    "dead pixel test",
    "display test",
    "online screen test",
  ],
  }),
  title: { absolute: `Free Online Screen Test · ${SITE_NAME}` },
};

export default function HomePage() {
  // The novelty pages (pranks, screensaver) are noindexed and live on /tools only.
  const byCat = toolsByCategory(INDEXED_TOOLS);
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];

  return (
    <div>
      {/* Hero: the pitch on the left, the visitor's own screen read live on the right. */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:py-18">
          <div>
            <p className="eyebrow">{INDEXED_TOOLS.length} free display tests</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.25rem]">
              Free Online Screen Test &amp; Monitor Test
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/65">
              {INDEXED_TOOLS.length} free display tests that run in your browser: dead pixels, backlight
              bleed, refresh rate, PWM flicker, HDR and more. Nothing to install, no account.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/dead-pixel-test" className="btn-primary">
                Start Dead Pixel Test
              </Link>
              <Link href="/tools" className="btn-ghost">
                Browse all {INDEXED_TOOLS.length} tests
              </Link>
            </div>
          </div>
          <ScreenReadout />
        </div>
      </section>

      {/* Quick colors: a test starts without leaving the page. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <QuickColors />
        </div>
      </section>

      {/* What people are actually asking when they arrive, as four cards. */}
      <HomeAnswers />

      {/* Tool categories */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading
            eyebrow="All tests"
            title={`${INDEXED_TOOLS.length} tests, grouped by what they check`}
            aside={
              <Link href="/tools" className="text-sm font-medium text-accent-soft hover:underline">
                Open the full list →
              </Link>
            }
          />
          <div className="space-y-12">
            {order.map((cat) => (
              <section key={cat}>
                <div className="flex items-baseline gap-3 border-b border-border pb-3">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{LISTING_LABELS[cat]}</h3>
                  <span className="eyebrow">
                    {byCat[cat].length} {byCat[cat].length === 1 ? "test" : "tests"}
                  </span>
                </div>
                <div className={TOOL_GRID}>
                  {byCat[cat].map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* The four answers written out in full. */}
      <HomeAnswersInFull />

      {/* Long-form landing content (verdicts, guides, FAQ, tips) */}
      <HomeSections />
    </div>
  );
}
