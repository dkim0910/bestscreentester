// Static blog/guide content. Bodies are MDX/Markdown and link to the on-site
// tools so each guide doubles as a tool entry point. This is the single source
// of truth for the blog — no database involved.

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
}

export const GUIDES: Guide[] = [
  // ---------- Getting started / checklists ----------
  {
    slug: "new-device-screen-test-checklist",
    title: "The Complete New-Device Screen Test Checklist",
    excerpt:
      "A 10-minute routine to inspect any new laptop, monitor, phone, or TV before the return window closes.",
    tags: ["checklist", "guide", "new device"],
    body: `Unboxed something new? Spend ten minutes now so you don't regret it later. Run these tests in order, in a dimly lit room, with brightness at maximum.

## 1. Dead and stuck pixels
Open the [Dead Pixel Test](/dead-pixel-test) and step through every solid color. Watch for any dot that's the wrong color. A dot that stays black is **dead**; a dot locked on one color is **stuck**.

## 2. Dark-screen defects
Switch to the [Black Screen](/black-screen) and look for:
- **Backlight bleed** — cloudy light at the edges (LCD only).
- **Dust or debris** trapped under the glass.
- **Bright (hot) pixels** glowing against the black.

## 3. Bright-screen defects
Switch to the [White Screen](/white-screen) and look for dark dots, smudges, and yellow/pink tint patches.

## 4. Uniformity
Run the [Brightness Uniformity Test](/brightness-uniformity-test). Compare the center to the four corners — big differences mean uneven backlighting.

## 5. Color and banding
Use the [Greyscale Test](/greyscale-test) and [Color Gradient Test](/color-gradient-test) to check for banding and tint shifts.

## 6. Motion (monitors/TVs)
Confirm your panel hits its rated speed with the [Refresh Rate Test](/refresh-rate-test) and check for trails with the [Ghosting Test](/ghosting-test).

## What counts as a defect?
Manufacturers tolerate a few dead pixels (see your warranty). But trapped dust, heavy backlight bleed, or obvious tint patches are usually grounds for a return — act while you still can.`,
  },
  {
    slug: "how-to-test-a-monitor-before-buying",
    title: "How to Test a Monitor Before (and Right After) Buying",
    excerpt:
      "What to check in the store and at home so you don't keep a monitor with dead pixels, bleed, or the wrong refresh rate.",
    tags: ["monitor", "buying guide", "guide"],
    body: `A monitor is a multi-year purchase. Five minutes of testing protects it.

## Before you pay (in store)
If there's a display unit, load this site on your phone, mirror it, or ask staff to open a browser:
- Solid colors via the [Color Test](/color-test) for obvious pixel defects.
- A [Black Screen](/black-screen) for backlight bleed.

## At home, day one
1. **Pixels** — [Dead Pixel Test](/dead-pixel-test).
2. **Bleed & glow** — [Backlight Bleed Test](/backlight-bleed-test) in a dark room.
3. **Uniformity** — [Brightness Uniformity Test](/brightness-uniformity-test).
4. **Refresh rate** — [Refresh Rate Test](/refresh-rate-test); make sure Windows/macOS is actually set to the panel's max Hz.
5. **Motion** — [Ghosting Test](/ghosting-test) to judge response time and overdrive.

## Red flags worth a return
- More than one or two stuck/dead pixels.
- Backlight bleed bad enough to notice during normal dark-scene viewing.
- Color tint that shifts noticeably corner to corner.
- A measured refresh rate far below the advertised number.

## Don't forget the cable
A 144Hz or 4K panel needs a cable and port that can carry the bandwidth (DisplayPort or a high-speed HDMI). If your refresh-rate test reads low, swap the cable before blaming the panel.`,
  },
  {
    slug: "how-to-test-a-tv-for-defects",
    title: "How to Test a New TV for Dead Pixels and Uniformity",
    excerpt:
      "Use your TV's browser or a phone to run solid-color and gray tests that reveal panel defects and dirty-screen effect.",
    tags: ["tv", "guide", "uniformity"],
    body: `TVs are big, so defects are easy to miss — and easy to spot once you know what to display.

## Get a test pattern on screen
- **Smart TV:** open the built-in web browser and load this site.
- **No browser:** cast or mirror from a phone, or use a USB stick with solid-color images.

## The tests
1. **Pixels** — full-screen red, green, blue, white, and black via the [Color Test](/color-test).
2. **Dirty screen effect (DSE)** — a 5% gray or [Brightness Uniformity](/brightness-uniformity-test) field shows vertical bands and blotches that ruin panning shots in sports.
3. **Backlight/blooming** — on LED/Mini-LED sets, the [Blooming Test](/blooming-test) reveals halos around bright objects on black.
4. **OLED black** — on OLED, a [Black Screen](/black-screen) should look truly off, with no glow.

## Viewing distance matters
Step back to your normal seating distance before judging. A single pixel invisible from the couch isn't worth a return; a gray-uniformity band visible across the room is.`,
  },

  // ---------- Dead / stuck pixels ----------
  {
    slug: "how-to-test-a-laptop-screen-for-dead-pixels",
    title: "How to Test a Laptop Screen for Dead Pixels",
    excerpt:
      "A step-by-step guide to checking a new or used laptop display for dead and stuck pixels before it's too late to return it.",
    tags: ["laptop", "dead pixel", "guide"],
    body: `New laptops should arrive with a flawless panel — but defects slip through. Here's how to check yours in under two minutes.

## Why test right away?
Most return windows are short. Catching a dead pixel on day one is the difference between a free replacement and living with it for years.

## The 60-second test
1. Open the [Dead Pixel Test](/dead-pixel-test) and set brightness to maximum.
2. Click **Start** to go full-screen.
3. Step through each solid color with the arrow keys.
4. Look closely for any dot that stays the wrong color.

## What you're looking for
- A **dead pixel** stays black on every color.
- A **stuck pixel** is locked on one color (often red, green, or blue).
- **Bright pixels** glow on a black background.

If you find a stuck pixel, try the rapid color flash — it revives some of them. Dead pixels usually need a warranty claim.`,
  },
  {
    slug: "dead-vs-stuck-vs-hot-pixels",
    title: "Dead vs Stuck vs Hot Pixels: How to Tell Them Apart",
    excerpt:
      "Three different defects look similar but behave differently. Identify which one you have — and whether it's fixable.",
    tags: ["dead pixel", "stuck pixel", "guide"],
    body: `Not every bad pixel is the same. Telling them apart decides whether you can fix it or need a warranty claim.

## Dead pixel
Receives no power, so it's **always black** on every color. Run the [Color Test](/color-test) — if a dot stays black on white, red, green, *and* blue, it's dead. Dead pixels are rarely fixable in software.

## Stuck pixel
A sub-pixel is locked on, so the pixel shows a **fixed color** (red, green, blue, or a mix). It stands out most on a contrasting background. Stuck pixels can often be revived.

## Hot (bright) pixel
A pixel stuck fully on — it glows **white or bright** against a [Black Screen](/black-screen). Like stuck pixels, sometimes recoverable.

## Quick identification table
- Black on all colors → **dead**.
- One constant color → **stuck**.
- Bright white on black → **hot**.

## Next steps
For stuck/hot pixels, try the fixes in our [stuck pixel guide](/blog/how-to-fix-a-stuck-pixel). For dead pixels, check your manufacturer's [dead pixel policy](/blog/dead-pixel-warranty-policies).`,
  },
  {
    slug: "how-to-fix-a-stuck-pixel",
    title: "How to Fix a Stuck Pixel (4 Methods That Actually Work)",
    excerpt:
      "Flashing, the pressure method, and tapping — practical ways to revive a stuck pixel, plus when to stop trying.",
    tags: ["stuck pixel", "fix", "guide"],
    body: `A stuck pixel is locked on one color, but unlike a dead pixel it often has power — which means you can sometimes shock it back to life.

## Method 1: Rapid color flashing
Cycling colors quickly over the stuck pixel exercises its sub-pixels. Open the [Dead Pixel Test](/dead-pixel-test), park the stuck pixel in view, and let fast color changes run for 10–30 minutes. This is the safest method — try it first.

## Method 2: The pressure method
1. Power off the display.
2. Wrap a fingertip or a soft, blunt stylus in a microfiber cloth.
3. Apply **gentle** pressure exactly on the stuck pixel.
4. While holding, power on and load a [White Screen](/white-screen), then release.

Too much pressure creates *new* defects — be light.

## Method 3: Tapping
With a white image displayed, lightly tap the stuck pixel area with a soft, rounded object. A few taps can reseat the liquid crystal.

## Method 4: Combine them
Flash colors *and* apply gentle pressure together for stubborn pixels.

## When to stop
If nothing changes after a few attempts over a day or two, the pixel is likely dead, not stuck. Don't keep pressing — check your [warranty options](/blog/dead-pixel-warranty-policies) instead.`,
  },
  {
    slug: "what-causes-dead-pixels",
    title: "What Causes Dead Pixels (and How to Avoid Creating Them)",
    excerpt:
      "Manufacturing defects, pressure, heat, and age all kill pixels. Here's what's in your control.",
    tags: ["dead pixel", "guide", "panel"],
    body: `Each pixel has red, green, and blue sub-pixels driven by tiny transistors. When something interrupts that, the pixel fails.

## Common causes
- **Manufacturing defects** — a faulty transistor from the factory. Most day-one dead pixels are this.
- **Physical pressure** — pressing hard on the panel, a tight laptop lid, or a heavy object in a bag.
- **Heat and humidity** — extreme conditions degrade the liquid crystal and electronics.
- **Age** — sub-pixels can fail gradually over many years.
- **Manufacturing dust** — sometimes mistaken for a dead pixel; it sits under the glass and doesn't change with color (test with the [White Screen](/white-screen)).

## How to avoid making more
- Never press hard on the screen — clean with a **dry or barely damp** microfiber cloth.
- Don't stack heavy items on a laptop lid.
- Avoid leaving devices in hot cars.
- Use a padded sleeve for transport.

## Test regularly
Run the [Dead Pixel Test](/dead-pixel-test) when a device is new (while under warranty) and occasionally after — catching problems early gives you the most options.`,
  },
  {
    slug: "dead-pixel-warranty-policies",
    title: "Dead Pixel Warranty Policies, Explained",
    excerpt:
      "How many dead pixels does it take to get a replacement? A practical look at ISO 9241 and manufacturer thresholds.",
    tags: ["dead pixel", "warranty", "guide"],
    body: `Frustratingly, a single dead pixel usually isn't enough for a free replacement. Manufacturers grade panels against a standard.

## The ISO 9241-307 standard
Displays are sorted into pixel-defect **classes**. Most consumer panels are **Class II**, which permits a small number of defects per million pixels:
- A handful of fully bright or dead pixels.
- A larger number of defective sub-pixels.

So a 4K panel (≈8.3 million pixels) can have several "allowed" defects and still pass.

## What this means for you
- **Bright/hot pixels** are treated more strictly than dark ones — they're more likely to qualify.
- **Clustered** defects (several close together) are often covered even when scattered ones aren't.
- Some premium brands and retailers offer a **zero bright-dot guarantee** — worth paying for if you're picky.

## Before you file a claim
1. Document the defect: photograph the screen on solid colors from the [Color Test](/color-test).
2. Note exactly where it is and on which colors it appears.
3. Check whether your seller has a better return policy than the maker's warranty — returning within the window is often easier than a warranty claim.`,
  },

  // ---------- Color & calibration ----------
  {
    slug: "how-to-calibrate-your-monitor-without-a-colorimeter",
    title: "How to Calibrate Your Monitor Without a Colorimeter",
    excerpt:
      "Get noticeably better color and contrast by eye using built-in tools and test patterns — no hardware required.",
    tags: ["calibration", "color", "guide"],
    body: `A hardware colorimeter is most accurate, but you can get 80% of the benefit by eye in 15 minutes.

## 1. Warm up and set the environment
Let the monitor run for 20–30 minutes and dim harsh room lighting. Set the monitor to its **sRGB** or **Standard** preset to start from a sane baseline.

## 2. Set brightness and contrast
Display a [White Screen](/white-screen). Lower brightness until it's comfortable, not glaring. Then use the [Greyscale Test](/greyscale-test) — raise contrast until the brightest steps are distinct but not blown out into pure white.

## 3. Black level
On a [Black Screen](/black-screen), adjust brightness so near-black detail is visible without the black turning gray.

## 4. Gamma and banding
Use the [Color Gradient Test](/color-gradient-test). A good setup shows a smooth ramp with no harsh bands and neutral grays (no green/magenta tint).

## 5. Color temperature
Most people prefer ~6500K (warmer than default). If whites look blue, lower the color temperature or reduce the blue channel in the RGB gain settings.

## 6. Save it
Store the result as a custom preset so a menu bump doesn't undo your work. For color-critical work, a $100–200 colorimeter still pays off — but this gets you a clean, consistent picture for free.`,
  },
  {
    slug: "color-gamut-srgb-vs-dci-p3-vs-adobe-rgb",
    title: "Color Gamut Explained: sRGB vs DCI-P3 vs Adobe RGB",
    excerpt:
      "What gamut percentages on a spec sheet actually mean, and which one matters for your work.",
    tags: ["color gamut", "color", "guide"],
    body: `"99% sRGB" and "95% DCI-P3" describe how many colors a display can show. Here's how to read them.

## What is a gamut?
A gamut is the range of colors a display can reproduce, plotted on a standard color space. Bigger gamut = more saturated, vivid colors are possible.

## The three you'll see
- **sRGB** — the web and most everyday content standard. Aim for ~99–100% sRGB coverage.
- **DCI-P3** — a wider gamut used for HDR video and modern phones/laptops. ~90%+ P3 looks noticeably richer.
- **Adobe RGB** — wide in the greens/cyans, used in **print** workflows. Mostly relevant to photographers preparing for print.

## Coverage vs volume
- **Coverage**: how much of the target space the display reaches (e.g. 98% sRGB).
- **Volume**: can exceed 100% if the panel is *wider* than the target — extra saturation that isn't always useful.

## Why too-wide can hurt
A wide-gamut monitor with no sRGB clamp makes everyday sRGB content look **oversaturated** (cartoonish skin tones). Use the monitor's **sRGB mode** for web and SDR work.

## Test it yourself
Run the [Color Test](/color-test) and [Color Gradient Test](/color-gradient-test) to eyeball saturation and smoothness — and check whether an sRGB mode tames over-vivid color.`,
  },
  {
    slug: "what-is-color-banding-and-how-to-reduce-it",
    title: "What Is Color Banding and How Do You Reduce It?",
    excerpt:
      "Those visible steps in a sky or gradient have several causes. Learn which are the panel and which are the content.",
    tags: ["color banding", "color", "guide"],
    body: `Banding is when a smooth gradient shows as distinct stripes instead of a seamless blend. Spot it instantly with the [Color Gradient Test](/color-gradient-test) and [Greyscale Test](/greyscale-test).

## Why it happens
- **Panel bit depth** — true 8-bit shows 16.7M colors; cheaper **6-bit + FRC** panels dither to fake it and can band.
- **Output settings** — your GPU may be sending limited color depth or the wrong RGB range.
- **Content & compression** — heavily compressed video/images bake banding in; the display only reveals it.

## How to reduce it
1. **Set full color depth** in your GPU control panel (8-bit or 10-bit, RGB **Full** range).
2. **Match the range** — set the display to Full/PC RGB if the GPU outputs Full, to avoid crushed or washed levels.
3. **Disable aggressive image processing** ("dynamic contrast" can worsen banding).
4. For media, use higher-bitrate sources; nothing fixes banding already encoded into a file.

## Panel vs content
Run the gradient test with a clean local pattern (not a compressed video). If *that* bands, it's the panel/output chain. If only certain videos band, it's the content.`,
  },
  {
    slug: "gamma-explained",
    title: "Gamma Explained: Why Your Shadows Look Wrong",
    excerpt:
      "Gamma controls how brightness is distributed between black and white. Here's how to check and set it.",
    tags: ["gamma", "calibration", "color"],
    body: `Gamma describes the curve that maps input signal to displayed brightness. Get it wrong and images look washed out or crushed.

## The standard
Most content is mastered for **gamma 2.2** (sRGB). That's your target for general use.

## What bad gamma looks like
- **Too low** (e.g. 1.8): images look flat, washed out, gray blacks.
- **Too high** (e.g. 2.6): shadows crush to black, picture looks contrasty and "muddy" in dark scenes.

## How to check it
Run the [Greyscale Test](/greyscale-test). With correct gamma, the step from black to white looks evenly spaced — no big jump near the dark end and no detail vanishing into black. The mid-gray step should read as a believable middle, not near-white or near-black.

## How to fix it
- Set your monitor's gamma preset to **2.2** if it has one.
- On Windows, the built-in display calibration wizard adjusts gamma by eye.
- On macOS, use Display Calibrator (hold Option when opening Color settings for the full assistant).

For reference work, a colorimeter measures gamma precisely — but the greyscale pattern gets most people close.`,
  },
  {
    slug: "color-accuracy-and-delta-e-explained",
    title: "Color Accuracy and Delta E (ΔE), Explained",
    excerpt:
      "What ΔE numbers mean, what's 'good enough,' and why accuracy matters more than vividness for creative work.",
    tags: ["color accuracy", "delta e", "color"],
    body: `For photo, video, and design, **accuracy** beats vividness. Delta E is how accuracy is measured.

## What is Delta E?
ΔE is the difference between a color the display *should* show and what it *actually* shows. Lower is better:
- **ΔE < 1** — differences are imperceptible to the human eye (excellent).
- **ΔE 1–2** — perceptible only on close comparison (very good, suitable for pro work).
- **ΔE 2–3** — good for most uses.
- **ΔE > 3** — visible errors; not ideal for color-critical work.

## Average vs maximum
A panel can have a great *average* ΔE but one badly-off color (high *max* ΔE). Check both on review sites.

## Accuracy vs gamut
- **Gamut** = the range of colors possible.
- **Accuracy** = how correct each color is within that range.
A wide-gamut panel with poor accuracy still shows wrong colors.

## What you can check by eye
True ΔE needs a colorimeter, but the [Color Test](/color-test) reveals obvious tints, and the [Greyscale Test](/greyscale-test) shows whether grays stay neutral (a common accuracy failure). For client-facing color work, calibrate with hardware and re-check monthly.`,
  },
  {
    slug: "monitor-setup-for-photo-editing",
    title: "How to Set Up a Monitor for Photo Editing",
    excerpt:
      "Gamut, brightness, calibration, and room lighting choices that keep your edits looking right everywhere.",
    tags: ["photography", "calibration", "color"],
    body: `Editing on an uncalibrated screen means your photos look different on every other device. Here's a reliable setup.

## Pick the right panel
- **IPS** for wide viewing angles and consistent color.
- **99%+ sRGB** minimum; **Adobe RGB** coverage if you print.
- True **8-bit or 10-bit** to minimize banding.

## Calibrate
A hardware colorimeter is strongly recommended for editing. Target:
- **Brightness:** ~120 cd/m² for a dim room (not max).
- **White point:** 6500K (D65).
- **Gamma:** 2.2.

No colorimeter yet? Follow our [by-eye calibration guide](/blog/how-to-calibrate-your-monitor-without-a-colorimeter) as a stopgap.

## Control your room
- Use **neutral, dim** lighting — bright or colored light skews your perception.
- Avoid colored walls and desktop wallpapers behind your work; use a neutral gray.

## Verify
- [Greyscale Test](/greyscale-test) — neutral grays, smooth ramp.
- [Brightness Uniformity Test](/brightness-uniformity-test) — even backlight so corners aren't misleading you.
- [Color Gradient Test](/color-gradient-test) — no banding in skies.

Re-calibrate every 4–6 weeks; panels drift as they age.`,
  },
  {
    slug: "blue-light-and-color-temperature",
    title: "Blue Light, Night Mode, and Color Temperature",
    excerpt:
      "What color temperature does to your eyes and your color work, and how to balance comfort with accuracy.",
    tags: ["color temperature", "eye strain", "guide"],
    body: `Color temperature sets how warm (orange) or cool (blue) white looks on your screen.

## The numbers
- **6500K (D65)** — the neutral standard for content and color work.
- **Below 6500K** — warmer, more orange; easier on the eyes at night.
- **Above 6500K** — cooler, bluer; looks "brighter" but harsher.

## Night modes
Features like Night Light (Windows), Night Shift (macOS/iOS), and f.lux warm the screen on a schedule to reduce blue light in the evening. They can ease eye strain and help some people sleep — but they **shift colors**, so turn them **off** for any color-critical editing.

## Eye-strain basics that matter more
Color temperature is a small factor. Bigger wins:
- Match screen brightness to the room (test extremes with [White](/white-screen) and [Black](/black-screen) screens).
- Follow the 20-20-20 rule (every 20 min, look 20 ft away for 20 s).
- Reduce glare and increase text size.

## Verify your white
Load a [White Screen](/white-screen): it should look neutral, not blue or yellow, at your chosen setting.`,
  },

  // ---------- Motion & gaming ----------
  {
    slug: "refresh-rate-explained-60-vs-120-vs-144-vs-240",
    title: "Refresh Rate Explained: 60 vs 120 vs 144 vs 240Hz",
    excerpt:
      "What Hz actually means, where the jumps are most noticeable, and how to confirm you're getting what you paid for.",
    tags: ["refresh rate", "gaming", "guide"],
    body: `Refresh rate is how many times per second your display updates, measured in hertz (Hz). Higher = smoother motion.

## What each tier feels like
- **60Hz** — standard for office and general use.
- **120/144Hz** — a big, obvious jump; smoother scrolling, sharper motion, lower lag. The best value upgrade for most people.
- **240Hz+** — smaller but real gains for competitive gaming; diminishing returns.

## The catch: you must enable it
A 144Hz monitor often defaults to 60Hz. After connecting:
- **Windows:** Settings → System → Display → Advanced display → choose the max refresh rate.
- **macOS:** System Settings → Displays → Refresh Rate.

Then confirm with the [Refresh Rate Test](/refresh-rate-test). If it reads 60 on a 144Hz panel, fix the OS setting or your cable.

## Frame rate vs refresh rate
Your GPU must also *produce* enough frames. A 144Hz screen showing a 60fps game updates at 144Hz but only shows 60 new frames — pair a high-refresh panel with adaptive sync (see our [tearing guide](/blog/screen-tearing-vsync-gsync-freesync)).

## Cable and bandwidth
High refresh at high resolution needs DisplayPort or high-speed HDMI 2.1. An old cable is a common reason the rate caps out.`,
  },
  {
    slug: "what-is-ghosting-and-how-to-fix-it",
    title: "What Is Ghosting and How Do You Fix It?",
    excerpt:
      "Trails behind moving objects come from slow pixels — and the cure (overdrive) can overshoot. Here's the balance.",
    tags: ["ghosting", "response time", "gaming"],
    body: `Ghosting is a smeared trail behind moving objects, caused by pixels changing color too slowly.

## See it first
Run the [Ghosting Test](/ghosting-test). Watch the moving blocks:
- A faint **trail** behind the object = ghosting (pixels too slow).
- A bright **fringe or inverse trail** = overshoot (overdrive too aggressive).

## The fix: overdrive
Monitors include an **overdrive** (a.k.a. Response Time, OD, TraceFree, Overshoot) setting that pushes pixels to switch faster.
1. Find it in your monitor's OSD.
2. Step through the levels while watching the [Ghosting Test](/ghosting-test).
3. Pick the level with the **least trailing and no obvious overshoot** — usually the middle setting, not the maximum.

## Other factors
- **Refresh rate:** higher Hz shortens the time each frame is shown, reducing perceived blur.
- **Panel type:** VA panels ghost more in dark transitions; TN and good IPS are faster.
- **VA "black smearing":** dark-to-dark transitions are the slowest — judge overdrive using the dark rows of the test.

The "best" overdrive can change with refresh rate, so re-check if you switch between 60Hz and your panel's max.`,
  },
  {
    slug: "response-time-vs-input-lag",
    title: "Response Time vs Input Lag: They're Not the Same",
    excerpt:
      "One is how fast pixels change; the other is how long until your click appears. Both affect feel — differently.",
    tags: ["input lag", "response time", "gaming"],
    body: `These two specs get mixed up constantly. They measure different things.

## Response time (pixels)
How long a pixel takes to change color, in **milliseconds (ms)**, usually gray-to-gray (GtG). Slow response → **ghosting/blur**. Test it visually with the [Ghosting Test](/ghosting-test). "1ms" claims are best-case; real-world is often higher.

## Input lag (system)
The delay between an input (mouse/keyboard) and the result showing on screen. It's the sum of:
- Mouse polling and USB delay.
- Game engine and render time.
- Display processing (scaler, image enhancements).

High input lag makes a game feel "floaty" even at high frame rates.

## How to reduce input lag
- Enable the monitor's **Game Mode** (it bypasses image processing).
- Turn off dynamic contrast, motion smoothing, and noise reduction.
- Use a wired mouse with a high polling rate.
- Cap your frame rate slightly below your refresh rate when using V-Sync, or use adaptive sync.

## Bottom line
Fast response = clearer motion. Low input lag = more responsive feel. For competitive play you want **both** — and a high [refresh rate](/refresh-rate-test) on top.`,
  },
  {
    slug: "screen-tearing-vsync-gsync-freesync",
    title: "Screen Tearing, V-Sync, G-Sync, and FreeSync Explained",
    excerpt:
      "Why a frame splits across your screen, and which sync technology fixes it without adding lag.",
    tags: ["screen tearing", "vsync", "gaming"],
    body: `Tearing is a horizontal split where the top and bottom of the image are from different frames.

## Why it happens
Your GPU and monitor run on independent clocks. When the GPU swaps frames mid-refresh, the display shows two frames at once — a visible tear. It's worst when frame rate and refresh rate are mismatched.

## The fixes
- **V-Sync** — caps frames to the refresh rate. Stops tearing but adds **input lag** and can stutter when frame rate dips.
- **Adaptive sync (G-Sync / FreeSync / VESA Adaptive-Sync)** — the *monitor* varies its refresh rate to match the GPU's frame rate in real time. Smooth, tear-free, and **low lag**. This is the modern answer.

## Getting adaptive sync working
1. Confirm the monitor supports it and enable it in the OSD.
2. Enable G-Sync/FreeSync in your GPU control panel.
3. Stay within the monitor's variable-refresh **range** (e.g. 48–144Hz). Below the range, behavior falls back — many people enable V-Sync too, only to catch frames above the range.

## Verify motion
Confirm your true refresh with the [Refresh Rate Test](/refresh-rate-test) and check trailing with the [Ghosting Test](/ghosting-test) once sync is on.`,
  },
  {
    slug: "how-to-enable-full-refresh-rate-windows-mac",
    title: "How to Enable Your Monitor's Full Refresh Rate (Windows & Mac)",
    excerpt:
      "Bought a 144Hz monitor but it feels like 60? It probably is. Here's the two-minute fix.",
    tags: ["refresh rate", "windows", "macos"],
    body: `New high-refresh monitors frequently default to 60Hz. The hardware is fine — the setting isn't.

## Windows 10/11
1. Settings → **System** → **Display**.
2. **Advanced display**.
3. Under **Choose a refresh rate**, pick the highest value.
4. If the max isn't listed, see "If it's missing" below.

## macOS
1. System Settings → **Displays**.
2. Click **Refresh Rate** and choose the highest option (hold **Option** while clicking the menu to reveal all modes on some displays).

## Confirm it worked
Open the [Refresh Rate Test](/refresh-rate-test). It should read close to your panel's rating (a 144Hz panel typically measures ~143–144).

## If the high rate is missing
- **Cable/port:** high refresh at high resolution needs DisplayPort or HDMI 2.1. Swap a cheap or old cable.
- **Bandwidth:** dropping resolution or color depth may unlock a higher rate — check your cable's spec first.
- **GPU drivers:** update them and set the rate in the NVIDIA/AMD/Intel control panel too.
- **Adaptive sync:** enable G-Sync/FreeSync so the rate tracks your frame rate.`,
  },
  {
    slug: "motion-blur-reduction-bfi-ulmb",
    title: "Motion Blur Reduction: BFI, ULMB, and Backlight Strobing",
    excerpt:
      "How black frame insertion sharpens motion, what it costs you, and whether to turn it on.",
    tags: ["motion blur", "bfi", "gaming"],
    body: `Even with fast pixels, sample-and-hold displays blur motion because each frame is held static while your eyes track movement. Strobing fixes that differently than overdrive.

## How it works
**Backlight strobing** (NVIDIA **ULMB**, generic **MBR**, or **BFI** on TVs/OLEDs) flashes the backlight or inserts black frames between images. Your eye sees sharp, distinct frames instead of a smeared hold — motion looks CRT-clear.

## The trade-offs
- **Lower brightness** — strobing is dark because the panel is "off" part of the time.
- **No adaptive sync (usually)** — strobing and G-Sync/FreeSync often can't run together.
- **Flicker** — sensitive users may notice it, especially at lower strobe rates.
- **Fixed refresh** — best at one specific rate the manufacturer tuned.

## Should you use it?
- **Fast competitive games at locked high frame rates:** great — try it.
- **Variable frame rates / single-player:** adaptive sync is usually the better pick.

## Check the result
Run the [Ghosting Test](/ghosting-test) with strobing on and off — the trailing should shrink noticeably when it's working. Re-tune **overdrive** for the strobed mode; the ideal setting often differs.`,
  },

  // ---------- Panel technology ----------
  {
    slug: "ips-vs-va-vs-tn-vs-oled",
    title: "IPS vs VA vs TN vs OLED: Which Panel Should You Get?",
    excerpt:
      "Color, contrast, speed, and viewing angles compared, with the right pick for gaming, work, and movies.",
    tags: ["panel", "ips", "oled"],
    body: `Panel technology decides most of what you'll notice day to day. Here's the honest comparison.

## TN
- **Pros:** cheapest, historically fastest, high refresh.
- **Cons:** poor viewing angles, weak color.
- **Best for:** budget competitive gaming. Increasingly replaced by fast IPS.

## IPS
- **Pros:** excellent color and wide viewing angles; modern "fast IPS" rivals TN speed.
- **Cons:** "IPS glow" in dark corners; contrast lower than VA.
- **Best for:** all-rounders, creative work, most gaming.

## VA
- **Pros:** high native contrast and deep blacks (great for movies).
- **Cons:** slowest pixel transitions → dark "black smear" ghosting; color/gamma shift off-axis.
- **Best for:** dark-room movie watching, single-player gaming.

## OLED
- **Pros:** per-pixel light = perfect blacks, infinite contrast, near-instant response.
- **Cons:** burn-in risk with static content; lower full-screen brightness; price.
- **Best for:** movies, HDR, and gaming if you manage static elements.

## Test whatever you buy
Contrast and black depth: [Black Screen](/black-screen). Glow and bleed: [Backlight Bleed Test](/backlight-bleed-test). Motion: [Ghosting Test](/ghosting-test).`,
  },
  {
    slug: "what-is-backlight-bleed",
    title: "What Is Backlight Bleed and Is It Normal?",
    excerpt:
      "Light leaking around the edges of an LCD — when to shrug it off and when to return the panel.",
    tags: ["backlight bleed", "lcd", "panel"],
    body: `Backlight bleed is light from an LCD's backlight escaping unevenly around the panel edges, visible as cloudy patches on dark content.

## See it
In a dark room at full brightness, open the [Backlight Bleed Test](/backlight-bleed-test) (a pure black field) and inspect the edges and corners.

## Is it normal?
Some bleed is normal — LCDs are lit from behind and can't seal perfectly. It becomes a *problem* when:
- It's bright enough to notice during normal dark-scene viewing (movies, games).
- It's heavily concentrated in one corner.
- It looks like distinct flashlight beams rather than faint, even glow.

## Bleed vs IPS glow
- **Bleed:** visible **head-on**; doesn't move with your head. A panel/assembly issue.
- **IPS glow:** a silvery sheen in corners that **shifts as you move**. Normal for IPS — see our [IPS glow guide](/blog/what-is-ips-glow).

## What you can do
- Lower brightness — bleed scales with backlight intensity.
- Gently flex the bezel; sometimes assembly pressure is the cause (do this carefully).
- If it's severe, it's a valid reason to exchange the unit. OLED has **no** backlight and therefore no bleed.`,
  },
  {
    slug: "what-is-ips-glow",
    title: "What Is IPS Glow (and How to Reduce It)?",
    excerpt:
      "That silvery corner shine on IPS panels is a viewing-angle effect, not a defect — but you can minimize it.",
    tags: ["ips glow", "ips", "panel"],
    body: `IPS glow is a characteristic glow — often silvery, blue, or amber — in the corners of IPS panels when showing dark content.

## How to identify it
On a [Black Screen](/black-screen) in a dark room, move your head around. If the glow **changes or fades as your viewing angle changes**, it's IPS glow. If it stays put head-on, it's [backlight bleed](/blog/what-is-backlight-bleed) instead.

## Why it happens
It's inherent to how IPS liquid crystals pass light at an angle. **Every** IPS panel has some — it's not a defect.

## How to reduce it
- **Sit centered and back** — glow is worst when you're close and off-axis.
- **Lower brightness** for dark-room use.
- **Add bias lighting** behind the monitor; raising ambient light hides the glow.
- **Raise the monitor** so your eyes are near screen center.

## If glow bothers you
Consider **VA** (higher contrast, no IPS glow but slower) or **OLED** (perfect blacks, no glow) for dark-room movie and gaming setups.`,
  },
  {
    slug: "mini-led-vs-oled",
    title: "Mini-LED vs OLED: Which Is Better for You?",
    excerpt:
      "Brightness and burn-in resistance versus perfect blacks and zero blooming. The real trade-offs.",
    tags: ["mini-led", "oled", "panel"],
    body: `Both are premium display technologies, but they solve different problems.

## OLED
Each pixel makes its own light and can turn fully off.
- **Pros:** perfect blacks, infinite contrast, no blooming, near-instant pixel response.
- **Cons:** lower sustained full-screen brightness; **burn-in** risk from static elements; price.

## Mini-LED (LCD with many dimming zones)
A traditional LCD lit by thousands of tiny LEDs grouped into local-dimming zones.
- **Pros:** very high brightness (great for bright rooms and HDR highlights); **no burn-in**.
- **Cons:** **blooming** — halos around bright objects on black, because a zone lights more than the object. Slower than OLED.

## See blooming for yourself
On a Mini-LED display, run the [Blooming Test](/blooming-test): a bright dot on black reveals the halo. More zones = smaller halo.

## Choosing
- **Dark-room movies & best contrast:** OLED.
- **Bright room, HDR brightness, static content (productivity, long hours):** Mini-LED.
Check blacks on either with the [Black Screen](/black-screen).`,
  },
  {
    slug: "oled-burn-in-and-how-to-check-for-it",
    title: "OLED Burn-In: Causes, Prevention, and How to Check",
    excerpt:
      "OLED panels can retain images over time. Here's what causes it, how to avoid it, and how to spot it early.",
    tags: ["oled", "burn-in", "tv"],
    body: `OLED delivers perfect blacks, but static content can wear pixels unevenly and leave a permanent ghost ("burn-in").

## What causes it
Each OLED sub-pixel ages as it's used. Elements that stay on screen for hundreds of hours — taskbars, channel logos, game HUDs — wear faster, leaving a faint outline.

## How to check
Run the [Color Test](/color-test) and step through solid colors, then view a 50% gray field via the [Brightness Uniformity Test](/brightness-uniformity-test). Burn-in shows as a faint outline of logos or bars where static content used to be — gray makes it easiest to see.

## How to prevent it
- Lower brightness for static content.
- Enable **pixel shift**, screen savers, and **logo dimming**.
- Hide the taskbar/dock; auto-hide menu bars.
- Vary content; don't leave a paused game or news ticker on for hours.
- Run the panel's built-in **pixel refresh/compensation** cycle.

## Burn-in vs temporary retention
Brief **image retention** fades on its own after varied content. **Burn-in** is permanent. If an outline persists across many different images, it's burn-in — modern panels resist it far better than early OLEDs, but managing static elements still matters.`,
  },
  {
    slug: "what-is-pwm-flicker",
    title: "What Is PWM Flicker and How Do You Test for It?",
    excerpt:
      "Many screens dim by flickering the backlight faster than you can see — but your eyes may still feel it.",
    tags: ["pwm", "flicker", "eye strain"],
    body: `PWM (pulse-width modulation) is a common way displays control brightness: instead of lowering power, they switch the backlight **on and off** very fast. Lower brightness = longer "off" periods.

## Why it matters
Even when the flicker is too fast to consciously see, some people get **headaches, eye strain, or fatigue** from PWM, especially at low brightness where the off periods are longest.

## How to test for it
- **Pencil/finger test:** wave a pen quickly in front of a bright [White Screen](/white-screen). Smooth blur = likely flicker-free; multiple crisp "ghost" images = PWM flicker.
- **Phone camera:** point a slow-motion or regular camera at the screen and lower brightness — visible scrolling bands suggest PWM.
- Repeat at **low brightness**, where PWM is most aggressive.

## How to avoid the symptoms
- Look for **"flicker-free"** or **DC dimming** displays.
- Raise brightness (and tame it with software/ambient light) — higher brightness shortens off periods.
- On OLED phones, some offer a **high-frequency PWM** or DC-dimming mode.

If you're flicker-sensitive, prioritize flicker-free certification when buying.`,
  },
  {
    slug: "ppi-and-pixel-density-explained",
    title: "PPI and Pixel Density: How Sharp Is Sharp Enough?",
    excerpt:
      "Resolution alone doesn't tell you sharpness. Pixel density and viewing distance do.",
    tags: ["ppi", "resolution", "guide"],
    body: `Two screens can share a resolution yet look very different. **Pixel density (PPI)** — pixels per inch — is what determines sharpness.

## Resolution vs density
A 27" 1440p monitor (~109 PPI) and a 24" 1080p monitor (~92 PPI) differ in sharpness because density differs. Density = resolution spread over physical size.

## Rough desktop targets
- **~90–110 PPI:** standard, sharp at normal desk distance (24" 1080p, 27" 1440p, 32" 4K).
- **~140–160 PPI:** very crisp (27" 4K) — text looks print-like but may need OS scaling.
- **Higher (phones/laptops):** 200–500+ PPI, viewed up close.

## Viewing distance is half the story
The farther you sit, the less density you need. That's why a 4K TV across the room and a 1080p phone in your hand can both look sharp.

## OS scaling
High-PPI screens make UI tiny, so you apply **scaling** (e.g. 150%). Non-integer scaling can soften text slightly on some apps.

## Check clarity
After setting resolution and scaling, view a [White Screen](/white-screen) with black text or fine patterns to judge real-world sharpness — and confirm no scaling blur.`,
  },
  {
    slug: "hdr-explained",
    title: "HDR Explained: What Makes a Display Actually HDR",
    excerpt:
      "Most 'HDR' monitors aren't. Here's what real HDR needs — brightness, contrast, and wide color.",
    tags: ["hdr", "color", "guide"],
    body: `HDR (High Dynamic Range) promises brighter highlights, deeper shadows, and richer color. The label is wildly overused.

## What real HDR needs
- **High peak brightness** — 600+ nits to make highlights pop; 1000+ is excellent.
- **High contrast / local dimming** — many dimming zones (Mini-LED) or per-pixel control (OLED).
- **Wide color gamut** — strong **DCI-P3** coverage (see our [gamut guide](/blog/color-gamut-srgb-vs-dci-p3-vs-adobe-rgb)).
- **10-bit color** to avoid banding in HDR gradients.

## The "fake HDR" trap
**DisplayHDR 400** badges often mean a standard SDR panel that merely *accepts* an HDR signal — no real local dimming or extra brightness. It can look *worse* than SDR. Look for **DisplayHDR 600/1000**, or OLED.

## Setting it up
- Enable HDR in the OS **and** the game/app.
- On Windows, run the **HDR calibration** app.
- HDR needs adequate cable bandwidth (HDMI 2.1 / DisplayPort).

## Check the basics first
HDR leans on black level and gradients. Verify deep blacks with the [Black Screen](/black-screen), blooming with the [Blooming Test](/blooming-test), and smooth tone transitions with the [Color Gradient Test](/color-gradient-test).`,
  },
  {
    slug: "screen-door-effect-explained",
    title: "The Screen-Door Effect: Why You See a Grid",
    excerpt:
      "A faint mesh over the image, most common in VR and big screens up close. Here's what causes it.",
    tags: ["screen door", "vr", "panel"],
    body: `The screen-door effect (SDE) is a visible grid of fine lines between pixels — like looking through a screen door.

## What causes it
Every pixel has a tiny non-illuminated gap around it. When pixels are large relative to your viewing distance, those gaps become visible as a mesh. It's about **fill factor** and **pixel density**, not a defect.

## Where you'll see it
- **VR headsets** — lenses magnify pixels right against your eye (early headsets were notorious).
- **Large TVs viewed too close.**
- **Low-PPI panels** at short distances.

## How it's reduced
- **Higher resolution / pixel density** — smaller gaps.
- **Higher fill factor** panels and diffusion layers.
- **Pentile vs RGB-stripe** sub-pixel layouts change how SDE appears.

## Check your own panel
View a full [White Screen](/white-screen) up close. A faint, even grid is normal SDE; irregular lines or bands are a different issue — for those, check uniformity with the [Brightness Uniformity Test](/brightness-uniformity-test). Increasing viewing distance is the simplest fix.`,
  },

  // ---------- Troubleshooting ----------
  {
    slug: "why-does-my-screen-have-a-dark-spot",
    title: "Why Does My Screen Have a Dark Spot or Patch?",
    excerpt:
      "Pressure marks, blobs, and shadows have different causes — and different chances of recovery.",
    tags: ["troubleshooting", "lcd", "guide"],
    body: `A dark spot isn't always a dead pixel. Identifying the type points you to the fix.

## Possible causes
- **Pressure mark / "LCD bruise":** a darker blotch from physical pressure (a thumb on the lid, an object in a bag). On LCD it may slowly fade; if the layer is damaged, it's permanent.
- **Trapped dust:** a small dark fleck under the glass that doesn't change with color. Confirm with a [White Screen](/white-screen).
- **Dead pixel cluster:** several failed pixels close together — fixed dark on every color ([Dead Pixel Test](/dead-pixel-test)).
- **Backlight/diffuser damage:** a shadowed region from a damaged backlight layer (LCD).

## How to diagnose
1. Cycle solid colors with the [Color Test](/color-test). A spot dark on *every* color = pixels/physical. A spot that varies = something else.
2. Check if it moves or fades over days (pressure marks sometimes do).

## What you can try
- For fresh pressure marks: leave it, avoid more pressure — some recover.
- Never press hard to "fix" it; you risk spreading the damage.
- Physical damage to the panel or backlight generally requires a screen replacement.`,
  },
  {
    slug: "why-is-part-of-my-screen-discolored",
    title: "Why Is Part of My Screen Discolored or Tinted?",
    excerpt:
      "Yellow, pink, or rainbow patches usually point to a cable, pressure, or panel issue. Narrow it down fast.",
    tags: ["troubleshooting", "color", "guide"],
    body: `Discoloration — a yellow corner, pink band, or rainbow smear — has a handful of common culprits.

## Step 1: Rule out the signal
Loose or failing cables cause tint and artifacts.
- Reseat both ends of the video cable; try a **different cable and port**.
- On laptops, gently flex the hinge area — if the tint changes, it's the internal display cable.

## Step 2: Rule out software
- Disable color filters / night mode (Night Light, Night Shift).
- Reset any custom color profile (ICC) and GPU color settings.
- Update or roll back GPU drivers.

## Step 3: Test the panel
Load full-screen colors with the [Color Test](/color-test) and a [White Screen](/white-screen):
- **Uniform tint everywhere:** likely color settings or color temperature.
- **Localized patch:** pressure damage or a panel/backlight fault.
- **Rainbow/oil-slick smear:** pressure on the panel layers.

## Likely outcomes
- Cable/software → cheap or free fix.
- Localized physical discoloration that survives every test → panel issue, often a replacement.

Document it on solid colors before contacting support.`,
  },
  {
    slug: "how-to-clean-your-monitor-safely",
    title: "How to Clean Your Monitor or Laptop Screen Safely",
    excerpt:
      "The right cloth, the right liquid, and the mistakes that permanently damage coatings.",
    tags: ["cleaning", "maintenance", "guide"],
    body: `Screens have delicate anti-glare and oleophobic coatings. Clean them wrong and you can haze or scratch them for good.

## What you need
- A clean **microfiber** cloth (no paper towels, tissues, or old t-shirts).
- **Distilled water**, or a screen-safe cleaner. Avoid ammonia, alcohol (on coated panels), and household glass cleaner.

## The method
1. **Power off** — a dark screen makes dust and streaks visible (a [Black Screen](/black-screen) helps for spotting, then turn it off to wipe).
2. **Dry pass** first to lift loose dust.
3. **Lightly dampen the cloth** — never spray liquid directly on the screen; it can seep into edges.
4. Wipe **gently** in one direction or small circles. Don't press — pressure can create [pressure marks and dead pixels](/blog/what-causes-dead-pixels).
5. Let it dry fully before powering on.

## Don'ts
- Don't use paper products (they micro-scratch).
- Don't use ammonia/alcohol on matte or coated screens.
- Don't scrub stuck-on spots — re-dampen and let it soften.

## After cleaning
Bring up a [White Screen](/white-screen) to check for streaks and a [Black Screen](/black-screen) for missed dust.`,
  },
  {
    slug: "how-to-test-a-used-phone-screen-before-buying",
    title: "How to Test a Used Phone Screen Before Buying",
    excerpt:
      "Buying secondhand? Run these quick checks for dead pixels, burn-in, touch dead zones, and tint.",
    tags: ["phone", "used", "buying guide"],
    body: `A great secondhand deal can hide an expensive screen problem. Test before you pay.

## Bring up test patterns
Open this site in the phone's browser and run, full-screen:

## 1. Dead/stuck pixels
[Dead Pixel Test](/dead-pixel-test) — step through solid colors and scan for wrong-colored dots. Phone pixels are tiny, so look closely.

## 2. OLED burn-in
Most phones are OLED. Display a [White Screen](/white-screen) and a 50% gray ([Brightness Uniformity Test](/brightness-uniformity-test)) and look for faint ghosts of status bars, navigation buttons, or keyboards.

## 3. Tint and uniformity
A [White Screen](/white-screen) should be evenly white — watch for pink/green patches or a yellow half (a sign of past damage or aftermarket panels).

## 4. Touch dead zones
In a notes app or drawing app, drag a finger across **every** part of the screen in one stroke. Any gaps mean a dead touch zone.

## 5. Cracks and pressure spots
On a [Black Screen](/black-screen), look for bright spots or spreading blotches that hint at internal damage even if the glass looks intact.

## Bonus
Check True Tone/auto-brightness behave, and that the panel is genuine (aftermarket panels often show worse color and touch issues).`,
  },
  {
    slug: "laptop-external-monitor-mac-windows",
    title: "Setting Up an External Monitor Right (Mac & Windows)",
    excerpt:
      "Resolution, refresh rate, scaling, and color range settings people miss when plugging in a second screen.",
    tags: ["monitor", "windows", "macos"],
    body: `Plugging in an external monitor "just works" — but rarely at its best. Five settings make the difference.

## 1. Native resolution
Set the monitor to its **native** resolution (e.g. 2560×1440 for a 27" 1440p). Anything else looks soft.

## 2. Refresh rate
Don't assume the max is selected — it usually isn't. Set it (see our [refresh-rate guide](/blog/how-to-enable-full-refresh-rate-windows-mac)) and confirm with the [Refresh Rate Test](/refresh-rate-test).

## 3. Scaling
High-PPI panels make UI tiny. Pick comfortable scaling (Windows: Display → Scale; macOS: Displays → Scaled). Integer scaling (e.g. 200%) is sharpest.

## 4. RGB range
Over HDMI, GPUs sometimes default to **Limited** range, crushing blacks and whites. Set the GPU to **Full** RGB and the monitor to match. Verify with the [Greyscale Test](/greyscale-test) — you should see distinct steps at both the dark and bright ends.

## 5. Color profile
Select an sRGB profile for general use, or a calibrated ICC profile if you have one.

## Quick verify pass
[Dead Pixel Test](/dead-pixel-test) for the new panel, [Brightness Uniformity Test](/brightness-uniformity-test) for backlight evenness, and [Ghosting Test](/ghosting-test) if you'll game on it.`,
  },
  {
    slug: "backlight-bleed-vs-ips-glow",
    title: "Backlight Bleed vs IPS Glow: What's the Difference?",
    excerpt:
      "Both show up as light on a black screen, but they're different problems. Learn how to tell them apart and what's normal.",
    tags: ["monitor", "backlight bleed", "ips"],
    body: `Turn on a black screen in a dark room and you may see glowing patches. Are they a defect or just physics? It depends.

## Backlight bleed
Light leaking through the edges of an LCD panel. It's visible **head-on**, looks like cloudy patches in the corners, and doesn't change as you move.

Check yours with the [Backlight Bleed Test](/backlight-bleed-test).

## IPS glow
A **viewing-angle** effect unique to IPS panels. It shifts and fades as you move your head, and is most visible in the corners from an angle.

## What's normal?
Almost every LCD has *some* bleed and glow. Worry only when it's uneven, distracting in everyday use, or severe in the corners. Deep-dive guides: [backlight bleed](/blog/what-is-backlight-bleed) and [IPS glow](/blog/what-is-ips-glow).`,
  },
];

export const GUIDE_MAP: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
);

export function getGuide(slug: string): Guide | undefined {
  return GUIDE_MAP[slug];
}

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

/**
 * Guides relevant to a tool = guides whose body links to that tool's path,
 * e.g. `[Dead Pixel Test](/dead-pixel-test)`. Matching the markdown link form
 * `(/slug)` keeps it precise (no accidental substring matches).
 */
export function getGuidesForTool(slug: string, take = 4): Guide[] {
  return GUIDES.filter((g) => g.body.includes(`(/${slug})`)).slice(0, take);
}
