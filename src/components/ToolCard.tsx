import Image from "next/image";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools";

/**
 * Container for a listing of ToolCards. They are hairline-divided rows, not gapped
 * cards, so the grid only sets the column gap.
 */
export const TOOL_GRID = "grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3";

/**
 * One test in a listing: a thumbnail of the pattern it displays, its name and summary.
 * `compact` is the small version for narrow columns (the tool page sidebar).
 */
export default function ToolCard({ tool, compact = false }: { tool: ToolDef; compact?: boolean }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className={`group grid items-center border-b border-border ${
        compact
          ? "grid-cols-[4.5rem_minmax(0,1fr)] gap-3.5 py-3.5"
          : "grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[8rem_minmax(0,1fr)]"
      }`}
    >
      {/* 16:10, the shape of the preview images. */}
      <span
        className={`relative block aspect-[16/10] overflow-hidden border border-border-strong bg-black transition-colors group-hover:border-accent-soft ${
          compact ? "rounded-md" : "rounded-lg"
        }`}
      >
        <Image
          src={`/previews/${tool.slug}.png`}
          alt=""
          fill
          sizes={compact ? "72px" : "128px"}
          className="object-cover"
        />
      </span>
      <span className="min-w-0">
        <span
          className={`block font-semibold leading-snug transition-colors group-hover:text-accent-soft ${
            compact ? "" : "text-lg tracking-tight"
          }`}
        >
          {tool.name}
        </span>
        <span
          className={`block leading-snug text-foreground/60 ${
            compact ? "mt-0.5 line-clamp-2 text-[13px]" : "mt-1 text-sm"
          }`}
        >
          {tool.tagline}
        </span>
      </span>
    </Link>
  );
}
