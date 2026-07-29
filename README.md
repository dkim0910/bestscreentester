# BestScreenTester

**20** free, browser-based screen tests — dead pixels, color, backlight bleed, refresh rate,
ghosting, blooming, plus fun tools (fake broken screen, boot screen simulator, screensaver) — and
**37** guides.

**Fully static. No database, no accounts, no backend.** Every screen test runs 100% in your
browser (Fullscreen API, Wake Lock, Canvas), and all content is prerendered at build time.

The site is ad-supported: Google AdSense and Google Analytics (GA4) load for every visitor, with
no consent banner. See `/privacy` for what that means and CLAUDE.md for why.

## Stack

- **Next.js 16** (App Router, SSG, TypeScript)
- **Tailwind CSS v4**
- **next-mdx-remote** for rendering guide MDX
- **geist** self-hosted fonts (no build-time network fetch)

## Local development

```bash
npm install
cp .env.example .env   # site URL, contact email, optional GA + Search Console IDs
npm run dev            # http://localhost:3000
```

That's it — there's nothing else to run. All env vars are optional and public (`NEXT_PUBLIC_*`);
without a `.env` the site falls back to `http://localhost:3000` for URLs and the built-in contact
address.

To preview a production build, use a static server — **not `npm start`** (see Scripts below):

```bash
npm run build && npx serve out
```

## Project structure

- `src/lib/tools.ts` — the tool registry (single source of truth for all screen tests).
- `src/components/tools/` — the tool engine: `FullscreenStage` controller, `ColorCycler`,
  `PatternCanvas`, `CanvasStage`, and per-tool components wired up in `ToolRunner`.
- `src/lib/guides.ts` — all blog/guide content (the `GUIDES` array). Add or edit guides here.
- `src/app/[tool]/page.tsx` — statically generated page per tool, with how-to, FAQ, related
  tools, and related guides.
- `src/app/blog/` — guide index and individual guide pages (static).
- `src/lib/seo.ts` — shared metadata/JSON-LD helpers plus `SITE_NAME`, `CONTACT_EMAIL`, and
  `LEGAL_UPDATED` (the "last updated" date shown on the legal pages).
- Standalone pages: `/tools`, `/blog`, `/about`, `/privacy`, `/terms`, `/donate` (Ko-fi, Buy Me a
  Coffee, Patreon), `/feedback` (a `mailto:` link — there is no form or storage).
- `public/og.png` — static OpenGraph image; `public/CNAME` + `public/.nojekyll` for GitHub Pages;
  `public/ads.txt` for AdSense.

## Adding content

- **New guide:** add an entry to `GUIDES` in `src/lib/guides.ts`. Link to the tools it discusses
  (e.g. `[Dead Pixel Test](/dead-pixel-test)`) — it will automatically appear under "Related
  guides" on those tool pages.
- **New tool:** add it to `TOOLS` in `src/lib/tools.ts`, then map its slug to a component in
  `src/components/tools/ToolRunner.tsx`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server on :3000 |
| `npm run build` | Static export → `./out` (typechecks, but does **not** run ESLint) |
| `npm run lint` | ESLint — run it separately; CI does |
| ~~`npm start`~~ | **Doesn't work.** `next start` errors on `output: "export"` — use `npx serve out` |

`next build` no longer runs ESLint in Next 16, so a green build can still have lint errors. Always
run `npm run lint` before pushing; CI runs both as separate steps.

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
`CNAME → <user>.github.io`.

**HTTPS:** GitHub provisions the TLS certificate automatically, but only *after* DNS fully
resolves, and **"Enforce HTTPS" is a separate checkbox** under Settings → Pages that stays off
until the cert is issued. If the site is serving over plain HTTP, check that box first — that's
the usual cause, not the build.

> **Note:** GitHub Pages only serves from public repos on the free plan. Making this repo private
> requires GitHub Pro/Team or it will take the site offline.
