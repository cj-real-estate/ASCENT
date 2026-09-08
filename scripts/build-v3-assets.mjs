/*
 * Rasterize the v3 logo system (brand/v3/) into the files the site serves:
 *
 *   public/favicon-32.png, apple-touch-icon-180.png, icon-512.png,
 *   maskable-512.png      — the app icon (chevron on ink), square
 *   public/og-sponsors.png — 1200×630 social card: the primary-on-dark
 *                            lockup centred on ink, for ascentforsponsors.com
 *
 * The SVGs in brand/v3 are the masters (outlined type, no fonts needed).
 * Run with:  node scripts/build-v3-assets.mjs
 *
 * This supersedes scripts/generate-assets.mjs for the icons — that script
 * draws the older traced mark and would overwrite these.
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const V3 = new URL("../brand/v3/", import.meta.url);
const PUB = new URL("../public/", import.meta.url);
const file = (base, name) => new URL(name, base).pathname;

const icon = readFileSync(file(V3, "ascent-icon-app-ink.svg"));
for (const [name, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon-180.png", 180],
  ["icon-512.png", 512],
  ["maskable-512.png", 512],
]) {
  await sharp(icon, { density: 600 }).resize(size, size).png().toFile(file(PUB, name));
  console.log("wrote", name);
}

const lockup = await sharp(readFileSync(file(V3, "ascent-lockup-primary-on-dark.svg")), {
  density: 300,
})
  .resize({ width: 840 })
  .png()
  .toBuffer();
const { width, height } = await sharp(lockup).metadata();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#0E0E0E" },
})
  .composite([
    {
      input: lockup,
      left: Math.round((1200 - width) / 2),
      top: Math.round((630 - height) / 2),
    },
  ])
  .png()
  .toFile(file(PUB, "og-sponsors.png"));
console.log("wrote og-sponsors.png", width, height);
