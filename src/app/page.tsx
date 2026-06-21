import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import QuickColors from "@/components/tools/QuickColors";
import HomeSections from "@/components/HomeSections";
import { TOOLS, toolsByCategory, CATEGORY_LABELS, type ToolCategory } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

export default function HomePage() {
  const byCat = toolsByCategory();
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Test your screen in seconds — right in your browser
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {SITE_NAME} runs a full suite of free display tests: dead pixels, color, backlight
            bleed, refresh rate, ghosting and more. No install, no sign-up.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dead-pixel-test"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Start Dead Pixel Test
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-white/5"
            >
              Browse all {TOOLS.length} tools
            </Link>
          </div>
        </div>
      </section>

      {/* Quick full-screen colors */}
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <QuickColors />
      </div>

      {/* Tool categories */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {order.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">{CATEGORY_LABELS[cat]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {byCat[cat].map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Long-form landing content (features, guides, FAQ, tips) */}
      <HomeSections />
    </div>
  );
}
