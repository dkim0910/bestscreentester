# Agentic readiness: bestscreentester.com (2026-10-01)

Lighthouse Agentic Browsing: unavailable. PSI returned HTTP 429 (daily quota, no API key) for mobile and desktop. Not scored as X/N.
Agent-UX heuristic (separate from Lighthouse): 100/100, complete, on /, /dead-pixel-test/, /refresh-rate-test/. 0 unnamed interactive nodes, 0 div-onclick widgets, landmarks present.
Tool controls labeled: FullscreenStage.tsx:259 (Start, "label - tool name"), :271/:282 (Previous/Next pattern), :307/:313 overlay Previous/Next (aria-label), :320 button.

Agentic check: server-rendered pass (2056 words without JS); robots reachable; 404s real; unknown URL not catch-all.

## Access policy
- Training: no named groups, falls to `*` Allow / (allowed). No Content-Signal.
- Search: allowed (`*`). Only Disallow /*__next and /*index.txt$ (src/app/robots.ts:14).
- User-triggered: not blocked. Claude-User honours robots; ChatGPT-User may not apply; Perplexity-User/Google-Agent generally ignore (vendor docs).

## Findings
- P1 (info): No Content-Signal line. Fix: add `Content-Signal: search=yes, ai-input=yes, ai-train=<choice>` to the group; Next MetadataRoute.Robots cannot emit it, so use a static public/robots.txt in place of robots.ts (then drop robots.ts, keep the same Disallows). Draft/preference only; Google does not act on it (checked 2026-09-23).
- P1 (opportunity): no /llms.txt (404). Adds a counted Lighthouse pass if valid (H1, > summary, Markdown links). Fix: public/llms.txt listing 28 tools and key guides. Static, no hosting change.
- P2 (opportunity): no Markdown delivery (no Accept negotiation, no .md siblings, no rel=alternate). Accept negotiation requires hosting change; .md files could be generated statically. No consumer agent confirmed to request it.
- P2 (opportunity): no WebMCP (0 registerTool, 0 forms). Draft W3C CG, not a standard. Could expose tools as launch actions; low priority.
- P3: no ai-catalog.json, api-catalog, OAuth, agent-card (404). N/A: no APIs/services. Drafts (checked 2026-09-23).
- Note: fullscreen tests (Fullscreen API/Wake Lock) cannot be meaningfully run by headless agents; the pages do expose full descriptions, how-to and FAQ in static HTML.

## Structured findings (AI Search Readiness)
[{"title":"No Content-Signal in robots.txt","severity":"Low","description":"No AI usage preference declared; robots.txt has only a * group.","recommendation":"Switch to static public/robots.txt with Content-Signal line (draft, preference only)."},
{"title":"No llms.txt","severity":"Low","description":"/llms.txt returns 404.","recommendation":"Add public/llms.txt with H1, summary and links to tools/guides."},
{"title":"No Markdown/WebMCP/ai-catalog","severity":"Info","description":"Optional drafts absent; opportunity not defect.","recommendation":"Optional static .md siblings; WebMCP low value."}]
