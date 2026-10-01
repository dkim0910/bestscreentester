# Content Quality / E-E-A-T: bestscreentester.com

Audit date: 2026-10-01. Live site = build of `main` (main and dev differ only in CNAME).

Method:
- Fetched all 80 sitemap URLs with `render_page.py --mode never`: all returned 200, about 1 s apart, run sequentially.
- Read `src/lib/tools.ts`, all of `src/lib/guides.ts`, the page templates, `HomeSections.tsx`, about, donate and seo.ts.
- Word counts come from the source (unique copy) and from the live `extracted_text`.
- Labels: anything not checked directly is marked **(inferred)**. Anything checked against an outside source is marked **(verified externally)**.

## Scores

| Metric | Score |
|---|---|
| **Content Quality (overall)** | **64 / 100** |
| E-E-A-T weighted (internal model) | 47.5 / 100 |
| AI-citation readiness | 68 / 100 |

The E-E-A-T breakdown uses the skill's internal weights. These are not Google's.

| Factor | Score | Basis |
|---|---|---|
| Experience (20%) | 35 | Advice is practical and specific. But there are 0 first-person or testing signals and 0 real photos or measurements, and every guide image is a generated title card. |
| Expertise (25%) | 60 | Technical depth is good: GtG vs MPRT, RGB range, DSC bandwidth, ΔE2000. 3 factual errors were verified, and there are no author credentials. |
| Authoritativeness (25%) | 30 | The 44 guides contain 0 outbound citations. No author is named, and no external recognition is shown. |
| Trustworthiness (30%) | 60 | Present: privacy and terms pages, mailto contact, HTTPS, an honest "not a substitute for calibration" note, and no fake ratings. Against it: an anonymous operator, stale counts on /donate, and homepage claims that contradict the guides. |

## What works
- **Guides are genuinely useful.** They are specific and non-generic: tables, exact menu paths, numbers (bandwidth, PPI, nits) and "what it isn't" sections. Text duplication is low: the highest shared 6-gram rate between any two guides is 6.4%.
- **Readability fits a consumer audience.**
  - Guides: median Flesch 69.4, FK grade 7.3, 14.5 words per sentence.
  - Tools: median Flesch 68.6, FK grade 8.0.
