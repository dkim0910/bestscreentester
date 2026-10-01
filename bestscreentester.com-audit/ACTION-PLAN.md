# Action Plan: bestscreentester.com (2026-10-01)

This plan is a dependency graph, not a flat list. Several findings from different specialists turned out to have **one** shared fix. These are grouped as combined fixes (C1–C4) so you change each file once.

Each item gives four things:
- **Why:** the first-principle observation behind it.
- **Unblocks:** what it makes possible.
- **Failed if:** how you would know it didn't work.
- **Watch:** a leading indicator you can monitor without re-auditing.

The **binding constraint** is differentiation and trust on the pages meant to rank, not technical health. Nothing here blocks indexing.

---

## Phase 1: Week 1 (highest leverage, mostly copy edits)

### C3. Rewrite the homepage copy (`src/components/HomeSections.tsx`, `src/app/page.tsx`): High

This one rewrite fixes three findings:
- **Verbatim overlap with screentester.io** (31.7% of 6-word sequences; mirrored H2 order).
- **Homepage factual errors and contradictions:** `:39` "IPS ~1ms", `:29,178` "DCI-P3", `:130` "only bleed needs darkness", `:135` "15–30 min".
- **SXO:** the H1 doesn't target "screen test" or "monitor test" (`page.tsx:41-43`).

Steps:
1. Write new section structure and copy in your own words.
2. Lead with what only this site has: 28 tests, including HDR, PWM, wide gamut, the WebGL pipes and the cracked prank, plus the guides.
3. Make the H1 something like "Free Online Screen Test & Monitor Test".
4. Consider putting QuickColors in the hero, so a test starts without leaving the page.

- **Why:** a hub page that duplicates an established ranking page adds almost no new information, and Google tends to filter near-duplicates rather than rank both.
- **Unblocks:** homepage ranking for "screen test" and "monitor test", and safe internal linking from the hub.
- **Failed if:** re-running the overlap check (6-gram share against screentester.io/) is still above 5%. Or, 6–8 weeks after recrawl, GSC still shows no homepage impressions for "screen test" or "monitor test". In that case authority, not duplication, is the binding constraint, so move effort to C4 and off-site work.
- **Watch:** GSC → Performance → Page = `/` → Queries.

### Factual and promise fixes (`src/lib/guides.ts`, `src/lib/tools.ts`, `src/app/donate/page.tsx`): High

1. `guides.ts:444`: ISO 9241-307 class structure. Verify against the standard; Classes I–IV are ISO 13406-2.
2. `guides.ts:1983`: parts history. Per Apple support 102658, iPhone 11 also lists Display.
3. `tools.ts:189-194`: remove the "gamut", "dci-p3" and "gamut test" claims from Color Gradient, and link `/wide-color-gamut-test/` instead.
4. `guides.ts:1460`: the burn-in excerpt says "still fixable".
5. `guides.ts:324`: "4 Methods That Actually Work" vs `:367`.
6. `guides.ts:427` and `:251`: "each major manufacturer". Either add a sourced table or reword.
7. `donate/page.tsx:8,23`: use `TOOLS.length`.

- **Why:** wrong facts on a site with no named author are the trust signals most likely to be checked by readers, reviewers and AI answer engines.
- **Failed if:** n/a. These are correctness fixes and need no outcome test.
- **Bookkeeping:** set `updatedAt` on each guide you change, in line with the honest-lastmod rule.

### Honest sitemap lastmod for tools and static pages (`src/app/sitemap.ts:13-25`, `src/lib/seo.ts:16`): Medium

1. Add an optional `updatedAt` to `ToolDef`.
2. Add per-page constants for /about, /privacy, /terms, /donate and /feedback (or reuse `LEGAL_UPDATED`).
3. Keep `SITE_UPDATED` only for /, /tools and /blog.

- **Why:** the project's own invariant. The IndexNow ping currently submits unchanged pages as fresh.
- **Failed if:** the next deploy without content changes still gives every tool and static URL today's date.

### Small fixes (under an hour each): Medium/Low

