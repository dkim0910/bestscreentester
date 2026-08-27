// Static blog/guide content. Bodies are MDX/Markdown and link to the on-site
// tools so each guide doubles as a tool entry point. This is the single source
// of truth for the blog — no database involved.

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  // ISO YYYY-MM-DD. Required so every future guide is forced to carry a real date:
  // Article JSON-LD needs datePublished, and the sitemap derives lastmod from these
  // rather than from build time. Backfilled from the commit that introduced the
  // guides (d8cdb5c, 2026-06-21) — not invented.
  publishedAt: string;
  updatedAt?: string;
  body: string;
}

export const GUIDES: Guide[] = [
  // ---------- Getting started / checklists ----------
  {
    slug: "new-device-screen-test-checklist",
    title: "The Complete New-Device Screen Test Checklist",
    excerpt:
      "A 10-minute routine to inspect any new laptop, monitor, phone, or TV for dead pixels, bleed and tint before the return window closes.",
    tags: ["checklist", "guide", "new device"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Unboxed something new? Spend ten minutes now so you don't regret it later. Run these tests in order, in a dimly lit room, with brightness at maximum, and give the panel five minutes to warm up first — LCD backlights shift slightly in their first few minutes.

## Before you start
- Wipe the screen with a dry microfiber cloth so lint isn't mistaken for a defect. If it needs more than that, follow [How to Clean Your Monitor or Laptop Screen Safely](/blog/how-to-clean-your-monitor-safely).
- Set the display to its native resolution. A non-native resolution blurs everything and hides small faults.
- Turn off Night Light, Night Shift, and any blue-light filter — they add a warm tint that will wreck the color checks.
- Keep the box, packaging and receipt until you've finished. Return windows are short and vary by retailer and country; a pixel-policy warranty claim usually stays open much longer than the return window does.

## 1. Dead and stuck pixels
Open the [Dead Pixel Test](/dead-pixel-test) and step through every solid color. Watch for any dot that's the wrong color. A dot that stays black is **dead**; a dot locked on one color is **stuck**.

Look at the screen from roughly arm's length, then move in to about 30cm and sweep in a slow grid pattern — corners last, because that's where your eye naturally skips. Red, green and blue frames matter most: a single failed sub-pixel shows up as a colored dot on one frame and disappears on the others. If you're unsure what you've found, [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) walks through the differences.

## 2. Dark-screen defects
Switch to the [Black Screen](/black-screen) and look for:
- **Backlight bleed** — cloudy light at the edges (LCD only).
- **Dust or debris** trapped under the glass.
- **Bright (hot) pixels** glowing against the black.
- **IPS glow** — a broad silvery haze in the corners that shifts or vanishes when you move your head. That's a property of IPS panels, not a fault; see [Backlight Bleed vs IPS Glow](/blog/backlight-bleed-vs-ips-glow) before you decide to return anything.

Do this step with the room lights off. In a bright room you will see almost nothing; in a pitch-dark room you'll see flaws you would never notice in normal use. Judge it at the brightness you'll actually use.

## 3. Bright-screen defects
Switch to the [White Screen](/white-screen) and look for dark dots, smudges, scratches and yellow or pink tint patches. Dust under the glass is far easier to spot here than on black. A fleck that doesn't change color as you cycle frames is debris or a physical mark, not a pixel fault.

## 4. Uniformity
Run the [Brightness Uniformity Test](/brightness-uniformity-test). Compare the center to the four corners — big differences mean uneven backlighting. Mid-grey is the most revealing shade: on a full white field your eye adapts and evens things out, but on grey, blotchy patches (**mura**) and darker bands stand out. Some falloff toward the corners is normal on every LCD. A distinct patch with an edge to it is not.

## 5. Color and banding
Use the [Greyscale Test](/greyscale-test) and [Color Gradient Test](/color-gradient-test) to check for banding and tint shifts. Every step of the greyscale should look neutral — if the dark end drifts blue or the bright end drifts pink, the panel's white balance is off. Gradients should blend smoothly; visible stripes mean [color banding](/blog/what-is-color-banding-and-how-to-reduce-it), which is often a signal or settings problem rather than a bad panel.

Finish with the [Gamma Test](/gamma-test) to confirm mid-tones aren't crushed or washed out.

## 6. Motion (monitors and TVs)
Confirm your panel hits its rated speed with the [Refresh Rate Test](/refresh-rate-test) — a 144Hz monitor plugged in with the wrong cable or left on a default profile will often be running at 60Hz until you change it. Check for trails with the [Ghosting Test](/ghosting-test), and watch for horizontal splits with the [Screen Tearing Test](/screen-tearing-test).

## 7. Viewing angle
Step to one side and check the [Viewing Angle Test](/viewing-angle-test). TN panels shift heavily off-axis, VA panels lose contrast and gain a color wash, IPS and OLED hold up best. On a large screen this matters even head-on, because the edges are already at an angle to your eyes.

## What counts as a defect?
Manufacturers tolerate a few dead pixels. The pixel-fault classes in ISO 9241-307 are the usual reference point, and the class most consumer panels are held to allows a small number of faults per million pixels rather than demanding none — a 4K screen has more than eight million pixels, so one or two stuck sub-pixels often won't qualify for a claim. Only your manufacturer's own published pixel policy tells you the actual threshold, and it differs by brand, by product line, and sometimes between a monitor and the laptop it's built into. Check it before you call; [Dead Pixel Warranty Policies, Explained](/blog/dead-pixel-warranty-policies) covers how those numbers are counted.

Trapped dust, heavy backlight bleed, obvious tint patches, and scratches are a different matter — those are usually grounds for a return under the retailer's own policy, which is often easier to use than the warranty.

If you find something, photograph it now: shoot the black-screen flaws in a dark room with your phone locked to a fixed exposure, and mark small pixel faults with a sticky note at the screen edge. Then start the return while the window is open — the retailer's return period is the leverage you actually have, and it expires long before the warranty does.`,
  },
  {
    slug: "how-to-test-a-monitor-before-buying",
    title: "How to Test a Monitor Before (and Right After) Buying",
    excerpt:
      "What to check in the store and at home so you don't keep a monitor with dead pixels, bleed, or the wrong refresh rate.",
    tags: ["monitor", "buying guide", "guide"],
    publishedAt: "2026-06-21",
    body: `A monitor is a multi-year purchase. Five minutes of testing protects it.

The window that actually matters is the retailer's return period, not the manufacturer's warranty. A return inside 14 or 30 days is usually no-questions-asked; a warranty claim three months later has to clear a defect threshold you probably won't meet. So test hard, test early, and keep the box until you're sure.

## Before you pay (in store)
If there's a display unit, load this site on your phone, mirror it, or ask staff to open a browser:
- Solid colors via the [Color Test](/color-test) for obvious pixel defects.
- A [Black Screen](/black-screen) for backlight bleed.

Store lighting works against you here. Overhead fluorescents wash out both bleed and faint dead pixels, so treat an in-store check as a filter for obvious problems only — a bright white dot on black, a visible crack in the polarizer, a corner that glows through even under showroom light. Passing in store means nothing about how the panel looks in a dark room at home.

Also check the sticker on the back matches the box: panel size, native resolution, and rated refresh rate. Retailers do occasionally shelf a 100Hz model in the slot for a 144Hz one.

## At home, day one
Run these in order, in a dim room, with the monitor warmed up for 20-30 minutes. Backlights shift slightly in their first half hour, and a cold panel can show tint that settles on its own.

1. **Pixels** — [Dead Pixel Test](/dead-pixel-test).
2. **Bleed & glow** — [Backlight Bleed Test](/backlight-bleed-test) in a dark room.
3. **Uniformity** — [Brightness Uniformity Test](/brightness-uniformity-test).
4. **Refresh rate** — [Refresh Rate Test](/refresh-rate-test); make sure Windows/macOS is actually set to the panel's max Hz.
5. **Motion** — [Ghosting Test](/ghosting-test) to judge response time and overdrive.

For the pixel pass, work through white, black, red, green and blue full-screen. A pixel that's dark on white but invisible on black is a dead pixel. A pixel that stays one color on every field is a stuck sub-pixel — often fixable, and worth trying before you box anything up. [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) covers the distinction, and the attempts that sometimes revive a stuck one.

## What's normal and what isn't
Some of what you'll see on day one is inherent to the technology, not a fault:

- **Faint silver haze in the corners of an IPS panel, visible only off-axis** — normal. That's IPS glow, a property of the panel type rather than a fault.
- **Bright patches leaking in from the bezel edge on black** — acceptable only if they're mild and you can't see them during normal dark-scene viewing.
- **Slight brightness falloff toward the corners on a grey field** — normal on almost every LCD.
- **A single sub-pixel showing color on a black field** — common, and rarely enough on its own for a warranty claim.
- **Dark grey rather than true black with the lights off, on an IPS** — normal. IPS contrast is typically around 1000:1, so blacks lift in a dark room.
- **A faint cloudy variation across a full-screen grey** — mura, present to some degree on most LCDs; a problem only when it's obvious in real content.

Glow and bleed get confused constantly. Glow changes as you move your head; bleed stays put. [Backlight Bleed vs IPS Glow](/blog/backlight-bleed-vs-ips-glow) shows how to tell them apart in about ten seconds.

## Red flags worth a return
- More than one or two stuck/dead pixels.
- Backlight bleed bad enough to notice during normal dark-scene viewing.
- Color tint that shifts noticeably corner to corner.
- A measured refresh rate far below the advertised number.
- Any dark blotch, pressure mark or rainbow smear that doesn't move when you move your head — that's physical damage, not a characteristic.
- Audible buzzing that changes with on-screen brightness (coil whine), or visible flicker at low brightness.

If you're deciding whether a defect will ever be covered later, [Dead Pixel Warranty Policies](/blog/dead-pixel-warranty-policies) explains the class limits manufacturers actually apply. The short version: if it bothers you now, return it now.

## Don't forget the cable
A 144Hz or 4K panel needs a cable and port that can carry the bandwidth (DisplayPort or a high-speed HDMI). If your refresh-rate test reads low, swap the cable before blaming the panel.

Check the settings before the hardware, too. High-refresh monitors ship set to 60Hz far more often than people expect, and the fix is two clicks — see [How to Enable Your Monitor's Full Refresh Rate](/blog/how-to-enable-full-refresh-rate-windows-mac). Test the panel again only once the OS reports the right rate.

Photograph anything questionable now, on a solid color, with the room dark and your phone's exposure locked. Support will ask, and a photo taken on day two is far more persuasive than one taken on day forty.`,
  },
  {
    slug: "how-to-test-a-tv-for-defects",
    title: "How to Test a New TV for Dead Pixels and Uniformity",
    excerpt:
      "Use your TV's browser or a phone to run solid-color and gray tests that reveal panel defects and dirty-screen effect.",
    tags: ["tv", "guide", "uniformity"],
    publishedAt: "2026-06-21",
    body: `TVs are big, so defects are easy to miss — and easy to spot once you know what to display.

Do this in the first week. A retailer's return policy is almost always more forgiving than a manufacturer's pixel policy, so the cheapest moment to reject a bad panel is before the return window closes. Check what that window actually is on your receipt before you start.

## Set the TV up honestly first

Three things will lie to you if you skip them.

- **Picture mode.** Switch to **Filmmaker**, **Movie**, or **Cinema**. Showroom modes like **Vivid** and **Dynamic** crush shadow detail and oversaturate everything, which hides some faults and invents others.
- **Auto-dimming.** Turn off the ambient light sensor, eco mode, and any energy-saving brightness limiter. Otherwise the screen changes under you mid-test and you will chase a fault that is really just the sensor working.
- **The room.** Kill the lights. Backlight and black-level problems are close to invisible with a lamp on, and uniformity problems disappear entirely in daylight.

Let the set run 20–30 minutes before judging uniformity. Panels shift slightly as they warm up.

## Get a test pattern on screen

- **Smart TV:** open the built-in web browser and load this site.
- **No browser:** cast or mirror from a phone, or use a USB stick with solid-color images.
- **Anything else in the room:** a game console browser, a laptop over HDMI, or a streaming stick all work.

What matters is a genuinely full-screen field with no menu bar, no overlay, and no player controls fading in over the top.

## The tests

1. **Pixels** — full-screen red, green, blue, white, and black via the [Color Test](/color-test). Get within arm's reach and sweep the panel in overlapping strips; a 65-inch screen is far too big to judge in one glance. A **dead pixel** stays black on every field. A **stuck pixel** stays lit in one color and jumps out on the opposite field, so a stuck red dot is easiest to find on green or blue. The [Dead Pixel Test](/dead-pixel-test) cycles the fields for you, and [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) covers telling them apart.
2. **Dirty screen effect (DSE)** — a 5% gray or [Brightness Uniformity](/brightness-uniformity-test) field shows vertical bands and blotches that ruin panning shots in sports. This is the most useful TV test and the one almost nobody runs. Look for vertical stripes, a darker middle, and cloudy smudges. Check a mid-gray field too: some sets look filthy at 5% and clean at 50%, others the reverse.
3. **Backlight and blooming** — on LED and Mini-LED sets, the [Blooming Test](/blooming-test) reveals halos around bright objects on black. Every backlit panel does this to some degree; the question is how big the halo is and whether it visibly lags behind the object as it moves. A halo that trails the object is the local dimming algorithm reacting late, and it will show up on white subtitles over a dark scene.
4. **OLED black** — on OLED, a [Black Screen](/black-screen) should look truly off, with no glow. Faint vertical banding on a very dark gray is a common OLED trait rather than a fault; judge it on real content before you call it a defect.
5. **Burn-in and image retention** — mandatory on anything used, refurbished, or ex-display. Run the [Burn-in Test](/burn-in-test) and look for a ghosted news ticker, channel logo, or menu bar in the gray fields. [OLED Burn-In: Causes, Prevention, and How to Check](/blog/oled-burn-in-and-how-to-check-for-it) explains what is temporary retention and what is permanent.

## Normal versus worth returning

| What you see | Usually normal | Push for a return when |
| --- | --- | --- |
| Faint corner glow on an LCD in a dark room | Yes, especially on IPS | It is visible during normal viewing, not just on a black test field |
| Light vertical banding on a 5% gray field | Common on large VA and OLED panels | You can see it in a panning shot of a football pitch |
| Halo around bright objects on black | Yes on any backlit LED set | The halo is larger than the object, or clearly lags it |
| One dim or stuck subpixel | Often within the maker's policy | It is near the center, or there is more than one |
| A dark patch that does not move with content | No | Always — see [Why Does My Screen Have a Dark Spot or Patch?](/blog/why-does-my-screen-have-a-dark-spot) |

## Viewing distance matters

Step back to your normal seating distance before judging. A single pixel invisible from the couch isn't worth a return; a gray-uniformity band visible across the room is. Sit down, look at the same pattern again, and only count what you can still see from the sofa.

One caveat: once you know a flaw is there, you will see it forever. If you are genuinely unsure, live with the set for a few days on normal content. If it never bothers you again, keep it.

## If you do need to claim

Photograph the fault in a dark room with the phone's exposure and focus locked, and include a shot with something in frame for scale. Note the date, the pattern you used, and where on the panel it sits. Retailer returns rarely require any of that, but manufacturer pixel policies usually demand a minimum number of failed pixels before a panel qualifies — [Dead Pixel Warranty Policies, Explained](/blog/dead-pixel-warranty-policies) covers how those thresholds work and which faults sidestep them entirely.`,
  },

  // ---------- Dead / stuck pixels ----------
  {
    slug: "how-to-test-a-laptop-screen-for-dead-pixels",
    title: "How to Test a Laptop Screen for Dead Pixels",
    excerpt:
      "A step-by-step guide to checking a new or used laptop display for dead and stuck pixels before it's too late to return it.",
    tags: ["laptop", "dead pixel", "guide"],
    publishedAt: "2026-06-21",
    body: `New laptops should arrive with a flawless panel — but defects slip through. Here's how to check yours in under two minutes, and what to do about anything you find.

## Why test right away?

Most return windows are short — often 14 to 30 days from delivery. Catching a dead pixel on day one is the difference between a free replacement and living with it for years. Manufacturer warranties usually cover the laptop for a year or more, but **pixel defects are treated separately** from other faults: many makers only replace a panel once the defect count crosses a threshold, while the retailer's no-questions return window has no threshold at all. That window is your strongest position, so use it first.

The same logic applies to a used laptop. Test it in front of the seller, before money changes hands.

## Set up before you look

Two minutes of prep makes faults obvious instead of ambiguous:

1. **Clean the screen.** A speck of dust looks exactly like a stuck pixel. Wipe with a dry microfibre cloth — see [How to Clean Your Monitor or Laptop Screen Safely](/blog/how-to-clean-your-monitor-safely) if it needs more than that.
2. **Set the display to its native resolution.** A scaled-down resolution blurs single pixels into a smudge and can hide a defect completely.
3. **Turn brightness to maximum** and turn off any auto-brightness, night mode, or blue light filter — a warm tint masks color faults.
4. **Dim the room.** Reflections on a glossy laptop panel hide small defects; a dark room makes bright pixels jump out.

## The 60-second test

1. Open the [Dead Pixel Test](/dead-pixel-test) and set brightness to maximum.
2. Click **Start full-screen test**.
3. Step through each solid color with the arrow keys — black, white, red, green, blue, cyan, magenta, yellow, and 50% grey.
4. Look closely for any dot that stays the wrong color. Scan in a slow grid pattern rather than staring at the middle; defects near the edges are easy to miss.

Get your eyes about 30 to 40 cm from the panel. Closer than that and you'll start seeing the pixel structure itself, which is normal and not a fault.

## What you're looking for

- A **dead pixel** stays black on every color. It receives no power, so it never lights up.
- A **stuck pixel** is locked on one color (often red, green, or blue). It shows most clearly against black and against the two colors it isn't.
- **Bright pixels** — sometimes called hot pixels — glow white on a black background and stay lit no matter what is displayed.
- A **stuck sub-pixel** is smaller and dimmer than a full stuck pixel, because only one of the three red/green/blue elements is faulty. On a high-density laptop panel it may look like a faint colored speck.

If you're unsure which category yours falls into, [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) walks through the differences with the tell-tale signs of each.

### Dust, or a defect?

Change the background color. Dirt on the outside of the glass stays the same shade against every background and can be nudged with a fingertip. A real pixel fault sits *inside* the panel: it never moves, and its appearance changes depending on what is behind it. If a mark disappears when you press very gently on the bezel, it is on the surface.

## Laptop-specific things that are not dead pixels

- **Corner glow and edge bleed.** Slightly brighter patches at the corners of a black screen are backlight bleed, not pixel damage. Check with the [Backlight Bleed Test](/backlight-bleed-test) — a small amount is normal on nearly every LCD laptop.
- **Pressure marks.** Diffuse light or dark blotches, often in a line, usually come from the lid pressing on the panel — during shipping, or from carrying the laptop by its screen. These are a mechanical fault, not a pixel fault, and they are worth returning.
- **A slightly warm or cool white.** Panels vary. That's calibration, not a defect.
- **A visible grid at very close range.** That's the pixel structure of the panel itself, and every screen has it.

## How many defects are "acceptable"?

Manufacturers typically grade panels against **ISO 9241-307**, and most consumer laptops are sold to **Class II**, which tolerates a small number of always-on, always-off, and stuck sub-pixels per million pixels before the panel counts as faulty. In practice that means a single dead pixel on a 1080p laptop often will not qualify for a warranty panel swap — but it will almost always qualify for a straight return inside the retailer's window. [Dead Pixel Warranty Policies, Explained](/blog/dead-pixel-warranty-policies) covers what the major brands actually promise, including the ones with a zero-bright-pixel guarantee.

## If you find something, in this order

1. **Stuck pixel:** these are sometimes recoverable. Rapidly cycling colors over the affected area, and carefully targeted pressure, each revive a share of them — no method is reliable, and it usually takes repeated attempts. The techniques worth trying, and how long to give each one, are in [How to Fix a Stuck Pixel](/blog/how-to-fix-a-stuck-pixel).
2. **Dead or bright pixel:** software will not fix it. Nothing you display can make an unpowered pixel light up.
3. **Still there?** Photograph it against a solid [White Screen](/white-screen) and a solid [Black Screen](/black-screen), note the date, and start the return while the window is open.

Do the whole check on the day the laptop arrives, before you install anything or peel the protective film off the palm rest — a machine in original condition is far easier to send back.`,
  },
  {
    slug: "dead-vs-stuck-vs-hot-pixels",
    title: "Dead vs Stuck vs Hot Pixels: How to Tell Them Apart",
    excerpt:
      "Three different defects look similar but behave differently. Identify which one you have — and whether it's fixable.",
    tags: ["dead pixel", "stuck pixel", "guide"],
    publishedAt: "2026-06-21",
    body: `Not every bad pixel is the same. Telling them apart decides whether you can fix it or need a warranty claim.

Before you diagnose anything, clean the screen and view it at full brightness in a dim room. Plenty of reported "dead pixels" turn out to be dust. Then run full-screen solid colors from the [Dead Pixel Test](/dead-pixel-test) and get close enough to resolve an individual pixel — roughly a hand's span from the glass on a phone, arm's length on a TV.

## Dead pixel
Receives no power, so it's **always black** on every color. Run the [Color Test](/color-test) — if a dot stays black on white, red, green, *and* blue, it's dead. Dead pixels are rarely fixable in software.

The fault is electrical. On an LCD the pixel's thin-film transistor no longer switches, so that cell stays in its light-blocking state. On an OLED the emitter itself has stopped lighting. Nothing you run on the computer changes either situation, because the pixel never acts on the signal it's sent. A dead pixel is clearest as a black speck on a plain white field.

## Stuck pixel
A sub-pixel is locked on, so the pixel shows a **fixed color** (red, green, blue, or a mix). It stands out most on a contrasting background. Stuck pixels can often be revived.

Each pixel on a typical LCD is three sub-pixels — one red, one green, one blue. Which sub-pixels are misbehaving decides what you see:

- One sub-pixel stuck on → a pure red, green or blue dot.
- Two stuck on → a yellow, cyan or magenta dot.
- One sub-pixel stuck **off** → the pixel looks tinted on white but normal on black. A failed red sub-pixel reads cyan, a failed green reads magenta, a failed blue reads yellow.

That last case is the one people misidentify most often. A dot that only misbehaves on bright content is a sub-pixel fault, not a dead pixel, and it is worth reporting separately because some warranty policies count it differently.

## Hot (bright) pixel
A pixel stuck fully on — it glows **white or bright** against a [Black Screen](/black-screen). Like stuck pixels, sometimes recoverable.

All three sub-pixels are passing light at once. A hot pixel is far more obvious on OLED than on LCD, because the field around it is genuinely black rather than dark grey, so there is no backlight haze to hide in.

## Quick identification

Flip between a pure black field and a pure white field and note where the dot shows up:

- **Dead** — a black dot. Invisible on black, clearly visible on white.
- **Stuck** — a colored dot. Clearly visible on black, often invisible on white.
- **Hot** — a bright white dot. Clearly visible on black, invisible on white.
- **Sub-pixel stuck off** — a faintly tinted dot. Invisible on black, visible on white as a color cast over that one pixel.

The short version: black on all colors → dead. One constant color → stuck. Bright white on black → hot. Anything that changes as you move your head is not a pixel fault at all.

## Things that look like pixel faults but aren't
- **Dust on the surface.** It moves or disappears when wiped. Use the method in [how to clean your monitor or laptop screen safely](/blog/how-to-clean-your-monitor-safely) rather than pressing on the panel — pressure creates real faults.
- **Debris trapped under the glass.** An irregular, fuzzy-edged speck that doesn't align to the pixel grid. Cosmetic, and usually a return-policy matter rather than a pixel-policy one.
- **A patch rather than a dot.** Anything soft-edged and larger than a few pixels is pressure damage or a backlight problem — see [why your screen has a dark spot](/blog/why-does-my-screen-have-a-dark-spot).
- **A full line.** An entire row or column permanently lit or dark is a driver or ribbon-connection failure, not a pixel defect. It almost always qualifies for service regardless of pixel policy.

## What is actually fixable
Stuck and hot pixels sometimes recover, because the sub-pixel is sitting in the wrong state rather than being electrically dead. Rapid color cycling and careful, gentle massage both work occasionally — the methods are in the [stuck pixel guide](/blog/how-to-fix-a-stuck-pixel). Give it one or two sessions of 20 to 30 minutes. If there is no change at all after that, more time will not help.

Dead pixels do not come back. Skip the fixes entirely and go straight to your warranty position.

## When to claim
Manufacturers judge faults against a pixel policy, usually derived from the ISO 9241-307 fault classes. Class II — the class consumer monitors and laptops are typically sold under — allows a small number of faults per million pixels, and a 2560×1440 panel holds roughly 3.7 million pixels. One isolated dark pixel therefore often falls inside the allowance. Bright pixels are typically counted more strictly than dark ones, and a cluster of faults close together counts against the manufacturer far more than the same number scattered across the screen.

Two things beat the pixel policy. The retailer's return window usually doesn't care *why* you're unhappy, and premium models are sometimes sold with an explicit zero-bright-dot or perfect-panel guarantee. Check both before accepting a refusal — the details are in [dead pixel warranty policies](/blog/dead-pixel-warranty-policies), and if you want to know how the fault appeared at all, see [what causes dead pixels](/blog/what-causes-dead-pixels).

Photograph and count every fault today, while the return window is still open.`,
  },
  {
    slug: "how-to-fix-a-stuck-pixel",
    title: "How to Fix a Stuck Pixel (4 Methods That Actually Work)",
    excerpt:
      "Flashing, the pressure method, and tapping — practical ways to revive a stuck pixel, how long to try each, and when to stop and claim warranty.",
    tags: ["stuck pixel", "fix", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `A stuck pixel is locked on one color, but unlike a dead pixel it often has power — which means you can sometimes shock it back to life.

## First, make sure it's actually stuck
A stuck pixel still receives power, so it shows a bright dot of red, green, blue, cyan, magenta, yellow or white that stays visible on dark backgrounds. A dead pixel receives nothing and stays black on every color, including a [White Screen](/white-screen). None of the methods below revive a dead pixel — the sub-pixel's transistor has failed and no amount of flashing or pressure changes that.

Run the [Dead Pixel Test](/dead-pixel-test) through all its solid colors before you start and note exactly what the dot does on each one. If it's black on every screen, skip straight to warranty. If it changes on some colors, it's stuck and worth working on. [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) walks through the distinction in detail.

Also rule out dirt. A speck of dust, a dried water spot, or a fleck of toothpaste looks exactly like a stuck pixel until you clean it. Wipe the area first — carefully, following [how to clean your screen safely](/blog/how-to-clean-your-monitor-safely) — and check whether the dot moves when you shift your head slightly. A mark on the outer coating shifts against the image; a real pixel never does.

## Method 1: Rapid color flashing
Cycling colors quickly over the stuck pixel exercises its sub-pixels. Open the [Dead Pixel Test](/dead-pixel-test), park the stuck pixel in view, and let fast color changes run for 10–30 minutes. This is the safest method — try it first.

If half an hour does nothing, it's still worth leaving the cycle running for a few hours, or overnight. Flashing carries no risk of damage, so the only cost is time and a little power. Disable sleep and screensaver settings first, otherwise the display will blank partway through and you'll come back to nothing having happened.

## Method 2: The pressure method
1. Power off the display.
2. Wrap a fingertip or a soft, blunt stylus in a microfiber cloth.
3. Apply **gentle** pressure exactly on the stuck pixel.
4. While holding, power on and load a [White Screen](/white-screen), then release.

Too much pressure creates *new* defects — be light. Push hard enough to see a faint ripple spread from your finger and you are already at the limit. Pressing harder than that can permanently damage the liquid crystal layer or crack the backlight diffuser, turning one stuck pixel into a large bright or dark patch that no warranty will treat kindly.

Do not use this method at all on an OLED phone, tablet, laptop or TV. OLED has no liquid crystal to reseat, so pressure achieves nothing and risks permanent mura — a dark bruise where you pressed. The same caution applies to any laptop with a very thin lid, where the panel sits directly against the backplate.

## Method 3: Tapping
With a white image displayed, lightly tap the stuck pixel area with a soft, rounded object. A few taps can reseat the liquid crystal. Keep the taps light and count them — five or six, then check the result, rather than drumming away for a minute.

## Method 4: Combine them
Flash colors *and* apply gentle pressure together for stubborn pixels. Start the color cycle, hold light pressure on the spot for ten seconds, release, and watch for two or three cycles. Repeat a handful of times.

## What not to try
- **Heat.** Warming the panel with a hairdryer risks delaminating the polarizing layers and voids most warranties.
- **Alcohol, solvents, or "pixel repair" liquids.** Nothing applied to the outside of the glass reaches the transistor inside.
- **Hard objects.** Pen caps, keys and phone corners concentrate force into a point and are the fastest way to create a permanent mark.
- **Paid apps.** Anything that claims to fix a pixel is doing the same color flashing you can run free here.

## How likely is this to work?
Be realistic. Flashing and gentle pressure revive some stuck pixels, usually ones that appeared recently, and do nothing at all for many others. A pixel that has been stuck since the day you unboxed the display is less likely to respond than one that appeared last week. There's no technique that reliably fixes them, and a pixel that comes back sometimes sticks again later.

## When to stop
If nothing changes after a few attempts over a day or two, the pixel is likely dead, not stuck. Don't keep pressing — check your [warranty options](/blog/dead-pixel-warranty-policies) instead. Photograph the defect against a solid color first, note the date, and check the manufacturer's pixel policy before you contact support: many count bright sub-pixels more strictly than dark ones, so a stuck pixel can qualify for replacement where a dead one wouldn't.

If the display is still inside a retailer's return window, returning it is almost always faster and more certain than a warranty claim — and far more certain than a fix.`,
  },
  {
    slug: "what-causes-dead-pixels",
    title: "What Causes Dead Pixels (and How to Avoid Creating Them)",
    excerpt:
      "Manufacturing defects, pressure, heat, and age all kill pixels. Here's what's actually in your control, and what makes a new one appear.",
    tags: ["dead pixel", "guide", "panel"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Each pixel has red, green, and blue sub-pixels driven by tiny transistors. When something interrupts that, the pixel fails. On an LCD the transistor either stops switching or sticks on; on an OLED the emitter itself stops producing light.

## Common causes
- **Manufacturing defects** — a faulty transistor from the factory. Most day-one dead pixels are this. Panel plants make millions of transistors per screen; a handful of failures per panel is expected and priced in, which is exactly why pixel warranties have thresholds instead of a zero-fault promise.
- **Physical pressure** — pressing hard on the panel, a tight laptop lid, or a heavy object in a bag. Pressure damages the liquid crystal layer or breaks the fragile connections behind it.
- **Heat and humidity** — extreme conditions degrade the liquid crystal and electronics. A car dashboard in summer easily exceeds the storage range most makers publish.
- **Age** — sub-pixels can fail gradually over many years, and the driver electronics age too.
- **Manufacturing dust** — sometimes mistaken for a dead pixel; it sits under the glass and doesn't change with color (test with the [White Screen](/white-screen)).

## What is not a dead pixel
Half of what people call a dead pixel turns out to be something else, and the fix is completely different:

- **A black dot on every color** — a dead pixel, or debris sitting under the glass. Rarely recoverable.
- **A bright white dot against black** — a hot (stuck-on) pixel. Sometimes recoverable.
- **A colored dot that changes as the frame changes** — a stuck sub-pixel. Often recoverable.
- **A dark blotch with soft edges** — a pressure mark, not a pixel fault at all. Sometimes fades on its own.
- **A speck that sits on the surface** — dust or dried spatter. Clean it off and it's gone.

Run a fingernail-free check first: cycle the [Color Test](/color-test) and see whether the dot changes. A true dead pixel is fixed dark on all frames. [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) has the full comparison, and if yours turns out to be stuck rather than dead, [How to Fix a Stuck Pixel](/blog/how-to-fix-a-stuck-pixel) is the one case with a decent success rate.

## How to avoid making more
- Never press hard on the screen — clean with a **dry or barely damp** microfiber cloth, and spray the cloth rather than the panel. [How to Clean Your Monitor or Laptop Screen Safely](/blog/how-to-clean-your-monitor-safely) covers what solvents actually attack the anti-glare coating.
- Don't stack heavy items on a laptop lid, and don't leave a pen, cable or earbud on the keyboard before closing it. That single habit causes more pressure marks than anything else.
- Carry a laptop in a padded sleeve, in a bag where it sits vertically against your back, not flat under books.
- Avoid leaving devices in hot cars, on radiators, or in direct sun on a windowsill.
- Let a cold device warm to room temperature before switching it on — condensation inside the panel stack is a real failure mode.
- Grip a monitor by its bezel or frame when moving it. Lifting a thin panel by the middle of its back flexes the whole stack.

## Does anything actually revive a dead pixel?
A genuinely dead pixel — no light, all frames, permanently — almost never comes back, because the transistor driving it has failed. What people succeed at fixing are **stuck** pixels, where the sub-pixel is frozen at one value rather than off. Rapid color-flashing software and very gentle pressure with a cloth over a soft object sometimes unstick those.

Two warnings. Hard pressure is how you turn one bad pixel into a permanent bruise across a dozen. And a fix that appears to work often unsticks on its own over the following days, so retest before you decide not to claim.

## What differs by panel type
- **IPS and TN LCDs** typically show dead pixels as a black dot, or a colored dot if one sub-pixel is out.
- **VA LCDs** behave similarly, but their deeper blacks make a bright hot pixel far more obvious.
- **OLED** has no backlight, so a failed pixel is truly black and can be nearly invisible on dark content while standing out on white. OLED also has a wear-related failure — [burn-in](/blog/oled-burn-in-and-how-to-check-for-it) — where static elements leave a faint permanent ghost. That is uneven wear, not a dead pixel, and no pixel-fixing routine touches it.

## Test regularly
Run the [Dead Pixel Test](/dead-pixel-test) when a device is new (while under warranty) and occasionally after — catching problems early gives you the most options. Do it again before any return window closes, before selling a device, and before buying a used one, where the seller's word is worth nothing and a two-minute check is worth a lot.`,
  },
  {
    slug: "dead-pixel-warranty-policies",
    title: "Dead Pixel Warranty Policies, Explained",
    excerpt:
      "How many dead pixels does it take to get a replacement? A practical look at ISO 9241 class limits and what each major manufacturer accepts.",
    tags: ["dead pixel", "warranty", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Frustratingly, a single dead pixel usually isn't enough for a free replacement. Manufacturers grade panels against a standard.

## The ISO 9241-307 standard
Displays are sorted into pixel-defect **classes**. The standard grew out of the older ISO 13406-2, and most manufacturer policies still echo its structure even when they don't cite it by name. Most consumer panels are **Class II**, which permits a small number of defects per million pixels:
- A handful of fully bright or dead pixels.
- A larger number of defective sub-pixels.

The standard splits faults into three types, and this matters more than the raw count:

- **Type 1 — a pixel permanently on.** Shows as a white dot on a black field, invisible on white.
- **Type 2 — a pixel permanently off.** Shows as a black dot on a white field, invisible on black.
- **Type 3 — a single sub-pixel stuck on or off.** Shows as a small red, green or blue dot, and is the type policies tolerate most.

Class I is the strict professional tier, allowing at most a token defect or two per million pixels. Class II — the consumer default — allows a few of each per million pixels, with sub-pixel faults tolerated most generously. Class III and IV are progressively looser and are essentially never used for retail displays.

So a 4K panel (approximately 8.3 million pixels) can have several "allowed" defects and still pass. Because the allowance is stated per million pixels, a literal reading gives a very large budget on a high-resolution panel. That's exactly why most brands publish their own fixed numbers instead — a flat "6 or more sub-pixel faults" style threshold regardless of resolution. **The number in your warranty document is the one that will be applied to your claim, not the number in the standard.** Find it before you argue.

## What this means for you
- **Bright/hot pixels** are treated more strictly than dark ones — they're more likely to qualify.
- **Clustered** defects (several close together) are often covered even when scattered ones aren't. A cluster is typically defined as multiple faults inside a small block of pixels, and many policies that shrug at six scattered dots will replace a panel over two adjacent ones.
- Position sometimes counts. A few policies apply a tighter threshold in the central zone of the screen than at the edges.
- Some premium brands and retailers offer a **zero bright-dot guarantee** — worth paying for if you're picky. These are usually time-limited (often to the first weeks or months) and sometimes sold as a paid add-on rather than included.

## Return window beats warranty, almost always
This is the single most useful thing to know. A retailer's return period is a contract about your satisfaction; a warranty is a contract about defects. Inside the return window you don't have to prove anything meets a class limit — you just send it back. Outside it, you're arguing pixel counts with a support agent reading a table.

So run [Dead Pixel Test](/dead-pixel-test) on day one, not month three. If you find anything at all and you're not certain you can live with it, act while the easy route is still open.

## Rule out the fixable faults first
Not every bad pixel is a dead pixel, and the difference changes what you should do next.

- A **dead** pixel is dark on every color and is not repairable.
- A **stuck** pixel shows one fixed color and sometimes recovers on its own or with a pixel-cycling routine.
- A speck of dust or a dried droplet under the anti-glare coating looks identical to a defect until you look at it off-axis.

[Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) walks through the identification, and [How to Fix a Stuck Pixel](/blog/how-to-fix-a-stuck-pixel) covers the methods that occasionally revive one. Try those before filing — a stuck pixel that clears itself is a claim you never have to make.

## Before you file a claim
1. Document the defect: photograph the screen on solid colors from the [Color Test](/color-test). Shoot a [White Screen](/white-screen) for dark pixels and a full black field for bright ones — each type is nearly invisible on the wrong background.
2. Note exactly where it is and on which colors it appears. Count the faults by type, because that's the vocabulary the policy uses. "Three type-3 sub-pixel faults, two of them adjacent" gets further than "some dots."
3. Check whether your seller has a better return policy than the maker's warranty — returning within the window is often easier than a warranty claim.
4. Turn off any dynamic contrast or local dimming mode before photographing, so the panel isn't dimming the area you're trying to show.

## Making the photo usable
Support rejects blurry phone shots constantly. Shoot in a dark room, wipe the screen first so dust isn't mistaken for the defect, hold the phone square to the panel, tap to focus on the screen surface, and lock exposure so the camera doesn't crush a bright dot into a white background. Include one wide shot showing the whole screen for position and one close crop. If the defect only appears on one color, send that color.

If the claim is refused and the pixel sits somewhere you'll notice for the next five years, price a panel replacement or resale before you decide to live with it — knowing the number makes the decision easier than staring at the dot every day.`,
  },

  // ---------- Color & calibration ----------
  {
    slug: "how-to-calibrate-your-monitor-without-a-colorimeter",
    title: "How to Calibrate Your Monitor Without a Colorimeter",
    excerpt:
      "Get noticeably better color and contrast by eye using built-in OS tools and test patterns — no hardware required, and no guesswork either.",
    tags: ["calibration", "color", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `A hardware colorimeter is most accurate, but you can get 80% of the benefit by eye in 15 minutes.

What you are actually doing here matters. By eye you can fix **brightness**, **contrast**, **black level**, **gamma**, and **white balance** — the things that make a screen look washed out, murky, or blue. You cannot fix **gamut** or measure **Delta E**, because your eyes have no reference to compare against. So the goal is a clean, neutral, consistent picture, not a certified one.

## 1. Warm up and set the environment

Let the monitor run for 20–30 minutes and dim harsh room lighting. Set the monitor to its **sRGB** or **Standard** preset to start from a sane baseline.

Kill anything that moves the target while you work: Night Light on Windows, Night Shift on macOS, f.lux, any ambient light sensor, and any "eco" or adaptive brightness mode. Turn off vendor picture enhancers too — dynamic contrast, black equalizer, sharpness above the neutral middle setting. Also reset any GPU-level adjustments in the NVIDIA, AMD, or Intel control panel back to default, so you are only changing one thing at a time.

Aim for a room that is dim but not dark. Judging a screen in a pitch-black room pushes you toward setting brightness far too low for daytime use.

## 2. Set brightness and contrast

Display a [White Screen](/white-screen). Lower brightness until it's comfortable, not glaring. A useful sanity check: hold a sheet of white paper next to the screen under your normal room lighting. When the paper and the screen look about equally bright, you are close. For most people in a normally lit room that ends up well below the factory default, which is set bright to survive a showroom rather than a desk.

Then use the [Greyscale Test](/greyscale-test) — raise contrast until the brightest steps are distinct but not blown out into pure white. If the top two or three steps merge into one flat white, contrast is too high and you are clipping highlight detail. Back it off until each step separates again.

## 3. Black level

On a [Black Screen](/black-screen), adjust brightness so near-black detail is visible without the black turning gray. The [Black Level Test](/black-level-test) makes this easier: it shows near-black patches that should be just barely distinguishable from the background. If the darkest few vanish completely, you are crushing shadows; if black looks like charcoal, you have gone too far the other way.

On most monitors the **brightness** control moves black level and the **contrast** control moves white, so these two steps interact. Expect to go back and forth once or twice.

## 4. Gamma and banding

Use the [Color Gradient Test](/color-gradient-test). A good setup shows a smooth ramp with no harsh bands and neutral grays (no green/magenta tint). Then run the [Gamma Test](/gamma-test) — most monitors offer gamma presets around 1.8, 2.0, 2.2, and 2.4, and **2.2** is the right default for general desktop and web work. [Gamma Explained](/blog/gamma-explained) walks through what you are actually looking at, and [What Is Color Banding and How Do You Reduce It?](/blog/what-is-color-banding-and-how-to-reduce-it) covers ramps that stay stepped no matter what you do.

## 5. Color temperature

Most people prefer ~6500K (warmer than default). If whites look blue, lower the color temperature or reduce the blue channel in the RGB gain settings.

Judge this against a real neutral reference, not from memory — white paper under daylight, or a sheet of printer paper under a lamp you actually use. Change one channel at a time in small steps, then walk away for a minute and come back. Your eyes adapt to a tint within seconds, which is exactly why by-eye white balance is the hardest step and the one a colorimeter beats you at most decisively. If the panel is warm in one corner and cool in another, no adjustment will fix it; see [Why Is Part of My Screen Discolored or Tinted?](/blog/why-is-part-of-my-screen-discolored).

## Windows and macOS specifics

Do as much as possible in the **monitor's own menu**, not in software. The monitor's controls change the panel itself; OS and GPU controls just remap the signal before it is sent, which throws away tonal steps and can introduce banding.

- **Windows:** search for **Calibrate display color** to open the built-in wizard. It walks through gamma, brightness, contrast, and color balance, and saves an ICC profile. It is crude, but it is fine for nudging a laptop panel that has no hardware menu of its own.
- **macOS:** open System Settings, then Displays, and use the color profile menu. Recent versions expose far fewer manual controls than older ones, and on a MacBook display there is no hardware menu at all, so brightness and reference mode are most of what you get.
- **Both:** an ICC profile is per-user and per-machine. If two people share the PC, or you plug the monitor into a different laptop, the profile does not travel with it. Panel-menu settings do.

## 6. Save it

Store the result as a custom preset so a menu bump doesn't undo your work. Photograph the final menu values with your phone as a backup, since a firmware update or factory reset will wipe them.

For color-critical work, a $100–200 colorimeter still pays off — but this gets you a clean, consistent picture for free. If your work is photo or print, read [How to Set Up a Monitor for Photo Editing](/blog/monitor-setup-for-photo-editing) and [Color Accuracy and Delta E, Explained](/blog/color-accuracy-and-delta-e-explained) before you decide whether measurement is worth the money.`,
  },
  {
    slug: "color-gamut-srgb-vs-dci-p3-vs-adobe-rgb",
    title: "Color Gamut Explained: sRGB vs DCI-P3 vs Adobe RGB",
    excerpt:
      "What gamut percentages on a spec sheet actually mean, how sRGB, DCI-P3 and Adobe RGB differ, and which one matters for the work you do.",
    tags: ["color gamut", "color", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `"99% sRGB" and "95% DCI-P3" describe how many colors a display can show. Here's how to read them — and when a bigger number actually makes your screen worse.

## What is a gamut?

A gamut is the range of colors a display can reproduce, plotted on a standard color space. Every color a screen can make comes from mixing its three primaries — red, green, and blue — so the gamut is the triangle those three primaries draw on a chromaticity diagram. Bigger triangle = more saturated, vivid colors are possible.

Two things follow from that, and both matter:

- A gamut says nothing about **accuracy**. A panel can cover 99% of sRGB and still show every color slightly wrong. That's a separate measurement — see [Color Accuracy and Delta E](/blog/color-accuracy-and-delta-e-explained).
- A gamut says nothing about **brightness or contrast**. Those are what make HDR look like HDR, which is why gamut alone is a poor HDR spec. [HDR Explained](/blog/hdr-explained) has the rest.

## The three you'll see

- **sRGB** — the web and most everyday content standard. Almost every photo, website, game, and SDR video you look at is authored for it. Aim for ~99–100% sRGB coverage.
- **DCI-P3** — a wider gamut used for HDR video and modern phones/laptops. It extends mainly into deep reds and greens. ~90%+ P3 looks noticeably richer on HDR movies and games.
- **Adobe RGB** — wide in the greens/cyans, used in **print** workflows because it maps better onto what CMYK ink can reproduce. Mostly relevant to photographers preparing for print.

There's also **Rec. 2020**, the target for future HDR video. No consumer display fully covers it — even the best OLED TVs measure in the 80–90% range — so treat any Rec. 2020 percentage on a spec sheet as a rough indicator rather than a promise.

| Space | Roughly what it's for | Sensible target |
|---|---|---|
| sRGB | Web, office, SDR games, most photos | 99–100% coverage |
| DCI-P3 | HDR film and TV, phone displays | 90%+ coverage |
| Adobe RGB | Photo editing headed for print | 95%+ coverage |

## Coverage vs volume

These two numbers get used interchangeably in marketing, and they are not the same thing.

- **Coverage**: how much of the target space the display actually reaches (e.g. 98% sRGB). This is the number you want. It can never exceed 100%.
- **Volume**: how big the panel's gamut is relative to the target. It can exceed 100% if the panel is *wider* than the target — extra saturation that isn't always useful.

A monitor advertised as "125% sRGB" is quoting volume. It might still only cover 96% of sRGB, because the parts it overshoots don't compensate for the parts it misses. If a listing gives you one number with no label, assume it's the flattering one.

## Why too-wide can hurt

A wide-gamut monitor with no sRGB clamp makes everyday sRGB content look **oversaturated**. Skin tones go sunburnt, red logos glow, and greens turn radioactive. This happens because most desktop applications send sRGB values straight to the panel without translating them, so a value that should be moderate red gets displayed as the panel's most saturated red.

Signs you're seeing it:

- Faces look flushed or orange in photos that look fine on your phone.
- Reds and greens in a browser look cartoonish next to the same page elsewhere.
- The effect is strongest on saturated colors and absent on greys.

The fix is the monitor's **sRGB mode** — a clamp that restricts the primaries back to the sRGB triangle. Use it for web and SDR work. On a good monitor the clamp is accurate and leaves brightness controls unlocked; on a cheap one it may lock brightness or shift the white point, which is worth checking before you buy.

macOS has largely solved this at the OS level: it is color-managed end to end, so sRGB content is translated correctly on a P3 display. Windows is only partly color-managed — some apps honor the display profile, many do not — which is why Windows users notice oversaturation far more often. If you're on Windows with a wide-gamut panel, the hardware sRGB mode is the reliable answer, not a software profile.

## Which one should you actually care about?

- **General use, office, browsing:** sRGB coverage only. Anything else is a bonus.
- **Video and gaming, especially HDR:** P3 coverage, alongside real contrast and brightness.
- **Photo editing for screen delivery:** high sRGB coverage plus low Delta E. See [How to Set Up a Monitor for Photo Editing](/blog/monitor-setup-for-photo-editing).
- **Photo editing for print:** Adobe RGB, and a hardware calibrator is no longer optional.

## Test it yourself

Run the [Color Test](/color-test) and [Color Gradient Test](/color-gradient-test) to eyeball saturation and smoothness — and check whether an sRGB mode tames over-vivid color. Switch modes with the same image on screen; a real clamp visibly pulls the reds and greens back.

While you're there, run the [Greyscale Test](/greyscale-test). A wide gamut is useless if the greys are tinted, and greyscale is where a bad white point shows up most clearly. If the steps look green or magenta, fix that first — [How to Calibrate Your Monitor Without a Colorimeter](/blog/how-to-calibrate-your-monitor-without-a-colorimeter) covers what you can do by eye, and where the eye stops being good enough.`,
  },
  {
    slug: "what-is-color-banding-and-how-to-reduce-it",
    title: "What Is Color Banding and How Do You Reduce It?",
    excerpt:
      "Those visible steps in a sky or gradient have several causes. Learn which come from the panel, which from the content, and how to reduce both.",
    tags: ["color banding", "color", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Banding is when a smooth gradient shows as distinct stripes instead of a seamless blend. Spot it instantly with the [Color Gradient Test](/color-gradient-test) and [Greyscale Test](/greyscale-test).

In real content it shows up in skies, studio backdrops, fades to black in end credits, smoke and fog effects, and the shadow falloff in dark game scenes. If a transition that should be continuous arrives in visible steps with hard edges between them, that's banding.

## How many colors you actually get
- **8-bit per channel** = 256 levels each of red, green and blue, or 16.7 million combinations. This is the desktop standard and it is just about enough to hide steps in most gradients.
- **10-bit per channel** = 1024 levels each, over a billion combinations. Noticeably smoother in dark gradients and in HDR, where the extra levels are stretched across a much wider brightness range.
- **6-bit + FRC** = 64 real levels per channel, with the panel alternating rapidly between two neighboring levels to simulate the missing ones. It works better than it sounds, but it can leave fine shimmer or residual steps in slow gradients.

Watch the marketing: a panel advertised as "16.7M colors" is often 6-bit + FRC, because the dithered output counts toward the total. A panel advertised as 1.07 billion colors is frequently 8-bit + FRC — a true 8-bit panel simulating 10-bit. Both are normal at their price points; neither is a defect.

## Why it happens
- **Panel bit depth** — true 8-bit shows 16.7M colors; cheaper **6-bit + FRC** panels dither to fake it and can band.
- **Output settings** — your GPU may be sending limited color depth or the wrong RGB range.
- **Chroma subsampling** — over a bandwidth-starved HDMI link the GPU may fall back to YCbCr 4:2:2 or 4:2:0, throwing away color resolution and coarsening gradients.
- **Content and compression** — heavily compressed video and images bake banding in; the display only reveals it.
- **Image processing** — night-light filters, monitor "dynamic contrast", and heavy-handed ICC profiles all re-map an already 8-bit signal into fewer usable levels.

## How to reduce it
1. **Set full color depth** in your GPU control panel (8-bit or 10-bit, RGB **Full** range). On NVIDIA it lives under Change resolution → Output color depth and Output dynamic range; on AMD under Display → Color Depth and Pixel Format; on Intel under Display → Quantization Range.
2. **Match the range** — set the display to Full/PC RGB if the GPU outputs Full, to avoid crushed or washed levels.
3. **Check the color format** is RGB or YCbCr 4:4:4, not 4:2:2. If the option is greyed out you are out of bandwidth: drop the refresh rate a step, switch to DisplayPort, or use a better-rated HDMI cable.
4. **Disable aggressive image processing** ("dynamic contrast" can worsen banding).
5. **Turn off OS color filters and night mode** while you judge, then decide whether the reduced blue light is worth the coarser gradients.
6. For media, use higher-bitrate sources; nothing fixes banding already encoded into a file.

On macOS there is no user-facing color-depth or RGB-range control — the system negotiates it. Over some HDMI adapters it settles on a YCbCr format that coarsens gradients; a direct DisplayPort or USB-C connection usually restores full RGB.

## Panel vs content
Run the gradient test with a clean local pattern (not a compressed video). If *that* bands, it's the panel/output chain. If only certain videos band, it's the content.

Two more discriminators worth knowing:

- **Banding only at the dark end**, with the brightest and darkest steps missing entirely, points at black level or gamma rather than bit depth. Confirm with the [Black Level Test](/black-level-test) and read [gamma explained](/blog/gamma-explained).
- **Banding that appeared after calibration** is usually the profile, not the panel. A profile built with a large correction has to redistribute a fixed number of levels. Reset to the default profile and compare — [how to calibrate without a colorimeter](/blog/how-to-calibrate-your-monitor-without-a-colorimeter) covers doing this with less damage.

## What is normal
Some banding is unavoidable. Every 8-bit gradient across a wide screen has fewer levels than it has columns of pixels, so a slow, wide fade will always step somewhere. HDR content is worse again, because those levels cover a far larger brightness range — mild banding in dark HDR skies is common even on very good displays. See [HDR explained](/blog/hdr-explained) for why.

What is not normal: hard, evenly spaced vertical bars on a locally generated 8-bit gradient with RGB Full set and all processing off, or a gradient that shifts color as it climbs (grey turning green in the midtones, say). That's the panel, and it is worth an exchange while you still can.

Set RGB Full and 4:4:4 first, then re-run the gradient test before you judge anything else.`,
  },
  {
    slug: "gamma-explained",
    title: "Gamma Explained: Why Your Shadows Look Wrong",
    excerpt:
      "Gamma controls how brightness is distributed between black and white. Here's how to check yours, why 2.2 is the standard, and how to set it.",
    tags: ["gamma", "calibration", "color"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Gamma describes the curve that maps input signal to displayed brightness. Get it wrong and images look washed out or crushed.

## The standard
Most content is mastered for **gamma 2.2** (sRGB). That's your target for general use.

The number is an exponent. A signal at 50% doesn't come out at 50% brightness — raised to the power of 2.2, it lands closer to 22%. That's deliberate: human vision is far more sensitive to changes in dark tones than bright ones, so the encoding spends more of its available steps down in the shadows where you can actually see them.

A few places use different targets. Movies mastered for a dark viewing room often follow a curve closer to 2.4, which deepens shadows in a blacked-out room but crushes them in daylight. Apple's Macs defaulted to 1.8 for years before switching to the 2.2 standard, which is why very old Mac-made images sometimes look dark on modern screens. Unless you have a specific reason otherwise, 2.2 is the right answer.

## What bad gamma looks like
- **Too low** (e.g. 1.8): images look flat, washed out, gray blacks.
- **Too high** (e.g. 2.6): shadows crush to black, picture looks contrasty and "muddy" in dark scenes.
- **Uneven**: fine in the midtones but wrong at one end — usually a sign of an aggressive picture mode or a bad calibration profile rather than the panel itself.

The everyday symptom is that dark scenes in films and games are unreadable, or that photos you edit look completely different on someone else's screen.

## How to check it
Run the [Gamma Test](/gamma-test) and find the patch that blends into the surrounding stripes — that number is your gamma. Cross-check with the [Greyscale Test](/greyscale-test): with correct gamma, the step from black to white looks evenly spaced — no big jump near the dark end and no detail vanishing into black. The mid-gray step should read as a believable middle, not near-white or near-black.

Three things make this reading much more reliable:

1. **Sit centered and square to the screen.** Gamma shifts with viewing angle, badly on TN panels and noticeably on VA. Check with the [Viewing Angle Test](/viewing-angle-test) — if the pattern changes as you lean, you have to judge gamma from dead center.
2. **Step back.** The gamma patch is a dithered pattern; up close you see the dither instead of the average tone.
3. **Use normal room lighting.** A screen judged in a dark room will end up set too bright for daytime use.

Also run the [Black Level Test](/black-level-test) and the [Contrast Test](/contrast-test) afterwards. Gamma set too high hides the darkest steps entirely; too low and the near-black steps separate but the whole image looks hazy.

## What throws gamma off
- **A picture preset.** Modes named Vivid, Dynamic, Movie, Game, sRGB or Cinema each apply their own curve. Some also enable dynamic contrast, which changes gamma continuously as the image changes — turn that off before measuring anything.
- **An ICC profile.** A profile left behind by a previous calibration, or one downloaded for a different unit of the same model, loads a gamma correction into the GPU at login.
- **GPU control panel settings.** Nvidia, AMD and Intel each expose their own gamma or digital vibrance sliders that stack on top of the monitor's own.
- **Night mode / blue light filters.** These shift white point and often gamma with it.
- **HDR mode.** HDR uses an entirely different transfer curve. If HDR is on but you're viewing normal content, everything will look wrong and no gamma setting fixes it — switch HDR off for SDR viewing.

## How to fix it
- Set your monitor's gamma preset to **2.2** if it has one. This is the best place to correct it, because it happens in the display rather than by throwing away signal levels in the GPU.
- On Windows, open Color Management, check the Advanced tab for a stale profile, then use the built-in display calibration wizard, which adjusts gamma by eye with a small hidden-dot pattern.
- On macOS, use the Display Calibrator Assistant, opened from the color-profile options in the Displays settings (holding Option as you launch it reveals the expert version with finer gamma controls).

Correct in the monitor first and in software second. Heavy software correction compresses the number of distinct levels being sent to the panel, which can introduce visible steps in gradients — check for that afterwards with the [Color Gradient](/color-gradient-test) test and see [what is color banding](/blog/what-is-color-banding-and-how-to-reduce-it) if you spot it.

For reference work, a colorimeter measures gamma precisely — but the greyscale pattern gets most people close. If you're setting up without one, the full by-eye routine is in [how to calibrate your monitor without a colorimeter](/blog/how-to-calibrate-your-monitor-without-a-colorimeter), and photo editors should also read [monitor setup for photo editing](/blog/monitor-setup-for-photo-editing) before trusting what they see.`,
  },
  {
    slug: "color-accuracy-and-delta-e-explained",
    title: "Color Accuracy and Delta E (ΔE), Explained",
    excerpt:
      "What ΔE numbers mean, what counts as 'good enough' for print and for web, and why accuracy matters more than vividness in creative work.",
    tags: ["color accuracy", "delta e", "color"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `For photo, video, and design, **accuracy** beats vividness. Delta E is how accuracy is measured.

## What is Delta E?
Delta E is the difference between a color the display *should* show and what it *actually* shows, expressed as a single number on a scale built to match human perception. Lower is better:
- **Under 1** — differences are imperceptible to the human eye (excellent).
- **1 to 2** — perceptible only on close comparison (very good, suitable for pro work).
- **2 to 3** — good for most uses.
- **Above 3** — visible errors; not ideal for color-critical work.

Treat those bands as the industry's rules of thumb rather than a standard — they're widely quoted, but different sources draw the lines in slightly different places. They come from the idea of a *just-noticeable difference*: the smallest change a person can see when two patches sit side by side, with no gap between them. Split the same two colors across a room and you'd never spot a Delta E of 2.

### Not all Delta E numbers are the same
There are several formulas, and the number depends on which one was used. The older CIE76 formula is a straight distance in Lab space and tends to exaggerate errors in saturated colors. The modern **Delta E 2000** formula corrects for how our eyes actually weight lightness, chroma and hue, and is what most review sites and calibration software report today, usually written as dE2000 or ΔE00. A panel quoted at "Delta E under 2" using one formula is not directly comparable to another quoted under a different one, so check which is being used before you compare two products.

## Average vs maximum
A panel can have a great *average* Delta E but one badly-off color (high *max* Delta E). If the average is 1.2 but one deep red reads 6, every image with that red in it is wrong — averages hide exactly the failure you care about. Check both on review sites, and look at which colors miss: skin tones and neutral greys matter far more in practice than a saturated cyan you'll rarely output.

## Accuracy vs gamut
- **Gamut** = the range of colors possible.
- **Accuracy** = how correct each color is within that range.

A wide-gamut panel with poor accuracy still shows wrong colors. Worse, a wide-gamut panel with no color management **oversaturates** everything: sRGB content stretched across a DCI-P3 panel makes skin look sunburnt and logos look radioactive. That's not a defect — it's the display doing what it was told. The fix is either an sRGB clamp mode in the monitor's on-screen menu or proper color management in the OS. [Color Gamut Explained: sRGB vs DCI-P3 vs Adobe RGB](/blog/color-gamut-srgb-vs-dci-p3-vs-adobe-rgb) covers which space you should be working in.

## What actually moves the number
Before you blame the panel, check the things you control:

1. **Picture mode.** Vivid, Dynamic, Game and Movie modes all deliberately distort color. Standard, sRGB or a mode explicitly labeled as calibrated is your starting point.
2. **Blue-light filters.** Night Light and Night Shift shift white balance heavily. Turn them off entirely for color work — see [Blue Light, Night Mode, and Color Temperature](/blog/blue-light-and-color-temperature).
3. **Brightness.** Extreme brightness or extreme dimness pushes most panels away from their calibrated point. A room-matched level, typically well below maximum for indoor work, is both more accurate and easier on your eyes.
4. **Warm-up.** Give an LCD several minutes before judging or measuring anything.
5. **The ICC profile.** A stale or wrong profile left over from another display will skew everything downstream.

## Where accuracy comes from
Panels drift with age and use, so a factory calibration report is a snapshot, not a permanent state. Hardware calibration with a colorimeter is the only way to get a real Delta E figure and the only way to correct one. Software-only "calibration" adjusts the graphics card's output curve using your eyes as the instrument — better than nothing, and covered in [How to Calibrate Your Monitor Without a Colorimeter](/blog/how-to-calibrate-your-monitor-without-a-colorimeter), but it cannot measure error.

Also fix the room. Accuracy judged under a warm bulb, a colored wall, or a window that changes all afternoon is guesswork. A neutral grey surround and steady lighting does more for consistent color decisions than a small Delta E improvement does. [How to Set Up a Monitor for Photo Editing](/blog/monitor-setup-for-photo-editing) goes through the whole setup.

## What you can check by eye
True Delta E needs a colorimeter, but the [Color Test](/color-test) reveals obvious tints, and the [Greyscale Test](/greyscale-test) shows whether grays stay neutral (a common accuracy failure). Add the [Gamma Test](/gamma-test) — a gamma that's off throws every mid-tone in an image, and it's a far more common cause of "my prints came out dark" than gamut ever is.

For client-facing color work, calibrate with hardware and re-check monthly, and re-check immediately after any driver update, OS upgrade, or change to the monitor's own settings.`,
  },
  {
    slug: "monitor-setup-for-photo-editing",
    title: "How to Set Up a Monitor for Photo Editing",
    excerpt:
      "Gamut, brightness, calibration, and room-lighting choices that keep your edits looking right on other people's screens and in print.",
    tags: ["photography", "calibration", "color"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Editing on an uncalibrated screen means your photos look different on every other device. Here's a reliable setup.

## Pick the right panel
- **IPS** for wide viewing angles and consistent color.
- **99%+ sRGB** minimum; **Adobe RGB** coverage if you print.
- True **8-bit or 10-bit** to minimize banding.

Viewing angle matters more than it sounds. On a large monitor at normal desk distance, the corners sit at a noticeably different angle to your eye than the centre does. A VA or TN panel shifts brightness and color across that spread, so a gradient that looks even in the middle is misjudged at the edges — and you end up correcting for the panel instead of the photo. That's the main reason editing advice keeps landing on IPS.

On gamut, wider is not automatically better. A wide-gamut panel running with no sRGB clamp makes every non-color-managed app — most browsers' UI, most games, the desktop itself — look oversaturated, which trains your eye wrong. If you work mostly for the web, use the monitor's **sRGB emulation mode** and calibrate in that. If you print, you want the Adobe RGB mode instead, because Adobe RGB holds the saturated cyans and greens that CMYK printers can reach and sRGB clips. [Color Gamut Explained](/blog/color-gamut-srgb-vs-dci-p3-vs-adobe-rgb) covers which space to work in.

Bit depth is about smoothness, not color range. An 8-bit panel gives 256 levels per channel; 10-bit gives 1024. Most "10-bit" consumer monitors are 8-bit plus frame rate control, which dithers between levels and works well enough in practice. Check for banding rather than trusting the spec sheet.

## Calibrate
A hardware colorimeter is strongly recommended for editing. Target:
- **Brightness:** approximately 120 cd/m² for a dim room (not max).
- **White point:** 6500K (D65).
- **Gamma:** 2.2.

Warm the monitor up for at least 30 minutes before you calibrate. Backlights drift while they come up to temperature, and a profile built on a cold panel is wrong by the time you're actually working.

Two flavors of calibration exist and they're not equivalent. **Software calibration** writes a correction curve into the GPU, which throws away some tonal levels to get there — fine, but it's why banding can appear after a heavy correction. **Hardware calibration**, supported on higher-end photo monitors, writes the correction into the display's own lookup table instead, leaving the GPU output untouched. If you're buying specifically for editing, that feature is worth more than another few percent of gamut.

If your prints come out consistently darker than the screen, your monitor is too bright, not your printer wrong. Drop toward 100 cd/m² and re-check. Only move your white point away from D65 if you're comparing against prints under a controlled viewing lamp whose temperature you actually know.

No colorimeter yet? Follow our [by-eye calibration guide](/blog/how-to-calibrate-your-monitor-without-a-colorimeter) as a stopgap. It gets gamma and grey neutrality roughly right, which is most of the practical benefit, but it cannot measure absolute color error. If you want to understand what "roughly right" costs you, [Color Accuracy and Delta E](/blog/color-accuracy-and-delta-e-explained) explains the scale — as a rule of thumb, an average error under about 2 is where most people stop being able to see the difference in a side-by-side.

## Control your room
- Use **neutral, dim** lighting — bright or colored light skews your perception.
- Avoid colored walls and desktop wallpapers behind your work; use a neutral gray.
- Keep the light behind or beside you, never reflecting off the panel, and use the same lighting every session. A window that goes from overcast to direct sun will change your edits more than any setting on the monitor.
- Don't edit against a bright white interface if your app offers a mid-grey one. Surrounding tone shifts how you judge exposure.

## Verify
- [Greyscale Test](/greyscale-test) — neutral grays, smooth ramp.
- [Brightness Uniformity Test](/brightness-uniformity-test) — even backlight so corners aren't misleading you.
- [Color Gradient Test](/color-gradient-test) — no banding in skies.
- [Gamma Test](/gamma-test) — confirm mid-tones land where 2.2 expects, so shadows aren't crushed or lifted.

Read the greyscale ramp specifically for tint: if the darker steps go blue and the lighter ones go warm, your white point is fine but the panel's grey tracking isn't, and only a proper profile will fix it. On uniformity, look for corners more than slightly darker than center — that's the thing that quietly makes you over-brighten one side of a portrait.

If you do find stepping in gradients, don't immediately blame the panel. Banding is often introduced by an aggressive calibration curve, a display set to 6-bit output, or heavy edits on an 8-bit file. [What Is Color Banding](/blog/what-is-color-banding-and-how-to-reduce-it) walks through where it actually comes from.

Re-calibrate every 4-6 weeks; panels drift as they age. Keep the old profiles rather than overwriting them — if a fresh calibration suddenly looks wrong, comparing against last month's is the fastest way to tell whether the panel moved or the measurement did.`,
  },
  {
    slug: "blue-light-and-color-temperature",
    title: "Blue Light, Night Mode, and Color Temperature",
    excerpt:
      "What color temperature does to your eyes and your color work, how night modes change it, and how to balance comfort against accuracy.",
    tags: ["color temperature", "eye strain", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Color temperature sets how warm (orange) or cool (blue) white looks on your screen.

It is measured in kelvin, and the scale runs backwards from what you would expect: higher numbers look colder and bluer, lower numbers look warmer and more orange. The number describes the color of the light itself, not how bright it is.

## The numbers

- **6500K (D65)** — the neutral standard for content and color work.
- **Below 6500K** — warmer, more orange; easier on the eyes at night.
- **Above 6500K** — cooler, bluer; looks "brighter" but harsher.

For reference, a candle is around 1900K, a warm household bulb around 2700K, and overcast midday daylight lands near 6500K — which is exactly why D65 was chosen as the reference white. Plenty of monitors ship noticeably cooler than 6500K out of the box, because a bluish white reads as "crisper" on a shop floor. That is a marketing choice, not a correct one — and it is why a new monitor so often looks harsh next to one you have already set up.

## Night modes

Features like Night Light (Windows), Night Shift (macOS/iOS), and f.lux warm the screen on a schedule to reduce blue light in the evening. They can ease eye strain and help some people sleep — but they **shift colors**, so turn them **off** for any color-critical editing.

Be honest about what the evidence supports. Bright light in the evening does suppress melatonin and push your body clock later, and that effect is real. But brightness and how long you look matter at least as much as the color of the light, and trials of blue-light filtering alone have produced mixed results. A dim, warm screen an hour before bed is a reasonable habit. Expecting a software toggle to undo two hours of scrolling at full brightness is not.

Also worth saying plainly: there is no good evidence that blue light from a normal screen damages your eyes. The tiredness you feel after a long session is **digital eye strain**, and it comes from blinking less, holding focus at one distance for hours, and glare — not from the spectrum.

## Eye-strain basics that matter more

Color temperature is a small factor. Bigger wins:

- Match screen brightness to the room (test extremes with [White](/white-screen) and [Black](/black-screen) screens). A screen much brighter than its surroundings is the single most common cause of evening eye strain.
- Follow the 20-20-20 rule (every 20 min, look 20 ft away for 20 s).
- Reduce glare and increase text size. Moving a lamp or turning the desk 90 degrees away from a window often does more than any setting.
- Blink deliberately. Blink rate drops sharply during focused screen work, which is why eyes feel dry and gritty rather than sore.
- Check for flicker. If a screen bothers you specifically at low brightness, the cause may be [PWM flicker](/blog/what-is-pwm-flicker) rather than color at all — a very common misdiagnosis.

## Where to set it in practice

Match the setting to the job, and switch between them rather than hunting for one compromise value.

| Situation | Setting |
| --- | --- |
| Photo, video, design, print work | 6500K, night mode off, every time |
| General daytime desktop work | 6500K, or slightly warmer in a warm-lit room |
| Evening reading and browsing | Warm preset or a gentle night mode, brightness down |
| Watching movies in a dark room | 6500K with the display dimmed, not warmed |

Two practical notes. Most monitors have named presets — **Warm**, **Normal**, **Cool**, **sRGB** — and on many panels the sRGB preset locks out other adjustments, so if it looks right, leave it alone. And if you use both a night mode and a monitor warm preset at once, you are stacking two warm shifts and the result will look distinctly orange.

## Verify your white

Load a [White Screen](/white-screen): it should look neutral, not blue or yellow, at your chosen setting.

Give it a moment before you judge. Your eyes adapt to a tint within seconds, so look away at a white wall or a sheet of paper, then back at the screen — the first impression is the honest one. Judging white against a real piece of paper under your normal room lighting is far more reliable than trusting memory.

Then check that white is neutral all the way down the tonal range with the [Greyscale Test](/greyscale-test). Grays that drift green in the shadows and pink in the highlights mean the panel's white balance is off, which no color-temperature preset will fix — that is a job for [calibration](/blog/how-to-calibrate-your-monitor-without-a-colorimeter).

If one region of the screen looks warmer or cooler than the rest, that is not a setting at all. It is a panel uniformity issue, and [Why Is Part of My Screen Discolored or Tinted?](/blog/why-is-part-of-my-screen-discolored) covers what causes it and whether it is worth a warranty claim.

Set it once for daytime, save a warmer preset for the evening, and stop fiddling — a stable reference you know is neutral is worth more than a setting you keep second-guessing.`,
  },

  // ---------- Motion & gaming ----------
  {
    slug: "refresh-rate-explained-60-vs-120-vs-144-vs-240",
    title: "Refresh Rate Explained: 60 vs 120 vs 144 vs 240Hz",
    excerpt:
      "What Hz actually means, where the jump from 60 to 144 is most noticeable, and how to confirm your screen runs at the rate you paid for.",
    tags: ["refresh rate", "gaming", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Refresh rate is how many times per second your display updates, measured in hertz (Hz). Higher = smoother motion. It is also the single spec most likely to be sitting at the wrong value on a screen you already own.

## What each tier feels like

- **60Hz** — standard for office and general use. A new image every 16.7ms.
- **120/144Hz** — a big, obvious jump; smoother scrolling, sharper motion, lower lag. A new image every 8.3ms or 6.9ms. The best value upgrade for most people.
- **240Hz+** — 4.2ms per frame. Smaller but real gains for competitive gaming; diminishing returns.

The jump from 60 to 120 roughly halves how long each frame sits still in front of your eyes, and that halving is what you perceive as clarity. Going from 120 to 240 halves it again — a real improvement, but you're chasing a much smaller absolute change, which is why the second upgrade feels far less dramatic than the first.

Where you'll notice it most, in order: dragging a window or scrolling a text page, fast camera movement in a first-person game, tracking a moving target, and the mouse cursor itself. Where you'll notice it least: film and most scripted TV, which are mastered at 24fps and won't look different regardless of your panel.

## The catch: you must enable it

A 144Hz monitor often defaults to 60Hz. After connecting:

- **Windows:** Settings → System → Display → Advanced display → choose the max refresh rate.
- **macOS:** System Settings → Displays → Refresh Rate.

Then confirm with the [Refresh Rate Test](/refresh-rate-test). If it reads 60 on a 144Hz panel, fix the OS setting or your cable. Our step-by-step walkthrough for both operating systems, including the cases where the option is missing entirely, is in [How to Enable Your Monitor's Full Refresh Rate](/blog/how-to-enable-full-refresh-rate-windows-mac).

Three things that commonly keep the high option hidden:

1. **You're plugged into the wrong port.** On a desktop with a graphics card, the display must connect to the card, not the motherboard's video output.
2. **Laptops with switchable graphics.** The external port may be wired to the integrated GPU, which can cap the rate.
3. **A per-game setting.** Many games have their own refresh rate or "display mode" option and will run at 60Hz in borderless windowed mode even when the desktop is at 144Hz.

## Frame rate vs refresh rate

Your GPU must also *produce* enough frames. A 144Hz screen showing a 60fps game updates at 144Hz but only shows 60 new frames — pair a high-refresh panel with adaptive sync (see our [tearing guide](/blog/screen-tearing-vsync-gsync-freesync)).

Without adaptive sync, a frame rate that doesn't divide evenly into the refresh rate produces either tearing or stutter, depending on whether V-Sync is on. Confirm what you're seeing with the [Screen Tearing Test](/screen-tearing-test): a horizontal split that slides up or down the screen is tearing, and it's a sync problem, not a panel fault.

Adaptive sync — G-Sync on Nvidia, FreeSync on AMD, and VESA Adaptive-Sync on both — makes the monitor wait for the GPU instead of the other way round. It has to be enabled in two places: the monitor's own menu, and the driver control panel. Turning it on in only one is a very common miss.

## Refresh rate is not the whole story

Two more specs decide whether high refresh actually looks clean:

- **Pixel response time.** If the pixels can't finish changing in the time a frame is on screen, you get smeared trails behind moving objects. At 144Hz each frame lasts 6.9ms, so a slow panel simply cannot keep up. Check yours with the [Ghosting Test](/ghosting-test) and read [What Is Ghosting and How Do You Fix It?](/blog/what-is-ghosting-and-how-to-fix-it).
- **Input lag.** A different thing entirely, often confused with response time — [Response Time vs Input Lag](/blog/response-time-vs-input-lag) separates them.

Overdrive settings interact with refresh rate too. An overdrive level that looks clean at 144Hz can produce bright **inverse ghosting** trails at 60Hz, so if you switch rates, re-check the setting.

For the sharpest possible motion, some monitors add backlight strobing (marketed as ULMB, DyAc, or similar). It cuts blur further than raw refresh rate can, at the cost of brightness — [Motion Blur Reduction: BFI, ULMB, and Backlight Strobing](/blog/motion-blur-reduction-bfi-ulmb) covers the trade-offs.

## Cable and bandwidth

High refresh at high resolution needs DisplayPort or high-speed HDMI 2.1. An old cable is a common reason the rate caps out.

Rough guidance:

| What you're driving | Usually needs |
|---|---|
| 1080p at 144Hz | DisplayPort, or HDMI 2.0 |
| 1440p at 144Hz | DisplayPort 1.2 or better, or HDMI 2.0 |
| 4K at 120Hz+ | HDMI 2.1, or DisplayPort 1.4 with DSC |

Cables are not all equal even when the connector is identical. An HDMI cable that came bundled with an older device may only be rated for HDMI 2.0 speeds, and it will happily show a picture at 60Hz while refusing 120Hz. If the high refresh option vanishes when you raise the resolution, bandwidth is the suspect — try a lower resolution to confirm before buying anything.

If the option appears, is selected, and the [Refresh Rate Test](/refresh-rate-test) still reports the old number, the change didn't stick: reselect it, unplug and replug the cable, and check that no docking station or KVM sits in the path — those cap bandwidth more often than the cable does.`,
  },
  {
    slug: "what-is-ghosting-and-how-to-fix-it",
    title: "What Is Ghosting and How Do You Fix It?",
    excerpt:
      "Trails behind moving objects come from slow pixels — and the cure, overdrive, can overshoot into inverse ghosting. Here's how to balance it.",
    tags: ["ghosting", "response time", "gaming"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Ghosting is a smeared trail behind moving objects, caused by pixels changing color too slowly.

Every LCD pixel takes time to twist its liquid crystal from one state to another. If a frame lasts 16.7ms at 60Hz but the pixel needs 20ms to finish the transition, the old image is still partly on screen when the new one arrives — and you see the leftover as a trail.

## See it first
Run the [Ghosting Test](/ghosting-test). Watch the moving blocks:
- A faint **trail** behind the object = ghosting (pixels too slow).
- A bright **fringe or inverse trail** = overshoot (overdrive too aggressive).

Look at the trailing edge specifically, and track the block with your eyes rather than staring at a fixed point — a trail you can only see while your eyes are locked to the background is usually persistence blur, not ghosting.

## The fix: overdrive
Monitors include an **overdrive** (a.k.a. Response Time, OD, TraceFree, Overshoot) setting that pushes pixels to switch faster.
1. Find it in your monitor's OSD. Manufacturers all name it differently — TraceFree on ASUS, AMA on BenQ, Over Drive on Acer, Response Time on LG and Samsung.
2. Step through the levels while watching the [Ghosting Test](/ghosting-test).
3. Pick the level with the **least trailing and no obvious overshoot** — usually the middle setting, not the maximum.

Overdrive works by briefly overvolting the pixel so it reaches the target faster. Push it too hard and the pixel overshoots past the target before settling, which is what produces the bright halo or dark corona ahead of and behind moving edges. Overshoot is more distracting than mild ghosting, so when in doubt, back off one level.

## Ghosting vs blur vs double images
These get lumped together and have completely different fixes.

- **A soft colored trail behind moving edges** — slow pixel transitions. Raise overdrive a step and run at a higher refresh rate.
- **A bright halo *ahead of* the edge** — overdrive overshoot. Lower the overdrive level.
- **The whole image soft while your eyes track it** — sample-and-hold persistence. Higher refresh rate, or backlight strobing.
- **Two distinct offset copies of the object** — TV motion interpolation, or a failing cable or signal. Turn off motion smoothing, then swap the cable.

Persistence blur is the one people most often mistake for ghosting. It happens because the panel holds each frame static for the whole refresh interval while your eyes keep moving, and it affects the entire frame equally rather than leaving a trail behind one object. [Motion blur reduction: BFI, ULMB, and backlight strobing](/blog/motion-blur-reduction-bfi-ulmb) covers the strobing techniques that actually address it.

## Other factors
- **Refresh rate:** higher Hz shortens the time each frame is shown, reducing perceived blur. Confirm you are actually running at your panel's maximum — many monitors default to 60Hz when first plugged in. Check with the [Refresh Rate Test](/refresh-rate-test) and fix it with [how to enable your monitor's full refresh rate](/blog/how-to-enable-full-refresh-rate-windows-mac).
- **Panel type:** VA panels ghost more in dark transitions; TN and good IPS are faster. OLED transitions are effectively instant, so an OLED that looks blurry in motion is showing persistence blur, not ghosting. [IPS vs VA vs TN vs OLED](/blog/ips-vs-va-vs-tn-vs-oled) breaks down the trade-offs.
- **VA black smearing:** dark-to-dark transitions are the slowest — judge overdrive using the dark rows of the test.
- **Temperature:** LCD response slows when the panel is cold. A monitor that smears for the first few minutes after switching on and then settles is behaving normally.
- **Advertised response time:** the 1ms figure on the box is a best-case grey-to-grey measurement on the fastest transition, often with maximum overdrive engaged. It tells you very little about the dark transitions where ghosting is actually visible.

## Variable refresh rate complicates it
With G-Sync or FreeSync active, the refresh rate moves constantly, and the overdrive strength that is correct at 144Hz is too strong at 60Hz. Monitors with variable overdrive adjust automatically; most do not. If you use VRR and your frame rate swings a lot, pick the overdrive level that behaves acceptably at the *bottom* of your frame-rate range rather than the top, since that is where overshoot does the most damage.

The "best" overdrive can change with refresh rate, so re-check if you switch between 60Hz and your panel's max.

## When it is a defect
Ghosting is a characteristic, not usually a fault — every LCD has some. Treat it as a defect only if the trail is severe at the monitor's advertised refresh rate with overdrive optimally set, or if it appeared suddenly on a display that used to be clean. If it is one persistent smear in a fixed area of the screen rather than following moving objects, that's image retention rather than ghosting, and a full-screen solid color will show it far more clearly than a motion pattern.

Set your refresh rate first, then tune overdrive at that rate — doing it in the other order wastes the effort.`,
  },
  {
    slug: "response-time-vs-input-lag",
    title: "Response Time vs Input Lag: They're Not the Same",
    excerpt:
      "One is how fast pixels change; the other is how long until your click reaches the screen. Both affect how a display feels, in different ways.",
    tags: ["input lag", "response time", "gaming"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `These two specs get mixed up constantly. They measure different things.

## Response time (pixels)
How long a pixel takes to change color, in **milliseconds (ms)**, usually gray-to-gray (GtG). Slow response → **ghosting/blur**. Test it visually with the [Ghosting Test](/ghosting-test). "1ms" claims are best-case; real-world is often higher.

The reason marketing numbers and real behavior diverge so much is that GtG is not one number. A panel changes between dozens of different shade pairs, each at its own speed, and manufacturers are free to quote the fastest transition at the most aggressive overdrive setting. Dark transitions are usually the slowest, which is why a monitor rated 1ms can still smear badly in a dark game scene.

You'll also see **MPRT** quoted in milliseconds. That's a different thing again — it describes how long a frame is held in front of your eye, not how fast the pixel changes. A low MPRT figure almost always assumes backlight strobing is switched on. More on that in [motion blur reduction](/blog/motion-blur-reduction-bfi-ulmb).

### Overdrive, and its trap
Overdrive pushes extra voltage at a pixel to make it change faster. Set too high, it overshoots the target shade and leaves a bright halo trailing the object — **inverse ghosting**, which looks worse than the blur it was meant to fix. Most monitors label it Overdrive, Response Time, Trace Free or OD, with settings like Off / Normal / Fast / Extreme.

Find your best setting empirically: run the [Ghosting Test](/ghosting-test), step through each overdrive level, and pick the one just below where light halos appear. The right level often changes with refresh rate, so re-check after changing that.

### What differs by panel type
| Panel | Typical motion behaviour |
| --- | --- |
| TN | Fastest transitions, weakest colors and viewing angles |
| IPS | Fast enough for most gaming; some dark-transition smear |
| VA | Strong contrast, noticeably slow on dark-to-dark — the classic "black smear" |
| OLED | Near-instant pixel transitions; remaining blur comes from persistence, not response |

[IPS vs VA vs TN vs OLED](/blog/ips-vs-va-vs-tn-vs-oled) covers the wider trade-offs.

## Input lag (system)
The delay between an input (mouse/keyboard) and the result showing on screen. It's the sum of:
- Mouse polling and USB delay.
- Game engine and render time.
- Display processing (scaler, image enhancements).

High input lag makes a game feel "floaty" even at high frame rates.

The largest and most fixable chunk for most people is display processing. TVs are the worst offenders: motion interpolation, noise reduction and upscaling all buffer frames before showing them, and that buffering is exactly what Game Mode disables. On monitors the processing is lighter but still real, especially if the input signal needs scaling to fit the panel's native resolution.

Frame rate matters too, and independently. At 30 frames per second, a frame exists for over 30ms before the next one can replace it, so no monitor setting makes that feel responsive. Raising frame rate lowers the average wait for a fresh frame.

## How to reduce input lag
- Enable the monitor's **Game Mode** (it bypasses image processing).
- Turn off dynamic contrast, motion smoothing, and noise reduction.
- Use a wired mouse with a high polling rate.
- Cap your frame rate slightly below your refresh rate when using V-Sync, or use adaptive sync.
- Run the display at its **native resolution**, so nothing has to be scaled.
- Confirm the panel is actually running at its rated refresh rate — plenty of monitors ship set to 60Hz. See [how to enable your full refresh rate](/blog/how-to-enable-full-refresh-rate-windows-mac) and verify with the [Refresh Rate Test](/refresh-rate-test).

Traditional V-Sync adds the most lag of any common setting because frames wait for the next refresh. Adaptive sync — G-Sync or FreeSync — avoids most of that while still removing tearing; [screen tearing, V-Sync, G-Sync and FreeSync](/blog/screen-tearing-vsync-gsync-freesync) explains which combination to use, and the [Screen Tearing Test](/screen-tearing-test) shows whether yours is working.

## Telling them apart in practice
Both problems ruin motion, but they feel different, and the distinction points at different fixes.

- **Trails behind moving objects, blur on text while scrolling, smearing in dark scenes** — that's response time. Adjust overdrive; see [what is ghosting and how to fix it](/blog/what-is-ghosting-and-how-to-fix-it).
- **The image is sharp but the cursor or the aim feels like it's dragging behind your hand** — that's input lag. Chase Game Mode, processing settings, sync settings and frame rate.

A quick way to separate them: move the mouse in circles on the desktop. If the cursor looks clean but arrives late, you have lag. If it smears, you have slow pixels.

## Bottom line
Fast response = clearer motion. Low input lag = more responsive feel. For competitive play you want **both** — and a high [refresh rate](/refresh-rate-test) on top. If you're deciding how much refresh rate is worth paying for, [60 vs 120 vs 144 vs 240Hz](/blog/refresh-rate-explained-60-vs-120-vs-144-vs-240) puts the differences in order.`,
  },
  {
    slug: "screen-tearing-vsync-gsync-freesync",
    title: "Screen Tearing, V-Sync, G-Sync, and FreeSync Explained",
    excerpt:
      "Why a frame splits across your screen mid-motion, and which sync technology — V-Sync, G-Sync or FreeSync — fixes it without adding input lag.",
    tags: ["screen tearing", "vsync", "gaming"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Tearing is a horizontal split where the top and bottom of the image are from different frames. It's most visible when you pan the camera sideways: a straight vertical edge — a doorframe, a lamppost, a wall — appears broken and offset partway down the screen.

## Why it happens
Your GPU and monitor run on independent clocks. The monitor redraws the image at a fixed rate, top to bottom. If the GPU hands it a new frame partway through that redraw, the top of the screen keeps showing the old frame while the bottom shows the new one — a visible tear at the boundary.

It's worst when frame rate and refresh rate are mismatched, and it happens both above and below the refresh rate. At 200fps on a 60Hz monitor you may get several tear lines on screen at once. At 45fps on a 60Hz monitor you get one that drifts slowly down the screen, which many people find more distracting.

## The fixes
- **V-Sync** — makes the GPU wait for the monitor's next refresh before swapping frames. Stops tearing but adds **input lag**, and when the frame rate dips below the refresh rate it can halve the presented rate (60 to 30), producing obvious stutter.
- **Fast Sync / Enhanced Sync** — a variant that renders freely and shows only the most recent complete frame. Tear-free with less lag than V-Sync, but only works well when the frame rate is far above the refresh rate.
- **Adaptive sync (G-Sync / FreeSync / VESA Adaptive-Sync)** — the *monitor* varies its refresh rate to match the GPU's frame rate in real time. Smooth, tear-free, and **low lag**. This is the modern answer.
- **A frame-rate cap** — on its own, capping just below the refresh rate reduces how often tears appear and keeps latency low. Combined with adaptive sync, it's the standard setup.

## Getting adaptive sync working
1. Confirm the monitor supports it and enable it in the OSD. Many panels ship with it off, and some hide it under a name like Adaptive-Sync or VRR.
2. Enable G-Sync/FreeSync in your GPU control panel — NVIDIA and AMD both keep it in their display or gaming settings, though the exact menu name moves between driver versions. Enable it for both fullscreen and windowed mode if the option exists.
3. Use a cable and port that can carry it at your resolution and refresh rate. DisplayPort is the safest choice on a PC; HDMI 2.1 is what you want on a console or TV, where the feature is usually listed as **VRR** and often needs enabling per-input alongside a game or enhanced-format setting.
4. Stay within the monitor's variable-refresh **range** (for example 48 to 144Hz). Below the range, behavior falls back — many displays use low framerate compensation, which repeats frames to keep the panel inside its range. Many people enable V-Sync in the driver too, only to catch frames above the range, and then cap the frame rate a few frames below the maximum so V-Sync never actually engages.
5. Check the game is running in fullscreen or borderless with the OS compositor cooperating. Windows handles VRR in windowed mode on modern versions, but some titles still only get it exclusively fullscreen.

If enabling it produces flicker on dark loading screens or in menus, that's a known behavior on some panels when the frame rate swings wildly — a frame cap usually settles it.

## Tearing that isn't a game
Tearing while scrolling a web page or dragging a window points somewhere else: a stale or wrong-refresh display mode, a browser with hardware acceleration disabled, or on a laptop a mismatch between the integrated and discrete GPU. Start by confirming the OS is actually driving the panel at its rated rate — see [How to Enable Your Monitor's Full Refresh Rate (Windows & Mac)](/blog/how-to-enable-full-refresh-rate-windows-mac) if it isn't obvious in display settings.

macOS composites everything and does not tear on the desktop the way Windows can, so persistent desktop tearing on a Mac usually means an external display running an odd mode or a hub or adapter in the chain.

## Tearing vs stutter vs ghosting
These get mixed up constantly, and the fixes have nothing in common:
- **Tearing** — the image splits horizontally. Sync problem.
- **Stutter** — motion hitches while the image stays whole. Frame pacing or performance problem.
- **Ghosting** — a faint trail follows moving objects. Pixel response problem, covered in [What Is Ghosting and How Do You Fix It?](/blog/what-is-ghosting-and-how-to-fix-it).
- **Input lag** — the picture is smooth but the controls feel late. Different measurement entirely; see [Response Time vs Input Lag](/blog/response-time-vs-input-lag).

## Verify motion
Watch a tear appear and vanish as you toggle sync with the [Screen Tearing Test](/screen-tearing-test). Confirm your true refresh with the [Refresh Rate Test](/refresh-rate-test) and check trailing with the [Ghosting Test](/ghosting-test) once sync is on — turning on adaptive sync changes the effective refresh rate constantly, and some panels overshoot on their overdrive setting when it does.`,
  },
  {
    slug: "how-to-enable-full-refresh-rate-windows-mac",
    title: "How to Enable Your Monitor's Full Refresh Rate (Windows & Mac)",
    excerpt:
      "Bought a 144Hz monitor but it still feels like 60? It probably is. Here's the two-minute fix in Windows and macOS, plus the cable to check.",
    tags: ["refresh rate", "windows", "macos"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `New high-refresh monitors frequently default to 60Hz. The hardware is fine — the setting isn't.

This happens because the operating system picks a mode it knows is safe for whatever cable and port it detects, and never revisits the choice. Nothing warns you. The monitor's own on-screen menu often reports the incoming signal, which is the fastest way to confirm you're being shortchanged before you touch any settings.

## Windows 10/11
1. Settings → **System** → **Display**.
2. **Advanced display**.
3. Under **Choose a refresh rate**, pick the highest value.
4. If the max isn't listed, see "If it's missing" below.

Two things people miss here. First, with more than one monitor connected, the refresh rate applies **per display** — use the picker at the top of Advanced display to select the right one and set each individually. Second, on laptops, Windows 11's dynamic refresh rate and battery saver can both hold the internal panel at a lower rate while unplugged. Test on mains power before concluding anything is broken.

## macOS
1. System Settings → **Displays**.
2. Click **Refresh Rate** and choose the highest option (on some displays, holding **Option** while clicking the **Scaled** resolution options reveals additional modes).

On some external monitors the available rates depend on which resolution you've selected, so set the resolution first, then look at the refresh menu again. On Apple laptops with ProMotion, the built-in display shows an **Adaptive** option — that's correct and should be left alone; it ramps to the panel maximum when content demands it.

## Confirm it worked
Open the [Refresh Rate Test](/refresh-rate-test). It should read close to your panel's rating (a 144Hz panel typically measures approximately 143-144).

A small shortfall is normal. Browsers measure frame delivery, so a reading a fraction under the rated number just means the timing isn't perfectly exact. A reading of 60 when you asked for 144, or 120 when you asked for 240, is a real problem. If the number bounces around wildly, close background apps and video playback and try again — screen recording software and hardware-accelerated video can both pin the measurement down.

## If the high rate is missing
- **Cable/port:** high refresh at high resolution needs DisplayPort or HDMI 2.1. Swap a cheap or old cable.
- **Bandwidth:** dropping resolution or color depth may unlock a higher rate — check your cable's spec first.
- **GPU drivers:** update them and set the rate in the NVIDIA/AMD/Intel control panel too.
- **Adaptive sync:** enable G-Sync/FreeSync so the rate tracks your frame rate.

### The bandwidth question, concretely
Refresh rate, resolution and color depth all draw from one budget. Exceed it and the mode simply doesn't appear in the list.

- **HDMI 2.0** (18 Gbps) — enough for 4K at 60Hz, or 1440p at high refresh. Not enough for 4K at 120Hz.
- **DisplayPort 1.2** (21.6 Gbps) — comfortable at 1440p 144Hz, 8-bit; the common ceiling on older GPUs.
- **DisplayPort 1.4** (32.4 Gbps) — reaches 4K at 120Hz and beyond once compression is in play.
- **HDMI 2.1** (48 Gbps) — 4K at 120Hz with 10-bit color, no compression needed; the port consoles rely on.

Treat those ceilings as rough guidance rather than guarantees: the exact mode a pair of devices will negotiate also depends on color depth, chroma subsampling and whether both ends implement the optional parts of the spec.

**Display Stream Compression (DSC)** lets DisplayPort 1.4 and HDMI 2.1 carry modes that wouldn't otherwise fit. It's visually lossless in practice, but both the GPU and the monitor have to support it, and some monitors expose it as a menu option under a name like DSC or a numbered DisplayPort version — turn it on if a mode you expect is missing.

Turning on HDR or 10-bit color eats bandwidth too. If the 144Hz option vanishes the moment you enable HDR, that's the budget, not a fault.

### Other things that quietly cap you
- A DisplayPort cable that isn't certified for the version it claims. Cheap cables fail at high bandwidth by dropping to a lower mode or blanking intermittently.
- A dock or KVM in the chain. Many pass through less bandwidth than the ports at either end — connect directly to the GPU to test.
- A laptop where the HDMI port is wired to the integrated GPU while the discrete GPU drives only the internal panel.
- Windows scaling and resolution set to something non-native, which can expose a different mode list.
- Long HDMI runs. Beyond a few meters, passive high-bandwidth cables get unreliable.

## Once it's actually running
A correct refresh rate changes what your other tests mean. Motion clarity is now a panel property rather than a settings mistake, so re-run the [Ghosting Test](/ghosting-test) to judge overdrive, and use the [Screen Tearing Test](/screen-tearing-test) to check whether your sync setup is doing its job. If tearing appears, [Screen Tearing, V-Sync, G-Sync, and FreeSync](/blog/screen-tearing-vsync-gsync-freesync) explains which option to use for your hardware.

Wondering whether the jump was worth it at all, or whether the next step up would be? [Refresh Rate Explained: 60 vs 120 vs 144 vs 240Hz](/blog/refresh-rate-explained-60-vs-120-vs-144-vs-240) covers what each tier actually buys you.

Set the rate, verify it in the test, then check your games and video players separately — some apps carry their own refresh setting and will happily run at 60 on a 144Hz desktop.`,
  },
  {
    slug: "motion-blur-reduction-bfi-ulmb",
    title: "Motion Blur Reduction: BFI, ULMB, and Backlight Strobing",
    excerpt:
      "How black frame insertion and backlight strobing sharpen motion, what they cost you in brightness and flicker, and whether to turn them on.",
    tags: ["motion blur", "bfi", "gaming"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Even with fast pixels, sample-and-hold displays blur motion because each frame is held static while your eyes track movement. Strobing fixes that differently than overdrive.

That distinction is the whole point. **Overdrive** attacks pixel transition speed — the smear you see when a pixel takes too long to change color. **Strobing** attacks **persistence** — the blur your own eye creates while it slides smoothly across a picture that is standing still. A perfect 0ms panel would still blur on a sample-and-hold display, which is why a fast IPS monitor can look sharp in a review chart and still smear in a fast pan.

## How it works

**Backlight strobing** (NVIDIA **ULMB**, generic **MBR**, or **BFI** on TVs/OLEDs) flashes the backlight or inserts black frames between images. Your eye sees sharp, distinct frames instead of a smeared hold — motion looks CRT-clear.

The number that matters is how long each frame is actually visible. At 60Hz a frame is held for about 16.7ms; at 120Hz, 8.3ms; at 240Hz, 4.2ms. Halve the hold time and you roughly halve the perceived blur. Strobing cheats that curve: instead of leaving the image up for the full frame, it lights the panel for a small slice of it, so a 120Hz screen can show motion as cleanly as a much faster one. That is why strobing can beat a higher refresh rate for pure clarity — and why the two are solving the same problem from different ends. [Refresh Rate Explained](/blog/refresh-rate-explained-60-vs-120-vs-144-vs-240) covers the non-strobed side.

## The trade-offs

- **Lower brightness** — strobing is dark because the panel is "off" part of the time. Expect to lose a large fraction of peak brightness; on some monitors it is roughly half or worse. Newer implementations recover some of it by driving the backlight harder during the flash, but none are free.
- **No adaptive sync (usually)** — strobing and G-Sync/FreeSync often can't run together. A handful of monitors advertise a combined mode, and quality varies a lot between them.
- **Flicker** — sensitive users may notice it, especially at lower strobe rates. Strobing at 60Hz is genuinely uncomfortable for many people; at 120Hz and above it is far easier to live with. If you get headaches from it, stop — this is the same mechanism behind [PWM flicker](/blog/what-is-pwm-flicker).
- **Fixed refresh** — best at one specific rate the manufacturer tuned. Run the panel at any other rate and the tuning falls apart.
- **Strobe crosstalk** — a faint double image, usually strongest near the top or bottom of the screen, where the flash catches pixels mid-transition. Some panels have a tuning menu (strobe phase or pulse width) that lets you move the clean band to the middle of the screen where you look.
- **A little extra lag** — the flash has to wait for the panel to finish refreshing, which adds a small delay. Usually a fraction of a frame, but it is not zero. See [Response Time vs Input Lag](/blog/response-time-vs-input-lag).

## Should you use it?

- **Fast competitive games at locked high frame rates:** great — try it. Cap your frame rate to exactly the strobed refresh rate so every frame gets one flash.
- **Variable frame rates / single-player:** adaptive sync is usually the better pick. If your frame rate wanders, strobing produces uneven double-images and stutter, and you will hate it. [Screen Tearing, V-Sync, G-Sync, and FreeSync Explained](/blog/screen-tearing-vsync-gsync-freesync) covers that choice.
- **HDR or bright-room use:** skip it. You cannot afford the brightness.
- **Movies and TV:** BFI at 120Hz on an OLED can look excellent for sports; at 60Hz it usually flickers too much to be worth it.

### Setting it up

1. Set the monitor to the refresh rate its strobe mode is tuned for, and confirm it is actually running there with the [Refresh Rate Test](/refresh-rate-test).
2. Turn the strobe mode on in the monitor's OSD (names vary wildly: ULMB, MBR, MPRT, ELMB, DyAc, Aim Stabilizer, Motion Blur Reduction).
3. Turn adaptive sync off if the monitor demands it.
4. Cap frame rate to the refresh rate in-game or in the driver.
5. Re-tune overdrive, then re-check.

## Check the result

Run the [Ghosting Test](/ghosting-test) with strobing on and off — the trailing should shrink noticeably when it's working. Re-tune **overdrive** for the strobed mode; the ideal setting often differs.

Watch the top, middle, and bottom of the moving object separately. A clean middle with doubled edges top and bottom is classic crosstalk, and that is what the strobe tuning controls are for. If the trail gets worse rather than better, overdrive is now overshooting — [What Is Ghosting and How Do You Fix It?](/blog/what-is-ghosting-and-how-to-fix-it) explains the inverse-ghosting look to watch for.

Finally, judge it in a real game, not just a test pattern. Strobing is a trade of brightness and flexibility for clarity, and only you can decide whether the sharper pan is worth the dimmer picture.`,
  },

  // ---------- Panel technology ----------
  {
    slug: "ips-vs-va-vs-tn-vs-oled",
    title: "IPS vs VA vs TN vs OLED: Which Panel Should You Get?",
    excerpt:
      "Color, contrast, response speed and viewing angles compared across all four panel types, with the right pick for gaming, work and movies.",
    tags: ["panel", "ips", "oled"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Panel technology decides most of what you'll notice day to day — contrast, viewing angles, motion clarity, and whether the screen will still look right in five years. Here's the honest comparison.

## TN

- **Pros:** cheapest, historically fastest, high refresh.
- **Cons:** poor viewing angles, weak color.
- **Best for:** budget competitive gaming. Increasingly replaced by fast IPS.

TN panels shift color badly the moment your eye moves off-centre, and vertically the shift is severe — the bottom of a large TN screen can look visibly darker than the top from a normal seating position. Contrast is typically the lowest of the four types. If you're buying new today, a fast IPS at the same price is usually the better screen.

## IPS

- **Pros:** excellent color and wide viewing angles; modern "fast IPS" rivals TN speed.
- **Cons:** "IPS glow" in dark corners; contrast lower than VA.
- **Best for:** all-rounders, creative work, most gaming.

IPS is the safe default. Colors hold steady off-axis, which matters if two people share the screen or if you use a large or curved panel where the edges are at an angle to your eyes. The weakness is blacks: in a dark room a black screen looks dark grey, and the corners take on a silvery sheen that moves as you move. That sheen is **IPS glow**, and it is a characteristic of the technology, not a defect — [What Is IPS Glow](/blog/what-is-ips-glow) explains how to tell it apart from actual backlight bleed.

## VA

- **Pros:** high native contrast and deep blacks (great for movies).
- **Cons:** slowest pixel transitions → dark "black smear" ghosting; color/gamma shift off-axis.
- **Best for:** dark-room movie watching, single-player gaming.

VA's contrast advantage over IPS is large — typically several times higher, which is immediately obvious on a night scene in a dark room. The trade-off is the dark transitions: moving from black to dark grey is the slowest thing a VA pixel does, so shadow detail smears behind moving objects even on a high-refresh VA. Overdrive helps with the bright transitions and does very little for the dark ones. VA also shows a gamma shift off-axis: sit slightly off-centre and dark areas wash out.

## OLED

- **Pros:** per-pixel light = perfect blacks, infinite contrast, near-instant response.
- **Cons:** burn-in risk with static content; lower full-screen brightness; price.
- **Best for:** movies, HDR, and gaming if you manage static elements.

Each pixel makes its own light, so black pixels are simply off. Response times are in the fraction-of-a-millisecond range, which makes motion cleaner than any LCD at the same refresh rate. The costs are real, though: a full white screen is dimmer than on a good LED-backlit panel because power is limited across the whole panel, and static bright elements — a taskbar, a game HUD, a spreadsheet grid — can wear their pixels unevenly over time. Modern panels fight this with pixel shifting and automatic refresh cycles, and [OLED Burn-In: Causes, Prevention, and How to Check](/blog/oled-burn-in-and-how-to-check-for-it) covers what actually works.

If you want OLED-like contrast without the burn-in worry, Mini-LED backlights are the LCD answer — brighter, but with blooming halos around bright objects on dark backgrounds. [Mini-LED vs OLED](/blog/mini-led-vs-oled) is the direct comparison.

## Quick comparison

| | Contrast | Viewing angles | Motion | Burn-in risk |
|---|---|---|---|---|
| TN | Lowest | Poor | Fast | None |
| IPS | Low–medium | Excellent | Fast (modern) | None |
| VA | High | Medium | Slow in darks | None |
| OLED | Effectively infinite | Excellent | Fastest | Real, manageable |

## Picking by what you do

- **Office, coding, mixed work in a bright room:** IPS. Angles and color consistency matter more than contrast when the lights are on.
- **Competitive shooters:** fast IPS, or OLED if the budget allows. TN only if price is the deciding factor.
- **Films in a dark room:** VA or OLED. IPS glow is at its most annoying exactly here.
- **Photo and video editing:** IPS, and check color accuracy separately — panel type doesn't guarantee it.
- **A screen that shows the same static interface all day:** avoid OLED, or accept that you'll need to manage it.

## Test whatever you buy

Off-axis shift — the clearest giveaway between TN, VA and IPS: [Viewing Angle Test](/viewing-angle-test). Contrast and black depth: [Contrast Test](/contrast-test) and [Black Screen](/black-screen). Glow and bleed: [Backlight Bleed Test](/backlight-bleed-test). Motion: [Ghosting Test](/ghosting-test).

Run these in the order that matches the return window, not the order above: uniformity and pixel faults first, because those are hard defects you can send a screen back for, then the technology-specific behaviour, which is what you're choosing to live with. On a used OLED, add the [Burn-in Test](/burn-in-test) before anything else. The full sequence for a screen that just arrived is in [The Complete New-Device Screen Test Checklist](/blog/new-device-screen-test-checklist).`,
  },
  {
    slug: "what-is-backlight-bleed",
    title: "What Is Backlight Bleed and Is It Normal?",
    excerpt:
      "Light leaking around the edges of an LCD is common, but not always acceptable — when to shrug it off, and when it's grounds for a return.",
    tags: ["backlight bleed", "lcd", "panel"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Backlight bleed is light from an LCD's backlight escaping unevenly around the panel edges, visible as cloudy patches on dark content.

## See it
In a dark room at full brightness, open the [Backlight Bleed Test](/backlight-bleed-test) (a pure black field) and inspect the edges and corners.

Give your eyes two or three minutes to adapt to the dark first — bleed always looks worse in the first thirty seconds. Sit at your normal viewing distance, not with your nose against the bezel, and judge with your eyes rather than through a phone camera. A long-exposure photo brightens everything and routinely makes a perfectly acceptable panel look unusable.

## Why it happens
The backlight sits behind or along the edge of the panel and has to be blocked by layers of diffuser, polarizer and liquid crystal. Any gap in that stack lets light out where it shouldn't. Typical causes:

- **Assembly pressure** — a bezel or frame clamped slightly too tight distorts the layer stack at that point.
- **Edge-lit designs** — LEDs along one edge push light sideways across the whole panel, so leaks concentrate near that edge.
- **Transport and handling** — a knock in shipping can shift the stack.
- **Heat cycling** — layers expand at different rates, which is why bleed sometimes changes slightly over the first weeks.

None of this is something you caused, and it is entirely a panel-lottery outcome: two identical units off the same line can differ considerably.

## Is it normal?
Some bleed is normal — LCDs are lit from behind and can't seal perfectly. It becomes a *problem* when:
- It's bright enough to notice during normal dark-scene viewing (movies, games).
- It's heavily concentrated in one corner.
- It looks like distinct flashlight beams rather than faint, even glow.

A useful practical test: play an actual dark scene at your normal brightness, in your normal room lighting. If you cannot see the bleed under those conditions, it will not bother you. A black test field at maximum brightness in a blacked-out room is a diagnostic, not a viewing condition.

## Bleed vs IPS glow vs clouding
- **Bleed:** visible **head-on**; doesn't move with your head. A panel/assembly issue.
- **IPS glow:** a silvery sheen in corners that **shifts as you move**. Normal for IPS — see our [IPS glow guide](/blog/what-is-ips-glow).
- **Clouding (mura):** irregular blotches spread across the middle of the panel rather than the edges. Best seen on a dark grey field rather than pure black.

The head-movement check settles bleed versus glow in seconds: lean left and right, then up and down. Glow moves and changes intensity, bleed stays exactly where it is. [Backlight bleed vs IPS glow](/blog/backlight-bleed-vs-ips-glow) walks through the comparison in more detail, and the [Viewing Angle Test](/viewing-angle-test) makes the angle dependence obvious. For blotchy mid-panel unevenness, the [Brightness Uniformity Test](/brightness-uniformity-test) is the right pattern.

## What you can do
- Lower brightness — bleed scales with backlight intensity. Dropping from 100% to a more typical 30-40% for dark-room use often removes the complaint entirely.
- Add a bias light behind the screen. Raising the ambient level slightly reduces your eyes' sensitivity to faint edge glow, and it is easier on your eyes anyway.
- Gently flex the bezel; sometimes assembly pressure is the cause (do this carefully).
- Check the display isn't being squeezed by a monitor arm clamp, a tight laptop case, or a screen protector pressing on the edges.
- Leave it alone for a couple of weeks before deciding. Mild bleed frequently settles as the panel heat-cycles.

Do not loosen the bezel screws or dismantle the housing. It voids the warranty and rarely helps.

## When to return it
If it's severe, it's a valid reason to exchange the unit. Judge it against three questions: does it show during ordinary content, is it in more than one area, and would you notice it if nobody had told you to look?

Timing matters more than argument. Manufacturer warranties often treat mild bleed as within specification, because there is no pixel-style standard for it — but a retailer's return window generally does not require you to prove a defect. Decide within that window. If you exchange, test the replacement the same way immediately, and be prepared for it to be different rather than better.

OLED has **no** backlight and therefore no bleed. Mini-LED backlights split the light into hundreds or thousands of independently dimmed zones, which suppresses bleed but introduces blooming around bright objects instead — the trade-off is covered in [Mini-LED vs OLED](/blog/mini-led-vs-oled).

Run the black field once at your normal brightness before you decide anything — that is the only result that reflects how you will actually use the screen.`,
  },
  {
    slug: "what-is-ips-glow",
    title: "What Is IPS Glow (and How to Reduce It)?",
    excerpt:
      "That silvery corner shine on IPS panels is a viewing-angle effect rather than a defect — how to tell it from bleed, and how to reduce it.",
    tags: ["ips glow", "ips", "panel"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `IPS glow is a characteristic glow — often silvery, blue, or amber — in the corners of IPS panels when showing dark content.

## How to identify it
On a [Black Screen](/black-screen) in a dark room, move your head around. If the glow **changes or fades as your viewing angle changes**, it's IPS glow. If it stays put head-on, it's [backlight bleed](/blog/what-is-backlight-bleed) instead.

Do the test properly or you'll misread it:

1. Turn the room lights off and give your eyes a few minutes to adjust — glow looks dramatically worse in the first thirty seconds than it does once your eyes settle.
2. Set brightness where you actually use it, not at 100%.
3. Sit at your normal distance, then lean left, right, up and down.
4. Judge with your eyes, not a phone camera. Long exposures amplify dim light enormously, and a photo that looks alarming often corresponds to something you can't see in person.

Glow moves. It brightens in the corner you lean away from and shrinks toward the corner you lean into. Bleed doesn't move at all. If you see both — most IPS monitors show both — assess them separately: [backlight bleed vs IPS glow](/blog/backlight-bleed-vs-ips-glow) puts them side by side.

## Why it happens
It's inherent to how IPS liquid crystals pass light at an angle. **Every** IPS panel has some — it's not a defect.

The panel blocks the backlight to make black, and that blocking works best when you look at the pixel straight on. The corners of a screen are, by geometry, the parts you view at the steepest angle — so they leak the most. Sit closer and the corner angles get steeper still, which is why the same monitor looks worse on a shallow desk. A larger screen at the same distance also shows more glow than a smaller one for exactly this reason.

The amount varies between individual units of the same model, so two identical monitors bought together can look different. That's manufacturing variation, not a fault in one of them.

## How to reduce it
- **Sit centered and back** — glow is worst when you're close and off-axis.
- **Lower brightness** for dark-room use.
- **Add bias lighting** behind the monitor; raising ambient light hides the glow.
- **Raise the monitor** so your eyes are near screen center.
- **Tilt the top of the screen slightly toward you**, so the vertical angle across the panel is more even.
- **Choose a curved screen** if you sit close — curvature reduces the angle at which you view the edges.
- **Clean the panel.** A hazy coating scatters glow and makes it look worse. Follow [how to clean your monitor safely](/blog/how-to-clean-your-monitor-safely) — never spray liquid onto the screen.

What won't help: raising contrast, changing color temperature, or installing a different driver. Glow is an optical property of the panel, so nothing in software touches it.

## Things people mistake for IPS glow
- **Backlight bleed** — fixed bright patches or streaks at the edges, unchanged by head movement. Confirm with the [Backlight Bleed Test](/backlight-bleed-test).
- **Clouding** — uneven mottled patches across the middle of the screen, often from panel pressure or overtightened assembly. Check with the [Brightness Uniformity Test](/brightness-uniformity-test).
- **Blooming** — a halo around bright objects on a dark background, which appears on backlights with local dimming, such as Mini-LED. It follows the bright object around the screen rather than sitting in the corner. Use the [Blooming Test](/blooming-test) to confirm, and see [Mini-LED vs OLED](/blog/mini-led-vs-oled).
- **A dark patch instead of a bright one** — that's a different problem entirely; see [why does my screen have a dark spot](/blog/why-does-my-screen-have-a-dark-spot).

## Is it covered by warranty?
Usually not. Because glow is inherent to the technology, manufacturers treat it as normal panel behavior rather than a defect, while severe bleed is sometimes accepted. Your realistic option is the retailer's return window: if the glow bothers you in the first two weeks, return or exchange while you still can, rather than waiting and filing a claim later.

## If glow bothers you
Consider **VA** (higher contrast, no IPS glow but slower) or **OLED** (perfect blacks, no glow) for dark-room movie and gaming setups. VA has its own quirk — a dark halo or gamma shift when viewed off-center — and OLED trades glow for a burn-in risk worth understanding first: [OLED burn-in](/blog/oled-burn-in-and-how-to-check-for-it). The full comparison is in [IPS vs VA vs TN vs OLED](/blog/ips-vs-va-vs-tn-vs-oled).

Before you replace anything, though, spend a week with bias lighting behind the screen and brightness set for the room. That fixes the complaint for most people.`,
  },
  {
    slug: "mini-led-vs-oled",
    title: "Mini-LED vs OLED: Which Is Better for You?",
    excerpt:
      "Brightness and burn-in resistance versus perfect blacks and zero blooming — the real trade-offs between Mini-LED and OLED, and who each suits.",
    tags: ["mini-led", "oled", "panel"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Both are premium display technologies, but they solve different problems. One controls light per pixel; the other controls it per zone, and everything else follows from that.

## OLED
Each pixel makes its own light and can turn fully off.
- **Pros:** perfect blacks, infinite contrast, no blooming, near-instant pixel response, wide viewing angles.
- **Cons:** lower sustained full-screen brightness; **burn-in** risk from static elements; price.

The brightness caveat is worth understanding. OLED panels hit very high peak brightness on a small highlight — a streetlight, a reflection, a sun — but an automatic brightness limiter pulls the level down when a large part of the screen is bright, such as a snow scene or a white document. That's why an OLED can look stunning with HDR film and merely fine as an all-day spreadsheet monitor in a sunlit room.

Response time is the other headline. OLED pixels change state almost instantly, so motion looks clean without the overdrive tuning LCDs need. There's no overshoot, no inverse ghosting, and no smearing in dark scenes — the specific weakness of VA LCD.

## Mini-LED (LCD with many dimming zones)
A traditional LCD lit by thousands of tiny LEDs grouped into local-dimming zones.
- **Pros:** very high brightness, sustained across the whole screen (great for bright rooms and HDR highlights); **no burn-in**; usually cheaper at a given size.
- **Cons:** **blooming** — halos around bright objects on black, because a zone lights more than the object. Slower pixel response than OLED, and it inherits the viewing-angle behavior of whatever LCD panel type sits underneath.

Zone count is the number that matters, and it varies enormously between models — from a few hundred on budget sets to several thousand on flagships. More zones means each one is smaller, so the halo around a bright object is tighter. But zone count alone doesn't tell you the whole story: the dimming algorithm decides how aggressively zones dim and how fast they react, and a conservative algorithm can trade visible blooming for crushed shadow detail instead.

Also check which LCD panel type is under the Mini-LED backlight. A VA-based Mini-LED starts from a much higher native contrast, so blooming is less pronounced, but it shifts more off-axis. An IPS-based one holds color better from the side but relies more heavily on the dimming to make blacks look black. [IPS vs VA vs TN vs OLED](/blog/ips-vs-va-vs-tn-vs-oled) explains the underlying panel differences.

## See blooming for yourself
On a Mini-LED display, run the [Blooming Test](/blooming-test): a bright dot on black reveals the halo. More zones = smaller halo. Move the dot and watch for a second effect — zones lagging behind, so the halo trails or pulses as things move. Subtitles on a dark scene are the classic real-world case: white text on black is exactly the content that lights up a zone far bigger than the text itself.

On an OLED there is no halo at all, and this test simply shows a dot on true black.

## Burn-in, honestly
Burn-in is uneven wear, not a sudden failure. It comes from static bright elements shown for long periods — a channel logo, a game HUD, a taskbar, a spreadsheet's header row. Modern OLEDs fight it with pixel shifting, logo dimming, and compensation cycles that run when the screen goes idle, and typical mixed viewing rarely produces visible retention. The risk rises with a fixed, high-brightness, unchanging image, which is why static desktop use is the scenario people worry about.

Practical mitigation: hide the taskbar, use a dark theme, lower brightness, let the panel run its compensation cycle instead of yanking the power, and set a short screen blank. Check for it periodically with the [Burn-in Test](/burn-in-test), and read [OLED Burn-In: Causes, Prevention, and How to Check](/blog/oled-burn-in-and-how-to-check-for-it) for the full routine.

Mini-LED has no equivalent risk. An LCD's backlight dims evenly over years rather than leaving an image behind.

## Choosing
- **Dark-room movies and best contrast:** OLED.
- **Bright room, HDR brightness, static content (productivity, long hours):** Mini-LED.
- **Fast competitive gaming:** OLED for motion clarity, unless you'll leave a static HUD on screen for hours every day.
- **Mixed family TV in a sunny living room:** Mini-LED.

Check blacks on either with the [Black Screen](/black-screen), and compare how much near-black shadow detail survives with the [Black Level Test](/black-level-test) — an aggressive local-dimming algorithm can look impressively black while quietly swallowing the detail just above black. Then check off-axis behavior with the [Viewing Angle Test](/viewing-angle-test), which is where the two technologies diverge most for anyone watching from a sofa rather than dead center. If HDR is the reason you're upgrading, [HDR Explained](/blog/hdr-explained) covers what a panel actually needs to deliver it.`,
  },
  {
    slug: "oled-burn-in-and-how-to-check-for-it",
    title: "OLED Burn-In: Causes, Prevention, and How to Check",
    excerpt:
      "OLED panels can retain static images over time. Here's what causes burn-in, how to avoid it, and how to spot it early while it's still fixable.",
    tags: ["oled", "burn-in", "tv"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `OLED delivers perfect blacks, but static content can wear pixels unevenly and leave a permanent ghost ("burn-in").

## What causes it
Each OLED sub-pixel ages as it's used. Elements that stay on screen for hundreds of hours — taskbars, channel logos, game HUDs — wear faster, leaving a faint outline.

The mechanism is straightforward: an OLED pixel makes its own light from an organic emitter, and that emitter dims slowly with every hour it's driven. Two pixels that have lived different lives no longer match at the same input signal. The blue emitter degrades fastest of the three, which is why worn areas often read as a warm or yellowish patch rather than simply a dim one.

Three factors decide how fast this happens:

- **Brightness.** Wear scales steeply with drive current. A panel run at maximum brightness ages far faster than the same panel at a comfortable indoor level.
- **Time on one image.** Static beats bright. A dim taskbar for eight hours a day does more damage than a bright movie for two.
- **Color.** Large areas of saturated blue or white push the blue emitter hardest.

Panel type matters too. WOLED televisions add a white sub-pixel and drive the color filters less hard; QD-OLED uses quantum dots to convert blue light. Both approaches are far more resistant than early OLEDs, and both still wear. [Mini-LED vs OLED](/blog/mini-led-vs-oled) covers the choice if you're weighing this risk before buying, and [IPS vs VA vs TN vs OLED](/blog/ips-vs-va-vs-tn-vs-oled) puts it next to the LCD alternatives.

## How to check
Run the [Color Test](/color-test) and step through solid colors, then view a 50% gray field via the [Brightness Uniformity Test](/brightness-uniformity-test). Burn-in shows as a faint outline of logos or bars where static content used to be — gray makes it easiest to see.

Work through more than one grey level. A mid grey exposes most wear, but a darker grey field and a dim full white each reveal different amounts, so step through a ramp with the [Greyscale Test](/greyscale-test) rather than judging from a single slide. Do it in a dark room, from directly in front, with any dynamic brightness or picture-optimizer mode switched off — those features can mask exactly the difference you're hunting.

What you're looking for is a shape you recognize: the outline of a taskbar along the bottom, a rectangle where a channel logo sat, the ammo counter from a game you played for a season. Random blotches without a recognizable edge are more likely panel uniformity or dirty-screen effect than burn-in.

A [Black Level Test](/black-level-test) is worth running alongside, because on OLED it separates two things that look similar: uneven wear shows on bright fields, while near-black performance stays essentially perfect even on a worn panel.

## How to prevent it
- Lower brightness for static content.
- Enable **pixel shift**, screen savers, and **logo dimming** — our [screensaver](/screensaver) works for this if the panel has none built in.
- Hide the taskbar/dock; auto-hide menu bars.
- Vary content; don't leave a paused game or news ticker on for hours.
- Run the panel's built-in **pixel refresh/compensation** cycle.
- Use dark mode in apps you keep open all day, and set a short display-sleep timeout — a screen that turns itself off after ten idle minutes is the cheapest protection there is.
- On a desktop OLED, move the taskbar to auto-hide and avoid a fixed bright wallpaper behind icons in the same spot every day.

About those refresh cycles: most sets run a short compensation pass automatically when you power down after several hours of use, which is why you shouldn't pull the plug the instant the picture goes off. A longer, more thorough cycle is usually offered manually in the settings menu and takes considerably longer. Use the long one sparingly — it's a maintenance tool, not a daily habit.

Check the warranty terms before you buy, too. Burn-in was historically excluded as "normal wear," but several manufacturers now cover it explicitly for a limited period. That clause is worth reading in full rather than assuming either way.

## Burn-in vs temporary retention
Run the [Burn-in Test](/burn-in-test) to make faint retention visible: a full-screen solid color exposes outlines you would never notice in normal use. Brief **image retention** fades on its own after varied content. **Burn-in** is permanent. If an outline persists across many different images, it's burn-in — modern panels resist it far better than early OLEDs, but managing static elements still matters.

The practical test is time. Play varied full-screen video for an hour or two, or run the panel's compensation cycle, then check the same grey field again. Retention will have faded or vanished. Burn-in will be exactly where you left it.

If it is burn-in, nothing you run will remove it — the emitters are worn, not stuck. What you can do is stop it getting worse: drop brightness, kill the static elements that caused it, and get the compensation cycle running regularly. Photograph the grey field now so you have a dated reference to compare against in six months, and check your warranty terms while the evidence is fresh.`,
  },
  {
    slug: "what-is-pwm-flicker",
    title: "What Is PWM Flicker and How Do You Test for It?",
    excerpt:
      "Many screens dim by flickering the backlight faster than you can consciously see — but your eyes may still feel it. Here's how to test yours.",
    tags: ["pwm", "flicker", "eye strain"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `PWM (pulse-width modulation) is a common way displays control brightness: instead of lowering power, they switch the backlight **on and off** very fast. Lower brightness = longer "off" periods.

The reason it exists is that LEDs do not dim gracefully. Feed an LED less current and its color shifts and its output becomes hard to control precisely. Flashing it at full power and varying how long it stays on sidesteps both problems, and it is cheap. The alternative, **DC dimming**, lowers the current instead — steadier light, harder and more expensive to keep accurate at low levels.

Two numbers decide whether you will notice: the **frequency** (how many times per second it cycles) and the **duty cycle** (what fraction of each cycle the light is on). High frequency and a shallow off period are effectively invisible. A few hundred cycles per second with long off periods is the combination that causes trouble.

## Why it matters

Even when the flicker is too fast to consciously see, some people get **headaches, eye strain, or fatigue** from PWM, especially at low brightness where the off periods are longest.

This is not imaginary and it is not universal. Your visual system processes flicker well above the rate at which you can consciously perceive it, which is why a screen can look perfectly steady and still leave you with a dull ache after an hour. The tell is the pattern: symptoms that appear on one specific device, get worse as you turn the brightness down, and disappear on a different screen in the same room.

If a screen only bothers you at night, PWM is a strong suspect — that is exactly when you dim it. People often blame [color temperature](/blog/blue-light-and-color-temperature) instead and change the wrong setting.

## How to test for it

- **Pencil/finger test:** wave a pen quickly in front of a bright [White Screen](/white-screen). Smooth blur = likely flicker-free; multiple crisp "ghost" images = PWM flicker. Count the ghosts: more, closely spaced copies mean a higher frequency, which is generally less troublesome than a few widely spaced ones.
- **Phone camera:** point a slow-motion or regular camera at the screen and lower brightness — visible scrolling bands suggest PWM. The slowest slow-motion mode your phone offers makes it much clearer. Be careful here: your phone's rolling shutter can produce bands from a perfectly steady screen at some shutter speeds, so compare against a screen you already know is flicker-free before you trust the result.
- Repeat at **low brightness**, where PWM is most aggressive. Many displays are flicker-free above roughly half brightness and switch to PWM below it, so a test at 100% proves nothing.

Test in a dark room, and test the screen you are actually worried about rather than a store demo unit running at maximum brightness.

## What flickers, and what usually doesn't

| Display type | Typical behavior |
| --- | --- |
| OLED phones | Very commonly PWM, including flagships; often the worst case at low brightness |
| Budget LED monitors and laptops | Mixed — many use PWM, some low-frequency |
| Monitors marked "flicker-free" | DC dimming or high-frequency PWM; usually fine |
| Older CCFL-backlit LCDs | Often steadier than cheap LED dimming, but not guaranteed |
| E-ink readers with a frontlight | Some models use PWM on the light, not the panel |

Note that OLED and LCD flicker differently. On an LCD only the backlight pulses, so the effect is uniform. On OLED each pixel is its own light source, and dark scenes at low brightness are where sensitive users notice it most.

## How to avoid the symptoms

- Look for **"flicker-free"** or **DC dimming** displays. Treat the label as a starting point, not a guarantee — some panels are flicker-free only above a certain brightness.
- Raise brightness (and tame it with software/ambient light) — higher brightness shortens off periods. Raising the panel to a comfortable hardware level and dimming the room, or reducing perceived brightness with a dark theme, is often the whole fix.
- On OLED phones, some offer a **high-frequency PWM** or DC-dimming mode. Look in the display or accessibility settings; the wording varies by manufacturer.
- Add bias lighting behind the screen. A lamp behind the monitor lets you run the panel higher without it feeling glaring.
- If a laptop is the problem, an external monitor you have tested is the cheapest real solution.

### Ruling out the other suspects

Before you blame PWM, check the simpler causes. Glare and a screen much brighter than the room cause far more eye strain than flicker does. A loose or failing cable can produce visible flicker at a much slower, obvious rate — that is a connection fault, not dimming. And if the flicker only appears in games, look at motion features like backlight strobing instead, covered in [Motion Blur Reduction: BFI, ULMB, and Backlight Strobing](/blog/motion-blur-reduction-bfi-ulmb). A quick pass with a [Black Screen](/black-screen) and a [White Screen](/white-screen) at several brightness levels will tell you which one you are dealing with.

If you're flicker-sensitive, prioritize flicker-free certification when buying — and test any new screen at low brightness within the return window, because it is the one specification you cannot judge from a spec sheet alone.`,
  },
  {
    slug: "ppi-and-pixel-density-explained",
    title: "PPI and Pixel Density: How Sharp Is Sharp Enough?",
    excerpt:
      "Resolution alone doesn't tell you how sharp a screen looks — pixel density and viewing distance do. Here's how to work out what you need.",
    tags: ["ppi", "resolution", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Two screens can share a resolution yet look very different. **Pixel density (PPI)** — pixels per inch — is what determines sharpness.

## Resolution vs density

A 27" 1440p monitor (~109 PPI) and a 24" 1080p monitor (~92 PPI) differ in sharpness because density differs. Density = resolution spread over physical size. Stretch the same 1080p over a 27" panel and you drop to about 82 PPI, which is where individual pixels start becoming visible in text at a normal desk distance.

You can work it out for any screen: take the diagonal in pixels — the square root of width squared plus height squared — and divide by the diagonal in inches. For 2560 by 1440 on a 27" panel that's about 2937 pixels across roughly 27 inches, or 109 PPI.

## Rough desktop targets

- **~80–90 PPI:** noticeably soft. 27" 1080p lands here (~82 PPI) and text looks chunky up close.
- **~90–110 PPI:** standard, sharp at normal desk distance (24" 1080p ~92, 27" 1440p ~109, 34" ultrawide 3440x1440 ~110).
- **~135–165 PPI:** very crisp. 32" 4K is around 138 PPI, 27" 4K around 163 — text looks print-like but may need OS scaling.
- **Higher (phones/laptops):** laptops commonly run 140–220 PPI, phones 400–500+, all viewed much closer than a monitor.

Note what this means in practice: **4K is not automatically sharper than 1440p.** A 43" 4K screen is about 102 PPI — less dense than a 27" 1440p. Size and resolution have to be considered together, always.

## Viewing distance is half the story

The farther you sit, the less density you need. That's why a 4K TV across the room and a 1080p phone in your hand can both look sharp. Your eye resolves a fixed *angle*, not a fixed number of pixels, so doubling your distance halves the density you need for the same apparent sharpness.

Practical version:

- **Phone**, held 25–35 cm away: needs the highest density of anything you own.
- **Laptop**, 40–60 cm: high density helps, and you're stuck with whatever the machine has.
- **Desktop monitor**, 50–80 cm: the 90–160 PPI band covers nearly everyone.
- **TV**, 2–3 m: density barely matters. Contrast, black level, and motion matter far more — check those with the [Contrast Test](/contrast-test) instead of chasing resolution.

If a monitor feels too coarse, moving it 10 cm further back does more for perceived sharpness than most settings changes.

## OS scaling

High-PPI screens make UI tiny, so you apply **scaling** (e.g. 150%). How well that works depends on the operating system.

**Windows** offers scaling in 25% steps — 100%, 125%, 150%, and so on, with the exact options shown depending on the display. Integer scaling (100% and 200%) is pixel-perfect. Non-integer scaling can soften text slightly on some apps — specifically older apps that aren't DPI-aware, which get bitmap-stretched by the system and end up visibly blurry while modern apps stay crisp. Signing out and back in after a scaling change fixes a surprising number of stragglers.

**macOS** renders at double resolution internally and scales down to whatever "looks like" size you pick. Only the exact-half option (for example 1920x1080 on a 4K panel) is a true 2x render; the intermediate options resample and cost a little sharpness and GPU load. macOS also no longer uses subpixel text antialiasing, which is why a low-density external monitor around 90 PPI often looks noticeably softer on a Mac than the same monitor on Windows. If you're pairing a Mac with an external display, aim high on density — the setup details are in [Setting Up an External Monitor Right](/blog/laptop-external-monitor-mac-windows).

### Mixing densities

Running a high-PPI laptop screen next to a low-PPI external monitor is the one setup that reliably annoys people. Windows applies per-display scaling, but windows dragged between screens can render at the wrong size until they redraw. macOS handles the transition more gracefully but will still show a visible difference in text weight. Matching density between displays matters more than matching resolution.

## What density won't fix

Sharpness problems often aren't density problems:

- **A blurry image at the right resolution** usually means the display isn't running at its native resolution, or a TV is applying overscan. Fix the resolution first.
- **A visible grid between pixels** at close range is the [screen-door effect](/blog/screen-door-effect-explained), not low resolution as such.
- **Fringed color on text edges** is a subpixel rendering mismatch — common when a panel uses a non-standard subpixel layout.
- **Soft text on one app only** is that app, not the panel.

## Check clarity

After setting resolution and scaling, view a [White Screen](/white-screen) with black text or fine patterns to judge real-world sharpness — and confirm no scaling blur.

A quick two-minute routine: open the [White Screen](/white-screen), put a text-heavy page or document over half of it, and compare the edges of the letters against a screenshot of the same text at 100% zoom. Crisp black-to-white transitions mean you're at native resolution with clean scaling; grey halos or colored fringes mean something in the chain is resampling. Then run the [Color Gradient Test](/color-gradient-test) — a smooth gradient with no visible steps confirms the signal path is intact at full bit depth, which is worth knowing before you blame the panel for anything.

If you're still choosing a screen, work backwards: fix your seating distance first, then pick the size that fits your desk, and only then pick the resolution that lands you in the 90–160 PPI band. [How to Test a Monitor Before (and Right After) Buying](/blog/how-to-test-a-monitor-before-buying) covers everything else worth checking on day one.`,
  },
  {
    slug: "hdr-explained",
    title: "HDR Explained: What Makes a Display Actually HDR",
    excerpt:
      "Most monitors labeled 'HDR' aren't. Here's what real HDR needs — peak brightness, local dimming, contrast and wide color — and how to check.",
    tags: ["hdr", "color", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `HDR (High Dynamic Range) promises brighter highlights, deeper shadows, and richer color. The label is wildly overused.

An HDR display is not just a brighter display. Real HDR changes three things at once: the range between the dimmest and brightest thing on screen, the number of tone steps available to fill that range, and the width of the color space. Miss any one and you get a signal that is technically accepted and visibly worse than plain SDR.

## What real HDR needs
- **High peak brightness** — 600+ nits to make highlights pop; 1000+ is excellent.
- **High contrast / local dimming** — many dimming zones (Mini-LED) or per-pixel control (OLED).
- **Wide color gamut** — strong **DCI-P3** coverage (see our [gamut guide](/blog/color-gamut-srgb-vs-dci-p3-vs-adobe-rgb)).
- **10-bit color** to avoid banding in HDR gradients.

Contrast matters more than brightness. A very bright panel with a poor black level can end up with no more usable dynamic range than a dimmer one with excellent blacks — the ratio between the two is what you perceive, not the top number alone. That is why OLED, which switches every pixel off individually, can look more convincingly HDR than a much brighter LCD.

## Reading peak brightness numbers
Manufacturers quote peak brightness measured on a small window — a bright patch covering a fraction of the screen. Full-screen sustained brightness is always lower, and on OLED it is much lower, because automatic brightness limiting protects the panel. A display quoted at a high peak figure may sustain a small fraction of it across a full white field. Neither number is a lie; they answer different questions. Highlights use the first, a bright office uses the second.

## The "fake HDR" trap
**DisplayHDR 400** badges often mean a standard SDR panel that merely *accepts* an HDR signal — no real local dimming or extra brightness. It can look *worse* than SDR. Look for **DisplayHDR 600/1000**, or OLED.

The higher VESA tiers add requirements rather than just raising the brightness figure: local dimming, wider gamut coverage and better black levels. There is also a separate True Black tier intended for OLED, which sets an extremely low black-level requirement instead of a high peak-brightness one — a 400-nit True Black OLED can deliver a far more convincing HDR image than a 400-nit LCD.

## Formats you'll see
- **HDR10** — the baseline. Static metadata describing the whole title. Universally supported.
- **HDR10+** and **Dolby Vision** — add dynamic, scene-by-scene metadata so tone mapping adapts. Better on displays that can't reach the mastering brightness, which is most of them.
- **HLG** — designed for broadcast, so one stream works on both SDR and HDR sets.

Support is a device and service question, not a quality ranking. A good HDR10 implementation beats a bad Dolby Vision one.

## Setting it up
- Enable HDR in the OS **and** the game/app. Enabling only one is the single most common reason HDR looks flat.
- On Windows, run the **HDR calibration** app, and set the SDR content brightness slider — if desktop windows look washed out and grey in HDR mode, that slider is why.
- On macOS, turn on **High Dynamic Range** for the display in System Settings → Displays — the toggle appears for connected HDR10-capable displays; built-in XDR displays handle HDR content automatically.
- HDR needs adequate cable bandwidth (HDMI 2.0 or newer / DisplayPort). If HDR is missing or the refresh rate drops when you enable it, suspect the cable or the port before the display.
- Turn off any monitor-side "dynamic contrast" or picture-enhancement mode, which fights the HDR tone mapping.

## Check the basics first
HDR leans on black level and gradients. Verify deep blacks with the [Black Screen](/black-screen) and [Black Level Test](/black-level-test), dynamic range with the [Contrast Test](/contrast-test), blooming with the [Blooming Test](/blooming-test), and smooth tone transitions with the [Color Gradient Test](/color-gradient-test).

Read the results in that order. If black looks dark grey in a dark room, HDR will not fix it. If the gradient steps visibly in SDR it will step worse in HDR, since those tone levels are stretched across a much larger brightness range — [what is color banding](/blog/what-is-color-banding-and-how-to-reduce-it) covers what you can do about it. If bright objects on black are ringed by a halo, you are seeing the dimming zones, which is the price a Mini-LED pays for its brightness. [Mini-LED vs OLED](/blog/mini-led-vs-oled) compares the two approaches directly.

## Is HDR worth turning on?
On a display with real local dimming or per-pixel control, yes, for films and games mastered for it. On a DisplayHDR 400-class monitor, usually not — SDR with a good calibration will look better most of the time. And on Windows, leave HDR off for everyday desktop use unless you have set the SDR brightness slider properly, because unmanaged SDR content in HDR mode looks noticeably duller.

Run the black level and contrast tests before you spend anything on an HDR upgrade — they tell you whether your current screen has the headroom to benefit.`,
  },
  {
    slug: "screen-door-effect-explained",
    title: "The Screen-Door Effect: Why You See a Grid",
    excerpt:
      "A faint mesh over the image, most common in VR headsets and on big screens viewed up close. Here's what causes it and what actually reduces it.",
    tags: ["screen door", "vr", "panel"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `The screen-door effect (SDE) is a visible grid of fine lines between pixels — like looking through a screen door.

## What causes it
Every pixel has a tiny non-illuminated gap around it. When pixels are large relative to your viewing distance, those gaps become visible as a mesh. It's about **fill factor** and **pixel density**, not a defect.

Fill factor is the share of each pixel's area that actually emits light. The rest is taken up by the transistor, the wiring and the black matrix that separates sub-pixels. Nothing lights up there, so at close range you see a dark lattice laid over the picture.

What decides whether you notice it isn't pixels per inch on its own — it's how much of your field of view each pixel covers. The useful measure is **pixels per degree**: how many pixels fit into one degree of your vision. A person with normal 20/20 vision can just resolve detail about one arcminute wide, which works out to roughly 60 pixels per degree. Well below that and the grid becomes visible; well above it and individual pixels disappear regardless of the panel's PPI. That's why a phone held at arm's length looks flawless while the same panel two inches from your eye looks like mesh.

## Where you'll see it
- **VR headsets** — lenses magnify pixels right against your eye (early headsets were notorious).
- **Large TVs viewed too close.**
- **Low-PPI panels** at short distances.
- **Projectors**, where the gaps between LCD or DLP elements are cast onto the wall along with the image.

## How it's reduced
- **Higher resolution / pixel density** — smaller gaps.
- **Higher fill factor** panels and diffusion layers.
- **Pentile vs RGB-stripe** sub-pixel layouts change how SDE appears.
- **Optical diffusion** in headsets — a thin filter that softens the boundary between pixels, trading a little sharpness for a smoother image.

Layout matters more than people expect. An RGB-stripe panel puts three equal sub-pixels side by side; the diamond and pentile arrangements common on OLED share sub-pixels between neighbours and give a different, sometimes finer-looking texture at the same nominal resolution. It's also why colored fringing on small text differs between two screens with identical specs — see [PPI and pixel density explained](/blog/ppi-and-pixel-density-explained).

## Check your own panel
View a full [White Screen](/white-screen) up close. A faint, even grid is normal SDE; irregular lines or bands are a different issue — for those, check uniformity with the [Brightness Uniformity Test](/brightness-uniformity-test). Increasing viewing distance is the simplest fix.

Then step back to your normal seat and look again. If the grid disappears at your actual working distance, there's nothing to fix and nothing wrong with the display.

## What it isn't
Several other effects get called screen-door by mistake, and they have completely different causes.

- **Anti-glare sparkle.** Matte coatings scatter light and create a fine glittering texture on white backgrounds. It shifts and shimmers as you move your head; a true pixel grid stays locked to the image. This is common on matte IPS monitors and is a coating property, not a pixel one.
- **Dirty screen effect.** Faint vertical or horizontal bands, most visible on large TVs during panning shots of a football pitch or a clear sky. It's a uniformity problem, not a gap problem — test it on a mid-grey field with the [Greyscale Test](/greyscale-test).
- **Color banding.** Visible steps in a gradient rather than a repeating grid. Confirm with the [Color Gradient](/color-gradient-test) test and read [what is color banding](/blog/what-is-color-banding-and-how-to-reduce-it).
- **Moiré in photos.** Photograph any screen and your camera's own sensor grid interferes with the pixel grid, producing a strong pattern that isn't visible in person. Never judge SDE from a picture.
- **A permanent line or column.** A single sharp line that doesn't repeat across the screen is a panel fault, not SDE. Check it against solid colors with the [Dead Pixel Test](/dead-pixel-test).

## What to do about it on a display you already own
1. Measure your real viewing distance and judge it against screen size, not resolution alone. On a 4K TV you generally have to sit closer than about one screen width before pixel structure starts resolving — much nearer than any normal seating position.
2. Move back, or move the screen back, before doing anything else. It's free and it works.
3. On a desktop monitor, raising scaling makes text larger but does not change pixel spacing — the grid stays exactly where it was.
4. If you're buying, weigh resolution against size *and* distance rather than chasing raw pixel count. A 27-inch 1440p monitor at arm's length puts far more pixel structure into your field of view than a 55-inch 4K TV seen from a sofa — which is why this effect turns up at the desk far more often than in the living room.

For a headset, the fix is a newer headset — resolution and optics are the only variables, and neither is adjustable after purchase.`,
  },

  // ---------- Troubleshooting ----------
  {
    slug: "why-does-my-screen-have-a-dark-spot",
    title: "Why Does My Screen Have a Dark Spot or Patch?",
    excerpt:
      "Pressure marks, ink blobs, and backlight shadows all look similar but have different causes — and very different chances of recovery.",
    tags: ["troubleshooting", "lcd", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `A dark spot isn't always a dead pixel. Identifying the type points you to the fix — and tells you quickly whether there's any point trying one.

## Possible causes
- **Pressure mark, or "LCD bruise":** a darker blotch with soft, indistinct edges, caused by physical pressure — a thumb on the lid, an object left on the keyboard before closing it, a bag packed too tight. On LCD it may slowly fade over days; if the liquid crystal layer or a polarizer is damaged, it's permanent.
- **Trapped dust:** a small dark fleck under the glass that doesn't change with color. Confirm with a [White Screen](/white-screen), where debris is far more visible than on black.
- **Dead pixel cluster:** several failed pixels close together — fixed dark on every color ([Dead Pixel Test](/dead-pixel-test)). Sharp-edged and tiny, unlike a bruise.
- **Backlight or diffuser damage:** a shadowed region from a damaged backlight layer (LCD). Usually large, soft, and unchanged by what's on screen.
- **A failed local-dimming zone:** on a Mini-LED or full-array display, a rectangular patch that stays dark. The giveaway is its shape — dimming zones are rectangles, damage isn't.
- **Liquid crystal leak:** on a cracked panel, an inky black blob that spreads over days or weeks, often with fine lines radiating from it. This one gets worse, and only replacement fixes it.
- **A dark spot only on one input or app:** not the panel at all. Move the window, change source, and see if the spot moves with it.

## How to diagnose
1. Cycle solid colors with the [Color Test](/color-test). A spot dark on *every* color means pixels or physical damage. A spot that changes with the image is a signal or software problem.
2. Move a window under it. If the spot travels with the content, your panel is fine and something upstream is wrong.
3. Check on a second source — a different cable, laptop or console. A dark patch that follows the source is a GPU, cable or app fault.
4. Look at the shape. Sharp and pixel-sized points to failed pixels. Soft and blotchy points to pressure. Rectangular points to a dimming zone. Spreading and inky points to a crack.
5. Check for surface damage first, in daylight with the screen off. Reflected light shows scratches and coating damage that a dark screen hides entirely.
6. Note whether it moves or fades over days — pressure marks sometimes do, nothing else does.
7. Photograph it with the date, especially if the device is new. You will want that record if the return window closes while you're testing.

## Where it appears matters
- **Corners and edges:** more often pressure from a bezel, a case, or a lid that flexes. On a laptop, the classic cause is the trackpad or a keyboard key pressing into the panel when the lid shuts.
- **Center:** more often a genuine panel fault or an impact.
- **A band or long strip:** think diffuser or backlight, or a partially failed edge-lit LED, not pixels.

## What you can try
- For fresh pressure marks: leave it, avoid more pressure — some recover over a week or two. Nothing you apply speeds that up.
- Never press hard, rub, or heat the panel to "fix" it. That's how one small bruise becomes a permanent streak.
- Check it isn't on the surface: clean gently with a dry microfiber cloth first, following [How to Clean Your Monitor or Laptop Screen Safely](/blog/how-to-clean-your-monitor-safely). Dried spatter looks a lot like a dark spot until it comes off.
- On a laptop, power fully down, open the lid, and check nothing was sitting on the keyboard. Then check whether the same spot lines up with a key or the trackpad.
- Reseat the video cable and try another one. It won't fix a bruise, but it costs nothing and rules out a whole class of signal faults.
- Physical damage to the panel, the backlight, or the diffuser generally requires a screen replacement. There is no software fix.

## When to stop and claim
If the device is new, stop testing and start the return. Retailer return windows are usually shorter than the warranty and far easier to use, and a dark patch is a much stronger claim than a couple of dead pixels — pixel policies have thresholds, but a visible blotch, trapped dust, or a shadowed region normally doesn't.

If it's out of the return window but in warranty, get the fault on record with photos and a support ticket now, while it's small. Cracked-panel damage and pressure marks are usually treated as accidental damage rather than a defect, so the wording of your first message matters: describe what you see, not what you think caused it.

If it's a dead pixel cluster rather than a patch, check the count against the maker's policy in [Dead Pixel Warranty Policies, Explained](/blog/dead-pixel-warranty-policies) before you call, so you know whether you have a claim or an argument.

## Looking for the joke version?
Plenty of people searching for a broken screen want the prank, not the diagnosis. The [Fake Broken Screen](/fake-broken-screen) shows a realistic crack, static, or a blue screen of death, and the [Boot Screen Simulator](/boot-screen-simulator) fakes a Windows or macOS startup. Both are full-screen effects that clear the moment you tap, and neither touches your display.`,
  },
  {
    slug: "why-is-part-of-my-screen-discolored",
    title: "Why Is Part of My Screen Discolored or Tinted?",
    excerpt:
      "Yellow, pink, or rainbow patches usually point to a cable, pressure, or panel fault. Here's how to narrow it down before you pay anyone.",
    tags: ["troubleshooting", "color", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Discoloration — a yellow corner, pink band, or rainbow smear — has a handful of common culprits.

Work through them in cost order: signal, then software, then panel. Skipping to "the screen is broken" is how people pay for a display when they needed a cable.

## Step 1: Rule out the signal
Loose or failing cables cause tint and artifacts.
- Reseat both ends of the video cable; try a **different cable and port**.
- On laptops, gently flex the hinge area — if the tint changes, it's the internal display cable.

There's a faster diagnostic than any of that: **open the monitor's own on-screen menu**. That menu is generated inside the display, after the input, so if the tint sits over the menu graphics too, nothing upstream is responsible — not the cable, not the GPU, not Windows. If the menu is clean and only your desktop is tinted, the fault is in the signal chain or software.

The same logic scales up. Plug a completely different device into the monitor — a console, a laptop, a phone with an adapter. If the tint follows the monitor, the monitor owns it. On a laptop, do the reverse: connect an external display. A clean external picture with a tinted built-in panel narrows it to the internal display or its ribbon cable.

Watch the boot screen too. A tint that's already present at the manufacturer logo, before the operating system loads, cannot be a driver or color profile.

## Step 2: Rule out software
- Disable color filters / night mode (Night Light, Night Shift).
- Reset any custom color profile (ICC) and GPU color settings.
- Update or roll back GPU drivers.

On **Windows**, the usual suspects are Night Light (Settings, System, Display), the accessibility color filters (Settings, Accessibility, Color filters — a grayscale or deuteranopia filter left on explains a lot of strange calls), and a stale ICC profile under Color Management. Also check the GPU control panel for digital vibrance, a shifted color temperature, or a limited-versus-full RGB range setting, which produces washed-out, slightly off color rather than a localized patch.

On **macOS**, check Night Shift, True Tone (which shifts white balance with room lighting and can look like a slow yellow drift), Accessibility color filters, and the selected profile under System Settings, Displays, Color Profile. Setting the profile back to the display's default is a clean reset.

Scheduled features are the sneakiest, because the symptom appears at the same time every evening and vanishes overnight. If your "fault" keeps office hours, it's software. [Blue Light, Night Mode, and Color Temperature](/blog/blue-light-and-color-temperature) explains what these modes actually change.

While you're here: clean the screen properly and rule out residue. Dried cleaner, skin oil, or a smeared coating can read as a haze or patch that no setting will fix — [How to Clean Your Monitor or Laptop Screen Safely](/blog/how-to-clean-your-monitor-safely) covers doing it without damaging the anti-glare layer.

## Step 3: Test the panel
Load full-screen colors with the [Color Test](/color-test) and a [White Screen](/white-screen):
- **Uniform tint everywhere:** likely color settings or color temperature.
- **Localized patch:** pressure damage or a panel/backlight fault.
- **Rainbow/oil-slick smear:** pressure on the panel layers.

Add a [Greyscale Test](/greyscale-test) as well. A tint that's obvious on mid grey but invisible on white usually points at color temperature or grey tracking rather than a physical defect, because a defect doesn't care what shade you feed it.

Now read the shape of what you see:

- **An even warm or cool cast across the whole screen** — a color temperature preset or an ICC profile, not damage.
- **A yellow or blue patch near one edge of an LCD** — usually a failing backlight LED or a diffuser problem behind that section.
- **A dark ring or blotch with a defined edge** — pressure damage to the panel layers.
- **Rainbow bands that move as you tilt the screen or press the bezel** — a stressed or delaminating polarizer.
- **Faint cloudy variation across a full grey field** — mura, present to some degree on most LCDs.
- **A recognizable outline of a logo or taskbar on an OLED** — uneven pixel wear rather than a tint, and it won't respond to any color setting.

Two rules make this quicker. First, **move your head**. Anything that changes with viewing angle is a characteristic of the panel technology, not damage. Second, **press nothing**. Pushing on an LCD to investigate a mark is how a small mark becomes a permanent one.

If the patch is dark rather than colored, it may be a different problem entirely — [Why Does My Screen Have a Dark Spot or Patch?](/blog/why-does-my-screen-have-a-dark-spot) covers that branch.

## Likely outcomes
- Cable/software → cheap or free fix.
- Localized physical discoloration that survives every test → panel issue, often a replacement.
- Tint that appears only after the screen has been on for a while, then stays → likely backlight or driver-board aging; still a hardware claim.

Panel replacement on a laptop or all-in-one is frequently a large fraction of the device's value, so check warranty status before paying for a diagnosis. If you're inside a retailer's return window, use it — that's far easier than proving a fault later.

Document it on solid colors before contacting support. Shoot in a dark room, square to the screen, with exposure locked so the camera doesn't auto-correct the tint straight out of your evidence.`,
  },
  {
    slug: "how-to-clean-your-monitor-safely",
    title: "How to Clean Your Monitor or Laptop Screen Safely",
    excerpt:
      "The right cloth, the right liquid, and the mistakes that permanently damage anti-glare coatings — plus what you should never spray on a screen.",
    tags: ["cleaning", "maintenance", "guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Screens have delicate anti-glare and oleophobic coatings. Clean them wrong and you can haze or scratch them for good.

The damage is not always instant. A paper towel does not gouge a screen the first time; it leaves fine scratches that add up over months until the panel looks permanently milky in daylight. Alcohol on a matte coating can strip it in patches that never come back. Neither is repairable — the coating is part of the panel.

## Know what you are wiping

Three surfaces, three rules.

- **Glossy glass** (most phones, tablets, iMacs, many TVs) — the toughest of the three, with an **oleophobic** layer on top that repels fingerprints. Solvents wear that layer down, so grease starts sticking sooner.
- **Matte / anti-glare** (most desktop monitors and work laptops) — a textured film bonded to the panel. This is the fragile one. Alcohol and pressure both damage it.
- **Specialty coatings** (etched or nano-texture glass, some OLED TVs) — follow the manufacturer's instructions exactly, including the cloth they supply. These often permit water only.

If you do not know which you have, look at a reflection: a sharp mirror image means glossy, a diffuse blurry one means matte.

## What you need

- A clean **microfiber** cloth (no paper towels, tissues, or old t-shirts). Two is better: one damp, one dry. Wash them without fabric softener, which leaves a residue that smears.
- **Distilled water**, or a screen-safe cleaner. Distilled matters because tap water leaves mineral spots as it dries. Avoid ammonia, alcohol (on coated panels), and household glass cleaner.
- Optionally a soft brush or a blower for dust in the bezel seam.

Some manufacturers now permit 70% isopropyl wipes on their own displays, especially glossy glass. Check your specific manual before assuming yours is one of them, and never assume a phone's rules apply to a matte monitor.

## The method

1. **Power off** — a dark screen makes dust and streaks visible (a [Black Screen](/black-screen) helps for spotting, then turn it off to wipe). Let it cool for a few minutes; cleaner evaporates unevenly on a warm panel and leaves streaks.
2. **Dry pass** first to lift loose dust. Skipping this is how grit gets dragged across the coating.
3. **Lightly dampen the cloth** — never spray liquid directly on the screen; it can seep into edges. Liquid that wicks under the bezel can leave permanent stains in the layers or reach the driver board.
4. Wipe **gently** in one direction or small circles. Don't press — pressure can create [pressure marks and dead pixels](/blog/what-causes-dead-pixels). Support the back of a laptop lid or a thin panel with your free hand so you are not flexing it.
5. Follow with the **dry cloth** while the surface is still slightly damp to pick up streaks before they set.
6. Let it dry fully before powering on.

For the bezel and stand, use a separate cloth. Household cleaners are fine on plastic but must never touch the panel, and it is easy to transfer them with the same cloth.

## Don'ts

- Don't use paper products (they micro-scratch).
- Don't use ammonia/alcohol on matte or coated screens.
- Don't scrub stuck-on spots — re-dampen and let it soften. Hold the damp cloth against the spot for 20–30 seconds first.
- Don't use compressed air up close on an OLED or a thin laptop panel; the propellant can come out as freezing liquid.
- Don't clean a screen in direct sunlight — it dries before you can buff it.
- Don't use disinfectant sprays, baby wipes, or vinegar solutions, whatever a video told you.

## After cleaning

Bring up a [White Screen](/white-screen) to check for streaks and a [Black Screen](/black-screen) for missed dust.

Then decide what is actually left. A mark that moves or fades as you wipe is dirt. A mark that stays in exactly the same place through both fields is inside the panel, and no amount of cleaning will touch it:

- A dark blotch that does not move is likely a pressure mark or a backlight fault — see [Why Does My Screen Have a Dark Spot or Patch?](/blog/why-does-my-screen-have-a-dark-spot).
- A tinted region that stays put is a panel or cable problem, covered in [Why Is Part of My Screen Discolored or Tinted?](/blog/why-is-part-of-my-screen-discolored).
- A single permanently black or colored dot is a pixel fault. Confirm it with the [Dead Pixel Test](/dead-pixel-test) rather than cleaning at it, which only risks making things worse.

Clean often enough that dust never builds into a film — a dry microfiber pass once a week takes ten seconds and means you almost never need liquid at all.`,
  },
  {
    slug: "how-to-test-a-used-phone-screen-before-buying",
    title: "How to Test a Used Phone Screen Before Buying",
    excerpt:
      "Buying secondhand? Run these quick checks for dead pixels, OLED burn-in, touch dead zones and tint before you hand over any money.",
    tags: ["phone", "used", "buying guide"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `A great secondhand deal can hide an expensive screen problem. A replacement display is often one of the most expensive repairs on a phone, and a bad panel is the one fault you cannot negotiate away after the fact. Test before you pay.

## Set up first

- Meet somewhere with **even indoor lighting**, not bright sun. Sunlight hides almost everything on a phone screen.
- Ask the seller to turn **auto-brightness off** and brightness to maximum, and to disable night mode, blue light filters, and any color-tone setting.
- Clean the glass. Fingerprints look like every fault on this list.
- Take five minutes. A seller who won't give you five minutes with the screen is telling you something.

## Bring up test patterns

Open this site in the phone's browser and work through the six checks below, each one full-screen. Say up front that you'd like a few minutes with the screen — it is much easier than asking for the phone back later.

## 1. Dead/stuck pixels

[Dead Pixel Test](/dead-pixel-test) — step through solid colors and scan for wrong-colored dots. Phone pixels are tiny, so look closely. Hold the phone about 20 cm from your eyes and sweep across the screen in strips rather than staring at the centre.

A dot that stays black on every color is dead. One locked on red, green, or blue is stuck and may still be fixable. One that glows white on black is a hot pixel. [Dead vs Stuck vs Hot Pixels](/blog/dead-vs-stuck-vs-hot-pixels) has the full distinction. On an OLED phone, be aware that dead pixels are rare compared with burn-in — if you find one, it's usually a sign the panel has been replaced or damaged.

## 2. OLED burn-in

Most phones are OLED. Display a [White Screen](/white-screen) and a 50% gray ([Brightness Uniformity Test](/brightness-uniformity-test)) and look for faint ghosts of status bars, navigation buttons, or keyboards.

Grey is the more revealing of the two — burn-in shows up as a slightly darker or pinkish band rather than a hard outline, and pure white can wash it out. Check these places specifically:

- The **status bar** across the top, including the clock and battery icon.
- The **navigation bar** or gesture pill at the bottom.
- A rectangular block where a **keyboard** sits.
- The area around a notch or camera cutout.

Burn-in never improves, and no app fixes it. Grade how bad it is against how much you're saving — a faint status bar on a heavily discounted phone may be fine; a visible keyboard outline is a panel at the end of its life. [OLED Burn-In: Causes, Prevention, and How to Check](/blog/oled-burn-in-and-how-to-check-for-it) covers what accelerates it, and the [Burn-in Test](/burn-in-test) has patterns designed to expose it.

## 3. Tint and uniformity

A [White Screen](/white-screen) should be evenly white — watch for pink/green patches or a yellow half (a sign of past damage or aftermarket panels).

Also tilt the phone slowly while a white screen is up. Every OLED shifts slightly blue or green off-axis; that's normal. What isn't normal is a patch that stays discolored at every angle, or a distinct boundary line where one region is warmer than the next. [Why Is Part of My Screen Discolored or Tinted?](/blog/why-is-part-of-my-screen-discolored) walks through the causes.

Then check a mid-grey for **blotchiness** — uneven, cloudy patches often mean pressure damage or a panel that has taken a knock.

## 4. Touch dead zones

In a notes app or drawing app, drag a finger across **every** part of the screen in one stroke. Any gaps mean a dead touch zone. Draw a tight zigzag so the line covers the full surface, then repeat right along the edges — edge dead zones are the most common and the easiest to miss.

Test multi-touch too: hold one finger still and drag a second. Erratic jumping means a digitizer fault. Try typing a full sentence on the keyboard; a key that needs a second press is a touch problem, not a software one.

## 5. Cracks and pressure spots

On a [Black Screen](/black-screen), look for bright spots or spreading blotches that hint at internal damage even if the glass looks intact.

Black is also the best background for spotting hairline cracks in the glass and any light leaking around the edges. Run a fingernail lightly across the surface — a crack you can feel but barely see will spread. Look for a faint spider-web pattern radiating from one corner: that's an impact the seller may not have mentioned.

## 6. Flicker

Many OLED phones dim by rapidly switching the panel on and off, which some people perceive as eye strain or headaches at low brightness. Turn the brightness right down and wave your hand in front of the screen — visible stroboscopic banding across your fingers means aggressive flicker. It's not a defect, but it is worth knowing before you buy. [What Is PWM Flicker and How Do You Test for It?](/blog/what-is-pwm-flicker) explains what to look for.

## Bonus

Check True Tone/auto-brightness behave, and that the panel is genuine (aftermarket panels often show worse color and touch issues). On iPhones running iOS 15.2 or later, Settings → General → About lists parts and service history, and a replaced display is flagged there on iPhone 12 and newer models (iPhone 11 and earlier show battery history only). On Android, a suspiciously deep discount plus a slightly-off color balance and a rubbery-feeling touch response usually means a third-party panel.

If more than one of these checks fails, walk away — a phone with a good screen is worth paying more for than one with a good battery, because the battery is the cheap part to replace.`,
  },
  {
    slug: "laptop-external-monitor-mac-windows",
    title: "Setting Up an External Monitor Right (Mac & Windows)",
    excerpt:
      "Resolution, refresh rate, scaling, and color-range settings people miss when plugging in a second screen — on both macOS and Windows.",
    tags: ["monitor", "windows", "macos"],
    publishedAt: "2026-06-21",
    updatedAt: "2026-08-27",
    body: `Plugging in an external monitor "just works" — but rarely at its best. Five settings make the difference.

## 1. Native resolution
Set the monitor to its **native** resolution (e.g. 2560×1440 for a 27" 1440p). Anything else looks soft.

An LCD or OLED has a fixed grid of pixels. Feed it any other resolution and it has to interpolate, which blurs text permanently — no amount of ClearType or font smoothing recovers it. On Windows this lives under Settings → System → Display → Display resolution, where the native mode is marked "Recommended". On macOS, open System Settings → Displays; if the mode you want isn't offered, recent versions have a Show all resolutions switch behind the Advanced button (on older versions, holding Option while clicking Scaled reveals the full list).

## 2. Refresh rate
Don't assume the max is selected — it usually isn't. Set it (see our [refresh-rate guide](/blog/how-to-enable-full-refresh-rate-windows-mac)) and confirm with the [Refresh Rate Test](/refresh-rate-test).

Windows hides this under Settings → System → Display → Advanced display. macOS puts a refresh-rate dropdown in the Displays pane when the connected screen supports more than one rate. Two traps: a hub, dock or long passive HDMI cable can quietly cap the available rates, and connecting through USB-C on a laptop that is also driving USB devices sometimes drops the link to fewer lanes. If your monitor's top rate isn't in the list at all, change the cable before you change anything else. [Refresh rate explained](/blog/refresh-rate-explained-60-vs-120-vs-144-vs-240) covers what you actually gain from each step.

## 3. Scaling
High-PPI panels make UI tiny. Pick comfortable scaling (Windows: Display → Scale; macOS: Displays → Scaled). Integer scaling (e.g. 200%) is sharpest.

Windows and macOS handle this differently, which is why the same monitor can look great on one and mediocre on the other. Windows scales each application, and older apps that don't support it end up blurry. macOS renders at a multiple of the target and downsamples, so non-integer scales stay sharp but cost a little GPU work. The practical consequence: 4K at 27 inches suits macOS well at 200%, while Windows users often prefer 1440p at 27 inches and no scaling at all. [PPI and pixel density](/blog/ppi-and-pixel-density-explained) explains where the comfortable range sits.

## 4. RGB range
Over HDMI, GPUs sometimes default to **Limited** range, crushing blacks and whites. Set the GPU to **Full** RGB and the monitor to match. Verify with the [Greyscale Test](/greyscale-test) — you should see distinct steps at both the dark and bright ends.

The setting is under Change resolution → Output dynamic range on NVIDIA, Display → Pixel Format on AMD, and Display → Quantization Range on Intel. Some monitors carry their own matching control, often labeled HDMI Black Level, RGB Range or Input Range. The two must agree: Full on one side and Limited on the other gives you either crushed shadows or milky, washed-out blacks. While you're there, confirm the color format is RGB or YCbCr 4:4:4 rather than 4:2:2, which softens colored text noticeably.

## 5. Color profile
Select an sRGB profile for general use, or a calibrated ICC profile if you have one.

If the monitor has an sRGB picture mode in its own menu, use that rather than a software profile — it clamps an over-saturated wide-gamut panel at the source. Without a colorimeter you can still get most of the way there by eye; [how to calibrate without a colorimeter](/blog/how-to-calibrate-your-monitor-without-a-colorimeter) covers the sensible order of operations.

## Multi-monitor gotchas
- **Mismatched refresh rates.** Two displays at different rates is fine on modern systems, but animations can stutter on the slower one, and some older GPU driver combinations force both to the lower rate.
- **Arrangement and primary display.** Drag the panels in the arrangement view so their physical heights match, and set the one you look at most as primary — that is where full-screen apps and the taskbar or menu bar land.
- **Different profiles per screen.** Both operating systems assign color profiles per display. Assigning the laptop's profile to the external monitor is a common cause of an odd tint.
- **Daisy chaining and docks.** Total bandwidth is shared. Two high-refresh screens through one port often means both drop a tier.

## Quick verify pass
[Dead Pixel Test](/dead-pixel-test) for the new panel, [Brightness Uniformity Test](/brightness-uniformity-test) for backlight evenness, and [Ghosting Test](/ghosting-test) if you'll game on it.

If you will game, also enable the monitor's adaptive-sync setting in its own menu and then in the GPU control panel — it is off by default on many models. [Screen tearing, V-Sync, G-Sync, and FreeSync explained](/blog/screen-tearing-vsync-gsync-freesync) covers which mode to pick.

Do the five settings in order, top to bottom, before judging the picture — most complaints about a new external monitor disappear somewhere in that list.`,
  },
  {
    slug: "backlight-bleed-vs-ips-glow",
    title: "Backlight Bleed vs IPS Glow: What's the Difference?",
    excerpt:
      "Both show up as light on a black screen, but they're different problems. Learn how to tell them apart and what's normal.",
    tags: ["monitor", "backlight bleed", "ips"],
    publishedAt: "2026-06-21",
    body: `Turn on a black screen in a dark room and you may see glowing patches. Are they a defect or just physics? It depends.

## Backlight bleed
Light leaking through the edges of an LCD panel. It's visible **head-on**, looks like cloudy patches in the corners, and doesn't change as you move.

Check yours with the [Backlight Bleed Test](/backlight-bleed-test).

It happens because an LCD makes black by blocking a backlight that is always on. Where the panel is clamped slightly unevenly in its frame, or the bezel presses harder on one edge, a little of that light escapes around the layers instead of being blocked. That's why bleed shows up as streaks and patches along the borders rather than in the middle, and why it varies between two units of the same model.

## IPS glow
A **viewing-angle** effect unique to IPS panels. It shifts and fades as you move your head, and is most visible in the corners from an angle.

The liquid crystal blocks light best when you look at it straight on. The corners of the screen are the parts you view at the steepest angle, so they leak the most — which is also why sitting closer, or using a bigger screen at the same distance, makes glow more obvious.

## The one-second test
Load a [Black Screen](/black-screen), then lean left and right by about a foot.

| | Backlight bleed | IPS glow |
| --- | --- | --- |
| Changes with head movement | No | Yes |
| Shape | Streaks, patches, torch-beam from an edge | Broad wash from a corner |
| Color | Usually white or warm | Silvery, blue, or amber |
| Panels affected | Any LCD, worst on edge-lit designs | IPS specifically |
| Is it a defect | Sometimes, if severe | No, inherent to the technology |
| Warranty | Occasionally accepted | Almost never |

## How to run the test properly
1. Kill every light in the room, including standby LEDs, and close the curtains.
2. Wait two or three minutes. Your eyes take that long to adapt, and glow always looks worst in the first thirty seconds.
3. Set brightness to what you actually use day to day — testing at 100% exaggerates everything.
4. Go full screen so no browser chrome or taskbar adds light.
5. Look with your eyes, not a phone. Cameras take long exposures in the dark and turn a barely-visible haze into a dramatic photo. Almost every alarming bleed picture online is a camera artefact.

Then repeat at your normal seating position with the room lit as usual. That is the only condition that matters, because it's the one you'll live with.

## Things that are neither
- **Clouding / mura** — mottled uneven patches across the middle of the screen rather than the edges, often caused by pressure on the panel. Confirm it on a mid-grey field with the [Brightness Uniformity Test](/brightness-uniformity-test).
- **Blooming** — a halo that follows a bright object around a dark screen. This only occurs on displays with a local-dimming backlight, and it's a limitation of the dimming zones, not a fault. Use the [Blooming Test](/blooming-test) and see [Mini-LED vs OLED](/blog/mini-led-vs-oled).
- **A raised black level** — the whole screen looks dark grey rather than black, evenly. That's contrast, not leakage; check it with the [Black Level Test](/black-level-test) and the [Contrast Test](/contrast-test), and turn off any "black equalizer" or shadow-boost setting in the monitor menu first.
- **A dark patch instead of a bright one** — see [why does my screen have a dark spot](/blog/why-does-my-screen-have-a-dark-spot).

OLED displays have neither bleed nor glow, because each pixel makes its own light and switches fully off for black. If a black screen on an OLED shows patchy brightness, you're looking at something else — usually panel non-uniformity or early [burn-in](/blog/oled-burn-in-and-how-to-check-for-it).

## What's normal?
Almost every LCD has *some* bleed and glow. Worry only when it's uneven, distracting in everyday use, or severe in the corners. Deep-dive guides: [backlight bleed](/blog/what-is-backlight-bleed) and [IPS glow](/blog/what-is-ips-glow).

A practical threshold: if you can't see it while watching a film with the lights on, ignore it. If a bright streak is visible during normal use — dark scenes in games, a black web page, a video with letterbox bars — that's worth acting on.

## If you want to act on it
Bleed sometimes settles over the first few weeks as the frame relaxes. Beyond that, do not try to fix it by pressing or loosening bezel screws yourself; you'll void the warranty and can easily make it worse.

Use the retailer's return window instead — it's faster and more certain than a warranty claim, and it doesn't require anyone to agree the panel is defective. Photograph the screen exactly as your eyes see it, note the date, and decide within the return period rather than after it. Manufacturer policies on bleed are vague and vary by brand, so the exchange you can make today beats the claim you might win in two months. The related pixel-defect thresholds, which are far more clearly defined, are covered in [dead pixel warranty policies](/blog/dead-pixel-warranty-policies).`,
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
 * Guides related to another guide, ranked by shared tags. This exists because 26 of
 * the 36 guide bodies link to no other guide, leaving the blog a flat hub-and-spoke
 * with no topical clustering for crawlers to follow. Deriving it from tags keeps it
 * self-maintaining — a new guide joins the cluster the moment it shares a tag.
 */
export function getRelatedGuides(slug: string, take = 3): Guide[] {
  const current = GUIDE_MAP[slug];
  if (!current) return [];
  const tags = new Set(current.tags);
  return GUIDES.filter((g) => g.slug !== slug)
    .map((g) => ({ g, score: g.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.g.title.localeCompare(b.g.title))
    .slice(0, take)
    .map((x) => x.g);
}

/**
 * Guides relevant to a tool = guides whose body links to that tool's path,
 * e.g. `[Dead Pixel Test](/dead-pixel-test)`. Matching the markdown link form
 * `(/slug)` keeps it precise (no accidental substring matches).
 */
export function getGuidesForTool(slug: string, take = 4): Guide[] {
  return GUIDES.filter((g) => g.body.includes(`(/${slug})`)).slice(0, take);
}
