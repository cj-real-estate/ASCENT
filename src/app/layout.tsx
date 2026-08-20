import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "./fonts";
import vertical from "@content/verticals/fence";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(vertical.business.url),
  title: vertical.seo.title,
  description: vertical.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: vertical.seo.title,
    description: vertical.seo.description,
    url: "/",
    siteName: vertical.business.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: vertical.business.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: vertical.seo.title,
    description: vertical.seo.description,
    images: ["/og-image.png"],
  },
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
