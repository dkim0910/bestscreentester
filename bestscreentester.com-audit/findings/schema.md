# Schema / Structured Data RE-AUDIT - bestscreentester.com (2026-10-02, live = main b6e17c2)

Score: 86/100 (previous 84, +2)

## Method
Fetched live HTML (raw, server-rendered; no SPA dependency) and parsed every JSON-LD block on: /, /tools/, /blog/, /about/, 7 tools (dead-pixel, color, refresh-rate, hdr, screen-info, touch-screen, pwm-flicker), 5 guides. Also counted FAQPage/HowTo on all 35 non-guide sitemap URLs. All JSON-LD only, @context https://schema.org, all blocks parse. All 13 referenced image URLs return 200 image/png; logo.png verified 512x512 (icon.png now 96x96, as the deploy note says).

## Previous findings status
1. INFO HowTo on tools: STILL PRESENT. Live on 28/28 tool pages ([tool]/page.tsx:54, seo.ts:124). Not recommended, no SERP value, harmless. Do not extend.
2. INFO FAQPage: CHANGED (content). Home has 6 Q&As (HomeSections.tsx:358). Tools: 18 pages have 3 Q&As, 10 have 2 (none missing). Still no Google SERP feature after May 7 2026; AI/GEO benefit unconfirmed. No action; do not add or remove for SERP reasons.
3. INFO WebApplication not rich-result eligible: STILL PRESENT, correct (no ratings invented).
4. LOW entity linking: PARTLY FIXED. Article.author now references the operator node (@id .../#operator) and publisher uses #organization: FIXED. WebApplication.publisher still an inline Organization with slash-less url `https://bestscreentester.com` and no @id (seo.ts:171): STILL PRESENT.
5. LOW no BreadcrumbList on /tools/, /blog/, /about/: STILL PRESENT (those pages emit only the sitewide Organization + WebSite).
6. LOW single Article image ratio: STILL PRESENT (1200x630 only).
7. LOW Organization minimal (no sameAs/contactPoint): CHANGED. Now has logo (/logo.png 512px, ImageObject with width/height) and parentOrganization; still no sameAs/contactPoint.
8. LOW date-only Article dates: STILL PRESENT (seo.ts:233-234). Valid; dates match visible bylines (TV guide: Published June 21, 2026, Updated October 1, 2026, matches datePublished 2026-06-21 / dateModified 2026-10-01).
9. INFO WebApplication enrichment (@id/isPartOf): STILL PRESENT, optional.

## Operator / author / logo graph validation
- Logo: PASS. Organization.logo = https://bestscreentester.com/logo.png, 512x512 (>=112 min), resolves. No longer points at the 96px favicon.
- @id consistency: PASS. Across all 16 sampled pages #organization, #website, #operator are identical strings with the same properties (Nelera, url https://bestscreentester.com/about/). WebSite.publisher and Article.publisher use {"@id": ".../#organization"}. Article.author uses the full #operator node (same @id and properties as Organization.parentOrganization), so a graph consumer merges them cleanly.
- Caveat: the #operator and #organization nodes are defined only as parts of the sitewide array, and the Article's publisher is an @id reference resolved only because the layout block is on the same page. That works because every page carries the sitewide block.
- Does Organization author with url = About page satisfy Google's Article guidance? Yes. Google accepts Person or Organization as author, requires `name`, and `url` is optional (it should be a page that establishes the author, such as a profile or About page). The visible byline says "By Nelera" on the guide, matching author.name, and /about/ names Nelera ("built and maintained by Nelera, an independent developer"). Passes. Residual weakness (E-E-A-T, not a validity error): the author is a one-person entity with no individual Person, so there is no credential signal. Do not invent a Person; only add one if a real, named, visible author exists.
- parentOrganization semantics: valid (Organization.parentOrganization). Note the site calls Nelera "an independent developer" while typing it as an Organization; acceptable, and the code comment (seo.ts:10-13) correctly avoids claiming "LLC".
- Author URL points to /about/ whereas WebApplication.publisher still uses the root, so the two entities are not reconciled (see N1).

## New findings
N1. LOW (carry-over of #4, restated) WebApplication.publisher inline, no @id, slash-less url. Fix seo.ts:171 to `publisher: { "@id": `${absoluteUrl("/")}#organization` }`. Removes a duplicate unreconciled Organization on 28 tool pages.
N2. INFO Operator node is emitted in full inside every Article.author and again in the Organization, so it is duplicated on guide pages (harmless, same @id). Optional: in articleJsonLd (seo.ts:236-237) emit `{ "@id": ".../#operator" }` only, when no authorName override. Note the override branch (seo.ts:236) builds an author Organization with url = site root and no @id; that branch is not used live today, but would create a mismatched entity if any guide sets an author. Prefer `@type: Person` for named human authors.
N3. INFO Home FAQ replaced and valid (6 Q&As, content visible per prior audit pattern); tool FAQ counts uneven (10 tools at 2 Q&As). No action; FAQPage has no SERP benefit.
N4. LOW /about/ has no AboutPage type linking to the #operator entity (about/page.tsx). Optional: add AboutPage with `mainEntity: {"@id": ".../#operator"}` so the author url target is machine-tied to the entity. Low value.

## Missing opportunities (honest only)
- BreadcrumbList on /tools/, /blog/, /about/ (src/app/tools/page.tsx, src/app/blog/page.tsx, src/app/about/page.tsx via breadcrumbJsonLd, seo.ts:137). Only concrete gain.
- No Product/Review/VideoObject/Event/JobPosting applies. Do not add HowTo. No SearchAction.

## Score movement
84 -> 86. +3 Article author now a consistent @id-linked entity matching visible byline and About page; +1 logo meets size minimum and carries dimensions; -2 unchanged: WebApplication.publisher mismatch (#4/N1), no top-level breadcrumbs, no sameAs. Remaining deductions are the deprecated HowTo still emitted (info) and low-severity polish items.

## Ready-to-paste (seo.ts:171)
```ts
publisher: { "@id": `${absoluteUrl("/")}#organization` },
```
