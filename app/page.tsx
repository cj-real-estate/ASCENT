import { general } from "@/content/verticals";
import { VerticalPage } from "@/components/VerticalPage";
import { verticalMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = verticalMetadata(general);

/*
 * LocalBusiness structured data for the brand. No aggregateRating — there
 * are no reviews, and fabricating structured data is a Google violation and
 * off-brand. Add `telephone` when the client supplies the number.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: general.seo.description,
  url: SITE_URL,
  areaServed: "Oklahoma",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oklahoma City",
    addressRegion: "OK",
    addressCountry: "US",
  },
};

export default function GeneralLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerticalPage vertical={general} />
    </>
  );
}
