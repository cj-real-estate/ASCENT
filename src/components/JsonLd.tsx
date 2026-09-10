import type { Vertical } from "@content/verticals/types";
import { PERSON_ID, personProfileUrl } from "@/lib/schema";

/*
 * LocalBusiness structured data, rendered server-side as a single
 * application/ld+json script. ProfessionalService is a LocalBusiness
 * subtype, which fits a growth-systems firm better than the base type.
 *
 * The founder is named by the cross-domain @id from src/lib/schema.ts, so
 * the person on /caleb-free, the guide bylines on the sponsor domain and
 * this node all merge into one entity.
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
      ...(business.street ? { streetAddress: business.street } : {}),
      addressLocality: business.city,
      addressRegion: business.region,
      ...(business.postalCode ? { postalCode: business.postalCode } : {}),
      addressCountry: "US",
    },
  };

  if (business.phone !== null) data.telephone = business.phone;
  if (business.email !== null) data.email = business.email;
  /* The founder, by the same @id the authoritative profile page emits, so
   * this node and that page describe one person rather than two. */
  if (business.founder) {
    data.founder = {
      "@type": "Person",
      "@id": PERSON_ID,
      name: business.founder.name,
      jobTitle: business.founder.title,
      url: personProfileUrl,
    };
  }
  if (business.legalName) data.legalName = business.legalName;

  return <JsonLdData data={data} />;
}

/**
 * Any JSON-LD object (or @graph), rendered as one script. The sponsor
 * domain builds its graph in src/lib/schema.ts and renders it with this.
 */
export function JsonLdData({ data }: { data: object }) {
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
