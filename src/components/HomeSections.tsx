import Image from "next/image";
import Link from "next/link";
import { INDEXED_TOOLS } from "@/lib/tools";
import { SITE_NAME, OPERATOR_NAME, faqJsonLd } from "@/lib/seo";

// Homepage long-form content. An earlier version mirrored a competitor's homepage
// section for section (an audit measured ~30% identical phrasing), so keep this in
// the site's own words, built on what these tools and guides actually do — and keep
// every threshold here consistent with the guides it links to.

type LinkRef = { name: string; href: string };

// The written sections directly under the hero: the four questions people arrive
// with, answered in prose, each with its test and its one deep guide. These replaced
// a twelve-card grid of bare links. Thresholds come from the linked guides.
// `summary` is the card under the hero: a condensed version of `body`, which is printed
// in full further down the page. Keep the two saying the same thing.
const ANSWERS: {
  id: string;
  title: string;
  summary: string;
  body: string[];
  test: LinkRef;
  guide: LinkRef;
}[] = [
  {
    id: "dead-pixel",
    title: "A dot that won't go away",
    summary:
      "Dark on every color, white included, is a dead pixel and will not come back. One held color is stuck, and stuck pixels sometimes recover.",
    body: [
      "Step through solid colors and watch the dot. If it stays dark on every color, white included, it is a dead pixel and it will not come back. If it holds one color, or glows on black, it is stuck, and stuck pixels sometimes recover: the last frame of the Dead Pixel Test flashes colors over the spot for that purpose. Wipe the screen before you decide, because dust looks identical until it moves.",
      "Whether it is worth a return depends less on the dot than on the calendar. Manufacturers allow a small number of faults per panel, count bright pixels more strictly than dark ones, and often replace a cluster while refusing scattered dots. A full row or column is a connection fault and almost always qualifies. Inside the retailer's return window none of those counts apply to you, which is the reason to test on the first day.",
    ],
    test: { name: "Dead Pixel Test", href: "/dead-pixel-test" },
    guide: { name: "Dead pixel warranty policies", href: "/blog/dead-pixel-warranty-policies" },
  },
  {
    id: "black-screen-glow",
    title: "Glow on a black screen",
    summary:
      "A glow that shifts and fades as you move is IPS glow, a trait of the panel type. Streaks along an edge that stay put are backlight bleed.",
    body: [
      "Nearly every LCD shows some light on black, because it makes black by blocking a backlight that never switches off. Put up a black screen in a dark room and lean about a foot to each side. A glow that shifts and fades as you move is IPS glow: a trait of the panel type, not a defect, and almost never covered by warranty. Streaks or patches along an edge that stay exactly where they are is backlight bleed.",
      "A workable rule: if you can't see it while watching a film with the lights on, ignore it. A bright streak that shows during normal use, in dark game scenes or the bars around a film, is worth acting on. Judge it with your eyes at the brightness you actually use. Phone cameras take long exposures in the dark and make a faint haze look alarming. An OLED should show neither.",
    ],
    test: { name: "Backlight Bleed Test", href: "/backlight-bleed-test" },
    guide: { name: "Backlight bleed and IPS glow", href: "/blog/what-is-backlight-bleed" },
  },
  {
    id: "oled-ghost-image",
    title: "A ghost image on an OLED",
    summary:
      "Play varied full-screen video for an hour or two, then look again. Image retention fades. Burn-in is exactly where you left it.",
    body: [
      "A faint outline of a taskbar, a channel logo or a game's HUD on a grey screen is one of two things, and time tells them apart. Play varied full-screen video for an hour or two, then look at the same grey field again. Image retention will have faded or gone. Burn-in will be exactly where you left it, because the pixels there are worn rather than stuck.",
      "Look for a shape you recognize. Random blotches with no clear edge are more likely ordinary panel non-uniformity. Burn-in can't be removed, only slowed: lower the brightness, hide static elements, and let the panel run its compensation cycle. Some manufacturers now cover it under warranty for a limited period, so read that clause before assuming either way.",
    ],
    test: { name: "Burn-in Test", href: "/burn-in-test" },
    guide: { name: "OLED burn-in: how to check", href: "/blog/oled-burn-in-and-how-to-check-for-it" },
  },
  {
    id: "slow-refresh-rate",
    title: "A fast monitor that doesn't feel fast",
    summary:
      "A 144 Hz monitor reading 60 Hz is almost never faulty. The rate is not selected, the cable can't carry it, or a power-saving mode lowered it.",
    body: [
      "Measure it before you blame the panel. A 144 Hz monitor reading 60 Hz is almost never faulty: the higher rate hasn't been selected in the display settings, the cable or port can't carry it at that resolution, or a power-saving mode has lowered it. A reading within about 1 Hz of the rating is normal, since many displays run a fraction off their nominal rate.",
      "If the number is right and motion still looks wrong, look at the trail behind a moving object. A smeared trail is ghosting from slow pixel response; a bright fringe is overshoot from overdrive set too high, and one notch down usually cures it. A soft, even blur with no afterimage is not a fault. Every display that holds each frame still produces it.",
    ],
    test: { name: "Refresh Rate Test", href: "/refresh-rate-test" },
    guide: { name: "Enable your full refresh rate", href: "/blog/how-to-enable-full-refresh-rate-windows-mac" },
  },
];

