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
    updatedAt: "2026-10-01",
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
    tagline: "Display pure black, white, red, green, blue and more, full-screen.",
    description:
      "Free full-screen color test. Show pure black, white, red, green, blue, cyan, magenta, yellow and gray to check uniformity and find pixel defects.",
    category: "color",
    icon: "🎨",
    updatedAt: "2026-06-21",
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
    updatedAt: "2026-10-01",
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
      {
        q: "Why do the edges glow on a black screen?",
        a: "On an LCD, that's backlight bleed or IPS glow: light from the backlight leaking at the edges, or showing through as a haze when you look at an angle. A little is normal on almost every LCD. An OLED should stay fully black, because its pixels switch off.",
      },
      {
        q: "Does a black screen save power?",
        a: "On OLED, yes: black pixels are switched off and draw almost nothing. On an LCD the backlight stays on behind the black image, so the saving is small. Lowering brightness, or turning the display off, saves far more.",
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
    updatedAt: "2026-10-01",
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
      {
        q: "Will the screen stay on while I use it as a light?",
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
    updatedAt: "2026-06-21",
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
    tagline: "Smooth gradient and 32-step ramp to reveal color banding.",
    description:
      "Free greyscale and banding test. View a smooth black-to-white gradient and a 32-step ramp to detect banding, posterization, and tinted greys.",
    category: "color",
    icon: "🌫️",
    updatedAt: "2026-10-01",
    keywords: ["greyscale test", "gradient test", "color banding", "gamma test"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to switch between the smooth gradient and the 32-step ramp.",
      "Look for visible bands or abrupt jumps instead of a smooth transition.",
      "Press Esc to exit.",
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
    tagline: "Smooth spectrum and RGB gradients to judge color transitions and banding.",
    description:
      "Free color gradient test. View smooth red, green, blue and full-spectrum gradients to check color transitions, banding, and posterization.",
    category: "color",
    icon: "🌈",
    updatedAt: "2026-10-01",
    keywords: ["color gradient test", "color banding test", "rgb gradient", "spectrum gradient", "color transition"],
    howTo: [
      "Click Start to view the gradient full-screen.",
      "Use ← / → to cycle through spectrum, red, green, blue, white, gray, and black gradients.",
      "Check that transitions are smooth and colors look saturated and even.",
      "The white and gray ramps make luminance banding in the shadows easiest to spot.",
      "Press Esc to exit.",
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
    tagline: "A 50% gray field, a 9-zone grid and a panning gray to spot uneven backlighting.",
    description:
      "Free brightness uniformity test: a 50% gray field, a 9-zone grid and a panning gray to reveal uneven backlighting, clouding and the dirty screen effect.",
    category: "panel",
    icon: "🔲",
    updatedAt: "2026-10-01",
    keywords: ["brightness uniformity", "screen clouding", "uniformity test", "gray screen"],
    howTo: [
      "Click Start and view the gray field full-screen.",
      "Use ← / → to switch to the 9-zone grid and the panning gray.",
      "Compare the brightness of the center against each corner.",
      "On Panning gray, follow the drifting bands with your eyes: smudges or stripes that stay put are the panel's dirty screen effect.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "How much variation is acceptable?",
        a: "Good monitors stay within roughly 10% brightness variation across the panel. Larger differences show as visibly darker corners or brighter hotspots.",
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
    tagline: "Measure your real refresh rate and watch a moving reference.",
    description:
      "Free refresh rate test. Measure your display's actual refresh rate in Hz using the browser and watch a moving object to confirm smoothness.",
    category: "motion",
    icon: "⏱️",
    updatedAt: "2026-10-01",
    keywords: ["refresh rate test", "hz test", "fps test", "144hz test", "monitor hz"],
    howTo: [
      "Click Start — the measured refresh rate appears within a second or two.",
      "Watch the moving box to confirm motion looks smooth.",
      "Compare the reading to your panel's rated Hz; the line under it gives the frame time and the closest standard rate.",
      "Press Esc to exit.",
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
    updatedAt: "2026-10-01",
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
    slug: "blooming-test",
    name: "Blooming Test",
    title: "Blooming Test (Mini-LED)",
    tagline: "A bright object on black to judge local-dimming halos.",
    description:
      "Free blooming test for Mini-LED and local-dimming displays. Move a bright object on a black field to reveal halo and blooming around highlights.",
    category: "panel",
    icon: "🌟",
    updatedAt: "2026-10-01",
    keywords: ["blooming test", "mini-led test", "local dimming", "halo test", "fald"],
    howTo: [
      "Dim the room and click Start.",
      "Move your cursor / finger to drag the bright dot around the black field.",
      "Watch for a glowing halo (bloom) around the bright object.",
      "Use → for the zone sweeps: count how often the halo jumps as the square crosses the screen — that's roughly the number of dimming zones across (or down).",
      "Press Esc to exit.",
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
    updatedAt: "2026-06-21",
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
    updatedAt: "2026-10-01",
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
    updatedAt: "2026-10-01",
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
    updatedAt: "2026-10-01",
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
    updatedAt: "2026-10-01",
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
    tagline: "Fast scrolling bars that reveal tearing without V-Sync/VRR.",
    description:
      "Free screen tearing test. Fast-scrolling bars reveal horizontal tears when frame rate and refresh rate aren't synced — check V-Sync, G-Sync and FreeSync.",
    category: "motion",
    icon: "⇿",
    updatedAt: "2026-10-01",
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
    tagline: "Touch every cell or draw freely to find dead zones and multi-touch limits.",
    description:
      "Free touch screen test for phones, tablets and touch laptops. Fill a grid or draw freely to find dead zones, ghost touches and multi-touch limits.",
    category: "panel",
    icon: "👆",
    updatedAt: "2026-10-01",
    keywords: ["touch screen test", "touchscreen test", "dead zone test", "multi touch test", "digitizer test", "phone touch test"],
    howTo: [
      "Click Start and hold the device the way you normally would.",
      "Drag a finger slowly over every cell of the grid — each one turns green as it registers.",
      "Cells that stay dark after you've covered them are dead zones. In Free draw (→), breaks or jumps in your lines show dead spots and ghost touches.",
      "Put several fingers down at once to see how many touches the screen tracks.",
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
    updatedAt: "2026-10-01",
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
    tagline: "Edge markers, circles and a grid to catch cropping, stretching and distortion.",
    description:
      "Free overscan and aspect ratio test for TVs and projectors. Check for cropped edges, stretched pictures and geometry distortion with full-screen patterns.",
    category: "panel",
    icon: "📐",
    updatedAt: "2026-10-01",
    keywords: ["overscan test", "aspect ratio test", "tv overscan", "projector test pattern", "geometry test", "screen fit test"],
    howTo: [
      "Open the page on the device connected to the TV or projector, then click Start.",
      "Overscan border: the outermost colored frame you can see all the way round is how much is being cropped — 0% means nothing is.",
      "Aspect ratio (→): the circles must look perfectly round and the square square.",
      "Geometry grid (→): lines should be straight and evenly spaced. Use it to line up a projector.",
      "Press Esc to exit.",
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
    tagline: "Pixel-level lines, checkerboards and text to expose scaling blur and oversharpening.",
    description:
      "Free sharpness and text clarity test. Pixel-perfect lines and small text reveal blur from non-native resolution, display scaling and TV oversharpening.",
    category: "panel",
    icon: "🔎",
    updatedAt: "2026-10-01",
    keywords: ["sharpness test", "text clarity test", "monitor sharpness", "native resolution test", "chroma subsampling test", "pixel perfect test"],
    howTo: [
      "Click Start and view each pattern full-screen at your normal distance.",
      "1-pixel lines and checkerboards should look crisp and evenly striped. Grey mush or wavy moiré means the image is being scaled.",
      "Text clarity (→): small text should be sharp, and red or yellow text shouldn't smear.",
      "Sharpening halos (→): turn the screen's Sharpness setting down until the outlines around the lines and rings disappear.",
      "Press Esc to exit.",
    ],
    faq: [
      {
        q: "Why do the fine lines look grey and blurry?",
        a: "Something between the page and the panel is resampling the image: a non-native resolution, display scaling that isn't a whole number, browser zoom, or the TV's own scaling. Set your output to the screen's native resolution and test again.",
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
    updatedAt: "2026-10-01",
    keywords: ["frame skipping test", "monitor overclock test", "dropped frames test", "refresh rate overclock", "frame skip"],
    howTo: [
      "Close other apps and tabs, then click Start.",
      "Photograph the screen with a slow shutter — around 1/15 to 1/30 s, using your phone's Pro or manual mode.",
      "In the photo, the lit cells should form one unbroken run. A gap means a frame was skipped.",
      "Use the 120-cell grid (→) on screens above 144Hz so the run doesn't wrap around.",
      "Take a few photos before drawing conclusions, then press Esc to exit.",
    ],
    faq: [
      {
        q: "Why would a monitor skip frames?",
        a: "Usually because its refresh rate has been overclocked or set through a custom resolution. The screen accepts the faster signal but quietly drops frames to keep up, so it feels no smoother than before.",
      },
      {
        q: "Can the browser cause gaps too?",
        a: "Yes — if the computer is busy, the browser can miss a frame as well. Close other apps, repeat the photo a few times, and only worry about gaps that keep appearing.",
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
    updatedAt: "2026-10-01",
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
    updatedAt: "2026-10-01",
    keywords: ["pwm test", "pwm flicker test", "screen flicker test", "pwm dimming test", "flicker free test"],
    howTo: [
      "Set the screen to the brightness you normally use — PWM usually appears at low brightness.",
      "On the White field, wave a pencil quickly in front of the screen: several crisp copies mean PWM, a smooth blur means flicker-free.",
      "Or point your phone camera at the screen: dark bands rolling across it suggest PWM.",
      "On the Fast moving line (→), follow the line with your eyes: a row of separate lines instead of one smooth streak means PWM.",
      "Press Esc to exit.",
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
    updatedAt: "2026-10-01",
    keywords: ["hdr test", "is my screen hdr", "hdr brightness test", "hdr monitor test", "peak brightness test", "hdr check"],
    howTo: [
      "Turn HDR on first — on Windows, Settings > System > Display > Use HDR.",
      "Check the chips above the test: the browser should report an HDR display.",
      "Click Start. On a working HDR setup, the patches keep getting brighter past 203 nits (SDR white) up to your screen's peak.",
      "If every patch from 203 nits up looks the same white, the image is being shown in SDR.",
      "Press Esc to exit.",
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
];

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
    "Turn on 'Keep awake' in the controls if you want the display to stay on instead of sleeping.",
    "The DVD logo's corner-hit is rare by design — that's the moment everyone waits for.",
  ],
  "touch-screen-test": [
    "Go slowly along the edges and into the corners — touch faults usually start there.",
    "Test with the case and screen protector off if anything looks wrong.",
  ],
  "screen-info": [
    "On a laptop with an external monitor, drag this window onto the screen you want to check first.",
    "Browser zoom changes the scaling value — press Ctrl/Cmd + 0 before reading it.",
  ],
  "overscan-test": [
    "Each TV input can have its own picture-size setting, so test the input you actually use.",
    "On a projector, set keystone and lens shift with the geometry grid before focusing.",
  ],
  "sharpness-test": [
    "Check at your normal viewing distance first, then up close.",
    "Display scaling of 100%, 150% or 200% keeps fine detail cleaner than in-between values.",
  ],
  "frame-skipping-test": [
    "Pick a shutter long enough to catch 6–10 frames: about 1/15 s at 144Hz, 1/30 s at 240Hz.",
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
