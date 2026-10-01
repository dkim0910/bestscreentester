# SXO Findings: bestscreentester.com (RE-AUDIT, complete)

Re-audit date: 2026-10-02. Category: Search Experience. **The SXO Gap Score is separate from the SEO Health Score.**

## Re-audit scope
- **Live build:** main `b6e17c2` (committed 2026-10-01T15:02:11Z). The live `Last-Modified` header is 15:03:09 GMT on every page. [inference] It is the b6e17c2 deploy.
- **Re-rendered (ours only):** `/`, `/dead-pixel-test/`, `/refresh-rate-test/`, `/backlight-bleed-test/`, `/black-screen/` and `/white-screen/`, using `render_page.py --mode always` (Playwright) and `parse_html.py`. All returned 200.
- **Screenshots:** `bestscreentester.com-audit/screenshots/sxo-recheck/` (home desktop and mobile, white-screen desktop, refresh-rate desktop, dead-pixel mobile).
- **Reused, not re-run:** the SERP and competitor data from 2026-10-01. Homepage originality was re-measured against the screentester.io render saved on 2026-10-01 (`sti.json`, htmldate 2026-04-05). No new fetch was made.
- **Labels:** **[verified]** means read in code or rendered output. **[inference]** means a judgment call.

## Method and data provenance (2026-10-01 run, reused)
- **Our pages:** rendered with `render_page.py --mode always` (Playwright Chromium) and parsed with `parse_html.py`. Pages: `/`, `/dead-pixel-test/`, `/refresh-rate-test/`, `/backlight-bleed-test/`, `/black-screen/`, `/white-screen/`. All returned 200 with 0 console errors. Above-the-fold views were checked with `capture_screenshot.py` (desktop 1920x1080, mobile 375x812 @2x).
- **SERPs:** the WebSearch tool returned 9-10 results per query for "dead pixel test", "screen test", "refresh rate test", "monitor hz test", "backlight bleed test", "black screen", "white screen" and "monitor test". **This is not a live Google SERP.** A direct Google fetch was blocked, so there is **no PAA, AI Overview, ads, featured-snippet or related-search data**. Any user story that depends on those signals instead cites result titles and snippets.
- **Competitors:** 25 competitor pages were rendered with the same tooling (word count, headings, JSON-LD), plus 14 desktop screenshots.
- **Our rankings:** bestscreentester.com did **not** appear in the returned results for any of the 8 queries. It appeared only for the brand query "bestscreentester.com".
- Labels: **[verified]** means read in code or rendered output. **[inference]** means a judgment call.

## Per-query SERP summary (2026-10-01 data, reused; "Our page / gap" column is as of 2026-10-01; current status is in the findings below)

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


## Page-type mismatch verdict (unchanged)
| Page | Verdict |
|---|---|
| dead-pixel-test, refresh-rate-test, white-screen | **ALIGNED** |
| backlight-bleed-test | **ALIGNED/MEDIUM** (the SERP rewards a tool plus an explainer) |
| black-screen | **MEDIUM** (the troubleshooting half of the SERP is still unserved) |
| Homepage, "screen test" | **MEDIUM** (the film meaning dominates that SERP) |
| Homepage, "monitor test" | **ALIGNED** (the H1 now names both phrases) |

## SXO Gap Scores (same rubric, 100 pts)

| Page | Type /15 | Depth /15 | UX /15 | Schema /15 | Media /15 | Authority /15 | Fresh /10 | **2026-10-01** | **2026-10-02** |
|---|---|---|---|---|---|---|---|---|---|
| / (screen/monitor test) | 12 (+1) | 13 (+1) | 12 (+2) | 9 | 6 | 7 (+3) | 6 (+1) | 57 | **65** |
| /dead-pixel-test/ | 13 | 8 | 10 (+1) | 13 | 6 | 7 (+1) | 6 (+1) | 60 | **63** |
| /refresh-rate-test/ | 12 | 8 (+2) | 9 (+2) | 13 | 5 | 7 (+1) | 6 (+1) | 54 | **60** |
| /white-screen/ | 12 | 6 (+1) | 9 (+3) | 13 | 4 | 7 (+1) | 6 (+1) | 51 | **57** |
| /backlight-bleed-test/ | 12 | 7 | 9 | 13 | 4 | 7 (+1) | 5 | 56 | **57** |
| /black-screen/ | 9 | 6 (+1) | 8 | 13 | 4 | 7 (+1) | 6 (+1) | 50 | **53** |

