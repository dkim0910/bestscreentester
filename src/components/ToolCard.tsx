import Link from "next/link";
import type { ToolDef } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-accent/5"
    >
      <span className="font-semibold group-hover:text-accent">{tool.name}</span>
      <span className="mt-1.5 text-sm text-foreground/60">{tool.tagline}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent/70 transition-colors duration-200 group-hover:text-accent">
        Open test
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
