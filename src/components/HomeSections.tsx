import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME, faqJsonLd } from "@/lib/seo";

const CORE_TOOLS = [
  {
    name: "Dead Pixel Test",
    href: "/dead-pixel-test",
    body: "Solid-color fullscreen frame-by-frame scan. Detects bright pixels (always-on), dark pixels (unresponsive), and stuck pixels (fixed color). The essential first step for any new screen.",
  },
  {
    name: "Backlight Bleed",
    href: "/backlight-bleed-test",
    body: "Pure black fullscreen in a dark room to reveal LCD backlight leakage and IPS glow. Distinguishes fixed bleed (a defect) from IPS glow (a normal characteristic).",
  },
  {
    name: "Greyscale Test",
    href: "/greyscale-test",
    body: "256-level greyscale transition smoothness check. Reveals shadow crushing, highlight clipping, and color banding. Best used alongside gamma calibration.",
  },
  {
    name: "Color Accuracy",
    href: "/color-test",
    body: "Standard solid-color comparison for tint diagnosis. Grey backgrounds are the most sensitive — a green or red cast on grey points to color-accuracy issues.",
  },
  {
    name: "Color Gamut",
    href: "/color-gradient-test",
    body: "Smooth full-spectrum gradients to judge sRGB / DCI-P3 coverage and saturation. Instantly sanity-check a wide-gamut claim and spot transition banding.",
  },
  {
    name: "Refresh Rate",
    href: "/refresh-rate-test",
    body: "Real-time frame-rate detection to verify your panel's actual refresh rate. Advertised 144Hz but outputting 60Hz? This tool catches the configuration issue.",
  },
  {
    name: "Ghosting Test",
    href: "/ghosting-test",
    body: "Moving-block test for response time and grey-to-grey transition speed. IPS ~1ms, VA ~4–15ms — dark-scene ghosting is VA's biggest weakness.",
  },
  {
    name: "Blooming Test",
    href: "/blooming-test",
    body: "Mini-LED local-dimming precision test. A bright object on black reveals the halo overflow range — higher zone counts produce less blooming.",
  },
];

const TROUBLESHOOTING = [
  {
    title: "Bright or dark spots on screen",
    href: "/blog/why-does-my-screen-have-a-dark-spot",
    steps: [
      "Confirm with a solid-color fullscreen first — rule out dust on the glass.",
      "Verify the same spot appears across multiple solid colors.",
      "≥1 bright pixel or several clustered dark pixels — consider a return within the window.",
      "Screenshot/photograph the defect location as return evidence.",
    ],
  },
  {
    title: "Screen edge light leakage",
    href: "/blog/what-is-backlight-bleed",
    steps: [
      "Dark room + pure black fullscreen + maximum brightness.",
      "Distinguish IPS glow (shifts with viewing angle) from true bleed (fixed position).",
      "Assess severity at normal seating distance (50–70cm).",
      "Severe bleed warrants a return; IPS glow is a normal characteristic.",
    ],
  },
  {
    title: "Inaccurate or shifted colors",
    href: "/blog/how-to-calibrate-your-monitor-without-a-colorimeter",
    steps: [
      "Set the display mode to sRGB or a factory-calibrated preset.",
      "Avoid 'Vivid/Gaming' modes — they're inaccurate references.",
      "Grey backgrounds are most sensitive — a tint on grey signals an accuracy issue.",
      "For precise calibration, use a hardware colorimeter.",
    ],
  },
  {
    title: "Wrong refresh rate / stuttering",
    href: "/blog/how-to-enable-full-refresh-rate-windows-mac",
    steps: [
      "Confirm the maximum refresh rate is selected in system display settings.",
      "Check the cable — HDMI 2.0 only supports 4K@60Hz.",
      "Laptops: confirm the dedicated GPU drives the panel (not the iGPU).",
      "Some monitors require enabling high refresh in the OSD menu.",
    ],
  },
];

