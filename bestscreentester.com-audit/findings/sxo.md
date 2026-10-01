# SXO Findings: bestscreentester.com (complete)

Audit date: 2026-10-01. Category: Search Experience. **The SXO Gap Score is separate from the SEO Health Score.**

## Method and data provenance
- **Our pages:** rendered with `render_page.py --mode always` (Playwright Chromium) and parsed with `parse_html.py`. Pages: `/`, `/dead-pixel-test/`, `/refresh-rate-test/`, `/backlight-bleed-test/`, `/black-screen/`, `/white-screen/`. All returned 200 with 0 console errors. Above-the-fold views were checked with `capture_screenshot.py` (desktop 1920x1080, mobile 375x812 @2x).
- **SERPs:** the WebSearch tool returned 9-10 results per query for "dead pixel test", "screen test", "refresh rate test", "monitor hz test", "backlight bleed test", "black screen", "white screen" and "monitor test". **This is not a live Google SERP.** A direct Google fetch was blocked, so there is **no PAA, AI Overview, ads, featured-snippet or related-search data**. Any user story that depends on those signals instead cites result titles and snippets.
- **Competitors:** 25 competitor pages were rendered with the same tooling (word count, headings, JSON-LD), plus 14 desktop screenshots.
- **Our rankings:** bestscreentester.com did **not** appear in the returned results for any of the 8 queries. It appeared only for the brand query "bestscreentester.com".
- Labels: **[verified]** means read in code or rendered output. **[inference]** means a judgment call.

## Per-query SERP summary

