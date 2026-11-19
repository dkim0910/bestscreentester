import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

const COMPANY: { name: string; href: string }[] = [
  { name: "About", href: "/about" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/feedback" },
];

function Column({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-foreground/65">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-foreground">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-11 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <img
              src="/logo-mark.png"
              alt={`${SITE_NAME} logo`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-md"
            />
            <span className="text-[17px]">{SITE_NAME}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">
            Free, browser-based screen tests. No install, no sign-up required.
          </p>
        </div>
        <Column
          title="Popular tests"
          links={TOOLS.slice(0, 5).map((t) => ({ name: t.name, href: `/${t.slug}` }))}
        />
        <Column
          title="Explore"
          links={[
            { name: "All tools", href: "/tools" },
            { name: "Guides & articles", href: "/blog" },
          ]}
        />
        <Column title="Company" links={COMPANY} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-foreground/50">
          © {year} {SITE_NAME}. All tests run locally in your browser.
        </div>
      </div>
    </footer>
  );
}