- `src/app/not-found.tsx`: add `metadata` with a "Page not found" title and `robots: { index: false }`.
- Add `src/app/error.tsx` and `src/app/global-error.tsx`, themed, with a Reload button. Then look for the transient crash: load `/` cold in a real browser with the console open in the 10 minutes after a deploy.
- Replace `src/app/icon.png`, which is 512 px and 188 KB, with a small icon.
- `FullscreenStage.tsx:256-261`: no `bg-black/40` scrim for solid-colour previews, so White Screen looks white.
- **Link modules** (Medium):
  - `getGuidesForTool` (`guides.ts:2600-2602`) takes the first 4 guides in array order. Rank them by relevance instead.
  - `getRelatedGuides` (`:2583-2595`) is dominated by the generic `guide` tag (23 of 44 guides). Exclude that tag from scoring.
  - **Why:** these modules are the site's main internal-linking mechanism, and today they hide the most relevant guides (11 on `/dead-pixel-test/`).
  - **Watch:** clicks from tool pages into guides in GA4.

## Phase 2: Weeks 2–3 (tool-page depth and trust)

### C1. Make the money tool pages the best answer (`src/lib/tools.ts`, `src/app/[tool]/page.tsx`): High

This one change addresses Content (thin pages), SXO (depth and action gaps) and GEO (no citable passage).

Content and page structure:
1. Add `about` (130–170 words, "What this test checks") and `results` ("Reading your result / what's normal") fields to `ToolDef` (`tools.ts:11-22`).
2. Render both under question-form H2s after `ToolRunner` (`[tool]/page.tsx:108-110`).
3. Bring every tool to at least 3 FAQs. 14 have only 1.

Order of work: white-screen, black-screen, refresh-rate-test, dead-pixel-test, backlight-bleed-test, then the rest.

Capability fixes, from SXO:
- **Refresh rate:** have `useRefreshRate` (`:22-24`) return `{hz, frameMs, min, max, jitter}`. Show decimals and the closest standard rate. When the result is at or below 61 Hz, show a "Stuck at 60 Hz?" link to the existing guide.
- **White and black screen:** a swatch row and presets (warm/cool white for lighting, dim grey), reusing the QuickColors `start(i)` pattern (`ToolRunner.tsx:49-53`).
- **Dead pixel:** a one-click swatch row plus a "Fix a stuck pixel" button (`DeadPixelTool.tsx:115-131`).
- **All tools:** F/Enter starts the test (`FullscreenStage.tsx:141-143`). Add a client-only "Found something?" panel with a copyable summary.

Notes:
- **Why:** every target SERP is tool-type, and we match the type. We lose on capability and on explanation. Depth alone doesn't win: testufo ranks with about 5 words because it is the most capable tool.
- **Unblocks:** an AI-citable passage on every tool page, and stronger landing pages for the off-site work.
- **Failed if:** after 6–8 weeks, GSC impressions and average position for the six money queries haven't moved. Then authority is the constraint (see C4 and off-site).
- **Watch:** GSC impressions and CTR per tool page. GA4 engagement: does anyone start a test?

### C2. Name the maintainer and cite sources (`src/app/about/page.tsx`, `src/lib/guides.ts`, `src/lib/seo.ts`): High

This combines three findings from different passes:
- Content: E-E-A-T. No author is named, and the /about meta description makes a promise the page doesn't keep.
- Schema: the author is an Organization; publisher and author are inline objects.
- GEO: the entity is thin, and there are no sources.

1. Add a "Who makes this" section on /about, before `:45`. Use a real name or a consistent pen name, with background and the hardware the tests were checked on. Your call, given privacy.
2. Add `author` to the `Guide` interface (`guides.ts:5-17`). Render it in the byline (`blog/[slug]/page.tsx:125`). Emit a Person in `articleJsonLd` (`seo.ts:203`).
3. Point the publisher and author to `#organization` by `@id` (`seo.ts:151,203`). Add `contactPoint`, and `sameAs` for real profiles only.
4. Add 1–3 primary-source links per standards claim in the guides: ISO 9241-307, VESA DisplayHDR, ITU-R BT.2020, Apple support 102658.
5. Add real photos of bleed, IPS glow and dead pixels taken on your own panels. Fix the hero alt text, which says "illustrated diagram" (`blog/[slug]/page.tsx:117`).

