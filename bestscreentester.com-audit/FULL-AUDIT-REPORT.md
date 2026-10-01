# SEO Audit: bestscreentester.com

**Date:** 2026-10-01. Audited live build `1009df5` (main = dev `29b4107`), deployed 12:24 UTC.

**Scope:**
- All 80 sitemap URLs: 8 static pages, 28 tools and 44 guides.
- The source repo.
- 11 specialist passes: technical, content, schema, sitemap, performance, visual, GEO, agentic, SXO, cluster and backlinks.

**Business type:** Publisher / free web utility, earning from AdSense and donations. It is not a local business or a store.

**Data gaps:** read these before trusting any score.
- No GSC, CrUX or GA4 API credentials are configured for the plugin, so this audit has **no field Core Web Vitals, no real rankings and no traffic data**.
- Keyless PageSpeed Insights returned HTTP 429.
- The SERP checks used a web-search tool, not live Google, so there is no People Also Ask or AI Overview data.
- Moz, Bing WMT and DataForSEO are not configured. The domain is not yet in the Common Crawl graph.

Per-category detail is in `findings/*.md`. Severity labels follow the plugin: Critical means it blocks indexing or risks a penalty; High means it significantly affects rankings.

---

## Executive summary

### SEO Health Score: **77 / 100**

| Category | Weight | Score | Basis |
|---|---|---|---|
| Technical SEO | 22% | 85 | All 80 URLs return 200 with a canonical, a trailing slash and a single H1, and there are no broken internal links. Points off for an unreproduced client crash and the 404 page's metadata. |
| Content Quality | 23% | 60 | The guides are useful. Points off for E-E-A-T (no author, no citations), 4 factual errors, thin tool pages, and homepage copy that overlaps a competitor verbatim. |
| On-Page SEO | 20% | 82 | Titles and descriptions are within budget and none are duplicated. Points off for cannibalising targets, titles and excerpts that promise more than the body delivers, and a homepage H1 that misses "screen test". |
| Schema | 10% | 84 | Valid and consistent. Small gaps: inline publisher and author objects instead of references, and no breadcrumbs on the hub pages. |
| Performance (CWV) | 10% | 90 | Lab data only: mobile 93–99 and desktop 100 on tool pages, CLS 0. One guide measured 74 in a single run. |
| AI Search Readiness | 10% | 65 | Crawler access is perfect and the site is server-rendered. Points off for low citability on tool pages, no sources, and almost no off-site brand presence. |
| Images | 5% | 85 | Every image has alt text and dimensions. Points off for the 188 KB favicon on every page, PNG-only formats and eager hover previews. |

### The binding constraint

Technically, the site is in very good shape: it is indexable, fast, server-rendered and correctly canonicalised. Nothing in this audit blocks indexing.

What limits growth is **differentiation and trust on the pages that should rank**:
- The homepage, the hub for "screen test" and "monitor test", shares long verbatim passages with a competitor that ranks for those queries.
- The money tool pages (white screen, black screen, refresh rate, dead pixel) are thinner and less capable than the SERP leaders.
- The site is anonymous and cites no sources.
- The domain has no measurable off-site signals yet.

In the SXO pass the site did not appear in the results for any of the 8 target queries. That pass used a web-search tool, not live Google; check GSC to confirm.

### Top 5 issues

1. **HIGH: homepage copy overlaps screentester.io verbatim.**
   - I measured it: 417 of 1,317 six-word sequences (31.7%) in our homepage text also appear on screentester.io/.
   - Several runs are 30–45 words long. Example: "dead pixel test solid color fullscreen frame by frame scan detects bright pixels always on dark pixels unresponsive and stuck pixels fixed color the essential first step for any new screen…".
   - The H2 order is also nearly identical.
   - The six tool pages I compared share **0%** with that site, so this is confined to `src/components/HomeSections.tsx`.
   - Their page's date (from htmldate) is 2026-04-05; `HomeSections.tsx` was first committed 2026-06-21. That suggests ours came second, but it is not proof.
