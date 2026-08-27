#!/usr/bin/env node
// Pings IndexNow after a deploy so Bing (plus Yandex, Seznam, Naver) picks up changes
// in minutes instead of waiting for a crawl. Google does not consume IndexNow.
//
// Only URLs whose sitemap <lastmod> falls inside WINDOW_DAYS are submitted — blasting
// all 60+ URLs on every deploy is what the protocol asks you not to do. That works
// because lastmod is now a real content date (SITE_UPDATED / a guide's own dates)
// rather than the build timestamp.

const KEY = process.env.INDEXNOW_KEY;
const SITE_URL = (process.env.SITE_URL || "https://bestscreentester.com").replace(/\/$/, "");
const WINDOW_DAYS = Number(process.env.INDEXNOW_WINDOW_DAYS || 7);
const ENDPOINT = "https://api.indexnow.org/indexnow";

if (!KEY) {
  console.error("INDEXNOW_KEY is not set — skipping IndexNow ping.");
  process.exit(0);
}

const host = new URL(SITE_URL).host;
const keyLocation = `${SITE_URL}/${KEY}.txt`;

async function fetchSitemap() {
  // Pages can serve the previous deploy for a few seconds after deploy-pages returns.
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`${SITE_URL}/sitemap.xml`, { cache: "no-store" });
      if (res.ok) return await res.text();
      console.error(`sitemap fetch attempt ${attempt}: HTTP ${res.status}`);
    } catch (err) {
      console.error(`sitemap fetch attempt ${attempt}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 5000 * attempt));
  }
  return null;
}

const xml = await fetchSitemap();
if (!xml) {
  console.error("Could not read the live sitemap — skipping IndexNow ping.");
  process.exit(0);
}

const cutoff = Date.now() - WINDOW_DAYS * 86400_000;
const urlList = [];
for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (!loc) continue;
  if (lastmod && Date.parse(lastmod) < cutoff) continue;
  urlList.push(loc);
}

if (urlList.length === 0) {
  console.log(`No URLs changed in the last ${WINDOW_DAYS} days — nothing to submit.`);
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation, urlList }),
});

// 200 = accepted, 202 = accepted, key validation pending.
console.log(`IndexNow: submitted ${urlList.length} URL(s) -> HTTP ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text().catch(() => ""));
  // A failed ping must never fail the deploy — the sitemap still covers discovery.
}
