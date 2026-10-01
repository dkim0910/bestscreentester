# Performance + Images re-audit - bestscreentester.com (2026-10-02, live = main b6e17c2)

Method: keyless PSI retried once, rate-limited again (no lighthouse_version, no CrUX) -> NO FIELD DATA; CWV pass/fail unconfirmed. LAB ONLY: `NEXT_PUBLIC_SITE_URL=https://bestscreentester.com npm run build`, `npx serve out`, Lighthouse 13.5.0 (simulated mobile throttling; desktop preset), 3 runs per page, same method as the 2026-10-01 audit. Working tree (dev 9c86a61) differs from main b6e17c2 only by public/CNAME, so the build is equivalent. localhost = no real GitHub Pages TTFB/CDN. Real AdSense/GA4 loaded.

## Scores (lab)
Performance ~93 (was ~90, +3). Images ~92 (was ~85, +7).

| Page | Mobile perf (3 runs) | FCP | LCP | TBT | CLS | Desktop perf / LCP |
|---|---|---|---|---|---|---|
| / | 95, 89, 97 | 0.9s | 2.4-3.4s | 70-190ms | 0 | 100 / 0.6-0.7s |
| /dead-pixel-test/ | 95, 92, 93 | 0.8s | 2.9-3.3s | 70-100ms | 0 | 100 / 0.5-0.7s |
| /refresh-rate-test/ | 94, 93, 98 | 0.8s | 2.4-3.1s | 60-70ms | 0.003 | - |
| /blog/how-to-test-a-tv-for-defects/ | 91, 97, 97 | 0.8s | 2.4-3.3s | 70-140ms | 0 | - |

- The earlier TV-guide 74 was an outlier (FCP 3.0s): re-measured 91-97, no real issue.
- Mobile LCP straddles the 2.5s "good" line in simulation (2.4-3.4s). LCP element is text, not an image. INP: not measurable in lab; TBT 60-190ms, low risk. Verify with CrUX/PSI once an API key exists.
- Transfer: home 949K (mobile), tool pages ~870-900K, of which ~400K third-party.

## Previous findings status
1. ToolRunner static imports of all tools: NOT FIXED (src/components/tools/ToolRunner.tsx:3-18).
2. Geist Mono preloaded on every page: NOT FIXED (src/app/layout.tsx:3-4; both fonts preloaded in out/dead-pixel-test/index.html).
3. Render-blocking CSS (8.2K gz): unchanged, low value.
4. Favicon 188 KB: FIXED. src/app/icon.png is 1,499 B. Org logo moved to public/logo.png (32 KB, JSON-LD only, not loaded by pages).
5. Guide hero 1200x630 PNG shown ~574px wide: NOT FIXED (src/app/blog/[slug]/page.tsx:115-122, priority + dimensions set, no CLS).
6. Hover-only previews: NOT FIXED. src/components/ToolCard.tsx:23-29 still renders next/image (lazy) under opacity-0; public/previews 160K total. Homepage has 30 `<img>`.
7. AdSense/gtag afterInteractive: unchanged (src/app/layout.tsx:61, src/components/Analytics.tsx:19,21). Owner decision.
8. Legacy polyfills (~13 KiB): NOT FIXED, no browserslist in package.json.
9. public/bestscreentester_logo.png (1.7 MB) still in public/ (unreferenced by pages; deploy weight only).
10. max-age=600 on GitHub Pages: unchanged (hosting limit).

## New findings
- None of substance. Homepage restructure (swatches in hero, rewritten sections) did not regress: CLS 0, LCP/TBT in line with before. INFO: /refresh-rate-test/ CLS 0.003 (negligible, consistent in 3 runs).
- INFO: homepage mobile TBT variance (70-190ms) is third-party script eval; one 89-score run is noise.

## Priorities
1) Dynamic-import tool components in ToolRunner (-~38K gz per tool page). 2) Drop Geist Mono preload where unused. 3) Smaller WebP/AVIF copy of guide hero. 4) Hover-only preview loading. 5) Modern browserslist. 6) Get an API key to confirm field LCP/INP/CLS.
