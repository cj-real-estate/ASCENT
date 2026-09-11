import type { SponsorPageContent, Vertical } from "@content/verticals/types";
import type { Guide } from "@content/guides/types";
import type { PersonProfile } from "@content/people/types";
import { plainText } from "@/components/sponsor/RichText";

/*
 * Structured data for the sponsor domain, as one @graph per page.
 *
 * The Organization, its founder and the WebSite carry stable @ids, so the
 * sponsor page, the guides index and every guide all point at the same
 * entity — that consistency is what lets a search or answer engine treat
 * "Ascent" as one thing across the site.
 *
 * Rules kept here, deliberately:
 *   - No aggregateRating, no Review, no price: there are no published
 *     reviews, and pricing is quoted after the call.
 *   - Every FAQPage answer is the visible answer on the page, verbatim.
 *   - sameAs is whatever the content module lists — never a guessed URL.
 */

const site = (v: Vertical) => v.business.url;
const orgId = (v: Vertical) => `${site(v)}/#organization`;
const websiteId = (v: Vertical) => `${site(v)}/#website`;

function organization(
  v: Vertical,
  description: string,
  /*
   * Omit the postal address. Used only by the founder's profile page: the
   * registered address is published where it is actually needed — both
   * footers, /privacy and /terms, for A2P 10DLC brand registration — and
   * the owner asked for it to stay off the page about him, including its
   * source. The Organization is fully described on the other pages that
   * carry this same @id, so nothing is lost.
   */
  options: { omitAddress?: boolean } = {},
) {
  const { business } = v;
  const org: Record<string, unknown> = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(v),
    name: business.name,
    legalName: business.legalName ?? business.name,
    /*
     * The pre-v3 display name, which is still what the domain, the A2P
     * registration and a good deal of existing search demand spell out.
     * Declaring it as an alternate is how the short brand name and the
     * long one resolve to one entity instead of two.
     */
    ...(business.legalName
      ? { alternateName: business.legalName.replace(/\s+LLC$/, "") }
      : {}),
    url: site(v),
    logo: {
      "@type": "ImageObject",
      url: `${site(v)}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: `${site(v)}${v.seo.ogImage ?? "/og-image.png"}`,
    description,
    slogan: v.footer.tagline,
    areaServed: { "@type": "Country", name: business.areaServed },
    ...(options.omitAddress
      ? {}
      : {
          address: {
            "@type": "PostalAddress",
            ...(business.street ? { streetAddress: business.street } : {}),
            addressLocality: business.city,
            addressRegion: business.region,
            ...(business.postalCode ? { postalCode: business.postalCode } : {}),
            addressCountry: "US",
          },
        }),
    knowsAbout: [
      "Investor acquisition for real estate syndications and private real estate funds",
      "Regulation D Rule 506(c) general solicitation",
      "Accredited investor lead generation on LinkedIn, Meta and Google",
      "Investor lead response and appointment setting",
      "Cost per appointment held",
    ],
  };
  if (business.founder) org.founder = { "@id": PERSON_ID };
  if (business.phone || business.email) {
    org.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(business.phone ? { telephone: business.phone } : {}),
      ...(business.email ? { email: business.email } : {}),
      areaServed: "US",
      availableLanguage: "en",
    };
  }
  if (business.sameAs && business.sameAs.length > 0) org.sameAs = business.sameAs;
  return org;
}

/*
 * The person's canonical identity, and it is deliberately NOT on the
 * sponsor domain: there is one authoritative page about Caleb Free, at
 * ascentcas.com/caleb-free, and every mention of him in either domain's
 * graph points at that same @id. That is what lets a search or answer
 * engine merge "the founder of Ascent" on this site, the guide bylines on
 * the sponsor site, and the profile page into one entity rather than
 * three.
 *
 * BRAND_SITE is hard-coded rather than derived from the vertical because
 * the id must not change with whichever host served the request — an @id
 * that moves is two entities.
 */
const BRAND_SITE = "https://ascentcas.com";
export const PERSON_ID = `${BRAND_SITE}/caleb-free#person`;
export const personProfileUrl = `${BRAND_SITE}/caleb-free`;

function founder(v: Vertical) {
  const { business } = v;
  if (!business.founder) return null;
  return {
    "@type": "Person",
    /* The same id the profile page emits, so this node and that one are
     * understood as one person. */
    "@id": PERSON_ID,
    name: business.founder.name,
    jobTitle: business.founder.title,
    worksFor: { "@id": orgId(v) },
    /* Points at the authoritative page, not at whichever site this is. */
    url: personProfileUrl,
    mainEntityOfPage: personProfileUrl,
  };
}

function website(v: Vertical) {
  return {
    "@type": "WebSite",
    "@id": websiteId(v),
    url: site(v),
    name: v.business.name,
    publisher: { "@id": orgId(v) },
    inLanguage: "en-US",
  };
}

function faqPage(id: string, items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: plainText(item.a) },
    })),
  };
}

