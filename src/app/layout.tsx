import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "./fonts";
import general from "@content/verticals/general";
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
    <html lang="en">
      <body
        className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} bg-paper text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