2. **HIGH: four factual errors, plus homepage advice that contradicts the guides.**
   - ISO 9241-307 classes are written as I–IV (`guides.ts:444`); I–IV is the older ISO 13406-2 scheme.
   - The guide says iPhone 11 shows battery history only (`guides.ts:1983`). Apple's support page 102658 also lists Display.
   - The Color Gradient Test claims DCI-P3 coverage (`tools.ts:189-194`, `HomeSections.tsx:29,178`), but it draws on a default sRGB 2D canvas (`PatternCanvas.tsx:47`).
   - The homepage says "IPS ~1ms" (`HomeSections.tsx:39`).
   - The homepage says "only bleed needs darkness" (`:130`) and "warm up 15–30 min" (`:135`); tools.ts:294 and :467 and guides.ts:30 say otherwise.
3. **HIGH: no named author or maintainer, and zero outbound citations in 44 guides.**
   - The /about meta description promises "who builds and maintains the tools" (`about/page.tsx:7`), but the page names nobody.
   - Article schema gives an Organization as the author (`seo.ts:203`).
   - The guides name ISO 9241-307, VESA DisplayHDR, Rec. 2020 and Apple's support documentation but link to none of them.
4. **HIGH: the tool pages that should rank are thin and less capable than competitors.**
   - Unique copy runs from 90 words (white-screen) to 268. 14 tools have a single FAQ.
   - The white-screen preview renders **grey**, because every preview gets a `bg-black/40` overlay (`FullscreenStage.tsx:259`).
   - Refresh rate shows one rounded integer (`useRefreshRate.ts:24`). Competitors show frame time, jitter and the closest standard rate.
   - On the dead pixel test, the colour choice and the stuck-pixel fixer are hidden behind the ←/→ picker.
5. **MEDIUM: the sitemap lastmod contradicts the project's own "honest lastmod" rule.**
   - All 36 tool and static URLs use `SITE_UPDATED` = 2026-10-01 (`seo.ts:16`, `sitemap.ts:13-25`).
   - That includes /about, /privacy, /terms, /donate and /feedback, which haven't changed since 2026-09-30, plus pre-existing tool pages that didn't change.
   - The IndexNow ping submits these URLs as fresh.

### Top 5 quick wins (each under an hour)

1. Make `/donate` use `TOOLS.length`. It currently says "20" (`donate/page.tsx:8`) and "21+" (`:23`); there are 28.
2. Fix the two over-promising excerpts and titles:
   - The OLED burn-in excerpt says "still fixable" (`guides.ts:1460`), but the body says it's permanent.
   - "4 Methods That Actually Work" (`guides.ts:324`) sits above a body that says "no technique reliably fixes them" (`:367`).
   - Also reword the warranty excerpt, which promises "what each major manufacturer accepts" (`guides.ts:427`) when the body names no manufacturer.
3. Give `not-found.tsx` its own metadata: `title: "Page not found"` and `robots: { index: false }`. Today it emits both `noindex` and the layout's `index, follow`, plus the homepage title.
4. Drop the scrim on solid-colour previews so the White Screen preview is actually white (`FullscreenStage.tsx:256-261`).
5. Replace `src/app/icon.png` (512×512, 188 KB) with a 48–96 px icon, or add a small icon alongside it. It currently downloads on every page.

---

## Technical SEO (85)

**Works:**
- All 80 sitemap URLs return 200 with no redirects.
- Every page has a self-referencing trailing-slash canonical, `index, follow`, `lang=en`, a viewport tag and exactly one H1.
- The crawl found no internal links to a 404, a redirect or a slash-less URL, and no orphan pages; the lowest inbound count is 2.
- http→https and www→apex each take a single 301.
- Unknown URLs return a real 404.
- Primary content is in the static HTML.
- IndexNow is set up: the key file returns 200 and matches the CI ping.
- ads.txt returns 200.
- No mixed content.

