/*
 * Generates all icon + social image assets into public/.
 *
 * Run: node scripts/generate-assets.mjs   (or: npm run generate:assets)
 *
 * The chevron geometry is copied verbatim from src/components/Logo.tsx
 * (AscentMark). If the client ever supplies an official vector, update
 * MARK there and in CHEVRONS below — one edit each.
 *
 * Icons are rasterized from inline SVG via sharp. The OG image needs the
 * real brand fonts (Archivo 800 / IBM Plex Mono 500, woff2 on disk), which
 * sharp's SVG rasterizer cannot load — so that one asset is rendered by
 * headless Chromium screenshotting a temp HTML page at exactly 1200x630.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const FONTS = path.join(ROOT, "src", "fonts");

// ---------------------------------------------------------------------------
// Brand constants (docs/ascent-brand-style-guide.md §3)
// ---------------------------------------------------------------------------
const ORANGE = "#F05E23";
const INK = "#1F1F1F";
const WHITE = "#FFFFFF";

/*
 * The two-chevron mark, copied EXACTLY from src/components/Logo.tsx.
 * viewBox 0 0 285 269 — outer chevron up-left, inner chevron offset
 * down-right with its apex tucked into the outer's notch.
 * Future vector swap: edit these two path strings (and Logo.tsx) only.
 */
const CHEVRONS = {
  viewBox: { w: 285, h: 269 },
  outer: "M0,210 L131.92,14.91 Q142,0 152.08,14.91 L284,210 L206,210 L149.56,126.54 Q142,115.35 134.44,126.54 L78,210 Z",
  inner: "M30,269 L146.04,97.26 Q155,84 163.96,97.26 L280,269 L205,269 L161.72,204.94 Q155,195 148.28,204.94 L105,269 Z",
};

/**
 * Square SVG with the mark centered, scaled to fit inside `size` minus
 * `padFrac` padding on each side. `bg` null → transparent.
 */
/*
 * The mark, with a transparent channel knocked out of the outer chevron
 * wherever the inner one crosses it. Without it the all-white reverse merges
 * into a single blob and the inner chevron disappears (brand guide §2).
 * `idSuffix` keeps mask ids unique when several marks share one document.
 */
function markPaths(outerFill, innerFill, idSuffix = "m") {
  const { w, h } = CHEVRONS.viewBox;
  return `<mask id="gap-${idSuffix}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
      <rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>
      <path d="${CHEVRONS.inner}" fill="#000" stroke="#000" stroke-width="19" stroke-linejoin="round"/>
    </mask>
    <path d="${CHEVRONS.outer}" fill="${outerFill}" mask="url(#gap-${idSuffix})"/>
    <path d="${CHEVRONS.inner}" fill="${innerFill}"/>`;
}