// `tag` condenses `usually` into one word and a tone; it must not say more than that text does.
type Tone = "normal" | "fault" | "depends";

const VERDICTS: {
  see: string;
  tag: { label: string; tone: Tone };
  usually: string;
  next: string;
  guide?: LinkRef;
}[] = [
  {
    see: "One dark (dead) pixel",
    tag: { label: "Often allowed", tone: "depends" },
    usually: "Often within the maker's allowance",
    next: "Check the pixel policy. Inside the return window you can usually just send it back.",
    guide: { name: "Pixel policies", href: "/blog/dead-pixel-warranty-policies" },
  },
  {
    see: "One bright or stuck pixel",
    tag: { label: "Stricter", tone: "depends" },
    usually: "Counted more strictly than a dark one",
    next: "Try the stuck-pixel fixer in the Dead Pixel Test, then check the policy.",
    guide: { name: "Fixing a stuck pixel", href: "/blog/how-to-fix-a-stuck-pixel" },
  },
  {
    see: "Several faults close together",
    tag: { label: "Often qualifies", tone: "fault" },
    usually: "Clusters often qualify when scattered faults don't",
    next: "Photograph them on a solid color and count them by type.",
  },
  {
    see: "A whole row or column lit or dark",
    tag: { label: "Fault", tone: "fault" },
    usually: "A connection fault, not a pixel defect",
    next: "This almost always qualifies for service. Contact support.",
  },
  {
    see: "Faint glow in the corners on a black screen",
    tag: { label: "Normal", tone: "normal" },
    usually: "Normal on nearly every LCD",
    next: "Only worth returning if it's uneven or visible in everyday use.",
    guide: { name: "Backlight bleed", href: "/blog/what-is-backlight-bleed" },
  },
  {
    see: "A glow that moves when you move your head",
    tag: { label: "Normal", tone: "normal" },
    usually: "IPS glow, a trait of the panel type",
    next: "Not a defect. Sitting further back or adding a little room light reduces it.",
    guide: { name: "Bleed or IPS glow?", href: "/blog/what-is-backlight-bleed" },
  },
  {
    see: "Corners a little darker than the center",
    tag: { label: "Normal", tone: "normal" },
    usually: "Some falloff is normal on every LCD",
    next: "A distinct patch with a visible edge is not; that one is worth returning.",
  },
  {
    see: "Blotches on a laptop screen, often in a line",
    tag: { label: "Fault", tone: "fault" },
    usually: "Pressure marks, a mechanical fault",
    next: "Worth returning, especially on a new laptop.",
  },
  {
    see: "An OLED outline that fades after varied content",
    tag: { label: "Temporary", tone: "normal" },
    usually: "Temporary image retention",
    next: "Play varied full-screen video for a while and check again.",
  },
  {
    see: "An OLED outline that never fades",
    tag: { label: "Permanent", tone: "fault" },
    usually: "Burn-in, which is permanent",
    next: "Check whether your warranty covers burn-in; some now do.",
  },
  {
    see: "60 Hz on a 144 Hz monitor",
    tag: { label: "Setting", tone: "depends" },
    usually: "A setting or cable problem, not a faulty panel",
    next: "Select the full rate in your display settings, check the cable, then test again.",
  },
];