| Sev | Finding | Evidence | Fix |
|---|---|---|---|
| Medium | **Transient client crash on the homepage (unreproduced).** Two agents independently saw Next's built-in global error screen ("This page couldn't load") on their first cold loads around 12:35–12:37 UTC, about 11 minutes after the 12:24 deploy. That screen is `next/dist/esm/client/components/builtin/global-error.js:33`, which renders only when an uncaught client exception reaches the root. Six or more later renders, desktop and mobile, were clean with 0 console errors. | The screenshots were overwritten by the clean retries, so I don't have the original error. Hypothesis, not verified: a stale edge-cached HTML page from the 11:49 deploy referenced chunks that no longer existed (HTML is cached for `max-age=600`). | Add `src/app/error.tsx` and `src/app/global-error.tsx`, themed, with a Reload button. Optionally reload once automatically on `ChunkLoadError`. Then load `/` cold in a real browser with the console open in the 10 minutes after the next deploy. If it reproduces outside a deploy window, it's a real bug in a client component. |
| Medium | The 404 page emits both `noindex` and `index, follow`, has a generic title and no canonical. | Live `/this-does-not-exist/`. `src/app/not-found.tsx` has no `metadata`. | `export const metadata = { title: "Page not found", robots: { index: false } }`. No indexing risk, because the status is a real 404. |
| Medium* | No HSTS, CSP, X-Content-Type-Options or Referrer-Policy headers. | Response headers. | *Requires a hosting change (for example a Cloudflare proxy), because GitHub Pages can't set headers. Low SEO impact. |
| Low | `/feedback/` skips from H1 to H3, because the footer's h3s have no H2 above them on that short page. | Live HTML. | Add an H2 in `feedback/page.tsx`, or make the footer column headings non-heading elements. |
| Low | `/blog/screen-door-effect-explained/` has 2 inbound links; `/hdr-test/`, `/pwm-flicker-test/` and `/wide-color-gamut-test/` have 3 each. | Crawl graph. | Add contextual links from related guides. |
| Info | Slash-less URLs on www or http take 2 hops. | GitHub Pages behaviour. | No repo fix. It only matters for external links that omit the slash. |

## Content Quality (60)

**Works:**
- Guides are specific and non-generic, with tables, menu paths and real numbers.
- Low internal duplication: no two guides share more than 6.4% of their 6-word sequences.
- Readability is around grade 7.
- The plugin's filler and AI-pattern checks found nothing on all 80 pages.
- Metadata isn't templated.
- Guide dates are honest and match the commits.

