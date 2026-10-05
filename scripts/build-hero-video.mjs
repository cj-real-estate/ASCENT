#!/usr/bin/env node
/*
 * Turns the owner's hero footage (a .mov straight off a phone or an
 * editor) into everything the sponsor hero serves. Naming is a contract
 * with src/components/sponsor/HeroVideo.tsx (`heroVideoFiles`), which
 * derives every URL from one base path — change both together.
 *
 *   <base>-1080.av1.mp4     1920x1080 AV1    screens 640px and up
 *   <base>-1080.hevc.mp4    1920x1080 HEVC   ...where AV1 isn't supported (Safari)
 *   <base>-1080.mp4         1920x1080 H.264  ...where neither is
 *   <base>-phone.hevc.mp4   768x1280 HEVC    phones, portrait centre crop
 *   <base>-phone.mp4        768x1280 H.264   ...where HEVC isn't supported
 *   <base>-poster-{landscape,portrait}.{avif,webp,jpg}
 *
 * Why this shape — measured on the owner's 74-second 4K drone reel
 * (2026-10-05), quality as VMAF against a lossless reference, where ~95 is
 * indistinguishable from the source:
 *
 *   - Newer codecs, same bytes. At today's ~1.3 Mbps budget for 1080p,
 *     H.264 scored 88.2, HEVC 93-94, AV1 94.7. So the page costs no more
 *     to load and the picture is near source quality. Browsers take the
 *     first source they can decode; H.264 is there for the rare one that
 *     handles neither newer codec.
 *   - Phones get a portrait crop. The hero box on a phone is tall and
 *     narrow, and object-fit: cover shows only the centre 27-34% of a 16:9
 *     frame — so a landscape file wastes ~70% of its pixels and stretches
 *     the rest 3x. A 768x1280 crop of that same centre has the same pixel
 *     count, so the same bitrate, and every pixel lands on screen: 93.5 at
 *     0.7 Mbps in HEVC, and visibly sharper than before. Aspect 0.6 covers
 *     phones up to 430px wide without trimming top or bottom.
 *   - No AV1 for phones. A browser that lacks AV1 hardware still claims
 *     support and decodes in software, which costs battery; every iPhone
 *     and most Androids decode HEVC in hardware.
 *   - Audio stripped, +faststart, keyframe every 5 s, never upscaled.
 *   - Posters art-directed the same way (landscape / portrait) in AVIF,
 *     WebP and JPEG; HeroVideo serves them through <picture>.
 *
 * Usage:
 *   FFMPEG=/path/to/ffmpeg node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]
 *
 * ffmpeg is NOT a dependency of this project: it is a 70MB binary that
 * every Vercel build would download for a script run once in a while.
 * Point FFMPEG at any static build with libaom-av1, libx265 and libx264.
 * The AV1 encode is the slow one — several minutes for a minute of 4K.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [input, posterAt = "1"] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]');
  process.exit(1);
}

const ffmpeg = process.env.FFMPEG || "ffmpeg";
const outDir = path.join(process.cwd(), "public", "video");
const base = "hero";
mkdirSync(outDir, { recursive: true });
const out = (name) => path.join(outDir, `${base}-${name}`);

/*
 * Landscape: full frame, at most 1920 wide. Portrait: the centre of the
 * frame at aspect 0.6 (crop width = height x 0.6), then 768x1280. Both
 * never upscale a smaller source.
 */
const LANDSCAPE = "scale='min(1920,iw)':-2:flags=lanczos";
const PORTRAIT = "crop='trunc(ih*0.6/2)*2':ih,scale=768:1280:flags=lanczos";

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

const COMMON = ["-an", "-g", "150", "-movflags", "+faststart"];
const H264 = (crf) => ["-c:v", "libx264", "-preset", "slow", "-crf", crf, "-profile:v", "high", "-level", "4.0"];
const HEVC = (crf) => [
  "-c:v", "libx265", "-preset", "slow", "-crf", crf, "-tag:v", "hvc1",
  "-x265-params", "log-level=error:level-idc=40",
];
const AV1 = (crf) => ["-c:v", "libaom-av1", "-crf", crf, "-b:v", "0", "-cpu-used", "6", "-row-mt", "1", "-tiles", "2x2"];

const ENCODES = [
  { file: "1080.mp4", vf: LANDSCAPE, codec: H264("30") },
  { file: "1080.hevc.mp4", vf: LANDSCAPE, codec: HEVC("29") },
  { file: "phone.mp4", vf: PORTRAIT, codec: H264("30") },
  { file: "phone.hevc.mp4", vf: PORTRAIT, codec: HEVC("29") },
  { file: "1080.av1.mp4", vf: LANDSCAPE, codec: AV1("39") }, // slowest last
];

for (const { file, vf, codec } of ENCODES) {
  const started = Date.now();
  process.stdout.write(`→ ${base}-${file} … `);
  run(["-i", input, "-vf", `${vf},format=yuv420p`, ...codec, ...COMMON, out(file)]);
  console.log(`${Math.round((Date.now() - started) / 1000)}s`);
}

// Posters: one still, art-directed like the video, in three formats.
for (const [shape, vf] of [["landscape", LANDSCAPE], ["portrait", PORTRAIT]]) {
  const png = out(`poster-${shape}.png`);
  run(["-ss", posterAt, "-i", input, "-frames:v", "1", "-vf", vf, png]);
  await sharp(png).avif({ quality: 55, effort: 6 }).toFile(out(`poster-${shape}.avif`));
  await sharp(png).webp({ quality: 78, effort: 6 }).toFile(out(`poster-${shape}.webp`));
  await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(out(`poster-${shape}.jpg`));
  unlinkSync(png);
}

/* ffmpeg with an input and no output prints the stream info to stderr and
 * exits non-zero, by design — so read the duration out of the error. */
function durationSeconds(file) {
  let info = "";
  try {
    execFileSync(ffmpeg, ["-hide_banner", "-i", file], { stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    info = String(err.stderr ?? "");
  }
  const m = info.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
}

console.log("");
for (const { file } of ENCODES) {
  const bytes = statSync(out(file)).size;
  const seconds = durationSeconds(out(file));
  const mbps = seconds > 0 ? (bytes * 8) / seconds / 1e6 : 0;
  console.log(`${`${base}-${file}`.padEnd(22)} ${(bytes / 1024 / 1024).toFixed(2).padStart(6)} MB  ${mbps.toFixed(2)} Mbps`);
  if (mbps > 2) console.warn(`  Warning: over 2 Mbps — raise that encode's CRF before shipping it.`);
}
for (const shape of ["landscape", "portrait"]) {
  const sizes = ["avif", "webp", "jpg"].map((ext) => `${ext} ${(statSync(out(`poster-${shape}.${ext}`)).size / 1024).toFixed(0)} KB`);
  console.log(`${`${base}-poster-${shape}`.padEnd(22)} ${sizes.join(" · ")}`);
}
console.log('\nhero.video in content/verticals/sponsors.ts:  { basePath: "/video/hero" }');
