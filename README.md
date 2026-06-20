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
- `public/og.png` — static OpenGraph image; `public/CNAME` + `public/.nojekyll` for GitHub Pages.

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

## Deploy (GitHub Pages)

The site is configured for a static export (`output: "export"` in `next.config.ts`) — `npm run build`
emits `./out`. It's deployed to **GitHub Pages** with the custom domain `bestscreentester.com`:

- `.github/workflows/ci.yml` builds the export and, on `main`, publishes `./out` to Pages
  (`upload-pages-artifact` + `deploy-pages`).
- `public/CNAME` holds the custom domain; `public/.nojekyll` keeps the `_next` folder.
- Production env (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`) is set in the workflow.

**One-time GitHub setup:** repo **Settings → Pages → Source = GitHub Actions**, and add the custom
domain. **DNS:** point the apex `bestscreentester.com` at the GitHub Pages IPs
(`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and `www` via
`CNAME → <user>.github.io`. GitHub provisions the TLS certificate automatically.
