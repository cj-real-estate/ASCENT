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
    { source: "/guides", destination: "/sponsors/guides", has },
    { source: "/guides/:slug", destination: "/sponsors/guides/:slug", has },
  ];
});

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: sponsorHostRewrites };
  },
};

export default nextConfig;
