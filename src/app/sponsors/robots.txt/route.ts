import sponsors from "@content/verticals/sponsors";

/*
 * robots.txt served at ascentforsponsors.com/robots.txt (via the host
 * rewrite in next.config.ts). One project serves both domains, so the
 * other verticals are reachable on this host too; they are kept out of the
 * index here so the sponsor domain indexes as one page.
 */
export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /thanks",
    "Disallow: /apply",
    "Disallow: /fence",
    "Disallow: /sponsors",
    "",
    `Sitemap: ${sponsors.business.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
