import type { Metadata } from "next";
import type { Vertical } from "@content/verticals/types";

/** Absolute canonical URL for a vertical, on whichever host it belongs to. */
export function verticalUrl(vertical: Vertical): string {
  if (vertical.canonicalUrl) return vertical.canonicalUrl;
  return `${vertical.business.url}${vertical.path === "/" ? "" : vertical.path}`;
}

/*
 * Per-page metadata. Each vertical canonicalises to its own URL, so the
 * brand page and the vertical pages never compete for the same canonical.
 * A vertical that is the root of its own domain canonicalises there
 * (absolute), whichever host actually served the request.
 */
export function verticalMetadata(vertical: Vertical): Metadata {
  const { seo, business } = vertical;
  const url = verticalUrl(vertical);
  const ogImage = `${new URL(url).origin}${seo.ogImage ?? "/og-image.png"}`;
  return {
    /*
     * `absolute` — every vertical's seo.title already ends in the brand
     * name, and the root layout's "%s | Ascent" template applies to pages
     * in child segments (so /fence but not /), which appended it a second
     * time on the vertical pages only. Owning the whole title here makes
     * the two behave the same and keeps the keyword first, where it earns
     * the click.
     */
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: business.name,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: business.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}
