#!/usr/bin/env node
/*
 * Exports the sponsor site (ascentforsponsors.com) as paste-ready code for a
 * GoHighLevel website: one folder per page, each with
 *
 *   head.html  the page's title, description, canonical, social tags and
 *              JSON-LD, for the GHL page's Settings > Head tracking code;
 *   body.html  the page's styles and markup for ONE full-width "Custom
 *              JS/HTML" element.
 *
 * The pages are rendered by this project's own production server, so the
 * export matches the live design exactly. What changes on the way out:
 *
 *   - Every Next.js/React script is removed. The pages are server-rendered,
 *     so they read and work without it; the two interactive pieces get
 *     plain replacements: the hero video (a small loader script, below) and
 *     the forms (a marked slot for the GHL form embed — the lead form in
 *     #book and the SMS opt-in form).
 *   - Asset URLs point at https://ascentcas.com, which stays on Vercel:
 *     fonts (stable copies in public/ghl/fonts), images, posters and the
 *     hero video. next.config.ts sends CORS headers for those paths.
 *   - Page links stay root-relative (/guides/…, /privacy), so they work on
 *     ascentforsponsors.com once the domain points at GHL.
 *
 * Usage: build and start the site (`npx next build && npx next start -p
 * 3251`), then `node scripts/build-ghl-export.mjs [http://localhost:3251]`
 * and `node scripts/build-ghl-schedule.mjs` (the post-form calendar page).
 * Needs Playwright (any install; set PLAYWRIGHT_MODULE to its index.mjs).
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3251";
const ASSET_ORIGIN = "https://ascentcas.com";
const OUT = path.join(process.cwd(), "ghl-export");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");


// GHL page path -> this site's route.
const PAGES = [
  ["home", "/", "/sponsors"],
  ["guides", "/guides", "/sponsors/guides"],
  ["privacy", "/privacy", "/sponsors/privacy"],
  ["terms", "/terms", "/sponsors/terms"],
  ["sms-opt-in", "/sms-opt-in", "/sponsors/sms-opt-in"],
];

// Fonts: hashed build names -> the stable copies in public/ghl/fonts.
const FONT_MAP = [
  [/archivo_800[^)"']*\.woff2/g, "archivo-800.woff2"],
  [/plex_sans_400[^)"']*\.woff2/g, "plex-sans-400.woff2"],
  [/plex_sans_600[^)"']*\.woff2/g, "plex-sans-600.woff2"],
  [/plex_mono_500[^)"']*\.woff2/g, "plex-mono-500.woff2"],
];

/* The hero footage, mounted the way src/components/sponsor/HeroVideo.tsx
 * does it: never for reduced motion or Data Saver, faded in once playing,
 * paused off-screen. The <video> itself is in the markup (preload="none"),
 * so nothing downloads until this script decides it should. */
const VIDEO_SCRIPT = `<script>
(function () {
  var v = document.querySelector("video[data-hero-video]");
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var save = navigator.connection && navigator.connection.saveData;
  if (reduce || save) { v.remove(); return; }
  v.muted = true;
  v.addEventListener("playing", function () { v.style.opacity = "1"; }, { once: true });
  v.preload = "auto";
  v.load();
  var p = v.play(); if (p && p.catch) p.catch(function () {});
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else { v.pause(); }
    }, { threshold: 0.05 }).observe(v);
  }
})();
</script>`;

