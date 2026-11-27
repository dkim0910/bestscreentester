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
  // Novelty pages (pranks, screensaver): served with a robots noindex, left out of the
  // sitemap and the homepage, and listed on /tools under "Just for fun" only.
  noindex?: boolean;
  // ISO YYYY-MM-DD: the last time this tool's own content changed — its copy here, its
  // TOOL_TIPS, or its test component. Drives the sitemap lastmod (and so the IndexNow
  // ping), so move it only when the tool changes; shared template edits don't count.
  updatedAt: string;
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

// Headings for the tool listings (homepage, /tools). There the novelty tools are split
// out of "fun" into their own "Just for fun" block, which leaves only utilities behind.
export const LISTING_LABELS: Record<ToolCategory, string> = {
  ...CATEGORY_LABELS,
  fun: "Utilities",
};

const BASE_TOOLS: ToolDef[] = [
  {
    slug: "dead-pixel-test",
    name: "Dead Pixel Test",
    title: "Dead Pixel Test",
    tagline: "Full-screen solid colors to find dead, stuck, and bright pixels.",
    description:
      "Free online dead pixel test. Cycle full-screen solid colors to spot dead, stuck, and bright sub-pixels on any monitor, laptop, phone, or TV.",
    category: "panel",
    icon: "🔬",
    updatedAt: "2026-11-20",
    keywords: ["dead pixel test", "stuck pixel", "bright pixel", "pixel checker", "monitor test"],
    howTo: [
      "Set your display brightness to maximum and clean the screen.",
      "Click Start to enter full-screen, then use ← / → or tap the sides to change colors.",
      "Scan each solid color slowly across the whole panel.",
      "A dot that stays black on every color is a dead pixel; a dot stuck on one color is a stuck pixel.",
      "Found a stuck pixel? Go to the last frame, Stuck-pixel fixer, drag the box over it and tap the box to start flashing. Press Esc to exit.",
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
    tagline: "Nine full-screen solid colors for finding stuck sub-pixels, tint and uneven patches.",
    description:
      "Free full-screen color test. Show pure black, white, red, green, blue, cyan, magenta, yellow and gray to check uniformity and find pixel defects.",
    category: "color",
    icon: "🎨",
    updatedAt: "2026-11-26",
    keywords: ["color test", "solid color screen", "rgb test", "full screen color"],
    howTo: [
      "Click Start to go full-screen.",
      "Use ← / → or tap left/right to switch colors.",
      "Look for tint, blotches, or dots that differ from the solid field.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why test individual solid colors?",
        a: "Solid red, green, and blue isolate each sub-pixel so defective sub-pixels and color uniformity issues become obvious.",
      },
      {
        q: "Why does a dot show on some colors but not others?",
        a: "Because each color lights a different set of sub-pixels. A red sub-pixel stuck on is invisible on red, white and yellow, and obvious on black, green and blue. Note which colors it appears on: that is how you tell a dead pixel from a stuck one.",
      },
    ],
  },
  {
    slug: "black-screen",
    name: "Black Screen",
    title: "Black Screen",
    tagline: "A pure black full-screen for checking backlight bleed, IPS glow and OLED blacks.",
    description:
      "Free pure black screen, full-screen. Check for backlight bleed and IPS glow on an LCD, confirm true blacks on an OLED, and spot stuck bright pixels.",
    category: "color",
    icon: "⬛",
    updatedAt: "2026-11-26",
    keywords: ["black screen", "pure black", "black screen full screen", "oled black"],
    howTo: [
      "Click Start for a full-screen pure black field.",
      "In a dark room, look for glowing edges or patches (backlight bleed / IPS glow).",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What is a black screen used for?",
        a: "Checking an LCD for backlight bleed and IPS glow, confirming that an OLED shows true black, and finding pixels stuck on, which only show against black.",
      },
      {
        q: "Why do the edges glow on a black screen?",
        a: "On an LCD, that's backlight bleed or IPS glow: light from the backlight leaking at the edges, or showing through as a haze when you look at an angle. A little is normal on almost every LCD. An OLED should stay fully black, because its pixels switch off.",
      },
      {
        q: "Should an LCD look completely black?",
        a: "No. An LCD makes black by blocking a backlight that stays on, so some light always gets through and the screen looks very dark grey in a dark room. What matters is that the grey is even. An evenly raised black level is a contrast or RGB-range setting, not leakage.",
      },
    ],
  },
  {
    slug: "white-screen",
    name: "White Screen",
    title: "White Screen",
    tagline: "A pure white full-screen for finding dark dead pixels, dust and uneven brightness.",
    description:
      "Free pure white screen, full-screen. Spot dark dead pixels and trapped dust, check brightness uniformity, and look for tinted patches.",
    category: "color",
    icon: "⬜",
    updatedAt: "2026-11-26",
    keywords: ["white screen", "pure white", "white screen full screen", "white screen test"],
    howTo: [
      "Click Start for a full-screen pure white field.",
      "Look for dark dots (dead pixels) and smudges or dust.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What is a white screen used for?",
        a: "Finding dark dead pixels and dust, checking that brightness is even from the center to the corners, and spotting patches of a different tint.",
      },
      {
        q: "Will the screen stay on while I inspect it?",
        a: "Yes, in browsers that support the Screen Wake Lock API, which includes current Chrome, Edge, Safari and Firefox. The page asks your device to keep the display awake until you exit. Where the browser doesn't support it, your normal sleep timer applies.",
      },
      {
        q: "Why does the white look slightly yellow or blue?",
        a: "White depends on the display's color temperature. Night Light, Night Shift, True Tone and warm 'eye care' presets tint it on purpose, so turn them off before testing. Without those, an even warm or cool cast is a calibration difference, not a fault; patches of different tint across the screen are what to look for.",
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
    updatedAt: "2026-11-27",
    keywords: ["backlight bleed test", "ips glow", "light leakage", "lcd bleed"],
    howTo: [
      "Turn off the room lights. Start at maximum brightness to find any bleed, then judge it again at the brightness you normally use.",
      "Click Start for a full-screen black field.",
      "Inspect the edges and corners for cloudy or glowing patches.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
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
    tagline: "Smooth gradient and 32-step ramp to reveal color banding.",
    description:
      "Free greyscale and banding test. View a smooth black-to-white gradient and a 32-step ramp to detect banding, posterization, and tinted greys.",
    category: "color",
    icon: "🌫️",
    updatedAt: "2026-11-26",
    keywords: ["greyscale test", "gradient test", "color banding", "gamma test"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to switch between the smooth gradient and the 32-step ramp.",
      "Look for visible bands or abrupt jumps instead of a smooth transition.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What causes color banding?",
        a: "Banding appears when a panel can't render enough distinct shades — common on 6-bit + FRC panels, or from aggressive compression and low-bit-depth output settings.",
      },
      {
        q: "What's the difference between the two frames?",
        a: "The smooth gradient runs from black to white with no steps, so any bands you see in it come from your display chain. The stepped ramp splits the same range into 32 even blocks: each one should look like a distinct, neutral grey, including the darkest few.",
      },
      {
        q: "Why do parts of the ramp look tinted?",
        a: "A neutral ramp should stay grey from end to end. A green, blue or magenta cast in part of it points to the display's white balance or color settings, not to banding. Trying a different color preset or calibrating usually fixes it.",
      },
    ],
  },
  {
    slug: "color-gradient-test",
    name: "Color Gradient",
    title: "Color Gradient Test",
    tagline: "Smooth spectrum and RGB gradients, plus an 8-bit vs 10-bit ramp, to judge color transitions and banding.",
    description:
      "Free color gradient test. Smooth red, green, blue and spectrum gradients, plus an 8-bit vs 10-bit ramp, to check transitions, banding and posterization.",
    category: "color",
    icon: "🌈",
    updatedAt: "2026-11-27",
    keywords: ["color gradient test", "color banding test", "rgb gradient", "spectrum gradient", "color transition"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to cycle through spectrum, red, green, blue, white, gray, and black gradients, then the 8-bit vs 10-bit ramp.",
      "Check that transitions are smooth and colors look saturated and even.",
      "The white and gray ramps make luminance banding in the shadows easiest to spot.",
      "On 8-bit vs 10-bit, the top half bands on purpose. If the bottom half looks smoother, more than 256 levels per color are reaching your screen.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Can this test my color gamut?",
        a: "No. These gradients use standard sRGB colors, which every display can show, so they reveal banding and uneven transitions rather than gamut. To see whether your screen shows colors beyond sRGB, use the Wide Color Gamut (P3) Test.",
      },
      {
        q: "What does a good result look like?",
        a: "Every gradient blends smoothly from end to end, with no visible bars, sudden jumps or blotches. The spectrum should pass evenly through yellow, green, cyan, blue and magenta, without one hue swallowing a wide band.",
      },
      {
        q: "Why look at red, green and blue separately?",
        a: "Each channel is driven on its own, so banding or a color shift that shows up in only one ramp points to that channel's calibration rather than the panel as a whole. Some difference in brightness is normal: green always looks brightest to the eye.",
      },
    ],
  },
  {
    slug: "brightness-uniformity-test",
    name: "Brightness Uniformity",
    title: "Brightness Uniformity Test",
    tagline: "Gray fields from 5% to 50%, a 9-zone grid and a panning gray to spot uneven backlighting and banding.",
    description:
      "Free brightness uniformity test: gray fields from 5% to 50%, a 9-zone grid and a panning gray reveal clouding, OLED banding and the dirty screen effect.",
    category: "panel",
    icon: "🔲",
    updatedAt: "2026-11-28",
    keywords: ["brightness uniformity", "screen clouding", "uniformity test", "gray screen"],
    howTo: [
      "Click Start and view the gray field full-screen.",
      "Use ← / → to switch to the 9-zone grid, the panning gray and the dark grays.",
      "Compare the brightness of the center against each corner.",
      "On Panning gray, follow the drifting bands with your eyes: smudges or stripes that stay put are the panel's dirty screen effect.",
      "The 5% to 20% grays show what a mid gray hides: vertical bands and tinted patches on an OLED, clouding on an LCD. Look at them in a dark room.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "How much variation is acceptable?",
        a: "There is no single standard. On a good monitor most of the screen stays within about 10% of the center's brightness, and corners often fall further: reviewers have rated panels with a corner around 30% darker as good overall. What matters is a difference you notice in normal use, such as clearly darker corners or a brighter hotspot.",
      },
      {
        q: "What is the dirty screen effect?",
        a: "Blotches and faint vertical bands on large panels, most visible when the camera pans across a uniform area such as a sports pitch. The Panning gray frame recreates that: the bands drift, and any patches that stay fixed belong to the panel.",
      },
    ],
  },
  {
    slug: "refresh-rate-test",
    name: "Refresh Rate",
    title: "Refresh Rate Test",
    tagline: "Measure your real refresh rate and catch dropped frames.",
    description:
      "Free refresh rate test. Measure your display's actual refresh rate in Hz, watch a frame-time graph and count dropped frames, right in the browser.",
    category: "motion",
    icon: "⏱️",
    updatedAt: "2026-11-27",
    keywords: ["refresh rate test", "hz test", "fps test", "144hz test", "monitor hz"],
    howTo: [
      "Click Start — the measured refresh rate appears within a second or two.",
      "Watch the moving box to confirm motion looks smooth.",
      "Compare the reading to your panel's rated Hz; the line under it gives the frame time and the closest standard rate.",
      "Watch the frame-time graph: each red bar is a refresh the browser missed, and the counter adds them up. Reset starts the count again.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why isn't the reading exactly my monitor's rating?",
        a: "Many displays run a fraction off their nominal rate, such as 59.94 Hz instead of 60, and browser timing adds a little noise. A reading within about 1 Hz of the rating is normal. A large gap usually means a lower refresh rate is selected in your OS display settings.",
      },
      {
        q: "Why does it show 60 Hz on my 144 Hz monitor?",
        a: "Because the panel is being driven at 60 Hz. The usual causes: the refresh rate was left at 60 in Windows or macOS display settings, the cable or port can't carry the higher rate at your resolution (use DisplayPort or a high-speed HDMI cable), or a power-saving mode on a laptop or phone has lowered it. Fix that, then run the test again.",
      },
      {
        q: "What do frame time and closest standard rate mean?",
        a: "Frame time is how long each refresh lasts: 1000 ms divided by the rate, so 16.67 ms at 60 Hz and 6.94 ms at 144 Hz. The closest standard rate names the common panel setting your reading matches, which helps when the measurement lands a fraction off.",
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
    updatedAt: "2026-11-26",
    keywords: ["ghosting test", "response time test", "motion blur", "overdrive test", "ufo test"],
    howTo: [
      "Click Start and watch the boxes move across the screen.",
      "Use ← / → to change the speed.",
      "Look for a faint trail (ghosting) or a bright fringe (overshoot) behind each box.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What is ghosting?",
        a: "Ghosting is a smeared trail behind moving objects caused by slow pixel response. Raising your monitor's overdrive can reduce it, but too much causes inverse-ghosting (overshoot).",
      },
      {
        q: "Which speed should I use?",
        a: "Start with Medium (480 px/s), which is close to everyday scrolling and game motion. Slow (240 px/s) shows how cleanly the panel settles, and Fast (960 px/s) exaggerates trails and overshoot, so small differences between overdrive settings become visible.",
      },
      {
        q: "Is the trail ghosting or motion blur?",
        a: "Some blur is unavoidable on any normal display: each frame is held still while your eyes keep moving, so higher refresh rates blur less. Ghosting is different, a distinct afterimage or smear left by slow pixel transitions, and on VA panels it is usually worst in dark scenes.",
      },
    ],
  },
  {
    slug: "frame-rate-comparison",
    name: "Frame Rate Comparison",
    title: "Frame Rate Comparison Test",
    tagline: "The same moving car at full, half and quarter frame rate, side by side.",
    description:
      "Free frame rate comparison test. Watch the same car at 30, 60, 120 fps or more, side by side, to see what your refresh rate does for motion clarity.",
    category: "motion",
    icon: "🏎️",
    updatedAt: "2026-11-27",
    keywords: ["frame rate comparison", "fps comparison test", "30 vs 60 fps", "60 vs 120 fps", "60 vs 144 fps", "motion clarity test"],
    howTo: [
      "Click Start. The three lanes show the same car at the same speed: the top lane redraws it every refresh, the next every second refresh, the bottom every fourth.",
      "Each lane is labelled with its frame rate, worked out from your measured refresh rate.",
      "Follow a car with your eyes. The lower the frame rate, the bigger its jumps and the blurrier it looks.",
      "Use ← / → to change the speed, and the Dark, Gray and Light buttons to change the background.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why does the top lane look blurry too?",
        a: "Because every normal display holds each frame still while your eyes keep moving. The blur is about as wide as the distance the car moves in one frame: at 960 pixels per second, 16 pixels at 60 Hz and 7 at 144 Hz. Higher refresh rates and backlight strobing shrink it.",
      },
      {
        q: "Why does my 144 Hz monitor show 60 fps in the top lane?",
        a: "Because it is running at 60 Hz. The labels come from the refresh rate the browser measures, so the top lane always shows your real maximum. Select the full rate in your display settings and check the cable; the Refresh Rate Test walks through it.",
      },
      {
        q: "Is this the same as the Ghosting Test?",
        a: "No. The Ghosting Test uses plain boxes to show trails from slow pixels; this test compares frame rates. On the Light background it also shows ghosting around a detailed shape: a faint trail behind the car is ghosting, and a bright or oddly colored outline is overshoot from overdrive.",
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
    updatedAt: "2026-11-26",
    keywords: ["blooming test", "mini-led test", "local dimming", "halo test", "fald"],
    howTo: [
      "Dim the room and click Start.",
      "Move your cursor / finger to drag the bright dot around the black field.",
      "Watch for a glowing halo (bloom) around the bright object.",
      "Use → for the zone sweeps: count how often the halo jumps as the square crosses the screen — that's roughly the number of dimming zones across (or down).",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why does blooming happen?",
        a: "Local-dimming backlights have a limited number of zones. A small bright object lights its whole zone, so some glow spills into the surrounding black area.",
      },
      {
        q: "Does OLED have blooming?",
        a: "No. Every OLED pixel makes its own light, so a bright object on black has no backlight zone to spill out of. Blooming is specific to LCDs with local dimming, including Mini-LED.",
      },
      {
        q: "How do I reduce blooming?",
        a: "Most local-dimming displays let you set how aggressive the dimming is. A lower setting shrinks halos but lifts blacks; a higher one deepens blacks but blooms more. A little light in the room also makes halos less noticeable than a pitch-dark one.",
      },
    ],
  },
  {
    slug: "fake-broken-screen",
    name: "Fake Broken Screen",
    title: "Fake Broken Screen Prank",
    tagline:
      "Cracked, glitch, TV static, no signal, dead pixels, glitching pixels, Windows BSOD, Mac, Linux, iOS and Android crash screens to prank friends.",
    description:
      "Free fake broken screen prank. Show a realistic cracked screen, TV static, no-signal bars, a Windows blue screen or Mac kernel panic — tap to reveal it's fake.",
    category: "fun",
    noindex: true,
    icon: "💥",
    updatedAt: "2026-10-01",
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
      "Pick an effect with the ← / → arrows under the Start button: cracked, glitch, TV static, no signal, dead pixels, pixel glitch, Windows BSOD, Windows XP, Mac crash, Linux panic, iOS recovery, or Android crash.",
      "Click Start to go full-screen, then hand the device over.",
      "Tap anywhere (or press Esc) to reveal it was a prank.",
    ],
    faq: [
      {
        q: "Will this damage my screen?",
        a: "No. It's just an image displayed in your browser. Nothing is changed on your device and it disappears the moment you tap or exit.",
      },
      {
        q: "How does the person get out of it?",
        a: "Tapping or clicking anywhere, or pressing Esc, ends the prank and returns to the page. Nothing is installed, and closing the tab ends it too.",
      },
      {
        q: "Is it safe for people sensitive to flashing?",
        a: "Several effects flicker or glitch on purpose. Don't use the prank on anyone with photosensitive epilepsy or who is sensitive to flashing light.",
      },
    ],
  },
  {
    slug: "screensaver",
    name: "Screensaver",
    title: "Online Screensaver",
    tagline: "Matrix rain, starfield, snow, pipes, clock, and the classic DVD logo, full-screen.",
    description:
      "Free online screensaver. Run matrix rain, a warp starfield, falling snow, 3D pipes, a big clock, or the classic bouncing DVD logo full-screen. No install.",
    category: "fun",
    noindex: true,
    icon: "✨",
    updatedAt: "2026-10-01",
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
      "Pick an effect with the ← / → arrows under the Start button (matrix, starfield, snow, pipes, clock, or the bouncing DVD logo).",
      "Click Start to run it full-screen.",
      "Move the mouse or tap to show the controls, then press Esc or Exit to leave.",
    ],
    faq: [
      {
        q: "Does it keep my screen awake?",
        a: "By default it lets your display dim/sleep normally. Turn on 'Keep awake' in the controls if you want the Screen Wake Lock to keep the panel on.",
      },
      {
        q: "Can I set it as my computer's real screensaver?",
        a: "Not directly. It runs in a browser tab, so it won't start by itself when your computer goes idle. Open it full-screen when you step away, or leave it running on a spare display.",
      },
      {
        q: "Can it cause burn-in on an OLED?",
        a: "The moving effects (matrix rain, starfield, snow, pipes and the DVD logo) keep the image changing, which is what a screensaver is for. The clock is the exception: its digits stay in the middle of the screen, so don't leave it running for hours on an OLED.",
      },
    ],
  },
  {
    slug: "boot-screen-simulator",
    name: "Boot Screen Simulator",
    title: "Boot Screen Simulator",
    tagline: "Full-screen Windows 10, Windows XP, and macOS startup screens.",
    description:
      "Free boot screen simulator. Show a realistic Windows 10, Windows XP, or macOS startup screen full-screen — great for pranks, mock-ups, and videos.",
    category: "fun",
    noindex: true,
    icon: "🔌",
    updatedAt: "2026-10-01",
    keywords: [
      "boot screen simulator",
      "windows boot screen",
      "windows xp loading screen",
      "mac startup screen",
      "fake boot screen",
    ],
    howTo: [
      "Choose Windows 10, Windows XP, or macOS with the ← / → arrows under the Start button.",
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
    updatedAt: "2026-11-26",
    keywords: ["burn-in test", "oled burn in", "image retention", "amoled", "ghost image"],
    howTo: [
      "Set brightness high and click Start.",
      "Step through white, grey, and each RGB field with ← / →.",
      "Look for faint outlines of logos, bars, or HUDs that shouldn't be there — grey shows them best.",
      "Use the checkerboard frame to help even out short-term retention.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
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
    tagline: "Checkerboards plus black crush and white clipping boxes to judge contrast at both ends.",
    description:
      "Free contrast test. Black-and-white checkerboards plus 1–10% near-black and 90–99% near-white boxes reveal crushed shadows, clipped highlights and low contrast.",
    category: "panel",
    icon: "◧",
    updatedAt: "2026-11-27",
    keywords: ["contrast test", "checkerboard", "black white level", "contrast ratio"],
    howTo: [
      "Click Start and view the checkerboard full-screen.",
      "Use ← / → to change the grid density (4×4 up to 32×32).",
      "Black squares should stay deep black and white squares bright, with crisp edges between them.",
      "Black crush (→): in a dim room you should see the boxes from about 2–3% upward. White clipping (→): the boxes should stand out from the white up to about 97–98%.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What should I look for?",
        a: "Clean separation between black and white with sharp borders. Greyish blacks indicate low contrast; fuzzy edges can indicate poor sharpness or scaling.",
      },
      {
        q: "Can this measure my contrast ratio?",
        a: "No. A contrast ratio is a measurement of light output and needs a meter. This is a visual check: it shows whether black stays deep right next to bright white, which is what a high or low contrast ratio looks like in practice.",
      },
      {
        q: "Which panel types do best?",
        a: "OLED, because each pixel switches off: its black squares stay fully dark beside white ones. Among LCDs, VA panels typically reach 2,500:1 to 5,000:1 and IPS around 1,000:1, so IPS blacks look noticeably greyer in a dark room.",
      },
    ],
  },
  {
    slug: "black-level-test",
    name: "Black Level Test",
    title: "Black Level Test",
    tagline: "Near-black steps to see how dark your panel really goes.",
    description:
      "Free black level test. Compare near-black grey steps to judge shadow detail, black depth, and IPS glow — see which dark levels your screen still shows.",
    category: "panel",
    icon: "▰",
    updatedAt: "2026-11-26",
    keywords: ["black level test", "shadow detail", "near black", "black depth", "ips glow"],
    howTo: [
      "Dim the room and set brightness to your normal level, then click Start.",
      "Each vertical band is slightly brighter than pure black (the number is its value).",
      "Note the lowest band you can still tell apart from pure black — that's your shadow floor.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "How many steps should I see?",
        a: "On a good display in a dark room you can usually distinguish the steps from value 2–4 upward. If low steps all look identical to black, shadow detail is being crushed (often a brightness/black-level or 'Limited' RGB range setting).",
      },
      {
        q: "Should I turn brightness up until I see every step?",
        a: "Not on a monitor: its brightness control mostly drives the backlight, which makes every step easier to see but also lifts black. Test at the brightness you actually use. On TVs, the setting called Brightness often controls black level itself, and that is the one to adjust.",
      },
      {
        q: "Why do the dark bands glow toward the corners?",
        a: "That's IPS glow or backlight bleed, not a shadow-detail problem: backlight showing through at an angle or leaking at the edges. Judge the steps from the center of the screen, and use the Backlight Bleed Test to look at the corners.",
      },
    ],
  },
  {
    slug: "viewing-angle-test",
    name: "Viewing Angle Test",
    title: "Viewing Angle Test",
    tagline: "Grey steps and color bars to reveal off-axis color/brightness shift.",
    description:
      "Free viewing angle test. Show grey steps and color bars, then move your head to see how much brightness and color shift off-axis on TN and VA panels.",
    category: "panel",
    icon: "◑",
    updatedAt: "2026-11-26",
    keywords: ["viewing angle test", "color shift", "off axis", "tn va ips angle"],
    howTo: [
      "Click Start and sit centered first to set a reference.",
      "Move your head left/right and up/down, and step back.",
      "Watch how much the grey steps wash out and the colors shift — less shift is better.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What's normal?",
        a: "IPS and OLED hold color and brightness well off-axis. TN panels shift heavily (especially vertically) and VA panels show a contrast/gamma shift and corner glow. Some shift is normal — large shifts mean a narrow viewing cone.",
      },
      {
        q: "Why do the corners look different even when I sit centered?",
        a: "On a large screen, or one close to you, the corners are already seen at an angle. TN and VA panels show that as darker or washed-out corners even from the middle seat. A curved monitor keeps the edges closer to head-on and reduces it.",
      },
      {
        q: "Which part of the pattern should I watch?",
        a: "The grey steps across the top show brightness and gamma shift: on a narrow-angle panel the dark steps wash out or merge as you move, and the greys pick up a tint. The color bars underneath show saturation dropping and hues shifting.",
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
    updatedAt: "2026-11-26",
    keywords: ["gamma test", "gamma 2.2", "gamma calibration", "grayscale gamma"],
    howTo: [
      "Click Start and step back a little (the stripes should blur into solid grey).",
      "Compare each labelled patch (γ 1.8–2.4) against the striped background.",
      "The patch that most disappears into the stripes is your display's gamma — aim for 2.2.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What gamma should I target?",
        a: "2.2 (sRGB standard) for general use. If the lower-value patches blend in, your gamma is too low (washed out); if the higher ones match, it's too high (crushed shadows). Adjust the monitor's gamma preset or OS calibration.",
      },
      {
        q: "Do Mac and Windows use different gamma?",
        a: "Not any more. Both target 2.2 by default; macOS moved from 1.8 to 2.2 in 2009. What differs is each display's own response, and that is what this test reads.",
      },
      {
        q: "Is this as accurate as a calibration tool?",
        a: "No. It gives a good visual estimate of your display's gamma around mid-grey, but it can't measure the whole curve from black to white, or correct it. A colorimeter does both.",
      },
    ],
  },
  {
    slug: "screen-tearing-test",
    name: "Screen Tearing Test",
    title: "Screen Tearing Test",
    tagline: "Fast scrolling bars that reveal tearing, and dark grays that reveal VRR flicker.",
    description:
      "Free screen tearing and VRR flicker test. Scrolling bars show tears without V-Sync; a changing frame rate on dark grays shows G-Sync and FreeSync flicker.",
    category: "motion",
    icon: "⇿",
    updatedAt: "2026-11-28",
    keywords: ["screen tearing test", "vsync", "g-sync", "freesync", "vrr test"],
    howTo: [
      "Click Start and watch the moving bars.",
      "Use ← / → to switch between vertical bars (reveals horizontal tears) and horizontal bars (reveals vertical tears).",
      "A clean image means no tearing; a break where the bars misalign is a tear.",
      "Toggle V-Sync or adaptive sync (G-Sync/FreeSync) and compare.",
      "VRR flicker (→): dark grays at a frame rate that keeps changing. Turn on your monitor's refresh rate readout: if the number jumps around, VRR is active and any shimmer in the grays is VRR flicker.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "How do I stop tearing?",
        a: "Enable adaptive sync (G-Sync/FreeSync) for tear-free, low-lag motion, or V-Sync to cap frames to the refresh rate (adds some lag). See our screen tearing guide for the full breakdown.",
      },
      {
        q: "Why don't I see any tearing here?",
        a: "Browsers usually draw in sync with the display, so a clean result is common and doesn't prove your games won't tear. Games tear when they send frames with V-Sync off. If you do see tears here, check that hardware acceleration is on in your browser and that the display is running at its rated refresh rate.",
      },
      {
        q: "What does the speed slider change?",
        a: "How fast the bars move. Faster motion makes the offset at a tear wider and easier to spot. If motion looks jerky rather than torn, frames are being skipped or repeated; the Frame Skipping Test checks for that directly.",
      },
    ],
  },
  {
    slug: "touch-screen-test",
    name: "Touch Screen Test",
    title: "Touch Screen Test",
    tagline: "Touch every cell, draw freely or track up to ten fingers to find dead zones and multi-touch limits.",
    description:
      "Free touch screen test for phones, tablets and touch laptops. Fill a grid, draw, or track ten fingers with coordinates to find dead zones and ghost touches.",
    category: "panel",
    icon: "👆",
    updatedAt: "2026-11-28",
    keywords: ["touch screen test", "touchscreen test", "dead zone test", "multi touch test", "digitizer test", "phone touch test"],
    howTo: [
      "Click Start and hold the device the way you normally would.",
      "Drag a finger slowly over every cell of the grid — each one turns green as it registers.",
      "Cells that stay dark after you've covered them are dead zones. In Free draw (→), breaks or jumps in your lines show dead spots and ghost touches.",
      "In Multi-touch (→), put several fingers down: each gets a numbered marker with its coordinates, and the counter shows the most tracked at once.",
      "Press and hold anywhere for the controls (Reset, Exit), or press Esc.",
    ],
    faq: [
      {
        q: "What does a dead zone look like?",
        a: "A patch of cells that won't turn green however slowly you drag over them, or a gap that appears in the same place every time you draw a line through it. One stubborn cell is usually just a missed spot; the same cells failing every time is a fault in the touch layer.",
      },
      {
        q: "How many touch points should a screen support?",
        a: "Most phones and tablets track at least five fingers at once, and many track ten. Touch laptops vary. The counter shows the most fingers seen at the same time — if it never goes above one or two, multi-touch isn't working.",
      },
      {
        q: "Does a screen protector affect the test?",
        a: "A thick, cracked or lifting protector can create dead spots of its own. If you find one, take the protector off and test again before you blame the screen.",
      },
    ],
  },
  {
    slug: "screen-info",
    name: "Screen Info",
    title: "Screen Resolution & Display Info Checker",
    tagline: "See your screen resolution, scaling, refresh rate, color gamut and HDR support.",
    description:
      "What's my screen resolution? See your display's resolution, scaling, aspect ratio, refresh rate, color gamut and HDR support, read live in your browser.",
    category: "fun",
    icon: "ℹ️",
    updatedAt: "2026-11-20",
    keywords: ["what is my screen resolution", "screen resolution checker", "display info", "my screen size", "device pixel ratio", "screen resolution test"],
    howTo: [
      "Open the page — every value is read live from your browser, with nothing to start.",
      "Check the pixel resolution and display scaling against your screen's specifications.",
      "Give the measured refresh rate a second to settle.",
      "Use Copy all to paste the details into a support ticket or a forum post.",
    ],
    faq: [
      {
        q: "Why doesn't it show my screen's exact resolution?",
        a: "Browsers report sizes after display scaling, so the pixel resolution here is the scaled size multiplied by the scaling factor. With unusual scaling or browser zoom it can be off by a few pixels. Your operating system's display settings show the true native resolution.",
      },
      {
        q: "Why does it say 24-bit color on a 10-bit monitor?",
        a: "The browser reports what the operating system hands it: usually 24-bit (8 bits per channel), and 30-bit on some 10-bit setups such as Apple's XDR displays. Many 10-bit monitors still show 24 because the computer is sending 8-bit color, so the color gamut and HDR rows are often more telling.",
      },
      {
        q: "Is any of this sent anywhere?",
        a: "No. Everything is read and shown in your browser, and nothing leaves the page unless you copy it yourself.",
      },
    ],
  },
  {
    slug: "overscan-test",
    name: "Overscan Test",
    title: "Overscan & Aspect Ratio Test",
    tagline: "Edge markers, circles, a grid and edge lines to catch cropping, stretching and distortion.",
    description:
      "Free overscan and aspect ratio test for TVs, projectors and phones. Check for cropped edges, stretched pictures and distortion with full-screen patterns.",
    category: "panel",
    icon: "📐",
    updatedAt: "2026-11-28",
    keywords: ["overscan test", "aspect ratio test", "tv overscan", "projector test pattern", "geometry test", "screen fit test"],
    howTo: [
      "Open the page on the device connected to the TV or projector, then click Start.",
      "Overscan border: if the 0% frame shows all the way round, nothing is cropped. If not, the crop lies between the outermost frame you can see all the way round and the next one out.",
      "Aspect ratio (→): the circles must look perfectly round and the square square.",
      "Geometry grid (→): lines should be straight and evenly spaced. Use it to line up a projector.",
      "Edge lines (→), for phones and tablets: lines 0 to 32 px in from each edge. Rounded corners and a notch cut them off; use them to see whether a screen protector's edge sits over the picture, and evenly on every side.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "What is overscan?",
        a: "Many TVs still enlarge the picture by a few percent and crop the edges — a habit left over from analog broadcasts. It cuts off taskbars and menus and softens the image. Look for a picture-size setting called Just Scan, Screen Fit, Fit to Screen, 1:1 or Overscan Off.",
      },
      {
        q: "The circles look oval — what's wrong?",
        a: "The picture is being stretched. Set the TV or projector's picture size to 16:9 or its native/Original mode, and check that your computer's output resolution matches the screen's aspect ratio.",
      },
    ],
  },
  {
    slug: "sharpness-test",
    name: "Sharpness Test",
    title: "Sharpness & Text Clarity Test",
    tagline: "Pixel-level lines, checkerboards and text to expose scaling blur, subpixel fringing and oversharpening.",
    description:
      "Free sharpness and text clarity test. Pixel-perfect lines and small text reveal scaling blur, subpixel color fringing on OLEDs and TV oversharpening.",
    category: "panel",
    icon: "🔎",
    updatedAt: "2026-11-28",
    keywords: ["sharpness test", "text clarity test", "monitor sharpness", "native resolution test", "chroma subsampling test", "pixel perfect test"],
    howTo: [
      "Click Start and view each pattern full-screen at your normal distance.",
      "1-pixel lines and checkerboards should look crisp and evenly striped. Grey mush or wavy moiré means the image is being scaled.",
      "Text clarity (→): small text should be sharp, and red or yellow text shouldn't smear.",
      "Subpixel fringing (→): look closely at the lines and letters. Green and magenta edges on a QD-OLED, or colored edges on other OLEDs, come from the panel's subpixel layout.",
      "Sharpening halos (→): turn the screen's Sharpness setting down until the outlines around the lines and rings disappear.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why do the fine lines look grey and blurry?",
        a: "Something between the page and the panel is resampling the image: a non-native resolution, a scaled resolution on a Mac, browser zoom, or the TV's own scaling. Set your output to the screen's native resolution and test again.",
      },
      {
        q: "Why does red text look smeared on my TV?",
        a: "Many TVs and some HDMI connections carry color at reduced resolution (chroma subsampling, 4:2:2 or 4:2:0). Colored text smears while black-and-white text stays sharp. Use the TV's PC or Game mode, or set the output to RGB / 4:4:4.",
      },
    ],
  },
  {
    slug: "frame-skipping-test",
    name: "Frame Skipping Test",
    title: "Frame Skipping Test",
    tagline: "One cell per frame — photograph it to catch a screen that drops frames.",
    description:
      "Free frame skipping test. One cell lights per refresh, so a photo with a slow shutter shows an unbroken run — or gaps where your monitor drops frames.",
    category: "motion",
    icon: "🎞️",
    updatedAt: "2026-11-28",
    keywords: ["frame skipping test", "monitor overclock test", "dropped frames test", "refresh rate overclock", "frame skip"],
    howTo: [
      "Close other apps and tabs, then click Start.",
      "Photograph the screen with a slow shutter, 1/10 s or longer, using your phone's Pro or manual mode.",
      "In the photo, the lit cells should form one unbroken run. A gap means a frame was skipped.",
      "Use the 120-cell grid (→) on screens above 144Hz, so a long exposure still fits on the grid without wrapping around.",
      "Take a few photos before drawing conclusions, then press Esc to exit.",
    ],
    faq: [
      {
        q: "Why would a monitor skip frames?",
        a: "Usually because its refresh rate has been overclocked or set through a custom resolution. The screen accepts the faster signal but quietly drops frames to keep up, so it feels no smoother than before.",
      },
      {
        q: "Can the browser cause gaps too?",
        a: "Not usually. A busy computer makes the browser miss refreshes, but a missed refresh leaves the previous cell lit for twice as long, so it photographs brighter rather than as a gap. Gaps from the computer side can appear when the browser runs at a different rate from the screen, so check that the Hz readout matches the rate you set, repeat the photo a few times, and only worry about gaps that keep appearing.",
      },
    ],
  },
  {
    slug: "wide-color-gamut-test",
    name: "Wide Color Gamut Test",
    title: "Wide Color Gamut (P3) Test",
    tagline: "Hidden logos in P3 colors that only a wide-gamut screen can show.",
    description:
      "Free wide color gamut test. Check whether your screen and browser can show Display P3 colors beyond sRGB, with hidden logos only wide-gamut displays reveal.",
    category: "color",
    icon: "△",
    updatedAt: "2026-11-20",
    keywords: ["wide color gamut test", "p3 test", "display p3 test", "dci-p3 test", "color gamut test", "srgb vs p3"],
    howTo: [
      "Click Start and look at each color full-screen.",
      "On a wide-gamut screen you'll see a logo inside each color — a more intense ring around a square.",
      "On a standard sRGB screen the logo is invisible, because both colors are clipped to the same shade.",
      "Check the chips above the test to see what your browser reports, then press Esc to exit.",
    ],
    faq: [
      {
        q: "I can't see the logo — is my screen faulty?",
        a: "Not at all. Most office monitors and many laptops are sRGB, which is accurate for the web. The logo only appears when the screen, the operating system and the browser all handle wide color.",
      },
      {
        q: "Which colors show it best?",
        a: "Reds and greens: Display P3 extends furthest beyond sRGB there. Blue shows the smallest difference, so a faint logo on blue is normal.",
      },
    ],
  },
  {
    slug: "pwm-flicker-test",
    name: "PWM Flicker Test",
    title: "PWM Flicker Test",
    tagline: "Bright fields and a fast-moving line for the pencil and camera flicker tests.",
    description:
      "Free PWM flicker test. Bright fields for the pencil and camera tests, plus a fast-moving line that turns into a row of copies on a PWM-dimmed screen.",
    category: "panel",
    icon: "〰️",
    updatedAt: "2026-11-26",
    keywords: ["pwm test", "pwm flicker test", "screen flicker test", "pwm dimming test", "flicker free test"],
    howTo: [
      "Set the screen to the brightness you normally use — PWM usually appears at low brightness.",
      "On the White field, wave a pencil quickly in front of the screen: several crisp copies mean PWM, a smooth blur means flicker-free.",
      "Or point your phone camera at the screen: dark bands rolling across it suggest PWM.",
      "On the Fast moving line (→), follow the line with your eyes: a row of separate lines instead of one smooth streak means PWM.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Can this page detect PWM by itself?",
        a: "No. A web page can't see your backlight, so the result comes from what you observe — these patterns just make the effects easy to spot. A slow-motion camera or a cheap light sensor gives a definitive answer.",
      },
      {
        q: "Why does it only show at low brightness?",
        a: "Many screens dim by switching the backlight off for part of each cycle. At high brightness the off periods are short or absent, so the flicker appears as you turn the brightness down.",
      },
    ],
  },
  {
    slug: "hdr-test",
    name: "HDR Test",
    title: "HDR Test: Does Your Screen Show HDR?",
    tagline: "A real HDR image with brightness steps up to 1,600 nits, plus HDR detection.",
    description:
      "Free HDR test. Check whether your screen and browser display HDR with a real HDR image of brightness steps from 100 to 1,600 nits, plus capability checks.",
    category: "color",
    icon: "☀️",
    updatedAt: "2026-11-26",
    keywords: ["hdr test", "is my screen hdr", "hdr brightness test", "hdr monitor test", "peak brightness test", "hdr check"],
    howTo: [
      "Turn HDR on first — on Windows, Settings > System > Display > Use HDR.",
      "Check the chips above the test: the browser should report an HDR display.",
      "Click Start. On a working HDR setup, the patches keep getting brighter past 203 nits (SDR white) up to your screen's peak.",
      "If every patch from 203 nits up looks the same white, the image is being shown in SDR.",
      "Press Esc to exit. On a phone, tap the middle of the screen, then Exit.",
    ],
    faq: [
      {
        q: "Why do all the bright patches look the same?",
        a: "The image is being shown in SDR: HDR is off in your operating system, the browser can't display HDR images, or the screen isn't HDR. Every patch above 203 nits then clips to the same white.",
      },
      {
        q: "Where do the patches stop getting brighter?",
        a: "At roughly your screen's peak brightness. An entry-level DisplayHDR 400 monitor tops out around 400 nits, so the 600, 1,000 and 1,600 patches look alike; a good Mini-LED or OLED keeps them apart further.",
      },
      {
        q: "Which browsers show HDR images?",
        a: "Support still varies by browser and operating system; Chromium-based browsers such as Chrome and Edge are currently the most consistent. If the chips say HDR is available but the patches look flat, try another browser.",
      },
    ],
  },
  {
    slug: "screen-size-calculator",
    name: "Screen Size Calculator",
    title: "Screen Size & PPI Calculator",
    tagline: "Work out pixel density, physical width and height, and aspect ratio from a screen's size and resolution.",
    description:
      "Free screen size and PPI calculator. Enter a diagonal and a resolution to get pixel density, physical width and height, aspect ratio and pixel pitch.",
    category: "fun",
    icon: "📏",
    updatedAt: "2026-11-26",
    keywords: ["ppi calculator", "screen size calculator", "pixel density calculator", "aspect ratio calculator", "monitor size calculator", "dpi calculator"],
    howTo: [
      "Enter the screen's diagonal size in inches, as printed in its specifications.",
      "Enter its resolution in pixels. The fields start with the resolution your browser reports for this screen.",
      "Read the pixel density (PPI), the physical width and height, and the aspect ratio.",
      "Change the numbers to compare another screen, for example a 27-inch 1440p monitor against a 32-inch 4K one.",
    ],
    faq: [
      {
        q: "What is PPI?",
        a: "Pixels per inch: how many pixels fit along one inch of the screen. It is the resolution spread over the physical size, and it decides how sharp text and fine detail look. Two screens with the same resolution but different sizes have different PPI.",
      },
      {
        q: "What PPI should a monitor have?",
        a: "At a normal desk distance, about 90 to 110 PPI is the standard range: a 24-inch 1080p screen is about 92 and a 27-inch 1440p about 109. Around 135 to 165 PPI, such as a 27-inch or 32-inch 4K, looks very crisp but usually needs display scaling. Below about 90, text starts to look soft.",
      },
      {
        q: "Is PPI the same as DPI?",
        a: "For screens the two are used to mean the same thing. Strictly, PPI counts the pixels of a display and DPI counts the ink dots of a printer, but operating systems and mouse settings say DPI for both.",
      },
      {
        q: "Why isn't the diagonal enough to compare two screens?",
        a: "Because the shape matters. A 34-inch ultrawide is wider than a 32-inch 16:9 screen but not as tall, and has less area than its diagonal suggests. Compare the width and height the calculator gives, not the diagonal.",
      },
      {
        q: "Can this page measure how big my screen is?",
        a: "No. A browser knows how many pixels a screen has, but not how large they are, so the diagonal has to come from you. Use the size in the specifications, or measure the visible picture from corner to corner.",
      },
    ],
  },
  {
    slug: "screen-test-checklist",
    name: "Screen Test Checklist",
    title: "Screen Test Checklist",
    tagline: "The tests to run on a monitor, laptop, phone or TV, in order, marked pass or fail, with a report you can share.",
    description:
      "Free screen test checklist for a new or used monitor, laptop, phone or TV. Run the right tests in order, mark each pass or fail, and share the report.",
    category: "fun",
    icon: "✅",
    updatedAt: "2026-11-27",
    keywords: ["screen test checklist", "new monitor checklist", "test new monitor", "used phone screen check", "new tv test", "laptop screen test"],
    howTo: [
      "Pick the device you are testing: monitor, laptop, phone or tablet, or TV.",
      "Start with the tests marked Essential. They find the faults a retailer will take a screen back for.",
      "Open each test, run it, then come back and mark it Pass or Fail. Your results are saved in this browser only.",
      "Finish the essential tests while you can still return the device. The others can wait.",
      "Buying or selling a used screen? Add the device's name, then copy the report or share a link with the results built in.",
    ],
    faq: [
      {
        q: "Which tests matter most on a new screen?",
        a: "The ones that find hard defects: dead and stuck pixels, backlight bleed, and uneven brightness. On a phone, add the touch test and, for an OLED, the burn-in test. Those are the faults you can send a device back for, and they are marked Essential.",
      },
      {
        q: "How long does the checklist take?",
        a: "The essential tests take about ten minutes. The full list for a device takes closer to half an hour, mostly because the dark-room tests need your eyes to adjust.",
      },
      {
        q: "Why does the order matter?",
        a: "Return windows are short. Running the tests for hard defects first means that if you run out of time, you have already checked the things a return covers. Settings problems, such as a wrong refresh rate, can be fixed at any point.",
      },
      {
        q: "Is my progress stored anywhere?",
        a: "Only in this browser, on this device. Nothing is sent to a server, and clearing the browser's site data clears the results. A share link carries the results inside the link itself, so whoever opens it sees them; nothing is uploaded.",
      },
      {
        q: "What should I do when a test finds a problem?",
        a: "Each test page has a section on reading the result and what to do next. In general: photograph the fault, note the date, and contact the retailer while the return window is still open.",
      },
      {
        q: "Can I trust a report someone sent me?",
        a: "Treat it as the seller's word. A shared report shows what the sender marked; it can't prove the tests were run, or run on that screen. If you are buying, run the essential tests on the screen yourself before you pay.",
      },
    ],
  },
];

