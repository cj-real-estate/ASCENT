import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "./fonts";
import general from "@content/verticals/general";
import GoogleTag from "@/components/GoogleTag";
import { readEnv } from "@/lib/env";
import "./globals.css";

/*
 * Search Console / Bing Webmaster ownership tokens, from the environment
 * so nobody has to edit code to verify a property. Comma-separated lists,
 * because the two domains are two properties with two tokens each:
 *   GOOGLE_SITE_VERIFICATION=token-for-ascentcas,token-for-sponsors
 *   BING_SITE_VERIFICATION=token-for-ascentcas,token-for-sponsors
 * Unset means no tag is rendered. Set-up steps: SEO-GEO-PLAYBOOK.md.
 */
const tokens = (name: string) =>
  readEnv(name)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
const google = tokens("GOOGLE_SITE_VERIFICATION");
const bing = tokens("BING_SITE_VERIFICATION");

/*
 * Site-wide metadata only. Title, description, canonical, and OG/Twitter
 * are set per route (see src/lib/metadata.ts) so "/" and "/fence" don't
 * compete for the same canonical.
 */
export const metadata: Metadata = {
  metadataBase: new URL(general.business.url),
  title: {
    default: general.seo.title,
    template: `%s | ${general.business.shortName}`,
  },
  description: general.seo.description,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon-180.png", sizes: "180x180" }],
  },
  // Let search and answer engines quote the page in full — the default
  // snippet limits would truncate the FAQ answers and the guides' direct
  // answers, which are written to be lifted whole.
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  ...(google.length || bing.length
    ? {
        verification: {
          ...(google.length ? { google } : {}),
          ...(bing.length ? { other: { "msvalidate.01": bing } } : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variable classes MUST live on <html>, not <body>: the theme
    // maps --font-sans etc. via var(--font-plex-sans) on :root, and a var()
    // that is undefined where it's referenced invalidates the whole chain —
    // every font-family then silently falls back to the metric-matched
    // system faces.
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-paper text-ink antialiased">
        {children}
        <GoogleTag />
      </body>
    </html>
  );
}
