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
      "Use ← / → to cycle through spectrum, red, green, blue, white, and gray gradients.",
      "Check that transitions are smooth and colors look saturated and even.",
      "The white and gray ramps make luminance banding in the shadows easiest to spot.",
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
    tagline:
      "Cracked, glitch, TV static, no signal, dead pixels, Windows BSOD, Mac, Linux, iOS and Android crash screens to prank friends.",
    description:
      "Free fake broken screen prank. Show a realistic shattered screen, glitch, TV static, no-signal colour bars, dead pixels, Windows blue screen of death, Windows XP BSOD, Mac kernel panic, Linux panic, iOS recovery, or Android crash full-screen — tap anywhere to reveal it's fake.",
    category: "fun",
    icon: "💥",
    keywords: [
      "fake broken screen",
      "cracked screen prank",
      "fake crack",
      "bsod prank",
      "blue screen of death",
      "tv static screen",
      "no signal screen",
      "dead pixel screen",
      "mac crash screen",
      "android crash",
      "ios recovery screen",
      "broken screen prank",
    ],
    howTo: [
      "Use ← / → to pick an effect: cracked, glitch, TV static, no signal, dead pixels, Windows BSOD, Windows XP, Mac crash, Linux panic, iOS recovery, or Android crash.",
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
    tagline: "Matrix rain, starfield, snow, pipes, clock, and the classic DVD logo, full-screen.",
    description:
      "Free online screensaver. Run a matrix rain, warp starfield, falling snow, 3D-style pipes, a big clock, or the classic bouncing DVD logo full-screen in your browser — no install required.",
    category: "fun",
    icon: "✨",
    keywords: [
      "online screensaver",
      "matrix screensaver",
      "starfield",
      "snow screensaver",
      "pipes screensaver",
      "dvd bouncing logo",
      "browser screensaver",
    ],
    howTo: [
      "Choose an effect (matrix, starfield, snow, pipes, clock, or the bouncing DVD logo).",
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
  {
    slug: "boot-screen-simulator",
    name: "Boot Screen Simulator",
    title: "Boot Screen Simulator",
    tagline: "Full-screen Windows 10, Windows XP, and macOS startup screens.",
    description:
      "Free boot screen simulator. Show a realistic Windows 10, Windows XP, or macOS startup screen full-screen in your browser — great for pranks, mock-ups, and videos.",
    category: "fun",
    icon: "🔌",
    keywords: [
      "boot screen simulator",
      "windows boot screen",
      "windows xp loading screen",
      "mac startup screen",
      "fake boot screen",
    ],
    howTo: [
      "Use ← / → to choose Windows 10, Windows XP, or macOS.",
      "Click Start to run the animated startup screen full-screen.",
      "Press Esc or tap to exit.",
    ],
    faq: [
      {
        q: "Is this a real operating system?",
        a: "No. It's a looping animation of each startup screen rendered in your browser. Nothing boots or changes on your device.",
      },
      {
        q: "What can I use it for?",
        a: "Harmless pranks, screen recordings, mock-ups, kiosk loading screens, or nostalgia for the Windows XP startup.",
      },
    ],
  },
  {
    slug: "burn-in-test",
    name: "Burn-in Test",
    title: "Screen Burn-in Test",
    tagline: "Full-screen fields and a checkerboard to reveal OLED burn-in.",
    description:
      "Free OLED/AMOLED burn-in test. Cycle solid white, grey, RGB and a checkerboard full-screen to reveal retained images, ghosting, and uneven pixel aging.",
    category: "panel",
    icon: "🔥",
    keywords: ["burn-in test", "oled burn in", "image retention", "amoled", "ghost image"],
    howTo: [
      "Set brightness high and click Start.",
      "Step through white, grey, and each RGB field with ← / →.",
      "Look for faint outlines of logos, bars, or HUDs that shouldn't be there — grey shows them best.",
      "Use the checkerboard frame to help even out short-term retention.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What's the difference between burn-in and image retention?",
        a: "Image retention is temporary and fades after varied content. Burn-in is permanent uneven wear of OLED sub-pixels. If an outline persists across many different images, it's burn-in.",
      },
      {
        q: "Which field shows burn-in best?",
        a: "A 50% grey field is usually the most revealing, followed by solid colors. Static UI elements (taskbars, logos) leave the clearest ghosts.",
      },
    ],
  },
  {
    slug: "contrast-test",
    name: "Contrast Test",
    title: "Contrast Test",
    tagline: "Black-and-white checkerboards to judge black/white separation.",
    description:
      "Free contrast test. View black-and-white checkerboards at increasing density to evaluate contrast, black/white level separation, and panel sharpness.",
    category: "panel",
    icon: "◧",
    keywords: ["contrast test", "checkerboard", "black white level", "contrast ratio"],
    howTo: [
      "Click Start and view the checkerboard full-screen.",
      "Use ← / → to change the grid density (4×4 up to 32×32).",
      "Black squares should stay deep black and white squares bright, with crisp edges between them.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What should I look for?",
        a: "Clean separation between black and white with sharp borders. Greyish blacks indicate low contrast; fuzzy edges can indicate poor sharpness or scaling.",
      },
    ],
  },
  {
    slug: "black-level-test",
    name: "Black Level Test",
    title: "Black Level Test",
    tagline: "Near-black steps to see how dark your panel really goes.",
    description:
      "Free black level test. Compare near-black grey steps to judge shadow detail, black depth, and IPS glow — see which dark levels your screen can still distinguish.",
    category: "panel",
    icon: "▰",
    keywords: ["black level test", "shadow detail", "near black", "black depth", "ips glow"],
    howTo: [
      "Dim the room and set brightness to your normal level, then click Start.",
      "Each vertical band is slightly brighter than pure black (the number is its value).",
      "Note the lowest band you can still tell apart from pure black — that's your shadow floor.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "How many steps should I see?",
        a: "On a good display in a dark room you can usually distinguish the steps from value 2–4 upward. If low steps all look identical to black, shadow detail is being crushed (often a brightness/black-level or 'Limited' RGB range setting).",
      },
    ],
  },
  {
    slug: "viewing-angle-test",
    name: "Viewing Angle Test",
    title: "Viewing Angle Test",
    tagline: "Grey steps and color bars to reveal off-axis color/brightness shift.",
    description:
      "Free viewing angle test. Display grey steps and color bars, then move your head — see how much brightness and color shift off-axis. Reveals TN/VA angle weakness.",
    category: "panel",
    icon: "◑",
    keywords: ["viewing angle test", "color shift", "off axis", "tn va ips angle"],
    howTo: [
      "Click Start and sit centered first to set a reference.",
      "Move your head left/right and up/down, and step back.",
      "Watch how much the grey steps wash out and the colors shift — less shift is better.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What's normal?",
        a: "IPS and OLED hold color and brightness well off-axis. TN panels shift heavily (especially vertically) and VA panels show a contrast/gamma shift and corner glow. Some shift is normal — large shifts mean a narrow viewing cone.",
      },
    ],
  },
  {
    slug: "gamma-test",
    name: "Gamma Test",
    title: "Gamma Test",
    tagline: "Stripe-vs-patch pattern to read your display's gamma.",
    description:
      "Free gamma test. A 1-pixel stripe pattern (≈50% grey) sits beside reference patches for gamma 1.8–2.4. The patch that blends in reveals your display's gamma.",
    category: "color",
    icon: "◐",
    keywords: ["gamma test", "gamma 2.2", "gamma calibration", "grayscale gamma"],
    howTo: [
      "Click Start and step back a little (the stripes should blur into solid grey).",
      "Compare each labelled patch (γ 1.8–2.4) against the striped background.",
      "The patch that most disappears into the stripes is your display's gamma — aim for 2.2.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "What gamma should I target?",
        a: "2.2 (sRGB standard) for general use. If the lower-value patches blend in, your gamma is too low (washed out); if the higher ones match, it's too high (crushed shadows). Adjust the monitor's gamma preset or OS calibration.",
      },
    ],
  },
  {
    slug: "screen-tearing-test",
    name: "Screen Tearing Test",
    title: "Screen Tearing Test",
    tagline: "Fast scrolling bars that reveal tearing without V-Sync/VRR.",
    description:
      "Free screen tearing test. Fast-scrolling vertical bars reveal horizontal tears when frame rate and refresh rate aren't synced — check V-Sync, G-Sync, and FreeSync.",
    category: "motion",
    icon: "⇿",
    keywords: ["screen tearing test", "vsync", "g-sync", "freesync", "vrr test"],
    howTo: [
      "Click Start and watch the moving bars.",
      "Use ← / → to switch between vertical bars (reveals horizontal tears) and horizontal bars (reveals vertical tears).",
      "A clean image means no tearing; a break where the bars misalign is a tear.",
      "Toggle V-Sync or adaptive sync (G-Sync/FreeSync) and compare.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "How do I stop tearing?",
        a: "Enable adaptive sync (G-Sync/FreeSync) for tear-free, low-lag motion, or V-Sync to cap frames to the refresh rate (adds some lag). See our screen tearing guide for the full breakdown.",
      },
    ],
  },
];

