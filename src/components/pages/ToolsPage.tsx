import type { Metadata } from "next";
import ToolCard, { TOOL_GRID } from "@/components/ToolCard";
import { toolsByCategory, type ToolCategory, INDEXED_TOOLS, NOVELTY_TOOLS } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";
import { fmt, type Lang } from "@/i18n/config";
import { getSite, getTools } from "@/i18n";

// The /tools listing in any language. Routes: (en)/tools/page.tsx and (intl)/<lang>/tools/page.tsx.

export function toolsMetadata(lang: Lang): Metadata {
  const meta = getSite(lang).meta;
  return pageMetadata({
    title: meta.toolsTitle,
    description: fmt(meta.toolsDescription, { n: INDEXED_TOOLS.length }),
    path: "/tools",
    lang,
  });
}

export default function ToolsPage({ lang }: { lang: Lang }) {
  const site = getSite(lang);
  const t = site.toolsPage;
  const tools = getTools(lang);
  const byCat = toolsByCategory(tools);
  const order: ToolCategory[] = ["panel", "color", "motion", "fun"];
  const n = tools.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <p className="eyebrow">{fmt(t.eyebrow, { n })}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-foreground/65">{fmt(t.intro, { n })}</p>
      {order.map((cat) => (
        <section key={cat} className="mt-10">
          <div className="flex items-baseline gap-3 border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">{site.categories[cat]}</h2>
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
      {/* Pranks and the screensaver: not display tests, noindexed, and listed only here.
          They exist in English only, so the translated listings leave them out. */}
      {lang === "en" && (
        <section className="mt-14">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">{t.funTitle}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t.funIntro}</p>
          </div>
          <div className={TOOL_GRID}>
            {NOVELTY_TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
