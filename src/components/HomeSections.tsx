import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME, OPERATOR_NAME, faqJsonLd } from "@/lib/seo";

// Homepage long-form content. An earlier version mirrored a competitor's homepage
// section for section (an audit measured ~30% identical phrasing), so keep this in
// the site's own words, built on what these tools and guides actually do — and keep
// every threshold here consistent with the guides it links to.

type LinkRef = { name: string; href: string };

const SYMPTOMS: { see: string; test: LinkRef; guide: LinkRef }[] = [
  {
    see: "A dot that stays one color",
    test: { name: "Dead Pixel Test", href: "/dead-pixel-test" },
    guide: { name: "Dead, stuck or hot?", href: "/blog/dead-vs-stuck-vs-hot-pixels" },
  },
  {
    see: "Glow along the edges in a dark room",
    test: { name: "Backlight Bleed Test", href: "/backlight-bleed-test" },
    guide: { name: "Bleed or IPS glow?", href: "/blog/backlight-bleed-vs-ips-glow" },
  },
  {
    see: "Patchy or uneven brightness",
    test: { name: "Brightness Uniformity Test", href: "/brightness-uniformity-test" },
    guide: { name: "Checking a TV for defects", href: "/blog/how-to-test-a-tv-for-defects" },
  },
  {
    see: "A faint ghost of an old image on an OLED",
    test: { name: "Burn-in Test", href: "/burn-in-test" },
    guide: { name: "OLED burn-in", href: "/blog/oled-burn-in-and-how-to-check-for-it" },
  },
  {
    see: "A 144 Hz monitor that feels like 60",
    test: { name: "Refresh Rate Test", href: "/refresh-rate-test" },
    guide: { name: "Enable full refresh rate", href: "/blog/how-to-enable-full-refresh-rate-windows-mac" },
  },
  {
    see: "Smears trailing behind moving objects",
    test: { name: "Ghosting Test", href: "/ghosting-test" },
    guide: { name: "Fixing ghosting", href: "/blog/what-is-ghosting-and-how-to-fix-it" },
  },
  {
    see: "The picture splitting sideways in games",
    test: { name: "Screen Tearing Test", href: "/screen-tearing-test" },
    guide: { name: "V-Sync, G-Sync, FreeSync", href: "/blog/screen-tearing-vsync-gsync-freesync" },
  },
  {
    see: "Tired eyes when the brightness is low",
    test: { name: "PWM Flicker Test", href: "/pwm-flicker-test" },
    guide: { name: "PWM flicker", href: "/blog/what-is-pwm-flicker" },
  },
  {
    see: "Halos around bright objects on black",
    test: { name: "Blooming Test", href: "/blooming-test" },
    guide: { name: "Mini-LED vs OLED", href: "/blog/mini-led-vs-oled" },
  },
  {
    see: "Grey, washed-out blacks",
    test: { name: "Black Level Test", href: "/black-level-test" },
    guide: { name: "Full vs limited RGB", href: "/blog/full-vs-limited-rgb-range" },
  },
  {
    see: "Thin lines running across the screen",
    test: { name: "Color Test", href: "/color-test" },
    guide: { name: "Lines on the screen", href: "/blog/why-are-there-lines-on-my-screen" },
  },
  {
    see: "Stripes where a gradient should be smooth",
    test: { name: "Greyscale & Banding Test", href: "/greyscale-test" },
    guide: { name: "Color banding", href: "/blog/what-is-color-banding-and-how-to-reduce-it" },
  },
];

