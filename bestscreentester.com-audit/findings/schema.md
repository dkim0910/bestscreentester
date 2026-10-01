# Schema / Structured Data Audit - bestscreentester.com (2026-10-01)

Score: 84/100

## Sampled live (all HTTP 200, JSON-LD parsed)
Home, /tools/, /blog/, /about/, 7 tools (dead-pixel, color, refresh-rate, fake-broken-screen, screen-info, hdr, touch-screen), 5 guides. Server-rendered (no SPA dependency). Format: JSON-LD only, @context https://schema.org everywhere, no Microdata/RDFa.

| Page type | Blocks |
|---|---|
| All pages (layout.tsx:49-50, one script holding an array) | Organization #organization, WebSite #website |
| Home | + FAQPage (HomeSections.tsx:339-340) |
| Tool | + HowTo, FAQPage, BreadcrumbList, WebApplication ([tool]/page.tsx:52-86) |
| Guide | + Article, BreadcrumbList (blog/[slug]/page.tsx:81-107) |
| /tools/, /blog/, /about/ | only the sitewide Organization + WebSite |

## Validation: passes
- Organization logo = /icon.png, fetched: 512x512 PNG (min 112x112 ok). WebSite.publisher references @id correctly; @id values consistent (`https://bestscreentester.com/#organization`).
- All URLs absolute with trailing slash (breadcrumb items, Article url/mainEntityOfPage, WebApplication url).
- Article: headline, datePublished, dateModified, author, publisher, image all present. Dates match visible `<time>` (TV guide 2026-06-21 / 2026-10-01 verified on page). ISO 8601 date-only form.
- Images resolve: /og/tools/*.png and /og/guides/*.png (10 checked) are 200, 1200x630 PNG; og.png 1200x630.
- BreadcrumbList: 3 positions, names match visible breadcrumb, correct hierarchy.
- WebApplication: offers (price 0 USD), applicationCategory UtilitiesApplication, operatingSystem, no fabricated aggregateRating (page.tsx:73 comment confirms intent). Correct.
- No placeholder text, no deprecated types other than the HowTo noted below.

## Findings

1. INFO - HowTo on all 28 tool pages ([tool]/page.tsx:52-55, seo.ts:104-115). Google removed HowTo rich results Sept 2023: no SERP feature. Harmless; do not extend it to guides. Not recommended for new use.
2. INFO - FAQPage on homepage + 28 tool pages (HomeSections.tsx:339, [tool]/page.tsx:56-59, seo.ts:92-102). FAQ rich results retired for all sites May 7 2026: no SERP benefit; any AI/GEO benefit unconfirmed. Valid markup, content visible on page; no action required.
3. INFO - WebApplication is not eligible for the software-app rich result (needs aggregateRating or review). Currently offers only. Correct to leave as is; do not add invented ratings. Only add AggregateRating if real, first-party-collected, visible reviews exist.
4. LOW - Entity linking: WebApplication.publisher is an inline Organization with `url: siteUrl()` (no trailing slash, no @id) at seo.ts:151, so it does not match the Organization node (`https://bestscreentester.com/`). Likewise Article.author inline Organization (seo.ts:203) while publisher uses @id. Fix: use `{ "@id": `${absoluteUrl("/")}#organization` }` for WebApplication.publisher (seo.ts:151) and Article.author (seo.ts:203; keep inline name only if a distinct author is passed).
5. LOW - /tools/, /blog/, /about/ have no BreadcrumbList or page-level type, though the guide/tool pages do. Add BreadcrumbList (Home > Tools, Home > Guides, Home > About) in src/app/tools/page.tsx, blog/page.tsx, about/page.tsx using breadcrumbJsonLd (seo.ts:117). Small benefit (breadcrumb display in SERP for those pages). Optional: CollectionPage/ItemList for /blog/ and /tools/.
6. LOW - Article image is a single 1200x630 (16:9-ish, 1.9:1). Google recommends images in multiple ratios (16x9, 4x3, 1x1). Optional; the "image" can be an array if more crops are generated.
7. LOW - Organization is minimal (name, url, logo). Add `sameAs` only for real profiles (e.g. the actual Ko-fi/Patreon/GitHub pages the site links to) and optionally `contactPoint` using CONTACT_EMAIL (seo.ts:8) in siteJsonLd (seo.ts:155-182). Do not add placeholder profiles.
8. LOW - Article date format is date-only ("2026-06-21"). Valid, but dateTime with timezone (e.g. 2026-06-21T00:00:00+00:00) is Google's preferred form; set in articleJsonLd (seo.ts:201-202) by appending a time.
9. INFO - Optional WebApplication enrichment: `@id` (`<url>#webapp`), `isPartOf: {"@id": ".../#website"}`, `featureList`. No rich result impact.

## Missing opportunities (honest only)
- BreadcrumbList on top-level pages (finding 5): the only concrete gain.
- No VideoObject / Product / Review / Event / JobPosting applies; do not add.
- Sitelinks SearchAction: not recommended (feature retired); site has no search anyway.

## Ready-to-paste: breadcrumb for /tools/ (use in src/app/tools/page.tsx)
```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"https://bestscreentester.com/"},
{"@type":"ListItem","position":2,"name":"Tools","item":"https://bestscreentester.com/tools/"}]}
```
(Generate via `breadcrumbJsonLd([{name:"Home",path:"/"},{name:"Tools",path:"/tools"}])`; same for Guides /blog, About /about.)
