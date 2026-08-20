import type { Vertical } from "@content/verticals/types";

/*
 * LocalBusiness structured data, rendered server-side as a single
 * application/ld+json script. ProfessionalService is a LocalBusiness
 * subtype, which fits a growth-systems firm better than the base type.
 *
 * telephone/email are OMITTED entirely while business.phone/business.email
 * are null — placeholder strings must never reach structured data. No
 * aggregateRating, no review: there are no published reviews, and
 * fabricating rating markup is a Google policy violation.
 */
export default function JsonLd({ vertical }: { vertical: Vertical }) {
  const { business, seo } = vertical;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: business.name,
    description: seo.description,
    url: business.url,
    areaServed: business.areaServed,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
    },
  };

  if (business.phone !== null) data.telephone = business.phone;
  if (business.email !== null) data.email = business.email;

  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value can never close the script tag / open a new one.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
