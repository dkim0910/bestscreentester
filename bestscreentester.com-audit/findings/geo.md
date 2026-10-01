# GEO / AI Search Readiness: bestscreentester.com (re-audit)

Re-audit date: 2026-10-02. Live build = main b6e17c2. Previous audit: 2026-10-01, score 58.

Method:
- Live fetches with render_page.py (`--mode never`) of /, /black-screen/, /dead-pixel-test/, /about/, /blog/dead-pixel-warranty-policies/ and /blog/what-is-pwm-flicker/.
- curl for robots.txt, llms.txt and nelera.net.
- Metrics computed by importing the real `TOOLS` and `GUIDES` arrays with Node, from src/lib/tools.ts and src/lib/guides.ts at main.
- Source read: src/components/HomeSections.tsx, src/lib/seo.ts, src/app/about/page.tsx, src/app/[tool]/page.tsx and src/app/blog/[slug]/page.tsx.

What was not re-run:
- **AI-crawler UA test.** robots.ts was last changed in f769207, before the previous audit, and the live robots.txt is identical. The previous per-bot result (HTTP 200 for every bot) is carried over.
- **Off-site brand-mention searches.** Per instruction, nothing changed off-site, so the previous result is carried over.

## Score: 63 / 100 (+5)

| Dimension | Weight | Prev | Now | Weighted |
|---|---|---|---|---|
| Citability | 25% | 62 | 68 | 17.0 |
| Structural readability | 20% | 72 | 74 | 14.8 |
| Multi-modal content | 15% | 35 | 35 | 5.3 |
| Authority & brand signals | 20% | 25 | 38 | 7.6 |
| Technical accessibility | 20% | 90 | 90 | 18.0 |

Platform estimates are judgment, not measurement:

| Platform | Prev | Now |
|---|---|---|
| Google AI Overviews | 60 | 63 |
| ChatGPT | 50 | 53 |
| Perplexity | 52 | 57 |
| Bing Copilot | 58 | 61 |

Perplexity gains most because it weights sourced passages.

## AI crawler access (carried over; robots.txt unchanged)
Live robots.txt is `User-Agent: *` / `Allow: /`, with two disallows (`/*__next` and `/*index.txt$`) plus the sitemap line. That matches src/app/robots.ts.

| Bot | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search citation | allowed |
| Claude-SearchBot | Claude search citation | allowed |
| PerplexityBot | Perplexity search | allowed |
| Googlebot | Google Search, including AI Overviews | allowed |
| bingbot | Bing and Copilot | allowed |
| Applebot | Siri, Spotlight and Safari | allowed |
| GPTBot, ClaudeBot, CCBot, cohere-ai, Applebot-Extended | training only | allowed (a policy choice) |
| Google-Extended | Gemini/Vertex training and grounding, not AI Overviews | allowed |

## llms.txt / RSL
- /llms.txt and /llms-full.txt still return 404.
- llms.txt is optional, and Google ignores it. No platform has shown that it increases citations. Low priority.

## Brand mentions (carried over, not re-searched)
- **Previous result:** Wikipedia 0, YouTube 0, HN 0. The only GitHub hit is the owner's own repo. Reddit could not be verified.
- **New owned signal:** https://nelera.net/ (HTTP 200, title "Daniel Kim — Full-Stack Software Engineer & Product Builder") mentions BestScreenTester and links to https://bestscreentester.com. This is an owned property, not an independent mention.

## Status of previous findings