| Sev | Finding | Evidence | Fix |
|---|---|---|---|
| High | **Homepage copy overlaps a ranking competitor verbatim.** | 31.7% of our 6-word sequences appear on screentester.io/ (measured in this session). The H2 order mirrors theirs. Tool pages: 0%. | Rewrite the data arrays (`HomeSections.tsx:5-141`) and section scaffolding (`:157-387`) in your own words and structure. Lead with what is genuinely ours: 28 tests including HDR, PWM, WebGL pipes and the cracked-screen prank, and the guides. |
| High | **Factual errors.** | ISO classes (`guides.ts:444`). iPhone parts history (`guides.ts:1983`, Apple support 102658). Colour Gradient "DCI-P3" (`tools.ts:189-194`, `HomeSections.tsx:29,178`; the canvas is sRGB). "IPS ~1ms" (`HomeSections.tsx:39`). | Correct each one. Point gamut questions to `/wide-color-gamut-test/`. Check the ISO class table against the standard itself; the agent's source was Wikipedia. |
| High | **No author or maintainer.** | The byline is `By {SITE_NAME}` (`blog/[slug]/page.tsx:125`). /about is 220 words and names nobody. Only /donate says "one solo developer" (`donate/page.tsx:22`). | Add a "Who makes this" section to /about with a real name or a consistent pen name, background, and the hardware the tests were checked on. Add `author` to the `Guide` interface (`guides.ts:5-17`) and render it. |
| High | **Zero outbound citations.** | `grep -c "](http" src/lib/guides.ts` → 0. | Add 1–3 primary-source links per standards claim: the ISO catalogue for 9241-307, displayhdr.org, ITU-R BT.2020, Apple support 102658. |
| Medium | Homepage advice contradicts the tools and guides. | "Only backlight-bleed testing needs darkness" (`HomeSections.tsx:130`) vs blooming and black level (`tools.ts:294,467`). Warm up "15–30 min" (`:135`) vs "five minutes" (`guides.ts:30`). | Align the copy. This is easiest to do during the homepage rewrite. |
| Medium | Titles and excerpts promise more than the bodies deliver. | `guides.ts:324` vs `:367`; `:1460` vs `:1502-1506`; `:427` and `:251` vs the body at `:431-477`. | Reword the titles and excerpts, or add the missing content. |
| Medium | Thin tool pages. | Unique copy: white-screen 90, black-screen 97, contrast-test 103, greyscale-test 113, ghosting-test 117. 14 tools have only one FAQ. On 12 of 28, less than half the text is unique. | See the combined fix C1 in the action plan. |
| Medium | Cannibalising targets. | color-gradient vs wide-color-gamut (`tools.ts:194` vs `:705`). greyscale-test keyword "gamma test" (`tools.ts:171`) vs `/gamma-test/`. black-screen vs backlight-bleed-test (`tools.ts:97,141,144`). Three bleed/glow guides plus the bleed tool. | Give each query one owner. Remove "gamut", "dci-p3" and "gamma test" from the wrong pages' copy and keywords. Make `guides.ts:2036` the single bleed-vs-glow comparison. |
| Medium | No first-hand evidence. | No real photos or measurements. Guide hero alt text says "illustrated diagram" for a generated title card (`blog/[slug]/page.tsx:117`). | Add real photos of bleed, glow and dead pixels taken on your own panels. Fix the alt text. |
| Medium | /donate counts are stale. | `donate/page.tsx:8,23`. | Use `TOOLS.length`. |
| Low | Style tics. | Twelve em dashes per 1,000 words. "Here's" opens 15 of 44 excerpts. 27 of 28 tool descriptions start with "Free". Homepage superlatives such as "leave no defect undetected". | Edit as you touch each page. |

Thinnest guides, all under the plugin's 1,500-word blog floor:
- do-you-still-need-a-screensaver (681 words)
- harmless-screen-pranks (689)
- cracked-screen-glass-or-lcd (729)
- what-is-ips-glow (747)
- is-it-my-screen-or-my-graphics-card (752)

Their density is good, so treat length as secondary to the trust fixes above.

## On-Page SEO (82)

**Works:**
- Titles are 24–62 characters and descriptions 116–159 characters, all within the project's budgets.
- No duplicate titles or descriptions.
- One H1 per page.
- Dense internal linking: every guide links to 2–11 tools.

**Gaps:**
- The cannibalisation and over-promising titles listed under Content.
- The homepage H1, "Test your screen in seconds — right in your browser" (`page.tsx:41-43`), contains neither "screen test" nor "monitor test". The title does.
- "monitor test" appears only in meta keywords (`page.tsx:23`), which search engines ignore.
- The hero CTA navigates to another page rather than starting a test.

## Schema (84)

**Works:**
- Organization `#organization` and WebSite `#website` appear on every page (`layout.tsx:49-50`).
- Tool pages carry BreadcrumbList and WebApplication with a free Offer and no fabricated ratings.
- Guides carry Article and BreadcrumbList, with dates that match the visible `<time>`.
- The OG images checked return 200 at 1200×630.

