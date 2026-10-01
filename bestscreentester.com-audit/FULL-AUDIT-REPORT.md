# SEO Re-Audit: bestscreentester.com

**Date:** 2026-10-02.

**Build audited:** live `b6e17c2`, deployed 2026-10-01 15:03 UTC. It includes every fix from the first audit plus the homepage rewrite.

**Baseline:** the first audit, which scored 77 earlier the same day, is in git at `3ebaa9f`. Compare the two with `git diff 3ebaa9f -- bestscreentester.com-audit/`.

**Method:**
- 9 specialist passes re-ran against the live site: technical, content, schema, sitemap, performance, visual, GEO, agentic and SXO.
- Each pass re-checked every finding from the first audit before scoring, using the same rubric.
- **Carried over, not re-run:**
  - **Backlinks:** the Common Crawl graph only changes quarterly.
  - **Cluster:** its keyword research is a day old, and nothing structural changed. Its internal-link findings were re-checked against the code; see below.

**Data gaps (unchanged):**
- No GSC, CrUX or GA4 API access, so there is no field Core Web Vitals data and no real rankings.
- Keyless PageSpeed Insights hit its rate limit again, so performance is lab data only.
- The search-results data is from a web-search tool, not live Google.

---

## SEO Health Score: **84 / 100** (was 77)

| Category | Weight | First audit | **Now** | What moved it |
|---|---|---|---|---|
| Technical SEO | 22% | 85 | **90** | 404 page metadata fixed, favicon 188 KB → 1.5 KB. The homepage crash didn't reproduce in 3 + 4 cold loads. |
| Content Quality | 23% | 60 | **73** | Factual errors fixed, 38 primary-source citations, Nelera named as author, 28 new FAQs. The homepage overlap with screentester.io fell from 19–32% to 0.1–0.5%. |
| On-Page SEO | 20% | 82 | **89** | Titles no longer over-promise, related guides are ranked by relevance, the gamut cannibalisation is gone, and the homepage H1 targets the queries. The agent scored 94; I subtracted 5 for the three remaining cannibalising pairs and the homepage `<title>`, the same adjustment method as the first audit. |
| Schema | 10% | 84 | **86** | Consistent `#operator` author/parent entity and a valid 512px logo. |
| Performance (lab) | 10% | 90 | **93** | Mobile 89–98, desktop 100, CLS 0. The guide's earlier 74 was a one-off. |
| AI Search Readiness | 10% | 65 | **68** | GEO 58 → 63 (citability +6, authority +13); agent readiness unchanged at about 80. |
| Images | 5% | 85 | **92** | Favicon. |

My pre-audit estimate was 84–85, so the measured result agrees.

### What drove the gain

The biggest movement was in Content (+13) and On-Page (+7). Both came from the same few changes:
- The homepage copy is now original.
- The author is named.
- Claims in the guides link their primary sources.
- The factual errors are fixed.

### The binding constraint now

Technical, schema and performance are near their ceilings. The remaining on-site points are in Content (73) and AI Search (68), and they share the same causes:
- **No first-hand evidence:** no photos or measurements of real panels.
- **A thin author identity:** Nelera is an organization name with no background or test hardware given.
- **Uncited guides:** 31 of 44 guides still have no source links.
- **Thin tool pages:** no "what this test checks / reading your result" passage.

Beyond the site itself, there are still no measurable backlinks or brand mentions. For a young domain, that matters more than the next few points of score.

---

## Status of the first audit's top issues

| Issue | Status |
|---|---|
| Homepage overlapped screentester.io verbatim | ✅ Fixed: 0.1% of main text, 0.5% of all visible text. See the new paraphrase finding below. |
| Four factual errors (ISO classes, iPhone, DCI-P3, "IPS ~1ms") | ✅ Fixed. The same pass also caught and fixed the greyscale "256-step" claim, DisplayHDR 400, True Black, Rec. 2020, D65 and the cable wording. |
| No author / no citations | 🟡 Partly fixed: "By Nelera" with an About section; 38 citations in 13 guides. 31 guides are still uncited, and there is no person or background. |
| Thin, less capable tool pages | 🟡 Partly fixed: every tool has at least 2 FAQs (18 have 3); White Screen preview fixed; refresh rate shows decimals and frame time. The dead-pixel swatch row and fixer button, white/black presets and a results panel are still open. |
| Blanket sitemap `lastmod` | ✅ Fixed: per-tool and per-page dates. A few pages are dated *older* than their last change; see the action plan. |
| Contact email undeliverable (found mid-session) | ✅ Fixed: `hello+bestscreentester@nelera.net`. |

## New findings in this re-audit

