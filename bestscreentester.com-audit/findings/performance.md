# Performance audit - bestscreentester.com (2026-10-01)

Method: PSI API (keyless) rate-limited -> no PSI/CrUX field data. LAB ONLY: `npm run build`, `npx serve out`, Lighthouse 13.5.0 (simulated throttling) against localhost. Real third-party scripts (AdSense, GA4) were loaded from the network. localhost has no real CDN/TTFB, so true TTFB/LCP on GitHub Pages is not measured. No field data = CWV pass/fail unconfirmed.

## Scores (lab)
| Page | Mobile perf | FCP | LCP | TBT | CLS | Desktop perf (LCP) |
|---|---|---|---|---|---|---|
| / | 93-95 (3 runs) | 0.9s | 2.9-3.2s | 40-90ms | 0 | 100 (0.7s) |
| /dead-pixel-test/ | 93 (3 runs; 1 outlier 73) | 0.8s | 3.2s | 50-60ms | 0 | 100 (0.6s) |
| /refresh-rate-test/ | 99 | 0.8s | 2.1s | 70ms | 0.001 | - |
| /screensaver/ | 93-94 (1 outlier 65: one 897ms task, not reproducible in 2 reruns) | 0.8s | 3.1s | 50-80ms | 0 | - |
| /blog/how-to-test-a-tv-for-defects/ | 74 (1 run, FCP outlier 3.0s) | 3.0s | 5.6s | 60ms | 0 | - |
Performance score: ~90. Run-to-run variance is high on mobile sim; blog page measured once (needs re-run).
LCP elements are text (h1 on /, `<p>` on tool pages): no hero image. LCP subparts: TTFB ~4ms, render delay 70-330ms locally. Observed (unthrottled) LCP 63ms vs simulated 3.1s: the simulated mobile LCP is inflated by CSS + font + JS graph, not by an image.
INP: not measurable in lab (no field data); TBT 40-90ms and longest steady tasks 60-100ms (react-dom chunk, gtag, adsbygoogle) suggest low risk.

## Bundles (gzip, from out/)
Shared on every page: 3j9pm5otqxm82.js 70.7K (react-dom/framework), 0y-qmi6py9vt0.js 40.5K, 0cz1d0mv5g_q7.js 39.5K, 14mrh2 12.9K, 15orcr 10.6K, 21oinf 5.3K, 2yk75 6.4K, turbopack runtime 4.2K = ~190K gz JS + 8.2K gz CSS (1a9r_3tyqv-fv.css, render-blocking, 42.6K raw).
Tool pages add 1-1xfihbrs1im.js (30K gz) + 02cty2hcz_sid.js (7.6K gz).
Total page transfer ~1.05 MB incl. ~400K third-party.
Third parties: gtag 178K (main-thread 33ms), AdSense 225K (25ms); Lighthouse unused-JS: ~250-280 KiB, almost all AdSense/gtag.

## Findings
1. MEDIUM - ToolRunner statically imports all 16 tool components, so every tool page ships every tool's code (+~38K gz). src/components/tools/ToolRunner.tsx:3-18. Fix: next/dynamic (or lazy) per slug in the slug->component map; keep server-rendered shell. Also lets heavy code (pipes3d.ts WebGL, crackedScreen.ts) load only on its page.
2. MEDIUM - Both fonts preloaded on every page, including Geist Mono (71K) that most pages do not use above the fold; fonts are 70K+71K and compete with CSS/LCP text. Preloads in built HTML (e.g. out/dead-pixel-test/index.html head); source: geist import src/app/layout.tsx:3-4. Fix: only import/preload GeistMono where used (or drop mono for system mono). font-display: swap with size-adjusted fallback already present (good, CLS 0).
3. MEDIUM - Render-blocking CSS: 1a9r_3tyqv-fv.css (8.2K gz) is flagged, est. 80-300 ms on mobile. Fix: Tailwind v4 CSS is single file; cannot inline via Next export easily; consider trimming unused CSS in src/app/globals.css (low gain). Low effort alternative: none header-based.
4. MEDIUM - src/app/icon.png is 512x512, 188 KB, fetched on every page load as the favicon (confirmed in Lighthouse network requests: /icon.png?icon...png 188,297 B). CLAUDE.md says this was fixed, but the file is still 188 KB. Fix: downsize src/app/icon.png to 48x48/192x192 (<10 KB, pngquant/sharp); apple-icon.png (20K) is fine.
5. LOW - Guide hero image (public/og/guides/*.png, 1200x630, ~47-62 KB PNG) displayed at ~574x301 (Lighthouse image-delivery: 36 KiB wasted). src/app/blog/[slug]/page.tsx:115-122 (priority set; width/height set, no CLS). Fix: it doubles as OG image so keep PNG for OG but serve a smaller WebP/AVIF copy for on-page use (images.unoptimized means no automatic resize), or accept. public/og totals 3.2 MB across 72 files (none >100K).
6. LOW - Homepage loads ~14 tool preview PNGs (~95 KB total; brightness-uniformity-test.png 26.7 KB is largest) that are invisible until hover: src/components/ToolCard.tsx:23-29 (next/image, lazy by default, opacity-0 until hover). Wasted bytes on first view. Fix: render the preview only on hover/focus (CSS background-image via group-hover, or JS on pointerenter), or convert to WebP/AVIF/shrink brightness-uniformity-test.png. All previews 160K total, 640x400 colormap PNGs.
7. LOW - Third-party: gtag + AdSense both afterInteractive (src/components/Analytics.tsx:17-26, src/app/layout.tsx:56-61). ~400 KB transfer; main-thread cost modest (33+25 ms script eval, 60-70ms tasks). Fix: consider strategy="lazyOnload" for AdSense (revenue/viewability trade-off - owner decision). Preloads for both appear in head. No ad slots found in src (grep: no adsbygoogle <ins> elements besides the script), so no ad CLS currently; if Auto ads are enabled in AdSense console they can inject shifts - reserve space / monitor CLS in field.
8. LOW - Legacy JS: 13 KiB polyfills (Array.prototype.at/flat etc.) in 3j9pm5otqxm82.js (Lighthouse legacy-javascript). Fix: set browserslist to modern targets in package.json.
9. INFO - Logo: header/footer use 64x64 logo-mark.png (3.4K) with width/height (src/components/layout/Header.tsx:9-15) - good. public/bestscreentester_logo.png (1.6 MB) is NOT referenced by any page (grep src) - not loaded; only deploy weight. dvd_logo.png (11K) loaded only by the screensaver on demand.
10. INFO - Caching (requires hosting change): GitHub Pages serves max-age=600; cannot set long immutable cache on /_next/static or images without a CDN (e.g. Cloudflare in front).

## Images score
~85/100: all page images have width/height and alt, hero/guide image dimensioned with priority, logo is tiny, previews small and lazy. Deductions: 188 KB favicon, PNG-only (no WebP/AVIF), oversized guide hero, hover-only previews loaded eagerly in viewport.

## Priorities
1) Shrink src/app/icon.png (188K -> <10K). 2) Lazy-load tool components in ToolRunner. 3) Drop Geist Mono preload on non-mono pages. 4) Hover-only preview loading. 5) Re-measure with PSI/CrUX once an API key exists to confirm field LCP/INP/CLS.
