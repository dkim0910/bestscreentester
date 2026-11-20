import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";
import { fmt, type Lang } from "@/i18n/config";
import { getSite, href, TRANSLATED_SLUGS } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINK = "rounded-md px-2 py-2 text-foreground/70 transition-colors hover:text-foreground sm:px-3";

export default function Header({ lang }: { lang: Lang }) {
  const site = getSite(lang);
  const t = site.nav;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href={href(lang, "/")} className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight">
          <img
            src="/logo-mark.png"
            alt={fmt(site.common.logoAlt, { site: SITE_NAME })}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-md"
          />
          <span className="truncate text-[17px]">{SITE_NAME}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-2">
          <Link href={href(lang, "/tools")} className={NAV_LINK}>
            {t.tools}
          </Link>
          <Link href="/blog" className={NAV_LINK}>
            {t.guides}
          </Link>
          {/* Hidden on phones, where the links squeeze the site name out (measured at 375px:
              with Contact shown the name is cut to half in English, to a sliver in Spanish); both
              are in the footer. */}
          <Link href="/about" className={`hidden sm:block ${NAV_LINK}`}>
            {t.about}
          </Link>
          <Link href="/feedback" className={`hidden sm:block ${NAV_LINK}`}>
            {t.contact}
          </Link>
          <LanguageSwitcher lang={lang} slugs={TRANSLATED_SLUGS} label={t.language} />
          <Link
            href={href(lang, "/dead-pixel-test")}
            className="btn-primary ml-2 hidden min-h-9! px-3.5! text-sm! md:inline-flex"
          >
            {t.start}
          </Link>
        </nav>
      </div>
    </header>
  );
}