const DEVICE_GUIDES = [
  { name: "Laptop screen test", href: "/blog/how-to-test-a-laptop-screen-for-dead-pixels", body: "Step-by-step laptop inspection: dead pixels, bleed, and the panel lottery." },
  { name: "Phone screen test", href: "/blog/how-to-test-a-used-phone-screen-before-buying", body: "OLED burn-in, touch dead zones, tint — essential for used-phone checks." },
  { name: "TV screen test", href: "/blog/how-to-test-a-tv-for-defects", body: "Mini-LED blooming, backlight bleed, dirty-screen effect — do it after unboxing." },
  { name: "Monitor screen test", href: "/blog/how-to-test-a-monitor-before-buying", body: "IPS/VA/OLED testing, refresh rate, and uniformity before the return window closes." },
  { name: "OLED screen test", href: "/blog/oled-burn-in-and-how-to-check-for-it", body: "Burn-in and image retention — comprehensive OLED-specific coverage." },
  { name: "Panel types explained", href: "/blog/ips-vs-va-vs-tn-vs-oled", body: "IPS bleed, VA ghosting, OLED blacks — which panel technology fits you." },
];

const USE_CASES = [
  { title: "New device inspection", body: "First thing after unboxing a monitor, laptop, or phone — dead pixels, bleed, color. Find issues inside the return window for easy exchanges." },
  { title: "Used devices", body: "An essential pre-purchase check. OLED: look for burn-in. LCD: look for bleed. Verify the panel hasn't been swapped for a non-original part." },
  { title: "Design & color work", body: "Designers and photographers confirming color accuracy and gamut. 100% sRGB is the minimum; wide P3 is preferred. Test before you calibrate." },
  { title: "Gaming optimization", body: "Verify refresh rate, response time, and VRR are actually working. Catch the '144Hz advertised, 60Hz actual' problem before it's too late." },
];

const FAQS = [
  {
    q: "Are these tools accurate?",
    a: "We render pure color patterns in browser fullscreen, driving GPU output to every physical pixel — dead-pixel and bleed detection work on the same principle as professional gear. Color-accuracy checks rely on visual comparison; for precise data, pair them with a hardware colorimeter.",
  },
  {
    q: "Do they work on phones and tablets?",
    a: "Yes — every tool works in mobile browsers (iOS Safari / Android Chrome). For phone testing, turn off auto-brightness and set brightness to maximum for the most accurate results.",
  },
  {
    q: "How many dead pixels are acceptable?",
    a: "Strictly, any bright pixel is unacceptable — a constantly lit dot on black is very visible. One or two dark pixels at the edges may be marginal. Test within your return window; brand policies vary, but your consumer rights apply.",
  },
  {
    q: "How long does testing take?",
    a: "A quick test (dead pixels + bleed) takes about 5 minutes. A full inspection is roughly 20 minutes. Do a quick test immediately on arrival, and a full pass when you have time.",
  },
  {
    q: "Why must I test in fullscreen?",
    a: "Windowed mode leaves address bars and taskbars covering the screen edges — exactly where bleed and dead pixels are most common. Use each tool's Start/fullscreen button (or F11 on desktop) to ensure complete coverage.",
  },
  {
    q: "Do I need a dark room?",
    a: "Only backlight-bleed testing needs darkness. Other tests are best in normal lighting, since that's how you actually use the screen — dark rooms amplify details that are invisible in daily use and can cause unnecessary worry.",
  },
];