- **Plugin `content_quality.py` result:** 0 filler matches and 0 AI-pattern matches on all 80 pages. Overall scores range from 67 to 94.
- **Internal linking is dense.** Every guide links to between 2 and 11 tools and to at least 1 other guide.
- **Freshness is honest.** Each guide shows its published date plus an updated date. The `updatedAt` values (2026-08-27 and 2026-10-01) match real commit dates (f769207, cb1d550, 5d9b89f, d65558f). I checked commit dates only, not the per-guide diffs.
- **Metadata is not templated.** `metadata_template.py` over 80 pages: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`.

## Thinnest pages

**Tool pages.** "Unique copy" is title + tagline + howTo + FAQ + tips from tools.ts. The live extracted text also includes the shared Related tests and Related guides cards.

| Tool | Unique words | Live extracted words | Unique 5-gram share |
|---|---|---|---|
| white-screen (tools.ts:113-134) | 90 | 295 | 41% |
| black-screen (tools.ts:91-112) | 97 | 298 | 29% |
| contrast-test (tools.ts:433-455) | 103 | 328 | 37% |
| greyscale-test (tools.ts:162-184) | 113 | 328 | 33% |
| ghosting-test (tools.ts:260-282) | 117 | 296 | 43% |

Across all tools: unique copy runs from 90 to 268 words. On 12 of the 28 tool pages, less than 50% of the main text is unique to that page. 14 tools have only 1 FAQ.

**Guides.** All 44 are below the 1,500-word blog floor. They total 36,641 words, with a median of 819 and a range of 681 to 975.

| Guide | Body words | Live extracted words |
|---|---|---|
| do-you-still-need-a-screensaver (guides.ts:2457) | 681 | 699 |
| harmless-screen-pranks (guides.ts:2509) | 689 | 711 |
| cracked-screen-glass-or-lcd (guides.ts:2396) | 729 | 761 |
| what-is-ips-glow (guides.ts:1355) | 747 | 780 |
| is-it-my-screen-or-my-graphics-card (guides.ts:2210) | 752 | 797 |

**Static pages:**
- /about: 220 words (About floor is 400).
- /donate: 94 words.
- /feedback: 31 words.
- Homepage: 1,284 words (passes).

## Findings

### HIGH-1: No named author or operator anywhere (E-E-A-T, Trust)
**Evidence:**
- The guide byline is `By {SITE_NAME}` (`src/app/blog/[slug]/page.tsx:125`).
- Article JSON-LD sets the author as an Organization (`src/lib/seo.ts:203`).
- The /about meta description promises "who builds and maintains the tools" (`src/app/about/page.tsx:7`), but the body never names anyone (about/page.tsx:12-60).
- Only /donate says "one solo developer" (`src/app/donate/page.tsx:22`).
- /about is 220 words.

**Fix:**
1. Add a "Who makes this" section to about/page.tsx, before the `<h2>A note on accuracy</h2>` at line 45. It should give a real name or a consistent pen name, the person's display-testing background, and what hardware the tests were checked on.
2. Add `author?: string` to the `Guide` interface (`src/lib/guides.ts:5-17`).
3. Render that author in the byline at blog/[slug]/page.tsx:125 and pass `authorName` to `articleJsonLd` (page.tsx ~line 85).
4. Either deliver what the about meta description promises, or reword it.

### HIGH-2: Zero citations in 44 guides that cite standards (Authoritativeness)
**Evidence:** `grep -c "](http" src/lib/guides.ts` returns 0. Meanwhile the guides name:
- ISO 9241-307 (guides.ts:251, 316, 434)
- VESA DisplayHDR (guides.ts:1655-1657, 2392)
- Rec. 2020 (guides.ts:562)
- D65 (guides.ts:782, 825)
- Apple parts history (guides.ts:1983)

**Fix:** Add 1–3 source links per standards claim, inline in guides.ts. Suggested sources:
- ISO catalogue page for 9241-307 at :434
- displayhdr.org tier table at :1655
- ITU-R BT.2020 at :562
- support.apple.com/en-us/102658 at :1983

This lifts both trust and AI-citation readiness.

### HIGH-3: Factual errors (Expertise, Trust)
1. **ISO class structure is wrong** (guides.ts:444). The guide describes ISO 9241-307 as Class I as strictest, then "Class III and IV". Wikipedia's ISO 9241 summary lists Class 0 (zero defects) through Class 3, with no Class IV (**verified externally**, secondary source; confirm against the standard). Class IV belonged to the older ISO 13406-2.
   - **Fix:** rewrite :444 as "Class 0 (no faults) … Class 3", and keep the 13406-2 mention at :434 as history.
2. **iPhone parts-history claim is wrong** (guides.ts:1983). The guide says "iPhone 11 and earlier show battery history only". Apple support 102658 lists **Display** for iPhone 11 models too; only XR, XS and SE 2/3 are battery-only (**verified externally**).
   - **Fix:** change it to "flagged on iPhone 11 and newer".
3. **The Color Gradient Test claims gamut checking it cannot do.** It claims DCI-P3 / gamut coverage in four places: tools.ts:189 tagline, :191 description, :194 keywords `gamut test`, `dci-p3`, and HomeSections.tsx:29 and :177. But `colorGradient` draws sRGB hex stops on a default canvas (`src/components/tools/patterns.ts:23-46`), so it cannot show any color outside sRGB.
   - **Fix:** drop the gamut and P3 wording in those places and link to /wide-color-gamut-test.
4. **Homepage response-time figures are wrong** (`HomeSections.tsx:39`: "IPS ~1ms, VA ~4–15ms"). The guides themselves call 1 ms a best-case marketing figure (guides.ts:988, 1011) and say IPS has "some dark-transition smear" (guides.ts:1026).
   - **Fix:** remove the ms figures.

### MEDIUM-1: Homepage advice contradicts tools and guides (Trust)
- **Dark room.** HomeSections.tsx:130 says "Only backlight-bleed testing needs darkness." Other pages say otherwise:
  - tools.ts:294 (blooming): "Dim the room"
  - tools.ts:467 (black level): "Dim the room"
  - tools.ts:891 (wide gamut): "dim room"
  - guides.ts:30 (checklist): "in a dimly lit room"
  - **Fix:** say dark for bleed, blooming and black level, and normal light for everything else.
- **Warm-up time.** HomeSections.tsx:135 says "Warm up 15–30 min … at least 15 minutes". The guides vary:
  - guides.ts:30: "five minutes"
  - guides.ts:96 and :156: "20-30 minutes"
  - guides.ts:785: "at least 30 minutes" (calibration)
  - **Fix:** pick one figure for defect testing (for example 15 min) and keep 30 min for calibration only.

### MEDIUM-2: Stale counts on /donate (Trust)
**Evidence:** `src/app/donate/page.tsx:8` says "all 20 screen tests", and :23 has `{21}+ screen tests`. The live count is 28.

**Fix:** import `TOOLS` and use `TOOLS.length`, as page.tsx:19 already does.

### MEDIUM-3: Headlines and excerpts promise more than the bodies deliver
1. The stuck-pixel title says "4 Methods That Actually Work" (guides.ts:324), but the body says "There's no technique that reliably fixes them" (guides.ts:367).
   - **Fix:** retitle to "How to Fix a Stuck Pixel: 4 Methods Worth Trying".
2. The burn-in excerpt says "spot it early while it's still fixable" (guides.ts:1460), but the body says burn-in is permanent (guides.ts:1502-1506).
   - **Fix:** "…how to tell temporary retention from permanent burn-in."
3. The stuck-pixel guide says "the pixel is likely dead, not stuck" (guides.ts:370). That contradicts its own test at :335, where a pixel black on every color is dead.
   - **Fix:** "…it's unlikely to recover."

### MEDIUM-4: Thin, partly boilerplate tool pages
**Evidence:** see the table above. Unique copy is 90–268 words, and 14 tools have a single FAQ: white, black, contrast, greyscale, ghosting, refresh-rate, color-gradient, screensaver, viewing-angle, blooming, gamma, screen-tearing, black-level, fake-broken. Tool pages are utilities, so word count is not the goal. What is missing is help reading the result.

**Fix:** in tools.ts, add a short "What your result means" set: 2–3 more `faq` items plus 1–2 `TOOL_TIPS`. Start with white-screen (:113-134, :801-804), black-screen (:91-112, :797-800), contrast-test (:433-455, :845-848), greyscale-test (:162-184, :809-812) and ghosting-test (:260-282, :825-828). Keep FAQPage schema as Info only.

### MEDIUM-5: No first-hand experience signals
**Evidence:**
- No in-body images: 0 `![` in guides.ts.
- The guide hero is a generated title card, but its alt text says "illustrated diagram" (`blog/[slug]/page.tsx:117`).
- No "tested on <model>" notes and no measured readings.

**Fix:**
- Add real phone photos (exposure-locked, as the guides themselves recommend) of: bleed vs glow (guides.ts:2036), a stuck sub-pixel (guides.ts:262), the PWM pencil test (guides.ts:1530), and DSE on the Panning gray frame (guides.ts:169).
- Add one-line test notes such as "checked on a 27-inch IPS / OLED phone".
- Change the alt at page.tsx:117 to describe a title card.

### MEDIUM-6: Cannibalisation pairs
All of these are overlapping intent, not duplicate text.

| Pair | Evidence | Fix |
|---|---|---|
| /color-gradient-test vs /wide-color-gamut-test | gradient keywords `gamut test`, `dci-p3` (tools.ts:194) vs `color gamut test`, `dci-p3 test` (tools.ts:705) | Remove the gamut keywords and claims from the gradient tool (tools.ts:189-194, 205) |
| /greyscale-test vs /gamma-test | greyscale keyword `gamma test` (tools.ts:171) is gamma-test's primary query | Replace with `banding test` |
| /black-screen vs /backlight-bleed-test | Same black field. Both descriptions lead with bleed (tools.ts:97 vs 141), and `ips glow` is shared by bleed and black-level (tools.ts:144, 465) | Point black-screen copy at OLED, dust and dimming uses. Drop `ips glow` from black-level-test |
| /color-test vs /dead-pixel-test | Both cycle solid colors "to … find pixel defects" (tools.ts:70 vs 38) | Rewrite color-test copy around tint and uniformity |
| Guides what-is-backlight-bleed / what-is-ips-glow / backlight-bleed-vs-ips-glow, plus /backlight-bleed-test | TF-IDF cosine 0.25–0.32 (the highest in the set). 51 shared 6-grams between ips-glow and bleed-vs-glow. The same "lean left/right", "first thirty seconds" and "not a phone camera" passages appear in all three | Make backlight-bleed-vs-ips-glow (guides.ts:2036) the comparison page. Cut the comparison sections in what-is-backlight-bleed (guides.ts:1329-1334) and what-is-ips-glow (guides.ts:1364-1374) down to one-line pointers |
| refresh-rate-explained vs how-to-enable-full-refresh-rate | cosine 0.286 | Low risk: explainer vs how-to. Keep as is |

### LOW-1: AI-typical phrasing
- **Homepage marketing copy.** HomeSections.tsx:161-217 and :96 use generic, absolute claims: "Pixel-perfect precision", "leave no defect undetected", "every display-quality metric in one place", "every quality dimension", "comprehensive OLED-specific coverage". These are overclaims; the site has no input-lag or measured-response tools.
  - **Fix:** use concrete, bounded statements.
- **Guide tics:**
  - 12.1 em dashes per 1,000 words.
  - "Here's" in 15 of 44 excerpts.
  - "return window" 24 times; most guides close on a return-window or photograph-it line.
  - Repeated sentences across the bleed/glow cluster.
  - Not penalising on its own; vary closings and excerpts while editing.

### LOW-2: Description openers
27 of 28 tool descriptions start "Free <title>…". The heuristic clears this (no stock CTA), but a few could lead with the problem the user has, for example tools.ts:119 and :97.

### INFO
- **Out of scope here, for the schema owner:** tool pages still emit HowTo JSON-LD (`src/app/[tool]/page.tsx:54`).
- Tool pages show no visible date. htmldate falls back to 2026-01-01 on them **(inferred)**.

## AI-citation readiness (68)
- **Strengths:**
  - Most guides open with a one-sentence definition (e.g. guides.ts:1304, 954, 1516).
  - Clear H2 hierarchy, comparison tables and numbered steps.
  - Concrete numbers that are easy to quote.
- **Gaps:**
  - No sources (HIGH-2).
  - No named author (HIGH-1).
  - The tool-page FAQs are 1–3 short answers.