const VERDICTS: { see: string; usually: string; next: string; guide?: LinkRef }[] = [
  {
    see: "One dark (dead) pixel",
    usually: "Often within the maker's allowance",
    next: "Check the pixel policy. Inside the return window you can usually just send it back.",
    guide: { name: "Pixel policies", href: "/blog/dead-pixel-warranty-policies" },
  },
  {
    see: "One bright or stuck pixel",
    usually: "Counted more strictly than a dark one",
    next: "Try the stuck-pixel fixer in the Dead Pixel Test, then check the policy.",
    guide: { name: "Fixing a stuck pixel", href: "/blog/how-to-fix-a-stuck-pixel" },
  },
  {
    see: "Several faults close together",
    usually: "Clusters often qualify when scattered faults don't",
    next: "Photograph them on a solid color and count them by type.",
  },
  {
    see: "A whole row or column lit or dark",
    usually: "A connection fault, not a pixel defect",
    next: "This almost always qualifies for service. Contact support.",
  },
  {
    see: "Faint glow in the corners on a black screen",
    usually: "Normal on nearly every LCD",
    next: "Only worth returning if it's uneven or visible in everyday use.",
    guide: { name: "Backlight bleed", href: "/blog/what-is-backlight-bleed" },
  },
  {
    see: "A glow that moves when you move your head",
    usually: "IPS glow, a trait of the panel type",
    next: "Not a defect. Sitting further back or adding a little room light reduces it.",
    guide: { name: "IPS glow", href: "/blog/what-is-ips-glow" },
  },
  {
    see: "Corners a little darker than the center",
    usually: "Some falloff is normal on every LCD",
    next: "A distinct patch with a visible edge is not; that one is worth returning.",
  },
  {
    see: "Blotches on a laptop screen, often in a line",
    usually: "Pressure marks, a mechanical fault",
    next: "Worth returning, especially on a new laptop.",
  },
  {
    see: "An OLED outline that fades after varied content",
    usually: "Temporary image retention",
    next: "Play varied full-screen video for a while and check again.",
  },
  {
    see: "An OLED outline that never fades",
    usually: "Burn-in, which is permanent",
    next: "Check whether your warranty covers burn-in; some now do.",
  },
  {
    see: "60 Hz on a 144 Hz monitor",
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

// Each card is named after its guide and describes what that guide actually covers.
const DEVICE_GUIDES: (LinkRef & { body: string })[] = [
  {
    name: "Any new screen: the 10-minute checklist",
    href: "/blog/new-device-screen-test-checklist",
    body: "Seven checks in order, from dead pixels and dark-screen defects through motion and viewing angle, and what counts as a defect.",
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
  {
    name: "Which panel type?",
    href: "/blog/ips-vs-va-vs-tn-vs-oled",
    body: "TN, IPS, VA and OLED compared on color, contrast, speed and viewing angle, with a pick for gaming, work and movies.",
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

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-2xl text-foreground/60">{subtitle}</p>}
    </div>
  );
}

export default function HomeSections() {
  return (
    <div className="border-t border-border bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="mx-auto max-w-6xl space-y-20 px-4 py-20">
        {/* Symptom → test → guide */}
        <section>
          <SectionHeading
            title="What's wrong with my screen?"
            subtitle="Find what you're seeing, run the matching screen test, then read what the result means."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SYMPTOMS.map((s) => (
              <div key={s.see} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">{s.see}</h3>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <Link href={s.test.href} className="text-accent hover:underline">
                    Run the {s.test.name} →
                  </Link>
                  <Link href={s.guide.href} className="text-foreground/60 hover:text-foreground hover:underline">
                    Guide: {s.guide.name}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Normal vs return-worthy */}
        <section>
          <SectionHeading
            title="Normal, or worth returning?"
            subtitle="Most panels have small quirks. Here's how to tell them apart from real defects."
          />
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-foreground/50 md:grid md:grid-cols-[1.2fr_1fr_1.5fr]">
              <span>What you see</span>
              <span>What it usually is</span>
              <span>What to do</span>
            </div>
            {VERDICTS.map((v) => (
              <div key={v.see} className="grid gap-1 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_1.5fr] md:gap-4">
                <span className="font-medium">{v.see}</span>
                <span className="text-foreground/70">{v.usually}</span>
                <span className="text-foreground/70">
                  {v.next}
                  {v.guide && (
                    <>
                      {" "}
                      <Link href={v.guide.href} className="text-accent hover:underline">
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
            title="Tests for newer screens"
            subtitle="HDR, Mini-LED, OLED and high-refresh panels fail in ways a solid color can't show."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEWER_SCREENS.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:border-accent/50"
              >
                <h3 className="font-semibold group-hover:text-accent">{t.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">{t.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Device guides */}
        <section>
          <SectionHeading
            title="Testing a specific device?"
            subtitle="Step-by-step walkthroughs for laptops, phones, TVs and monitors."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEVICE_GUIDES.map((g) => (
              <Link
                key={g.name}
                href={g.href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:border-accent/50"
              >
                <h3 className="font-semibold group-hover:text-accent">{g.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">{g.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Prep */}
        <section>
          <SectionHeading title="Before you test" subtitle="A minute of setup makes every result easier to trust." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PREP.map((t) => (
              <div key={t.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
          />
          <SectionHeading title="Questions" />
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-lg border border-border bg-card p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Who makes this */}
        <section className="rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Who makes {SITE_NAME}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
            {SITE_NAME} is built and maintained by {OPERATOR_NAME}, currently a one-person
            operation. Every guide shows when it was last updated, and many link the standards and
            manufacturer documents they draw on.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Browse all {TOOLS.length} tests
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-white/5"
            >
              About the site
            </Link>
            <Link
              href="/feedback"
              className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-white/5"
            >
              Send feedback
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
