/*
 * Long-form guides on ascentforsponsors.com — the search and AI-answer
 * surface for the sponsor niche. Each guide is content, not a component:
 * the route at src/app/sponsors/guides/[slug] renders whatever it is
 * handed, and the same objects feed the sitemap, llms.txt and the JSON-LD
 * (Article + FAQPage + BreadcrumbList).
 *
 * Written answer-first on purpose. `answer` is one direct paragraph that
 * stands on its own as the reply to the title's question — it is the first
 * thing on the page and the text an AI engine is most likely to quote.
 * `takeaways` follow it, then the sections, then the FAQ.
 *
 * The sponsor page's compliance conventions apply here unchanged (see the
 * header of content/verticals/sponsors.ts): no Ascent results, every
 * figure attributed in `sources`, "appointment held", "investor lead",
 * "flat monthly fee", and nothing that reads as legal advice — the
 * regulatory sections describe the rules and send the reader to counsel.
 */

/** Inline text may carry [links](href) and **bold** — see RichText. */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption: string | null; head: string[]; rows: string[][] }
  /** A boxed aside — a definition, a rule, a worked example. */
  | { type: "callout"; title: string; text: string }
  /** One quotable sentence, set large. The line an answer engine lifts. */
  | { type: "quote"; text: string };

export interface GuideSection {
  /** Anchor id — stable, used in the on-page contents list. */
  id: string;
  h2: string;
  blocks: GuideBlock[];
}

export interface Guide {
  slug: string;
  /** The h1. A question or a plain statement of the topic. */
  title: string;
  /** <title>; the root layout appends " | Ascent". Keep under ~60 chars. */
  seoTitle: string;
  /** Meta description, ~150 chars. */
  description: string;
  /** Mono line above the h1 — the guide's category. */
  eyebrow: string;
  /** ISO dates. `updated` drives the sitemap lastmod — bump it on edits. */
  published: string;
  updated: string;
  /** The direct answer. One paragraph, no links, stands alone. */
  answer: string;
  takeaways: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Everything a figure or a rule in the text traces to. */
  sources: { label: string; url: string | null }[];
  /** Slugs of the guides linked at the end. */
  related: string[];
}
