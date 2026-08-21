import type { Metadata } from "next";
import type { Vertical } from "@content/verticals/types";

/*
 * Per-page metadata. Each vertical canonicalises to its own path, so the
 * brand page and the vertical page never compete for the same canonical.
 */
export function verticalMetadata(vertical: Vertical): Metadata {
  const { seo, business, path } = vertical;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      siteName: business.name,
      type: "website",
      locale: "en_US",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: business.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og-image.png"],
    },
  };
}
