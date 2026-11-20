// "How to read your results" content for the tool pages: what a healthy screen shows,
// what counts as a fault, and where the answer differs by panel or device. Kept apart
// from tools.ts (like TOOL_TIPS) so the registry stays focused on core copy.
//
// Every threshold here must agree with the guide it links to — the numbers and rules
// below are taken from those guides, not restated from memory. When a guide changes,
// change this too, and move the tool's `updatedAt`.

export interface ToolTable {
  title: string;
  /** Column headings; the first may be empty when the rows are labelled. */
  head: string[];
  rows: string[][];
  note?: string;
}

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
  /** Reference tables shown under the results: comparisons and lookup values. */
  tables?: ToolTable[];
  /** Ordered steps for someone who found the fault: check, rule out, document, act. */
  next?: string[];
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
  "screen-size-calculator": {
    heading: "What the numbers mean",
    howToHeading: "Using the calculator",
    faqHeading: "Screen size and PPI questions",
    terms: [
      { name: "Pixel density (PPI)", text: "The diagonal in pixels divided by the diagonal in inches. Higher means sharper at the same viewing distance." },
      { name: "Width and height", text: "The physical size of the picture, worked out from the diagonal and the shape of the pixel grid. Use these to check that a screen fits your desk or wall." },
      { name: "Aspect ratio", text: "The shape of the screen: its width compared with its height. 16:9 is the standard for monitors and TVs, 16:10 and 3:2 are common on laptops, and 21:9 is ultrawide." },
      { name: "Pixel pitch", text: "The distance from the center of one pixel to the next, in millimeters. It is PPI expressed the other way round, and is the figure monitor specifications usually quote." },
      { name: "Total pixels", text: "Width multiplied by height, in megapixels. It is what the graphics card has to draw, so it matters more for game performance than for sharpness." },
    ],
    note:
      "The result assumes square pixels, which every current monitor, laptop, phone and TV has. Density is only half of sharpness: the same PPI looks sharper from further away, which is why a TV needs far less than a phone.",
    guide: { slug: "ppi-and-pixel-density-explained", label: "PPI and pixel density: how sharp is sharp enough?" },
  },
  "screen-test-checklist": {
    heading: "What the three tiers mean",
    howToHeading: "Working through the checklist",
    faqHeading: "Checklist questions",
    terms: [
      { name: "Essential", text: "Finds hard defects that justify a return: pixel faults, bleed, uneven brightness, touch dead zones, burn-in. Run these on the first day." },
      { name: "Worth doing", text: "Finds problems that are usually a setting or a cable, such as the wrong refresh rate, banding or soft text. Worth fixing, and not tied to the return window." },
      { name: "Optional", text: "Depends on how you use the screen: HDR, wide color, flicker sensitivity, viewing angles." },
    ],
    note:
      "A screen that passes every test can still have quirks that are normal for its panel type, such as IPS glow or a little blooming. Each test page says which results are normal and which are faults.",
    guide: { slug: "new-device-screen-test-checklist", label: "The complete screen test checklist for a new device" },
  },
};

