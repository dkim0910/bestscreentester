# GEO / AI Search Readiness: bestscreentester.com

Audit date: 2026-10-01. Method: live fetches (render_page.py, curl with AI-bot UAs), source read of src/lib/{seo,tools,guides}.ts, src/app/**, src/components/HomeSections.tsx; passage metrics computed from the GUIDES/TOOLS arrays.

## AI Search Readiness score: 58 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 62 | 15.5 |
| Structural readability | 20% | 72 | 14.4 |
| Multi-modal content | 15% | 35 | 5.3 |
| Authority & brand signals | 20% | 25 | 5.0 |
| Technical accessibility | 20% | 90 | 18.0 |

Platform estimates (judgment, not measured): Google AI Overviews 60 · ChatGPT 50 · Perplexity 52 · Bing Copilot 58.

## What works
- **Static SSR HTML.** `is_spa: false` on the home page, tool pages and guides. All copy, FAQ `<details>` bodies and guide MDX are in the raw HTML.
- **All crawlers can get in, and robots.txt matches the source.** robots.txt (src/app/robots.ts:8-20) is `User-Agent: *`, `Allow: /`, plus two narrow disallows. `/_next/` and ads.txt are not blocked.
  - Live fetch of /blog/what-is-pwm-flicker/ returned HTTP 200 with the same 44,452 bytes for each of these user agents: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, bingbot, Googlebot, CCBot and Applebot.
  - There is no X-Robots-Tag header and no nosnippet or max-snippet limit.
- **Discovery is in place.** The sitemap has 80 URLs (28 tools, 44 guides, 8 static pages). IndexNow pings run in CI (.github/workflows/ci.yml:70-83) and the key file returns 200. That helps Bing and Copilot. It may also help ChatGPT search, which draws partly on Bing (this is an inference).
- **Guides are solid.** There are 44 guides totalling 36,585 words (median 815).
  - Many "what is" guides open with a definition sentence, e.g. PWM, ghosting, backlight bleed, IPS glow, refresh rate and banding.
  - They contain concrete figures: frame times at 16.7, 8.3, 6.9 and 4.2 ms, and pixel counts.
  - 8 guides have tables. Each guide shows visible published and updated dates and has matching Article JSON-LD dates.
- **Section length.** There are 262 H2 sections with a median of 116 words. 38 sections are 134–167 words long and 147 are 100–200 words.

## AI crawler access by capability
| Bot | Governs | robots.txt | Live fetch |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search citation | allowed | 200 |
| ChatGPT-User | user-initiated fetches | allowed | 200 |
| GPTBot | OpenAI training only | allowed | 200 |
| Claude-SearchBot | Claude search citation | allowed | 200 |
| Claude-User | user-initiated fetches | allowed | 200 |
| ClaudeBot | Anthropic training only | allowed | 200 |
| PerplexityBot / Perplexity-User | Perplexity search / user fetches | allowed | 200 |
| Googlebot | Google Search incl. AI Overviews | allowed | 200 |
| Google-Extended | Gemini/Vertex training + grounding (not AIO) | allowed (robots token only) | n/a |
| bingbot | Bing / Copilot | allowed | 200 |
| Applebot / Applebot-Extended | Siri/Spotlight / Apple Intelligence training | allowed | 200 |
| CCBot, cohere-ai | training | allowed | 200 (CCBot) |

Allowing the training bots is a policy choice. Blocking them would not affect search citation, so no change is required.

## llms.txt / RSL
- /llms.txt, /llms-full.txt, /license.xml and /ai.txt all return a real 404.
- llms.txt is optional, and Google Search ignores it. No platform has confirmed that it increases citations.

## Brand mentions off-site (only what was actually found)
- **Wikipedia:** the API search for "bestscreentester" returns 0 hits, and exturlusage for bestscreentester.com returns 0.
- **YouTube:** searching "bestscreentester" returns no results.
- **Hacker News (Algolia):** 0 hits.
- **GitHub:** the only hit is the source repo dkim0910/bestscreentester (public, 0 stars).
- **Could not check:** Reddit (WebFetch is refused and curl gets a 302 to a wall), DuckDuckGo (captcha), Brave (429), Bing (bot-throttled, returned unrelated results). WebSearch was not available to this agent. LinkedIn was not checked.
- **Conclusion:** no independent third-party mention was found anywhere I could check.

## Findings (prioritized)

### 1. HIGH: Tool pages have no self-contained explanatory passage
- **Evidence:**
  - Tool pages carry a median of 132 words of prose (range 86–263). FAQ answers have a median of 29.5 words, and black-screen, white-screen, greyscale-test and others have a single FAQ.
  - src/app/[tool]/page.tsx:100-135 renders only the tagline, the how-to list, the FAQ and tips. Nothing explains what the test reveals or how to read the result in a quotable passage.
  - These pages target the head queries ("dead pixel test", "refresh rate test").
- **Fix:**
  - Add an `about: string` field to `ToolDef` (src/lib/tools.ts:11-22). Write 130–170 words per tool whose first sentence is a definition, e.g. "A dead pixel test fills the screen with solid colors so that…".
  - Render it right after `<ToolRunner>` (src/app/[tool]/page.tsx:108) under a question H2: "What does the {name} check?".
  - Optionally add an "How to read the result" passage with concrete pass/fail criteria. Static only, no runtime cost.

### 2. HIGH: No outbound sources in any of the 44 guides
- **Evidence:**
  - 0 external links across all guide bodies.
  - Standards are named but never linked: ISO 9241-307 (4 guides), DisplayHDR 400/600, Rec. 2020, VESA Adaptive-Sync, CIE76.
  - The defect-class figures are kept vague: "A handful of fully bright or dead pixels" (src/lib/guides.ts:434-446).
- **Fix:**
  - Link primary sources inline: the ISO catalogue entry, the VESA DisplayHDR spec, manufacturer pixel-policy pages, and Rec. 2020 / sRGB references.
  - Give exact class limits only after checking them against a source you can link. Start with the warranty, HDR, color-gamut, refresh-rate and PWM guides.

### 3. MEDIUM: Two pages promise manufacturer coverage the guide doesn't contain
- **Evidence:**
  - The excerpt and meta description at src/lib/guides.ts:427 say "what each major manufacturer accepts".
  - src/lib/guides.ts:251 says the warranty guide "covers what the major brands actually promise, including the ones with a zero-bright-pixel guarantee".
  - The guide body (src/lib/guides.ts:431-477) names no brand.
- **Fix:** either add a sourced table of manufacturer pixel policies (date-stamped, linked), or reword line 427 and line 251 to match what the guide actually covers.

### 4. MEDIUM: The brand entity is thin and authorship is anonymous
- **Evidence:**
  - The Organization JSON-LD (src/lib/seo.ts:158-170) has only name, url and logo. It has no description, email or sameAs.
  - The About meta description (src/app/about/page.tsx:7) promises "who builds and maintains the tools", but the body (lines 17-58) never names a person or company.
  - Article author is the Organization (src/lib/seo.ts:203), and the byline is "By BestScreenTester" (src/app/blog/[slug]/page.tsx:125).
  - The only external profiles are under "nelera" (ko-fi, buymeacoffee and patreon, at src/app/donate/page.tsx:30, 53 and 76).
- **Fix:**
  - Add `description: SITE_TAGLINE` and `email` to the Organization object.
  - Add `sameAs` pointing to profiles the brand actually owns (GitHub repo, ko-fi/nelera, etc.). The owner should confirm the relationship to "nelera" first.
  - Add a "Who runs this site" paragraph to About that names the maintainer and the publisher entity. Optionally use a Person author with a short bio page.

### 5. MEDIUM: No off-site brand presence was found
- **Evidence:** see the brand-mentions section above.
- **Fix (off-site, no code):**
  - Post short YouTube demos per test (dead pixel, refresh rate, PWM).
  - Answer genuine Reddit threads (r/Monitors, r/OLED_Gaming, r/buildapc) where a test is relevant.
  - List the site in free-tool directories.
- These matter more for ChatGPT and Perplexity than on-page changes do.

### 6. LOW: Home page claims contradict the guides
- **Evidence:**
  - src/components/HomeSections.tsx:39 says "IPS ~1ms, VA ~4–15ms". The guides say "1ms" is a best-case marketing figure (src/lib/guides.ts:988, 1011).
  - src/components/HomeSections.tsx:246 ("≥1 bright pixel or severe bleed warrants a return") and :55 sit awkwardly beside src/lib/guides.ts:316, which says one isolated pixel often falls inside the allowance.
- **Fix:**
  - Change line 39 to "advertised 1ms is best-case; real dark transitions are slower, especially on VA".
  - Change line 246 to "inside the return window, any bright pixel is worth returning; warranty claims follow the maker's pixel policy".

### 7. LOW: Multi-modal content is thin and one alt text is inaccurate
- **Evidence:**
  - Each guide's only image is a title card, yet its alt says "— illustrated diagram" (src/app/blog/[slug]/page.tsx:117).
  - There are no in-body diagrams and no video.
  - Tool pages don't show their own pattern image. The /previews/*.png images appear only on related cards, with `alt=""`.
- **Fix:**
  - Change the alt to "{title}: cover image".
  - Show `/previews/{slug}.png` on each tool's own page with a descriptive alt.
  - Add 1–2 real diagrams to the top guides (sub-pixel fault map, PWM duty cycle).

### 8. LOW: Some guide intros are hooks rather than answers
- **Evidence:**
  - how-to-test-a-monitor-before-buying opens with "A monitor is a multi-year purchase. Five minutes of testing protects it." (src/lib/guides.ts:76+).
  - response-time-vs-input-lag opens with "These two specs get mixed up constantly." (src/lib/guides.ts:1001+).
- **Fix:** start each guide with a one-sentence answer or definition, then the hook.

### 9. INFO: llms.txt and RSL are absent
- This is optional. Google ignores llms.txt and no AI citation benefit is proven.
- If wanted, it is a zero-risk static file at public/llms.txt listing the tools and guides, and robots.txt already allows *.txt at the root.

### 10. INFO: FAQPage and HowTo JSON-LD are present
- Keep them for their search-feature uses.
- No claim is made that they increase AI citation; the visible Q&A text is what matters.

## Top 5 changes by impact and effort
1. Tool-page "What does X check?" passages (#1): about 1 day of copy for 28 tools, plus a 10-line template change.
2. Sourced outbound citations and exact figures in the top 10 guides (#2): 1–2 days.
3. Fix the manufacturer-coverage mismatch (#3): 1–4 hours.
4. Entity hardening: Organization description, email and sameAs, plus the About "who we are" section (#4): 1 hour.
5. Off-site seeding on YouTube, Reddit and directories (#5): ongoing.

## Structured findings (audit-data.json, category "AI Search Readiness")
```json
{"category":"AI Search Readiness","score":58,"findings":[
 {"id":"geo-tool-passages","severity":"high","evidence":"tool pages median 132 words prose; [tool]/page.tsx:100-135","fix":"add ToolDef.about (tools.ts:11-22), render after ToolRunner ([tool]/page.tsx:108)"},
 {"id":"geo-no-sources","severity":"high","evidence":"0 external links in 44 guides; vague ISO class figures guides.ts:434-446","fix":"link primary sources, add verified figures"},
 {"id":"geo-promise-mismatch","severity":"medium","evidence":"guides.ts:427 and :251 promise manufacturer policies; body 431-477 names none","fix":"add sourced table or reword"},
 {"id":"geo-entity","severity":"medium","evidence":"Organization seo.ts:158-170 lacks sameAs/description; about/page.tsx:7 promise unmet; author=Organization seo.ts:203","fix":"enrich Organization, name maintainer on About"},
 {"id":"geo-offsite","severity":"medium","evidence":"Wikipedia 0, YouTube 0, HN 0; Reddit unverifiable","fix":"YouTube demos, Reddit participation, directories"},
 {"id":"geo-home-contradictions","severity":"low","evidence":"HomeSections.tsx:39,:246 vs guides.ts:988,1011,316","fix":"align copy"},
 {"id":"geo-multimodal","severity":"low","evidence":"blog/[slug]/page.tsx:117 alt says diagram on a title card; tool pages lack own image","fix":"fix alt, show preview image, add diagrams"},
 {"id":"geo-hook-intros","severity":"low","evidence":"guides.ts:76+, :1001+","fix":"answer-first opening sentence"},
 {"id":"geo-llmstxt","severity":"info","evidence":"/llms.txt 404","fix":"optional public/llms.txt; Google ignores it"}
]}
```
