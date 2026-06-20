// Central tool registry. Drives navigation, homepage cards, per-tool pages,
// sitemap, and structured data. Tests run fully client-side.

export type ToolCategory = "panel" | "color" | "motion" | "fun";

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolDef {
  slug: string;
  name: string; // short label for nav/cards
  title: string; // SEO H1 / <title>
  tagline: string; // one-line summary under the H1
  description: string; // meta description (<=160 chars ideally)
  category: ToolCategory;
  icon: string; // emoji used in cards/nav
  keywords: string[];
  howTo: string[];
  faq: ToolFaq[];
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  panel: "Panel & Backlight",
  color: "Color & Calibration",
  motion: "Motion & Timing",
  fun: "Fun & Utilities",
};

export const TOOLS: ToolDef[] = [
  {
    slug: "dead-pixel-test",
    name: "Dead Pixel Test",
    title: "Dead Pixel Test",
    tagline: "Full-screen solid colors to find dead, stuck, and bright pixels.",
    description:
      "Free online dead pixel test. Cycle full-screen solid colors to spot dead, stuck, and bright sub-pixels on any monitor, laptop, phone, or TV.",
    category: "panel",
    icon: "🔬",
    keywords: ["dead pixel test", "stuck pixel", "bright pixel", "pixel checker", "monitor test"],
    howTo: [
      "Set your display brightness to maximum and clean the screen.",
      "Click Start to enter full-screen, then use ← / → or tap to change colors.",
      "Scan each solid color slowly across the whole panel.",
      "A dot that stays black on every color is a dead pixel; a dot stuck on one color is a stuck pixel.",
      "Press Esc to exit. Found one? Try the stuck-pixel flash mode to revive it.",
    ],
    faq: [
      {
        q: "What's the difference between a dead and a stuck pixel?",
        a: "A dead pixel stays black on every color because it receives no power. A stuck pixel is permanently lit in one color (red, green, or blue) and can sometimes be revived by rapidly flashing colors.",
      },
      {
        q: "Can I fix a stuck pixel?",
        a: "Sometimes. Rapidly cycling colors over the stuck area, or gently massaging it, can unstick it. Dead pixels usually cannot be fixed in software.",
      },
      {
        q: "Does this work on phones and TVs?",
        a: "Yes. It works in any modern browser on phones, tablets, laptops, monitors, and smart TVs.",
      },
    ],
  },
  {
    slug: "color-test",
    name: "Color Test",
    title: "Screen Color Test",
    tagline: "Display pure black, white, red, green, blue and more, full-screen.",
    description:
      "Free full-screen color test. Show pure black, white, red, green, blue, cyan, magenta, yellow and gray to check uniformity and find pixel defects.",
    category: "color",
    icon: "🎨",
    keywords: ["color test", "solid color screen", "rgb test", "full screen color"],
    howTo: [
      "Click Start to go full-screen.",
      "Use ← / → or tap left/right to switch colors.",
      "Look for tint, blotches, or dots that differ from the solid field.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "Why test individual solid colors?",
        a: "Solid red, green, and blue isolate each sub-pixel so defective sub-pixels and color uniformity issues become obvious.",
      },
      {
        q: "Is there a dedicated black and white screen?",
        a: "Yes — open the Black Screen or White Screen tool for a single, distraction-free color you can use for cleaning or backlight checks.",
      },
    ],
  },
  {
    slug: "black-screen",
    name: "Black Screen",
    title: "Black Screen",
    tagline: "A pure black full-screen for backlight, dust, and OLED checks.",
    description:
      "Free pure black screen, full-screen. Check backlight bleed, find dust before cleaning, test OLED blacks, or dim your display.",
    category: "color",
    icon: "⬛",
    keywords: ["black screen", "pure black", "black screen full screen", "oled black"],
    howTo: [
      "Click Start for a full-screen pure black field.",
      "In a dark room, look for glowing edges or patches (backlight bleed / IPS glow).",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What is a black screen used for?",
        a: "Checking backlight bleed and IPS glow, spotting dust before cleaning, testing true blacks on OLED panels, and as a simple low-glare background.",
      },
    ],
  },
  {
    slug: "white-screen",
    name: "White Screen",
    title: "White Screen",
    tagline: "A pure white full-screen for cleaning, lighting, and uniformity.",
    description:
      "Free pure white screen, full-screen. Spot dark dead pixels and dust, check brightness uniformity, or use as a softbox light.",
    category: "color",
    icon: "⬜",
    keywords: ["white screen", "pure white", "white screen full screen", "screen light"],
    howTo: [
      "Click Start for a full-screen pure white field.",
      "Look for dark dots (dead pixels) and smudges or dust.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What is a white screen used for?",
        a: "Finding dark dead pixels and dust, checking brightness uniformity, lighting your face on video calls, and cleaning your display.",
      },
    ],
  },
  {
    slug: "backlight-bleed-test",
    name: "Backlight Bleed",
    title: "Backlight Bleed Test",
    tagline: "Reveal LCD backlight leakage and IPS glow in a dark room.",
    description:
      "Free backlight bleed test. Display pure black to reveal LCD light leakage and IPS glow around the edges and corners of your screen.",
    category: "panel",
    icon: "💡",
    keywords: ["backlight bleed test", "ips glow", "light leakage", "lcd bleed"],
    howTo: [
      "Turn off room lights and set brightness to maximum.",
      "Click Start for a full-screen black field.",
      "Inspect the edges and corners for cloudy or glowing patches.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "Is some backlight bleed normal?",
        a: "Yes. Almost all LCD/LED panels have minor bleed. It's only a problem when it's uneven, distracting in normal use, or excessive in the corners.",
      },
      {
        q: "What's the difference between bleed and IPS glow?",
        a: "Backlight bleed is light leaking through the panel edges and is visible head-on. IPS glow is a viewing-angle effect that shifts as you move your head.",
      },
    ],
  },
  {
    slug: "greyscale-test",
    name: "Greyscale Test",
    title: "Greyscale & Banding Test",
    tagline: "256-step ramp and smooth gradient to reveal color banding.",
    description:
      "Free greyscale and banding test. View a 256-step ramp and a smooth gradient to detect banding, posterization, and gamma issues.",
    category: "color",
    icon: "🌫️",
    keywords: ["greyscale test", "gradient test", "color banding", "gamma test"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to switch between the smooth gradient and the 256-step ramp.",
      "Look for visible bands or abrupt jumps instead of a smooth transition.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What causes color banding?",
        a: "Banding appears when a panel can't render enough distinct shades — common on 6-bit + FRC panels, or from aggressive compression and low-bit-depth output settings.",
      },
    ],
  },
  {
    slug: "color-gradient-test",
    name: "Color Gradient",
    title: "Color Gradient Test",
    tagline: "Smooth RGB gradients to judge color transitions and gamut.",
    description:
      "Free color gradient test. View smooth red, green, blue and full-spectrum gradients to evaluate color transitions, banding, and gamut coverage.",
    category: "color",
    icon: "🌈",
    keywords: ["color gradient test", "gamut test", "srgb", "dci-p3", "color transition"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to cycle through hue, red, green, and blue gradients.",
      "Check that transitions are smooth and colors look saturated and even.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What is color gamut?",
        a: "Gamut is the range of colors a display can reproduce, usually quoted as a percentage of sRGB or DCI-P3. Wider gamut panels show richer, more saturated colors.",
      },
    ],
  },
  {
    slug: "brightness-uniformity-test",
    name: "Brightness Uniformity",
    title: "Brightness Uniformity Test",
    tagline: "50% gray field and a 9-zone grid to spot uneven backlighting.",
    description:
      "Free brightness uniformity test. Display a 50% gray field and a 9-zone grid to detect uneven backlighting, clouding, and dark corners.",
    category: "panel",
    icon: "🔲",
    keywords: ["brightness uniformity", "screen clouding", "uniformity test", "gray screen"],
    howTo: [
      "Click Start and view the gray field full-screen.",
      "Use ← / → to toggle the 9-zone grid overlay.",
      "Compare the brightness of the center against each corner.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "How much variation is acceptable?",
        a: "Good monitors stay within roughly 10% brightness variation across the panel. Larger differences show as visibly darker corners or brighter hotspots.",
      },
    ],
  },
  {
    slug: "refresh-rate-test",
    name: "Refresh Rate",
    title: "Refresh Rate Test",
    tagline: "Measure your real refresh rate and watch a moving reference.",
    description:
      "Free refresh rate test. Measure your display's actual refresh rate in Hz using the browser and watch a moving object to confirm smoothness.",
    category: "motion",
    icon: "⏱️",
    keywords: ["refresh rate test", "hz test", "fps test", "144hz test", "monitor hz"],
    howTo: [
      "Click Start — the measured refresh rate appears within a second or two.",
      "Watch the moving box to confirm motion looks smooth.",
      "Compare the reading to your panel's rated Hz.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "Why is my measured rate slightly off?",
        a: "Browsers measure refresh via animation frames, which can read a hair below the rated value (e.g. 143–144Hz). A large gap may mean the wrong refresh rate is selected in your OS settings.",
      },
    ],
  },
  {
    slug: "ghosting-test",
    name: "Ghosting Test",
    title: "Ghosting & Response Time Test",
    tagline: "Moving boxes at selectable speeds to reveal ghosting and trails.",
    description:
      "Free ghosting and response time test. Watch moving boxes at adjustable speeds to reveal motion blur, ghosting trails, and overshoot.",
    category: "motion",
    icon: "👻",
    keywords: ["ghosting test", "response time test", "motion blur", "overdrive test", "ufo test"],
    howTo: [
      "Click Start and watch the boxes move across the screen.",
      "Use ← / → to change the speed.",
      "Look for a faint trail (ghosting) or a bright fringe (overshoot) behind each box.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What is ghosting?",
        a: "Ghosting is a smeared trail behind moving objects caused by slow pixel response. Raising your monitor's overdrive can reduce it, but too much causes inverse-ghosting (overshoot).",
      },
    ],
  },
  {
    slug: "blooming-test",
    name: "Blooming Test",
    title: "Blooming Test (Mini-LED)",
    tagline: "A bright object on black to judge local-dimming halos.",
    description:
      "Free blooming test for Mini-LED and local-dimming displays. Move a bright object on a black field to reveal halo and blooming around highlights.",
    category: "panel",
    icon: "🌟",
    keywords: ["blooming test", "mini-led test", "local dimming", "halo test", "fald"],
    howTo: [
      "Dim the room and click Start.",
      "Move your cursor / finger to drag the bright dot around the black field.",
      "Watch for a glowing halo (bloom) around the bright object.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "Why does blooming happen?",
        a: "Local-dimming backlights have a limited number of zones. A small bright object lights its whole zone, so some glow spills into the surrounding black area.",
      },
    ],
  },
  {
    slug: "fake-broken-screen",
    name: "Fake Broken Screen",
    title: "Fake Broken Screen Prank",
    tagline: "Realistic cracked, glitched, and BSOD screens to prank your friends.",
    description:
      "Free fake broken screen prank. Show a realistic cracked screen, glitch, or blue screen of death full-screen — tap anywhere to reveal it's fake.",
    category: "fun",
    icon: "💥",
    keywords: ["fake broken screen", "cracked screen prank", "fake crack", "bsod prank", "broken screen prank"],
    howTo: [
      "Pick a cracked, glitch, or blue-screen effect.",
      "Click Start to go full-screen, then hand the device over.",
      "Tap anywhere (or press Esc) to reveal it was a prank.",
    ],
    faq: [
      {
        q: "Will this damage my screen?",
        a: "No. It's just an image displayed in your browser. Nothing is changed on your device and it disappears the moment you tap or exit.",
      },
    ],
  },
  {
    slug: "screensaver",
    name: "Screensaver",
    title: "Online Screensaver",
    tagline: "Matrix rain, starfield, clock, and bouncing logo, full-screen.",
    description:
      "Free online screensaver. Run a matrix rain, starfield, big clock, or bouncing logo full-screen in your browser — no install required.",
    category: "fun",
    icon: "✨",
    keywords: ["online screensaver", "matrix screensaver", "starfield", "bouncing logo", "browser screensaver"],
    howTo: [
      "Choose an effect (matrix, starfield, clock, or bouncing logo).",
      "Click Start to run it full-screen.",
      "Move the mouse or press Esc to exit.",
    ],
    faq: [
      {
        q: "Does it keep my screen awake?",
        a: "By default it lets your display dim/sleep normally. Toggle 'Keep awake' if you want the Screen Wake Lock to keep the panel on.",
      },
    ],
  },
];

export const TOOL_MAP: Record<string, ToolDef> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function getTool(slug: string): ToolDef | undefined {
  return TOOL_MAP[slug];
}

export function toolsByCategory(): Record<ToolCategory, ToolDef[]> {
  const out: Record<ToolCategory, ToolDef[]> = {
    panel: [],
    color: [],
    motion: [],
    fun: [],
  };
  for (const t of TOOLS) out[t.category].push(t);
  return out;
}