### Score evidence [verified unless labelled]

**Homepage**
- **Type and UX:**
  - The H1 is "Free Online Screen Test & Monitor Test" (`src/app/page.tsx:42-44`).
  - QuickColors now sits inside the hero (`page.tsx:64-66`). On mobile (375x812) the first row of swatches is above the fold (screenshot `sxo-recheck/home/..._mobile.png`). Before, it was below the fold.
  - The primary CTA still navigates to /dead-pixel-test instead of starting a test (`page.tsx:50-55`).
- **Depth:**
  - The page now has a symptom → test → guide picker (`HomeSections.tsx:12`, rendered as 12 H3s) and a "Normal, or worth returning?" verdict list (`:75`, `:270-300`).
  - Word count is 1,883 (parse_html, includes nav and footer) and 816 (trafilatura).
- **Authority:**
  - Overlap with screentester.io fell from **29.9% to 0.5%** of six-word shingles (10 of 1,907). All 10 shared shingles are short device-category phrases such as "tv screen test mini led blooming" and "how many dead pixels are acceptable".
  - The mirrored H2 sequence is gone. The new H2s are: Quick full-screen colors / 4 categories / What's wrong with my screen? / Normal, or worth returning? / Tests for newer screens / Testing a specific device? / Before you test / Questions / Who makes BestScreenTester.
  - A "Who makes" section names Nelera (`HomeSections.tsx:371-378`).
  - Still missing: methodology, original photos and measurements.
- **Schema:** unchanged. The rendered JSON-LD is Organization+WebSite and FAQPage only, with no ItemList or WebApplication.
- **Freshness:** the sitemap lastmod is 2026-10-02 (`seo.ts:30`). No date is visible on the page. htmldate reads 2026-01-01 (source not traced).

**Tool pages**
- **Schema:** unchanged on all five: WebApplication+Offer, HowTo, FAQPage, BreadcrumbList.
- **Freshness:**
  - Per-tool `updatedAt` is 2026-10-01 for dead-pixel, refresh, black and white, and 2026-06-21 for backlight-bleed (`tools.ts:45,290,106,137,168`). These dates feed the sitemap.
  - No visible date on the page. `webAppJsonLd` has no `dateModified` (`seo.ts:152`).
  - htmldate picks the date up only from the RSC payload.
- **Authority:** +1 site-wide for the named operator (About page and Organization `parentOrganization`, commit 510a538). Tool pages still have no methodology block.
- **Dead pixel (UX +1):** the preview no longer gets a scrim (`DeadPixelTool.tsx:121`). 494 words (was 493).
- **Refresh rate:**
  - Inline readout shows one decimal (`RefreshRateTool.tsx:27`). Full-screen adds frame time and closest standard (`:30-35`, `detailed={active}` at `:48`). Steady-gap averaging is at `useRefreshRate.ts:40-46`.
  - 3 FAQs, including "Why does it show 60 Hz on my 144 Hz monitor?" (`tools.ts:298-311`). 530 words (was 348).
  - The preview is **still scrimmed**: no `previewScrim={false}` at `RefreshRateTool.tsx:44-49`. The screenshot shows a dimmed "60.0".
- **White screen (UX +3):** the preview is pure white (screenshot; `ColorCycler.tsx:35`). 3 FAQs, including "Will the screen stay on while I use it as a light?". 445 words (was 319).
- **Black screen:** 3 FAQs (`tools.ts:113-127`), 435 words (was 322). No colour row, presets or troubleshooting link.
- **Backlight bleed:** no change. 389 words, 2 FAQs (`tools.ts:176-186`), no bleed vs IPS-glow imagery.

