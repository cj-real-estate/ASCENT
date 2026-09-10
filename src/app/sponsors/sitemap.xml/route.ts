import sponsors, { SPONSOR_PAGE_UPDATED } from "@content/verticals/sponsors";
import { guides, guidesUpdated } from "@content/guides";

/*
 * Sitemap served at ascentforsponsors.com/sitemap.xml (via the host rewrite
 * in next.config.ts). Lists only what is canonical on that host. lastmod
 * is the content's own date (SPONSOR_PAGE_UPDATED, each guide's `updated`)
 * rather than the build time, so a redeploy never claims every page
 * changed.
 */
export const dynamic = "force-static";

const PRIVACY_UPDATED = "2026-09-10";
/* The terms page, which carries the SMS program disclosures. */
const LEGAL_UPDATED = "2026-09-10";

export function GET() {
  const base = sponsors.business.url;
  const entry = (loc: string, lastmod: string, changefreq: string, priority: string) =>
    `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  entry(base, SPONSOR_PAGE_UPDATED, "weekly", "1"),
  entry(`${base}/guides`, guidesUpdated, "weekly", "0.8"),
  ...guides.map((g) => entry(`${base}/guides/${g.slug}`, g.updated, "monthly", "0.8")),
  entry(`${base}/privacy`, PRIVACY_UPDATED, "yearly", "0.3"),
  entry(`${base}/terms`, LEGAL_UPDATED, "yearly", "0.3"),
].join("\n")}
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
