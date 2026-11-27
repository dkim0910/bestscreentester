// BestScreenTester service worker: makes the tests work offline once the site has been
// opened. Written to out/sw.js by scripts/generate-sw.mjs, which fills in VERSION (a
// hash of the precached files), CORE (scripts, styles, fonts, images) and PAGES (the
// test pages per language) — edit this template, not the output. Registered as
// /sw.js?lang=<code>, and precaches that language's pages.
//
// - /_next/static/* is content-hashed: cache first.
// - Pages: network first, so a visitor online always gets the current page; offline,
//   the cached copy, then /offline.html.
// - Everything else on this origin: network first, cached copy when offline.
// Cross-origin requests (analytics, ads) are never touched.

const VERSION = "__VERSION__";
const CORE = __CORE__;
const PAGES = __PAGES__;
const LANG = new URL(self.location.href).searchParams.get("lang");
const PRECACHE = [...CORE, ...(PAGES[LANG] || PAGES.en)];
const CACHE = `bst-${VERSION}`;
// Pages and files fetched while browsing. Tied to the build too: a page from an old
// build points at script files the new build no longer has.
const RUNTIME = `bst-runtime-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Only what this cache lacks: a second language reuses the shared files. Small
      // batches, fetched fresh rather than from the HTTP cache.
      const missing = [];
      for (const url of PRECACHE) if (!(await cache.match(url))) missing.push(url);
      for (let i = 0; i < missing.length; i += 24) {
        await cache.addAll(missing.slice(i, i + 24).map((url) => new Request(url, { cache: "reload" })));
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("bst-") && key !== CACHE && key !== RUNTIME) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

async function remember(request, response) {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(RUNTIME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function cacheFirst(request) {
  const hit = await caches.match(request);
  return hit || remember(request, await fetch(request));
}

async function networkFirst(request) {
  try {
    return await remember(request, await fetch(request));
  } catch (error) {
    // Next adds ?hashes to some files (the favicon); the cached copy has none.
    const hit = await caches.match(request, { ignoreSearch: true });
    if (hit) return hit;
    throw error;
  }
}

// A browser refuses a redirected response as the answer to a navigation, and a host
// that tidies URLs (/offline.html → /offline) makes the cached copy one. Rebuilt, it
// is a plain response with the same body.
async function plain(response) {
  if (!response || !response.redirected) return response;
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function page(request) {
  try {
    return await remember(request, await fetch(request));
  } catch {
    const url = new URL(request.url);
    const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return (
      (await plain(await caches.match(path, { ignoreSearch: true }))) ||
      (await plain(await caches.match("/offline.html"))) ||
      Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;
  if (request.mode === "navigate") event.respondWith(page(request));
  else if (url.pathname.startsWith("/_next/static/")) event.respondWith(cacheFirst(request));
  else event.respondWith(networkFirst(request));
});
