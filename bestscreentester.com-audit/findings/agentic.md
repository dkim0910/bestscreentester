# Agentic readiness: bestscreentester.com (re-audit 2026-10-02, main b6e17c2)

Lighthouse Agentic Browsing: unavailable. PSI HTTP 429 (daily quota, no API key) for mobile and desktop. Not scored as X/N.
Agent-UX heuristic (separate from Lighthouse): 100/100, complete, unchanged. Pages: / (1243 nodes, 101 interactive, 9 buttons, 92 links, 0 unnamed, 0 div-onclick), /dead-pixel-test/ (358 nodes, 0 unnamed), /blog/new-device-screen-test-checklist/ (440 nodes, 0 unnamed).

## New homepage checks
- Hero color swatches are real `<button type="button">` with aria-label "Show <Color> full screen" (9 of them, Black..Gray 50%). Named, keyboard focusable (focus ring).
- Landmarks in static HTML: header, nav, main, footer. Heading order: one h1, then h2/h3 with no skipped levels (footer h3 after h2 is fine).
- Symptom picker items are plain anchors (92 links, all named).
- Server-rendered: 1948 words without JS (previous run 2056 on the old homepage; expected from the rewrite). No JS shell marker.
- Caveat: swatch buttons need JS and the Fullscreen API; a headless agent can click them but cannot meaningfully run the test. Descriptions remain in static HTML.

## Unchanged since the earlier audit
git log for src/app/robots.ts and public/llms.txt shows no commits since f769207; live robots (1 group, `*`) and 404 for /llms.txt confirm it. 404 probe still real 404.

## Access policy
- Training: no named groups, falls to `*` (allowed). No Content-Signal.
- Search: allowed. Only Disallow /*__next and /*index.txt$ (src/app/robots.ts:14).
- User-triggered: not blocked. Claude-User honours robots; ChatGPT-User may not apply; Perplexity-User and Google-Agent generally ignore (vendor docs, checked 2026-09-23).

## Findings (no new defects)
- P1 (opportunity): no Content-Signal. Draft/preference only; Google does not act on it (2026-09-23). Needs static public/robots.txt since MetadataRoute.Robots cannot emit it.
- P1 (opportunity): /llms.txt 404. A valid file (H1, > summary, Markdown links) adds a counted Lighthouse audit.
- P2 (opportunity): no Markdown delivery (no Accept negotiation, /index.md 404, no rel=alternate).
- P2 (opportunity): no WebMCP (0 registerTool, 0 forms). W3C CG draft, not a standard (2026-09-23).
- P3: ai-catalog.json, api-catalog, OAuth, agent-card absent; N/A for a static site (drafts, 2026-09-23).

## Structured findings (AI Search Readiness)
[{"title":"No Content-Signal in robots.txt","severity":"Low","description":"No AI usage preference declared; robots.txt has only a * group.","recommendation":"Switch to static public/robots.txt with Content-Signal line (draft, preference only)."},
{"title":"No llms.txt","severity":"Low","description":"/llms.txt returns 404.","recommendation":"Add public/llms.txt with H1, summary and links to tools/guides."},
{"title":"No Markdown/WebMCP/ai-catalog","severity":"Info","description":"Optional drafts absent; opportunity not defect.","recommendation":"Optional static .md siblings; WebMCP low value."}]