const TIPS = [
  { title: "Warm up 15–30 min", body: "Color temperature and brightness are unstable before warm-up. Wait at least 15 minutes after boot before color and greyscale tests." },
  { title: "Disable enhancements", body: "Turn off vivid mode, dynamic contrast, and HDR. Test in sRGB or Standard mode to avoid distortion." },
  { title: "Use native resolution", body: "Non-native resolution triggers scaling that can hide dead pixels. Match system output to the panel's native resolution." },
  { title: "Use proper cables", body: "DisplayPort 1.4 or HDMI 2.1. Budget cables may not carry high refresh/resolution, causing frame-rate anomalies." },
  { title: "Dark room for bleed", body: "Backlight bleed must be tested in total darkness: pure black, max brightness. Focus on corners and bezel junctions." },
  { title: "Judge at normal distance", body: "After a close-up inspection, step back to normal seating distance (50–70cm). Flaws only visible up close don't affect daily use." },
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
        {/* Intro / value props */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Free online screen tester</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-foreground/70">
              No downloads required. Run screen tests directly in your browser with pixel-perfect
              fullscreen precision.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-accent">Pixel-level dead pixel detection</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Multi-color fullscreen, frame-by-frame scanning to precisely locate bright spots,
                dark spots, and stuck pixels. 8+ solid-color backgrounds with keyboard shortcuts make
                every abnormal pixel visible.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-accent">Color &amp; greyscale analysis</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Full-spectrum testing covering color, gamut, greyscale, banding, and depth.
                sRGB/DCI-P3 gradients and 256-level greyscale transitions help you judge your
                panel&apos;s true performance.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-accent">A complete screen-test suite</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Dead pixels, backlight bleed, greyscale, color, gamut, refresh rate, ghosting,
                blooming and more — {TOOLS.length} focused tools for every screen-testing scenario.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-accent">Free · no download</h3>
              <p className="mt-2 text-sm text-foreground/70">
                {SITE_NAME} runs entirely in your browser — nothing to install. Works on phones,
                tablets, laptops, monitors, and TVs.
              </p>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section>
          <SectionHeading
            title={`Why choose ${SITE_NAME}?`}
            subtitle="A focused screen-testing toolkit covering every quality dimension."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Pixel-perfect precision",
                b: "Pure-color fullscreen ensures test patterns cover every physical pixel. Keyboard shortcuts and multiple modes leave no defect undetected.",
              },
              {
                t: "All devices supported",
                b: "Phones, tablets, laptops, monitors, TVs — anything with a screen and a browser. No software or driver installation needed.",
              },
              {
                t: "Complete test coverage",
                b: "Dead pixels, backlight bleed, greyscale, color, gamut, refresh rate, ghosting, blooming — every display-quality metric in one place.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to get started */}
        <section>
          <SectionHeading
            title="How to get started"
            subtitle="Three steps to fully understand your screen's quality."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Choose a test tool",
                b: "Pick dead pixel, backlight bleed, color, or another test for your need. New to this? Start with the dead pixel test — step one of any screen inspection.",
              },
              {
                t: "Go fullscreen",
                b: "Click Start to fill the entire screen with the test pattern. Use the arrow keys or tap to cycle, and examine every corner carefully.",
              },
              {
                t: "Review & judge",
                b: "Compare against quality standards: ≥1 bright pixel or severe bleed warrants a return. Check our guides for detailed criteria.",
              },
            ].map((s, i) => (
              <div key={s.t} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-bold text-black">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core testing tools */}
        <section>
          <SectionHeading title="Core testing tools" subtitle="The essentials for inspecting any display." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_TOOLS.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                <h3 className="font-semibold group-hover:text-accent">{t.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">{t.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <SectionHeading
            title="Screen troubleshooting guide"
            subtitle="Seeing a display issue? Use these for self-diagnosis."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {TROUBLESHOOTING.map((g) => (
              <div key={g.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{g.title}</h3>
                <ol className="mt-3 space-y-2 text-sm text-foreground/70">
                  {g.steps.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <Link href={g.href} className="mt-3 inline-block text-sm text-accent hover:underline">
                  Read the full guide →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Device guides */}
        <section>
          <SectionHeading
            title="Device inspection guides"
            subtitle="Specialized workflows for different devices and panel technologies."
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

        {/* Use cases */}
        <section>
          <SectionHeading title="Use cases" subtitle="When a quick screen test pays off." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{c.body}</p>
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
          <SectionHeading title="Frequently asked questions" />
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-lg border border-border bg-card p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <SectionHeading title="Screen testing tips" subtitle="Small habits that make results more reliable." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TIPS.map((t) => (
              <div key={t.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl border border-border bg-card p-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Pixel-perfect precision for every screen</h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
            Inspecting a new display, testing a second-hand monitor, or diagnosing OLED burn-in —{" "}
            {SITE_NAME} gives you accurate screen-testing tools, all free, all in your browser.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dead-pixel-test"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Start testing now
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-white/5"
            >
              Browse all tools
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
