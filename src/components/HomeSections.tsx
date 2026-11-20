import Image from "next/image";
import Link from "next/link";
import { INDEXED_TOOLS } from "@/lib/tools";
import { SITE_NAME, OPERATOR_NAME, faqJsonLd } from "@/lib/seo";
import { fmt, type Lang } from "@/i18n/config";
import { getSite, href, isEnglishOnly } from "@/i18n";

// Homepage long-form content. An earlier version mirrored a competitor's homepage
// section for section (an audit measured ~30% identical phrasing), so keep this in
// the site's own words, built on what these tools and guides actually do — and keep
// every threshold here consistent with the guides it links to.
//
// The text lives in src/i18n/<lang>/site.json under `home` (English in en/site.json).
// The arrays below hold only what is the same in every language: ids, links and tones.
// Each one pairs by position with the `items` array of the same section in site.json,
// so adding or reordering an entry means editing both.

// The four questions people arrive with, each with its test and its one deep guide.
// The card under the hero shows `summary`; `body` is printed in full further down.
const ANSWERS = [
  { id: "dead-pixel", test: "/dead-pixel-test", guide: "/blog/dead-pixel-warranty-policies" },
  { id: "black-screen-glow", test: "/backlight-bleed-test", guide: "/blog/what-is-backlight-bleed" },
  { id: "oled-ghost-image", test: "/burn-in-test", guide: "/blog/oled-burn-in-and-how-to-check-for-it" },
  { id: "slow-refresh-rate", test: "/refresh-rate-test", guide: "/blog/how-to-enable-full-refresh-rate-windows-mac" },
];

// `tag` in site.json condenses `usually` into one word; the tone here colors it.
type Tone = "normal" | "fault" | "depends";

const VERDICTS: { tone: Tone; guide?: string }[] = [
  { tone: "depends", guide: "/blog/dead-pixel-warranty-policies" },
  { tone: "depends", guide: "/blog/how-to-fix-a-stuck-pixel" },
  { tone: "fault" },
  { tone: "fault" },
  { tone: "normal", guide: "/blog/what-is-backlight-bleed" },
  { tone: "normal", guide: "/blog/what-is-backlight-bleed" },
  { tone: "normal" },
  { tone: "fault" },
  { tone: "normal" },
  { tone: "fault" },
  { tone: "depends" },
];

const NEWER_SCREENS = [
  "/hdr-test",
  "/pwm-flicker-test",
  "/wide-color-gamut-test",
  "/frame-skipping-test",
  "/blooming-test",
  "/brightness-uniformity-test",
];

// Six guides to start with. Each card is named after its guide and describes what
// that guide actually covers.
const FEATURED_GUIDES = [
  "/blog/what-is-backlight-bleed",
  "/blog/oled-burn-in-and-how-to-check-for-it",
  "/blog/how-to-test-a-laptop-screen-for-dead-pixels",
  "/blog/how-to-test-a-used-phone-screen-before-buying",
  "/blog/how-to-test-a-tv-for-defects",
  "/blog/how-to-test-a-monitor-before-buying",
];

const TONE_CLASS: Record<Tone, string> = {
  normal: "bg-emerald-400/12 text-emerald-400",
  fault: "bg-amber-400/12 text-amber-400",
  depends: "bg-white/8 text-foreground/75",
};

const CARD = "panel block p-5 transition-colors hover:border-border-strong";

/** " (in English)" after a link that leaves a translated page for an English-only one. */
function englishTag(lang: Lang): string {
  return isEnglishOnly(lang, "/blog") ? ` (${getSite(lang).common.inEnglish})` : "";
}

