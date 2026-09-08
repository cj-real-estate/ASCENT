import type { NextConfig } from "next";

/*
 * ascentforsponsors.com is served by this same project. On that host the
 * root is the sponsor page, and robots/sitemap describe that domain only.
 * Everything else (privacy, the API route) is shared as-is. `beforeFiles`
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
  ];
});

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: sponsorHostRewrites };
  },
};

export default nextConfig;
