"use client";

import { usePathname } from "next/navigation";
import { LANGS, LANG_NAMES, isLocale, localePath, type Lang } from "@/i18n/config";

// The header's language menu. Each entry is a plain link to the same page in that
// language, so crawlers can follow them. From a page that exists in English only (a
// guide, the legal pages) the other languages link to their homepage instead.
// A <details> element, so it works before hydration and needs no state.
export default function LanguageSwitcher({
  lang,
  slugs,
  label,
}: {
  lang: Lang;
  slugs: readonly string[];
  label: string;
}) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  // The English path of the current page: the pathname minus any language prefix.
  const base = `/${(parts[0] && isLocale(parts[0]) ? parts.slice(1) : parts).join("/")}`;

  const target = (to: Lang) => {
    if (to === "en") return base;
    const localized = localePath(to, base, slugs);
    return localized === base ? `/${to}` : localized;
  };

  return (
    <details className="group relative">
      <summary
        aria-label={label}
        className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-2 text-foreground/70 transition-colors hover:text-foreground sm:px-3 [&::-webkit-details-marker]:hidden"
      >
        <span className="font-mono text-[13px] uppercase">{lang}</span>
        <span aria-hidden className="text-[10px] text-foreground/40 transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <ul className="absolute right-0 top-full z-50 mt-1 min-w-36 rounded-lg border border-border-strong bg-card py-1 shadow-lg">
        {LANGS.map((l) => (
          <li key={l}>
            {/* A plain <a>: the languages have separate root layouts, so this is a full page load. */}
            <a
              href={`${target(l).replace(/\/$/, "")}/`}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              className={`block px-3.5 py-2 text-sm transition-colors hover:bg-white/5 ${
                l === lang ? "font-medium text-foreground" : "text-foreground/70"
              }`}
            >
              {LANG_NAMES[l]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
