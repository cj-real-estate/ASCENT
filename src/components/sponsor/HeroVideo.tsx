"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The hero's background footage.
 *
 * Decorative only — the h1 and the CTAs carry the page — so the video is
 * hidden from assistive technology and never takes focus. Everything about
 * how it plays follows from that:
 *
 *   - No `autoPlay` attribute. Autoplay starts before hydration, before
 *     anything can check whether this visitor wants motion. Playback is
 *     started here instead, and only when it should be.
 *   - Reduced motion: anyone whose system asks for it gets the poster frame
 *     and never downloads the footage (`preload="metadata"` fetches headers
 *     only). The same for Data Saver.
 *   - A pause control. Moving content that loops for more than five seconds
 *     beside other content needs a way to stop it (WCAG 2.2.2), and a
 *     background video is exactly that. The choice holds for the visit.
 *   - Off-screen it pauses, so it does not spend a laptop's battery behind a
 *     page the visitor has scrolled past.
 *   - `muted` is set on the element in script as well as in markup, because
 *     React does not reliably put the attribute into server HTML, and a
 *     browser will only start unmuted video from a user gesture.
 *
 * The scrims that keep the text readable are not in here — they are part of
 * the hero layout in SponsorPage.tsx, so they render with or without
 * JavaScript.
 */

export interface HeroVideoSource {
  mp4: string;
  webm: string | null;
  poster: string;
}

export default function HeroVideo({ video }: { video: HeroVideoSource }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [playing, setPlaying] = useState(false);

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

  // Pause while scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motionOk && inView && !userPaused) {
      el.muted = true;
      // A blocked play() (Low Power Mode, a strict browser) leaves the
      // poster showing, which is the right fallback.
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [motionOk, inView, userPaused]);

  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        tabIndex={-1}
        muted
        loop
        playsInline
        preload="metadata"
        poster={video.poster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      >
        {video.webm ? <source src={video.webm} type="video/webm" /> : null}
        <source src={video.mp4} type="video/mp4" />
      </video>

      {/* Only offered when the video can play at all — with reduced motion
          there is nothing to pause. */}
      {motionOk ? (
        <button
          type="button"
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            if (playing) {
              setUserPaused(true);
            } else {
              // A tap is a user gesture, so this play() succeeds even where
              // autoplay was refused (Low Power Mode, strict browsers).
              setUserPaused(false);
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute bottom-3 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-night/60 text-paper backdrop-blur transition-colors hover:border-white/45 md:bottom-5 md:right-6"
        >
          <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            {playing ? (
              <path d="M3 1.5h2.5v11H3zM8.5 1.5H11v11H8.5z" />
            ) : (
              <path d="M3.5 1.5 12 7l-8.5 5.5z" />
            )}
          </svg>
        </button>
      ) : null}
    </>
  );
}
