/*
 * Crop the founder's headshot into the three shapes /caleb-free needs:
 *
 *   public/people/caleb-free.jpg         720×900   portrait, beside the h1
 *   public/people/caleb-free-square.jpg  1200×1200 the Person image in JSON-LD
 *   public/people/caleb-free-og.jpg      1200×630  social card, on ink
 *
 * Run with:  node scripts/build-person-assets.mjs <path-to-original.jpg>
 *
 * REGION is an explicit extract rather than sharp's "attention" heuristic,
 * because a face crop chosen by entropy moves whenever the source changes
 * and there is no way to notice from a diff. It is expressed as fractions
 * of the source, so a re-shoot at a different resolution still lands in
 * roughly the right place — but LOOK at the output before committing it.
 *
 * The social card is composed, not cropped: a 1200×630 slice of a portrait
 * photograph is mostly background. Headshot right, wordmark left, ink
 * ground — the same construction as og-sponsors.png.
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/build-person-assets.mjs <original.jpg>");
  process.exit(1);
}

/* Centred vertical slice that keeps his head in frame with headroom. */
const REGION = { xFrac: 0.2333, widthFrac: 0.5333 };

const meta = await sharp(src).metadata();
const left = Math.round(meta.width * REGION.xFrac);
const width = Math.round(meta.width * REGION.widthFrac);
const portrait = { left, top: 0, width, height: meta.height };

await sharp(src)
  .extract(portrait)
  .resize(720, 900, { fit: "cover" })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/people/caleb-free.jpg");

await sharp(src)
  .extract({ ...portrait, height: Math.min(width, meta.height) })
  .resize(1200, 1200, { fit: "cover" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile("public/people/caleb-free-square.jpg");

const shot = await sharp("public/people/caleb-free-square.jpg")
  .resize(630, 630, { fit: "cover" })
  .toBuffer();
const mark = await sharp(readFileSync("public/brand/ascent-wordmark-on-dark.svg"), {
  density: 300,
})
  .resize({ width: 380 })
  .png()
  .toBuffer();
const markMeta = await sharp(mark).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0E0E0E" } })
  .composite([
    { input: shot, left: 570, top: 0 },
    { input: mark, left: 72, top: Math.round((630 - markMeta.height) / 2) },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/people/caleb-free-og.jpg");

console.log("wrote public/people/caleb-free{,-square,-og}.jpg from", src);