// Extra practical tips per tool, shown in a callout on each tool page.
// Keyed by slug so the tool objects above stay focused on core copy/SEO.
export const TOOL_TIPS: Record<string, string[]> = {
  "dead-pixel-test": [
    "Clean the screen first — a speck of dust looks exactly like a dead pixel.",
    "View each color from ~30cm away so a single off pixel actually stands out.",
    "Found a stuck (not dead) pixel? Leave a fast color flash running over it for 10–20 minutes to try to revive it.",
  ],
  "color-test": [
    "Solid red, green, and blue are best for spotting a defective sub-pixel.",
    "A faint overall tint on the white field usually means your color temperature / white balance is off.",
  ],
  "black-screen": [
    "Turn the lights off and crank brightness to maximum — bleed is invisible in a bright room.",
    "Let your eyes adjust for 30 seconds before judging the corners.",
  ],
  "white-screen": [
    "Great as a cheap softbox light for video calls in a dark room.",
    "Dark specks that don't wipe off are usually dust between layers or dead pixels, not dirt.",
  ],
  "backlight-bleed-test": [
    "Photograph the black screen with your phone to compare panels objectively.",
    "Some bleed and IPS glow is normal — only uneven, distracting clouding is a defect worth returning a panel over.",
  ],
  "greyscale-test": [
    "Step back from the screen — banding is far easier to see at a distance.",
    "If the smooth gradient shows distinct bars, try setting your GPU output to full RGB and 8-bit+ color depth.",
  ],
  "color-gradient-test": [
    "Use the white and gray ramps to isolate luminance banding without color distraction.",
    "Wide, posterized bands often come from a 6-bit panel or aggressive video compression rather than your GPU.",
  ],
  "brightness-uniformity-test": [
    "Compare the center against each corner one at a time rather than scanning the whole field.",
    "Take a photo and even out exposure — your eyes auto-adjust and hide real differences.",
  ],
  "refresh-rate-test": [
    "Close other tabs and apps; background load can drag the measured rate below your panel's rating.",
    "If you bought a high-refresh monitor, make sure the rate is actually selected in your OS display settings.",
  ],
  "ghosting-test": [
    "Track a moving box with your eyes, then try staring at a fixed point — each reveals different artifacts.",
    "If you see a bright fringe instead of a smeared trail, your overdrive is too high (overshoot) — turn it down a notch.",
  ],
  "blooming-test": [
    "Run it in a dark room; blooming around the bright dot is hard to see with the lights on.",
    "More dimming zones = less bloom. OLED shows essentially none.",
  ],
  "fake-broken-screen": [
    "Set brightness high and turn the device over quickly so the prankee can't see the address bar.",
    "Match the screen to the device — the Mac crash on a MacBook, BSOD on a Windows laptop — for the most convincing prank.",
  ],
  "boot-screen-simulator": [
    "Pair it with the fake broken screen for a convincing 'it won't start up' gag.",
    "Handy as a placeholder loading screen for videos, streams, or kiosk displays.",
  ],
  "burn-in-test": [
    "The 50% grey field reveals retained logos and HUD bars best — look there first.",
    "Run the checkerboard for a while to help clear short-term image retention (real burn-in won't budge).",
  ],
  "contrast-test": [
    "Black squares should stay inky black; a grey wash means low contrast or raised black level.",
    "Fuzzy edges between squares point to scaling or sharpness issues, not contrast.",
  ],
  "black-level-test": [
    "Dim the room and use your normal brightness — not maximum — to judge real shadow detail.",
    "If the lowest steps all merge into black, check for a 'Limited' RGB range or a crushed black-level setting.",
  ],
  "viewing-angle-test": [
    "Set your reference sitting dead-center first, then move off-axis to compare.",
    "Heavy shift moving vertically is typical of TN panels; a contrast/gamma shift with corner glow is typical of VA.",
  ],
  "gamma-test": [
    "Step back until the stripes blur into solid grey before comparing the patches.",
    "Aim for the 2.2 patch to disappear; if a lower value blends in your image is washed out, a higher one means crushed shadows.",
  ],
  "screen-tearing-test": [
    "Use the vertical-bars frame for horizontal tears and the horizontal-bars frame for vertical tears.",
    "Toggle V-Sync or adaptive sync (G-Sync/FreeSync) and watch the tear line appear or vanish.",
  ],
  "screensaver": [
    "Toggle 'Keep awake' if you want the display to stay on instead of sleeping.",
    "The DVD logo's corner-hit is rare by design — that's the moment everyone waits for.",
  ],
};

export function getTips(slug: string): string[] {
  return TOOL_TIPS[slug] ?? [];
}

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