| Sev | Finding | Evidence | Fix |
|---|---|---|---|
| **Medium** | **Copy overclaims sources.** The homepage says "The guides cite the standards and manufacturer documents they rely on", and About says the same in narrower words. Only 13 of 44 guides link any source; the gamma, PWM and RGB-range guides lean on standards uncited. I wrote these lines this session. | `HomeSections.tsx:376`, `about/page.tsx:53` | Either cite the remaining guides, or reword to what's true now ("many guides link…"). |
| **Medium** | **Device-guide cards paraphrase screentester.io.** Same five card names in the same order, near-identical blurbs (theirs: "OLED burn-in, touch dead zones, PWM flicker — essential for used phone inspection"). The block dates from 2026-06-21 and survived the rewrite because the overlap check only caught exact six-word matches. | `HomeSections.tsx:170-177` | Rewrite the six blurbs, or drop the section. The symptom picker already links these guides. |
| Medium | **Refresh-rate preview** is still dimmed, and its caption sits behind the Start button on mobile. | `RefreshRateTool.tsx:25-49`, `FullscreenStage.tsx:299` | Opt out of the overlay and render a compact readout when the test isn't running. |
| Medium | **The "Normal, or worth returning?" table is built from `div`s.** Text extraction (trafilatura, a stand-in for AI engines) drops all 11 rows, and on mobile it has no column labels. | `HomeSections.tsx:275-298` | Make it a real `<table>` with a caption and header cells, plus mobile labels. |
| Medium | No `error.tsx` / `global-error.tsx`, so if the transient crash recurs, users get Next's unbranded white screen. | `src/app/` | Add both, themed, with a Reload button. |
| Medium | Accent text contrast is 4.26:1, below the 4.5:1 accessibility (AA) minimum for small labels; `text-accent/70` is lower still. | `globals.css:8`, `ToolCard.tsx:13` | A lighter accent for text (about `#ee5a8f`), and drop `/70`. |
| Low | The homepage `<title>` lacks "Monitor Test". | `page.tsx:17,29` | "Free Online Screen Test & Monitor Test" (57 characters with the suffix). |
| Low | Warm-up advice disagrees: the checklist says 5 minutes, the monitor and TV guides say 20–30. | `guides.ts:30` vs `:98`, `:158` | 5 minutes for spotting defects; 20–30 before judging uniformity or color, or calibrating. |
| Low | Sitemap dates older than real changes: Feedback, Privacy and Terms (contact email changed 10-01); Color, Backlight Bleed and Burn-in (related lists and preview changed 10-01). | `seo.ts` `PAGE_UPDATED`, `tools.ts` `updatedAt` | Set to 2026-10-01. |
| Low | Duplicate Organization: `WebApplication.publisher` is inline, not `@id`. No breadcrumbs on /tools/, /blog/ or /about/. | `seo.ts:171`; tools, blog and about pages | Use `@id` `#organization`; add `breadcrumbJsonLd`. |
| Low | The 404 page emits two robots metas (both noindex, so harmless). | `not-found.tsx:5-8` | Optional: drop the explicit `robots`, since Next injects noindex itself. |
| Low | Two homepage FAQ answers mention Privacy and the checklist without linking them. | `HomeSections.tsx:213,229` | Optional links. |

### Re-checked from the cluster pass

| Finding | Status |
|---|---|
| Tool pages show their first 4 linking guides in file order | ✅ Fixed: relevance-ranked (`guides.ts:2626`). |
| Guide pages' related guides dominated by the generic `guide` tag | ❌ Still open: 23 of 44 guides carry it (`guides.ts:2587`). |
| "Related tests" only ever shows the first 4 tools in a category | ❌ Still open (`[tool]/page.tsx:42-45`). |
| The flickering guide doesn't link the PWM Flicker Test | ❌ Still open. |

### Unchanged since the first audit (carried forward)

- **Performance:** every tool's code ships on every tool page (`ToolRunner.tsx:3-18`, about 38 KB gzipped); Geist Mono is preloaded everywhere; hover previews load eagerly; the guide hero is oversized; and the polyfills are still shipped (no browserslist set).
- **Content:**
  - Experience is the weakest E-E-A-T factor at 38: there are no first-hand photos or measurements.
  - All 44 guides are under the 1,500-word blog floor.
  - /about is 286 words.
  - The guide hero alt text says "illustrated diagram".
  - Three pairs of pages still compete for the same searches: greyscale-test's "gamma test", black-level's "ips glow", and color-test vs dead-pixel-test.
- **Hosting limits:** security headers and long cache lifetimes need a CDN in front of GitHub Pages.
- **Optional:** `llms.txt` and Content-Signal (agent readiness). Neither is used by Google.
- **Backlinks:** none measurable; the domain isn't in Common Crawl's graph yet.

---

## What the next audit should check

- **Real rankings and indexing:** GSC impressions for "screen test", "monitor test", "dead pixel test", "white screen" and "refresh rate test", now that the homepage and guides have changed. Check about 2–4 weeks after Google recrawls.
- **Field data:** add a PSI/CrUX key in `~/.config/claude-seo/google-api.json` to replace lab estimates.
- **Change tracking:** run `/seo drift baseline https://bestscreentester.com` now, so later deploys can be compared.
- **Off-site:** the first referring domains and brand mentions.
