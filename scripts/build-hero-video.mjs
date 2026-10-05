#!/usr/bin/env node
/*
 * Turns the owner's hero footage (a .mov straight off a phone or an
 * editor) into the three files the sponsor hero plays:
 *
 *   public/video/hero.mp4         H.264 — plays in every browser
 *   public/video/hero.webm        VP9 — smaller, used where supported
 *   public/video/hero-poster.jpg  a still, shown before playback, to
 *                                 reduced-motion visitors, and wherever
 *                                 autoplay is blocked
 *
 * A .mov is never served directly: Safari plays QuickTime, Chrome and
 * Firefox mostly do not, so it would be a blank box for most visitors.
 *
 * Choices, all for a background behind a dark scrim rather than for
 * footage anyone studies:
 *   - Audio stripped. A background video is muted, and an audio track is
 *     bytes for nothing — and some browsers refuse to autoplay video that
 *     carries one even when muted.
 *   - 1280 wide and CRF 30 by default, never upscaled. Measured on the
 *     owner's 4K drone reel (2026-10-05): against 1920/CRF 26, the
 *     difference was barely visible scaled to a 1440px desktop and
 *     invisible under the hero's ~70% dark tint, at under a third of the
 *     bitrate (0.7 vs 2.6 Mbps). Override with HERO_WIDTH and HERO_CRF.
 *   - What matters is the BITRATE, not the file size: the browser streams
 *     the video as it plays, so a visitor who stays fifteen seconds pulls
 *     roughly fifteen seconds of it. The script warns above 1.5 Mbps.
 *   - `+faststart` so playback starts before the file finishes loading.
 *
 * Usage:
 *   FFMPEG=/path/to/ffmpeg node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]
 *
 * ffmpeg is NOT a dependency of this project: it is a 70MB binary that
 * every Vercel build would download for a script run once in a while.
 * Point FFMPEG at any copy, or have `ffmpeg` on PATH.
 *
 * Then set `hero.video` in content/verticals/sponsors.ts to the three
 * paths above.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";

const [input, posterAt = "1"] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node scripts/build-hero-video.mjs "Website Banner.mov" [posterSeconds]');
  process.exit(1);
}

const ffmpeg = process.env.FFMPEG || "ffmpeg";
const outDir = path.join(process.cwd(), "public", "video");
mkdirSync(outDir, { recursive: true });

const mp4 = path.join(outDir, "hero.mp4");
const webm = path.join(outDir, "hero.webm");
const poster = path.join(outDir, "hero-poster.jpg");

const width = Number(process.env.HERO_WIDTH || 1280);
const crf = String(process.env.HERO_CRF || 30);

// Never upscale; keep the aspect ratio; even dimensions for the encoders.
const scale = `scale='min(${width},iw)':-2`;

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

console.log("→ hero.mp4 (H.264)");
run([
  "-i", input, "-an",
  "-vf", `${scale},format=yuv420p`,
  "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-profile:v", "high",
  "-movflags", "+faststart",
  mp4,
]);

console.log("→ hero.webm (VP9)");
run([
  "-i", input, "-an",
  "-vf", scale,
  "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good",
  webm,
]);

console.log(`→ hero-poster.jpg (frame at ${posterAt}s)`);
run(["-ss", posterAt, "-i", input, "-frames:v", "1", "-vf", scale, "-q:v", "3", poster]);

const mb = (file) => (statSync(file).size / 1024 / 1024).toFixed(2);

/*
 * Browsers take the first source they can play, and the WebM is listed
 * first — so a WebM that came out LARGER than the MP4 makes the page
 * heavier for most visitors, not lighter. That happens with grainy or
 * high-motion footage. Keep it only when it saves real bytes.
 */
const keepWebm = statSync(webm).size < statSync(mp4).size * 0.9;
if (!keepWebm) {
  console.log(`\nhero.webm (${mb(webm)} MB) is not smaller than hero.mp4 (${mb(mp4)} MB) — removed.`);
  unlinkSync(webm);
}

console.log(
  `\nhero.mp4 ${mb(mp4)} MB · ${keepWebm ? `hero.webm ${mb(webm)} MB · ` : ""}hero-poster.jpg ${mb(poster)} MB`,
);
console.log(
  `\nSet hero.video in content/verticals/sponsors.ts to:\n  { mp4: "/video/hero.mp4", webm: ${
    keepWebm ? '"/video/hero.webm"' : "null"
  }, poster: "/video/hero-poster.jpg" }`,
);
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

const seconds = durationSeconds(mp4);
if (seconds > 0) {
  const mbps = (statSync(mp4).size * 8) / seconds / 1e6;
  console.log(`MP4 bitrate ${mbps.toFixed(2)} Mbps over ${seconds.toFixed(1)}s`);
  if (mbps > 1.5) {
    console.warn("Warning: over 1.5 Mbps. Raise HERO_CRF or lower HERO_WIDTH before shipping it.");
  }
}
