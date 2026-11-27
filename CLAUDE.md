<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BestScreenTester

A suite of **30** free, browser-based screen tests and tools plus **44** guides. **Fully static — no
database, no accounts, no backend services.** The display tests run 100% client-side (Fullscreen
API, Wake Lock, Canvas). The full, authoritative tool list lives in `src/lib/tools.ts` — the
`category` field there is what actually drives the nav/homepage grouping, so trust it over any
summary (including this one):

- **`panel`** (12) — dead-pixel-test, backlight-bleed-test, brightness-uniformity-test,
  blooming-test, burn-in-test, contrast-test, black-level-test, viewing-angle-test,
  touch-screen-test, overscan-test, sharpness-test, pwm-flicker-test
- **`color`** (8) — color-test, black-screen, white-screen, greyscale-test, color-gradient-test,
  gamma-test, wide-color-gamut-test, hdr-test
- **`motion`** (4) — refresh-rate-test, ghosting-test, screen-tearing-test, frame-skipping-test
- **`fun`** (6) — fake-broken-screen, screensaver, boot-screen-simulator, screen-info,
  screen-size-calculator, screen-test-checklist

Note the non-obvious ones: `blooming-test`, `contrast-test`, `black-level-test`, and
`viewing-angle-test` are **panel**, not motion/color; `black-screen` and `white-screen` are
**color**, not panel; `touch-screen-test` and `pwm-flicker-test` are **panel**; `screen-info`,
`screen-size-calculator` and `screen-test-checklist` are **fun** ("Fun & Utilities").

**Novelty pages are noindexed.** `fake-broken-screen`, `boot-screen-simulator`, `screensaver`
(`noindex: true` in `tools.ts`) and the `harmless-screen-pranks` guide (`noindex: true` in
`guides.ts`) get a `noindex, follow` robots meta via `pageMetadata({ noindex })` and are left out of
the sitemap. The three tools are also left out of the homepage grid and appear only on the English
`/tools` under "Just for fun"; the guide is still listed on `/blog` (the hub does not filter
`noindex`) but is skipped by the guide pages' "Related guides". Use
`INDEXED_TOOLS` (27) for public counts and listings, `TOOLS` (30) for routing. This was done for
the AdSense "low value content" review. Two more guides (`what-causes-dead-pixels`,
`how-to-clean-your-monitor-safely`) carry `noindex` for low search impressions and behave the same.

**Merged guides forward to their keeper.** A guide with `mergedInto` (always with `noindex`) keeps
its URL but renders only a meta-refresh and a link to the target, with the target as canonical —
GitHub Pages can't send a 301. `what-is-ips-glow` and `backlight-bleed-vs-ips-glow` were folded
into `what-is-backlight-bleed` this way; link to the keeper, never to a merged slug.

**No ad script on noindexed pages or translated pages:** `AdSenseScript` (client) skips the paths
the layout passes in, and `SiteShell` renders it only for English until the machine translations
have been reviewed.
The `google-adsense-account` meta tag still ships everywhere.

**Tool pages carry a per-test "reading your results" section** from `src/lib/toolResults.ts`
(`TOOL_RESULTS`, keyed by slug): normal vs fault, thresholds, panel/device notes, test-specific
headings, and one deep guide. `NEXT_STEPS` in the same file adds an ordered "Found a problem? What
to do next" list to the tests where a result leads to a decision, and `TABLES` adds reference tables
(panel comparisons, cable needs, lookup values). Where a guide carries the same table, the rows
are that guide's rows: change both together. The Dead Pixel Test page also renders
`PixelVerdict`, a small form that turns what the visitor found into advice; it gives no
pass/fail number on purpose. A tool with `guide` set shows that single link and drops the generic
"Related guides" grid. Its thresholds must match the guide it links. All 27 indexed tools have a results section; 23 of them set `guide`. No own photos exist anywhere on the site yet.

**Seven languages.** English lives at the root; Spanish, German, French, Portuguese (Brazil),
Japanese and Korean live under `/es/`, `/de/`, `/fr/`, `/pt/`, `/ja/`, `/ko/` with the same slugs
(`/es/dead-pixel-test/`). Only the homepage, `/tools` and the 27 indexed tests are translated:
guides, legal pages and the novelty pages are English-only, and a translated page links to the
English URL for those, tagged "(in English)". See "Translations" under Architecture.

