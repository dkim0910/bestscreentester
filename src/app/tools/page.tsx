import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">All screen tests</h1>
      <p className="mt-2 text-foreground/70">
        {INDEXED_TOOLS.length} free, browser-based screen tests. Pick a category below.
      </p>
      {order.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">{LISTING_LABELS[cat]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byCat[cat].map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
      {/* Pranks and the screensaver: not display tests, noindexed, and listed only here. */}
      <section className="mt-14 border-t border-border pt-8">
        <h2 className="mb-1 text-xl font-bold">Just for fun</h2>
        <p className="mb-4 text-sm text-foreground/60">
          Not screen tests: full-screen pranks and a screensaver.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NOVELTY_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