// Further questions per tool, appended to each tool's `faq` above. Kept apart for the
// same reason as TOOL_TIPS. They cover what to do about a result: settings paths,
// device differences, and whether a fault can be fixed. Settings paths and limits must
// agree with the guides (the refresh-rate, HDR and RGB-range guides in particular).
const TOOL_FAQ_MORE: Record<string, ToolFaq[]> = {
  "dead-pixel-test": [
    {
      q: "How many dead pixels are acceptable on a new screen?",
      a: "There is no universal number. Each manufacturer publishes its own pixel policy, and most allow a few faults before a panel counts as defective, with bright pixels counted more strictly than dark ones. That only applies to warranty claims. Inside the retailer's return window you can send a screen back for a single dead pixel.",
    },
    {
      q: "Do dead pixels spread?",
      a: "A single dead pixel does not spread to its neighbors. If new ones keep appearing, or a dark area is growing, the cause is something else: pressure or impact damage, liquid, or a failing connection to the panel. That is worth a warranty claim whatever the pixel count.",
    },
    {
      q: "Is the stuck-pixel fixer safe to use?",
      a: "It only shows rapidly changing colors inside a small box, so it cannot harm the panel. It does flash quickly: don't watch it, and don't use it at all if you are sensitive to flashing light. Drag the box over the pixel, start it and look away.",
    },
    {
      q: "How do I check a phone or a laptop for dead pixels?",
      a: "The same way, only closer. Pixels on a phone or a high-resolution laptop are very small, so hold the screen nearer than usual and scan it in strips. iPhone Safari can't go fully full-screen, so there the color fills the browser window; scroll the address bar away and check the top and bottom edges separately.",
    },
  ],
  "color-test": [
    {
      q: "What does an uneven tint on white or gray mean?",
      a: "If the whole screen leans warm or cool, that is the color temperature setting, or a night mode that is still on. If only one area is tinted, such as a yellowish edge or a pink corner, the panel or its backlight is uneven there, and no setting will remove it.",
    },
    {
      q: "Should I test at maximum brightness?",
      a: "Use maximum brightness to find faults, because faint dots and patches are easier to see. Then look again at the brightness you normally use to decide whether a fault matters in practice.",
    },
    {
      q: "How is this different from the Dead Pixel Test?",
      a: "Both show the same solid colors. The Dead Pixel Test adds the Stuck-pixel fixer frame and guidance on pixel faults. Use this page when you are checking for tint and uneven patches, or when you simply want a full-screen color.",
    },
    {
      q: "Why does red look orange, or the colors look washed out?",
      a: "Check the picture mode first. Eco and reading modes lower saturation, a night mode pulls everything toward orange, and an sRGB mode on a wide-gamut monitor deliberately tones the colors down. If the colors are weak in every mode, the panel has a narrow gamut.",
    },
  ],
  "black-screen": [
    {
      q: "Does a black screen save power?",
      a: "On an OLED, yes: black pixels are switched off and draw almost nothing. On an LCD, hardly at all, because the backlight stays on behind the black image. To save power on an LCD, lower the brightness or let the display sleep.",
    },
    {
      q: "Is the display off, or showing black?",
      a: "It is on and showing a black image. On an LCD in a dark room you can tell from the faint grey glow of the backlight. On an OLED there is nothing to see, which is why the page keeps the screen awake: you can be sure it has not simply gone to sleep.",
    },
  ],
  "white-screen": [
    {
      q: "Can I use the white screen as a light?",
      a: "Yes. At full brightness a white screen makes a soft, even light for a video call, for reading in the dark, or for tracing a drawing onto paper. A larger screen gives a softer light.",
    },
    {
      q: "Will a white screen at full brightness harm my display?",
      a: "Not in a short test. Full white is the hardest picture for a screen to show, so it will get warm and use the most power, and an OLED may dim itself after a while to protect the panel. Avoid leaving any static image on an OLED for hours.",
    },
  ],
  "backlight-bleed-test": [
    {
      q: "Does backlight bleed get worse over time?",
      a: "Usually not. It tends to stay the same, and on a new screen it sometimes eases over the first few weeks as the frame settles. Bleed that appears suddenly or keeps growing points to pressure on the panel, heat, or a knock.",
    },
    {
      q: "Can backlight bleed be fixed?",
      a: "There is no reliable fix at home. Pressing on the panel or loosening the bezel can damage it and may void the warranty. Lower brightness and a little light in the room make bleed much less visible. If it bothers you in normal use, return the screen while you still can.",
    },
    {
      q: "Why does bleed look so much worse in my photo?",
      a: "In the dark a phone camera uses a long exposure and boosts the signal, which turns a faint haze into bright clouds. Use photos to record where the bleed is, with the exposure locked, and trust your eyes for how strong it is.",
    },
  ],
  "greyscale-test": [
    {
      q: "Is the banding from my screen or from the video I was watching?",
      a: "This page draws its gradient fresh, with no compression, so any bands you see here come from your display or its settings. If this gradient is smooth but a film or stream shows bands in skies and shadows, the video's compression is the cause, not the screen.",
    },
    {
      q: "Why is banding easiest to see in dark areas?",
      a: "The eye is more sensitive to small steps in brightness at the dark end, and many panels handle the last few shades above black less precisely. That is why night skies and shadows band first.",
    },
    {
      q: "How many steps should I be able to count?",
      a: "All 32. If the darkest two or three merge into black, shadow detail is being crushed. If the brightest few merge into white, highlights are clipping, usually because the Contrast setting is too high.",
    },
    {
      q: "Does a picture mode or HDR change the result?",
      a: "Yes. Vivid, dynamic and game modes reshape the tone curve, and dynamic contrast changes it from moment to moment. Test in the standard or sRGB mode. With HDR switched on in Windows, ordinary content is remapped and can band where it did not before.",
    },
    {
      q: "Is banding a reason to return a monitor?",
      a: "Mild banding in a full-screen gradient is common, especially on 6-bit + FRC panels, and is not a defect. Clear bars in ordinary content, after you have ruled out the settings, on a panel sold as 8-bit or 10-bit, are worth raising with the seller inside the return window.",
    },
  ],
  "color-gradient-test": [
    {
      q: "Why did banding appear after I turned on night mode or changed a color profile?",
      a: "Night modes, color profiles and manual RGB adjustments all work by remapping the values sent to the screen. With standard 8-bit color that leaves fewer distinct steps per channel, so bands appear in gradients that were smooth before. Switch them off and check again.",
    },
    {
      q: "What do 8-bit, 10-bit and 6-bit + FRC mean?",
      a: "They say how many brightness steps each color channel has. 8-bit gives 256 steps, 10-bit gives 1,024. A 6-bit panel has only 64 real steps and uses FRC, rapid switching between two neighboring shades, to imitate the ones in between.",
    },
    {
      q: "Will a 10-bit monitor remove banding?",
      a: "Only when the content, the app, the graphics output and the cable all carry 10-bit color. Most desktop content is 8-bit, and it should still look smooth on a good 8-bit panel. Banding you see here is more often a setting than a missing bit depth.",
    },
    {
      q: "I see a fine grain shimmering in the dark gradients. Is that a fault?",
      a: "No. That is dithering or FRC: the panel is alternating between two shades to produce one it cannot show directly. It is normal on many screens and usually disappears at a normal viewing distance.",
    },
    {
      q: "Can a browser show a 10-bit gradient?",
      a: "Sometimes. The 8-bit vs 10-bit frame draws its lower half on a high-precision canvas where the browser has one, and says on screen when it doesn't. After that, the operating system, graphics driver and panel each either keep the extra levels, dither them or round them away. A smoother lower half means more than 8 bits, or dithering, reaches the screen; two identical halves mean an 8-bit step somewhere in between.",
    },
  ],
  "brightness-uniformity-test": [
    {
      q: "Can uneven brightness be fixed?",
      a: "Not with a normal setting, because it comes from the backlight and the panel layers. Some monitors have a uniformity compensation mode that evens the picture out at the cost of some brightness and contrast. If a patch is distracting in normal use, return the screen inside the return window.",
    },
    {
      q: "Why test on gray instead of white?",
      a: "Differences in brightness show most clearly on a mid-tone. On full white the screen is at its brightest and your eyes adapt to it, which hides darker corners and patches that are plain to see on gray.",
    },
    {
      q: "Do OLED screens have uniformity problems?",
      a: "They have no backlight, so they do not cloud or bleed. They can still show faint vertical bands or a slight tint difference on very dark gray, and worn areas after long use. Light banding on a dark gray field is common on large OLED TVs.",
    },
    {
      q: "Why are the corners of my laptop screen darker?",
      a: "Most laptop screens are lit from one edge, and the light is spread across the panel by a thin guide layer. Some falloff toward the far corners is normal. A sharp-edged dark patch is different and points to pressure damage.",
    },
    {
      q: "How do I photograph uneven brightness fairly?",
      a: "Stand back, shoot from straight in front and lock the exposure on the middle of the screen. Turn off the camera's night mode, which exaggerates small differences. Use the photo as a record, and judge severity with your eyes.",
    },
    {
      q: "Why test on dark gray as well as 50% gray?",
      a: "Faults that are faint at mid gray stand out near black. An OLED can show vertical bands or a pinkish tint at 5–10% gray, and an LCD shows clouding as patches of brighter backlight. A little unevenness at 5% gray is normal on every panel: it only matters if you notice it in dark scenes at the brightness you use.",
    },
  ],
  "refresh-rate-test": [
    {
      q: "How do I change my refresh rate?",
      a: "On Windows, go to Settings > System > Display > Advanced display and choose a refresh rate. On a Mac, open System Settings > Displays and use the Refresh Rate menu. With more than one monitor, the rate is set separately for each display.",
    },
    {
      q: "Is refresh rate the same as frame rate?",
      a: "No. Refresh rate (Hz) is how many times a second the screen redraws. Frame rate (fps) is how many new pictures the computer or game produces. You only see the benefit of a 144 Hz screen when the source also delivers close to 144 frames a second.",
    },
    {
      q: "Why does my 120 Hz phone read 60 Hz?",
      a: "Phones change their refresh rate to save battery, and a battery-saver mode usually locks it to 60 Hz. Some mobile browsers also limit web pages to 60 updates a second whatever the panel can do. A 60 Hz reading on a phone is therefore not proof of a problem.",
    },
    {
      q: "Which screen does it measure when I have two monitors?",
      a: "The one the browser window is on. Drag the window to the other monitor and the reading follows after a moment. With monitors running at different rates, some browsers tie themselves to one of them, so test each monitor with the window fully on it.",
    },
    {
      q: "What counts as a dropped frame here?",
      a: "A refresh the browser didn't draw in time, measured from animation-frame timing. Drops show when the browser, the graphics card or a background task can't keep up, which is also what makes games stutter. The test can't see frames the monitor itself skips: the Frame Skipping Test checks that.",
    },
  ],
  "ghosting-test": [
    {
      q: "My monitor is rated 1 ms. Why do I still see a trail?",
      a: "A response-time figure is a best case, usually measured at the strongest overdrive setting, where the bright fringe of overshoot is already visible. At the setting that looks cleanest, real transitions take longer. The blur you get from your eyes following a moving object also has nothing to do with response time.",
    },
    {
      q: "Do OLED screens have ghosting?",
      a: "Almost none. OLED pixels change state nearly instantly, so there is no smeared trail. They still show the ordinary blur of any display that holds each frame still, which only a higher refresh rate or a strobing mode reduces.",
    },
  ],
  "blooming-test": [
    {
      q: "Why is blooming worse when I watch from the side?",
      a: "LCD panels block the backlight less effectively at an angle, so more of each lit zone leaks through around a bright object. Halos that are mild from straight ahead can look much larger from the end of the sofa.",
    },
    {
      q: "Is blooming stronger in HDR?",
      a: "Yes. HDR highlights are far brighter than anything in SDR, so the zones behind them are driven harder and more light spills into the dark areas next to them. Subtitles on a dark scene are the classic example.",
    },
    {
      q: "How many dimming zones are enough?",
      a: "There is no fixed number. More zones mean each one is smaller, so the halo around a bright object is smaller too. Screens that dim in a handful of vertical strips light a whole column behind a small object. The zone sweeps show how fine yours is.",
    },
    {
      q: "Is blooming the same as backlight bleed?",
      a: "No. Backlight bleed stays in the same place, usually at an edge, whatever is on screen. Blooming follows bright objects around and only exists on screens with local dimming.",
    },
    {
      q: "Should I turn local dimming off?",
      a: "For desktop work, often yes: a white cursor or text on a dark background causes halos and makes the brightness pump. For films, games and HDR, leave it on, because it is what gives those screens their deep blacks.",
    },
  ],
  "burn-in-test": [
    {
      q: "Can burn-in be fixed?",
      a: "No. Burn-in is uneven wear of the pixels, and worn pixels do not recover. A panel's own refresh or compensation cycle can make a mark less visible by evening out the area around it, but it cannot restore the worn pixels.",
    },
    {
      q: "Can an LCD get burn-in?",
      a: "LCDs can show image persistence: a faint outline after a static picture has been up for a long time. It nearly always fades by itself after varied content or some time switched off. Permanent burn-in on an LCD is rare.",
    },
    {
      q: "How do I prevent burn-in?",
      a: "Lower the brightness, hide static elements such as the taskbar or a channel logo where you can, and vary what is on screen. Let the panel run its compensation cycle, which on most TVs happens in standby, so don't cut the power at the wall after every use.",
    },
  ],
  "contrast-test": [
    {
      q: "Why does contrast look worse in a bright room?",
      a: "Room light reflects off the screen and adds to every dark area, so black is lifted to grey while white hardly changes. The panel's own contrast is the same as before. Judge black depth in a dim room, and judge everyday usability in the light you actually work in.",
    },
    {
      q: "Should I leave dynamic contrast on?",
      a: "Turn it off for testing. Dynamic contrast changes the backlight according to the picture, so the same pattern looks different from one moment to the next. Many people leave it off for good, because the shifts in brightness are distracting in mixed scenes.",
    },
    {
      q: "What is a good contrast ratio?",
      a: "It depends on where you watch. An IPS panel at around 1,000:1 looks fine in a lit room. A VA panel at 2,500:1 to 5,000:1 looks clearly deeper in the dark, and an OLED deeper still, because its black pixels are off. In daylight the gap shrinks, since reflections lift black on every screen.",
    },
    {
      q: "Why is the contrast figure on the box so much higher?",
      a: "Figures in the millions are dynamic contrast: the brightest white with the backlight at full, compared with the darkest black after the backlight has dimmed. The two never appear on screen together. The native, or static, contrast ratio is the one that describes what you see in a single picture.",
    },
    {
      q: "Does raising the Contrast setting improve contrast?",
      a: "No. That setting changes how bright the lightest tones are driven, and the panel's contrast ratio stays the same. Set too high, it merges the brightest shades into plain white. Leave it at the default unless bright detail is clipping.",
    },
  ],
  "black-level-test": [
    {
      q: "What do Full and Limited RGB range have to do with this?",
      a: "Video signals can use the full range of values, 0 to 255, or a limited range, 16 to 235. If the computer sends one and the screen expects the other, either the darkest steps all turn black or black turns grey. Set both to the same range: Full for a monitor, and whatever matches the input mode on a TV.",
    },
    {
      q: "Why can I see fewer steps during the day?",
      a: "Light in the room reflects off the screen and hides the darkest steps, and your eyes are adjusted to brighter surroundings. Shadow detail that is clear at night can vanish at midday. That is normal, and it is a reason to test in the light you watch in.",
    },
  ],
  "viewing-angle-test": [
    {
      q: "Can I improve my screen's viewing angles?",
      a: "No setting changes them, but position does. Face the screen straight on, set its height so your eyes are level with the upper third, and tilt it until the top and bottom look equally bright. On a laptop, the lid angle makes the largest difference.",
    },
    {
      q: "Why does the picture change when I tilt my laptop lid?",
      a: "Lower-cost laptops often use TN panels, which shift strongly when viewed from above or below. A few degrees of tilt is enough to darken or wash out the image. IPS and OLED laptop screens hardly change.",
    },
  ],
  "gamma-test": [
    {
      q: "Why do the stripes show colors or wavy patterns?",
      a: "The pattern only works when each stripe lands on exactly one row of pixels. Browser zoom, a non-native resolution or the TV's own scaling breaks that and produces colored or wavy interference. Reset zoom with Ctrl/Cmd + 0, use the native resolution and reload.",
    },
    {
      q: "How do I change my display's gamma?",
      a: "Start with the monitor's own menu, where most models offer gamma presets. On Windows, search for 'Calibrate display color' to open the built-in tool. On a Mac, open System Settings > Displays and use the color profile menu. Run this test again after each change.",
    },
    {
      q: "What is gamma, in plain terms?",
      a: "It is the curve that turns a signal value into brightness. Black and white stay where they are; gamma decides how bright everything in between looks. A lower gamma makes mid-tones brighter and flatter, a higher one makes them darker and heavier.",
    },
    {
      q: "Why does the reading change when I move my head?",
      a: "On VA and TN panels gamma shifts with the viewing angle, so the patch that blends in at the top of the screen may not be the one that blends in at the bottom. Read the pattern from straight in front, at eye level. IPS and OLED screens change very little.",
    },
    {
      q: "Should I use 2.4 for films?",
      a: "In a blacked-out room, a curve near 2.4 is what many films are mastered for, and it gives deeper shadows. In a room with any light it hides shadow detail. For general use, and for anything viewed in daylight, 2.2 is the right target.",
    },
  ],
  "screen-tearing-test": [
    {
      q: "How do I check that G-Sync or FreeSync is actually on?",
      a: "It has to be switched on in two places: the monitor's own menu and the graphics driver's control panel. It also needs a connection that carries it. On a PC, DisplayPort is the safe choice. Over HDMI it needs HDMI VRR, a feature of HDMI 2.1, or, with an AMD card or an Xbox, a monitor that supports FreeSync over HDMI. TVs usually list HDMI VRR simply as VRR.",
    },
    {
      q: "Does a higher refresh rate reduce tearing?",
      a: "It makes tears harder to see, not rarer. At 144 Hz each torn frame is on screen for under 7 ms instead of nearly 17 ms at 60 Hz, and the offset at the tear is smaller. Only V-Sync or adaptive sync removes tearing completely.",
    },
    {
      q: "What is VRR flicker?",
      a: "A brightness flicker in dark scenes that appears with G-Sync or FreeSync when the frame rate swings, most of all on OLED and VA panels, whose brightness at a given gray shifts slightly with the refresh rate. Keeping the frame rate steady, for example with a cap a few fps below the maximum, reduces it. It is a known trait of these panels rather than a defect.",
    },
  ],
  "touch-screen-test": [
    {
      q: "What causes ghost touches?",
      a: "The common causes are a poor-quality charger or cable injecting electrical noise, moisture on the glass, a lifting screen protector, and a damaged touch layer after a drop. Test once unplugged, with the protector off and the screen dry. If marks still appear by themselves, the screen needs repair.",
    },
    {
      q: "Can a dead zone be fixed without replacing the screen?",
      a: "Sometimes. Restart the device, remove the case and protector, clean the glass and install any pending system update, then test again. A zone that fails in the same place every time after that is a hardware fault, and the usual repair is a new screen.",
    },
  ],
  "screen-info": [
    {
      q: "How do I find my screen's size in inches?",
      a: "A browser can't tell you. It knows how many pixels the screen has, not how large they are. Look up the model's specifications, or measure the visible picture diagonally from corner to corner.",
    },
    {
      q: "I have two monitors. Which one do these values describe?",
      a: "The one this browser window is on. Move the window to the other screen and reload the page to read that one.",
    },
  ],
  "overscan-test": [
    {
      q: "My PC desktop is cut off on the TV. Should I fix it on the TV or on the PC?",
      a: "On the TV first. Changing its picture size to a 1:1 or Just Scan mode shows every pixel as sent. The underscan slider in a graphics driver also brings the edges back, but it does so by shrinking and resampling the image, which blurs text.",
    },
    {
      q: "Do computer monitors overscan?",
      a: "Rarely. It can happen over HDMI, when the monitor or the graphics card treats the signal as a TV format. If the outer frames are missing on a monitor, look for an overscan or scaling option in the monitor's menu and in the graphics driver.",
    },
    {
      q: "How much overscan is normal?",
      a: "On a TV that overscans, a few percent is cropped from each edge. For a computer or a console the right amount is none: every pixel sent should be shown. If the 0% frame is not fully visible, there is a setting to change.",
    },
    {
      q: "Why is the picture smaller than the screen, with black borders?",
      a: "That is underscan, the opposite problem. A scaling slider in the graphics driver is shrinking the picture, or the output resolution does not match the screen. Set the driver's scaling to 0% or off, and select the screen's native resolution.",
    },
    {
      q: "Does overscan make the picture less sharp?",
      a: "Yes. An overscanned picture is enlarged before it is shown, so it no longer maps one pixel to one pixel, and small text turns soft. A 1:1 picture mode fixes the cropping and the softness together.",
    },
  ],
  "sharpness-test": [
    {
      q: "What should the Sharpness setting be?",
      a: "The value at which nothing is added and nothing is blurred. That is 0 on some TVs and the middle of the scale on others, so the number itself tells you little. Use the Sharpening halos frame: lower the setting until the outlines disappear, and stop before the lines start to soften.",
    },
    {
      q: "Why does text have colored fringes on my OLED or TV?",
      a: "Windows' ClearType smooths text on the assumption that each pixel is a row of red, green and blue stripes. Many OLED panels are built differently: a WOLED adds a white subpixel, and a QD-OLED puts green above red and blue, which fringes along the tops and bottoms of letters whatever the smoothing does. Larger text and higher display scaling make it less noticeable.",
    },
    {
      q: "Why is my monitor blurry at a lower resolution?",
      a: "An LCD or OLED has a fixed grid of pixels. Any other resolution has to be stretched across that grid, and most stretches smear each source pixel over several screen pixels. The exception is an exact multiple, such as 1080p on a 4K screen, which can stay sharp when integer scaling is used.",
    },
    {
      q: "Does a higher pixel density make text sharper?",
      a: "Yes. More pixels per inch means more pixels in each letter, so curves and thin strokes are drawn more accurately. A dense screen needs display scaling to keep text a readable size. The Screen Size Calculator works out the density of any screen.",
    },
    {
      q: "Why is text fuzzy in only some apps?",
      a: "Older Windows apps are not aware of display scaling. Above 100%, Windows draws them at normal size and enlarges the result as a picture, which blurs the text. In the app's Properties, the Compatibility tab has a high DPI setting that lets the app scale itself.",
    },
  ],
  "frame-skipping-test": [
    {
      q: "My phone camera has no manual mode. What can I do?",
      a: "Dim the room. In low light most phone cameras choose a slower shutter by themselves, which is what this test needs. Hold the phone steady or rest it on something, and take several photos.",
    },
    {
      q: "The test shows skipped frames. What now?",
      a: "Lower the refresh rate one step at a time until the run of cells is unbroken, and use that rate. A monitor that skips at an overclocked setting is not faulty. It simply can't display more frames than its rated maximum.",
    },
    {
      q: "Is frame skipping the same as stutter in games?",
      a: "No. Stutter is the computer delivering frames unevenly. Frame skipping is the display accepting a signal and then failing to show some of the frames. This test draws one cell per refresh, so it isolates the display's side of the problem.",
    },
    {
      q: "Do I need this test if I haven't overclocked my monitor?",
      a: "Usually not. Monitors rarely skip frames at their rated settings. Run it after setting a custom resolution or an overclocked refresh rate, or when an adapter or dock claims a rate the screen was not sold with.",
    },
    {
      q: "Why does it have to be a photo? Can't I just watch?",
      a: "Each cell is lit for a single refresh, which is under 7 ms at 144 Hz. Your eye cannot notice one missing cell at that speed. A slow shutter records every cell that lit while it was open, so a skipped one shows as a gap.",
    },
  ],
  "wide-color-gamut-test": [
    {
      q: "Is a wide-gamut screen better?",
      a: "For HDR video and photos made in Display P3, yes: it can show more saturated reds and greens. For ordinary web content it makes no difference, and without color management it can make everything look oversaturated, which is why many wide-gamut monitors include an sRGB mode.",
    },
    {
      q: "Which devices have wide-gamut screens?",
      a: "Recent iPhones, iPads and Macs, most phones with OLED screens, and many monitors sold for gaming or creative work. Typical office monitors and budget laptops cover sRGB only.",
    },
    {
      q: "Why do colors look oversaturated on my wide-gamut monitor?",
      a: "Most content is made for sRGB. A wide-gamut panel that shows it without color management stretches those colors to its own stronger primaries, so skin tones turn red and greens glow. Use the monitor's sRGB mode for everyday work, or apps that manage color.",
    },
    {
      q: "What is the difference between Display P3 and DCI-P3?",
      a: "They share the same red, green and blue primaries. DCI-P3 is the cinema version, with a greenish white point and a 2.6 gamma for dark theatres. Display P3 is the version screens and phones use, with the standard D65 white point and the sRGB tone curve.",
    },
    {
      q: "Does the browser matter?",
      a: "Yes. The browser has to understand wide-gamut colors and pass them to the operating system's color management. Current versions of the major browsers do, and older ones clip everything to sRGB. The chips above the test show what yours reports.",
    },
  ],
  "pwm-flicker-test": [
    {
      q: "Is PWM flicker bad for you?",
      a: "It depends on the person. Some people get headaches, eye strain or tiredness from screens that use PWM, especially at low brightness, and many notice nothing at all. If one particular screen bothers you and another in the same room doesn't, PWM is worth checking.",
    },
    {
      q: "Do OLED phones use PWM?",
      a: "Most do, at least at lower brightness levels. Some offer a setting that reduces it, often called DC dimming, anti-flicker or flicker reduction. Keeping the brightness higher and lowering the room light instead also helps.",
    },
  ],
  "hdr-test": [
    {
      q: "How do I turn on HDR on a Mac or a phone?",
      a: "On a Mac with an external HDR display, open System Settings > Displays and switch on High Dynamic Range. The built-in XDR displays on MacBook Pro show HDR automatically, as do phones with HDR screens, so there is nothing to switch on there.",
    },
    {
      q: "Why does everything look washed out when HDR is on in Windows?",
      a: "With HDR on, Windows has to map ordinary SDR content into the HDR signal, and it often comes out dull and grey. Raise the SDR content brightness slider in the HDR settings, and run the Windows HDR Calibration app. Many people switch HDR on only for games and films.",
    },
  ],
};

