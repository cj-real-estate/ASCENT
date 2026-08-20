import localFont from "next/font/local";

/*
 * Self-hosted per the handoff — no runtime requests to Google. Latin subsets
 * only; ~90KB total. next/font's automatic metric fallbacks prevent layout
 * shift on font load.
 */

export const archivo = localFont({
  src: "./fonts/archivo-800-latin.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
});

export const plexSans = localFont({
  // Static instances rather than the 46KB variable font: the 400 cut is the
  // body face the LCP text swaps to, so its bytes gate LCP directly.
  src: [
    { path: "./fonts/ibm-plex-sans-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-600-latin.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-plex-sans",
});

export const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-500-latin.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-mono-600-latin.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-plex-mono",
});