## User stories (derived from result titles and snippets; no PAA available)
1. **Awareness, dead pixel.** As a new-monitor owner, I want to tell dead pixels from stuck ones, because I'm worried the panel is faulty, but I'm blocked by not knowing what a defect looks like. *(Signals: testufo "Dead Pixel **Simulator**"; snippet "If a pixel stays completely black always, it's a dead pixel... stuck on a single color".)*
2. **Decision, dead pixel.** As a buyer inside a return window, I want proof of the defect, because returns/RMA depend on it, but I'm blocked by having no record of what I found. *(Signals: snippet "assist purchases and product returns (RMA)"; deadpixeltest.org H2 "How common are dead pixels on your brand?")*
3. **Consideration, fix.** As someone with a stuck pixel, I want to try to fix it right now, because a replacement is a hassle, but I'm blocked by the fixer being hard to find. *(Signals: titles "Check & **Fix**" (xbitlabs), "Stuck Pixel **Fix**" (benrilab), "Dead Pixels Test **and Fix**" (Play), deadpixeltest.org "Dead Pixel Fixer", fpstest nav "Pixel Fixer".)*
4. **Decision, Hz.** As a gamer who bought a 144/240 Hz monitor, I want to confirm it actually runs at that rate, because I suspect it's stuck at 60, but I'm blocked by not knowing why it is wrong or how to fix it. *(Signals: snippet "rarely run at their advertised speed... cables and browser settings often lock them at 60Hz"; ktcplay "Verify True Hz Output"; fpstest H2 "Why Your Monitor May Run at the Wrong Refresh Rate", "Can Your Cable Carry That Refresh Rate?")*
5. **Utility, white/black.** As a video-call user, I want a one-tap light or backdrop, because my lighting is bad, but I'm blocked by tools that only show a single plain colour. *(Signals: snippet "most popular use of a white screen is as an instant key light... Zoom, Teams, Meet"; whitescreen.tv presets "Zoom Lighting / Screen Cleaning / Reading Light / Night Light"; blackscreen.space title "Focus, Zoom, and Eye Comfort".)*
6. **Awareness, troubleshooting.** As a PC user whose screen went black, I want to fix it, but a "black screen" tool page doesn't help me. *(Signals: 5/9 "black screen" results are fix articles: Wikipedia BSoD, Lenovo, HP, AskLeo, AVG.)*

## Persona scores (re-scored, weakest first)

| Persona (signal) | Relevance | Clarity | Trust | Action | 2026-10-01 | **2026-10-02** | What changed |
|---|---|---|---|---|---|---|---|
| Black-screen troubleshooter (story 6) | 4 | 6 | 10 | 4 | 24 | **24** | Nothing: no troubleshooting exit |
| Video-call / utility user (story 5) | 14 | 16 | 13 | 11 | 48 | **54** | True-white preview and a stay-awake FAQ. Still no presets or colour row |
| Stuck-pixel fixer (story 3) | 18 | 12 | 15 | 12 | 56 | **57** | Fixer is still frame 10 of 10 |
| Phone/tablet checker | 16 | 17 | 13 | 12 | 56 | **58** | Homepage swatches are above the fold on mobile |
| Gamer verifying Hz (story 4) | 22 | 20 | 15 | 13 | 60 | **70** | Decimals, frame time, closest standard, 60 Hz FAQ. No in-tool "stuck at 60" callout |
| Return-window buyer (stories 1-2) | 22 | 20 | 14 | 14 | 66 | **70** | Homepage "Normal, or worth returning?" table. Still no result capture |

**Action** is still the weakest dimension across the board. Every test ends at Esc with no record or next step.

## Status of 2026-10-01 findings

| # | Finding | Status | Evidence |
|---|---|---|---|
| 1 | Homepage copy paraphrased screentester.io | **RESOLVED** | 0.5% shingle overlap (was 29.9%); new H2 order; original symptom and verdict sections |
| 2a | White preview rendered grey | **RESOLVED** | `ColorCycler.tsx:35` `previewScrim={false}`; screenshot is pure white |
| 2b | Black/white colour row and presets | **OPEN** | Still a single frame each (`ToolRunner.tsx:49-53`) |
| 2c | Black/white had 1 FAQ | **RESOLVED** | 3 each (`tools.ts:113,144`). 18 of 28 tools now have 3 FAQs and 10 have 2. None has 1 |
| 3 | Refresh-rate result too thin | **PARTIAL** | Fixed: decimals, frame time, closest standard, averaging, 60 Hz FAQ. Still open: scrimmed preview, extra detail full-screen only, no jitter/min/max/dropped frames, no in-tool "stuck at 60?" link, no re-test |
| 4 | Dead-pixel swatch row / fixer button | **OPEN** | Arrow picker only; fixer is the last frame (`DeadPixelTool.tsx:115-122`) |
| 5 | Post-test result panel | **OPEN** | Nothing follows ToolRunner (`src/app/[tool]/page.tsx:108`) |
| 6 | F/Enter to start | **OPEN** | Key handler returns early when inactive (`FullscreenStage.tsx:149`). The hint offers no start key (`:231-237`) |
| 7 | Homepage H1, instant test, schema | **MOSTLY RESOLVED** | H1 and hero swatches are done. Still open: hero CTA navigates (`page.tsx:50-55`), no ItemList JSON-LD |
| 8 | Tool pages thin | **PARTIAL** | FAQ growth added 100-180 words to the refresh/black/white pages. No "Reading your result" block; no bleed imagery |
| 9 | Black-screen troubleshooting intent | **OPEN** (low) | No link in the tagline or FAQ (`tools.ts:101-127`) |
| 10 | Phones get an overlay, not fullscreen | **OPEN** (low) | Not re-tested on a device |

