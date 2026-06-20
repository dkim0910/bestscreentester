import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { toolsByCategory, CATEGORY_LABELS, type ToolCategory, TOOLS } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "All Screen Tests",
  description: `Browse all ${TOOLS.length} free online screen tests: dead pixel, color, backlight bleed, refresh rate, ghosting, blooming and more.`,
  path: "/tools",
});

export default function ToolsPage() {
  const byCat = toolsByCategory();
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">All screen tests</h1>
      <p className="mt-2 text-foreground/70">
        {TOOLS.length} free, browser-based tools. Pick a category below.
      </p>
      {order.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">{CATEGORY_LABELS[cat]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {byCat[cat].map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
