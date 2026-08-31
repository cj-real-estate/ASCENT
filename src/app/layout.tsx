import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "./fonts";
import general from "@content/verticals/general";
import GoogleTag from "@/components/GoogleTag";
import "./globals.css";

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
