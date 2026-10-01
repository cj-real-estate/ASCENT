/*
 * Which public site a lead came in on.
 *
 * One deployment answers both brands — ascentcas.com and
 * ascentforsponsors.com (growwithascent.com forwards to the latter) — and
 * every form posts to the same shared API routes. So the domain can't be a
 * constant: it has to be read off the request that carried the lead, or a
 * sponsor lead gets filed in the CRM under the contractor brand.
 *
 * Returns the canonical apex for the two production brands (www and the
 * forwarding domain fold in), and the bare host for anything else — a
 * Vercel preview or localhost — so a test lead is never mistaken for a
 * production one.
 */

const CANONICAL: ReadonlyArray<[suffix: string, site: string]> = [
  ["ascentforsponsors.com", "ascentforsponsors.com"],
  ["growwithascent.com", "ascentforsponsors.com"],
  ["ascentcas.com", "ascentcas.com"],
];

/** Fallback when no usable host header arrives. */
export const DEFAULT_LEAD_SITE = "ascentcas.com";

export function leadSiteFromRequest(request: Request): string {
  // Vercel sets x-forwarded-host to the domain the visitor actually used.
  const raw =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = raw.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
  if (!host) return DEFAULT_LEAD_SITE;
  for (const [suffix, site] of CANONICAL) {
    if (host === suffix || host.endsWith(`.${suffix}`)) return site;
  }
  return host;
}

/** The CRM "contact source" label for a lead from `site`. */
export function leadSourceLabel(site: string): string {
  return `Website — ${site}`;
}
