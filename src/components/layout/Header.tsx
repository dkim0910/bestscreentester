import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold sm:gap-3">
          <img
            src="/logo-mark.png"
            alt={`${SITE_NAME} logo`}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <span className="truncate text-lg sm:text-xl">{SITE_NAME}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1">
          <Link href="/tools" className="rounded-md px-2 py-2 hover:bg-white/5 sm:px-3">
            All Tools
          </Link>
          <Link href="/blog" className="rounded-md px-2 py-2 hover:bg-white/5 sm:px-3">
            Guides
          </Link>
          <Link href="/feedback" className="rounded-md px-2 py-2 hover:bg-white/5 sm:px-3">
            Feedback
          </Link>
        </nav>
      </div>
    </header>
  );
}
