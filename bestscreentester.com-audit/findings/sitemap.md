# Sitemap re-audit - 2026-10-02 (live = main b6e17c2, deployed 2026-10-01 15:03 UTC)

## Previous findings
1. Blanket SITE_UPDATED lastmod (was Medium): FIXED. sitemap.ts:24-29 now uses per-tool `t.updatedAt`; static pages use `PAGE_UPDATED` (seo.ts:29-36); guides use per-guide dates (sitemap.ts:35). /about, /donate, /feedback, /privacy, /terms now carry distinct dates. SITE_UPDATED (seo.ts:23) is used only for /tools and /blog (sitemap.ts:14-15).
2. changefreq/priority on all 80 entries (sitemap.ts:13-38): UNCHANGED, Info, removable.
3. No guard against a future blanket bump: partly mitigated (per-entry fields), still no automated check. Low.

## Pass/fail
- XML valid (xmllint OK), 80 unique <loc>, 13.5 KB, urlset ns correct: PASS
- All 80 return 200 with no redirect (redirects disabled in test), canonical == loc for all 80, no robots noindex: PASS
- Completeness vs source (28 tools + 44 guides + 8 static = 80; GUIDES.length 44): PASS
- robots.txt has Sitemap line; IndexNow key file 737833e7...txt present in public/: PASS

## lastmod distribution (live)
2026-10-02: 1 (/) | 2026-10-01: 54 | 2026-08-27: 16 | 2026-07-29: 2 (privacy, terms) | 2026-06-21: 7 (feedback, 3 tools, 3 guides).

## Honesty check (git)
Verified honest:
- / = 10-02: 9c86a61 rewrote the homepage (committed 2026-10-02 00:02 JST = 10-01 15:02 UTC). Date is JST; harmless.
- /about, /donate = 10-01: 510a538 added author/operator text (about) and tool-count/operator copy (donate).
- /tools, /blog = 10-01: d65558f added 8 tools and 8 guides.
- 25 tools at 10-01: each tools.ts entry has content hunks since f769207 (diff -U0 of tools.ts) plus component changes; 8 are new.
- 16 guides at 08-27: body byte-identical to f769207 (programmatic compare). 8 new guides at 10-01 (publishedAt), 17 existing guides at 10-01 have body changes vs f769207.
- how-to-test-a-monitor-before-buying (06-21): body unchanged since f769207.

Understated (Low, not harmful):
- color-test, backlight-bleed-test, burn-in-test = 06-21, but their visible page changed 10-01: tools.ts entries only gained updatedAt, yet "Related guides" grew (color-test 10 -> 13 linking guides, backlight 6 -> 7, burn-in 5 -> 6 via `(/slug)` matching in guides.ts), "Related tests" grew with new same-category tools ([tool]/page.tsx:42), and ColorCycler added previewScrim={false} (visible preview change, FullscreenStage).
- dead-vs-stuck-vs-hot-pixels (06-21): body gained an internal link to /blog/dead-pixel-warranty-policies since 08-27 (guides.ts:265 entry). Minor.
- /feedback (06-21), /privacy and /terms (07-29): visible contact address changed nelera.com -> nelera.net on 10-01 (c90deb4: seo.ts CONTACT_EMAIL + ci.yml; live pages confirm nelera.net). Arguably trivial; privacy/terms displayed legal date correctly stays 07-29.
Effect: these 7 pages are not re-submitted by IndexNow (7-day window); no inflation risk.

## New issues
- None critical/high. Only the Low understated-lastmod items above and the Info changefreq/priority.
- Quality gate (location pages): n/a.