function markSvg({ size, padFrac, outerFill, innerFill, bg = null }) {
  const { w, h } = CHEVRONS.viewBox;
  const pad = size * padFrac;
  const scale = (size - 2 * pad) / Math.max(w, h);
  const tx = (size - w * scale) / 2;
  const ty = (size - h * scale) / 2;
  const rect = bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${rect}
  <g transform="translate(${tx} ${ty}) scale(${scale})">
    ${markPaths(outerFill, innerFill, "icon")}
  </g>
</svg>`;
}

async function writePng(name, svg, size) {
  const out = path.join(PUBLIC, name);
  // density 288 supersamples the SVG 4x; resize pins the exact output size.
  await sharp(Buffer.from(svg), { density: 288 }).resize(size, size).png().toFile(out);
  return out;
}

// ---------------------------------------------------------------------------
// OG image — rendered via headless Chromium so the real woff2 fonts apply.
// ---------------------------------------------------------------------------
function findChromium() {
  const candidates = [
    process.env.CHROMIUM_BIN,
    "/opt/pw-browsers/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);
  const found = candidates.find((c) => existsSync(c));
  if (!found) {
    throw new Error(
      `Chromium not found (tried: ${candidates.join(", ")}). Set CHROMIUM_BIN.`,
    );
  }
  return found;
}

function ogHtml() {
  const archivo = pathToFileURL(path.join(FONTS, "archivo-800.woff2"));
  const plexMono = pathToFileURL(path.join(FONTS, "plex-mono-500.woff2"));
  const mark = `<svg width="176" height="150" viewBox="0 0 ${CHEVRONS.viewBox.w} ${CHEVRONS.viewBox.h}" xmlns="http://www.w3.org/2000/svg">
    ${markPaths(WHITE, WHITE, "og")}
  </svg>`;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Archivo";
    font-weight: 800;
    src: url("${archivo}") format("woff2");
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-weight: 500;
    src: url("${plexMono}") format("woff2");
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: ${INK};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .word {
    margin-top: 34px;
    font-family: "Archivo", sans-serif;
    font-weight: 800;
    font-size: 104px;
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${WHITE};
    text-transform: uppercase;
  }
  .tagline {
    margin-top: 22px;
    font-family: "IBM Plex Mono", monospace;
    font-weight: 500;
    font-size: 25px;
    line-height: 1;
    letter-spacing: 0.34em;
    /* letter-spacing trails the last glyph — pull it back so the line centers */
    margin-right: -0.34em;
    color: ${ORANGE};
    text-transform: uppercase;
  }
</style>
</head>
<body>
  ${mark}
  <div class="word">Ascent</div>
  <div class="tagline">Client Acquisition Systems</div>
</body>
</html>`;
}

async function generateOg() {
  const chromium = findChromium();
  const tmp = mkdtempSync(path.join(tmpdir(), "ascent-og-"));
  const htmlPath = path.join(tmp, "og.html");
  const shotPath = path.join(tmp, "og.png");
  try {
    writeFileSync(htmlPath, ogHtml());
    execFileSync(
      chromium,
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,630",
        `--screenshot=${shotPath}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "pipe" },
    );
    const out = path.join(PUBLIC, "og-image.png");
    // Re-encode through sharp: normalizes the PNG and guarantees exact size.
    await sharp(readFileSync(shotPath)).resize(1200, 630).png().toFile(out);
    return out;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(PUBLIC, { recursive: true });
  const written = [];

  // favicon-32 — transparent, orange/ink mark, a little padding.
  written.push(
    await writePng(
      "favicon-32.png",
      markSvg({ size: 32, padFrac: 0.06, outerFill: ORANGE, innerFill: INK }),
      32,
    ),
  );

  // icon-512 — transparent, orange/ink mark, ~8% padding.
  written.push(
    await writePng(
      "icon-512.png",
      markSvg({ size: 512, padFrac: 0.08, outerFill: ORANGE, innerFill: INK }),
      512,
    ),
  );

  // apple-touch-icon-180 — opaque white (iOS requires opaque), ~15% padding.
  written.push(
    await writePng(
      "apple-touch-icon-180.png",
      markSvg({ size: 180, padFrac: 0.15, outerFill: ORANGE, innerFill: INK, bg: WHITE }),
      180,
    ),
  );

  // maskable-512 — ink bg, all-white mark (never orange/ink on ink, guide §2),
  // kept inside the central ~60% so circular masks never clip it.
  written.push(
    await writePng(
      "maskable-512.png",
      markSvg({ size: 512, padFrac: 0.2, outerFill: WHITE, innerFill: WHITE, bg: INK }),
      512,
    ),
  );

  // og-image — 1200x630 white lockup on ink, via Chromium for real fonts.
  written.push(await generateOg());

  for (const file of written) {
    const meta = await sharp(file).metadata();
    console.log(
      `wrote ${path.relative(ROOT, file)}  ${meta.width}x${meta.height}  ${meta.format}` +
        (meta.hasAlpha ? "  (alpha)" : ""),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