| Query | SERP page type (consensus) | Top 3 competitors (tool-type) | Our page / gap |
|---|---|---|---|
| dead pixel test | **Tool**, 8/9 results are browser tools and 1 is a Play Store app (~89%) | testufo.com/deadpixel, darkblackscreen.com/dead-pixel-test, xbitlabs.com/dead-pixel-test (also deadpixeltest.org, screentester.io) | /dead-pixel-test/: ALIGNED. The tool is above the fold on desktop and mobile. Gaps: no click-a-colour swatch grid (deadpixeltest.org, xbitlabs and screentester.io all have one), the stuck-pixel fixer is buried as frame 10, no resolution/screen-info readout, no result capture, 493 words vs 1,425 (deadpixeltest.org) and 1,008 (screentester.io) |
| screen test | **Split intent.** 6/10 are the film/audition meaning (Merriam-Webster plus 4 Wikipedia pages) and 4/10 are tool hubs, plus 1 app. Tool share is ~40% | testmyscreen.com, screentester.io, screendetect.com (also screentest.cc) | Homepage: Tool hub, aligned with the tool slice. Gaps: H1 lacks "screen test"/"monitor test", the hero CTA navigates away instead of starting a test, mobile has no test above the fold, and the long-form copy paraphrases screentester.io (Finding 1) |
| monitor test (homepage check) | **Tool hub**: 6/9 browser tool hubs, 2 downloadable software (PassMark, EIZO), 1 noise | thedisplaytest.org (3,547 words), tft.vanity.dk, screentest.io/monitortest.im (2,852 words) | Same homepage gaps as above. "monitor test" appears only in meta keywords (page.tsx:23) and as "Monitor screen test" (HomeSections.tsx:95) |
| refresh rate test / monitor hz test | **Tool**: 7/9 tools, 2 Wikipedia/1 blog (~78%) | xbitlabs.com/monitor-hz-test, fpstest.org/refresh-rate-test, testufo.com/refreshrate (also whatismyrefreshrate.com, screentester.io) | /refresh-rate-test/: ALIGNED type. Gaps: the result is a single rounded integer, while competitors show frame time, jitter/confidence, decimals, closest standard, skipped frames, display info and PDF report/re-test. The readout is dimmed by the preview scrim. 348 words and 1 FAQ |
| backlight bleed test | **Hybrid Tool + guide**: 6/9 tool pages with explainer copy, 3/9 how-to articles (displayninja, ktcplay, hashnode) | darkblackscreen.com/backlight-bleed-test, xbitlabs.com/backlight-bleed-test, frameratetest.com/screen-bleeding-test (displayninja is #1 overall but is an article) | /backlight-bleed-test/: ALIGNED, MEDIUM depth gap. 390 words, no example images of bleed vs IPS glow, only black/near-black frames |
| black screen | **Mixed.** 5/9 are troubleshooting ("black screen of death": Wikipedia, Lenovo, HP, AskLeo, AVG), 3/9 tools, 1 app | blackscreen.space, fullblackscreen.com, blackscreen.cc | /black-screen/: Tool. MEDIUM mismatch with the troubleshooting half, which is unserved. Utility gap vs tools: no colour row, no presets/download, 1 FAQ, 322 words |
| white screen | **Tool**: 8/9 tools plus 1 app (~100% utility) | darkblackscreen.com/white-screen, blackscreen.space/white-screen, whitescreen.im (also whitescreen.tv) | /white-screen/: ALIGNED type. Biggest UX gap: the inline preview shows a **grey** box. Also no presets (Zoom lighting, cleaning, reading light), no colour row, no download. 319 words vs 3,066 (whitescreen.im) |

Our verified tool-page template (`src/app/[tool]/page.tsx:89-188`) is: breadcrumb > category label > H1 > tagline > `ToolRunner` (16:9 preview with "Start full-screen test") > How to use + FAQ > Tips > Related tests > Related guides. The order matches the Tool taxonomy ("tool interface above fold > brief instructions > FAQ > related tools").

## Page-type mismatch verdict
- dead-pixel-test, refresh-rate-test, white-screen: **ALIGNED** (Tool vs Tool).
- backlight-bleed-test: **ALIGNED/MEDIUM**. The SERP rewards tool plus explanation. We are tool-first with a thin explanation.
- black-screen: **MEDIUM**. About half the SERP is the "my PC shows a black screen" troubleshooting intent. Don't retarget; add an exit path.
- Homepage for "screen test": **MEDIUM**. The ambiguous SERP is mostly the film meaning. Our tool-hub slice is aligned, but the page is not differentiated from screentester.io (Finding 1).

## SXO Gap Scores (per page, 100 pts)

| Page | Type /15 | Depth /15 | UX /15 | Schema /15 | Media /15 | Authority /15 | Fresh /10 | **Total** |
|---|---|---|---|---|---|---|---|---|
| /dead-pixel-test/ | 13 | 8 | 9 | 13 | 6 | 6 | 5 | **60** |
| /refresh-rate-test/ | 12 | 6 | 7 | 13 | 5 | 6 | 5 | **54** |
| /backlight-bleed-test/ | 12 | 7 | 9 | 13 | 4 | 6 | 5 | **56** |
| /black-screen/ | 9 | 5 | 8 | 13 | 4 | 6 | 5 | **50** |
| /white-screen/ | 12 | 5 | 6 | 13 | 4 | 6 | 5 | **51** |
| / (screen/monitor test) | 11 | 12 | 10 | 9 | 6 | 4 | 5 | **57** |

Evidence behind the scores:
- **Schema:** every tool page renders WebApplication+Offer, HowTo, FAQPage and BreadcrumbList (page.tsx:52-87). The homepage has Organization, WebSite and FAQPage only.
- **Depth:** parse_html word counts include nav and footer.
- **Media:** no explanatory images or video on any tool page. 5-6 images found are logo/OG/hover previews.
- **Authority:** no author, methodology or "how we measure" block. Homepage copy is derivative (Finding 1).
- **Freshness:** htmldate reads 2026-01-01 on every page and there is no visible updated date. Competitors show 2026-06/08 dates (xbitlabs 2026-06-21, deadpixeltest.org 2026-08-01, thedisplaytest.org 2026-08-19).

## User stories (derived from result titles and snippets; no PAA available)
1. **Awareness, dead pixel.** As a new-monitor owner, I want to tell dead pixels from stuck ones, because I'm worried the panel is faulty, but I'm blocked by not knowing what a defect looks like. *(Signals: testufo "Dead Pixel **Simulator**"; snippet "If a pixel stays completely black always, it's a dead pixel... stuck on a single color".)*
2. **Decision, dead pixel.** As a buyer inside a return window, I want proof of the defect, because returns/RMA depend on it, but I'm blocked by having no record of what I found. *(Signals: snippet "assist purchases and product returns (RMA)"; deadpixeltest.org H2 "How common are dead pixels on your brand?")*
3. **Consideration, fix.** As someone with a stuck pixel, I want to try to fix it right now, because a replacement is a hassle, but I'm blocked by the fixer being hard to find. *(Signals: titles "Check & **Fix**" (xbitlabs), "Stuck Pixel **Fix**" (benrilab), "Dead Pixels Test **and Fix**" (Play), deadpixeltest.org "Dead Pixel Fixer", fpstest nav "Pixel Fixer".)*
4. **Decision, Hz.** As a gamer who bought a 144/240 Hz monitor, I want to confirm it actually runs at that rate, because I suspect it's stuck at 60, but I'm blocked by not knowing why it is wrong or how to fix it. *(Signals: snippet "rarely run at their advertised speed... cables and browser settings often lock them at 60Hz"; ktcplay "Verify True Hz Output"; fpstest H2 "Why Your Monitor May Run at the Wrong Refresh Rate", "Can Your Cable Carry That Refresh Rate?")*
5. **Utility, white/black.** As a video-call user, I want a one-tap light or backdrop, because my lighting is bad, but I'm blocked by tools that only show a single plain colour. *(Signals: snippet "most popular use of a white screen is as an instant key light... Zoom, Teams, Meet"; whitescreen.tv presets "Zoom Lighting / Screen Cleaning / Reading Light / Night Light"; blackscreen.space title "Focus, Zoom, and Eye Comfort".)*
6. **Awareness, troubleshooting.** As a PC user whose screen went black, I want to fix it, but a "black screen" tool page doesn't help me. *(Signals: 5/9 "black screen" results are fix articles: Wikipedia BSoD, Lenovo, HP, AskLeo, AVG.)*

## Persona scores (sorted weakest first)

| Persona (signal) | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Black-screen troubleshooter (story 6) | 4 | 6 | 10 | 4 | **24** | Critical mismatch (low value; small fix only) |
| Video-call / utility user (story 5) | 12 | 14 | 12 | 10 | **48** | Needs work |
| Stuck-pixel fixer (story 3) | 18 | 12 | 14 | 12 | **56** | Needs work |
| Phone/tablet checker (Play apps in 2 SERPs; deadpixeltest.org phone section) | 16 | 16 | 12 | 12 | **56** | Needs work |
| Gamer verifying Hz (story 4) | 20 | 18 | 12 | 10 | **60** | Good |
| Return-window buyer (stories 1-2) | 22 | 20 | 12 | 12 | **66** | Good |

Systemic weak dimensions are **Trust** (no methodology, author or evidence) and **Action** (the test ends at Esc, with no "what next / record it / fix it" step).

## Prioritized findings

### 1. HIGH: Homepage long-form copy paraphrases a ranking competitor (screentester.io) [verified]
- **Evidence:**
  - Our HomeSections H2 sequence matches screentester.io's homepage almost exactly: "Free online screen tester / Why choose X? / How to get started / Core testing tools / Screen troubleshooting guide / Device inspection guides / Frequently asked questions / Pixel-perfect precision for every screen".
  - 423 of 1,417 (29.9%) six-word shingles in our HomeSections text (including footer) appear verbatim on screentester.io.
  - Example of matching copy. Their text: "We render pure color patterns in browser fullscreen, directly driving GPU output to every physical pixel". Ours, at HomeSections.tsx:110: "We render pure color patterns in browser fullscreen, driving GPU output to every physical pixel".
  - Other matching passages: Core tools blurbs (HomeSections.tsx:5-46), troubleshooting (48-89), FAQ (107-132), tips (134-141).
  - screentester.io ranks for screen test, dead pixel test, refresh rate test, backlight bleed test and monitor hz test.
  - Tool pages are original (≤0.4% overlap with any competitor).
- **[inference]** Their htmldate is 2026-04-05. Our file's first commit is 2026-06-21 (`git log`), so ours is likely the derivative. That means near-zero information gain for "screen test"/"monitor test".
- **Fix:** rewrite `src/components/HomeSections.tsx:5-141` (data arrays) and the section scaffolding at `:157-387` with original, first-hand material: our own test methodology, real photos/measurements, our own return-threshold guidance. Drop the mirrored section order.

### 2. HIGH: White screen preview looks grey; black/white pages lack the utility features the SERP rewards [verified]
- **Evidence:**
  - The inline launcher lays a `bg-black/40` scrim over every preview (`src/components/tools/FullscreenStage.tsx:260`), so `/white-screen/` shows a grey 16:9 box (desktop screenshot).
  - Black/white are single-frame cyclers (`src/components/tools/ToolRunner.tsx:49-53`).
  - Competitors offer the following, above the fold:
    - whitescreen.tv: a 10-colour row, presets (Zoom Lighting/Screen Cleaning/Reading Light/Night Light), a keep-awake checkbox, "Open on all screens" and resolution download.
    - blackscreen.space: a colour row, size selector and download.
    - blackscreen.cc: a "Press F" shortcut.
- **Fix:**
  - (a) For solid-colour tools, render the preview without the scrim and put the Start button in its own pill. Make the scrim conditional in `FullscreenStage.tsx:256-261`.
  - (b) Add a swatch row and presets (warm/cool white for lighting, dim grey) to `ToolRunner.tsx:49-53`, reusing the `QuickColors.tsx:27-42` + `start(i)` pattern.
  - (c) Add 3-4 FAQs at `src/lib/tools.ts:106-111` and `:128-133`. Each page has 1 FAQ today.

### 3. HIGH: Refresh-rate result is thinner than every tool competitor [verified]
- **Evidence:**
  - Output is one integer, `Math.round(1000 / median)` over 60 frames (`src/components/tools/useRefreshRate.ts:22-24`), displayed alone (`RefreshRateTool.tsx:23-28`) and dimmed by the scrim (`FullscreenStage.tsx:260`).
  - Competitors show more:
    - xbitlabs: frame time 16.67 ms, confidence 98%, jitter variance, 60/144/240 spectrum, re-calibrate.
    - testufo: 3-decimal Hz, fps and a READY state.
    - fpstest: skipped frames, min/max interval, closest standard, resolution/DPR/colour depth.
    - whatismyrefreshrate: display info, re-test, Download PDF Report.
  - Only 1 FAQ (`tools.ts:253-258`).
- **Fix:**
  - Have `useRefreshRate` return `{hz, frameMs, min, max, jitter}`.
  - Show decimals, frame time and "closest standard: 144 Hz" inline without the scrim.
  - When the measured rate is ≤61 Hz, add a "Stuck at 60 Hz?" callout linking `/blog/how-to-enable-full-refresh-rate-windows-mac` (the guide exists, per HomeSections.tsx:81).
  - Add FAQs: cable limits, battery throttling, Safari 60 fps cap.

### 4. MEDIUM: Dead pixel test hides colour choice and the fixer [verified]
- **Evidence:**
  - Colours are picked only via the ←/→ picker (`FullscreenStage.tsx:265-287`).
  - The stuck-pixel fixer is the last of 10 frames (`DeadPixelTool.tsx:116-121`), mentioned only in how-to step 5 (`tools.ts:46`).
  - deadpixeltest.org ("Or pick a color to start the test with it"), xbitlabs (9-colour "Signal source" plus "Pixel Repair") and screentester.io (12-colour picker, custom hex, screen-info panel, shortcut table) expose these as one-click entries.
- **Fix:**
  - In `src/components/tools/DeadPixelTool.tsx:115-131`, add a swatch row under the stage that calls `start(i)` (needs a `ref`, as in QuickColors.tsx:10, 45-54).
  - Add a "Fix a stuck pixel" button that calls `start(SOLID_COLORS.length)`.
  - Optionally add a resolution/DPR line (reuse `readInfo` from ScreenInfoTool.tsx).

### 5. MEDIUM: No result capture or "next step" (systemic Action/Trust gap) [verified absence]
- **Evidence:** no tool records an outcome. The session ends on Esc (`FullscreenStage.tsx:145-148`). Competitors offer "Download PDF Report"/"Share Feedback" (whatismyrefreshrate) and brand defect statistics (deadpixeltest.org).
- **Fix:** add a client-only post-test panel below `ToolRunner` (`src/app/[tool]/page.tsx:108`). It should ask "Found something?", offer a copyable summary (date, resolution, measured Hz, defect notes) and link the return/fix guide. No backend is needed.

### 6. MEDIUM: No keyboard shortcut to start the test [verified]
- **Evidence:** keys are handled only while the stage is active (`FullscreenStage.tsx:141-143`). The hint text never offers a start key (`:225-231`). screentester.io advertises "F: enter fullscreen" and blackscreen.cc shows "Press F".
- **Fix:** add a `keydown` listener when `!active && !hideLauncher` that maps `f`/Enter to `start(index)`, and show "Press F" in the hint.

### 7. MEDIUM: Homepage under-targets "screen test"/"monitor test" and has no instant test on mobile [verified]
- **Evidence:**
  - The H1 "Test your screen in seconds — right in your browser" (`src/app/page.tsx:41-43`) contains neither phrase. The title is fine: "Free Online Screen Test" (`:17,29`).
  - The hero CTA navigates to /dead-pixel-test (`:49-54`) instead of starting a test.
  - QuickColors (`:66-68`) is above the fold on desktop but below the fold on mobile (screenshot).
  - Competing hubs lead with an instant test: thedisplaytest.org H2 "Run Your Free Display Test Now", monitortest.im "Start with the real patterns".
  - Homepage schema has no WebApplication/ItemList.
- **Fix:**
  - H1: "Free Online Screen Test & Monitor Test".
  - Move QuickColors into the hero (or make the primary CTA call a stage `start()`).
  - Add an ItemList of tools to the homepage JSON-LD.

### 8. MEDIUM: Tool pages are thin against SERP leaders [verified]
- **Evidence:**
  - Our word counts: 319-493.
  - Competitors: deadpixeltest.org 1,425, fpstest 1,203, screentester.io/dead-pixel-test 1,008, whitescreen.im 3,066, whitescreen.tv 1,042, darkblackscreen bleed 600.
  - testufo ranks with ~5 words, so depth is not decisive for pure tools [inference].
  - The backlight-bleed page has no example imagery. displayninja (#1) and darkblackscreen explain bleed vs IPS glow with visuals.
- **Fix:**
  - Add a "Reading your result / what's normal" block after ToolRunner (`page.tsx:110`), sourced from a new optional `results` field in `ToolDef` (`tools.ts:11-22`).
  - Add 2 annotated photos (bleed vs glow) for backlight-bleed-test.
  - Add dim-grey frames to `ToolRunner.tsx:55-64`.

### 9. LOW: "black screen" troubleshooting half of the SERP is unserved [verified SERP, inference on value]
- **Fix:** don't retarget. Add one line under the tagline ("Screen going black on its own? → guide") with a short troubleshooting guide in `src/lib/guides.ts`. Low priority; the traffic doesn't match the product.

### 10. LOW: Phones get an in-page overlay, not true fullscreen [verified code; device behaviour not tested]
- **Evidence:** `src/lib/fullscreen.ts:11` notes fullscreen "can be blocked (e.g. iOS Safari)". The fallback is a `fixed inset-0` overlay (`FullscreenStage.tsx:241`), so browser chrome stays visible. deadpixeltest.org serves full-screen videos for phones.
- **Fix:** consider a phone-only "play full-screen video" option for dead-pixel and white/black screens.

## Positives (keep)
- The tool is above the fold with one-click start on desktop and mobile for every tool page checked.
- Static HTML includes H1, how-to and FAQ text.
- Rich schema (WebApplication/HowTo/FAQ/Breadcrumb) is on every tool page.
- Zero console errors.
- The refresh-rate preview already measures Hz inline (60 Hz in headless).

## Notes and limitations
- No Google SERP features (PAA, AI Overview, ads, snippets, related searches) could be observed. WebSearch results may not match Google US rankings, and our absence from them is not a verified Google ranking.
- screendetect.com (403 Cloudflare) and fullblackscreen.com (429) could not be fetched. xbitlabs monitor-hz-test rendered 0 words via the parser, but its screenshot was captured.
- No search-volume data, so persona weights are qualitative.
- No real-device testing (iOS fullscreen, high-Hz monitors). Headless measured 60 Hz.
- `bestscreentester.com-audit/screenshots/home/*.png` (captured by another agent) show a "This page couldn't load" error. My Playwright re-render and re-capture of `/` at 21:37 rendered normally with 0 console errors, so treat those two files as a capture artifact and re-shoot them.
- Cross-skill follow-ups:
  - `/seo content` for E-E-A-T and the originality rewrite (Finding 1).
  - `/seo schema` for homepage ItemList.
  - `/seo page` for thin tool pages.

## Structured findings (audit-data.json, category "Search Experience")
```json
[
 {"id":"sxo-1","severity":"high","title":"Homepage long-form copy paraphrases screentester.io","evidence":"Identical H2 sequence; 29.9% of HomeSections 6-gram shingles verbatim on screentester.io","fix":"Rewrite src/components/HomeSections.tsx:5-141,157-387 with original content"},
 {"id":"sxo-2","severity":"high","title":"White screen preview renders grey; black/white lack colour row/presets","evidence":"FullscreenStage.tsx:260 bg-black/40 scrim; ToolRunner.tsx:49-53 single colour; whitescreen.tv/blackscreen.space offer swatches, presets, download","fix":"Conditional scrim FullscreenStage.tsx:256-261; swatches+presets in ToolRunner.tsx:49-53; FAQs tools.ts:106,128"},
 {"id":"sxo-3","severity":"high","title":"Refresh-rate result is a single rounded integer","evidence":"useRefreshRate.ts:22-24; RefreshRateTool.tsx:23-28; competitors show frame time, jitter, decimals, closest standard, report","fix":"Return richer stats from useRefreshRate; show unscrimmed; add 60Hz-stuck callout + FAQs tools.ts:253"},
 {"id":"sxo-4","severity":"medium","title":"Dead pixel colour choice and stuck-pixel fixer not one-click","evidence":"FullscreenStage.tsx:265-287 arrow picker; fixer is frame 10 DeadPixelTool.tsx:116-121","fix":"Swatch row + 'Fix a stuck pixel' button in DeadPixelTool.tsx:115-131"},
 {"id":"sxo-5","severity":"medium","title":"No result capture / next step after a test","evidence":"Session ends on Esc FullscreenStage.tsx:145-148; competitors offer PDF report/share","fix":"Client-only post-test summary panel after ToolRunner at src/app/[tool]/page.tsx:108"},
 {"id":"sxo-6","severity":"medium","title":"No keyboard shortcut to start fullscreen","evidence":"Key handler only when active FullscreenStage.tsx:141-143","fix":"F/Enter starts stage when inactive; update hint :225-231"},
 {"id":"sxo-7","severity":"medium","title":"Homepage H1 lacks 'screen test'/'monitor test'; no instant test on mobile","evidence":"page.tsx:41-43 H1; hero CTA navigates :49-54; QuickColors below fold on mobile","fix":"New H1; move QuickColors into hero; add ItemList JSON-LD"},
 {"id":"sxo-8","severity":"medium","title":"Tool pages thin vs SERP leaders","evidence":"319-493 words vs 1,000-3,000 for deadpixeltest.org, fpstest, whitescreen.im","fix":"Add 'Reading your result' block after page.tsx:110 via new ToolDef field; bleed example images; extra frames ToolRunner.tsx:55-64"},
 {"id":"sxo-9","severity":"low","title":"'black screen' troubleshooting intent unserved","evidence":"5/9 results are black-screen-of-death fix articles","fix":"Add link + short troubleshooting guide in src/lib/guides.ts"},
 {"id":"sxo-10","severity":"low","title":"Phones get in-page overlay instead of true fullscreen","evidence":"src/lib/fullscreen.ts:11; FullscreenStage.tsx:241","fix":"Optional full-screen video fallback for phones"}
]
```

Generate a PDF report? Use `/seo google report`.
