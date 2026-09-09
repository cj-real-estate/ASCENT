/*
 * Submit the sponsor domain's URLs to IndexNow (Bing, Yandex, Seznam,
 * Naver — and, via Bing's index, the search behind several AI assistants).
 *
 *   INDEXNOW_KEY=<key> node scripts/indexnow.mjs
 *
 * The same INDEXNOW_KEY must be set in the Vercel project so the site
 * serves https://ascentforsponsors.com/indexnow/<key>.txt (see
 * src/app/indexnow/[key]/route.ts). The key is any 8–128 character string
 * of letters, digits and dashes — generate one once and keep it.
 *
 * Reads the URL list from the live sitemap, so it never drifts from what
 * the site says is canonical. Run it after every deploy that changes a
 * page; Google does not use IndexNow, so submit the sitemap in Search
 * Console separately (SEO-GEO-PLAYBOOK.md).
 */
const HOST = "ascentforsponsors.com";
const key = (process.env.INDEXNOW_KEY ?? "").trim();
if (!key) {
  console.error("INDEXNOW_KEY is not set");
  process.exit(1);
}

const keyLocation = `https://${HOST}/indexnow/${key}.txt`;
const served = await fetch(keyLocation).then((r) => (r.ok ? r.text() : ""));
if (served.trim() !== key) {
  console.error(`${keyLocation} does not serve the key — is INDEXNOW_KEY set on Vercel and deployed?`);
  process.exit(1);
}

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`submitting ${urlList.length} URLs`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
console.log(res.status, res.statusText);
if (!res.ok) process.exit(1);
