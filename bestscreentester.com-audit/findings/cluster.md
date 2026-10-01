# Content Architecture / Topic Cluster Findings: bestscreentester.com

> **Re-check 2026-10-02 (code only; the SERP research below is from 2026-10-01 and was not re-run):** tool-page guide ranking — FIXED (relevance-ranked, `guides.ts:2626`). Generic `guide` tag in related-guide scoring — still open (23/44 guides). Related tests = first 4 same-category tools — still open (`[tool]/page.tsx:42-45`). Flickering guide → PWM test link — still open. P1 page ideas below are all still open.

Audit date: 2026-10-01. Seed: "monitor test". Sub-seeds: "dead pixel test", "refresh rate test", "backlight bleed", "OLED burn-in test".
Scope: I read the code (src/lib/tools.ts, src/lib/guides.ts, src/app/[tool]/page.tsx, src/app/blog/[slug]/page.tsx, src/app/page.tsx, src/components/HomeSections.tsx, Footer.tsx) and parsed the link graph with a script. I ran 65 SERP lookups through the WebSearch tool. I did not edit any repo files.

## 0. Method and caveats (read first)

- **SERP data.** 65 keywords, each looked up once with the WebSearch tool, which returns 9 or 10 URLs. URLs were normalized (scheme, `www`, trailing slash and query stripped; Play Store `id` kept). Overlap is the number of URLs two keywords share. **These are the tool's results, not guaranteed Google top-10 organic.** With one sample per keyword, the numbers are noisy.
- **No volume data.** No DataForSEO or GSC data was available, so priorities rest on how weak the SERP competition is, how well the topic fits the site, and what assets already exist. They do not rest on volume.
- **Overlap is low everywhere.** The highest overlap for any pair is 4 URLs, so no pair reaches the 7+ "same post" threshold. **The SERPs force no merges.**
- **The site does not appear in any of these SERPs.** bestscreentester.com was in 0 of the 65 result sets (`grep -c bestscreentester serps.txt` = 0). The cannibalisation findings below are therefore structural, based on content and links, not observed ranking conflicts.
- **Labels.** Statements tagged **[SERP]** were seen in the result sets. **[CODE]** means I read it in the repo. **[INFERRED]** is my judgement.

---

## 1. Existing hub-and-spoke map

### 1.1 What the hub actually is [CODE]
- **The homepage `/` is the de-facto pillar.**
  - Title: "Free Online Screen Test" (`src/app/page.tsx:17,29`). Its keywords include "monitor test" (`page.tsx:22-27`).
  - It links all 28 tools through the category grids (`page.tsx:69-80`).
  - It links 10 guides through `HomeSections.tsx:50-97`: 4 troubleshooting guides plus 6 device guides (laptop, phone, TV, monitor, OLED burn-in, panel types).
  - **It does not link `new-device-screen-test-checklist`**, the site's natural pillar guide. That guide has 1 in-body inbound link, from `ips-vs-va-vs-tn-vs-oled`.
- **No topical hub pages exist.**
  - Tool breadcrumb: Home / Tools / Tool (`[tool]/page.tsx:65-69`).
  - Guide breadcrumb: Home / Guides / Post (`blog/[slug]/page.tsx:100-104`).
  - In practice, each primary tool page acts as its cluster's hub.
- **Implicit clusters (from body links):**
  - **Dead pixels:** /dead-pixel-test/ with dead-vs-stuck, fix-stuck, what-causes, warranty, laptop.
  - **Backlight / panel:** /backlight-bleed-test/ with what-is-backlight-bleed, what-is-ips-glow, bleed-vs-glow, ips-vs-va, mini-led-vs-oled, contrast-ratio.
  - **OLED burn-in:** /burn-in-test/ with oled-burn-in and do-you-still-need-a-screensaver.
  - **Motion:** /refresh-rate-test/ with refresh-rate-explained, enable-full-refresh-rate, ghosting, response-time, tearing, BFI.
  - **Color / calibration:** 9 guides.
  - **Device / buying:** checklist, monitor, TV, laptop, used phone, external monitor.
  - **Troubleshooting:** lines, flicker, GPU, dark spot, discolored, cracked, cleaning.
  - **Fun:** pranks, screensaver.

