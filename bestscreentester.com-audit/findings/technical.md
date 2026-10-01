# Technical + On-Page re-audit, bestscreentester.com (2026-10-02, main b6e17c2)

Scores: Technical 90/100 (was 88; 85 orchestrator-adjusted), On-Page 94/100 (was 93; 82 adjusted).

Crawl: all 80 sitemap URLs 200, self canonical (trailing slash), robots `index, follow`, 1 H1, titles 24-62 chars, descriptions 116-157, zero duplicate titles/descriptions, zero internal links to 404/redirect, zero orphans (min inbound 2). Only heading issue: /feedback/ H1->H3.
Cold homepage: 3 forced Playwright renders, 4791 chars text each, no error screen (transient crash still unreproduced; 0/3).

## Previous findings
1. 404 metadata: CHANGED/mostly fixed. Title now "Page not found · BestScreenTester"; no canonical. Still emits two robots metas (`noindex` and `noindex, follow`), both noindex so harmless (src/app/not-found.tsx:5-8). Low.
2. www+http slash-less 2 hops: STILL PRESENT (http://www.../tools -> 301 to https://bestscreentester.com/tools -> slash). Pages-level, requires hosting change.
3. No security headers, max-age=600: STILL PRESENT, requires hosting change.
4. /feedback/ H1->H3: STILL PRESENT (footer h3s). Add H2 in src/app/feedback/page.tsx or demote footer headings.
5. Generic og.png on 8 pages: STILL PRESENT (optional).
6-8. Info items unchanged (no meta CSP, no hreflang correct, no AI crawler rules). robots.txt valid, IndexNow key 200 and matches.

## Claimed deploys, verified live
- Over-promising guide titles/excerpts: FIXED (all 44 titles are plain descriptive; e.g. "How to Test a Monitor Before (and Right After) Buying"). Minor: 6 guide titles carry the " · BestScreenTester" suffix and 38 don't (consistent only by length budget); Info.
- Related guides on tool pages: FIXED. dead-pixel-test lists dead-vs-stuck, fix-stuck-pixel, laptop, what-causes; color-gradient-test lists gamut, gamma, calibrate, banding; gamma-test lists gamma-explained, calibrate, photo-editing, checklist.
- Color Gradient vs gamut cannibalisation: FIXED. Gradient description is banding/posterization focused; gamut terms live on wide-color-gamut-test and the gamut guide.
- Favicon size: FIXED. /icon.png is 1499 bytes, 96x96; apple-icon 180x180.
- Homepage: H1 "Free Online Screen Test & Monitor Test" present (single H1). Title is still "Free Online Screen Test · BestScreenTester" (no "Monitor Test"); desc mentions "monitor tests". Low.

## New findings
- None Critical/High/Medium. Low: homepage <title> omits "monitor test" (src/app/page.tsx metadata title). Low: duplicate robots metas on 404.
