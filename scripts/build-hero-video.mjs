#!/usr/bin/env node
/*
 * Turns the owner's hero footage (a .mov straight off a phone or an
 * editor) into the files the sponsor hero plays:
 *
 *   public/video/hero.mp4          H.264, 1280 wide — phones and tablets
 *   public/video/hero-1080.mp4     H.264, 1920 wide — screens 1024px and up
 *   public/video/hero-poster.jpg   a still, shown before playback, to
 *                                  reduced-motion visitors, and wherever
 *                                  autoplay is blocked
 *
 * A .mov is never served directly: Safari plays QuickTime, Chrome and
 * Firefox mostly do not, so it would be a blank box for most visitors.
 *
 * Choices, all measured on the owner's 74-second 4K drone reel
 * (2026-10-05):
 *   - Two sizes rather than one. From lg up the hero opens its right side
 *     to the footage at near full brightness, where a 1280 encode
 *     stretched across a wide screen looks soft; on a phone the footage
 *     sits under an even dark tint, where 1280 is already more than
 *     enough. HeroVideo lets the browser pick by screen size, so a phone
 *     never downloads the large file.
 *   - CRF 30 for both — 0.7 Mbps at 1280, about 1.4 Mbps at 1920. The
 *     page does not wait for either: the video starts after the page has
 *     rendered, and the browser streams it as it plays, so the bitrate is
 *     what a visitor pays per second watched, not the total file size.
 *     The script warns above 2 Mbps. Override with HERO_CRF.
 *   - Never upscaled; audio stripped (bytes for nothing in a muted
 *     background, and some browsers refuse to autoplay video that carries
 *     an audio track even when muted); `+faststart` so playback starts
 *     before the file finishes loading.
 *   - No WebM. VP9 came out larger than H.264 on this footage (10.5 MB
 *     against 6.1 MB), and browsers take the WebM first, so it made the
 *     page heavier rather than lighter.
 *
 * Usage:
 *   FFMPEG=/path/to/ffmpeg node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]
 *
 * ffmpeg is NOT a dependency of this project: it is a 70MB binary that
 * every Vercel build would download for a script run once in a while.
 * Point FFMPEG at any copy, or have `ffmpeg` on PATH.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const [input, posterAt = "1"] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]');
  process.exit(1);
}

const ffmpeg = process.env.FFMPEG || "ffmpeg";
const crf = String(process.env.HERO_CRF || 30);
const outDir = path.join(process.cwd(), "public", "video");
mkdirSync(outDir, { recursive: true });

const ENCODES = [
  { file: "hero.mp4", width: 1280 },
  { file: "hero-1080.mp4", width: 1920 },
];
const poster = path.join(outDir, "hero-poster.jpg");

// Never upscale; keep the aspect ratio; even dimensions for the encoders.
const scale = (width) => `scale='min(${width},iw)':-2`;

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
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

for (const { file, width } of ENCODES) {
  console.log(`→ ${file} (H.264, ${width} wide, CRF ${crf})`);
  run([
    "-i", input, "-an",
    "-vf", `${scale(width)},format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-profile:v", "high",
    "-movflags", "+faststart",
    path.join(outDir, file),
  ]);
}

console.log(`→ hero-poster.jpg (frame at ${posterAt}s)`);
run(["-ss", posterAt, "-i", input, "-frames:v", "1", "-vf", scale(1280), "-q:v", "3", poster]);

console.log("");
for (const { file } of ENCODES) {
  const full = path.join(outDir, file);
  const bytes = statSync(full).size;
  const seconds = durationSeconds(full);
  const mbps = seconds > 0 ? (bytes * 8) / seconds / 1e6 : 0;
  console.log(`${file}  ${(bytes / 1024 / 1024).toFixed(2)} MB  ${mbps.toFixed(2)} Mbps`);
  if (mbps > 2) console.warn(`  Warning: ${file} is over 2 Mbps. Raise HERO_CRF before shipping it.`);
}
console.log(`hero-poster.jpg  ${(statSync(poster).size / 1024).toFixed(0)} KB`);
console.log(
  '\nhero.video in content/verticals/sponsors.ts:\n  { mp4: "/video/hero.mp4", mp4Large: "/video/hero-1080.mp4", poster: "/video/hero-poster.jpg" }',
);