### 1.2 Three link modules that weaken the clusters [CODE]

**A. "Related guides" on tool pages ranks by array order, not relevance.**
- `getGuidesForTool` (`guides.ts:2600-2602`) returns the **first 4 guides in `GUIDES` array order** whose body contains `(/slug)`. Nothing is ranked.
- Result: the device and checklist guides near the top of the array crowd out the topical spokes.

| Tool | Guides linking to it | Shown | Topical spokes it HIDES |
|---|---|---|---|
| dead-pixel-test | 15 | checklist, monitor, TV, laptop | **dead-vs-stuck-vs-hot-pixels, how-to-fix-a-stuck-pixel, what-causes-dead-pixels, dead-pixel-warranty-policies** (+7 more) |
| backlight-bleed-test | 7 | monitor, laptop, ips-vs-va, what-is-backlight-bleed | **what-is-ips-glow, backlight-bleed-vs-ips-glow**, contrast-ratio |
| refresh-rate-test | 11 | checklist, monitor, refresh-rate-explained, ghosting | **how-to-enable-full-refresh-rate-windows-mac** (the "144Hz shows 60Hz" answer), tearing, response-time, flickering |
| ghosting-test | 10 | checklist, monitor, refresh-explained, ghosting | response-time-vs-input-lag, motion-blur-reduction-bfi-ulmb |
| burn-in-test | 6 | TV, ips-vs-va, mini-led, oled-burn-in | used-phone guide, do-you-still-need-a-screensaver |
| black-level-test | 9 | calibrate, banding, gamma, mini-led | full-vs-limited-rgb-range, contrast-ratio, oled-burn-in |

- `dead-pixel-warranty-policies` is shown on **0** tool pages, despite linking to 3 tools.

**B. "Related guides" on guide pages is skewed by a generic tag.**
- `getRelatedGuides` (`guides.ts:2583-2595`) scores guides by shared tags and breaks ties alphabetically by title.
- The generic tag `"guide"` sits on 23 of the 44 guides. **28 of the 130 related-guide slots are filled only because of that tag.** Alphabetical tie-breaking then routes them to the same three guides.
- The effect on those three:
  - contrast-ratio-explained gets 12 of its 13 inbound links from this module.
  - blue-light-and-color-temperature gets 11 of 14.
  - color-gamut gets 15 of 21.
- Examples of off-topic results: refresh-rate-explained, how-to-test-a-tv-for-defects, the checklist, how-to-clean and harmless-screen-pranks all show "Blue Light / Color Gamut / Contrast Ratio" as their related guides.

**C. "Related tests" on tool pages shows the same few tools.**
- `[tool]/page.tsx:42-45` shows the first 4 tools of the same category in `TOOLS` order.
- **10 tools get 0 inbound links from this module:** contrast-test, black-level-test, viewing-angle-test, touch-screen-test, overscan-test, sharpness-test, pwm-flicker-test, gamma-test, wide-color-gamut-test, hdr-test.
- Meanwhile dead-pixel, backlight-bleed, brightness-uniformity and blooming each get 11.
- None of these tools is an orphan: the homepage grid and /tools/ link every tool.

**Unverified (pass to the technical agent).** Tool-page guide cards link `/blog/${g.slug}` with no trailing slash (`[tool]/page.tsx:177`). The same is true of the homepage and blog-index hrefs (`HomeSections.tsx:8ff`, `blog/page.tsx:39`). Guide-page related cards do add the slash (`blog/[slug]/page.tsx:151`). I did not check whether `trailingSlash: true` makes `next/link` emit the slash in `out/`.

### 1.3 Tools with 0–1 linking guides [CODE]
- **0 linking guides:** none.
- **Exactly 1 linking guide:**
  - `screen-info`: laptop-external-monitor-mac-windows
  - `frame-skipping-test`: how-to-enable-full-refresh-rate-windows-mac
  - `wide-color-gamut-test`: color-gamut-srgb-vs-dci-p3-vs-adobe-rgb
  - `pwm-flicker-test`: what-is-pwm-flicker
  - `hdr-test`: hdr-explained
- **2 linking guides:** touch-screen-test, overscan-test, sharpness-test, boot-screen-simulator.
- **Notable missing link.** `why-is-my-screen-flickering` (guides.ts:2152) links the PWM *guide* but not `/pwm-flicker-test/`. So does the used-phone guide's flicker section (around guides.ts:1979).

