import Link from "next/link";
import type { ToolDef } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
    >
      <span className="text-3xl" aria-hidden>
        {tool.icon}
      </span>
      <span className="mt-3 font-semibold group-hover:text-accent">{tool.name}</span>
      <span className="mt-1 text-sm text-foreground/60">{tool.tagline}</span>
    </Link>
  );
}
