# Action Plan: bestscreentester.com (re-audit, 2026-10-02)

**Score:** 84, up from 77.

**Done since the first audit:**
- Homepage rewritten.
- Factual errors fixed.
- Nelera named as author.
- 38 citations added.
- 28 FAQs added.
- Honest sitemap dates.
- 404 page metadata.
- Smaller favicon.
- White Screen preview fixed.
- Refresh-rate readout improved.
- Related guides on tool pages ranked by relevance.
- Contact email fixed.

Every item below is still open. Each item lists:
- **Why:** the reasoning behind it.
- **Failed if:** how you'd know it didn't work.

---

## Phase 1: Quick fixes, under a day in total

1. **Make the sources claim true** (`HomeSections.tsx:376`, `about/page.tsx:53`).
   - Right now only 13 of 44 guides link sources.
   - The fastest fix is to reword ("many guides link…"). The better fix is item 8.
   - **Why:** an overclaim about sourcing undercuts the trust it's meant to build.
2. **Rewrite the device-guide card blurbs** (`HomeSections.tsx:170-177`).
   - They paraphrase screentester.io's device cards; alternatively, drop the section.
   - **Failed if:** the cards still read as reworded versions of theirs side by side. The exact-match overlap check can't catch paraphrases.
3. **Add "Monitor Test" to the homepage `<title>`** (`page.tsx:17,29`).
4. **Refresh-rate preview** (`RefreshRateTool.tsx:25-49`).
   - Opt out of the dark overlay.
   - Show a compact readout when the test isn't running.
   - Make sure the caption doesn't sit behind the Start button on mobile.
5. **Make "Normal, or worth returning?" a real `<table>`** (`HomeSections.tsx:275-298`).
   - Add a caption, header cells, and labels for the mobile layout.
   - **Why:** text extractors (and likely AI engines) drop the current `div` layout.
6. **Sitemap date catch-up:** set these to 2026-10-01, since each changed that day:
   - Feedback, Privacy and Terms (`PAGE_UPDATED`): the contact email changed. Note in the comment that this is a non-legal edit, so it can differ from `LEGAL_UPDATED`.
   - Color, Backlight Bleed and Burn-in (`updatedAt`).
7. **Small structured-data fixes:**
   - `WebApplication.publisher` → `{"@id": …#organization}` (`seo.ts:171`).
   - `breadcrumbJsonLd` on /tools/, /blog/ and /about/.
   - Optional: drop the explicit `robots` in `not-found.tsx`.

## Phase 2: Trust and tool depth, about 1–2 weeks

8. **Cite the remaining 31 guides.**
   - Same method as before: primary sources, every URL fetched and quoted.
   - Start with the ones that lean on standards or health claims: gamma, PWM flicker, RGB range, the checklist's ISO mention, HDR and banding.
   - **Failed if:** any guide still names a standard without linking it.
9. **Author depth (your call).**
   - 2–3 lines on About: background, and the hardware the tests were checked on.
   - Optional: `sameAs` → nelera.net, which would tie the site to your name.
   - Optional: a Person author.
10. **First-hand evidence.** Real photos of bleed, IPS glow, a dead pixel and the panning-grey dirty screen effect, taken on your own panels, placed in the matching guides.
    - Also replace the "illustrated diagram" alt text (`blog/[slug]/page.tsx:117`).
    - **Why:** Experience is the weakest E-E-A-T factor at 38.
11. **Tool depth** (`tools.ts` + `[tool]/page.tsx:104-135`). Add a "what this test checks / reading your result" block, about 150 words, to each tool, starting with dead pixel, white, black, refresh rate and backlight bleed.
12. **Tool features the search results reward** (SXO):
    - Dead pixel: a colour swatch row and a "Fix a stuck pixel" button (`DeadPixelTool.tsx:114-133`).
    - White and black screens: presets (`ToolRunner.tsx:49-53`).
    - F or Enter to start a test (`FullscreenStage.tsx:149`).
    - A post-test "found something?" summary.
13. **Hardening:**
    - `error.tsx` / `global-error.tsx`.
    - Accent contrast (`globals.css:8`, `ToolCard.tsx:13`).
    - Harmonize warm-up times (`guides.ts:30/98/158`).

## Phase 3: Architecture and authority, month 2

14. **Internal links:**
    - Drop the generic `guide` tag from related-guide scoring (`guides.ts:2587`).
    - Pick "Related tests" by relevance, not file order (`[tool]/page.tsx:42-45`).
    - Link the flickering guide to `/pwm-flicker-test`.
15. **Cannibalisation:**
    - Remove "gamma test" from greyscale-test's keywords (`tools.ts:197`) and "ips glow" from black-level-test's (`:566`).
    - Separate color-test from dead-pixel-test.
    - Make one bleed/glow comparison page the canonical one.
16. **New pages:** cluster plan P1 (`findings/cluster.md`): a by-brand pixel-policy page, "how to test a used monitor" and "how to fix burn-in".
17. **Off-site, the biggest lever left:**
    - Genuine answers on r/Monitors and r/buildapc.
    - Short demo videos.
    - Tool directories.
    - Outreach to monitor reviewers.
    - **Watch:** referring domains in the GSC and Bing Webmaster Tools Links reports.
18. **Performance:**
    - Load each tool's code only on its own page via `next/dynamic` (`ToolRunner.tsx:3-18`).
    - Stop preloading Geist Mono everywhere.
    - Load hover previews only on hover.
    - Serve a WebP/AVIF guide hero.
    - Add a modern `browserslist`.

## Phase 4: Monitoring

- Run `/seo drift baseline https://bestscreentester.com` now.
- Add PSI/CrUX/GSC credentials so audits measure field data and real rankings.
- Each week, check GSC impressions for the core searches ("screen test", "monitor test", "dead pixel test", "white screen", "refresh rate test") and for the brand name.
- Re-audit in about 4–6 weeks, after the Phase 1–2 changes have been recrawled.