| Sev | Finding | Fix |
|---|---|---|
| Info | HowTo on all 28 tool pages (`[tool]/page.tsx:52-55`). Its rich result was removed in Sept 2023. | Harmless; leave it. Don't extend it to guides. |
| Info | FAQPage on the homepage and 28 tools. FAQ rich results were retired on May 7, 2026. | Valid markup with no SERP feature. No action. |
| Info | WebApplication isn't eligible for the software-app rich result without ratings or reviews. | Correct as it is. Only add AggregateRating if real, visible reviews exist. |
| Low | WebApplication.publisher (`seo.ts:151`) and Article.author (`seo.ts:203`) are inline Organizations. | Use `{"@id": absoluteUrl("/") + "#organization"}`. Switch the author to a Person once one is named (see Content). |
| Low | No BreadcrumbList on /tools/, /blog/ or /about/. | Use `breadcrumbJsonLd` (`seo.ts:117`). A snippet is in `findings/schema.md`. |
| Low | Organization has no `sameAs` or `contactPoint`. | Add `contactPoint` with CONTACT_EMAIL, and `sameAs` only for real profiles. |

## Performance (90): lab data only

These are Lighthouse 13.5 runs against a fresh local build with real AdSense and GA4 loaded. They don't measure CDN latency, and no field data exists.

| Page | Mobile | LCP (mobile) | TBT | CLS | Desktop |
|---|---|---|---|---|---|
| / | 93–95 | 2.9–3.2 s | 40–90 ms | 0 | 100 |
| /dead-pixel-test/ | 93 | 3.2 s | 50–60 ms | 0 | 100 |
| /refresh-rate-test/ | 99 | 2.1 s | 70 ms | 0.001 | not run |
| /screensaver/ | 93–94 | 3.1 s | 50–80 ms | 0 | not run |
| guide (TV defects) | 74 (1 run) | 5.6 s | 60 ms | 0 | not run |

The LCP element is text. Unthrottled LCP was 63 ms, so the roughly 3 s mobile figures come from Lighthouse's simulated throttling of the CSS, font and JS chain. The guide's 74 is a single run and needs re-measuring.

| Sev | Finding | Fix |
|---|---|---|
| Medium | `src/app/icon.png` is 512×512 and 188 KB, and is fetched on every page. (The old 1.7 MB logo bug is fixed; this is the remaining weight.) | Ship a smaller icon (48–96 px, under 10 KB), or several sizes using Next's numbered `icon` files. |
| Medium | `ToolRunner.tsx:3-18` statically imports all 16 tool components, so every tool page carries about 38 KB gzipped of other tools' code. | `next/dynamic` per slug. |
| Medium | Geist Mono (71 KB) is preloaded on every page (`layout.tsx:3-4`). | Load it only where it's used. |
| Low | Hover previews load eagerly: about 14 PNGs, roughly 95 KB, on the homepage (`ToolCard.tsx:23-29`). | Load on hover or intersection, or convert to WebP/AVIF. |
| Low | Guide hero is a 1200×630 PNG shown at 574×301 (`blog/[slug]/page.tsx:115-122`). | Use a smaller WebP/AVIF copy on the page and keep the PNG for OG. |
| Low | 13 KB of legacy polyfills. | Set a modern `browserslist`. |
| Info | `public/bestscreentester_logo.png` (1.7 MB) isn't referenced by any code or script; only CLAUDE.md mentions it, as the favicon source. It still ships in every deploy. | Optionally move it out of `public/`, for example to a `design/` folder. |

## Images (85)

Every image has width, height and alt text. The header logo is 64×64 and 3.4 KB. The deductions are the 188 KB favicon, PNG-only formats, the oversized guide hero, eager hover previews, and the inaccurate "illustrated diagram" alt text.

## AI Search Readiness (65)

GEO scored 58 and agent-readiness about 80.

**Works:**
- All AI crawlers are allowed. Twelve crawler user agents each got HTTP 200 with an identical body.
- The site is server-rendered.
- Controls are labelled; FullscreenStage's Start and Prev/Next buttons have aria-labels.
- Guides often open with a definition and include real numbers.

