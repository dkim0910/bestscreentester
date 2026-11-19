import type { Metadata } from "next";
import ToolCard, { TOOL_GRID } from "@/components/ToolCard";
import {
  toolsByCategory,
  LISTING_LABELS,
  type ToolCategory,
  INDEXED_TOOLS,
  NOVELTY_TOOLS,
} from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "All Screen Tests",
  description: `Browse all ${INDEXED_TOOLS.length} free online screen tests: dead pixel, color, backlight bleed, refresh rate, ghosting, blooming and more.`,
  path: "/tools",
});

export default function ToolsPage() {
  const byCat = toolsByCategory(INDEXED_TOOLS);
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <p className="eyebrow">{INDEXED_TOOLS.length} tests</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">All screen tests</h1>
      <p className="mt-2 text-foreground/65">
        {INDEXED_TOOLS.length} free, browser-based screen tests. Pick a category below.
      </p>
      {order.map((cat) => (
        <section key={cat} className="mt-10">
          <div className="flex items-baseline gap-3 border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">{LISTING_LABELS[cat]}</h2>
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
      {/* Pranks and the screensaver: not display tests, noindexed, and listed only here. */}
      <section className="mt-14">
        <div className="border-b border-border pb-3">
          <h2 className="text-xl font-semibold tracking-tight">Just for fun</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Not screen tests: full-screen pranks and a screensaver.
          </p>
        </div>
        <div className={TOOL_GRID}>
          {NOVELTY_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