function breadcrumbs(v: Vertical, trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site(v)}${t.path}`,
    })),
  };
}

/** The sponsor page: Organization, founder, WebSite, WebPage, Service, FAQPage. */
export function sponsorPageGraph(v: Vertical, page: SponsorPageContent, updated: string) {
  const url = site(v);
  const graph: unknown[] = [organization(v, page.glance.definition), founder(v), website(v)].filter(Boolean);
  graph.push({
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name: v.seo.title,
    description: v.seo.description,
    isPartOf: { "@id": websiteId(v) },
    about: { "@id": orgId(v) },
    primaryImageOfPage: `${url}${v.seo.ogImage ?? "/og-image.png"}`,
    dateModified: updated,
    inLanguage: "en-US",
  });
  graph.push({
    "@type": "Service",
    "@id": `${url}/#service`,
    name: "Investor acquisition for 506(c) real estate sponsors",
    serviceType: "Investor acquisition",
    description: page.hero.sub,
    provider: { "@id": orgId(v) },
    areaServed: { "@type": "Country", name: v.business.areaServed },
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Real estate syndicators and private real estate fund sponsors raising under Rule 506(c) or Regulation A+",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: page.included.h2,
      itemListElement: page.included.cards.map((c) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: c.title,
          description: c.bullets.join(" "),
        },
      })),
    },
    termsOfService: `${url}/#included`,
  });
  if (v.faq) graph.push(faqPage(`${url}/#faq`, v.faq.items));
  return { "@context": "https://schema.org", "@graph": graph };
}

/** The guides index: CollectionPage listing every guide. */
export function guidesIndexGraph(v: Vertical, page: SponsorPageContent, guides: Guide[], updated: string) {
  const url = `${site(v)}/guides`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(v, page.glance.definition),
      founder(v),
      website(v),
      {
        "@type": "CollectionPage",
        "@id": `${url}/#webpage`,
        url,
        name: page.guides.h2,
        description: page.guides.sub,
        isPartOf: { "@id": websiteId(v) },
        dateModified: updated,
        inLanguage: "en-US",
        hasPart: guides.map((g) => ({
          "@type": "Article",
          "@id": `${site(v)}/guides/${g.slug}/#article`,
          headline: g.title,
          url: `${site(v)}/guides/${g.slug}`,
        })),
      },
      breadcrumbs(v, [
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
    ].filter(Boolean),
  };
}