const NEWER_SCREENS: (LinkRef & { body: string })[] = [
  {
    name: "HDR Test",
    href: "/hdr-test",
    body: "A real HDR image with brightness steps up to 1,600 nits, so you can see where your screen stops getting brighter.",
  },
  {
    name: "PWM Flicker Test",
    href: "/pwm-flicker-test",
    body: "Catch a flickering backlight with the pencil test, or a fast line that splits into copies on PWM-dimmed screens.",
  },
  {
    name: "Wide Color Gamut (P3) Test",
    href: "/wide-color-gamut-test",
    body: "Logos hidden in Display P3 colors only appear if both your screen and your browser go beyond sRGB.",
  },
  {
    name: "Frame Skipping Test",
    href: "/frame-skipping-test",
    body: "One cell lights per frame. Photograph it to find out whether an overclocked monitor quietly drops frames.",
  },
  {
    name: "Blooming zone sweeps",
    href: "/blooming-test",
    body: "Count how often the halo jumps as a square crosses the screen to estimate a Mini-LED's dimming zones.",
  },
  {
    name: "Panning grey",
    href: "/brightness-uniformity-test",
    body: "Drifting grey bands that expose the dirty screen effect large TVs show when the camera pans.",
  },
];

// Six guides to start with. Each card is named after its guide and describes what
// that guide actually covers.
const FEATURED_GUIDES: (LinkRef & { body: string })[] = [
  {
    name: "Backlight bleed or IPS glow?",
    href: "/blog/what-is-backlight-bleed",
    body: "A one-second test that separates the two, a side-by-side table, and the things that are neither: clouding, blooming and a raised black level.",
  },
  {
    name: "OLED burn-in",
    href: "/blog/oled-burn-in-and-how-to-check-for-it",
    body: "What wears an OLED, how to check for it on grey, how to tell it from retention that fades, and which habits slow it down.",
  },
  {
    name: "Laptops",
    href: "/blog/how-to-test-a-laptop-screen-for-dead-pixels",
    body: "A 60-second pixel check, plus the things that look like dead pixels on a laptop but aren't, such as corner glow and lid pressure marks.",
  },
  {
    name: "Secondhand phones",
    href: "/blog/how-to-test-a-used-phone-screen-before-buying",
    body: "What to check before you hand over money: retained images on OLED, areas that ignore touch, a replacement panel, and flicker.",
  },
  {
    name: "TVs",
    href: "/blog/how-to-test-a-tv-for-defects",
    body: "Get a test pattern up with the TV's browser or your phone, then judge pixels and uniformity from where you actually sit.",
  },
  {
    name: "Monitors, in the store and at home",
    href: "/blog/how-to-test-a-monitor-before-buying",
    body: "What you can check before paying, what to run on day one, and the red flags worth a return, the cable included.",
  },
];

