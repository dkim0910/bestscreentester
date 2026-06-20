<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BestScreenTester

A suite of free, browser-based screen tests (dead pixel, color, backlight bleed, refresh rate,
ghosting, blooming, fake broken screen, screensaver) plus a library of guides. **Fully static —
no database, no accounts, no backend services.** The display tests run 100% client-side
(Fullscreen API, Wake Lock, Canvas).

## Stack

- **Next.js 16** App Router (SSG, TypeScript). Almost every route is statically prerendered.
- **Tailwind CSS v4** — dark theme; CSS variables in `src/app/globals.css`.
- **next-mdx-remote** — renders guide MDX bodies (compiled at build time).
- **geist** package — self-hosted fonts (not `next/font/google`).
- No database, ORM, or auth. The only server route is `/api/og` (dynamic OG image generation).

## Commands

```bash
npm run dev     # dev server :3000
npm run build   # prod build (typechecks, but does NOT run ESLint in Next 16)
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
    prop so external controls (e.g. homepage `QuickColors` swatches) can launch it.
  - `ColorCycler`, `PatternCanvas`, `CanvasStage` build on the stage. `patterns.ts` holds canvas
    draw helpers. `ToolRunner` maps each slug → its component.
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
  `sitemap.ts` / `robots.ts` and OG images via `/api/og`.
- **Feedback** is a `mailto:` contact page (`src/app/feedback/page.tsx`), address from
  `NEXT_PUBLIC_CONTACT_EMAIL` (centralized as `CONTACT_EMAIL` in `src/lib/seo.ts`). No form/storage.
- **Static info pages:** `/about`, `/privacy`, `/terms` (`src/app/{about,privacy,terms}/page.tsx`),
  linked from the footer's "Company" column and the sitemap. Legal review date = `LEGAL_UPDATED`
  in `seo.ts`.
- **Cookie consent** (`src/components/CookieConsent.tsx`) is a client banner in the root layout. It
  renders `null` during SSR and reveals after reading `localStorage` (`bst_cookie_consent`) on
  mount — keeps content pages static and avoids hydration mismatch. We set no tracking cookies, so
  it's purely an informational notice.

## Conventions

- Interactive tool components are `"use client"`; pages stay server components.
- Keep everything static: don't introduce a database, auth, or per-request server logic. New
  content = edit `src/lib/guides.ts`; new tool = edit `src/lib/tools.ts` + `ToolRunner`.

## Gotchas

- **Fonts are self-hosted via `geist`** specifically so `next build` needs no network (CI-safe).
  Don't reintroduce `next/font/google`.
- **OG image (`src/app/api/og/route.tsx`) uses Satori:** any `<div>` with more than one child node
  needs explicit `display: flex` (or render a single text child). Multi-node text breaks the build.
- `<html>` has `suppressHydrationWarning` because browser extensions inject attributes onto it.
- **`react-hooks` lint rules are strict.** Two traps that only `npm run lint` catches (not `next build`):
  - *Purity:* don't call impure functions (`performance.now()`, `Date.now()`, `Math.random()`) or
    read/write a ref's `.current` during render. Do that work inside `useEffect` (see `PatternCanvas`:
    start-time ref set on mount, latest-callback ref synced in an effect).
  - *`set-state-in-effect`:* calling `setState` synchronously in an effect is flagged. For genuine
    one-shot client-only reveals (e.g. `CookieConsent` reading `localStorage` on mount) this is
    legitimate — use a scoped `// eslint-disable-next-line react-hooks/set-state-in-effect` with a
    justifying comment rather than reworking it.
- CI (`.github/workflows/ci.yml`) is just install → lint → build (no DB).
