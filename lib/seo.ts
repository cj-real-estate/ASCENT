import type { Metadata } from "next";
import type { Vertical } from "@/content/verticals/types";
import { SITE_NAME } from "./site";

export function verticalMetadata(vertical: Vertical): Metadata {
  const { title, description } = vertical.seo;
  return {
    title,
    description,
    alternates: { canonical: vertical.path },
    openGraph: {
      title,
      description,
      url: vertical.path,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
