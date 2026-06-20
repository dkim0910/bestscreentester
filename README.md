# BestScreenTester

A suite of free, browser-based screen tests — dead pixels, color, backlight bleed, refresh rate,
ghosting, blooming, plus fun tools (fake broken screen, screensaver) — and a library of guides.

**Fully static. No database, no accounts, no backend.** Every screen test runs 100% in your
browser (Fullscreen API, Wake Lock, Canvas), and all content is prerendered at build time.

## Stack

- **Next.js 16** (App Router, SSG, TypeScript)
- **Tailwind CSS v4**
- **next-mdx-remote** for rendering guide MDX
- **geist** self-hosted fonts (no build-time network fetch)

## Local development

```bash
npm install
cp .env.example .env   # public site URL + contact email
npm run dev            # http://localhost:3000
```

That's it — there's nothing else to run.

## Project structure

- `src/lib/tools.ts` — the tool registry (single source of truth for all screen tests).
- `src/components/tools/` — the tool engine: `FullscreenStage` controller, `ColorCycler`,
  `PatternCanvas`, `CanvasStage`, and per-tool components wired up in `ToolRunner`.
- `src/lib/guides.ts` — all blog/guide content (the `GUIDES` array). Add or edit guides here.
- `src/app/[tool]/page.tsx` — statically generated page per tool, with how-to, FAQ, related
  tools, and related guides.
- `src/app/blog/` — guide index and individual guide pages (static).
- `src/app/api/og/` — dynamic OpenGraph image generation (the only server route).

## Adding content

- **New guide:** add an entry to `GUIDES` in `src/lib/guides.ts`. Link to the tools it discusses
  (e.g. `[Dead Pixel Test](/dead-pixel-test)`) — it will automatically appear under "Related
  guides" on those tool pages.
- **New tool:** add it to `TOOLS` in `src/lib/tools.ts`, then map its slug to a component in
  `src/components/tools/ToolRunner.tsx`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` | Lint |

## Deploy

Because the site is fully static, it deploys anywhere that runs a Next.js build (Vercel, Netlify,
a container, etc.) with no database or environment services to provision. Set
`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` for production.
