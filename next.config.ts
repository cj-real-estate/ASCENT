import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The whole stylesheet is ~21KB; inlining it removes the only
    // render-blocking request and buys the LCP headroom the ≥95 mobile
    // performance floor needs.
    inlineCss: true,
  },
  // The fence page is the outbound-traffic page and lives at /fence.
  // If a previous deployment ever served the fence pitch at another path,
  // add a permanent redirect for it here so old links keep working, e.g.:
  //   { source: "/fencing", destination: "/fence", permanent: true },
  async redirects() {
    return [];
  },
};

export default nextConfig;
