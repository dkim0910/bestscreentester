import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

const NAV_LINK = "rounded-md px-2 py-2 text-foreground/70 transition-colors hover:text-foreground sm:px-3";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight">
          <img
            src="/logo-mark.png"
            alt={`${SITE_NAME} logo`}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-md"
          />
          <span className="truncate text-[17px]">{SITE_NAME}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-2">
          <Link href="/tools" className={NAV_LINK}>
            Tools
          </Link>
          <Link href="/blog" className={NAV_LINK}>
            Guides
          </Link>
          {/* Hidden on phones, where four links squeeze the site name out; it's in the footer. */}
          <Link href="/about" className={`hidden sm:block ${NAV_LINK}`}>
            About
          </Link>
          <Link href="/feedback" className={NAV_LINK}>
            Contact
          </Link>
          <Link href="/dead-pixel-test" className="btn-primary ml-2 hidden min-h-9! px-3.5! text-sm! md:inline-flex">
            Start a test
          </Link>
        </nav>
      </div>
    </header>
  );
}
