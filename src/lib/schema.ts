import type { SponsorPageContent, Vertical } from "@content/verticals/types";
import type { Guide } from "@content/guides/types";
import { plainText } from "@/components/sponsor/RichText";

/*
 * Structured data for the sponsor domain, as one @graph per page.
 *
 * The Organization, its founder and the WebSite carry stable @ids, so the
 * sponsor page, the guides index and every guide all point at the same
 * entity — that consistency is what lets a search or answer engine treat
 * "Ascent Client Acquisition Systems" as one thing across the site.
 *
 * Rules kept here, deliberately:
 *   - No aggregateRating, no Review, no price: there are no published
 *     reviews, and pricing is quoted after the call.
 *   - Every FAQPage answer is the visible answer on the page, verbatim.
 *   - sameAs is whatever the content module lists — never a guessed URL.
 */

const site = (v: Vertical) => v.business.url;
const orgId = (v: Vertical) => `${site(v)}/#organization`;
const founderId = (v: Vertical) => `${site(v)}/#founder`;
const websiteId = (v: Vertical) => `${site(v)}/#website`;

function organization(v: Vertical, page: SponsorPageContent) {
  const { business } = v;
  const org: Record<string, unknown> = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(v),
    name: business.name,
    legalName: business.legalName ?? business.name,
    alternateName: business.shortName,
    url: site(v),
    logo: {
      "@type": "ImageObject",
      url: `${site(v)}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: `${site(v)}${v.seo.ogImage ?? "/og-image.png"}`,
    description: page.glance.definition,
    slogan: v.footer.tagline,
    areaServed: { "@type": "Country", name: business.areaServed },
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: "US",
    },
    knowsAbout: [
      "Investor acquisition for real estate syndications and private real estate funds",
      "Regulation D Rule 506(c) general solicitation",
      "Accredited investor lead generation on LinkedIn, Meta and Google",
      "Investor lead response and appointment setting",
      "Cost per appointment held",
    ],
  };
  if (business.founder) org.founder = { "@id": founderId(v) };
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

function founder(v: Vertical) {
  const { business } = v;
  if (!business.founder) return null;
  return {
    "@type": "Person",
    "@id": founderId(v),
    name: business.founder.name,
    jobTitle: business.founder.title,
    worksFor: { "@id": orgId(v) },
    url: site(v),
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
  const graph: unknown[] = [organization(v, page), founder(v), website(v)].filter(Boolean);
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
      organization(v, page),
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

  const graph: unknown[] = [organization(v, page), founder(v), website(v)].filter(Boolean);
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
    author: v.business.founder ? { "@id": founderId(v) } : { "@id": orgId(v) },
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
