import sponsors from "@content/verticals/sponsors";

/*
 * Sitemap served at ascentforsponsors.com/sitemap.xml (via the host rewrite
 * in next.config.ts). Lists only what is canonical on that host.
 */
export const dynamic = "force-static";

export function GET() {
  const base = sponsors.business.url;
  const lastmod = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>${base}/privacy</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