const PREP = [
  {
    title: "Let it warm up",
    body: "A cold panel's brightness and color drift slightly at first. Give it about five minutes before testing, and 20–30 minutes before calibrating.",
  },
  {
    title: "Switch off the filters",
    body: "Night Light, Night Shift, True Tone, dynamic contrast and eye-care modes all change what you see. Turn them off for color and greyscale checks.",
  },
  {
    title: "Dim the lights",
    body: "Bleed, blooming and black-level tests need a properly dark room. Everything else works best dimly lit, with no reflections on the glass.",
  },
  {
    title: "Use the native resolution",
    body: "A scaled resolution softens fine detail and can blur a single bad pixel into its neighbors. Set your system to the panel's native resolution.",
  },
  {
    title: "Fill the whole screen",
    body: "Browser bars and the taskbar cover the edges, which is where bleed and dead pixels like to hide. Every test has a full-screen Start button.",
  },
  {
    title: "Photograph what you find",
    body: "Lock your phone camera's exposure, shoot in a dark room and note the date. That photo is your evidence for a return or warranty claim.",
  },
];

const FAQS = [
  {
    q: `Is ${SITE_NAME} free?`,
    a: "Yes. Every test is free to use, with no account and nothing to download. The site is supported by ads and donations.",
  },
  {
    q: "Is anything uploaded when I run a test?",
    a: "No. Your browser draws the test patterns on your own device, and nothing about your screen is sent anywhere. Like most websites, the site uses analytics and ads; the Privacy page lists what they collect.",
  },
  {
    q: "Do the tests work on phones and tablets?",
    a: "Yes, in any modern mobile browser. iPhone Safari doesn't let websites go truly full-screen, so there a test fills the browser window instead. The Touch Screen Test is built specifically for phones and tablets.",
  },
  {
    q: "Can a browser test be accurate?",
    a: "For defects you can see, yes: a full-screen solid color shows a dead pixel or backlight bleed just as clearly as dedicated software would. Measurements such as Delta E, brightness in nits or contrast ratio need a colorimeter; these tests show what those problems look like, not the numbers.",
  },
  {
    q: "How many dead pixels are acceptable?",
    a: "It depends on the manufacturer's pixel policy. One dark pixel often falls within the allowance, while bright pixels and clusters are treated more strictly. Inside the retailer's return window you usually don't need to argue about counts at all.",
  },
  {
    q: "Which test should I run first on a new screen?",
    a: "The Dead Pixel Test. Then check for bleed on black, uniformity on grey and banding in the gradients, and on a monitor or TV finish with the refresh rate. The new-device checklist in our guides walks through the full order.",
  },
];

const TONE_CLASS: Record<Tone, string> = {
  normal: "bg-emerald-400/12 text-emerald-400",
  fault: "bg-amber-400/12 text-amber-400",
  depends: "bg-white/8 text-foreground/75",
};

