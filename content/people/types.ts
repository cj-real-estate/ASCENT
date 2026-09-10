/*
 * A person's authoritative profile page.
 *
 * There is one of these — Caleb Free — and it exists so that a single URL
 * is the definitive answer to "who is Caleb Free": for a person reading,
 * for Google, and for an answer engine that has to decide whether the
 * Caleb Free running Ascent is the same Caleb Free it saw somewhere else.
 * That job has two requirements the rest of the site does not have:
 *
 *   - Every fact is current and checkable. A stale claim on the one page
 *     that is supposed to disambiguate an entity is worse than no page.
 *   - `sameAs` carries the person's OWN profile URLs, and only real ones.
 *     Guessing a LinkedIn URL is how you tie the entity to a stranger, so
 *     an empty list renders nothing and emits nothing rather than a guess.
 *     The same rule as `business.sameAs` in the verticals.
 *
 * Rendered by src/app/caleb-free/page.tsx and turned into ProfilePage +
 * Person structured data by personProfileGraph() in src/lib/schema.ts.
 */

export interface ProfileLink {
  /** Where it points. Must be the person's own profile. */
  url: string;
  /** The platform, as a reader would name it — "LinkedIn". */
  label: string;
  /** Optional handle or profile name, shown beside the label. */
  handle?: string;
}

export interface PersonProfile {
  /** Route this page is served at, on the brand domain. */
  path: string;
  /** Full name, as it should be indexed. */
  name: string;
  /** Primary role, e.g. "Founder". Used in the <title>. */
  jobTitle: string;
  /**
   * The registered role, only where it differs from the title the person
   * actually uses — e.g. "Managing Member" against a working "Founder".
   * null when the two are the same, which is the usual case.
   */
  legalRole: string | null;
  seoTitle: string;
  seoDescription: string;
  /** Mono line above the h1. */
  eyebrow: string;
  /** One line under the h1 — role, company, place. */
  tagline: string;
  /**
   * The definitive paragraph. Written to stand alone as the answer to
   * "who is Caleb Free", because it is the text an answer engine lifts.
   * No marketing voice; facts in plain order.
   */
  summary: string;
  /** Label/value facts. Each one checkable. */
  facts: { label: string; value: string }[];
  /** Longer-form biography, in order. */
  bio: { h2: string; paragraphs: string[] }[];
  /**
   * Published, attributed results. Same discipline as the rest of the
   * site: a figure appears only with the named client and the window it
   * came from, and `attribution` says so on the page.
   */
  trackRecord: {
    h2: string;
    intro: string;
    stats: { number: string; label: string }[];
    attribution: string;
  } | null;
  /** The businesses he currently runs, linked. */
  ventures: {
    h2: string;
    items: { name: string; url: string | null; role: string; body: string }[];
  };
  /**
   * His own profile URLs. EMPTY until he supplies them — never guess one.
   * Non-empty renders the section and fills `sameAs` in the JSON-LD.
   */
  profiles: {
    h2: string;
    intro: string;
    links: ProfileLink[];
  };
  /**
   * Independent coverage of him — third-party articles ABOUT this person.
   * Distinct from `profiles`: a profile is another page of his own, while
   * this is someone else writing about him, which is what a search or
   * answer engine treats as corroboration rather than self-description.
   * Becomes `subjectOf` on the Person. null omits the section.
   */
  press: {
    h2: string;
    intro: string;
    items: {
      /** The headline, as published. */
      title: string;
      publisher: string;
      /** ISO date of publication. */
      date: string;
      url: string;
      /** One line on what it covers, in the site's own words. */
      note: string;
    }[];
  } | null;

  /**
   * A real photograph of him, in the three shapes the page needs. null
   * omits the image everywhere — a stock photo of someone else would
   * defeat the point of the page, so there is no placeholder.
   */
  image: {
    /** Describes the photograph, not the person's job. */
    alt: string;
    /** Portrait, rendered beside the h1. */
    page: { src: string; width: number; height: number };
    /** Square and high-resolution — the Person `image` in the JSON-LD. */
    square: { src: string; width: number; height: number };
    /** 1200×630 social card: the headshot beside the wordmark, on ink. */
    og: string;
  } | null;
  /** ISO dates. `updated` drives the sitemap lastmod and dateModified. */
  published: string;
  updated: string;
}