/** Left-aligned section heading: small label, title, and an optional note or link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {subtitle && <p className="max-w-md text-[15px] leading-relaxed text-foreground/60">{subtitle}</p>}
      {aside}
    </div>
  );
}

/** The four questions as cards, directly under the hero. The full text is HomeAnswersInFull. */
export function HomeAnswers({ lang }: { lang: Lang }) {
  const t = getSite(lang).home.answers;
  const english = englishTag(lang);
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ANSWERS.map((a, i) => (
            <article key={a.id} className="panel flex flex-col overflow-hidden">
              <div className="relative h-32 border-b border-border bg-black">
                <Image
                  src={`/previews${a.test}.png`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4.5">
                <h3 className="font-semibold leading-snug tracking-tight">{t.items[i].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{t.items[i].summary}</p>
                <div className="mt-auto flex flex-col gap-2.5 pt-4 text-[13px]">
                  <Link
                    href={href(lang, a.test)}
                    className="btn-ghost min-h-10! bg-card-2 px-3! text-center text-sm!"
                  >
                    {fmt(t.runTest, { name: t.items[i].test })}
                  </Link>
                  <Link href={a.guide} className="text-foreground/55 hover:text-foreground">
                    {fmt(t.guide, { name: t.items[i].guide })}
                    {english} →
                  </Link>
                  <a href={`#${a.id}`} className="text-foreground/55 hover:text-foreground">
                    {t.readFull} ↓
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The same four answers written out, below the tool list. */
export function HomeAnswersInFull({ lang }: { lang: Lang }) {
  const home = getSite(lang).home;
  const t = home.answers;
  const english = englishTag(lang);
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading
          eyebrow={home.inFull.eyebrow}
          title={home.inFull.title}
          subtitle={home.inFull.subtitle}
        />
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {ANSWERS.map((a, i) => (
            <article key={a.id} id={a.id} className="scroll-mt-20 border-t border-border pt-6">
              <h3 className="text-xl font-semibold tracking-tight">{t.items[i].title}</h3>
              {t.items[i].body.map((p, j) => (
                <p key={j} className="mt-3 leading-relaxed text-foreground/75">
                  {p}
                </p>
              ))}
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <Link href={href(lang, a.test)} className="font-medium text-accent-soft hover:underline">
                  {fmt(t.runTest, { name: t.items[i].test })} →
                </Link>
                <Link href={a.guide} className="text-foreground/60 hover:text-foreground hover:underline">
                  {fmt(t.guide, { name: t.items[i].guide })}
                  {english}
                </Link>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeSections({ lang }: { lang: Lang }) {
  const home = getSite(lang).home;
  const english = englishTag(lang);
  const n = INDEXED_TOOLS.length;
  const faqs = home.faq.items.map((f) => ({ q: fmt(f.q, { site: SITE_NAME }), a: f.a }));
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:space-y-20 sm:py-16">
      {/* Normal vs return-worthy */}
      <section>
        <SectionHeading
          eyebrow={home.verdicts.eyebrow}
          title={home.verdicts.title}
          subtitle={home.verdicts.subtitle}
        />
        <div className="panel divide-y divide-border overflow-hidden">
          <div className="eyebrow hidden gap-6 bg-card-2 px-5 py-3 md:grid md:grid-cols-[1.1fr_1.1fr_1.5fr]">
            <span>{home.verdicts.colSee}</span>
            <span>{home.verdicts.colUsually}</span>
            <span>{home.verdicts.colNext}</span>
          </div>
          {home.verdicts.items.map((v, i) => (
            <div key={v.see} className="grid gap-1.5 px-5 py-4 text-sm md:grid-cols-[1.1fr_1.1fr_1.5fr] md:gap-6">
              <span className="font-medium">{v.see}</span>
              <span className="text-foreground/70">
                <span
                  className={`mr-2 inline-block rounded-full px-2 py-px text-xs font-semibold ${TONE_CLASS[VERDICTS[i].tone]}`}
                >
                  {v.tag}
                </span>
                {v.usually}
              </span>
              <span className="text-foreground/70">
                {v.next}
                {VERDICTS[i].guide && v.guide && (
                  <>
                    {" "}
                    <Link href={VERDICTS[i].guide} className="text-accent-soft hover:underline">
                      {v.guide}
                      {english} →
                    </Link>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Newer display tech */}
      <section>
        <SectionHeading
          eyebrow={home.newer.eyebrow}
          title={home.newer.title}
          subtitle={home.newer.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.newer.items.map((t, i) => (
            <Link key={t.name} href={href(lang, NEWER_SCREENS[i])} className={`group ${CARD}`}>
              <h3 className="font-semibold group-hover:text-accent-soft">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{t.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured guides */}
      <section>
        <SectionHeading
          eyebrow={home.guides.eyebrow}
          title={home.guides.title}
          subtitle={home.guides.subtitle}
          aside={
            <Link href="/blog" className="text-sm font-medium text-accent-soft hover:underline">
              {home.guides.all}
              {english} →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.guides.items.map((g, i) => (
            <Link key={g.name} href={FEATURED_GUIDES[i]} className={`group ${CARD}`}>
              <h3 className="font-semibold group-hover:text-accent-soft">{g.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{g.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Prep */}
      <section>
        <SectionHeading
          eyebrow={home.prep.eyebrow}
          title={home.prep.title}
          subtitle={home.prep.subtitle}
        />
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {home.prep.items.map((t, i) => (
            <li key={t.title} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-border py-5">
              <span className="eyebrow leading-6!">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
        <SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} />
        <div className="panel divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-foreground/40 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Who makes this */}
      <section className="panel flex flex-wrap items-center justify-between gap-6 p-7 sm:p-9">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{fmt(home.who.title, { site: SITE_NAME })}</h2>
          <p className="mt-3 leading-relaxed text-foreground/70">
            {fmt(home.who.body, { site: SITE_NAME, operator: OPERATOR_NAME })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href(lang, "/tools")} className="btn-primary">
            {fmt(home.who.browse, { n })}
          </Link>
          <Link href="/about" className="btn-ghost">
            {home.who.about}
          </Link>
          <Link href="/feedback" className="btn-ghost">
            {home.who.feedback}
          </Link>
        </div>
      </section>
    </div>
  );
}
