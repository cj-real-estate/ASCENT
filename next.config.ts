import type { NextConfig } from "next";

/*
 * ascentforsponsors.com is served by this same project. On that host the
 * root is the sponsor page, and robots/sitemap describe that domain only.
 * The guides, llms.txt and domain-specific privacy and terms pages are
 * rewritten the same way — the SMS consent box on this host's forms links
 * to /privacy and /terms, and both must resolve here. Everything else (the API route) is shared as-is. `beforeFiles`
 * so these win over the filesystem routes for "/", "/robots.txt" and
 * "/sitemap.xml" — on the sponsor host only; ascentcas.com is untouched.
 */
const SPONSOR_HOSTS = ["ascentforsponsors.com", "www.ascentforsponsors.com"];

const sponsorHostRewrites = SPONSOR_HOSTS.flatMap((host) => {
  const has = [{ type: "host" as const, value: host }];
  return [
    { source: "/", destination: "/sponsors", has },
    { source: "/robots.txt", destination: "/sponsors/robots.txt", has },
    { source: "/sitemap.xml", destination: "/sponsors/sitemap.xml", has },
    { source: "/llms.txt", destination: "/sponsors/llms.txt", has },
    { source: "/privacy", destination: "/sponsors/privacy", has },
    { source: "/terms", destination: "/sponsors/terms", has },
    { source: "/sms-opt-in", destination: "/sponsors/sms-opt-in", has },
    { source: "/guides", destination: "/sponsors/guides", has },
    { source: "/guides/:slug", destination: "/sponsors/guides/:slug", has },
  ];
});

/*
 * growwithascent.com forwards to the sponsor site, path and query intact,
 * as a permanent (308) redirect — so a link or a bookmark to
 * growwithascent.com/guides/x lands on the same guide, and search engines
 * consolidate the domain into ascentforsponsors.com rather than indexing
 * it as a copy.
 *
 * This only runs once the domain is attached to this Vercel project. The
 * intended setup is to attach it in Vercel as a REDIRECT domain pointed at
 * ascentforsponsors.com, in which case Vercel answers at the edge and this
 * never executes. It is here as the safety net for the other case: if the
 * domain is attached as an ordinary one, the host rewrites above do not
 * match it, and without this it would serve the contractor site under the
 * sponsor brand's domain. With it, either way of attaching the domain
 * produces the same result.
 */
const FORWARDED_HOSTS = ["growwithascent.com", "www.growwithascent.com"];
const FORWARD_TO = "https://ascentforsponsors.com";

const forwardedHostRedirects = FORWARDED_HOSTS.map((host) => ({
  source: "/:path*",
  has: [{ type: "host" as const, value: host }],
  destination: `${FORWARD_TO}/:path*`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return forwardedHostRedirects;
  },
  async rewrites() {
    return { beforeFiles: sponsorHostRewrites };
  },
};

export default nextConfig;
