import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl" aria-hidden>
            🖥️
          </span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/tools" className="rounded-md px-3 py-2 hover:bg-white/5">
            All Tools
          </Link>
          <Link href="/blog" className="rounded-md px-3 py-2 hover:bg-white/5">
            Guides
          </Link>
          <Link href="/feedback" className="rounded-md px-3 py-2 hover:bg-white/5">
            Feedback
          </Link>
        </nav>
      </div>
    </header>
  );
}