| Sev | Finding | Fix |
|---|---|---|
| High | Tool pages have no "what this test checks" passage. Prose is about 132 words and FAQ answers about 30 words. | This is the same fix as C1. |
| High | No sources (see Content). | Same fix. |
| Medium | Thin entity: Organization has only name, url and logo; the operator is anonymous. | Same fix as C2. Confirm how the brand relates to the "nelera" donation profiles before using them in `sameAs`. |
| Medium | No off-site presence. Hacker News and Wikipedia have 0 mentions; YouTube has none; GitHub has only the repo. Reddit couldn't be checked. | Answer real questions on r/Monitors and r/buildapc, post demo videos, and list the site in tool directories. |
| Low (optional) | `/llms.txt` returns 404. Google ignores it and the benefit is unproven. | If you want it, add a static `public/llms.txt`. |
| Low (optional) | No Content-Signal line in robots.txt. It's a draft standard that Google doesn't act on. | It would mean replacing `robots.ts` with a static `public/robots.txt`; only worth it for an explicit AI-training preference. |

## Search Experience (SXO)

Every target query's SERP type matches ours: tool or tool-hub. The gaps are capability and depth, not page type.

| Query | SERP type | Top competitors | Our gap |
|---|---|---|---|
| dead pixel test | Tool (8/9) | testufo, darkblackscreen, xbitlabs | No one-click colour grid; the fixer is buried as frame 10; 493 words vs 1,000–1,400 |
| screen test | Split (6/10 film meaning) | testmyscreen, screentester.io, screendetect | The H1 lacks the phrase; the CTA navigates away; copy overlap |
| refresh rate / monitor hz test | Tool (7/9) | xbitlabs, fpstest, testufo | One rounded integer vs frame time, jitter and the closest standard rate |
| backlight bleed test | Tool plus guide | darkblackscreen, xbitlabs, frameratetest | No bleed-vs-glow imagery; 390 words |
| black screen | Mixed (5/9 are "black screen of death" troubleshooting) | blackscreen.space, fullblackscreen, blackscreen.cc | No colour row or presets; 1 FAQ; nothing for the troubleshooting intent |
| white screen | Tool | darkblackscreen, blackscreen.space, whitescreen.im | **Preview renders grey**; no presets (Zoom lighting, cleaning); 1 FAQ |

SXO gap scores:

| Page | Score |
|---|---|
| /dead-pixel-test/ | 60 |
| Homepage | 57 |
| /backlight-bleed-test/ | 56 |
| /refresh-rate-test/ | 54 |
| /white-screen/ | 51 |
| /black-screen/ | 50 |

The weakest dimensions across all pages are Trust (no methodology or author) and Action (the session ends at Esc with no "record it / what next" step).

## Sitemap

**Valid:**
- 80 unique URLs, each matching its page's canonical and complete against the routes in the source.
- The robots.txt Sitemap line is present.
- The IndexNow key returns 200.