## New findings (2026-10-02)

### N1. MEDIUM: Refresh-rate preview is still dimmed, and its caption sits under the Start button [verified]
- **Evidence:**
  - `RefreshRateTool.tsx:44-49` does not pass `previewScrim={false}`, so `bg-black/40` applies (`FullscreenStage.tsx:266-268`). The desktop screenshot shows a grey "60.0".
  - The "Measured from animation frames" caption (`RefreshRateTool.tsx:36`) is hidden behind the centred Start pill. It is not visible in the screenshot.
  - The SERP leaders (testufo, xbitlabs) show the reading prominently before any click.
- **Fix:**
  - Pass `previewScrim={false}`. The hint already gets its own backing pill (`FullscreenStage.tsx:296-303`).
  - Raise the readout (for example `top-[8%]`), or render the frame-time line inline too. "Too small" holds only on mobile.

### N2. LOW: No visible "Updated" date or `dateModified` on tool pages [verified]
- **Evidence:** the header has only the category, H1 and tagline (`src/app/[tool]/page.tsx:100-106`). `webAppJsonLd` carries no date (`seo.ts:152`). Competitors show 2026-06/08 dates.
- **Fix:**
  - Render `Updated {tool.updatedAt}` under the tagline at `page.tsx:105`.
  - Add `dateModified: tool.updatedAt` to `webAppJsonLd`.

### N3. LOW: 10 tools still have 2 FAQs, including backlight-bleed [verified]
- **Evidence:** `tools.ts:176-186`. Others: color, brightness-uniformity, boot-screen, burn-in, overscan, sharpness, frame-skipping, wide-color-gamut, pwm-flicker.
- **Fix:** for backlight-bleed, add "How much bleed is grounds for a return?" (the SERP is a hybrid tool and how-to).

## Remaining top fixes (priority order)
1. **Dead pixel:**
   - Add a swatch row that calls `start(i)` and a "Fix a stuck pixel" button that calls `start(SOLID_COLORS.length)`, in `src/components/tools/DeadPixelTool.tsx:114-133`.
   - Use the ref pattern from `QuickColors.tsx`.
2. **White/black:**
   - Add presets (warm/cool white, dim grey) and a colour row at `src/components/tools/ToolRunner.tsx:49-53`.
   - Add a black-screen troubleshooting link in the tagline at `tools.ts:101`.
3. **Refresh rate:**
   - Remove the scrim (N1).
   - Add a ≤61 Hz "Stuck at 60?" callout linking `/blog/how-to-enable-full-refresh-rate-windows-mac` (`RefreshRateTool.tsx:30-36`).
   - Add min/max/jitter to `useRefreshRate.ts:40-46`.
4. **Post-test panel:** client-only, with a copyable summary and a return/fix guide link, after `src/app/[tool]/page.tsx:108`.
5. **Start key:** F/Enter starts the test when inactive, at `src/components/tools/FullscreenStage.tsx:148-149`. Show "Press F" in the hint at `:231-237`.
6. **Homepage:**
   - Add an ItemList-of-tools JSON-LD next to the FAQ block (`HomeSections.tsx:355-359`).
   - Make the hero CTA launch a test, or keep it as is but label it as a link (`page.tsx:50-55`).
7. **Backlight bleed:** add bleed vs IPS-glow example images and a third FAQ (`tools.ts:160-186`).
8. **Dates:** show a visible updated date and add `dateModified` (N2).

## Positives (keep)
- The homepage is now original and organised around the site's own tests. The symptom picker and verdict table give it real information gain over the tool-hub SERP.
- Solid-colour previews show the true colour.
- The refresh-rate result now matches SERP expectations for decimals and closest standard.
- Every tool page checked still has the tool above the fold and rich schema.

