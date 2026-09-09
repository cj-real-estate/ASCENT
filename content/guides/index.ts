import type { Guide } from "./types";
import rule506bVs506c from "./506b-vs-506c-real-estate-marketing";
import findAccredited from "./how-to-find-accredited-investors-real-estate-syndication";
import costOfLeads from "./cost-per-investor-lead-506c-benchmarks";
import speedToLead from "./speed-to-lead-investor-acquisition";
import verification from "./accredited-investor-verification-506c";
import placementAgent from "./placement-agent-vs-flat-fee-investor-acquisition";
import glossary from "./investor-acquisition-glossary";

/*
 * Every published guide, in the order the index page lists them. The
 * sitemap, llms.txt, the guides section on the sponsor page and the
 * related-links block all derive from this array — register a guide here
 * and it is indexed everywhere.
 */
export const guides: Guide[] = [
  rule506bVs506c,
  findAccredited,
  costOfLeads,
  speedToLead,
  verification,
  placementAgent,
  glossary,
];

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** The most recent `updated` across the set — the index page's lastmod. */
export const guidesUpdated = guides
  .map((g) => g.updated)
  .sort()
  .at(-1) as string;

export type { Guide, GuideBlock, GuideSection } from "./types";
