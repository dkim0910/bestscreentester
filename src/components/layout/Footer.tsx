import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 font-bold">
          <img
            src="/logo-mark.png"
            alt={`${SITE_NAME} logo`}
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl">{SITE_NAME}</span>
        </Link>
          <p className="mt-2 text-sm text-foreground/60">
            Free, browser-based screen tests. No install, no sign-up required.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground/80">Popular tests</h3>
          <ul className="space-y-1 text-sm text-foreground/60">
            {TOOLS.slice(0, 5).map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}`} className="hover:text-foreground">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground/80">Explore</h3>
          <ul className="space-y-1 text-sm text-foreground/60">
            <li>
              <Link href="/tools" className="hover:text-foreground">
                All tools
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Guides &amp; articles
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:text-foreground">
                Send feedback
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground/80">Company</h3>
          <ul className="space-y-1 text-sm text-foreground/60">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-foreground">
                Donate
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:text-foreground">
                Feedback
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-foreground/50">
        © {year} {SITE_NAME}. All tests run locally in your browser.
      </div>
    </footer>
  );
}
