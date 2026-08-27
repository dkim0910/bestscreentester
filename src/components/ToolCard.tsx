import Image from "next/image";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/20"
    >
      <span className="font-semibold group-hover:text-accent">{tool.name}</span>
      <span className="mt-1.5 text-sm text-foreground/60">{tool.tagline}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent/70 transition-colors duration-200 group-hover:text-accent">
        Open test
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
      {/* Hover preview: the actual pattern this test displays, full-bleed.
          Pure CSS reveal (group-hover) — server component, no JS. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <Image
          src={`/previews/${tool.slug}.png`}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-4 pb-2.5 pt-8 text-sm font-semibold text-accent">
          {tool.name}
          <span>→</span>
        </span>
      </span>
    </Link>
  );
}