**Homepage order:** hero (with the live `ScreenReadout`), `QuickColors`, `HomeAnswers` (the four
"defect or normal?" questions as cards), the tool grid, `HomeAnswersInFull` (the same four written
out), then `HomeSections`. `/blog` is grouped by problem via `GUIDE_TOPICS` in `guides.ts`; a new guide
must be added to a topic or it lands in "More guides".

## Stack

- **Next.js 16** App Router with **`output: "export"`** (`next.config.ts`) → a fully static site
  emitted to `out/`. `trailingSlash: true`, `images.unoptimized: true`.
- **Tailwind CSS v4** — dark theme; CSS variables in `src/app/globals.css`.
- **next-mdx-remote** — renders guide MDX bodies (compiled at build time).
- **geist** package — self-hosted fonts (not `next/font/google`).
- No database, ORM, auth, or server routes. Everything is static HTML/JS/CSS.
- **Hosted on GitHub Pages** with custom domain `bestscreentester.com`
  (`public/CNAME`), deployed by `.github/workflows/ci.yml`.

## Commands

```bash
npm run dev     # dev server :3000
npm run build   # static export -> ./out (typechecks, but does NOT run ESLint in Next 16)
npm run lint    # ESLint — run this too; CI does
npm run i18n:check   # translations vs the English source (not in CI; needs Node 22.18+)
npx serve out   # preview the built export
```

No services to start — there is no DB. Copy `.env.example` to `.env` (site URL, contact email, and
optional GA / Search Console IDs). Note: `next build` no longer runs ESLint, so a green build can
still have lint errors — always run `npm run lint` before pushing (CI runs both separately).

⚠️ **`npm start` (`next start`) does not work here** — Next throws `"next start" does not work with
"output: export" configuration` and tells you to use `npx serve@latest out`. The `start` script in
`package.json` is a leftover; ignore it.

## Architecture

- **Tool registry — `src/lib/tools.ts` is the single source of truth** for tools (slug, copy,
  how-to, FAQ, category). It drives nav, homepage, per-tool pages, sitemap, and JSON-LD. Add or
  change a tool here first, then wire its UI in `ToolRunner`. Extra FAQ entries per tool live in
  `TOOL_FAQ_MORE` (same file) and are appended to each tool's `faq`. Each tool's `updatedAt` is its
  sitemap lastmod: set it to today whenever that tool's copy, tips or test component changes
  (not for shared template edits). The homepage and static pages use `PAGE_UPDATED` in
  `seo.ts`; /tools and /blog use `SITE_UPDATED`.
