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
 *   - At most 1920 wide, never upscaled.
 *   - Quality set for "fine under a 70% dark tint", not for "pristine";
 *     the script warns if the result is still heavy.
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

// Never upscale; keep the aspect ratio; even dimensions for the encoders.
const scale = "scale='min(1920,iw)':-2";

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

console.log("→ hero.mp4 (H.264)");
run([
  "-i", input, "-an",
  "-vf", `${scale},format=yuv420p`,
  "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high",
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
if (statSync(mp4).size > 6 * 1024 * 1024) {
  console.warn(
    "Warning: the MP4 is over 6 MB. Trim the clip, or raise -crf, before shipping it — " +
      "it loads on every visit to the sponsor home page.",
  );
}
