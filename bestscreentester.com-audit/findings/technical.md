# Technical + On-Page findings, bestscreentester.com (2026-10-01)

Scores: Technical 88/100, On-Page 93/100.

Verified live (all 80 sitemap URLs fetched, no redirects, all 200):
- robots.txt valid; sitemap.xml valid via sitemap_discovery.py; 80 URLs, all internal link targets are in the sitemap, zero 404/redirecting/slash-less/http internal links, zero orphans (min inbound 2).
- Every page: self-referencing trailing-slash canonical, `index, follow`, lang=en, viewport, 1 H1, unique title (24-62 chars) and description (116-159 chars), og/twitter tags; no duplicate titles/descriptions.
- http->https and www->apex 301; slash-less 301 to slash; missing URL returns real 404.
- IndexNow key file 737833e752494d62a8b430a7dc3abfad.txt is 200 and matches; ping in .github/workflows/ci.yml:78-83.
- Primary content is in static HTML (tool pages ~400-640 words, guides ~860-1170 words); JSON-LD present.

Findings:
1. Medium: 404 page has conflicting robots meta (`noindex` from not-found plus layout `index, follow`) and homepage default title/no canonical. Status is 404 so harmless; src/app/layout.tsx:21, src/app/not-found.tsx (add metadata export with title "Page not found").
2. Medium: http://www.../path (slash-less) goes through 2 hops (www/http -> https slash-less -> slash). Only affects external slash-less links; Pages-level behaviour, no fix in repo.
3. Medium: no security headers (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) and cache-control max-age=600 on everything. GitHub Pages cannot set headers; requires hosting change (e.g. Cloudflare proxy). HTTPS enforced; no mixed content found in the 80 pages.
4. Low: /feedback/ heading hierarchy H1 -> H3 (footer h3s, no H2 on the page). Add an H2 in src/app/feedback/page.tsx or make the footer headings non-heading elements.
5. Low: 8 pages use the generic /og.png (home, tools, blog, about, donate, feedback, privacy, terms); tool/guide pages have per-page images. Optional.
6. Low: no meta CSP is set; AdSense/GA require broad allowances so a meta CSP has limited value. Info.
7. Info: no hreflang (single-language en site; correct). GA/AdSense injected after hydration (src/app/layout.tsx:56-61, Analytics.tsx), by design. Weakest inbound links: /blog/screen-door-effect-explained/ (2), a few tools (hdr/pwm/wide-gamut: 3); fine.
8. Info: robots.txt has no AI-crawler rules; all allowed by default.
