"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The hero's background footage, built so it never costs the page speed.
 *
 *   1. The poster paints first, as a server-rendered <picture> — art
 *      directed (a portrait crop on phones, landscape elsewhere) and served
 *      as AVIF, then WebP, then JPEG. It is the largest thing in the first
 *      screen, so it is fetched at high priority: that is what makes the
 *      hero appear fast.
 *   2. The <video> is not in the server HTML at all. It mounts after the
 *      page is interactive, so it never competes with the page's own
 *      loading, and it never mounts for visitors who have asked for reduced
 *      motion or Data Saver — they keep the poster and download nothing
 *      more.
 *   3. It fades in over the poster once its first frame is actually
 *      playing, so there is no flash of black while it starts.
 *   4. Off-screen it pauses.
 *
 * Which file plays is the browser's choice, from the screen size and what
 * it can decode — the first <source> that fits wins:
 *
 *   640px and up  AV1 → HEVC → H.264, 1920x1080
 *   below 640px   HEVC → H.264, 768x1280 portrait crop of the centre
 *
 * The reasons and the measurements behind those choices are in
 * scripts/build-hero-video.mjs, which makes every file named below.
 *
 * No on-screen pause control, at the owner's request (2026-10-05).
 */

/** Phones get the portrait crop; this is where the landscape files take over. */
const LANDSCAPE_MEDIA = "(min-width: 640px)";
const PORTRAIT_MEDIA = "(max-width: 639px)";

/* Codec strings let a browser skip a file it cannot decode without
 * fetching it. They match the levels the script encodes at: AV1 Main
 * level 4.0, HEVC Main level 4.0, H.264 High level 4.0. */
const AV1 = 'video/mp4; codecs="av01.0.08M.08"';
const HEVC = 'video/mp4; codecs="hvc1.1.6.L120.90"';
const H264 = 'video/mp4; codecs="avc1.640028"';

/** Every URL, from one base path. Must match scripts/build-hero-video.mjs. */
export function heroVideoFiles(basePath: string) {
  const poster = (shape: "landscape" | "portrait") => ({
    avif: `${basePath}-poster-${shape}.avif`,
    webp: `${basePath}-poster-${shape}.webp`,
    jpg: `${basePath}-poster-${shape}.jpg`,
  });
  return {
    landscape: {
      av1: `${basePath}-1080.av1.mp4`,
      hevc: `${basePath}-1080.hevc.mp4`,
      h264: `${basePath}-1080.mp4`,
    },
    phone: {
      hevc: `${basePath}-phone.hevc.mp4`,
      h264: `${basePath}-phone.mp4`,
    },
    poster: { landscape: poster("landscape"), portrait: poster("portrait") },
  };
}

export default function HeroVideo({ basePath }: { basePath: string }) {
  const files = heroVideoFiles(basePath);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [inView, setInView] = useState(true);
  const [shown, setShown] = useState(false);

  // Whether this visitor wants motion at all, kept live if they change it.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    const update = () => setMotionOk(!query.matches && !saveData);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Pause while scrolled out of view. Watches the poster, which is always
  // mounted and covers exactly the same box as the video.
  useEffect(() => {
    const el = posterRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (motionOk && inView) {
      el.muted = true;
      // A blocked play() (Low Power Mode, a strict browser) simply leaves
      // the poster showing.
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [motionOk, inView]);

  const fill = "pointer-events-none absolute inset-0 h-full w-full object-cover";
  /*
   * The video's box is 2px shorter than the poster's, on purpose. Chrome
   * reports a new Largest Contentful Paint only for an element strictly
   * bigger than the last, and sub-pixel rounding made the video 1px taller
   * than the poster — so its first frame, painted after hydration and a
   * network fetch, replaced the poster as the LCP and made the page measure
   * slower than it is. Shorter by 2px, the poster stays the LCP. The
   * missing pixel rows sit under the header rule and the bottom fade, where
   * nobody can see them.
   */
  const videoFill = "pointer-events-none absolute inset-x-0 top-px h-[calc(100%-2px)] w-full object-cover";

  return (
    <>
      <picture>
        <source media={PORTRAIT_MEDIA} type="image/avif" srcSet={files.poster.portrait.avif} />
        <source media={PORTRAIT_MEDIA} type="image/webp" srcSet={files.poster.portrait.webp} />
        <source media={PORTRAIT_MEDIA} srcSet={files.poster.portrait.jpg} />
        <source type="image/avif" srcSet={files.poster.landscape.avif} />
        <source type="image/webp" srcSet={files.poster.landscape.webp} />
        {/* A plain <img>, not next/image: the art direction above needs
            <picture>, and the files are already sized and encoded. */}
        <img
          ref={posterRef}
          src={files.poster.landscape.jpg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className={fill}
        />
      </picture>

      {motionOk ? (
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setShown(true)}
          className={`${videoFill} transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}
        >
          <source media={LANDSCAPE_MEDIA} type={AV1} src={files.landscape.av1} />
          <source media={LANDSCAPE_MEDIA} type={HEVC} src={files.landscape.hevc} />
          <source media={LANDSCAPE_MEDIA} type={H264} src={files.landscape.h264} />
          <source type={HEVC} src={files.phone.hevc} />
          <source type={H264} src={files.phone.h264} />
        </video>
      ) : null}
    </>
  );
}
