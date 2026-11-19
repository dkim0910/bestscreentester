// "How to read your results" content for the tool pages: what a healthy screen shows,
// what counts as a fault, and where the answer differs by panel or device. Kept apart
// from tools.ts (like TOOL_TIPS) so the registry stays focused on core copy.
//
// Every threshold here must agree with the guide it links to — the numbers and rules
// below are taken from those guides, not restated from memory. When a guide changes,
// change this too, and move the tool's `updatedAt`.

export interface ToolResults {
  /** Section heading, written for this test. */
  heading: string;
  /** What a screen without the fault looks like. */
  pass?: string[];
  /** What a fault looks like. */
  fail?: string[];
  /** A glossary instead of pass/fail, for pages that explain values (Screen Info). */
  terms?: { name: string; text: string }[];
  /** Limits and policies, where they exist. */
  threshold?: string;
  /** Where the answer differs by panel type or device, or how to test fairly. */
  note?: string;
  /** The one deep guide for this test; replaces the generic "Related guides" grid. */
  guide?: { slug: string; label: string };
  /** Test-specific replacements for the shared "How to use" / "FAQ" headings. */
  howToHeading?: string;
  faqHeading?: string;
}

export const TOOL_RESULTS: Record<string, ToolResults> = {
  "dead-pixel-test": {
    heading: "Dead, stuck, or just dust? Reading the result",
    howToHeading: "Running the pixel check",
    faqHeading: "Dead and stuck pixel questions",
    pass: [
      "Every color is one unbroken field, with no dot that stays dark and no dot that stays lit in the wrong color.",
      "A speck that wipes off, or that seems to sit above the image when you look from the side, is dust or a mark on the surface, not a pixel.",
    ],
    fail: [
      "A dot that is dark on every color, white included, is a dead pixel. It will not recover.",
      "A dot that holds one color, or shows white on the black frame, is a stuck or hot pixel. Try the Stuck-pixel fixer frame before deciding anything.",
      "A whole row or column that is lit or dark is a connection fault rather than a pixel defect, and almost always qualifies for service.",
      "Two or more faults close together are a cluster. Many policies replace a panel for a cluster while tolerating the same number scattered.",
    ],
    threshold:
      "Manufacturers grade panels against ISO 9241-307. Most consumer screens are Class II, which allows a few faults per million pixels, and most brands publish their own fixed counts instead of using that figure. Bright pixels are counted more strictly than dark ones, and single sub-pixel faults most leniently. The number in your own warranty document is the one that applies. Inside the retailer's return window you don't have to meet any count at all.",
    note:
      "No single color is enough. A pixel stuck on is invisible on white, and a pixel that is off is invisible on black, so step through every frame on LCD and OLED alike. On a phone or a 4K laptop one pixel is very small: look closer than you normally sit.",
    guide: {
      slug: "dead-pixel-warranty-policies",
      label: "Dead pixel warranty policies: how the counts work and when to return instead",
    },
  },
  "black-screen": {
    heading: "What a black screen should look like",
    howToHeading: "Using the black screen",
    faqHeading: "Black screen questions",
    pass: [
      "On an OLED: completely dark, as if the screen were off, because black pixels are switched off.",
      "On an LCD: an even, very dark grey. An LCD blocks a backlight that is always on, so it never reaches true black.",
      "A soft glow in the corners that shifts or fades as you move your head is IPS glow, a trait of IPS panels and not a defect.",
    ],
    fail: [
      "Streaks or patches along an edge that stay put when you move your head: backlight bleed. It matters if you can see it in normal use, such as dark scenes or the black bars around a film.",
      "A bright dot of any color: a stuck or hot pixel. Confirm it in the Dead Pixel Test.",
      "On an OLED, any area that isn't fully black. OLED has no backlight to leak, so that points to panel non-uniformity or wear rather than bleed.",
    ],
    note:
      "Give your eyes two or three minutes in the dark first: glow looks worst in the first thirty seconds. Maximum brightness makes faults easy to find, but judge whether they matter at the brightness you actually use. Trust your eyes over a phone photo, because a camera's long exposure turns a faint haze into something dramatic.",
    guide: {
      slug: "what-is-backlight-bleed",
      label: "Backlight bleed vs IPS glow: how to tell them apart",
    },
  },
  "white-screen": {
    heading: "What to look for on white",
    howToHeading: "Using the white screen",
    faqHeading: "White screen questions",
    pass: [
      "One even white from edge to edge, with no dark dots.",
      "An even warm or cool cast over the whole screen is color temperature, not a fault. Switch off Night Light, Night Shift or True Tone and look again.",
      "Corners a little darker than the center: some falloff is normal on every LCD.",
    ],
    fail: [
      "A dark dot that doesn't wipe off: a dead pixel, or dust trapped between the panel's layers.",
      "A distinctly darker patch with a visible edge, or blotches in a line on a laptop screen, which are usually pressure marks.",
      "Patches of a different tint on part of the screen, rather than one even cast.",
      "On an OLED, a faint outline of a taskbar, logo or keyboard: image retention or burn-in. Check it on grey in the Burn-in Test.",
    ],
    note:
      "White only shows pixels that are off. A pixel stuck on disappears into it, so a full pixel check also needs black and the primary colors, which the Dead Pixel Test steps through.",
    guide: {
      slug: "why-does-my-screen-have-a-dark-spot",
      label: "Why does my screen have a dark spot or patch?",
    },
  },
  "color-test": {
    heading: "What each color reveals",
    howToHeading: "Stepping through the colors",
    faqHeading: "Color test questions",
    terms: [
      { name: "Black", text: "Pixels stuck on, and light leaking from the backlight at the edges." },
      { name: "White", text: "Pixels that are off, dust, and patches of uneven tint or brightness." },
      {
        name: "Red, green, blue",
        text: "Each lights one sub-pixel only. A dark dot that appears on just one of them is a single dead sub-pixel, the fault warranty policies tolerate most.",
      },
      {
        name: "Cyan, magenta, yellow",
        text: "Each lights two sub-pixels. A sub-pixel stuck on shows here as a dot of the wrong color, though it vanishes on its own primary.",
      },
      {
        name: "Gray",
        text: "Uneven brightness and tint are easiest to see on a mid-tone, and so is a retained image on an OLED.",
      },
    ],
    pass: ["Each color is flat and even across the whole screen, with the same shade in the corners as in the center."],
    fail: [
      "A dot that differs from the field on one or more colors: note which colors, because that tells you whether it is dead or stuck.",
      "A thin line running the full height or width on every color: a connection fault, not a pixel defect.",
      "One region with a different tint from the rest, on white and gray especially.",
    ],
    guide: {
      slug: "why-is-part-of-my-screen-discolored",
      label: "Why is part of my screen discolored or tinted?",
    },
  },
  "backlight-bleed-test": {
    heading: "Bleed, glow, or normal? Reading the black field",
    howToHeading: "Setting up the bleed check",
    faqHeading: "Backlight bleed questions",
    pass: [
      "A glow that changes when you lean about a foot to either side is IPS glow. It is inherent to IPS panels, and warranties almost never cover it.",
      "A faint haze you can only find in a blacked-out room. If you can't see it while watching a film with the lights on, ignore it.",
    ],
    fail: [
      "Streaks, patches or a torch-beam shape coming from an edge that look the same wherever your head is: backlight bleed.",
      "A bright streak you can see in everyday use: dark game scenes, a black web page, the bars above and below a film.",
      "Mottled patches in the middle of the screen rather than at the edges: clouding. Confirm it on grey with the Brightness Uniformity Test.",
    ],
    threshold:
      "There is no standard limit for bleed, and manufacturer policies on it are vague. That is why the retailer's return window matters more here than the warranty: decide inside it.",
    note:
      "Maximum brightness makes bleed easy to find, but it exaggerates everything, so judge it again at the brightness you use day to day. Bleed sometimes settles over the first few weeks as the frame relaxes. Don't press on the panel or loosen bezel screws to fix it. OLED screens have neither bleed nor glow.",
    guide: {
      slug: "what-is-backlight-bleed",
      label: "Backlight bleed vs IPS glow: the one-second test and what's normal",
    },
  },
  "burn-in-test": {
    heading: "Retention or burn-in? What the fields show",
    howToHeading: "Checking an OLED for burn-in",
    faqHeading: "Burn-in questions",
    pass: [
      "Every field is even, with no shape you recognize.",
      "An outline that has faded or gone after an hour or two of varied full-screen video is temporary image retention, not burn-in.",
      "Random blotches with no recognizable edge are more likely panel uniformity than burn-in.",
    ],
    fail: [
      "A shape you recognize, such as a taskbar along the bottom, a channel logo or a game's HUD, that is still there after varied content. That is burn-in, and it is permanent.",
      "A warm or yellowish patch where static content used to sit. The blue emitter wears fastest, so worn areas often look tinted rather than simply dim.",
    ],
    threshold:
      "Burn-in cover varies by brand. Some manufacturers now include it in the warranty for a limited period, so read that clause before assuming either way.",
    note:
      "Check in a dark room, from directly in front, with dynamic brightness and picture-optimizer modes off, because they can hide exactly the difference you are looking for. Grey shows the most wear, and white and each color field show a different amount, so step through all of them.",
    guide: {
      slug: "oled-burn-in-and-how-to-check-for-it",
      label: "OLED burn-in: causes, prevention and how to check",
    },
  },
  "refresh-rate-test": {
    heading: "Is the reading right for your screen?",
    howToHeading: "Measuring your refresh rate",
    faqHeading: "Refresh rate questions",
    pass: [
      "A reading within about 1 Hz of the panel's rating. Many displays run a fraction off nominal, such as 59.94 Hz for 60.",
      "A steady number, and a box that moves without stutter.",
    ],
    fail: [
      "60 Hz on a 120, 144 or 240 Hz screen. This is a setting or cable problem, not a faulty panel: select the full rate in your display settings and check the cable and port.",
      "A reading that sags or jumps around. Close other tabs and apps and measure again before blaming the display.",
    ],
    note:
      "Laptops and phones can lower the refresh rate to save power, so repeat the test plugged in or with battery saver off. If you have overclocked a monitor, a matching number here doesn't prove it is showing every frame: the Frame Skipping Test checks that.",
    guide: {
      slug: "how-to-enable-full-refresh-rate-windows-mac",
      label: "How to enable your monitor's full refresh rate on Windows and Mac",
    },
  },
  "ghosting-test": {
    heading: "Trail, fringe or blur? What the boxes show",
    howToHeading: "Running the ghosting test",
    faqHeading: "Ghosting and overdrive questions",
    pass: [
      "A soft, even blur on the moving edges. Every normal display does this, because each frame is held still while your eyes keep moving, and it shrinks at higher refresh rates.",
      "No separate afterimage behind the boxes at Medium speed.",
    ],
    fail: [
      "A distinct smear or afterimage trailing each box: ghosting, from pixels that change too slowly. On VA panels it is usually worst in dark scenes.",
      "A bright fringe behind each box: overshoot, from overdrive set too high. Turn the monitor's overdrive setting down a notch.",
    ],
    note:
      "Overdrive is a trade: raising it shortens the trail until it tips over into overshoot. Compare your monitor's overdrive settings at Medium, then use Fast to make small differences between them visible.",
    guide: {
      slug: "what-is-ghosting-and-how-to-fix-it",
      label: "What is ghosting, and how do you fix it?",
    },
  },
  "pwm-flicker-test": {
    heading: "PWM or flicker-free? Reading the three checks",
    howToHeading: "Three ways to check for PWM",
    faqHeading: "PWM flicker questions",
    pass: [
      "Pencil: one smooth blur as it passes in front of the white field.",
      "Moving line: a single smooth streak when you follow it with your eyes.",
      "Camera: no dark bands across the screen.",
      "The same result when you repeat it at low brightness.",
    ],
    fail: [
      "Pencil: several crisp copies of the pencil instead of a blur.",
      "Moving line: a row of separate lines.",
      "Camera: dark bands rolling across the picture.",
      "Any of these appearing only as you turn the brightness down. That is still PWM: many screens are flicker-free above about half brightness and switch to PWM below it.",
    ],
    note:
      "A web page can't see your backlight, so the verdict is what you observe. A slow-motion camera or a light sensor gives a definitive answer. A screen that only bothers you at night, when the brightness is low, is a strong suspect.",
    guide: {
      slug: "what-is-pwm-flicker",
      label: "What is PWM flicker, and how do you test for it?",
    },
  },
  "touch-screen-test": {
    heading: "Dead zone or missed spot? Reading the grid",
    howToHeading: "Testing the touch layer",
    faqHeading: "Touch screen questions",
    pass: [
      "Every cell turns green, including the ones along the edges and in the corners.",
      "Lines in Free draw are unbroken and follow your finger.",
      "The touch counter reaches at least five on a phone or tablet.",
    ],
    fail: [
      "The same cells stay dark every time, however slowly you drag over them. One stubborn cell on a single pass is usually just a missed spot.",
      "A gap in the same place in every line you draw through it.",
      "Lines that jump, or marks appearing where you aren't touching: ghost touches.",
      "A counter that never goes above one or two fingers.",
    ],
    note:
      "A thick, cracked or lifting screen protector can cause all of these. Take the case and protector off and test again before you blame the screen. Touch faults usually start at the edges and corners, so go slowly there.",
    guide: {
      slug: "how-to-test-a-used-phone-screen-before-buying",
      label: "How to test a used phone screen before buying",
    },
  },
  "screen-info": {
    heading: "What each value tells you",
    howToHeading: "Reading your display details",
    faqHeading: "Screen info questions",
    terms: [
      {
        name: "Screen resolution (pixels)",
        text: "The panel's pixel count, estimated as the size the browser reports multiplied by the scaling factor. Compare it with the screen's specification: a lower number usually means a non-native resolution is selected, which softens fine detail.",
      },
      {
        name: "Display scaling",
        text: "How much the system enlarges everything, also called the device pixel ratio. At 100% one layout pixel is one screen pixel; at 200% it is two in each direction. Browser zoom changes this value, so reset zoom before reading it.",
      },
      {
        name: "Screen size in CSS pixels",
        text: "The size websites lay out against after scaling. It explains why a 4K laptop at 200% behaves like a 1920 × 1080 screen with sharper text.",
      },
      {
        name: "Refresh rate",
        text: "Measured live. If it reads 60 on a faster screen, the full rate isn't selected in your display settings, or the cable can't carry it.",
      },
      {
        name: "Color depth",
        text: "Bits per pixel the browser reports: 24 means 8 bits per channel, 30 means 10. Many 10-bit monitors still show 24 because the computer is sending 8-bit color.",
      },
      {
        name: "Color gamut",
        text: "The widest color space the browser says the screen covers: sRGB is the standard, Display P3 and Rec. 2020 are wide gamut. The Wide Color Gamut Test shows whether those extra colors actually reach your eyes.",
      },
      {
        name: "HDR",
        text: "Whether the browser can show HDR on this screen right now. \"No\" on an HDR monitor usually means HDR is switched off in the operating system.",
      },
      {
        name: "Usable screen area and browser window",
        text: "The screen minus the taskbar, Dock or menu bar, and the part of it this page currently fills.",
      },
    ],
    note:
      "These values come from your browser, not from the panel itself, so they describe how the screen is being driven at the moment. That makes them useful for spotting a wrong setting, and less useful as proof of what the hardware can do.",
  },
  "brightness-uniformity-test": {
    heading: "Even enough? Reading the gray field",
    howToHeading: "Checking brightness uniformity",
    faqHeading: "Uniformity questions",
    pass: [
      "The gray looks like one shade from the center to each corner. Good monitors stay within roughly 10% brightness variation across the panel.",
      "Corners a little darker than the center: some falloff is normal on every LCD.",
      "On Panning gray, the bands drift across the screen and nothing stays behind.",
    ],
    fail: [
      "A distinct darker or brighter patch with a visible edge.",
      "Mottled patches in the middle of the screen: clouding, often from pressure on the panel.",
      "On Panning gray, smudges or vertical stripes that stay put while the bands move past them: the dirty screen effect.",
    ],
    note:
      "Compare the center against one corner at a time. Your eyes adapt to slow changes across a field and hide real differences, which is why a photo with even exposure can show more than a glance does. On a TV, judge it from where you actually sit.",
    guide: {
      slug: "how-to-test-a-tv-for-defects",
      label: "How to test a new TV for dead pixels and uniformity",
    },
  },
  "blooming-test": {
    heading: "How much halo is normal?",
    howToHeading: "Running the blooming test",
    faqHeading: "Blooming and local dimming questions",
    pass: [
      "On an OLED: no halo at all. Each pixel makes its own light, so there is no backlight zone to spill.",
      "On a Mini-LED or other local-dimming LCD: a soft glow around the dot that stays close to it. That is the size of one dimming zone, not a fault.",
      "On an LCD without local dimming: no halo that follows the dot, only the panel's usual even black level.",
    ],
    fail: [
      "A halo wide enough to notice in normal dark scenes, such as subtitles or stars lighting up a large block of the picture.",
      "Blocks that visibly switch on and off as the dot moves, or lag behind it.",
    ],
    note:
      "Blooming is a limit of the backlight, so it can be tuned but not removed. A lower local-dimming setting shrinks halos and lifts blacks; a higher one deepens blacks and blooms more. The zone sweeps tell you how many zones you have: the more often the halo jumps as the square crosses the screen, the finer the backlight.",
    guide: { slug: "mini-led-vs-oled", label: "Mini-LED vs OLED: which is better for you?" },
  },
  "contrast-test": {
    heading: "What good contrast looks like",
    howToHeading: "Using the checkerboards",
    faqHeading: "Contrast questions",
    pass: [
      "Black squares stay deep black right next to bright white ones.",
      "The borders between squares are crisp at every density, up to 32 × 32.",
    ],
    fail: [
      "Black squares that look gray or washed out: low contrast, or a raised black level.",
      "Fuzzy or colored edges between squares. That points to scaling or the sharpness setting, not to contrast.",
    ],
    note:
      "Panel type sets the ceiling. OLED keeps black squares fully dark because the pixels switch off. Among LCDs, VA panels typically reach 2,500:1 to 5,000:1 and IPS around 1,000:1, so IPS blacks look noticeably grayer in a dark room. This is a visual check: an actual contrast ratio needs a light meter.",
    guide: { slug: "contrast-ratio-explained", label: "Contrast ratio explained: what the numbers really mean" },
  },
  "black-level-test": {
    heading: "Which steps should you be able to see?",
    howToHeading: "Finding your shadow floor",
    faqHeading: "Black level questions",
    pass: [
      "In a dark room you can tell the steps apart from about value 2 to 4 upward.",
      "Each visible step is a little brighter than the one before, and they stay neutral gray.",
    ],
    fail: [
      "The lowest steps all look identical to black: shadow detail is being crushed. The usual causes are a black-level or brightness setting, or a Limited RGB range mismatch.",
      "Every step is clearly visible but pure black looks gray: the black level is raised, which costs contrast.",
    ],
    note:
      "Test at the brightness you actually use. On a monitor the brightness control mostly drives the backlight, so turning it up makes every step easier to see while also lifting black. On a TV the setting called Brightness often controls black level itself, and that is the one to adjust. Judge the steps from the center: glow toward the corners is IPS glow or bleed, not a shadow-detail problem.",
    guide: { slug: "full-vs-limited-rgb-range", label: "Why do blacks look grey? Full vs limited RGB range" },
  },
  "viewing-angle-test": {
    heading: "How much shift is normal for your panel?",
    howToHeading: "Checking the viewing angle",
    faqHeading: "Viewing angle questions",
    terms: [
      { name: "IPS and OLED", text: "Hold color and brightness well as you move off-axis. Little visible change is the expected result." },
      { name: "VA", text: "Shows a contrast and gamma shift, with the dark gray steps washing out, and some glow in the corners." },
      { name: "TN", text: "Shifts heavily, especially when you move up and down. Dark steps merge and colors change hue." },
    ],
    pass: [
      "The result matches what your panel type normally does.",
      "From your usual seat, the corners look the same as the center.",
    ],
    fail: [
      "An IPS or OLED screen that shifts as much as a TN panel would.",
      "Corners that look darker or washed out even when you sit centered, on a screen that isn't especially large or close.",
    ],
    note:
      "On a large screen, or one close to you, the corners are already seen at an angle, so TN and VA panels can show darker corners from the middle seat. A curved monitor keeps the edges closer to head-on and reduces it. Viewing angle is a trait of the panel, not something a setting can fix.",
    guide: { slug: "ips-vs-va-vs-tn-vs-oled", label: "IPS vs VA vs TN vs OLED: which panel should you get?" },
  },
  "greyscale-test": {
    heading: "Smooth or banded? Reading the gradient",
    howToHeading: "Viewing the gradient and the ramp",
    faqHeading: "Greyscale and banding questions",
    pass: [
      "The smooth gradient runs from black to white with no visible bars or sudden jumps.",
      "On the 32-step ramp every block is a distinct, neutral gray, including the darkest few.",
    ],
    fail: [
      "Distinct bars in the smooth gradient: banding, from somewhere in your display chain.",
      "Dark steps that merge into black, or bright steps that merge into white.",
      "A green, blue or magenta cast in part of the ramp. That is white balance or a color setting, not banding.",
    ],
    note:
      "Step back from the screen, because banding is far easier to see at a distance. If the smooth gradient shows bars, check that your graphics output is set to full RGB and at least 8-bit color before blaming the panel. Banding that remains is common on 6-bit + FRC panels.",
    guide: {
      slug: "what-is-color-banding-and-how-to-reduce-it",
      label: "What is color banding, and how do you reduce it?",
    },
  },
  "color-gradient-test": {
    heading: "What a clean gradient looks like",
    howToHeading: "Stepping through the gradients",
    faqHeading: "Color gradient questions",
    pass: [
      "Every gradient blends smoothly from end to end, with no bars, jumps or blotches.",
      "The spectrum passes evenly through yellow, green, cyan, blue and magenta.",
      "Green looks brightest of the three color ramps. That is how the eye works, not a fault.",
    ],
    fail: [
      "Wide, posterized bands in every gradient: often a 6-bit panel or a low-bit-depth output setting.",
      "Banding or a color shift in only one of the red, green and blue ramps: that channel's calibration, rather than the panel as a whole.",
      "One hue swallowing a wide stretch of the spectrum.",
    ],
    note:
      "These gradients use standard sRGB colors, so they show banding and uneven transitions, not how wide your screen's gamut is. The white and gray ramps isolate brightness banding in the shadows without color getting in the way.",
    guide: {
      slug: "what-is-color-banding-and-how-to-reduce-it",
      label: "What is color banding, and how do you reduce it?",
    },
  },
  "gamma-test": {
    heading: "Which patch disappeared? Reading your gamma",
    howToHeading: "Reading the gamma pattern",
    faqHeading: "Gamma questions",
    terms: [
      { name: "The 2.2 patch blends in", text: "Your display is on target. 2.2 is the sRGB standard, and both Windows and macOS aim for it." },
      { name: "A lower patch blends in (1.8, 2.0)", text: "Gamma is too low. The image looks washed out, with mid-tones too bright." },
      { name: "A higher patch blends in (2.4)", text: "Gamma is too high. Shadows are crushed and the image looks heavy." },
    ],
    note:
      "Step back until the stripes blur into solid gray before you compare. The test reads gamma around mid-gray only. It can't measure the whole curve from black to white, or correct it: a colorimeter does both. If your reading is off, try the monitor's gamma preset first.",
    guide: { slug: "gamma-explained", label: "Gamma explained: why your shadows look wrong" },
  },
  "screen-tearing-test": {
    heading: "Tear, stutter or clean? Reading the bars",
    howToHeading: "Running the tearing test",
    faqHeading: "Screen tearing questions",
    pass: [
      "The bars stay whole from one edge of the screen to the other as they move.",
      "Motion is even, with no jerks.",
    ],
    fail: [
      "A line where the bars are offset, so the top and bottom halves don't line up: a tear.",
      "Jerky motion with no visible break. Frames are being skipped or repeated, which is a different problem: use the Frame Skipping Test.",
    ],
    note:
      "A clean result here is common and doesn't prove your games won't tear. Browsers usually draw in sync with the display, while games tear when they send frames with V-Sync off. If you do see tears on this page, check that hardware acceleration is on in your browser and that the display is running at its rated refresh rate.",
    guide: {
      slug: "screen-tearing-vsync-gsync-freesync",
      label: "Screen tearing, V-Sync, G-Sync and FreeSync explained",
    },
  },
  "overscan-test": {
    heading: "Is your picture cropped or stretched?",
    howToHeading: "Checking the picture fit",
    faqHeading: "Overscan questions",
    pass: [
      "Overscan border: you can see the outermost frame, marked 0%, all the way round.",
      "Aspect ratio: the circles are perfectly round and the square is square.",
      "Geometry grid: lines are straight and evenly spaced from edge to edge.",
    ],
    fail: [
      "The outer frames are cut off. The outermost one you can still see all the way round is how much is being cropped.",
      "Circles that look oval: the picture is being stretched.",
      "Grid lines that bow or converge, which on a projector means keystone or lens position needs adjusting.",
    ],
    note:
      "Overscan is a setting, not a defect. Look for a picture-size option called Just Scan, Screen Fit, Fit to Screen, 1:1 or Overscan Off. Each TV input can have its own picture-size setting, so test the input you actually use.",
  },
  "sharpness-test": {
    heading: "Crisp, scaled or oversharpened?",
    howToHeading: "Reading the sharpness patterns",
    faqHeading: "Sharpness and text questions",
    pass: [
      "1-pixel lines and checkerboards look crisp and evenly striped.",
      "Small text is sharp, including the red and yellow text.",
      "No bright outline around the lines and rings on the halo pattern.",
    ],
    fail: [
      "Fine lines that turn into gray mush or wavy moiré: the image is being resampled by a non-native resolution, fractional display scaling, browser zoom or the TV's own scaling.",
      "Red or yellow text that smears while black-and-white text stays sharp: chroma subsampling. Use the TV's PC or Game mode, or set the output to RGB or 4:4:4.",
      "White outlines around edges: the Sharpness setting is too high. Turn it down until they disappear.",
    ],
    note:
      "Check at your normal viewing distance first, then up close. Display scaling of 100%, 150% or 200% keeps fine detail cleaner than in-between values.",
  },
  "frame-skipping-test": {
    heading: "Reading the photo: skipped frames or not?",
    howToHeading: "Photographing the test",
    faqHeading: "Frame skipping questions",
    pass: [
      "In the photo, the lit cells form one unbroken run.",
      "The same result across several photos.",
    ],
    fail: [
      "A gap in the run that keeps appearing in photo after photo: the display is dropping frames.",
      "Gaps that appear only at the highest refresh rate or after an overclock, and vanish at the standard rate.",
    ],
    note:
      "One gap in one photo proves nothing, because a busy computer can make the browser miss a frame too. Close other apps and take several shots. Pick a shutter long enough to catch 6 to 10 frames: about 1/15 s at 144 Hz, 1/30 s at 240 Hz.",
  },
  "wide-color-gamut-test": {
    heading: "Logo or no logo? What it means",
    howToHeading: "Looking for the hidden logos",
    faqHeading: "Wide color gamut questions",
    terms: [
      { name: "You see the logos", text: "Your screen, operating system and browser are all handling colors beyond sRGB." },
      { name: "You see them on red and green only", text: "Normal. Display P3 extends furthest beyond sRGB in reds and greens, and least in blue, so a faint or missing logo on blue is expected." },
      { name: "You see no logos", text: "The screen is sRGB, or something in the chain is clamping colors. Neither is a fault: sRGB is accurate for the web." },
    ],
    note:
      "Before deciding the screen is sRGB-only, check the chips above the test to see what the browser reports, and look for an sRGB mode in the monitor's menu. Many wide-gamut monitors have one, and it clamps colors on purpose. The difference is subtle in bright light, so view it in a dim room.",
    guide: {
      slug: "color-gamut-srgb-vs-dci-p3-vs-adobe-rgb",
      label: "Color gamut explained: sRGB vs DCI-P3 vs Adobe RGB",
    },
  },
  "hdr-test": {
    heading: "Where do the patches stop getting brighter?",
    howToHeading: "Checking that HDR is really on",
    faqHeading: "HDR questions",
    terms: [
      { name: "Every patch from 203 nits up looks the same", text: "The image is being shown in SDR. HDR is off in the operating system, the browser can't display HDR images, or the screen isn't HDR." },
      { name: "They separate up to about 400, then merge", text: "HDR is working and you have found the screen's ceiling. An entry-level DisplayHDR 400 monitor tops out around there." },
      { name: "The 600, 1,000 and 1,600 patches stay distinct", text: "A bright HDR display. A good Mini-LED or OLED keeps the upper patches apart further." },
    ],
    note:
      "Turn HDR on in your operating system before opening the test, and check the chips above it. If they say HDR is available but the patches look flat, try another browser: support still varies, and Chromium-based browsers are currently the most consistent.",
    guide: { slug: "hdr-explained", label: "HDR explained: what makes a display actually HDR" },
  },
};

export function getResults(slug: string): ToolResults | undefined {
  return TOOL_RESULTS[slug];
}