### 1.4 Guides with the weakest inbound links [CODE]
Totals count in-body links from other guides, the related-guides module, tool-page cards and the homepage.

| Guide | Total inbound | Notes |
|---|---|---|
| screen-door-effect-explained | 1 | |
| why-is-my-screen-flickering | 2 | 0 in-body |
| how-to-test-a-used-phone-screen-before-buying | 3 | 0 in-body |
| do-you-still-need-a-screensaver | 3 | 0 in-body |
| harmless-screen-pranks | 3 | tool cards only |

- **The TV and laptop guides also have 0 in-body inbound links from other guides.** They are reached only through the homepage and tool cards.

### 1.5 Cannibalisation: guide vs guide, and guide vs tool
No pair reaches 7+ URL overlap, so none is a forced merge. These are content-level conflicts:

1. **`new-device-screen-test-checklist` (L22) vs `how-to-test-a-monitor-before-buying` (L76).** [CODE]
   - They repeat each other: the same test order (dead pixel, black, white, uniformity, refresh, ghosting), the same "return window beats warranty" argument, and the same ISO 9241-307 explainer.
   - Both fit the query "how to test a new monitor" [INFERRED]. That SERP **[SERP]** contains first-day checklist pages: monitortest.im/guides/how-to-test-a-new-monitor ("First-Day Checklist") and fulltestpc.online/checklist/monitor.
   - "How to test a used monitor before buying" shares 0 URLs with "how to test a new monitor" and 0 with "what to check when buying a new monitor" **[SERP]**. The monitor guide's title "Before (and Right After) Buying" sits between these intents without matching any of them.
2. **`oled-burn-in-and-how-to-check-for-it` (L1457) vs `/burn-in-test/`.**
   - The SERP "how to check for burn in on oled tv" contains 4 burn-in *tool* pages (burnintest.org, darkblackscreen.com, screentester.io/burn-in-test, screendetect.com) **[SERP]**.
   - The guide's "How to check" section sends readers to Color Test, Uniformity, Greyscale and Black Level. It mentions the dedicated Burn-in Test only later, under "Burn-in vs temporary retention" [CODE]. So the guide competes with the tool for check intent instead of feeding it.
   - **The guide contradicts itself.** Its excerpt says "spot it early while it's still fixable", but its body says "nothing you run will remove it". The used-phone guide also says "no app fixes it".
3. **`how-to-test-a-laptop-screen-for-dead-pixels` (L197) vs `/dead-pixel-test/`.**
   - "laptop dead pixel test" and "dead pixel test" share 3 URLs and 4 domains, and both SERPs are dominated by tools **[SERP]**.
   - Risk is low to moderate [INFERRED]. The guide is fine as a spoke, but the tool page does show it while hiding the dead-pixel spokes (§1.2).
4. **The bleed trio is not cannibalisation.** This covers what-is-backlight-bleed (L1297), what-is-ips-glow (L1355) and backlight-bleed-vs-ips-glow (L2036), plus /backlight-bleed-test/.

   | Pair | Shared URLs | Verdict |
   |---|---|---|
   | "backlight bleed vs ips glow" ↔ "ips glow" | 3 | interlink |
   | "what is backlight bleed" ↔ "is backlight bleed normal" | 3 | the guide's title already covers both |
   | "what is backlight bleed" ↔ "backlight bleed test" | 1 | separate |

   **[SERP]** Keep all four pages separate. The fix is linking (§1.2).
5. **Pairs checked and found clean.** pwm-flicker-test / what-is-pwm-flicker / why-is-my-screen-flickering share 0 URLs pairwise. contrast-test vs contrast-ratio-explained shares 1. refresh-rate-test vs "how to check monitor refresh rate" vs "144hz monitor only showing 60hz" share 0 pairwise **[SERP]**.
6. **Promise-vs-content mismatch in `dead-pixel-warranty-policies` (L424).**
   - Its excerpt promises "what each major manufacturer accepts". A grep of the body (L424-481) finds **no brand name** [CODE].
   - Meanwhile the SERP for "dead pixel warranty policy" contains:
     - an official Acer page;
     - three "by brand" guides: deadpixel.tools/warranty, monitortest.pro and blackscreen.live **[SERP]**.