const CARD = "panel block p-5 transition-colors hover:border-border-strong";

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
export function HomeAnswers() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading
          eyebrow="Start from the symptom"
          title="Is it a defect, or is it normal?"
          subtitle="The four questions people bring here most often, each with the test that answers it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ANSWERS.map((a) => (
            <article key={a.id} className="panel flex flex-col overflow-hidden">
              <div className="relative h-32 border-b border-border bg-black">
                <Image
                  src={`/previews${a.test.href}.png`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4.5">
                <h3 className="font-semibold leading-snug tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{a.summary}</p>
                <div className="mt-auto flex flex-col gap-2.5 pt-4 text-[13px]">
                  <Link
                    href={a.test.href}
                    className="btn-ghost min-h-10! bg-card-2 px-3! text-center text-sm!"
                  >
                    Run the {a.test.name}
                  </Link>
                  <Link href={a.guide.href} className="text-foreground/55 hover:text-foreground">
                    Guide: {a.guide.name} →
                  </Link>
                  <a href={`#${a.id}`} className="text-foreground/55 hover:text-foreground">
                    Read the full answer ↓
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
export function HomeAnswersInFull() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading
          eyebrow="In detail"
          title="How to tell a defect from a quirk"
          subtitle="Most screens have small quirks. This is how to answer each of the four questions with a test."
        />
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {ANSWERS.map((a) => (
            <article key={a.id} id={a.id} className="scroll-mt-20 border-t border-border pt-6">
              <h3 className="text-xl font-semibold tracking-tight">{a.title}</h3>
              {a.body.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-foreground/75">
                  {p}
                </p>
              ))}
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <Link href={a.test.href} className="font-medium text-accent-soft hover:underline">
                  Run the {a.test.name} →
                </Link>
                <Link href={a.guide.href} className="text-foreground/60 hover:text-foreground hover:underline">
                  Guide: {a.guide.name}
                </Link>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeSections() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:space-y-20 sm:py-16">
      {/* Normal vs return-worthy */}
      <section>
        <SectionHeading
          eyebrow="Quick reference"
          title="Normal, or worth returning?"
          subtitle="The same verdicts at a glance, for the faults people ask about most."
        />
        <div className="panel divide-y divide-border overflow-hidden">
          <div className="eyebrow hidden gap-6 bg-card-2 px-5 py-3 md:grid md:grid-cols-[1.1fr_1.1fr_1.5fr]">
            <span>What you see</span>
            <span>What it usually is</span>
            <span>What to do</span>
          </div>
          {VERDICTS.map((v) => (
            <div key={v.see} className="grid gap-1.5 px-5 py-4 text-sm md:grid-cols-[1.1fr_1.1fr_1.5fr] md:gap-6">
              <span className="font-medium">{v.see}</span>
              <span className="text-foreground/70">
                <span
                  className={`mr-2 inline-block rounded-full px-2 py-px text-xs font-semibold ${TONE_CLASS[v.tag.tone]}`}
                >
                  {v.tag.label}
                </span>
                {v.usually}
              </span>
              <span className="text-foreground/70">
                {v.next}
                {v.guide && (
                  <>
                    {" "}
                    <Link href={v.guide.href} className="text-accent-soft hover:underline">
                      {v.guide.name} →
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
          eyebrow="Newer screens"
          title="Tests for newer screens"
          subtitle="HDR, Mini-LED, OLED and high-refresh panels fail in ways a solid color can't show."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEWER_SCREENS.map((t) => (
            <Link key={t.name} href={t.href} className={`group ${CARD}`}>
              <h3 className="font-semibold group-hover:text-accent-soft">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{t.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured guides */}
      <section>
        <SectionHeading
          eyebrow="Guides"
          title="Guides to read first"
          subtitle="What a result means, and walkthroughs for laptops, phones, TVs and monitors."
          aside={
            <Link href="/blog" className="text-sm font-medium text-accent-soft hover:underline">
              All guides →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_GUIDES.map((g) => (
            <Link key={g.name} href={g.href} className={`group ${CARD}`}>
              <h3 className="font-semibold group-hover:text-accent-soft">{g.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{g.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Prep */}
      <section>
        <SectionHeading
          eyebrow="Setup"
          title="Before you test"
          subtitle="A minute of setup makes every result easier to trust."
        />
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {PREP.map((t, i) => (
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
        />
        <SectionHeading eyebrow="FAQ" title="Questions" />
        <div className="panel divide-y divide-border">
          {FAQS.map((f) => (
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
          <h2 className="text-2xl font-semibold tracking-tight">Who makes {SITE_NAME}</h2>
          <p className="mt-3 leading-relaxed text-foreground/70">
            {SITE_NAME} is built and maintained by {OPERATOR_NAME}, an independent developer
            working alone. Every guide shows when it was last updated, and many link the standards and
            manufacturer documents they draw on.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools" className="btn-primary">
            Browse all {INDEXED_TOOLS.length} tests
          </Link>
          <Link href="/about" className="btn-ghost">
            About the site
          </Link>
          <Link href="/feedback" className="btn-ghost">
            Send feedback
          </Link>
        </div>
      </section>
    </div>
  );
}