const FORM_SLOT = (name) => `<div class="ghl-form-slot" data-ghl-slot="${name}">
<!-- PASTE THE GHL ${name.toUpperCase()} FORM EMBED CODE HERE (see GHL-SETUP.md) -->
</div>`;

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();

  // Guide slugs come from the guides index links.
  await page.goto(`${BASE}/sponsors/guides`, { waitUntil: "load" });
  const guideSlugs = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href*="/guides/"]')].map((a) => (a.getAttribute("href").match(/\/guides\/([^/?#]+)/) || [])[1]))].filter(Boolean),
  );
  // GHL page paths are one segment, so /guides/<slug> becomes /guide-<slug>
  // (the folder name doubles as the GHL path). flatGuides() rewrites links,
  // canonicals and JSON-LD to match; GHL-SETUP.md redirects the old URLs.
  const pages = [...PAGES, ...guideSlugs.map((slug) => [`guide-${slug}`, `/guide-${slug}`, `/sponsors/guides/${slug}`])];
  const flatGuides = (html) => html.replace(/((?:https:\/\/(?:www\.)?ascentforsponsors\.com)?)\/guides\/([a-z0-9-]+)/g, "$1/guide-$2");

  const cssCache = new Map();
  const manifest = [];
  for (const [name, ghlPath, route] of pages) {
    await page.goto(`${BASE}${route}`, { waitUntil: "load" });
    const result = await page.evaluate(
      ({ assetOrigin, formSlotLead, formSlotSms }) => {
        const abs = (url) => {
          if (!url || !url.startsWith("/") || url.startsWith("//")) return url;
          if (url.startsWith("/_next/image")) {
            const u = new URL(url, location.origin);
            return assetOrigin + decodeURIComponent(u.searchParams.get("url") || "");
          }
          const pagePaths = ["/guides", "/privacy", "/terms", "/sms-opt-in"];
          if (url === "/" || url.startsWith("/#") || pagePaths.some((p) => url === p || url.startsWith(p + "/") || url.startsWith(p + "#"))) return url;
          return assetOrigin + url;
        };

        // Head: what search engines and social previews read.
        const head = [];
        head.push(`<title>${document.title.replace(/</g, "&lt;")}</title>`);
        for (const el of document.head.querySelectorAll(
          'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], link[rel="icon"], link[rel="apple-touch-icon"]',
        )) {
          const c = el.cloneNode();
          for (const attr of ["href", "content"]) {
            const val = c.getAttribute(attr);
            if (val && val.startsWith("/")) c.setAttribute(attr, abs(val));
          }
          head.push(c.outerHTML);
        }
        for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
          head.push(`<script type="application/ld+json">${s.textContent}</script>`);
        }

        const body = document.body.cloneNode(true);
        // Scripts, the modal, preload hints: gone.
        body.querySelectorAll('script, noscript, link, template, dialog, next-route-announcer, [hidden]').forEach((n) => n.remove());
        // The lead form -> GHL form slot.
        body.querySelectorAll("section#book form").forEach((f) => {
          const wrap = f.parentElement;
          wrap.innerHTML = formSlotLead;
        });
        // The SMS opt-in form -> GHL form slot.
        body.querySelectorAll('form[action="/api/book"], form[method="post"]').forEach((f) => {
          f.outerHTML = formSlotSms;
        });
        // Every "Book a demo" button goes to the form section.
        body.querySelectorAll("[data-open-lead-modal]").forEach((a) => {
          a.removeAttribute("data-open-lead-modal");
          a.setAttribute("href", location.pathname.endsWith("/sponsors") ? "#book" : "/#book");
        });
        // Asset URLs -> ascentcas.com.
        body.querySelectorAll("[src],[href],[poster],[srcset]").forEach((el) => {
          for (const attr of ["src", "href", "poster"]) {
            if (el.hasAttribute(attr)) el.setAttribute(attr, abs(el.getAttribute(attr)));
          }
          if (el.hasAttribute("srcset")) {
            el.setAttribute(
              "srcset",
              el.getAttribute("srcset").split(",").map((part) => {
                const [u, d] = part.trim().split(/\s+/);
                return [abs(u), d].filter(Boolean).join(" ");
              }).join(", "),
            );
          }
        });
        // Hero: add the <video> HeroVideo mounts client-side, after the poster.
        const poster = body.querySelector('picture img[fetchpriority="high"]');
        let hasVideo = false;
        if (poster) {
          const pic = poster.closest("picture");
          const base = assetOrigin + "/video/hero";
          pic.insertAdjacentHTML(
            "afterend",
            `<video data-hero-video aria-hidden="true" muted loop playsinline preload="none" style="opacity:0;transition:opacity .7s" class="pointer-events-none absolute inset-x-0 top-px h-[calc(100%-2px)] w-full object-cover">
<source media="(min-width: 640px)" type='video/mp4; codecs="av01.0.08M.08"' src="${base}-1080.av1.mp4">
<source media="(min-width: 640px)" type='video/mp4; codecs="hvc1.1.6.L120.90"' src="${base}-1080.hevc.mp4">
<source media="(min-width: 640px)" type='video/mp4; codecs="avc1.640028"' src="${base}-1080.mp4">
<source type='video/mp4; codecs="hvc1.1.6.L120.90"' src="${base}-phone.hevc.mp4">
<source type='video/mp4; codecs="avc1.640028"' src="${base}-phone.mp4">
</video>`,
          );
          hasVideo = true;
        }
        const css = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href"));
        const htmlClass = document.documentElement.className;
        const bodyClass = document.body.className;
        return { head: head.join("\n"), body: body.innerHTML, css, hasVideo, htmlClass, bodyClass };
      },
      { assetOrigin: ASSET_ORIGIN, formSlotLead: FORM_SLOT("lead"), formSlotSms: FORM_SLOT("sms opt-in") },
    );

    let css = "";
    for (const href of result.css) {
      if (!cssCache.has(href)) {
        let text = await (await fetch(`${BASE}${href}`)).text();
        for (const [re, file] of FONT_MAP) text = text.replace(re, file);
        text = text.replace(/url\((["']?)[^)"']*\/(archivo-800|plex-sans-400|plex-sans-600|plex-mono-500)\.woff2\1\)/g, `url(${ASSET_ORIGIN}/ghl/fonts/$2.woff2)`);
        cssCache.set(href, text);
      }
      css += cssCache.get(href);
    }

    /* The site's <html> and <body> carry the font variables and the dark
     * page styling as classes. GHL owns those two elements, so the same
     * classes go on a wrapper instead, and a line of CSS darkens GHL's own
     * page background to match. */
    // Only the font-variable classes from <html>: its colors are the light
    // template's, and the sponsor pages set their own on <body>.
    const fontVars = result.htmlClass.split(/\s+/).filter((c) => c.includes("variable")).join(" ");
    /* The site's base text style lives on <body>, where GHL's own styles
     * would win; the wrapper carries it instead. */
    /* The theme's --font-sans/-display/-mono point at next/font's variables,
     * and resolve where they are declared (:root). On the site those
     * variables sit on <html>, so that works; here they sit on the wrapper,
     * so the theme fonts must be re-declared there too. */
    const themeFonts = [...new Set(css.match(/--font-(?:display|sans|mono):[^;}]*/g) || [])].join(";");
    const body = `<style>${css}
html,body{background:#0d0d0d}
[data-ascent-root]{${themeFonts};font-family:var(--font-sans);-webkit-font-smoothing:antialiased;font-size:17px;line-height:1.6}
.ghl-form-slot{min-height:120px}
</style>
<div class="${fontVars} ${result.bodyClass}" data-ascent-root>
${result.body}
</div>
${result.hasVideo ? VIDEO_SCRIPT : ""}`;

    const dir = path.join(OUT, name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "head.html"), flatGuides(result.head) + "\n");
    writeFileSync(path.join(dir, "body.html"), flatGuides(body) + "\n");
    manifest.push({ name, ghlPath, bytes: Buffer.byteLength(body) });
    console.log(`${name.padEnd(64)} ${ghlPath.padEnd(64)} ${(Buffer.byteLength(body) / 1024).toFixed(0)} KB`);
  }
  writeFileSync(path.join(OUT, "pages.json"), JSON.stringify(manifest, null, 2) + "\n");
  await browser.close();
}

await main();
