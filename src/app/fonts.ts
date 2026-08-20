import localFont from "next/font/local";

/*
 * Self-hosted per the brief (§3): no runtime request to Google's CDN.
 * Latin subsets only — the site is English. next/font's automatic
 * fallback adjustment gives metric-matched Arial fallbacks (no CLS).
 */

export const archivo = localFont({
  src: "../fonts/archivo-800.woff2",
  weight: "800",
  display: "swap",
  variable: "--font-archivo",
});

export const plexSans = localFont({
  src: [
    { path: "../fonts/plex-sans-400.woff2", weight: "400" },
    { path: "../fonts/plex-sans-600.woff2", weight: "600" },
  ],
  display: "swap",
  variable: "--font-plex-sans",
});

export const plexMono = localFont({
  src: "../fonts/plex-mono-500.woff2",
  weight: "500",
  display: "swap",
  variable: "--font-plex-mono",
});