// "Found a problem? What to do next", for the tests where a result leads to a decision.
// Ordered: confirm it, rule out the harmless causes, record it, then act. Nothing here
// may promise an outcome a warranty doesn't: the guides are deliberately cautious on that.
const NEXT_STEPS: Record<string, string[]> = {
  "dead-pixel-test": [
    "Wipe the screen with a dry microfiber cloth and look again. If the dot moved or went, it was dust.",
    "Step through every color and write down where the dot shows. Dark on all of them means dead; one fixed color, or lit on black, means stuck.",
    "For a stuck pixel, run the Stuck-pixel fixer frame over it for 10 to 30 minutes and check again.",
    "Photograph the fault on a solid color and note the date and where on the screen it is.",
    "Check when you bought the screen. Inside the retailer's return window, return or exchange it. After that, count the faults by type and compare them with the manufacturer's pixel policy.",
  ],
  "backlight-bleed-test": [
    "Lean about a foot to each side. A glow that changes with your position is IPS glow, not bleed, and is not a fault.",
    "Lower the brightness to what you normally use, switch the room lights on, and look again.",
    "Play a dark scene from a film or game you know. If you can't see the bleed there, it will not affect you.",
    "If it does show in normal use, photograph it with the exposure locked and contact the retailer while the return window is open. Warranty cover for bleed is uncertain, so don't wait.",
  ],
  "burn-in-test": [
    "Note where the outline is, then play varied full-screen video for an hour or two.",
    "Look at the grey field again. If the outline has faded, it was temporary retention and nothing needs doing.",
    "If it is unchanged, run the panel's pixel refresh or compensation cycle once from its menu and check again.",
    "Still there? Photograph the grey field, then read the burn-in clause of your warranty and contact the manufacturer.",
  ],
  "refresh-rate-test": [
    "Open your display settings and select the highest refresh rate offered for this screen.",
    "If the rate you expect isn't in the list, change the cable or port: use DisplayPort, or an HDMI cable and port rated for that rate at your resolution.",
    "Look in the monitor's own menu for a setting that unlocks the full rate, such as an overclock, a DisplayPort version or an HDMI mode option.",
    "On a laptop or phone, plug in and turn off battery saver, then measure again.",
  ],
  "ghosting-test": [
    "Find the overdrive setting in the monitor's menu. It may be called Response Time, Overdrive, TraceFree or AMA.",
    "Try each level at Medium speed and keep the one with the shortest trail and no bright fringe.",
    "Check that the monitor is running at its full refresh rate, because overdrive is tuned for it.",
    "If dark trails remain on a VA panel at every setting, that is the panel's limit and not a fault you can adjust away.",
  ],
  "touch-screen-test": [
    "Take off the case and the screen protector, clean and dry the glass, and run the grid again.",
    "Unplug the charger and restart the device, then test once more.",
    "Install any pending system update.",
    "If the same area still fails, the touch layer is faulty. Contact the manufacturer or a repair shop, and say whether the screen has been dropped or replaced before.",
  ],
  "pwm-flicker-test": [
    "Find the brightness level at which the copies or bands appear, and keep the screen above it.",
    "Lower the room lighting instead of the screen brightness in the evening.",
    "Look in the display settings for DC dimming, anti-flicker or flicker reduction and switch it on.",
    "If the screen still bothers you and you are inside the return window, exchange it for a model that is sold as flicker-free.",
  ],
  "brightness-uniformity-test": [
    "Clean the screen and check again, since smears look like faint patches on gray.",
    "Look at the same area during normal content: a football pitch, a snow scene, a blank document.",
    "If a patch or band is visible there, photograph the gray field and contact the retailer inside the return window.",
  ],
  "black-level-test": [
    "If the lowest steps are all black, check the RGB range first: set the graphics output and the display to the same range.",
    "Reset the monitor's black level, gamma and any shadow or 'black equalizer' setting to default.",
    "Turn off dynamic contrast, then repeat the test in a dim room at your normal brightness.",
  ],
  "screen-tearing-test": [
    "Turn on adaptive sync (G-Sync, FreeSync or VRR) in the monitor's menu and in the graphics driver.",
    "If your screen has no adaptive sync, turn on V-Sync in the game, or cap its frame rate just below the refresh rate.",
    "Check the connection: adaptive sync needs DisplayPort on a PC, or HDMI 2.1 on a console or TV.",
  ],
  "hdr-test": [
    "Switch HDR on in the operating system and, on a monitor or TV, in its own menu for the input you use.",
    "Check the cable: HDR needs HDMI 2.0 or newer, or DisplayPort.",
    "Reload this page and look at the chips above the test. If they still report SDR, try a Chromium-based browser.",
    "If the patches separate only as far as about 400 nits, HDR is working and that is your screen's limit.",
  ],
  "color-test": [
    "Write down which colors the dot or patch shows on.",
    "For a dot, run the Dead Pixel Test, which also has the Stuck-pixel fixer.",
    "For a tinted area, turn off every night mode and color filter and look again on white and gray.",
    "A tint that stays in one part of the screen is the panel. Photograph it on white and contact the retailer inside the return window.",
  ],
  "black-screen": [
    "For a glow at the edges or corners, run the Backlight Bleed Test and lean to each side to tell bleed from IPS glow.",
    "For a bright dot, run the Dead Pixel Test and try the Stuck-pixel fixer.",
    "If the whole screen looks gray instead of black, check the RGB range with the Black Level Test.",
  ],
  "white-screen": [
    "Wipe the screen with a dry microfiber cloth and look again.",
    "A dark dot that stays: step through the colors in the Dead Pixel Test to see whether it is a pixel or trapped dust.",
    "A darker patch: check it on gray with the Brightness Uniformity Test.",
    "On an OLED, an outline of a taskbar or logo: check it with the Burn-in Test.",
  ],
  "greyscale-test": [
    "Set the graphics output to full RGB and at least 8-bit color.",
    "Turn off night modes and custom color profiles, and switch the screen to its standard picture mode.",
    "If the dark steps still merge, run the Black Level Test to find where shadow detail is lost.",
    "Banding that remains after all of that is the panel's own limit.",
  ],
  "color-gradient-test": [
    "Turn off night modes, color filters and custom color profiles, then reload the page.",
    "If only one of the red, green or blue ramps bands, reset the monitor's color preset and RGB gain settings to default.",
    "Compare with the Greyscale Test. Banding in both points to the output settings or the panel, not to color.",
  ],
  "blooming-test": [
    "Lower the local-dimming setting one level and run the moving dot again.",
    "Put a little light behind or beside the screen. Halos are far less visible when the room is not pitch dark.",
    "For desktop work, try local dimming off and keep it on for films and games.",
    "If zones visibly lag behind the dot or switch on and off in blocks, raise it with the retailer inside the return window.",
  ],
  "contrast-test": [
    "If black looks gray, check the RGB range first with the Black Level Test.",
    "Turn off dynamic contrast and any eco or ambient-light mode, then look again in a dim room.",
    "If black is still gray on an IPS panel in a dark room, that is the panel type's limit and no setting will change it.",
  ],
  "viewing-angle-test": [
    "Face the screen straight on, with your eyes level with its upper third, and tilt it until top and bottom look equally bright.",
    "For a TV, run the test from every seat people actually use.",
    "If a screen sold as IPS or OLED shifts heavily, check the panel type in the specifications and raise it with the seller.",
  ],
  "gamma-test": [
    "Reset browser zoom with Ctrl/Cmd + 0, select the native resolution and reload.",
    "Step through the monitor's gamma presets and keep the one where the 2.2 patch blends in.",
    "If no preset is right, use the operating system's display calibration tool.",
    "Run the test again after each change.",
  ],
  "screen-info": [
    "Resolution lower than the specification: select the native resolution in your display settings.",
    "Refresh rate reads 60 on a faster screen: follow the steps on the Refresh Rate Test page.",
    "HDR says No on an HDR screen: switch HDR on in the operating system and reload.",
    "sRGB on a wide-gamut monitor: look for an sRGB mode in the monitor's menu and turn it off.",
  ],
  "overscan-test": [
    "On the TV, set the picture size to a 1:1 mode such as Just Scan or Screen Fit.",
    "If the TV lets you label inputs, set this one to PC.",
    "Only if the TV has no such option, use the scaling control in the graphics driver.",
    "Run the test again and confirm the 0% frame is visible all the way round.",
  ],
  "sharpness-test": [
    "Select the screen's native resolution.",
    "Set display scaling to 100%, 150% or 200% and reset browser zoom.",
    "On a TV, switch the input to PC or Game mode and set the output to RGB or 4:4:4.",
    "Lower the Sharpness setting until the outlines on the halo pattern disappear.",
  ],
  "frame-skipping-test": [
    "Close other apps and take several more photos to confirm the gap is always there.",
    "Lower the refresh rate one step and test again, until the run of cells is unbroken.",
    "Remove any custom resolution or overclock and use the highest rate that passes.",
  ],
  "wide-color-gamut-test": [
    "Read the chips above the test to see what the browser reports.",
    "Turn off the monitor's sRGB mode, if it has one, and reload.",
    "Try a different browser.",
    "If the screen is sRGB, there is nothing to fix: sRGB is the correct target for web content.",
  ],
};

