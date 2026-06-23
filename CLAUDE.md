<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BestScreenTester

A suite of ~21 free, browser-based screen tests across four categories — **Panel & Backlight**
(dead pixel, black/white screen, backlight bleed, brightness uniformity, burn-in), **Color &
Calibration** (color, greyscale, color gradient, contrast, black level, viewing angle, gamma),
**Motion & Timing** (refresh rate, ghosting, blooming, screen tearing), and **Fun & Utilities**
(fake broken screen, boot screen simulator, screensaver) — plus a library of guides. **Fully
static — no database, no accounts, no backend services.** The display tests run 100% client-side
(Fullscreen API, Wake Lock, Canvas). The full, authoritative tool list lives in `src/lib/tools.ts`.

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
```

No services to start — there is no DB. Copy `.env.example` to `.env` (just public URL + contact
email). Note: `next build` no longer runs ESLint, so a green build can still have lint errors —
always run `npm run lint` before pushing (CI runs both separately).

## Architecture

- **Tool registry — `src/lib/tools.ts` is the single source of truth** for tools (slug, copy,
  how-to, FAQ, category). It drives nav, homepage, per-tool pages, sitemap, and JSON-LD. Add or
  change a tool here first, then wire its UI in `ToolRunner`.
- **Tool engine — `src/components/tools/`:**
  - `FullscreenStage` is the shared controller (fullscreen + wake lock + ←/→ + tap zones +
    auto-hiding overlay). It exposes an imperative `start(index?)` via ref and a `hideLauncher`
    prop so external controls (e.g. homepage `QuickColors` swatches) can launch it. The low-level
    fullscreen + Wake Lock calls (with vendor-prefix/iOS fallbacks) live in `src/lib/fullscreen.ts`.
  - `ColorCycler`, `PatternCanvas`, `CanvasStage` build on the stage. `patterns.ts` holds canvas
    draw helpers (greyscale, color gradient, gray field, burn-in, contrast, black level, viewing
    angle, gamma). Bespoke tools have their own components: `RefreshRateTool`, `GhostingTool`,
    `BloomingTool`, `ScreenTearingTool`, `FakeScreenTool`, `BootScreenTool`, `ScreensaverTool`.
    `ToolRunner` maps each slug → its component (with a solid-color cycler fallback).
  - **Model selectable options (colors, speeds, patterns) as stage "frames"** (`frameCount` +
    `frameLabel`), so ←/→ keys, tap zones, and the overlay arrows all navigate them for free. A
    tool with `frameCount={1}` has dead arrows — that was the ghosting-speed bug.
- **Per-tool page — `src/app/[tool]/page.tsx`** with `dynamicParams = false` +
  `generateStaticParams` from `TOOLS` → every tool is statically generated.
- **Guides/blog — `src/lib/guides.ts` (the `GUIDES` array) is the single source of truth.** Bodies
  are MDX and link to the tools they discuss (e.g. `[Dead Pixel Test](/dead-pixel-test)`).
  - `getGuidesForTool(slug)` powers the "Related guides" section on each tool page by matching the
    markdown link form `(/slug)` in guide bodies — accurate and self-maintaining.
  - Blog routes (`/blog`, `/blog/[slug]`) read from `GUIDES` and are fully static.
- **SEO is the product's growth engine.** Tool pages and guides must stay static. Helpers in
  `src/lib/seo.ts` (`pageMetadata`, `faqJsonLd`, `howToJsonLd`, `articleJsonLd`), plus
  `sitemap.ts` / `robots.ts` (both `export const dynamic = "force-static"`). OG image is a single
  static `public/og.png` (generated with `sharp`) — no runtime image generation under static export.
- **Feedback** is a `mailto:` contact page (`src/app/feedback/page.tsx`), address from
  `NEXT_PUBLIC_CONTACT_EMAIL` (centralized as `CONTACT_EMAIL` in `src/lib/seo.ts`). No form/storage.
- **Static info pages:** `/about`, `/privacy`, `/terms` (`src/app/{about,privacy,terms}/page.tsx`),
  linked from the footer's "Company" column and the sitemap. Legal review date = `LEGAL_UPDATED`
  in `seo.ts`. `/donate` (`src/app/donate/page.tsx`) is a static support page (Buy Me a Coffee /
  PayPal links). `/tools` lists all tools; `/blog` lists all guides.
- **Analytics:** `src/components/Analytics.tsx` loads **Google Analytics (GA4)** via `next/script`
  (`afterInteractive`) for **every visitor** — there is no cookie/consent banner. It renders only
  when a GA4 ID is present (`NEXT_PUBLIC_GA_ID`, else the hard-wired default). Because it's a client
  component, the GA scripts are intentionally absent from the static HTML and inject after hydration.
  There is **no consent gate** (the old `CookieConsent` banner + `bst_cookie_consent` localStorage
  flag were removed) — this is a deliberate call that trades GDPR/PECR consent for full traffic
  visibility; if you reintroduce a gate, wrap the scripts in `Analytics.tsx` on the stored choice.
  Keep `/privacy` in sync with whatever trackers actually load.
- **Third-party tags:** Google AdSense (`<meta name="google-adsense-account">` via layout
  `metadata.other`, the `adsbygoogle.js` script, and `public/ads.txt`) loads site-wide. The AdSense
  publisher ID (`ca-pub-7400069037778721`) and GA4 ID (`G-FC5ELM4BX8`) are hard-wired defaults in
  `layout.tsx` / `Analytics.tsx` (IDs aren't secret); `NEXT_PUBLIC_GA_ID` only overrides GA if set.

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
- **Favicons use the file convention:** `src/app/icon.png` (512²) + `src/app/apple-icon.png` (180²),
  generated from `public/bestscreentester_logo.png` with `sharp`. There is no `favicon.ico` and no
  `metadata.icons` override — don't add one pointing at the full 1.7 MB logo (that was the old bug
  that made the tab icon download the whole logo).
  - ⚠️ **Regression to clean up:** `src/app/head.tsx` currently adds `<link rel="icon">` /
    `apple-touch-icon` tags pointing straight at `/bestscreentester_logo.png` (the 1.7 MB file),
    reintroducing exactly that bug and overriding the optimized `icon.png`/`apple-icon.png`. Prefer
    deleting `head.tsx` (or pointing it at the optimized assets) so the file-convention icons win.
- **`react-hooks` lint rules are strict.** Two traps that only `npm run lint` catches (not `next build`):
  - *Purity:* don't call impure functions (`performance.now()`, `Date.now()`, `Math.random()`) or
    read/write a ref's `.current` during render. Do that work inside `useEffect` (see `PatternCanvas`:
    start-time ref set on mount, latest-callback ref synced in an effect).
  - *`set-state-in-effect`:* calling `setState` synchronously in an effect is flagged. For genuine
    one-shot client-only reveals (reading `localStorage`/a media query on mount, then setting state
    once) this is legitimate — use a scoped `// eslint-disable-next-line react-hooks/set-state-in-effect`
    with a justifying comment rather than reworking it.
- CI (`.github/workflows/ci.yml`): install → lint → build (static export), then on `main`
  upload `./out` and deploy to GitHub Pages (`upload-pages-artifact` + `deploy-pages`).


 ## TODO:

- the webstie is not https so its not showing fix this (should we tunnel this aswell for the fix?) its public for now and working but make it private in github? 
- update UI, to much icons need fix

- fake broken screen needs update it looks shit need fixing (still bad)

- fix the pipe animations (the pipe don't look like the one from window)

- window booting looks fake need to fix the loading circle to make it more realistic (it should disappear from the bottom and repair)