---

## 2. Gaps found (SERP evidence)

| Gap | Evidence | Fit |
|---|---|---|
| **Per-brand dead-pixel policy** (Dell, LG, Samsung, Apple) | Each brand SERP shares 0–1 URLs with the generic SERP **[SERP]**. Forum-heavy results (Dell community, anandtech, whirlpool, MSE). Competitor pages: deadpixelcheck.com/articles/{dell,lg}-dead-pixel-policy, greeninblackandwhite.com. Snippets disagree on Dell thresholds, so build from official docs only. | Dead-pixel hub |
| **Return / RMA with dead pixels** | "can I return a monitor with a dead pixel" and "how to rma a monitor" are forum-dominated (LTT, overclock.net, Micro Center community, Amazon Q&A, Steam, anandtech) plus How-To Geek **[SERP]**. Weak competition. | Dead-pixel hub |
| **Device-specific dead-pixel / screen tests** (iPhone, iPad, MacBook, TV) | Competitors run device landing pages: pixeltest.net/en/{iphone,macbook,tv,laptop}-screen-test, deadpixelcheck.com/articles/{dead-pixel-test-iphone, macbook-dead-pixel-check, dead-pixel-test-tv}, deadpixelphone.pro **[SERP]**. Each device SERP shares only 1 URL with "dead pixel test", so Google treats them as separate queries. | Dead-pixel hub plus device guides |
| **Used monitor inspection** | Distinct SERP (0 overlap with new-monitor queries). Results: techcult, displaymaster.dev, screenlab, screentester.net, burnintest.org **[SERP]**. | Device / buying |
| **How to fix burn-in / retention** | GeeksforGeeks, Asurion, mobilepixels, Wikipedia, Play Store "fixer" apps, GitHub burnfix **[SERP]**. Weak and mixed. The site can answer honestly: retention yes, burn-in no. | Burn-in hub |
| **Samsung `*#0*#` phone test menu** | Article-only SERP (drfone, beebom, gadgethacks, techfeezy). No tool sites **[SERP]**. Codes vary by carrier and region (stated in the results). | Phone / touch |
| **TV as a computer monitor** | Strong publishers (PCWorld, Engadget, TechRadar, Tom's Guide, Lenovo, TCL) **[SERP]**. Hard to win, but it is the best context for overscan-test and sharpness-test, which have 2 guides each. | TV / device |
| **Steam Deck screen** | "steam deck dead pixel": Steam Community threads and one blog. "steam deck screen test": news and reviews (Tom's Hardware OLED burn-in at 1,500 h) **[SERP]**. Low competition; demand unknown. | Dead-pixel / burn-in |
| **"monitor test" head term** | "screen test" SERP: 5 of 10 results are non-display (acting, dictionary, Wikipedia). "monitor test" SERP: all display tools. "monitor test" ↔ "display test" share 3 URLs **[SERP]**. The homepage title targets only "screen test" [CODE]. | Pillar |
| **Built-in self-tests** (Dell laptop BIST, Samsung monitor self-test) | dell.com BIST shows up in the "laptop screen test" and "display test" SERPs, and a Samsung self-test page in "how to test a new monitor". The "laptop screen built in self test" SERP is mostly Dell's own pages **[SERP]**. Not worth a page [INFERRED]. Add a step to is-it-my-screen-or-my-graphics-card (L2210), which has none [CODE]. | Troubleshooting |
| **Low-signal, skip for now** | "hdr test" SERP is academic or VESA. "projector test pattern" is Epson, VIOSO and generators. "dead pixel test android" is all app stores **[SERP]**. | none |

---

## 3. Prioritized plan: 12 new pages or merges

Priority order is P1 (do first) to P3. Every page must link to its hub and get at least 3 inbound links. **No primary keyword repeats across rows.**

| # | Type | Page (slug) | Primary query (secondary) | Intent → template | Hub | Links IN (from) | Links OUT (to) |
|---|---|---|---|---|---|---|---|
| 1 | **Upgrade (P1)** | /blog/dead-pixel-warranty-policies/ → "Dead Pixel Policy by Brand: How Many Are Acceptable?" | dead pixel warranty policy (how many dead pixels are acceptable, dead pixel policy) | Informational / commercial → explainer with brand table | /dead-pixel-test/ | dead-pixel-test (after fix A), dead-vs-stuck, laptop, monitor, checklist, #6, #7, #8, #12 | dead-pixel-test, color-test, white-screen, #6, #12 |
| 2 | **Retarget (P1)** | Homepage `/` → title "Free Online Monitor & Screen Test" (H1 mentions monitor); add a link to the checklist | monitor test (online monitor test, display test, screen test) | Transactional (tool hub) → landing | Pillar | site-wide nav and logo | all tools, checklist (new), all device guides incl. #4, #7, #8 |
| 3 | **Merge / refocus (P1)** | how-to-test-a-monitor-before-buying → "How to Test a New Monitor (Day-One Checklist)". Checklist L22 becomes the device-agnostic pillar guide; drop its duplicated ISO and returns text and link #1 / #6 instead. | how to test a new monitor (checklist: "screen test checklist" [INFERRED, not searched]) | Informational how-to → how-to | Pillar / device | home, checklist, laptop, TV, #4 | dead-pixel, backlight-bleed, uniformity, refresh-rate, ghosting tests; #1, #4, #6 |
| 4 | **New (P1)** | /blog/how-to-test-a-used-monitor-before-buying/ | how to test a used monitor before buying (used gaming monitor test) | Informational / commercial → how-to | Device / buying (checklist) | home device grid, checklist, #3, used-phone, laptop | dead-pixel-test, backlight-bleed-test, brightness-uniformity-test, burn-in-test (OLED monitors), refresh-rate-test, ghosting-test, #1 |
| 5 | **New + refocus (P1)** | /blog/how-to-fix-screen-burn-in/ ("Can You Fix Burn-In? Retention vs Burn-In"). Also make the oled-burn-in "How to check" section lead with /burn-in-test/ and fix its excerpt. | how to fix screen burn in (image retention vs burn in) | Informational how-to → how-to | /burn-in-test/ | burn-in-test (FAQ link), oled-burn-in, do-you-still-need-a-screensaver, used-phone, #7, #11 | burn-in-test (checkerboard frame), screensaver, oled-burn-in, #7 |
| 6 | **New (P2)** | /blog/return-monitor-with-dead-pixels/ ("Return, Warranty or RMA?"). Move the "Before you file a claim" and "Making the photo usable" depth here from #1. | can I return a monitor with a dead pixel (how to rma a monitor) | Informational / commercial → how-to | /dead-pixel-test/ | #1, dead-vs-stuck, fix-stuck, #3, laptop, checklist | dead-pixel-test, white-screen, black-screen, #1, how-to-fix-a-stuck-pixel |
| 7 | **New (P2)** | /blog/iphone-dead-pixel-test/ ("iPhone & iPad Dead Pixel and Screen Test") | iphone dead pixel test (ipad dead pixel test, check used iphone screen) | Transactional / informational → how-to with tool CTA | /dead-pixel-test/ + phone | dead-pixel-test, used-phone, home device grid, #9, #1 | dead-pixel-test, burn-in-test, touch-screen-test, pwm-flicker-test, used-phone, #1, #5 |
| 8 | **New (P2)** | /blog/macbook-screen-test/ ("MacBook Screen Test: Dead Pixels, Bleed, Blooming") | macbook screen test (macbook dead pixel test) | Transactional / informational → how-to | /dead-pixel-test/ + laptop | laptop guide, dead-pixel-test, home, #1 | dead-pixel-test, backlight-bleed-test, blooming-test [INFERRED fit: mini-LED MacBook Pro], sharpness-test, laptop, #1 |
| 9 | **New (P2)** | /blog/samsung-screen-test-code/ ("Samsung `*#0*#` Screen Test and Browser Alternatives") | samsung screen test code (`*#0*#`) | Informational how-to → how-to | /touch-screen-test/ + used-phone | used-phone, touch-screen-test (FAQ), #7, cracked-screen | touch-screen-test, dead-pixel-test, burn-in-test, used-phone, #7 |
| 10 | **New (P3)** | /blog/using-a-tv-as-a-computer-monitor/ | using a tv as a computer monitor | Informational → explainer / how-to | TV guide (L136) + overscan / sharpness | TV guide, laptop-external-monitor, ppi guide, overscan-test, sharpness-test | overscan-test, sharpness-test, refresh-rate-test, screen-tearing-test, response-time-vs-input-lag, TV guide |
| 11 | **New (P3)** | /blog/steam-deck-screen-test/ | steam deck dead pixel (steam deck screen test) | Informational how-to → how-to | /dead-pixel-test/ + /burn-in-test/ | dead-pixel-test, #5, #6, checklist | dead-pixel-test, burn-in-test, backlight-bleed-test, #5, #6 |
| 12 | **New (P3, after #1)** | /blog/dell-dead-pixel-policy/. Build only from Dell's official Premium Panel Exchange text. LG, Samsung and Apple are follow-ups. | dell dead pixel policy | Informational / commercial → explainer | #1, under /dead-pixel-test/ | #1, #6, monitor guide | #1, #6, dead-pixel-test |

### Structural fixes (code, not pages; do alongside P1)

- **A. Rank tool-page guides by relevance** (`guides.ts:2600-2602`).
  - Add an optional `primaryTool` field, or score guides by tag match, and show topical spokes first.
  - Fixes the 11 dead-pixel spokes that are currently hidden.
- **B. Drop the generic `"guide"` tag from related-guide scoring** (`guides.ts:2583-2595`).
  - Remove 28 of 130 noise slots.
- **C. Give tool pages an explicit or rotated "Related tests" list** (`[tool]/page.tsx:42-45`).
  - 10 tools currently get 0 links from this module.
- **D. Add contextual body links:**
  - why-is-my-screen-flickering → /pwm-flicker-test/
  - used-phone → /pwm-flicker-test/
  - mini-led-vs-oled and contrast-ratio → /hdr-test/
  - laptop-external-monitor → /frame-skipping-test/ [INFERRED]
  - TV, laptop and used-phone guides ← link each from the checklist and from each other (they currently have 0 in-body inbound links)
- **E. Add a self-test step** (Dell BIST, monitor OSD self-test) to is-it-my-screen-or-my-graphics-card.

### Pre-delivery checks
- No duplicate primary keywords across the 12 rows.
- Every new page links to its hub tool and has at least 3 planned inbound links.
- None of the new pages would be an orphan, because they are listed in /blog/ and the sitemap.
- Word-count targets were not set; there is no volume data to size them against.
- Device pages (#7, #8, #11) carry a **doorway risk** [INFERRED]. Each one must contain substance specific to that device, not a template.

---

## 4. SERP overlap data (pairs with ≥2 shared URLs, n=65)

| Shared URLs | Pair |
|---|---|
| 4 | oled burn in test ↔ oled monitor test |
| 4 | oled burn in test ↔ burn in test |
| 4 | how to check for burn in on oled tv ↔ burn in test |
| 3 | what is backlight bleed ↔ is backlight bleed normal |
| 3 | backlight bleed vs ips glow ↔ ips glow |
| 3 | how to fix a stuck pixel ↔ dead pixel vs stuck pixel |
| 3 | dead pixel test ↔ laptop dead pixel test |
| 3 | monitor test ↔ display test |
| 3 | oled burn in test ↔ how to check for burn in on oled tv |
| 3 | screen test ↔ tv screen test (acting / Wikipedia noise) |
| 3 | online monitor test ↔ laptop screen test |
| 2 | monitor test ↔ online monitor test |
| 2 | monitor test ↔ monitor test online free |
| 2 | display test ↔ monitor test online free |
| 2 | screen test ↔ online monitor test |
| 2 | screen test ↔ laptop screen test |
| 2 | iphone dead pixel test ↔ ipad dead pixel test |
| 2 | how to fix a stuck pixel ↔ stuck pixel fixer |
| 2 | phone burn in test ↔ {phone screen test, oled monitor test, burn in test, oled burn in test} |
| 2 | how to check for burn in on oled tv ↔ oled monitor test |
| 2 | burn in test ↔ oled monitor test |
| 2 | laptop screen test ↔ laptop screen built in self test |

- **Every other pair scored 0 or 1**, including:
  - every device query vs "dead pixel test";
  - every brand-policy query vs the generic policy query;
  - new vs used monitor;
  - all of the PWM, flicker and refresh queries.
- **Most frequent domains** (number of SERPs they appear in):
  - screentester.io: 16
  - us.ktcplay.com: 12
  - xbitlabs.com: 9
  - oledtest.org, screendetect.com, pixeltest.net, darkblackscreen.com, deadpixelcheck.com, burnintest.org: 7 or 8 each
- screentester.io is the closest structural competitor. It runs tool pages plus /tv-screen-test/, /mobile-screen-test/, /monitor-screen-test/ and /flicker-test/.
- Raw SERP URLs: scratchpad `serps.txt`. Full matrix: `matrix.json`.

### Keyword intents (65)

| Intent | Keywords |
|---|---|
| **Transactional / tool** | monitor test, online monitor test, monitor test online free, display test, screen test, dead pixel test, laptop dead pixel test, iphone / ipad / tv / android dead pixel test, macbook screen test, stuck pixel fixer, backlight bleed test, burn in test, oled burn in test, oled monitor test, phone burn in test, refresh rate test, monitor ghosting test, frame skipping test, pwm flicker test, touch screen test, hdr test, is my monitor hdr test, tv / phone / laptop screen test, monitor contrast test, projector test pattern |
| **Informational** | everything else: how-to, what-is, vs, why, policy, RMA |
| **Commercial investigation** | what to check when buying a new monitor, 60hz vs 144hz vs 240hz, used monitor / laptop / iphone before buying |
| **Navigational** | none clustered. "ufo test" was not searched. |

---

## 5. Structured findings for audit-data.json (Content Architecture)

```json
{
  "category": "Content Architecture",
  "findings": [
    {"id":"CA-1","severity":"high","title":"Tool-page Related guides ignores relevance","evidence":"src/lib/guides.ts:2600-2602 takes first 4 by array order; dead-pixel-test hides dead-vs-stuck, fix-stuck, what-causes, warranty; warranty guide shown on 0 tool pages","fix":"rank by primaryTool/tag score"},
    {"id":"CA-2","severity":"medium","title":"Generic 'guide' tag pollutes related guides","evidence":"guides.ts:2583-2595; 23/44 guides tagged 'guide'; 28/130 slots tag-noise; contrast-ratio 12/13 inbound from module","fix":"exclude 'guide' from scoring"},
    {"id":"CA-3","severity":"medium","title":"10 tools never appear in Related tests","evidence":"[tool]/page.tsx:42-45 first-4-of-category","fix":"explicit related list"},
    {"id":"CA-4","severity":"high","title":"Warranty guide promises per-brand data it lacks","evidence":"excerpt vs body guides.ts:424-481; SERP 'dead pixel warranty policy' has 4 by-brand/official pages","fix":"plan item #1"},
    {"id":"CA-5","severity":"medium","title":"Checklist vs monitor-buying guide overlap; monitor guide straddles new/used intents","evidence":"guides.ts L22 vs L76; new vs used monitor SERPs share 0 URLs","fix":"plan items #3, #4"},
    {"id":"CA-6","severity":"medium","title":"OLED burn-in guide competes with /burn-in-test/ for check intent and contradicts itself on fixability","evidence":"guides.ts L1457 how-to-check section; tool-dominated SERP","fix":"plan item #5"},
    {"id":"CA-7","severity":"medium","title":"Homepage pillar targets 'screen test' only","evidence":"page.tsx:17; 'screen test' SERP 5/10 non-display","fix":"plan item #2"},
    {"id":"CA-8","severity":"low","title":"Thinly linked tools/guides","evidence":"1 linking guide: screen-info, frame-skipping, wide-gamut, pwm-flicker, hdr; flickering guide lacks /pwm-flicker-test/ link","fix":"structural fix D"},
    {"id":"CA-9","severity":"info","title":"Site absent from all 65 sampled SERPs","evidence":"WebSearch tool results, not Google-verified","fix":"verify in GSC"}
  ],
  "scorecard": {"tools":28,"guides":44,"orphanPages":0,"toolsWith0LinkingGuides":0,"toolsWith1LinkingGuide":5,"serpPairsAtOrAbove7":0,"plannedItems":12,"cannibalizationConflicts":3}
}
```