// Reference tables per test. Where a guide has the same table, the rows here are that
// guide's rows: change both together.
const TABLES: Record<string, ToolTable[]> = {
  "dead-pixel-test": [
    {
      title: "How each kind of fault looks on the test colors",
      head: ["Fault", "On black", "On white", "On red, green, blue", "Can it recover?"],
      rows: [
        ["Dead pixel", "Invisible", "Dark dot", "Dark dot on all three", "No"],
        ["Stuck sub-pixel", "Colored dot", "Dot of the opposite tint", "Invisible on its own color", "Sometimes"],
        ["Hot pixel", "White dot", "Invisible", "Light dot on all three", "Rarely"],
        ["Dust on the surface", "Hard to see", "Soft-edged speck", "Dark speck", "Wipes off"],
      ],
    },
  ],
  "backlight-bleed-test": [
    {
      title: "Backlight bleed and IPS glow compared",
      head: ["", "Backlight bleed", "IPS glow"],
      rows: [
        ["Changes when you move your head", "No", "Yes"],
        ["Shape", "Streaks, patches, torch-beam from an edge", "Broad wash from a corner"],
        ["Color", "Usually white or warm", "Silvery, blue or amber"],
        ["Panels affected", "Any LCD, worst on edge-lit designs", "IPS specifically"],
        ["Is it a defect", "Sometimes, if severe", "No, inherent to the technology"],
        ["Warranty", "Occasionally accepted", "Almost never"],
      ],
    },
  ],
  "refresh-rate-test": [
    {
      title: "Frame time at common refresh rates",
      head: ["Refresh rate", "Time per frame"],
      rows: [
        ["60 Hz", "16.67 ms"],
        ["75 Hz", "13.33 ms"],
        ["120 Hz", "8.33 ms"],
        ["144 Hz", "6.94 ms"],
        ["165 Hz", "6.06 ms"],
        ["240 Hz", "4.17 ms"],
        ["360 Hz", "2.78 ms"],
      ],
    },
    {
      title: "What the connection usually needs",
      head: ["What you are driving", "Usually needs"],
      rows: [
        ["1080p at 144 Hz", "DisplayPort, or HDMI 2.0"],
        ["1440p at 144 Hz", "DisplayPort 1.2 or better, or HDMI 2.0"],
        ["4K at 120 Hz or more", "HDMI 2.1, or DisplayPort 1.4 with DSC"],
      ],
      note: "The cable, the port on the computer and the port on the screen all have to support the rate.",
    },
  ],
  "ghosting-test": [
    {
      title: "Typical motion behavior by panel type",
      head: ["Panel", "What to expect"],
      rows: [
        ["TN", "Fastest transitions, weakest colors and viewing angles"],
        ["IPS", "Fast enough for most gaming; some smear on dark transitions"],
        ["VA", "Strong contrast, noticeably slow from dark to dark: the classic black smear"],
        ["OLED", "Near-instant transitions; the blur that remains comes from each frame being held"],
      ],
    },
  ],
  "contrast-test": [
    {
      title: "Panel types at a glance",
      head: ["Panel", "Contrast", "Viewing angles", "Motion", "Burn-in risk"],
      rows: [
        ["TN", "Lowest", "Poor", "Fast", "None"],
        ["IPS", "Low to medium", "Excellent", "Fast (modern)", "None"],
        ["VA", "High", "Medium", "Slow in darks", "None"],
        ["OLED", "Effectively infinite", "Excellent", "Fastest", "Real, manageable"],
      ],
    },
  ],
  "pwm-flicker-test": [
    {
      title: "Which screens tend to use PWM",
      head: ["Display type", "Typical behavior"],
      rows: [
        ["OLED phones", "Very commonly PWM, including flagships; often worst at low brightness"],
        ["Budget LED monitors and laptops", "Mixed: many use PWM, some at a low frequency"],
        ["Monitors marked flicker-free", "DC dimming or high-frequency PWM; usually fine"],
        ["Older CCFL-backlit LCDs", "Often steadier than cheap LED dimming, but not guaranteed"],
      ],
    },
  ],
  "wide-color-gamut-test": [
    {
      title: "The three color spaces you will see in specifications",
      head: ["Space", "Roughly what it is for", "Sensible target"],
      rows: [
        ["sRGB", "Web, office, SDR games, most photos", "99–100% coverage"],
        ["DCI-P3", "HDR film and TV, phone displays", "90%+ coverage"],
        ["Adobe RGB", "Photo editing headed for print", "95%+ coverage"],
      ],
    },
  ],
  "brightness-uniformity-test": [
    {
      title: "Normal, or worth a return?",
      head: ["What you see", "Usually normal", "Push for a return when"],
      rows: [
        ["Faint corner glow on an LCD in a dark room", "Yes, especially on IPS", "It is visible during normal viewing, not only on a test field"],
        ["Light vertical banding on a dark gray field", "Common on large VA and OLED panels", "You can see it in a panning shot of a football pitch"],
        ["A dark patch that does not move with the content", "No", "Always"],
      ],
    },
  ],
  "screen-info": [
    {
      title: "Common screen resolutions",
      head: ["Name", "Pixels", "Aspect ratio"],
      rows: [
        ["HD (720p)", "1280 × 720", "16:9"],
        ["Full HD (1080p)", "1920 × 1080", "16:9"],
        ["WUXGA", "1920 × 1200", "16:10"],
        ["QHD (1440p)", "2560 × 1440", "16:9"],
        ["Ultrawide QHD", "3440 × 1440", "21:9"],
        ["4K UHD", "3840 × 2160", "16:9"],
        ["5K", "5120 × 2880", "16:9"],
        ["8K UHD", "7680 × 4320", "16:9"],
      ],
    },
  ],
  "frame-skipping-test": [
    {
      title: "Shutter speed to use",
      head: ["Refresh rate", "Shutter", "Cells lit in one photo"],
      rows: [
        ["60 Hz", "1/8 s", "about 7"],
        ["120 Hz", "1/15 s", "about 8"],
        ["144 Hz", "1/15 s", "about 10"],
        ["165 Hz", "1/20 s", "about 8"],
        ["240 Hz", "1/30 s", "about 8"],
        ["360 Hz", "1/50 s", "about 7"],
      ],
    },
  ],
  "black-level-test": [
    {
      title: "Full and Limited RGB range",
      head: ["Range", "Black", "White", "Used by"],
      rows: [
        ["Full", "0", "255", "Computers and monitors"],
        ["Limited", "16", "235", "TVs, Blu-ray and streaming"],
      ],
      note: "A Limited signal on a Full display gives gray blacks. A Full signal on a Limited display crushes the darkest steps to black.",
    },
  ],
  "screen-tearing-test": [
    {
      title: "Ways to stop tearing",
      head: ["Method", "Tearing", "Added lag", "Needs"],
      rows: [
        ["Sync off", "Yes", "None", "Nothing"],
        ["V-Sync", "None", "Some", "Nothing"],
        ["Adaptive sync (G-Sync, FreeSync, VRR)", "None inside its range", "Very little", "A compatible screen and graphics card, over DisplayPort or HDMI 2.1"],
      ],
    },
  ],
  "burn-in-test": [
    {
      title: "Image retention and burn-in compared",
      head: ["", "Image retention", "Burn-in"],
      rows: [
        ["After an hour or two of varied video", "Faded or gone", "Unchanged"],
        ["Cause", "A temporary after-effect of a static image", "Uneven wear of the pixels"],
        ["Permanent", "No", "Yes"],
        ["Warranty", "Not a fault", "Varies by brand; read the clause"],
      ],
    },
  ],
};

export function getResults(slug: string): ToolResults | undefined {
  const base = TOOL_RESULTS[slug];
  if (!base) return undefined;
  const next = NEXT_STEPS[slug];
  const tables = TABLES[slug];
  return { ...base, ...(next ? { next } : {}), ...(tables ? { tables } : {}) };
}
