"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The hero's background footage.
 *
 * Decorative only — the h1 and the CTAs carry the page — so the video is
 * hidden from assistive technology and never takes focus. How it plays
 * follows from that:
 *
 *   - Two encodings, picked by the browser from the screen size: a sharper
 *     1920-wide file from 1024px up, where the brightened right side shows
 *     the footage at size, and a 1280-wide one below that at half the
 *     bitrate. `media` on <source> is honoured by every current browser; an
 *     old one that ignores it simply takes the first (sharper) file.
 *   - No `autoPlay` attribute. Autoplay starts before hydration, before
 *     anything can check whether this visitor wants motion. Playback is
 *     started here instead, and only when it should be.
 *   - Reduced motion: anyone whose system asks for it gets the poster frame
 *     and never downloads the footage (`preload="metadata"` fetches headers
 *     only). The same for Data Saver.
 *   - Off-screen it pauses, so it does not spend a laptop's battery behind a
 *     page the visitor has scrolled past.
 *   - No on-screen pause control, at the owner's request (2026-10-05). The
 *     reduced-motion path above is what stops the footage for the visitors
 *     who have asked for that.
 *   - `muted` is set on the element in script as well as in markup, because
 *     React does not reliably put the attribute into server HTML, and a
 *     browser will only start unmuted video from a user gesture.
 *
 * The scrim that keeps the text readable is not in here — it is part of the
 * hero layout in SponsorPage.tsx, so it renders with or without JavaScript.
 */

export interface HeroVideoSource {
  /** 1280 wide — phones and tablets. */
  mp4: string;
  /** 1920 wide — screens 1024px and up. null serves `mp4` everywhere. */
  mp4Large: string | null;
  poster: string;
}

/** Where the sharper encoding takes over. Matches Tailwind's `lg`. */
const LARGE_MEDIA = "(min-width: 1024px)";

export default function HeroVideo({ video }: { video: HeroVideoSource }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [inView, setInView] = useState(true);

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
    if (motionOk && inView) {
      el.muted = true;
      // A blocked play() (Low Power Mode, a strict browser) leaves the
      // poster showing, which is the right fallback.
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [motionOk, inView]);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="metadata"
      poster={video.poster}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    >
      {video.mp4Large ? <source src={video.mp4Large} type="video/mp4" media={LARGE_MEDIA} /> : null}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