| # | Finding | Status | Evidence (live + source) |
|---|---|---|---|
| 1 | Tool pages lack a self-contained explanatory passage | **Open, partly improved** | No tool has a single FAQ any more (10 have 2, 18 have 3), and the FAQ-answer median rose from 29.5 to 36 words (range 15–66). But `ToolDef` still has no `about` field (keys are slug, name, title, tagline, description, category, icon, updatedAt, keywords, howTo, faq). src/app/[tool]/page.tsx:104-135 still renders only the H1, tagline, ToolRunner, "How to use" and "FAQ", with generic H2s. |
| 2 | No outbound sources | **Partly fixed** | 38 external links across 13 of 44 guides and 25 domains: iso.org, itu.int, cie.co.at, vesa.org, displayhdr.org, hdmi.org, pmc.ncbi.nlm.nih.gov ×4, dell.com, support.apple.com and others. Live check: the warranty guide links iso.org/standard/40102, Dell's pixel guidelines and a pixel-policy PDF. **31 guides still have 0**, including what-is-pwm-flicker (live: no body links). See new finding N2. |
| 3 | Manufacturer-coverage promise mismatch | **Fixed** | The excerpt is now "…ISO 9241 class limits, how brand policies count faults, and why returns win". The strings "each major manufacturer" and "actually promise" no longer appear anywhere in src. The body cites the Dell and ISO sources. |
| 4 | Thin entity, anonymous author | **Partly fixed** | Live Article `author` = Organization "Nelera" (@id `/#operator`, url /about/). The visible byline "By Nelera" links to /about/. About has a "Who makes" section (src/app/about/page.tsx:45-55), and the Organization has `parentOrganization` (src/lib/seo.ts:201). Still missing: `description`, `email` and `sameAs` on the Organization (seo.ts:185-202), and the operator url only points back to the site (seo.ts:181). See N3. |
| 5 | No off-site presence | **Open** | Carried over. |
| 6 | Home page contradicts the guides | **Fixed** | HomeSections.tsx was rewritten and "IPS ~1ms" is gone. The verdict row "One dark (dead) pixel: Often within the maker's allowance" (HomeSections.tsx:77-80) matches the guides. |
| 7 | Multi-modal is thin and an alt text is inaccurate | **Open** | src/app/blog/[slug]/page.tsx:117 alt is still `${post.title} — illustrated diagram` on a title card. There are no in-body diagrams, and tool pages don't show their own pattern image. |
| 8 | Hook-style intros | **Open** | how-to-test-a-monitor-before-buying (guides.ts:78) still opens "A monitor is a multi-year purchase…". response-time-vs-input-lag (guides.ts:1004) still opens "These two specs get mixed up constantly." |
| 9 | llms.txt absent | **Unchanged (info)** | 404 |
| 10 | FAQPage/HowTo JSON-LD | **Unchanged (info)** | The homepage now also emits FAQPage (HomeSections.tsx:356-359). Keep it for search features; it is not claimed as an AI-citation factor. |

## New findings

### N1. MEDIUM: The "Normal, or worth returning?" table is lost in text extraction
- **Evidence:**
  - All 11 verdict rows are in the raw HTML. That includes "One dark (dead) pixel", "Often within the maker's allowance" and "A connection fault".
  - None of them survive in render_page's trafilatura `extracted_text`. Only the H2 and subtitle remain, and the text jumps straight to "Tests for newer screens".
  - The symptom picker H3s, Prep cards, FAQ and "Who makes" block all do survive.
  - The cause is that the table is a `<div>` grid whose header row is `hidden md:grid` (src/components/HomeSections.tsx:275-298).
- **Caveat:** trafilatura is a proxy. No AI engine's actual extractor is known. Still, this is the most quotable new block on the homepage.
- **Fix:** render VERDICTS as a semantic `<table>`:
  - add a `<caption>`;
  - use `<thead>` with `<th scope="col">` for "What you see", "What it usually is" and "What to do";
  - make the first cell of each row `<th scope="row">`.
  - Keep the responsive look with CSS. Then re-run render_page to confirm the rows are extracted.

### N2. MEDIUM: Sourcing claims outrun the sourcing
- **Evidence:**
  - HomeSections.tsx:375-377 says "The guides cite the standards and manufacturer documents they rely on".
  - src/app/about/page.tsx:52-54 says "Where a guide relies on a standard… it links to that source".
  - Yet 31 of 44 guides have no outbound link, including guides that state standard values:
    - gamma-explained (guides.ts:661) gives "2.2 (sRGB)";
    - full-vs-limited-rgb-range (guides.ts:2287) gives "16–235";
    - what-is-pwm-flicker (guides.ts:1512) makes flicker and health statements;
    - plus ghosting, response-time, IPS glow and backlight-bleed guides.
- **Fix:** link the primary sources: IEC 61966-2-1 (sRGB), ITU-R BT.1886, CTA-861 (RGB range) and IEEE 1789-2015 (flicker). Start with the highest-traffic uncited guides. Until then, soften the two sentences to "Many guides link…".

### N3. LOW: The operator entity doesn't connect to its real home
- **Evidence:**
  - The site's operator schema url is /about/ (seo.ts:181) and has no `sameAs`. About (about/page.tsx:45-50) doesn't link nelera.net.
  - nelera.net already links to bestscreentester.com.
  - About calls Nelera "an independent developer", while the schema types it `Organization` (seo.ts:176-183).
- **Fix:**
  - Add `sameAs: ["https://nelera.net/"]` to `operatorJsonLd`, plus the GitHub repo if it stays public.
  - Add `description: SITE_TAGLINE` to the Organization (seo.ts:189-202).
  - Link nelera.net from the About "Who makes" section.
  - The owner should decide between Organization and Person and whether to name the person. nelera.net already does name them.