**lastmod distribution:** 2026-10-01 for 53 URLs, 2026-08-27 for 23, and 2026-06-21 for 4. The guide dates are honest. Tools and static pages share a single `SITE_UPDATED` (Top-5 issue #5). changefreq and priority are ignored by Google (Info).

## Backlinks

There is **not enough data**. The domain is absent from Common Crawl's cc-main-2026-jan-feb-mar graph, which means it hasn't been crawled into it yet, not that it has no links. No DA or referring-domain numbers were invented. GSC and Bing Webmaster Tools are already verified for this site (per project notes), so their Links reports are the free source for real backlink data. Use them before buying a tool.

## Visual / mobile

**Passes:**
- The H1 and Start control are above the fold on mobile for every page tested.
- No horizontal overflow at 375 px.
- Body text is 16–18 px.
- No interstitials.

| Sev | Finding | Fix |
|---|---|---|
| Medium | On mobile, the refresh-rate preview readout overlaps the Start pill (`RefreshRateTool.tsx:28`, `FullscreenStage.tsx:288`). | Render a compact frame when `!active`. |
| Medium | Accent `#d6336c` on `#0a0b0f` has 4.26:1 contrast, below AA for small labels; `text-accent/70` in `ToolCard.tsx:13` is lower still. | Use a lighter accent for text and drop `/70`. |
| Low | Tap targets under 44 px: header links, frame-picker arrows and footer links. The wordmark truncates to "BestSc…" at 375 px. Guide text column is about 285 px on mobile. | `Header.tsx:14-27`, `FullscreenStage.tsx` arrow buttons, `Footer.tsx:27-81`, `blog/[slug]/page.tsx:80,113`. |

## Topic clusters

65 keywords were run through web search; these are not confirmed Google top-10 results and have no volumes. The highest URL overlap between any two keywords was 4, so the data supports **no merges**. bestscreentester.com appeared in none of the 65 result sets. Full matrix and plan are in `findings/cluster.md`.

**The link modules undercut the hub-and-spoke structure.** All three checked in code:

| Sev | Finding | Fix |
|---|---|---|
| Medium | `getGuidesForTool` returns the **first 4 guides in array order**, not the most relevant (`guides.ts:2600-2602`). `/dead-pixel-test/` hides 11 linking guides, including dead-vs-stuck, fix-stuck and warranty. The warranty guide appears on no tool page. | Rank by relevance: for example, the number of links to the tool's path, then a primary-topic tag, then recency. Optionally raise `take` for tools with many linking guides. |
| Medium | `getRelatedGuides` ranks by tag overlap and breaks ties alphabetically (`guides.ts:2583-2595`). 23 of 44 guides carry the generic `guide` tag, so Blue Light, Color Gamut and Contrast Ratio fill 28 of the 130 related slots. | Drop `guide` from the tag scoring (or from the tags), and use topical tags. |
| Low | 10 tools never appear in any "Related tests" module (`[tool]/page.tsx:42-45`). The flickering guide doesn't link `/pwm-flicker-test/`. | Choose related tools by shared category or guide co-links. Add the missing contextual link. |

**Gaps seen in the SERPs, in priority order:**

| Priority | Items |
|---|---|
| P1 | Turn the warranty guide into a by-brand dead-pixel policy page, using official manufacturer sources. Search snippets disagree on Dell's numbers. |
| P1 | Retarget the homepage on "monitor test" (overlaps with C3). |
| P1 | Refocus the monitor-buying guide as "how to test a new monitor", and make the new-device checklist the general hub. |
| P1 | New page: "how to test a used monitor". |
| P1 | New page: "how to fix screen burn-in", plus the OLED guide contradiction fix. |
| P2 | New page: returning or RMA-ing a monitor with dead pixels. Forums dominate this query, so competition is weak. |
| P2 | New pages: iPhone/iPad and MacBook screen tests. |
| P2 | New page: Samsung `*#0*#`. |
| P3 | New pages: using a TV as a monitor, and Steam Deck. |

The device pages need genuinely device-specific content, or they will read as doorway pages.

---

## What this audit could not measure, and what the next audit should check

- **Field data:** configure `~/.config/claude-seo/google-api.json` (a PSI/CrUX key plus GSC OAuth). That gives real LCP, INP and CLS, indexation, and query-level impressions.
- **Real rankings:** GSC → Performance → Queries for "screen test", "monitor test", "dead pixel test" and "white screen". Is the homepage getting impressions for "screen test" at all?
- **Backlinks:** the GSC and Bing WMT Links reports.
- **The homepage crash:** a cold load in a real browser with the console open, in the 10 minutes after a deploy.
- **The next audit should check:** homepage overlap at 5% or less, re-measured with the same 6-gram script; GSC impressions for the six money queries; whether the tool-page depth changes moved the SXO gap scores; and the first non-zero Common Crawl or GSC referring domains.