/** One guide: Article, BreadcrumbList, FAQPage, and a DefinedTermSet for the glossary. */
export function guideGraph(v: Vertical, page: SponsorPageContent, guide: Guide) {
  const url = `${site(v)}/guides/${guide.slug}`;
  const words = [
    guide.answer,
    ...guide.takeaways,
    ...guide.sections.flatMap((s) => [
      s.h2,
      ...s.blocks.map((b) => {
        if (b.type === "ul" || b.type === "ol") return b.items.join(" ");
        if (b.type === "table") return [b.head.join(" "), ...b.rows.map((r) => r.join(" "))].join(" ");
        if (b.type === "callout") return `${b.title} ${b.text}`;
        return b.text;
      }),
    ]),
    ...guide.faq.flatMap((f) => [f.q, f.a]),
  ]
    .map(plainText)
    .join(" ")
    .split(/\s+/).length;

  const graph: unknown[] = [organization(v, page.glance.definition), founder(v), website(v)].filter(Boolean);
  graph.push({
    "@type": "Article",
    "@id": `${url}/#article`,
    headline: guide.title,
    alternativeHeadline: guide.seoTitle,
    description: guide.description,
    abstract: guide.answer,
    articleSection: guide.eyebrow,
    url,
    mainEntityOfPage: url,
    isPartOf: { "@id": websiteId(v) },
    datePublished: guide.published,
    dateModified: guide.updated,
    author: v.business.founder ? { "@id": PERSON_ID } : { "@id": orgId(v) },
    publisher: { "@id": orgId(v) },
    image: {
      "@type": "ImageObject",
      url: `${site(v)}${guide.image.src}`,
      width: 960,
      height: 540,
      caption: guide.image.alt,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    wordCount: words,
    citation: guide.sources.filter((s) => s.url).map((s) => s.url),
  });
  graph.push(
    breadcrumbs(v, [
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: guide.title, path: `/guides/${guide.slug}` },
    ]),
  );
  if (guide.faq.length > 0) graph.push(faqPage(`${url}/#faq`, guide.faq));

  // The glossary: every h3 followed by a paragraph is a defined term.
  if (guide.slug === "investor-acquisition-glossary") {
    const terms: { name: string; description: string }[] = [];
    for (const section of guide.sections) {
      section.blocks.forEach((b, i) => {
        const next = section.blocks[i + 1];
        if (b.type === "h3" && next && next.type === "p") {
          terms.push({ name: b.text, description: plainText(next.text) });
        }
      });
    }
    graph.push({
      "@type": "DefinedTermSet",
      "@id": `${url}/#terms`,
      name: guide.title,
      hasDefinedTerm: terms.map((t) => ({
        "@type": "DefinedTerm",
        name: t.name,
        description: t.description,
        inDefinedTermSet: `${url}/#terms`,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/*
 * The authoritative profile page: ProfilePage wrapping a Person.
 *
 * ProfilePage is the type Google documents for a page about one person or
 * organisation, and `mainEntity` is what says which one — so the Person
 * node carries the whole identity (name, description, job title, the
 * employer by reference, and `sameAs` for the profiles that are actually
 * his) rather than leaving an engine to infer it from prose.
 *
 * Nothing optional is invented. `sameAs` and `image` are emitted only when
 * the content module actually has them: an empty sameAs is not a signal,
 * and a wrong one is a bad signal.
 */
export function personProfileGraph(v: Vertical, person: PersonProfile) {
  const url = `${BRAND_SITE}${person.path}`;
  const sameAs = person.profiles.links.map((link) => link.url);

  const personNode: Record<string, unknown> = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    givenName: "Caleb",
    familyName: "Free",
    description: person.summary,
    jobTitle: person.legalRole ?? person.jobTitle,
    url,
    mainEntityOfPage: url,
    worksFor: { "@id": orgId(v) },
    /* He founded it as well as works for it — both, because they answer
     * different questions an engine asks. */
    /* City and region only — never a street address on a person. */
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.business.city,
        addressRegion: v.business.region,
        addressCountry: "US",
      },
    },
    knowsAbout: [
      "Client acquisition systems",
      "Paid media on Meta, Google and LinkedIn",
      "Lead response and appointment setting",
      "Investor acquisition for Regulation D Rule 506(c) real estate offerings",
      "Real estate operations",
    ],
    knowsLanguage: "en-US",
  };
  if (sameAs.length > 0) personNode.sameAs = sameAs;
  /* Independent coverage, as `subjectOf`. Self-description is what every
   * profile page has; a named third-party publisher writing about him is
   * the part an engine can corroborate, so it is stated explicitly rather
   * than left as a link in the prose. */
  if (person.press && person.press.items.length > 0) {
    personNode.subjectOf = person.press.items.map((item) => ({
      "@type": "NewsArticle",
      headline: item.title,
      url: item.url,
      datePublished: item.date,
      publisher: { "@type": "Organization", name: item.publisher },
      about: { "@id": PERSON_ID },
    }));
  }
  if (person.image) {
    /* The square, high-resolution variant: Google's profile-page guidance
     * asks for a large image, and a square crop survives every thumbnail
     * shape an engine might render it at. */
    personNode.image = {
      "@type": "ImageObject",
      url: `${BRAND_SITE}${person.image.square.src}`,
      width: person.image.square.width,
      height: person.image.square.height,
      caption: person.image.alt,
    };
  }
  if (v.business.email) personNode.email = v.business.email;
  if (v.business.phone) personNode.telephone = v.business.phone;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}/#webpage`,
        url,
        name: person.seoTitle,
        description: person.seoDescription,
        /* The whole point of the page, declared. */
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
        isPartOf: { "@id": websiteId(v) },
        ...(person.image
          ? { primaryImageOfPage: `${BRAND_SITE}${person.image.og}` }
          : {}),
        dateCreated: person.published,
        datePublished: person.published,
        dateModified: person.updated,
        inLanguage: "en-US",
      },
      personNode,
      organization(v, v.seo.description, { omitAddress: true }),
      website(v),
      breadcrumbs(v, [
        { name: "Home", path: "/" },
        { name: person.name, path: person.path },
      ]),
    ],
  };
}