### N4. LOW: Tool pages show no date or byline
- **Evidence:**
  - `ToolDef.updatedAt` exists but src/app/[tool]/page.tsx never renders it or OPERATOR_NAME.
  - Live /dead-pixel-test/ text contains no "Updated" and no "Nelera".
  - Guides do show both.
- **Fix:** add "Updated {updatedAt} · By Nelera" under the tagline (page.tsx:105).

### N5. INFO: An unused second author shape in `articleJsonLd`
- **Evidence:** the `authorName` branch at seo.ts:235-236 emits an author with url = site root and no @id. Nothing passes `authorName` (grep finds no callers), so it is latent.
- **Fix:** reuse `operatorJsonLd()` or remove the branch.

## Top 5 changes by impact and effort
1. Tool-page "What does the X check?" passage (#1): about 1 day of copy plus a 10-line template change.
2. Sources for the 31 uncited guides, starting with PWM, gamma, RGB range and response time (N2/#2): 1–2 days.
3. Semantic `<table>` for the verdict grid (N1): 30 minutes.
4. Entity linking with sameAs to nelera.net, Organization description, and a link from About (N3): 30 minutes, needs owner confirmation.
5. Off-site seeding on YouTube, Reddit and directories (#5): ongoing.

## Structured findings (audit-data.json, category "AI Search Readiness")
```json
{"category":"AI Search Readiness","score":63,"previous_score":58,
 "dimensions":{"citability":68,"structural_readability":74,"multimodal":35,"authority_brand":38,"technical_access":90},
 "platforms":{"google_aio":63,"chatgpt":53,"perplexity":57,"bing_copilot":61},
 "findings":[
 {"id":"geo-tool-passages","severity":"high","status":"open-improved","evidence":"no ToolDef.about; [tool]/page.tsx:104-135 unchanged; FAQs now 2-3/tool, answer median 36 words","fix":"add ToolDef.about, render after ToolRunner ([tool]/page.tsx:108)"},
 {"id":"geo-no-sources","severity":"high","status":"partial","evidence":"38 ext links in 13/44 guides; 31 guides 0 (e.g. what-is-pwm-flicker guides.ts:1512)","fix":"link primary sources in remaining guides"},
 {"id":"geo-promise-mismatch","severity":"medium","status":"fixed","evidence":"warranty excerpt reworded; body cites ISO + Dell"},
 {"id":"geo-entity","severity":"medium","status":"partial","evidence":"Nelera named (byline, About, Article author, parentOrganization); no sameAs/description seo.ts:176-202","fix":"see geo-entity-link"},
 {"id":"geo-offsite","severity":"medium","status":"open","evidence":"carried over: Wikipedia 0, YouTube 0, HN 0","fix":"YouTube demos, Reddit, directories"},
 {"id":"geo-home-contradictions","severity":"low","status":"fixed","evidence":"HomeSections.tsx rewritten; :77-80 consistent with guides"},
 {"id":"geo-multimodal","severity":"low","status":"open","evidence":"blog/[slug]/page.tsx:117 alt 'illustrated diagram' on title card","fix":"accurate alt, tool preview image, real diagrams"},
 {"id":"geo-hook-intros","severity":"low","status":"open","evidence":"guides.ts:78, :1004","fix":"answer-first opening"},
 {"id":"geo-verdict-table-extraction","severity":"medium","status":"new","evidence":"HomeSections.tsx:275-298 div grid; 11 rows in raw HTML, absent from trafilatura extracted_text","fix":"semantic <table> with caption/th scope"},
 {"id":"geo-sourcing-claim","severity":"medium","status":"new","evidence":"HomeSections.tsx:375-377, about/page.tsx:52-54 claim guides link sources; 31/44 have none","fix":"add sources or soften copy"},
 {"id":"geo-entity-link","severity":"low","status":"new","evidence":"operator url=/about/ seo.ts:181, no sameAs; nelera.net links to site but not reciprocated; 'independent developer' vs Organization","fix":"sameAs nelera.net, Organization description, About link"},
 {"id":"geo-tool-page-date","severity":"low","status":"new","evidence":"[tool]/page.tsx renders no updatedAt/byline","fix":"render Updated + By under tagline (page.tsx:105)"},
 {"id":"geo-author-branch","severity":"info","status":"new","evidence":"seo.ts:235-236 unused divergent author shape","fix":"reuse operatorJsonLd()"},
 {"id":"geo-llmstxt","severity":"info","status":"unchanged","evidence":"/llms.txt 404","fix":"optional; Google ignores it"}
]}
```
