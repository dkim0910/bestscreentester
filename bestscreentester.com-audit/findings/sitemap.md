# Sitemap audit - 2026-10-01

Pass: XML valid (80 unique <loc>, 13.5 KB); all 80 return 200, no redirects; all end in "/"; canonical == loc for all 80; no noindex; complete vs source (28 tools, 44 guides, 8 static = 80, nothing missing/extra); robots.txt has Sitemap line; IndexNow key file 200 and body matches key; robots does not block /ads.txt or key file.

## lastmod distribution (live)
- 2026-10-01: 53 (36 tools+static, 17 guides)
- 2026-08-27: 23 (guides)
- 2026-06-21: 4 (guides)
Guide breakdown: 8 new guides (publishedAt 2026-10-01) + 9 guides with updatedAt bumped 2026-08-27 -> 2026-10-01 in cb1d550..HEAD. Guides are honest (per-guide dates, sitemap.ts:36).

## Findings
1. Medium - blanket lastmod for tools/static pages. sitemap.ts:13-20 and :25 use one SITE_UPDATED (seo.ts:16, "2026-10-01") for all 36 URLs. Git: SITE_UPDATED moved 2026-08-27 -> 2026-10-01 in cb1d550. Honest for: 8 new tool pages, tool pages touched today (inference: DeadPixel, Screensaver, Blooming, RefreshRate, FakeScreen, BootScreen, ScreenTearing components changed; 20 pre-existing tools not all changed), /, /tools, /blog (page.tsx/tools/blog changes in d65558f). NOT honest: /about, /privacy, /terms, /donate, /feedback - git log shows no change to these dirs since 2026-09-30. Effect: ~5 static + untouched tools get inflated lastmod and are submitted to IndexNow (indexnow.mjs 7-day window). Fix: per-entry dates, e.g. add `updatedAt` to Tool in tools.ts and static-page constants (LEGAL_UPDATED is already "July 29, 2026" in seo.ts:12 - parse it for privacy/terms/about); keep SITE_UPDATED only for /, /tools, /blog.
2. Info - changefreq/priority present on all 80 (sitemap.ts:13-40); Google ignores them. Removable.
3. Low (inference) - no lastmod mechanism guards against a future blanket SITE_UPDATED bump; consider deriving from git log in CI.

No critical/high issues. Quality gate (location pages): n/a.
