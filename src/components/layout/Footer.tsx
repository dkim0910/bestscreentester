import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";
import { fmt, LANGS, LANG_NAMES, type Lang } from "@/i18n/config";
import { getSite, getTools, href } from "@/i18n";

function Column({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="eyebrow mb-2">{title}</h3>
      <ul className="text-sm text-foreground/65">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-1 transition-colors hover:text-foreground">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const site = getSite(lang);
  const t = site.footer;
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-11 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 md:col-span-1">
          <Link href={href(lang, "/")} className="flex items-center gap-2.5 font-semibold tracking-tight">
            <img
              src="/logo-mark.png"
              alt={fmt(site.common.logoAlt, { site: SITE_NAME })}
              width={28}
              height={28}
              className="h-7 w-7 rounded-md"
            />
            <span className="text-[17px]">{SITE_NAME}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">{t.blurb}</p>
        </div>
        <Column
          title={t.popular}
          links={getTools(lang)
            .slice(0, 5)
            .map((tool) => ({ name: tool.name, href: href(lang, `/${tool.slug}`) }))}
        />
        <Column
          title={t.explore}
          links={[
            { name: t.allTools, href: href(lang, "/tools") },
            { name: t.guides, href: "/blog" },
          ]}
        />
        <Column
          title={t.company}
          links={[
            { name: t.about, href: "/about" },
            { name: t.privacy, href: "/privacy" },
            { name: t.terms, href: "/terms" },
            { name: t.donate, href: "/donate" },
            { name: t.contact, href: "/feedback" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-3 text-xs text-foreground/50">
          <span>
            © {year} {SITE_NAME}. {t.copyright}
          </span>
          {/* Every language's homepage, as plain links (separate root layouts: full page loads). */}
          <nav aria-label={t.languages} className="flex flex-wrap gap-x-4">
            {LANGS.map((l) => (
              <a
                key={l}
                href={l === "en" ? "/" : `/${l}/`}
                hrefLang={l}
                lang={l}
                className={`py-1 transition-colors hover:text-foreground ${l === lang ? "text-foreground/80" : ""}`}
              >
                {LANG_NAMES[l]}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