- **Tool engine — `src/components/tools/`:**
  - `FullscreenStage` is the shared controller (fullscreen + wake lock + ←/→ + tap zones +
    auto-hiding overlay). It exposes an imperative `start(index?)` via ref and a `hideLauncher`
    prop so external controls (e.g. homepage `QuickColors` swatches) can launch it. The inline
    launcher has a ←/→ frame picker and Start launches the picked frame. Tap zones: sides switch
    frames, centre toggles the overlay — **no tap exits** unless the tool sets `tapToExit` (the
    pranks: `FakeScreenTool`, `BootScreenTool`), so keep "tap to exit" copy to those. The wake lock
    is an effect on `active && keepAwake`, so `keepAwake` may change mid-session (screensaver
    toggle). `renderFrame(index, active)` gets `active` so a frame can tell preview from full-screen.
    The low-level fullscreen + Wake Lock calls (with vendor-prefix/iOS fallbacks) live in
    `src/lib/fullscreen.ts`. An iPhone has no Fullscreen API, so there the active stage is just a
    `fixed inset-0` layer: never size it with `h-screen` (100vh is taller than the visible area
    while Safari's toolbar shows, which hides the controls and Exit). The launcher hint has a
    keyboard and a touch wording, swapped in CSS with `pointer-coarse:` because it is in the
    static HTML; change both together.
  - `ColorCycler`, `PatternCanvas`, `CanvasStage` build on the stage. `patterns.ts` holds canvas
    draw helpers (greyscale, color gradient, gray field, burn-in, contrast, black level, viewing
    angle, gamma, overscan, sharpness). Bespoke tools have their own components: `DeadPixelTool`
    (solid colors + the stuck-pixel fixer frame), `RefreshRateTool`, `GhostingTool`, `BloomingTool`
    (dot + zone sweeps), `ScreenTearingTool`, `FakeScreenTool`, `BootScreenTool`, `ScreensaverTool`,
    `TouchTool` (uses `tapNavigation={false}` — press-and-hold shows the controls), `ScreenInfoTool`
    (no stage, an info panel), `ScreenCalcTool` (no stage, the size/PPI calculator), `ChecklistTool`
    (no stage; per-device test lists with ticks kept in `localStorage` under `bst_checklist`; the
    page passes it the localized test names through `ToolRunner`'s `tools` prop), `FrameSkipTool`, `WideGamutTool`, `PwmTool`, `HdrTool`. The measured
    refresh rate is the shared `useRefreshRate` hook. The HDR test image
    (`public/hdr/pq-brightness-steps.avif`, BT.2020/PQ) comes from
    `scripts/generate-hdr-test-image.mjs` (needs ffmpeg + libsvtav1); it patches the AVIF `colr`
    box because ffmpeg's muxer leaves primaries/transfer "unspecified". The prank's
    "Cracked" effect lives in `crackedScreen.ts`: it grows a crack network (cracks stop at the
    first crack they hit), flood-fills the shards, then shifts/re-lights each shard's pixels over
    a plain light display colour (`DISPLAY_COLOR`). Seeded; the display and glass layers are
    cached per canvas size (~100–250 ms to build), then each frame only blits them and applies
    the flicker (stuttering backlight bursts, scanline bands near the damage, blinking stuck
    columns) to the display layer. Photosensitivity limits (WCAG 2.3.1) it must keep: whole-screen
    brightness under a 10% *luminance* swing (≈4% of pixel value — values are gamma-encoded);
    strong changes only in thin bands/lines, total band height capped at 48 CSS px.
    The screensaver's Pipes effect is WebGL (`pipes3d.ts`, `PipesRenderer`), modelled on the
    Windows 95–XP "3D Pipes": frontal perspective lattice, lit tubes, ball/elbow joints (the
    original's Mixed/Elbow/Ball setting), a rare Utah teapot joint, and a block dissolve when
    the lattice is 40% full. Plain TS with `step(dt)`/`render()` so it can be driven
    frame-by-frame for testing; `ScreensaverTool`'s `PipesView` falls back to the old 2D
    `usePipes` drawer when WebGL is unavailable.
    `ToolRunner` maps each slug → its component (with a solid-color cycler fallback).
  - Gamma stripes must sit on physical pixels: `gamma()` draws in backing-store pixels and runs
    with `nativeResolution` (uncapped DPR). So do `overscan` and `sharpness`. Other canvases cap
    DPR at 2.
  - **Model selectable options (colors, speeds, patterns) as stage "frames"** (`frameCount` +
    `frameLabel`), so ←/→ keys, tap zones, and the overlay arrows all navigate them for free. A
    tool with `frameCount={1}` has dead arrows — that was the ghosting-speed bug.
- **Routes are thin; pages live in `src/components/pages/`** (`HomePage`, `ToolsPage`, `ToolPage`),
  each taking a `lang`. `src/app/(en)/` holds the English routes and `src/app/(intl)/<lang>/` one
  folder per other language (`layout.tsx`, `page.tsx`, `tools/page.tsx`, `[tool]/page.tsx`, each a
  few lines). **There is one root layout per language** (all render `SiteShell`) because
  `<html lang>` must be right in the static HTML and a single root layout can't see the language.
  Consequences: there is no `src/app/layout.tsx`; the 404 is `src/app/global-not-found.tsx`
  (`experimental.globalNotFound`); and moving between languages is a full page load, so those
  links are plain `<a>`. The language folders are static names, not a `[lang]` segment, because a
  second dynamic segment at the root would collide with `[tool]`.
- **Per-tool page — `toolRoute(lang)` in `ToolPage.tsx`** with `dynamicParams = false`:
  English generates all 30 `TOOLS`, the other languages the 27 `INDEXED_TOOLS`.
- **Translations — `src/i18n/`.** English is the source: `tools.ts`, `toolResults.ts`,
  `en/site.json` (nav, footer, page templates, all homepage copy) and `en/client.json` (strings
  inside the interactive tests). Each language has seven JSON files of the same shape:
  `site.json`, `client.json`, `tools-1..3.json` (name, title, tagline, description, keywords,
  howTo, faq, tips per slug) and `results-1..2.json`. `src/i18n/index.ts` merges them over the
  English registry (`getSite`, `getTools`, `localizeTool`, `getResultsFor`, `getTipsFor`, `href`);
  anything missing falls back to English.
  - **After editing English text, run `npm run i18n:check`.** It reports every translation that is
    now missing, has the wrong number of list items or lost a `{placeholder}`. It is not in CI: an
    untranslated addition falls back to English rather than breaking the build.
    `node scripts/i18n-source.mjs <dir>` writes the English text in the translators' file shape.
  - **Client strings are keyed by their English text:** `const t = useT()` then `t("Exit")`
    (`src/i18n/ui.tsx`). English needs no dictionary. A new string must be added to
    `en/client.json` and every language's `client.json`. Canvas draw helpers get the same function
    as `tr` in `DrawArgs`. Links inside client components use `useLocalHref()`.
  - Server components build links with `href(lang, path)`, which returns the English path for
    pages that aren't translated. `ToolCard` takes an already-localized tool plus `lang`.
  - `HomeSections.tsx` keeps only ids, links and tones; its arrays pair **by position** with the
    `items` arrays under `home` in `site.json`.
  - hreflang: `pageMetadata({ lang })` emits `alternates.languages` (every language plus
    `x-default`) for translated paths, and `sitemap.ts` lists each language URL with the same
    alternates. Translated pages' lastmod is never older than `I18N_UPDATED` (`i18n/config.ts`).
  - The translations are machine-made and have not been reviewed by native speakers.
  - Adding a language: add it to `LOCALES` (+ the name/locale maps) in `i18n/config.ts`, to
    `HTML_LANG` in `SiteShell.tsx` and to `BUNDLES` in `i18n/index.ts`, copy a folder under
    `src/app/(intl)/`, and add the seven JSON files.
- **Guides/blog — `src/lib/guides.ts` (the `GUIDES` array) is the single source of truth.** Bodies
  are MDX and link to the tools they discuss (e.g. `[Dead Pixel Test](/dead-pixel-test)`).
  - `getGuidesForTool(slug)` powers the "Related guides" section on each tool page by matching the
    markdown link form `(/slug)` in guide bodies — accurate and self-maintaining. It shows the top
    4 ranked by topic overlap with the tool's name + `keywords` (guide tags count double over
    title/slug words), so a tool's `keywords` also steer which guides it surfaces.
  - Blog routes (`/blog`, `/blog/[slug]`) read from `GUIDES` and are fully static.
- **SEO is the product's growth engine.** Tool pages and guides must stay static. Helpers in
  `src/lib/seo.ts` (`pageMetadata`, `faqJsonLd`, `howToJsonLd`, `articleJsonLd`), plus
  `sitemap.ts` / `robots.ts` (both `export const dynamic = "force-static"`). OG images are static
  files — no runtime image generation under static export: one per tool and per guide in
  `public/og/{tools,guides}/<slug>.png`, with `public/og.png` as the fallback for every other page.
  `scripts/generate-og-images.mjs` (uses `sharp`) writes them and the `public/previews/<slug>.png`
  thumbnails `ToolCard` shows; re-run it after adding a tool or guide, and bump the tool/guide
  counts it asserts near the top or it throws.
- **Feedback** is a `mailto:` contact page (`src/app/(en)/feedback/page.tsx`), address from
  `NEXT_PUBLIC_CONTACT_EMAIL` (centralized as `CONTACT_EMAIL` in `src/lib/seo.ts`). No form/storage.
- **Static info pages:** `/about`, `/privacy`, `/terms` (`src/app/(en)/{about,privacy,terms}/page.tsx`),
  linked from the footer's "Company" column and the sitemap. Terms shows `LEGAL_UPDATED` and Privacy shows
  `PRIVACY_UPDATED` (both in `seo.ts`). `/donate` (`src/app/(en)/donate/page.tsx`) is a static support page (Ko-fi / Buy Me a
  Coffee / Patreon links) — keep the donation + advertising sections of `/privacy` and `/terms` in
  sync with whichever platforms and ad networks actually load. `/tools` lists all tools; `/blog`
  lists all guides except the merged ones.
- **Analytics:** `src/components/Analytics.tsx` loads **Google Analytics (GA4)** via `next/script`
  (`afterInteractive`) for **every visitor** — there is no cookie/consent banner. It renders only
  when a GA4 ID is present (`NEXT_PUBLIC_GA_ID`, else the hard-wired default). Because it's a client
  component, the GA scripts are intentionally absent from the static HTML and inject after hydration.
  There is **no consent gate** (the old `CookieConsent` banner + `bst_cookie_consent` localStorage
  flag were removed) — this is a deliberate call that trades GDPR/PECR consent for full traffic
  visibility; if you reintroduce a gate, wrap the scripts in `Analytics.tsx` on the stored choice.
  Keep `/privacy` in sync with whatever trackers actually load.
- **Third-party tags:** Google AdSense: the `<meta name="google-adsense-account">` tag (via
  `siteMetadata()` in `SiteShell.tsx`) and `public/ads.txt` are site-wide; the `adsbygoogle.js`
  script loads on English pages only, minus the noindexed ones (see the top of this file). The AdSense
  publisher ID (`ca-pub-7400069037778721`) and GA4 ID (`G-FC5ELM4BX8`) are hard-wired defaults in
  `SiteShell.tsx` / `Analytics.tsx` (IDs aren't secret); `NEXT_PUBLIC_GA_ID` only overrides GA if set.

## Conventions

- Interactive tool components are `"use client"`; pages stay server components.
- Keep everything static: don't introduce a database, auth, or per-request server logic. New
  content = edit `src/lib/guides.ts`; new tool = edit `src/lib/tools.ts` + `ToolRunner`.

## Gotchas

- **Fonts are self-hosted via `geist`** specifically so `next build` needs no network (CI-safe).
  Don't reintroduce `next/font/google`.
- **Static export (`output: "export"`) has hard limits:** no route handlers / API routes, no
  server-only runtime, no `next/image` optimization. Metadata routes (`sitemap.ts`, `robots.ts`)
  must set `export const dynamic = "force-static"`. Don't add anything that needs a server.
- **GitHub Pages specifics:** `public/.nojekyll` (so the `_next` folder isn't stripped),
  `public/CNAME` (custom domain), and `trailingSlash: true` (Pages serves `/path/ → /path/index.html`).
  Build env `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_CONTACT_EMAIL` are set in the workflow (the
  git-ignored local `.env` is only for dev, so local builds show localhost URLs).
- `<html>` has `suppressHydrationWarning` because browser extensions inject attributes onto it.
- **Favicons use the file convention:** `src/app/icon.png` (96², ~1.5 KB palette PNG — every page
  loads it, so keep it small; the old 512² one was 188 KB) + `src/app/apple-icon.png` (180²),
  generated from `public/bestscreentester_logo.png` with `sharp`. There is no `favicon.ico` and no
  `metadata.icons` override — don't add one pointing at the full 1.7 MB logo (that was the old bug
  that made the tab icon download the whole logo). The Organization JSON-LD logo is a separate
  `public/logo.png` (512², only crawlers fetch it): Google wants ≥112px, so don't point it back at
  the 96px favicon.
- **`react-hooks` lint rules are strict.** Two traps that only `npm run lint` catches (not `next build`):
  - *Purity:* don't call impure functions (`performance.now()`, `Date.now()`, `Math.random()`) or
    read/write a ref's `.current` during render. Do that work inside `useEffect` (see `PatternCanvas`:
    start-time ref set on mount, latest-callback ref synced in an effect).
  - *`set-state-in-effect`:* calling `setState` synchronously in an effect is flagged. For genuine
    one-shot client-only reveals (reading `localStorage`/a media query on mount, then setting state
    once) this is legitimate — use a scoped `// eslint-disable-next-line react-hooks/set-state-in-effect`
    with a justifying comment rather than reworking it.
- CI (`.github/workflows/ci.yml`): install → lint → build (static export), then on `main`
  upload `./out` and deploy to GitHub Pages (`upload-pages-artifact` + `deploy-pages`), then ping
  IndexNow (`scripts/indexnow.mjs`, never fails the deploy) with the sitemap URLs whose lastmod is
  within the last 7 days.


 ## TODO:

- (should we tunnel this aswell for the fix?) its public for now and working but make it private in github?