- **Why:** the site is young and anonymous. Who is behind a page is the cheapest trust signal to add and the hardest for competitors to copy.
- **Failed if:** n/a for SEO in isolation. This is a hygiene and trust prerequisite for C4 and off-site outreach.

## Phase 3: Month 2 (architecture and authority)

### C4. Resolve cannibalisation and fill cluster gaps: Medium

Give each query one owner:
- `gamut` / `dci-p3` → `/wide-color-gamut-test/`, not color-gradient (`tools.ts:194` vs `:705`).
- `gamma test` → `/gamma-test/`, not greyscale-test (`tools.ts:171`).
- Black-screen vs backlight-bleed-test keywords (`tools.ts:97,141,144`).
- Make the bleed-vs-glow comparison guide (`guides.ts:2036`) the single comparison page, and trim `:1329-1334` and `:1364-1374`.

New pages, from `findings/cluster.md` (P1 first):
1. By-brand dead-pixel policy page, upgrading the warranty guide with official sources.
2. "How to test a used monitor".
3. "How to fix screen burn-in", with the OLED guide fixed alongside it.
4. Monitor-buying guide refocused as "how to test a new monitor".
5. Then P2: RMA/returns, iPhone/iPad, MacBook, and Samsung `*#0*#`.

Each new page needs real, page-specific content, or it risks reading as a doorway page.

Notes:
- **Failed if:** two of our URLs still swap ranking for the same query in GSC (Performance → Query → Pages).

### Off-site: Medium

- Give genuine answers on r/Monitors and r/buildapc. Don't spam.
- Post short YouTube demos of the bleed, PWM and HDR tests.
- Get listed in tool directories and "alternatives" lists.
- Pitch monitor reviewers to use the site's tests.

Notes:
- **Why:** there is no measurable backlink or brand footprint (absent from Common Crawl, no mentions found). For AI answers, off-site mentions carry more weight than on-page tweaks.
- **Watch:** referring domains in the GSC and Bing WMT Links reports, and brand-name queries in GSC.

### Performance and polish: Low/Medium

- `ToolRunner.tsx:3-18` → `next/dynamic` per slug, which saves about 38 KB gzipped per tool page.
- Load Geist Mono only where it's used (`layout.tsx:3-4`).
- Lazy-load hover previews (`ToolCard.tsx:23-29`).
- Use a smaller WebP/AVIF guide hero on the page.
- Set a modern `browserslist`.
- Breadcrumbs on /tools/, /blog/ and /about/.
- Accent text contrast (`ToolCard.tsx:13`).
- Tap targets (`Header.tsx`, `Footer.tsx`, frame-picker arrows).
- Refresh-rate mobile preview overlap.
- `/feedback/` heading order.

## Phase 4: Ongoing monitoring

1. **Field data:** configure `~/.config/claude-seo/google-api.json` (a PSI/CrUX API key plus GSC OAuth) so future audits use real CWV and query data instead of lab estimates.
2. **Baseline:** run `/seo drift baseline https://bestscreentester.com` now. After each phase ships, run `/seo drift compare` to catch regressions.
3. **Leading indicators:** watch these weekly:
   - GSC impressions for "screen test", "monitor test", "dead pixel test", "refresh rate test", "white screen" and "black screen".
   - Brand-query impressions.
   - Referring domains (GSC Links).
4. **Re-audit:** in about 8 weeks, after Phases 1–2 have been recrawled.

## Not recommended

- Adding HowTo or FAQPage markup for SERP benefit, since both rich results are retired. Existing blocks are harmless and can stay.
- Fabricated ratings or reviews on WebApplication.
- Blocking `/_next/` or `*.txt` in robots.
- Anything that needs a server.
- Security headers or long-lived cache headers, unless you decide to put a CDN such as Cloudflare in front of GitHub Pages.