## Notes and limitations
- The SERP data is from 2026-10-01 (WebSearch, not live Google), with no PAA, AI Overview or ads. Rankings were not re-checked; a day is too short to see any effect.
- The originality figure compares against the screentester.io render saved on 2026-10-01. Our side includes nav and footer (same method as before).
- **Console:** `/white-screen/` logged one report-only CSP message: "Framing 'https://www.google.com/' violates frame-ancestors 'self'". [inference] It comes from a Google (AdSense) iframe, is report-only, and is not user-visible. All other pages logged 0.
- Not tested:
  - Real devices (iOS fullscreen, high-Hz monitors). Headless measured 60.0 Hz.
  - Full-screen states. Frame time and closest standard were verified in code only.
- Cross-skill follow-ups:
  - `/seo schema` for the homepage ItemList and tool `dateModified`.
  - `/seo page` for the bleed explainer.

## Structured findings (audit-data.json, category "Search Experience")
```json
{"sxo_gap_scores":{"home":{"old":57,"new":65},"dead-pixel-test":{"old":60,"new":63},"refresh-rate-test":{"old":54,"new":60},"white-screen":{"old":51,"new":57},"backlight-bleed-test":{"old":56,"new":57},"black-screen":{"old":50,"new":53}},
 "findings":[
 {"id":"sxo-1","severity":"high","status":"resolved","title":"Homepage copy paraphrased screentester.io","evidence":"6-gram overlap 29.9% -> 0.5%; new H2 order"},
 {"id":"sxo-2","severity":"high","status":"partial","title":"White/black screen utility","evidence":"Grey preview fixed (ColorCycler.tsx:35); 3 FAQs; still single frame ToolRunner.tsx:49-53","fix":"Presets + colour row in ToolRunner.tsx:49-53"},
 {"id":"sxo-3","severity":"medium","status":"partial","title":"Refresh-rate result depth","evidence":"Decimals/frame time/closest standard (RefreshRateTool.tsx:27-35); no jitter, no stuck-at-60 callout","fix":"Callout + min/max/jitter (useRefreshRate.ts:40-46)"},
 {"id":"sxo-4","severity":"medium","status":"open","title":"Dead pixel colour choice and fixer not one-click","evidence":"DeadPixelTool.tsx:115-122","fix":"Swatch row + fixer button"},
 {"id":"sxo-5","severity":"medium","status":"open","title":"No post-test result capture","evidence":"Nothing after ToolRunner at src/app/[tool]/page.tsx:108","fix":"Client-only summary panel"},
 {"id":"sxo-6","severity":"medium","status":"open","title":"No F/Enter start shortcut","evidence":"FullscreenStage.tsx:149 returns when inactive","fix":"Inactive keydown -> start(index); hint :231-237"},
 {"id":"sxo-7","severity":"low","status":"mostly-resolved","title":"Homepage targeting / instant test","evidence":"H1 page.tsx:42-44; swatches in hero :64-66; no ItemList JSON-LD; CTA navigates :50-55","fix":"ItemList JSON-LD"},
 {"id":"sxo-8","severity":"medium","status":"partial","title":"Tool pages thin","evidence":"refresh 530, white 445, black 435, bleed 389 words; no result block; no bleed imagery","fix":"Reading-your-result block; bleed images"},
 {"id":"sxo-9","severity":"low","status":"open","title":"Black-screen troubleshooting intent unserved"},
 {"id":"sxo-10","severity":"low","status":"open","title":"Phones get overlay, not fullscreen"},
 {"id":"sxo-n1","severity":"medium","status":"new","title":"Refresh-rate preview still scrimmed; caption hidden under Start","evidence":"RefreshRateTool.tsx:44-49 no previewScrim={false}; caption :36","fix":"previewScrim={false}; raise readout"},
 {"id":"sxo-n2","severity":"low","status":"new","title":"No visible updated date / dateModified on tool pages","evidence":"src/app/[tool]/page.tsx:100-106; seo.ts:152","fix":"Show updatedAt; add dateModified"},
 {"id":"sxo-n3","severity":"low","status":"new","title":"10 tools still at 2 FAQs incl. backlight-bleed","evidence":"tools.ts:176-186"}
 ]}
```

Generate a PDF report? Use `/seo google report`.