export const TOOLS: ToolDef[] = BASE_TOOLS.map((t) => ({
  ...t,
  faq: [...t.faq, ...(TOOL_FAQ_MORE[t.slug] ?? [])],
}));

// Extra practical tips per tool, shown in a callout on each tool page.
// Keyed by slug so the tool objects above stay focused on core copy/SEO.
export const TOOL_TIPS: Record<string, string[]> = {
  "dead-pixel-test": [
    "Clean the screen first — a speck of dust looks exactly like a dead pixel.",
    "View each color from ~30cm away so a single off pixel actually stands out.",
    "Found a stuck (not dead) pixel? Use the Stuck-pixel fixer frame and leave its flashing box over the pixel for 10–20 minutes to try to revive it.",
  ],
  "color-test": [
    "Solid red, green, and blue are best for spotting a defective sub-pixel.",
    "Write down which colors a dot shows on. That list is what tells a dead pixel from a stuck one, and it is what a warranty claim asks for.",
    "A faint overall tint on the white field usually means your color temperature / white balance is off.",
  ],
  "black-screen": [
    "Turn the lights off: bleed is invisible in a bright room. Maximum brightness helps you find it; your normal brightness tells you whether it matters.",
    "Give your eyes two or three minutes to adjust before judging the corners. Glow looks worst in the first thirty seconds.",
    "Lean about a foot to each side: a glow that moves with you is IPS glow, one that stays put is bleed.",
  ],
  "white-screen": [
    "Wipe the screen first, then look again: anything that moved was on the surface.",
    "Dark specks that don't wipe off are usually dust between layers or dead pixels, not dirt.",
  ],
  "backlight-bleed-test": [
    "Photograph the black screen with your phone to compare panels objectively.",
    "Some bleed and IPS glow is normal — only uneven, distracting clouding is a defect worth returning a panel over.",
    "Look again with the room lit as usual and at your normal brightness. That is the condition you will live with.",
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
    "If you take a photo, lock the exposure: your eyes adjust to slow changes and hide some, but a phone on auto exaggerates faint bands, so confirm by eye.",
  ],
  "refresh-rate-test": [
    "Close other tabs and apps; background load can drag the measured rate below your panel's rating.",
    "If you bought a high-refresh monitor, make sure the rate is actually selected in your OS display settings.",
    "On a laptop or phone, test plugged in or with battery saver off: power saving can lower the refresh rate.",
  ],
  "ghosting-test": [
    "Track a moving box with your eyes, then try staring at a fixed point — each reveals different artifacts.",
    "If you see a bright fringe instead of a smeared trail, your overdrive is too high (overshoot) — turn it down a notch.",
    "Re-check the overdrive setting whenever you change refresh rate: a level that looks clean at 144Hz can overshoot at 60Hz.",
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
    "Found an outline? Play varied full-screen video for an hour or two and check again before calling it burn-in.",
    "Photograph the grey field and note the date, so you have a reference to compare against later.",
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
    "For VRR flicker, look at the darkest band from straight on in a dim room: that is where it shows first.",
  ],
  "frame-rate-comparison": [
    "Sit at your normal distance and follow the car with your eyes rather than staring at one spot.",
    "On a 60 Hz screen the bottom lane runs at 15 fps: that is what a badly stuttering game looks like.",
    "If the top lane hitches, close other tabs: the browser is missing refreshes. The Refresh Rate Test counts them.",
  ],
  "screensaver": [
    "Turn on 'Keep awake' in the controls if you want the display to stay on instead of sleeping.",
    "The DVD logo's corner-hit is rare by design — that's the moment everyone waits for.",
  ],
  "touch-screen-test": [
    "Drag slowly along the edges and into the corners rather than swiping in from them: with Android gesture navigation, a swipe in from the side means Back.",
    "Test with the case and screen protector off if anything looks wrong.",
  ],
  "screen-info": [
    "On a laptop with an external monitor, drag this window onto the screen you want to check first.",
    "Browser zoom changes the scaling value — press Ctrl/Cmd + 0 before reading it.",
  ],
  "overscan-test": [
    "Each TV input can have its own picture-size setting, so test the input you actually use.",
    "On a projector, use lens shift first and keystone only for what's left, checking with the geometry grid, then focus.",
  ],
  "sharpness-test": [
    "Check at your normal viewing distance first, then up close.",
    "On a Mac, the scaled size at exactly half the panel's resolution keeps fine detail sharpest; other sizes resample the whole screen.",
  ],
  "frame-skipping-test": [
    "Use a shutter of 1/10 s or longer. For skips that come only now and then, slow it until 30 to 50 cells light up.",
    "Re-test after changing refresh rate or overclock settings — skipping often appears only at the highest rate.",
  ],
  "wide-color-gamut-test": [
    "Many wide-gamut monitors have an sRGB mode that clamps colors — switch it off for this test.",
    "View it in a dim room; the difference is subtle in bright light.",
  ],
  "pwm-flicker-test": [
    "Repeat at several brightness levels — many screens are flicker-free above about half brightness.",
    "A screen that only bothers you at night is a strong PWM suspect.",
  ],
  "hdr-test": [
    "Turn HDR on in your operating system before opening the test.",
    "If the 1,000 and 1,600-nit patches look identical, you've found your screen's brightness ceiling.",
  ],
  "screen-size-calculator": [
    "Measure the visible picture only, without the frame around it.",
    "A 4K screen is not automatically sharper than a 1440p one: a 43-inch 4K is less dense than a 27-inch 1440p.",
  ],
  "screen-test-checklist": [
    "Keep the box and receipt until every essential test has a result.",
    "Do the dark-room tests together, after giving your eyes a couple of minutes to adjust.",
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

/** The tools search engines may index: everything except the novelty pages. */
export const INDEXED_TOOLS: ToolDef[] = TOOLS.filter((t) => !t.noindex);
export const NOVELTY_TOOLS: ToolDef[] = TOOLS.filter((t) => t.noindex);

export function toolsByCategory(tools: ToolDef[] = TOOLS): Record<ToolCategory, ToolDef[]> {
  const out: Record<ToolCategory, ToolDef[]> = {
    panel: [],
    color: [],
    motion: [],
    fun: [],
  };
  for (const t of tools) out[t.category].push(t);
  return out;
}
